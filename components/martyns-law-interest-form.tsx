"use client";

import * as React from "react";
import { CONTACT_EMAIL, INTEREST_ENDPOINT } from "@/lib/site";

/**
 * The Martyn's Law register-of-interest form.
 *
 * WHY THIS IS NOT DemoRequestForm WITH A PROP. That form is the only working
 * route a committee has to reach us, and it carries the mailto fallback the
 * privacy notice describes. Generalising it to serve two pages would put the
 * live enquiry path one refactor away from a regression for the sake of
 * sharing eighty lines. It shares the CSS and the shape instead.
 *
 * It asks LESS than the demo form on purpose. Nobody registering interest in a
 * thing that does not exist yet should be made to fill in nine fields; the
 * only answer that changes what we build is the peak-attendance band, because
 * that decides whether a masjid is in scope at all.
 *
 * Deliberately NOT asked: anything about the building, its layout, its exits
 * or its weaknesses. That is the substance of a protection plan, it is the
 * last thing that should be typed into a public web form, and the page says so
 * where somebody might be tempted.
 */

type Status = "idle" | "sending" | "sent" | "error";

const ROLES = [
  "Trustee or committee member",
  "Imam",
  "Madrasah head or secretary",
  "Caretaker or facilities",
  "Something else",
];

/**
 * Bands rather than a number. A committee does not know its peak attendance to
 * the person, and the only threshold that matters is whether 200 may be
 * present at once — so the bands are drawn around that, not around tidy
 * hundreds.
 */
const PEAK = [
  "Under 100",
  "100 to 200",
  "200 to 300",
  "300 to 500",
  "500 to 800",
  "Over 800",
  "Not sure",
];

/** Field name → the label in the email body, in the order it reads best. */
const SUMMARY_ORDER: ReadonlyArray<readonly [string, string]> = [
  ["masjid", "Masjid"],
  ["town", "Town"],
  ["name", "Contact"],
  ["role", "Role"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["peak", "Peak attendance"],
];

function summarise(data: FormData): string {
  return SUMMARY_ORDER.map(([key, label]) => {
    const value = String(data.get(key) ?? "").trim();
    return value ? `${label}: ${value}` : null;
  })
    .filter(Boolean)
    .join("\n");
}

export function MartynsLawInterestForm({ idPrefix = "ml" }: { idPrefix?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string>("");

  const mailtoAction = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Martyn's Law — register of interest",
  )}`;
  const action = INTEREST_ENDPOINT || mailtoAction;
  const id = (suffix: string) => `${idPrefix}-${suffix}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);

    /* A bot filled the hidden field. Swallow it silently — telling it it
       failed only teaches it what to do differently next time. */
    if (String(data.get("_gotcha") ?? "")) {
      event.preventDefault();
      setStatus("sent");
      return;
    }

    if (!INTEREST_ENDPOINT) {
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
      const response = await fetch(INTEREST_ENDPOINT, {
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
        "That did not send. Please email us directly and we will add you to the list.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="cform__done" role="status">
        <p className="cform__donehead">Thank you — you are on the list.</p>
        <p>
          {INTEREST_ENDPOINT ? (
            <>
              We will write to you when the tools are ready to look at, and not
              before. No newsletter, and nothing passed on.
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
      method="post"
      onSubmit={onSubmit}
      noValidate
    >
      {/* The honeypot. Hidden from people by CSS and from screen readers by
          aria-hidden, so only a bot ever fills it. */}
      <p className="cform__pot" aria-hidden="true">
        <label htmlFor={id("gotcha")}>Leave this field empty</label>
        <input id={id("gotcha")} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </p>

      <input type="hidden" name="_subject" value="Martyn's Law — register of interest" />

      <div className="cform__grid">
        <p className="cform__field">
          <label htmlFor={id("masjid")}>Masjid <span aria-hidden="true">*</span></label>
          <input id={id("masjid")} name="masjid" type="text" required autoComplete="organization" />
        </p>
        <p className="cform__field">
          <label htmlFor={id("town")}>Town or city <span aria-hidden="true">*</span></label>
          <input id={id("town")} name="town" type="text" required autoComplete="address-level2" />
        </p>
        <p className="cform__field">
          <label htmlFor={id("name")}>Your name <span aria-hidden="true">*</span></label>
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
          <label htmlFor={id("email")}>Email <span aria-hidden="true">*</span></label>
          <input id={id("email")} name="email" type="email" required autoComplete="email" />
        </p>
        <p className="cform__field">
          <label htmlFor={id("phone")}>Phone</label>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" />
          <span className="cform__hint">Optional, if you would rather we rang.</span>
        </p>
      </div>

      <p className="cform__field">
        <label htmlFor={id("peak")}>Roughly how many people at your busiest time?</label>
        <select id={id("peak")} name="peak" defaultValue="">
          <option value="">Prefer not to say</option>
          {PEAK.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <span className="cform__hint">
          Jumuʿah or an Eid jamāʿah, usually. The standard tier starts at 200
          people, so this tells us whether the Act applies to you at all. A
          rough figure is fine.
        </span>
      </p>

      <p className="cform__note">
        Please do not describe your building, its exits or anything you are
        worried about here. That belongs in your plan, not in a web form.
      </p>

      <button className="btn btn--solid cform__send" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Register your interest"}
      </button>

      {status === "error" ? (
        <p className="cform__err" role="alert">
          {error} <a href={mailtoAction}>{CONTACT_EMAIL}</a>
        </p>
      ) : null}

      <p className="cform__privacy">
        We use what you send here to tell you when the Martyn&rsquo;s Law tools
        are ready, and for nothing else. No mailing list, and your details are
        not passed on.
      </p>
    </form>
  );
}
