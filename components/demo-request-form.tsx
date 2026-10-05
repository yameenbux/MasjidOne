"use client";

import * as React from "react";
import { BASE_PATH, CONTACT_EMAIL, FORM_ENDPOINT } from "@/lib/site";

/**
 * The demo request form — the one conversion on the site.
 *
 * Three things govern its shape, and all three are deliberate.
 *
 * 1. IT IS NOT A "CONTACT US" BOX. Nobody buys this without a meeting, so the
 *    form's job is to book one and to arrive knowing enough to walk into it
 *    prepared: which masjid, who is asking and in what capacity, which half of
 *    the system they care about, how big the madrasah is, and when they would
 *    switch. Every field below either changes what you demo or changes when you
 *    follow up. A field that did neither has been left off.
 *
 * 2. IT WORKS WITH JAVASCRIPT OFF. The <form> carries a real action and method,
 *    so a submit without JS still goes somewhere. JS only upgrades it to submit
 *    in place and show the reply inline.
 *
 * 3. NO CAPTCHA. reCAPTCHA is a Google tracker and would need a cookie banner,
 *    which CLAUDE.md rules out. Spam is held off with a honeypot field and
 *    whatever filtering the endpoint does, which at this volume is plenty.
 *
 * Deliberately NOT asked: anything about a child. A committee member filling in
 * a public web form must never be invited to type a pupil's name, so the free
 * text box says so explicitly.
 */

type Status = "idle" | "sending" | "sent" | "error";

const ROLES = [
  "Trustee or committee member",
  "Imam",
  "Madrasah head or secretary",
  "Teacher",
  "Something else",
];

/** Which half they are actually shopping for — it decides the price and the demo. */
const INTEREST = [
  "The madrasah — registers, fees, families",
  "The congregation — app, screens, giving",
  "Both, on one system",
  "Not sure yet",
];

/** Ranges rather than a number: less to think about, and nothing to get wrong. */
const SIZES = ["Under 50", "50–150", "150–300", "300–600", "Over 600", "No madrasah"];

/**
 * Madrasahs change systems between terms, not mid-year, so this field is the
 * pipeline date rather than a politeness.
 */
const TIMING = [
  "As soon as it can be arranged",
  "Before the next term",
  "Next academic year",
  "Just looking for now",
];

