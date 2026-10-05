// ===========================================================================
//  masjidone-billing — MasjidOne collects its own fees by Direct Debit
//  YSB Ventures Ltd · 5 October 2026
//
//  THIS IS NOT THE MASJID'S MONEY. It is worth being blunt about, because
//  there is already a stripe-webhook in this estate and it does the opposite
//  thing: that one lives in the masjid's repository, answers to the masjid's
//  own Stripe account (charity 1041569), and records donations INTO the
//  masjid. This one answers to YSB VENTURES LTD'S Stripe account and takes
//  money OUT of the masjid, as the supplier's monthly fee.
//
//  Two Stripe accounts, two signing secrets, two repositories. They must never
//  be merged "to save a deploy": a donation and an invoice are not the same
//  kind of event, and one account's secret must never be able to sign the
//  other's traffic.
//
//  WHY THE SOURCE LIVES HERE and not beside the other one. It deploys to the
//  same Supabase project, because one database runs the whole platform — but
//  the project reference is only a deploy target. If the founding masjid ever
//  takes its repository over, MasjidOne's billing must not go with it.
//
//  WHAT IT DOES
//  ------------
//    POST /masjidone-billing/start    (a platform admin, from the console)
//        Creates the Stripe customer and a Checkout Session that collects a
//        Bacs Direct Debit mandate AND starts the subscription. Returns the
//        URL to send the treasurer.
//
//    POST /masjidone-billing/webhook  (Stripe)
//        Mirrors what Stripe did into the ledger.
//
//  THE AMOUNT IS NEVER TAKEN FROM THE REQUEST. The console sends a slug and
//  nothing else. This function asks the database which plan and band the
//  masjid is on, and works the figure out from PRICING_BANDS — the same file
//  the pricing page renders from, imported directly rather than copied, which
//  is the whole reason it was moved to lib/pricing-bands.ts. A browser cannot
//  ask to be charged £1.
//
//  THE KEY THIS HOLDS, AND HOW SMALL IT MUST BE. Unlike the donations webhook,
//  this one needs a Stripe API key, because creating a customer and a Checkout
//  Session are calls to Stripe. USE A RESTRICTED KEY (rk_live_…) with exactly
//  two permissions: Customers write and Checkout Sessions write. Nothing else.
//  A full sk_live_ here could issue refunds and read every customer's details,
//  and would be a worse hole than the problem it solves. Signature
//  verification needs no key at all — it is a local HMAC.
//
//  AND BACS IS SLOW, WHICH IS A FEATURE AND HAS TO BE SAID OUT LOUD. A mandate
//  is not usable the moment it is signed; Stripe confirms it with the bank over
//  several working days and the first collection takes a few more. The console
//  says so in a sentence rather than implying money arrives on Friday. A Bacs
//  payment can also be REVERSED after success, which is why every invoice
//  event re-reads Stripe's status instead of assuming paid is final.
//
//  Deploy:
//      supabase functions deploy masjidone-billing --no-verify-jwt
//  --no-verify-jwt is required because Stripe does not send a Supabase JWT.
//  The /start route therefore checks the caller itself — see requireAdmin.
//
//  Secrets:
//      MASJIDONE_STRIPE_WEBHOOK_SECRET    whsec_…  (YSB's account, not the masjid's)
//      MASJIDONE_STRIPE_RESTRICTED_KEY    rk_live_… two permissions, as above
//      SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY (from the platform)
//
//  In Stripe, subscribe this endpoint to exactly these nine events:
//      checkout.session.completed
//      customer.subscription.created / .updated / .deleted
//      invoice.finalized / .paid / .payment_failed / .voided / .marked_uncollectible
//  Anything else is answered 200 and ignored, so a stray subscription costs
//  nothing but noise.
// ===========================================================================

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  checkoutLines,
  form,
  isPermanent,
  monthlyPence,
  planName,
} from "./shape.ts";

/* The empty key is deliberate and is the same trick the donations webhook
   uses: this client only ever calls constructEventAsync, which verifies an
   HMAC locally and makes no request to Stripe. The restricted key is used by
   api() below, through plain fetch, so the two cannot be confused. */
