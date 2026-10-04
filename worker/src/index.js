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
 * WHAT IT COSTS, AND WHY IT IS NOT CLOUDFLARE EMAIL. This used to send through
 * Cloudflare's own send_email binding. That is now unreachable, for a reason
 * worth writing down so nobody tries it again: Cloudflare's docs say plainly
 * "You must be using Cloudflare DNS to use Email Service", and masjidone.co.uk
 * is entirely on One.com — domain, DNS and mail. Moving the DNS to Cloudflare
 * would cost One.com's automatic DKIM, which works today by itself. On top of
 * that, outbound Email Sending reads "Not available" on the Workers Free plan.
 *
 * So the Worker hands the message to Resend's REST API instead. Free tier,
 * 3,000 a month and 100 a day, which a contact form will not come near. The
 * Worker itself stays on the Workers free tier because it is now only HTTP —
 * no email binding, no paid plan.
 *
 * THE SENDING DOMAIN IS A SUBDOMAIN, DELIBERATELY. Resend verifies
 * send.masjidone.co.uk, not the root, and that is the whole safety property:
 * its SPF, DKIM and bounce records live on the subdomain, so they cannot
 * collide with the root SPF record or disturb the MX that One.com's mailboxes
 * depend on. Verifying the root would mean editing the root SPF, and two SPF
 * records on one name is a broken configuration, not a merged one.
 *
 * NOBODY ELSE KEEPS A COPY. This was the point of not using Formspree, and it
 * survives the change: Resend is a transmitter, not a dashboard somebody else
 * reads your enquiries out of. It is still a processor and the privacy notice
 * still names it — that part was never avoidable — but the enquiry lands in
 * our mailbox and lives there.
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
/* One entry per form this endpoint serves. Adding a form means adding a route
   here and nothing else — the validation, the honeypot, the rate limit, the
   size ceiling and the send are shared, so a second form cannot quietly end up
   with weaker defences than the first. */
const FORMS = {
  "/demo-request": {
    subject: (v) => `Demo request — ${v.masjid}${v.town ? `, ${v.town}` : ""}`,
    fields: [
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
    ],
  },
  /* Martyn's Law register of interest. Shorter, and with NO free-text field at
     all — not an oversight. The page tells a committee not to describe their
     building, its exits or its weaknesses, and the surest way to honour that
     is to give them nowhere to type it. A notes box here would collect exactly
     the material that belongs in a protection plan, in an email inbox. */
  "/martyns-law-interest": {
    subject: (v) => `Martyn's Law interest — ${v.masjid}${v.town ? `, ${v.town}` : ""}`,
    fields: [
      ["masjid", "Masjid", 120],
      ["town", "Town", 80],
      ["name", "Contact", 120],
      ["role", "Role", 80],
      ["email", "Email", 160],
      ["phone", "Phone", 40],
      ["peak", "Peak attendance", 40],
    ],
  },
};

/* Deliberately loose.
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
    const form_spec = Object.hasOwn(FORMS, url.pathname) ? FORMS[url.pathname] : null;
    if (!form_spec) {
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
    for (const [key, , cap] of form_spec.fields) {
      values[key] = String(form.get(key) ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, cap);
    }
    /* The textarea is the one field where line breaks carry meaning, so it is
       collapsed separately — runs of blank lines out, newlines kept.
       Only for forms that declare it: the Martyn's Law form has no free-text
       field on purpose, and re-reading one here would accept the very thing
       that form refuses to ask for. */
    if (form_spec.fields.some(([key]) => key === "message")) {
      values.message = String(form.get("message") ?? "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, 4000);
    }

    if (!values.masjid || !values.name || !looksLikeEmail(values.email)) {
      return json(
        { ok: false, error: "Please give the masjid, your name and an email address." },
        422,
        origin,
      );
    }

    const lines = form_spec.fields.map(([key, label]) =>
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

    const subject = form_spec.subject(values).slice(0, 160);

    /* AbortSignal, because a Worker has no implicit fetch timeout: without it
       a hung API call holds the request until the Worker's own wall clock
       kills it, and the visitor watches a spinner for the whole of it. Ten
       seconds is far longer than this call has ever needed. */
    let response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          /* A SECRET. Set with `wrangler secret put RESEND_API_KEY`, never in
             wrangler.toml — this repository is public and git history is
             permanent. If it is ever committed, roll it in Resend; deleting
             the commit does not unpublish it. */
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          from: `MasjidOne website <${env.SEND_FROM}>`,
          /* Neither address comes from the request, so nothing a visitor types
             can redirect the mail. The enquirer's own address goes in reply_to
             and nowhere else — putting it in `from` would be spoofing a domain
             we do not control, which fails Resend's own checks and burns
             sender reputation besides. Hitting Reply still reaches them. */
          to: [env.SEND_TO],
          reply_to: values.email,
          subject,
          text: [...lines, ...meta].join("\n"),
        }),
      });
    } catch (error) {
      /* The code, never the enquiry — Workers logs are not where a committee's
         details should end up. */
      console.error("send threw", error?.name, error?.message);
      return json(
        { ok: false, error: "That did not send. Please email us directly." },
        502,
        origin,
      );
    }

    /* fetch only rejects on a network failure. A 401 from a rolled key or a
       422 from an unverified domain arrives as a perfectly happy Response, so
       an unchecked call here would tell every visitor their enquiry was sent
       while nothing was. */
    if (!response.ok) {
      console.error("send failed", response.status);
      return json(
        { ok: false, error: "That did not send. Please email us directly." },
        502,
        origin,
      );
    }

    return json({ ok: true }, 200, origin);
  },
};