/** Field name -> the label used in the email body, in the order you want to read it. */
const SUMMARY_ORDER: ReadonlyArray<readonly [string, string]> = [
  ["masjid", "Masjid"],
  ["town", "Town"],
  ["name", "Contact"],
  ["role", "Role"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["interest", "Interested in"],
  ["pupils", "Pupils"],
  ["timing", "Timing"],
  ["message", "Notes"],
];

/** The body of the fallback email, as a human would want to read it. */
function summarise(data: FormData): string {
  const lines = SUMMARY_ORDER.map(([key, label]) => {
    const value = String(data.get(key) ?? "").trim();
    return value ? `${label}: ${value}` : null;
  }).filter(Boolean);
  return lines.join("\n");
}

export function DemoRequestForm({ idPrefix = "dr" }: { idPrefix?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string>("");

  /* No endpoint chosen yet, so a submit has to go to the visitor's own mail
     client. Kept as the form's real `action` too, so this is also what happens
     with JS off. */
  const mailtoAction = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "MasjidOne demo request",
  )}`;
  const action = FORM_ENDPOINT || mailtoAction;
  const id = (suffix: string) => `${idPrefix}-${suffix}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);

    /* A bot filled the hidden field. Swallow it silently — telling it it failed
       only teaches it what to do differently next time. */
    if (String(data.get("_gotcha") ?? "")) {
      event.preventDefault();
      setStatus("sent");
      return;
    }

    if (!FORM_ENDPOINT) {
      /* Let the browser hand it to the mail client, but prefill a readable body
         first so the whole request is carried rather than an empty message.
         Kept well under the ~2,000 character ceiling some mail clients impose. */
      event.preventDefault();
      const body = summarise(data).slice(0, 1400);
      window.location.href = `${mailtoAction}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError(
        "That did not send. Please email us directly and we will pick it up from there.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="cform__done" role="status">
        <p className="cform__donehead">Thank you — that has reached us.</p>
        <p>
          {FORM_ENDPOINT ? (
            <>
              We reply to every request within one working day, from a person
              rather than an autoresponder. If it is urgent, ring instead.
            </>
          ) : (
            <>
              Your email client should have opened with the details filled in.
              It is not sent until you press send there — if nothing opened,
              write to us directly at{" "}
              <a href={mailtoAction}>{CONTACT_EMAIL}</a>.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form
      className="cform"
      action={action}
      method="POST"
      onSubmit={onSubmit}
      noValidate={false}
    >
      {/* Named _gotcha because that is the convention most form endpoints already
          recognise and drop server-side. Hidden from sight and from assistive
          technology, so only a bot ever fills it. */}
      <p className="cform__pot" aria-hidden="true">
        <label htmlFor={id("gotcha")}>Leave this field empty</label>
        <input id={id("gotcha")} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </p>

      <input type="hidden" name="_subject" value="MasjidOne demo request" />

      <div className="cform__grid">
        <p className="cform__field">
          <label htmlFor={id("masjid")}>
            Masjid <abbr title="required">*</abbr>
          </label>
          <input id={id("masjid")} name="masjid" type="text" required
            autoComplete="organization" placeholder="Your masjid&apos;s name" />
        </p>

        <p className="cform__field">
          <label htmlFor={id("town")}>
            Town or city <abbr title="required">*</abbr>
          </label>
          <input id={id("town")} name="town" type="text" required
            autoComplete="address-level2" placeholder="Bolton" />
        </p>

        <p className="cform__field">
          <label htmlFor={id("name")}>
            Your name <abbr title="required">*</abbr>
          </label>
          <input id={id("name")} name="name" type="text" required autoComplete="name" />
        </p>

        <p className="cform__field">
          <label htmlFor={id("role")}>Your role</label>
          <select id={id("role")} name="role" defaultValue="">
            <option value="">Prefer not to say</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </p>

        <p className="cform__field">
          <label htmlFor={id("email")}>
            Email <abbr title="required">*</abbr>
          </label>
          <input id={id("email")} name="email" type="email" required
            autoComplete="email" inputMode="email" />
        </p>

        <p className="cform__field">
          <label htmlFor={id("phone")}>Phone</label>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel"
            inputMode="tel" />
          <span className="cform__hint">If you would rather we rang.</span>
        </p>

        <p className="cform__field cform__field--wide">
          <label htmlFor={id("interest")}>What are you looking at?</label>
          <select id={id("interest")} name="interest" defaultValue="">
            <option value="">Prefer not to say</option>
            {INTEREST.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </p>

        <p className="cform__field">
          <label htmlFor={id("pupils")}>Roughly how many pupils?</label>
          <select id={id("pupils")} name="pupils" defaultValue="">
            <option value="">Prefer not to say</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="cform__hint">The price does not change with size. It tells us how much setting up involves.</span>
        </p>

        <p className="cform__field">
          <label htmlFor={id("timing")}>When would you want to start?</label>
          <select id={id("timing")} name="timing" defaultValue="">
            <option value="">Prefer not to say</option>
            {TIMING.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </p>

        <p className="cform__field cform__field--wide">
          <label htmlFor={id("message")}>Anything else we should know?</label>
          <textarea id={id("message")} name="message" rows={4}
            placeholder="What you run now, what is not working, who needs to be in the meeting." />
          <span className="cform__hint">
            Please do not include any pupil&rsquo;s details here — this is an
            ordinary web form and it is not the place for a child&rsquo;s record.
          </span>
        </p>
      </div>

      {status === "error" ? (
        <p className="cform__error" role="alert">
          {error} <a href={mailtoAction}>{CONTACT_EMAIL}</a>
        </p>
      ) : null}

      <div className="cform__actions">
        {/* The label MUST be wrapped in .btn__t. The .btn fill is a ::before
            circle that scales up on hover; without the span the label has no
            stacking context, so the fill paints over it and the button reads
            blank at the exact moment somebody is about to press it. */}
        <button className="btn" type="submit" disabled={status === "sending"}>
          <span className="btn__t">
            {status === "sending" ? "Sending…" : "Request a demo"}
          </span>
        </button>
        <p className="cform__legal">
          We use what you send here to arrange and prepare for a demonstration,
          and for nothing else. No mailing list, and your details are not passed
          on. See the <a href={`${BASE_PATH}/privacy/`}>privacy notice</a>.
        </p>
      </div>
    </form>
  );
}