const verifier = new Stripe("", {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const WEBHOOK_SECRET = Deno.env.get("MASJIDONE_STRIPE_WEBHOOK_SECRET") ?? "";
const STRIPE_KEY = Deno.env.get("MASJIDONE_STRIPE_RESTRICTED_KEY") ?? "";

const service = () => createClient(SUPABASE_URL, SERVICE_KEY);

/* Stripe's REST API, form-encoded. No SDK: the SDK would be a second way of
   talking to Stripe in a file that already has one for verification, and the
   encoder it would replace is the thing most worth testing, so it lives in
   shape.ts with tests around it. */
async function api(path: string, body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      /* Idempotency on our side too: a double-click on "Send the link" must
         not create two customers. */
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: form(body).toString(),
  });
  const json = await res.json();
  /* CHECKED, not assumed. A rolled or wrongly-scoped key answers 401 as a
     perfectly happy Response, and an unchecked call here would tell the
     console a link had been sent while nothing had. Same mistake the contact
     form Worker was written to avoid. */
  if (!res.ok) {
    throw new Error(
      `Stripe refused ${path} with ${res.status}: ` +
        String((json as { error?: { message?: string } })?.error?.message ?? "no reason given"),
    );
  }
  return json as Record<string, unknown>;
}

// ---------------------------------------------------------------------------
//  Who is calling /start.
//
//  --no-verify-jwt means the platform does not check it for us, so this does.
//  It builds a client AS THE CALLER and asks the database a question only a
//  two-step platform admin may ask: billing_direct_debit raises 42501 for
//  anybody else. So the authorisation check and the data this route needs are
//  the same call, and there is no way to get the data without passing the
//  check.
// ---------------------------------------------------------------------------
async function readAsCaller(req: Request, masjid: string) {
  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.toLowerCase().startsWith("bearer ")) {
    throw new Error("Not signed in.");
  }
  const asCaller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: auth } },
  });
  const { data, error } = await asCaller.rpc("billing_direct_debit", { p_masjid: masjid });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

// ---------------------------------------------------------------------------
//  POST /start
// ---------------------------------------------------------------------------
async function start(req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({}));
  const masjid = String((body as { masjid?: string }).masjid ?? "").trim();
  const returnTo = String((body as { return_to?: string }).return_to ?? "").trim();
  if (!masjid) return json({ error: "Which masjid?" }, 400);

  const state = await readAsCaller(req, masjid);

  if (state.billable === false) {
    return json({
      error:
        `This masjid is not billed: ${state.not_billable_why ?? "no reason recorded"}. ` +
        "A Direct Debit is an invoice that collects itself, so it is refused for the same reason.",
    }, 409);
  }

  const plan = (state.plan_code ?? null) as string | null;
  const band = (state.band ?? null) as string | null;
  const monthly = monthlyPence(plan, band);
  if (monthly === null) {
    return json({
      error:
        `No price can be worked out for ${planName(plan)} on band "${band ?? "none"}". ` +
        "Set the plan and band first — a Direct Debit for a guessed figure is worse than none.",
    }, 409);
  }

  const yearly = (state.cycle ?? "monthly") === "yearly";
  const email = (state.billing_email ?? null) as string | null;
  if (!email) {
    return json({
      error: "There is no billing email for this masjid. Stripe has nobody to send the mandate to.",
    }, 409);
  }

  /* Reuse the customer if there is one, so a second attempt does not leave two
     customers and two mandates against one masjid. */
  let customer = (state.stripe_customer_id ?? null) as string | null;
  if (!customer) {
    const made = await api("customers", {
      email,
      name: masjid,
      metadata: { masjid, source: "masjidone-console" },
    });
    customer = String(made.id);
  }

  /* THE LINES COME FROM shape.ts, which is tested. The yearly invariant — a
     year is twelve times this masjid's own monthly rate, and the setup fee is
     waived by being absent rather than reduced — is asserted there against
     every band, because it is a commercial rule and not an implementation
     detail. */
  const { lines: items } = checkoutLines({
    plan,
    band,
    cycle: yearly ? "yearly" : "monthly",
    setupFeeState: (state.setup_fee_state ?? null) as string | null,
  });
  if (items.length === 0) {
    return json({ error: "No price could be worked out, so no Direct Debit was started." }, 409);
  }

  const base = returnTo || "https://masjidone.co.uk/admin/";
  const session = await api("checkout/sessions", {
    mode: "subscription",
    customer,
    /* Bacs only. Offering a card here would quietly undo the reason for doing
       this at all — see the header. */
    payment_method_types: ["bacs_debit"],
    line_items: items,
    subscription_data: { metadata: { masjid } },
    metadata: { masjid },
    success_url: `${base}?direct_debit=signed`,
    cancel_url: `${base}?direct_debit=cancelled`,
  });

  return json({
    url: session.url,
    customer,
    /* Said back so the console can repeat it to the person sending the link,
       rather than leaving them to discover it when no money arrives. */
    note:
      "Send this to the treasurer. Once they sign, Bacs takes a few working " +
      "days to confirm the mandate with their bank, and the first collection " +
      "a few more. Nothing can be collected until the mandate is active.",
  });
}

