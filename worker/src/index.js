/**
 * The MasjidOne demo-request endpoint.
 *
 * WHY THIS EXISTS RATHER THAN FORMSPREE. The alternative was a third-party form
 * processor: minutes of work, and a company that then has to be named in the
 * privacy notice as a processor of everything a mosque committee types into the
 * form. This runs on our own Cloudflare account, inside the same zone that
 * already serves the site, and nothing a committee writes is handled by anybody
 * we would have to name. The privacy notice says exactly that, and it is only
 * true for as long as this stays the endpoint.
 *
 * WHAT IT COSTS. Nothing, and that is a documented property rather than a
 * hopeful one: Cloudflare charges for outbound email to arbitrary recipients,
 * but sending to a VERIFIED DESTINATION ADDRESS on your own account is free on
 * every plan and does not touch the monthly quota. A contact form sends to one
 * address — ours. So the send_email binding below is pinned to that single
 * destination with `destination_address`, which both keeps it free and means a
 * mistake in this file cannot mail anybody else. Do not widen it to
 * `allowed_destination_addresses` without knowing you have changed the bill.
 *
 * THE ENQUIRER'S ADDRESS GOES IN Reply-To, NEVER IN From. From must stay on our
 * own verified domain or the send is rejected (E_SENDER_NOT_VERIFIED), and
 * spoofing the sender is what gets a domain's reputation burned. Hitting Reply
 * in the mail client still reaches the committee.
 *
 * NO CAPTCHA, deliberately — reCAPTCHA is a Google tracker and would bring back
 * the cookie banner this site exists without. The defences are a honeypot, a
 * rate limit on the IP, a body-size ceiling and per-field caps.
 */

/** Only these origins may post. */
const ALLOWED_ORIGINS = [
  "https://masjidone.co.uk",
  "https://www.masjidone.co.uk",
];

/** Bigger than any honest submission of this form, smaller than an attack. */
const MAX_BODY = 32 * 1024;

/**
 * The fields, in the order they read in the email, with the cap each one is
 * truncated to. The order matches SUMMARY_ORDER in components/demo-request-form.tsx
 * so the mailto: fallback and the posted version read identically — somebody
 * comparing the two should not have to work out whether they are the same form.
 */
const FIELDS = [
  ["masjid", "Masjid", 120],
  ["town", "Town", 80],
  ["name", "Contact", 120],
  ["role", "Role", 80],
  ["email", "Email", 160],
  ["phone", "Phone", 40],
  ["interest", "Interested in", 120],
  ["pupils", "Pupils", 40],
  ["timing", "Timing", 120],
  ["message", "Notes", 4000],
];

/* Deliberately loose. This is a form, not a registration system: the cost of
   rejecting a real committee's unusual address is a lost sale, and the cost of
   accepting a junk one is a line in an email we were going to read anyway. */
function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, origin);
    }
    if (url.pathname !== "/demo-request") {
      return json({ ok: false, error: "Not found" }, 404, origin);
    }

    /* An Origin check is hygiene, not security — anything that is not a browser
       can send whatever Origin it likes. It is here to stop another site
       quietly pointing its own form at this endpoint, and the rate limit below
       is what actually holds. */
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ ok: false, error: "Not allowed" }, 403, origin);
    }

    /* A misconfigured deploy should say so here rather than accept the form,
       drop it, and tell the visitor to email instead — which is the failure
       nobody notices because it looks like nobody enquired. */
    if (!env.SEND_TO || !env.SEND_FROM) {
      console.error("SEND_TO or SEND_FROM is not set — see worker/README.md");
      return json(
        { ok: false, error: "That did not send. Please email us directly." },
        503,
        origin,
      );
    }

    const length = Number(request.headers.get("Content-Length") ?? 0);
    if (length > MAX_BODY) {
      return json({ ok: false, error: "That is too long to send." }, 413, origin);
    }

    /* Per-IP, so one person hammering the form cannot spend the day's quota or
       fill the inbox. Keyed on the connecting IP rather than anything in the
       form, because everything in the form is attacker-controlled. */
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.RATE_LIMIT.limit({ key: ip });
    if (!success) {
      return json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        429,
        origin,
      );
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ ok: false, error: "That did not arrive as a form." }, 400, origin);
    }

    /* The honeypot. A bot fills every field it finds, including the one hidden
       from people. Answer 200 rather than 403: a bot told it failed tries
       again with the field left blank, and a bot told it succeeded goes away. */
    if (String(form.get("_gotcha") ?? "").trim() !== "") {
      return json({ ok: true }, 200, origin);
    }

    const values = {};
    for (const [key, , cap] of FIELDS) {
      values[key] = String(form.get(key) ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, cap);
    }
    /* The textarea is the one field where line breaks carry meaning, so it is
       collapsed separately — runs of blank lines out, newlines kept. */
    values.message = String(form.get("message") ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 4000);

    if (!values.masjid || !values.name || !looksLikeEmail(values.email)) {
      return json(
        { ok: false, error: "Please give the masjid, your name and an email address." },
        422,
        origin,
      );
    }

    const lines = FIELDS.map(([key, label]) =>
      values[key] ? `${label}: ${values[key]}` : null,
    ).filter(Boolean);

    /* Where it came from, kept out of the body the enquirer controls so a
       pasted "Submitted: ..." line cannot be mistaken for this one. */
    const meta = [
      "",
      "—",
      `Submitted: ${new Date().toISOString()}`,
      `Country: ${request.headers.get("CF-IPCountry") ?? "unknown"}`,
    ];

    const subject = `Demo request — ${values.masjid}${
      values.town ? `, ${values.town}` : ""
    }`.slice(0, 160);

    try {
      await env.EMAIL.send({
        from: { email: env.SEND_FROM, name: "MasjidOne website" },
        /* PASSED EXPLICITLY, and it has to be. Cloudflare's send-bindings
           documentation says that calling send() with `to` null or undefined
           uses the binding's configured destination_address. It does not: the
           runtime reads `.email` off whatever you pass and throws a TypeError
           when that is undefined. Found by running it, not by reading it.

           So SEND_TO carries the address and destination_address in
           wrangler.toml must hold the SAME one — the var is what we ask for,
           the binding is what Cloudflare will permit. Neither comes from the
           request, so nothing a visitor types can redirect the mail. */
        to: env.SEND_TO,
        replyTo: { email: values.email, name: values.name },
        subject,
        text: [...lines, ...meta].join("\n"),
      });
    } catch (error) {
      /* The code and message, never the enquiry — Workers logs are not where a
         committee's details should end up. */
      console.error("send failed", error?.code, error?.message);
      return json(
        { ok: false, error: "That did not send. Please email us directly." },
        502,
        origin,
      );
    }

    return json({ ok: true }, 200, origin);
  },
};
