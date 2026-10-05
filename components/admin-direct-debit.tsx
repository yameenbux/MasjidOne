"use client";

import * as React from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Direct Debit — the panel that saves somebody chasing a treasurer every month.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: promise money. Bacs is not a card. A
 * mandate signed this morning cannot collect this month — Stripe confirms it
 * with the bank over several working days, and the first collection takes a
 * few more. So this screen reports a STATE in a sentence rather than showing a
 * tick, and the database refuses to switch collection on until the mandate is
 * actually active. A screen that implied money was coming on Friday would be
 * the one thing worse than chasing: not chasing, and not being paid either.
 *
 * AND IT CANNOT NAME A PRICE. The amount is worked out by the edge function
 * from the plan and band, out of the same lib/pricing-bands.ts the pricing page
 * renders from. This component sends a slug and nothing else, so a tampered
 * browser cannot ask to be charged £1.
 *
 * It fails soft, like the panels beside it: PGRST202 means migration 141 has
 * not been applied here, which is a sentence rather than an error.
 */

const NOT_MIGRATED = "PGRST202";

/**
 * Where the edge function answers. Set NEXT_PUBLIC_BILLING_ENDPOINT as a
 * repository variable to the deployed function's URL, with no trailing slash:
 *   https://<project>.supabase.co/functions/v1/masjidone-billing
 * Empty means "not deployed yet", which this screen says out loud rather than
 * offering a button that cannot work.
 */
const BILLING_ENDPOINT = process.env.NEXT_PUBLIC_BILLING_ENDPOINT ?? "";

type State = {
  set_up: boolean;
  billable: boolean;
  not_billable_why: string | null;
  auto_bill: boolean;
  mandate_state: "none" | "pending" | "active" | "failed" | "cancelled";
  has_subscription: boolean;
  next_charge_on: string | null;
  cycle: string;
  billing_email: string | null;
  setup_fee_state: string | null;
  plan_code: string | null;
  band: string | null;
  where_it_stands: string;
  why?: string;
};

const MANDATE_WORD: Record<State["mandate_state"], string> = {
  none: "No mandate",
  pending: "Mandate pending",
  active: "Mandate live",
  failed: "Mandate failed",
  cancelled: "Mandate cancelled",
};

export function DirectDebit({ sb, slug }: { sb: SupabaseClient; slug: string }) {
  const [state, setState] = React.useState<State | null>(null);
  const [migrated, setMigrated] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [link, setLink] = React.useState<string | null>(null);
  const [note, setNote] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const { data, error: e } = await sb.rpc("billing_direct_debit", { p_masjid: slug });
    if (e) {
      if (e.code === NOT_MIGRATED) { setMigrated(false); return; }
      setError(e.message);
      return;
    }
    setState(data as State);
  }, [sb, slug]);

  React.useEffect(() => { void load(); }, [load]);

  async function setAuto(on: boolean) {
    setBusy(true); setError(null); setNote(null);
    let why: string | null = null;
    if (!on) {
      why = window.prompt(
        "Why is the Direct Debit being stopped? The next person needs to know whether to start it again.",
      );
      if (!why || !why.trim()) { setBusy(false); return; }
    }
    const { error: e } = await sb.rpc("billing_autobill_set", {
      p_masjid: slug, p_on: on, p_why: why,
    });
    setBusy(false);
    if (e) { setError(e.message); return; }
    setNote(on ? "Collecting monthly by Direct Debit." : "Direct Debit stopped.");
    await load();
  }

  async function makeLink() {
    setBusy(true); setError(null); setNote(null); setLink(null);
    try {
      const { data: s } = await sb.auth.getSession();
      const token = s.session?.access_token;
      if (!token) throw new Error("Not signed in.");
      const res = await fetch(`${BILLING_ENDPOINT}/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ masjid: slug, return_to: window.location.href }),
      });
      /* CHECKED, not assumed. A wrongly-scoped Stripe key answers as a
         perfectly happy Response, and an unchecked call here would show a
         link that leads nowhere. */
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.url) {
        throw new Error(String(body?.error ?? `The billing function answered ${res.status}.`));
      }
      setLink(String(body.url));
      setNote(String(body.note ?? ""));
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!migrated) {
    return (
      <p className="ops__note">
        <strong>Direct Debit is not switched on yet.</strong> Migration 141 is
        written and tested but has not been applied to the platform.
      </p>
    );
  }
  if (state === null) return <p className="ops__why">Loading Direct Debit…</p>;

  /* Not billed is said first and nothing else is offered. The founding masjid
     is contractually never invoiced, and a Direct Debit is an invoice that
     collects itself. */
  if (!state.billable) {
    return (
      <div className="ops__dd">
        <h4 className="ops__subh">Direct Debit</h4>
        <p className="ops__note" role="note">
          <strong>Not available.</strong> {state.where_it_stands}
        </p>
      </div>
    );
  }

  const canStart = state.mandate_state === "active" && state.has_subscription && !state.auto_bill;
  const needsPrice = !state.plan_code || !state.band;

  return (
    <div className="ops__dd">
      <h4 className="ops__subh">Direct Debit</h4>

      {error ? <p className="lsup__err" role="alert">{error}</p> : null}
      {note ? <p className="ops__ok" role="status">{note}</p> : null}

      <p className="ops__ddstate">
        <span className={state.auto_bill ? "ops__tag ops__tag--live" : "ops__tag"}>
          {state.auto_bill ? "Collecting" : "Not collecting"}
        </span>
        <span className="ops__tag">{MANDATE_WORD[state.mandate_state]}</span>
        {state.next_charge_on ? (
          <span className="ops__tag">Next charge {state.next_charge_on}</span>
        ) : null}
      </p>

      {/* The sentence is the point. "pending" on its own reads like a delay
          somebody caused, rather than how Bacs works. */}
      <p className="ops__why">{state.where_it_stands}</p>

      {needsPrice ? (
        <p className="ops__note" role="note">
          <strong>No plan and band yet.</strong> The amount is worked out from
          those, so nothing can be collected until they are set.
        </p>
      ) : null}

      {!BILLING_ENDPOINT ? (
        <p className="ops__note" role="note">
          <strong>The billing function is not deployed.</strong> Set{" "}
          <code>NEXT_PUBLIC_BILLING_ENDPOINT</code> to its URL once{" "}
          <code>supabase functions deploy masjidone-billing</code> has run.
          Until then a mandate cannot be collected from this screen.
        </p>
      ) : null}

      <p className="ops__acts">
        <button
          type="button"
          className="btn"
          disabled={busy || needsPrice || !BILLING_ENDPOINT || !state.billing_email}
          title={
            !state.billing_email
              ? "There is no billing email, so Stripe has nobody to send the mandate to"
              : undefined
          }
          onClick={() => void makeLink()}
        >
          <span className="btn__t">
            {state.set_up ? "New Direct Debit link" : "Send the Direct Debit link"}
          </span>
        </button>

        {canStart ? (
          <button type="button" className="btn btn--solid" disabled={busy}
                  onClick={() => void setAuto(true)}>
            <span className="btn__t">Start collecting</span>
          </button>
        ) : null}

        {state.auto_bill ? (
          <button type="button" className="btn" disabled={busy}
                  onClick={() => void setAuto(false)}>
            <span className="btn__t">Stop collecting</span>
          </button>
        ) : null}
      </p>

      {link ? (
        <p className="ops__ddlink">
          <strong>Send this to the treasurer:</strong>{" "}
          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </p>
      ) : null}
    </div>
  );
}