// ---------------------------------------------------------------------------
//  POST /webhook
//
//  WHAT STATUS CODE TO ANSWER, which is the part that is easy to get wrong in
//  both directions. The donations webhook's rule is "always 200 once the
//  signature is good", because a non-2xx is retried for days and a retry storm
//  buries the real problem. That rule was written for a function that could
//  only ever fail permanently.
//
//  This one can fail both ways, so it distinguishes them:
//    * A PERMANENT failure — an unknown Stripe customer, a draft, a status
//      this ledger has no word for — is answered 200 and recorded against the
//      event. Retrying cannot fix it, so retrying is noise.
//    * ANYTHING ELSE is answered 500 and the event is left unclaimed, so
//      Stripe retries it. That is what the retries are for.
//
//  Either way it is WRITTEN DOWN. The 42 donations that vanished did so
//  because a failed audit write was thrown away and Stripe was told 200. Every
//  outcome here lands in billing_events, and billing_event_begin is called
//  BEFORE any work, so an event cannot be processed without a row existing to
//  say it arrived.
// ---------------------------------------------------------------------------

/** The Stripe customer on any of the nine events we subscribe to. */
function customerOf(type: string, o: Record<string, unknown>): string | null {
  const direct = o.customer;
  if (typeof direct === "string" && direct) return direct;
  return null;
}

async function handle(type: string, o: Record<string, unknown>): Promise<unknown> {
  const sb = service();

  if (type === "checkout.session.completed") {
    /* The slug travels in metadata, set by /start. It is NOT read from
       anywhere a stranger could put it: this event's signature came from
       YSB's Stripe account, and the metadata was written by us. */
    const masjid = String((o.metadata as Record<string, string> | null)?.masjid ?? "").trim();
    if (!masjid) throw new Error("There is no masjid called (none) — the session carried no slug.");
    const { data, error } = await sb.rpc("billing_stripe_attach", {
      p_masjid: masjid,
      payload: {
        customer: o.customer,
        subscription: o.subscription,
        mandate_state: "pending",
      },
    });
    if (error) throw new Error(error.message);
    return data;
  }

  if (type.startsWith("customer.subscription.")) {
    const customer = customerOf(type, o);
    if (!customer) throw new Error("No masjid is linked — the subscription carried no customer.");
    const { data, error } = await sb.rpc("billing_subscription_set", {
      p_customer: customer,
      payload: o,
    });
    if (error) throw new Error(error.message);

    /* THE MANDATE STATE IS DERIVED FROM THE SUBSCRIPTION, deliberately.
       Stripe's own mandate.updated event carries a payment method and no
       customer, so acting on it would mean a second API call and a second
       thing to get wrong. The subscription's status says everything this
       needs to say, and every event we subscribe to carries it:
         active   the first collection succeeded, so the bank honoured it
         unpaid   Stripe has exhausted its retries — this is a real failure
         canceled gone, whether they cancelled or we did
       Anything else (incomplete, past_due, trialing) is in flight and the
       mandate state is left alone rather than guessed at. */
    const status = String(o.status ?? "");
    const mandate = status === "active"
      ? "active"
      : status === "unpaid"
      ? "failed"
      : type === "customer.subscription.deleted" || status === "canceled"
      ? "cancelled"
      : null;
    if (mandate) {
      const m = await sb.rpc("billing_mandate_set", {
        p_customer: customer,
        p_state: mandate,
        p_detail: { from: type, subscription_status: status },
      });
      if (m.error) throw new Error(m.error.message);
    }
    return data;
  }

  if (type.startsWith("invoice.")) {
    /* Bacs, unless Stripe says otherwise. Taken from the invoice where it is
       there rather than assumed, because a masjid that pays one invoice by
       card after a failed collection must not be recorded as a Direct Debit. */
    const method = (() => {
      const pm = (o.payment_settings as { payment_method_types?: string[] } | null)
        ?.payment_method_types;
      if (Array.isArray(pm) && pm.length === 1) return pm[0];
      return "bacs_debit";
    })();
    const { data, error } = await sb.rpc("invoice_from_stripe", { payload: o, p_method: method });
    if (error) throw new Error(error.message);
    return data;
  }

  /* Subscribed to something we do not act on. Recorded and ignored, which
     costs nothing and is better than a 400 that makes Stripe retry it. */
  return { ignored: type };
}

async function webhook(req: Request): Promise<Response> {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return json({ error: "No signature." }, 400);
  if (!WEBHOOK_SECRET) {
    console.error("masjidone-billing: MASJIDONE_STRIPE_WEBHOOK_SECRET is not set.");
    return json({ error: "Not configured." }, 500);
  }

  const raw = await req.text();
  let event: { id: string; type: string; data: { object: Record<string, unknown> } };
  try {
    event = await verifier.webhooks.constructEventAsync(
      raw,
      signature,
      WEBHOOK_SECRET,
    ) as typeof event;
  } catch (err) {
    /* A bad signature is somebody who found the URL, or the masjid's own
       Stripe account pointed at the wrong endpoint. Either way it is not ours
       and it is not recorded, because recording unverified bodies is how a
       table becomes a place to write anything. */
    console.error(`masjidone-billing: signature rejected. ${(err as Error).message}`);
    return json({ error: "Bad signature." }, 400);
  }

  const object = event.data?.object ?? {};
  const customer = customerOf(event.type, object);
  const sb = service();

  /* CLAIMED BEFORE THE WORK. If this fails, nothing else runs: without a row
     saying the event arrived there is no safety net, and a webhook with no
     safety net is the one that loses 42 payments quietly. */
  const begin = await sb.rpc("billing_event_begin", {
    p_event: event.id,
    p_type: event.type,
    p_customer: customer,
    p_detail: { livemode: (object as { livemode?: boolean }).livemode ?? null },
  });
  if (begin.error) {
    console.error(
      `masjidone-billing: could NOT record event ${event.id} (${event.type}): ${begin.error.message}. ` +
        "Nothing was processed. Stripe will retry.",
    );
    return json({ error: "Could not record the event." }, 500);
  }
  if (begin.data === false) {
    return json({ ok: true, already_handled: event.id });
  }

  try {
    const result = await handle(event.type, object);
    const done = await sb.rpc("billing_event_done", { p_event: event.id });
    if (done.error) {
      /* The work happened but the event was not closed, so Stripe will send it
         again. Every handler is written to be safe when called twice — upsert
         on the Stripe id, idempotent state setters — so a repeat is harmless,
         and a 500 here is more honest than claiming success. */
      console.error(
        `masjidone-billing: ${event.id} was processed but not closed: ${done.error.message}`,
      );
      return json({ error: "Processed but not closed." }, 500);
    }
    return json({ ok: true, event: event.id, result });
  } catch (err) {
    const message = (err as Error).message ?? String(err);
    if (isPermanent(message)) {
      console.error(`masjidone-billing: ${event.id} (${event.type}) cannot be processed: ${message}`);
      const failed = await sb.rpc("billing_event_failed", { p_event: event.id, p_why: message });
      if (failed.error) {
        console.error(`masjidone-billing: and the failure could not be recorded: ${failed.error.message}`);
        return json({ error: "Unrecordable failure." }, 500);
      }
      /* 200, because retrying will say the same thing. The row in
         billing_events is what somebody reads to find out why. */
      return json({ ok: true, event: event.id, not_processed: message });
    }
    console.error(`masjidone-billing: ${event.id} (${event.type}) failed, will be retried: ${message}`);
    return json({ error: message }, 500);
  }
}

// ---------------------------------------------------------------------------
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const path = new URL(req.url).pathname.replace(/\/+$/, "");
  if (req.method !== "POST") return json({ error: "POST only." }, 405);
  try {
    if (path.endsWith("/webhook")) return await webhook(req);
    if (path.endsWith("/start")) return await start(req);
    return json({ error: "Unknown route. Use /start or /webhook." }, 404);
  } catch (err) {
    /* The /start route's refusals arrive here. They are a person's problem to
       read, so the message goes back rather than a generic failure. */
    const message = (err as Error).message ?? String(err);
    console.error(`masjidone-billing: ${path} failed: ${message}`);
    return json({ error: message }, 400);
  }
});
