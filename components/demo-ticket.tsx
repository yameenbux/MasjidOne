"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { BrandMark } from "@/components/ui/brand-mark";
import { DEMO_MASJID_DEFAULT } from "@/lib/demo-data";

/**
 * "Having issues? Log a ticket" — the screen that link now opens.
 *
 * WHY IT EXISTS. The footer of every portal screen offers to log a ticket, and
 * the offer pointed at a mailto: aimed at CONTACT_EMAIL, which is still the
 * placeholder address. So the one control on the demo meant for a committee
 * that is stuck opened an empty mail window addressed to nowhere. A support
 * promise that fails at the first click is worse than no support promise.
 *
 * WHY IT IS A SCREEN AND NOT AN ADDRESS. The support console lists masajid with
 * an Enter button and, until now, no reason attached to any of them — it showed
 * that we can get into a masjid's system without showing why we ever would. The
 * ticket is the why. It names the masjid, so the person who picks it up is not
 * guessing which system to open, and it asks outright whether we may sign in.
 * An email cannot ask that question and cannot record the answer.
 *
 * THE CONSENT BOX IS NOT A PERMISSION GATE. is_platform_admin() decides who may
 * enter and set_current_masjid() writes `masjidone_support_access` into the
 * masjid's own audit either way. The box records whether the committee asked us
 * to look, so the queue can show the difference between an entry that was
 * invited and one that was merely allowed. Do not reword it into a claim that
 * ticking it is what grants access, or that leaving it clear prevents it.
 *
 * NOT THE SAME THING as the Requests tab in the masjid office — that is the
 * congregation asking the committee for a hall or a nikah. This runs the other
 * way, from the committee to us.
 *
 * Sample data, like every other door under /demo/. Nothing is sent anywhere;
 * the reference is generated in the browser and forgotten on reload.
 */

const ABOUT = [
  "A screen in the building",
  "Registers or attendance",
  "Fees and payments",
  "Parent access",
  "The app and notifications",
  "Prayer times and the timetable",
  "Something else",
] as const;

const URGENCY = [
  { key: "stops", label: "It stops us", hint: "Nothing can be done until it is fixed." },
  { key: "slows", label: "It slows us down", hint: "There is a way round it for now." },
  { key: "ask", label: "It is a question", hint: "Nothing is broken." },
] as const;

const ROLES = [
  "Committee member",
  "Madrasah administrator",
  "Imām",
  "Teacher",
  "Caretaker",
  "Treasurer",
] as const;

/** A plausible reference, in the same shape as the ones on the queue. */
function newRef() {
  return `T-${4472 + Math.floor(Math.random() * 28)}`;
}

export function DemoTicket() {
  const [masjid, setMasjid] = React.useState(DEMO_MASJID_DEFAULT);
  const [sent, setSent] = React.useState<null | { ref: string; mayEnter: boolean }>(null);
  const [about, setAbout] = React.useState<string>(ABOUT[0]);
  const [urgency, setUrgency] = React.useState<string>("slows");
  const [mayEnter, setMayEnter] = React.useState(true);
  const [detail, setDetail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const doneRef = React.useRef<HTMLDivElement>(null);

  /* The masjid's name arrives the same way it does on every other door, so a
     committee shown the demo sees their own name here too. Read after mount,
     not during render, because the export is prerendered and the query string
     does not exist at build time. */
  React.useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("masjid");
    if (raw) {
      const name = raw.replace(/\s+/g, " ").trim().slice(0, 48);
      if (name) setMasjid(name);
    }
  }, []);

  /* Sending replaces the form, so focus has to be moved by hand or a screen
     reader is left announcing a form that is no longer on the page. */
  React.useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (detail.trim().length < 10) {
      setError("Tell us what has happened — a line or two is enough.");
      return;
    }
    setError(null);
    setSent({ ref: newRef(), mayEnter });
  }

  return (
    <div className="dtkt">
      <header className="dtkt__top">
        <div className="dtkt__brand">
          <BrandMark className="dtkt__mark" />
          <div>
            <p className="dtkt__eyebrow">MasjidOne support</p>
            <h1 className="dtkt__h">Tell us what is wrong</h1>
          </div>
        </div>
        <a className="dtkt__back" href="../">
          <span aria-hidden="true">←</span> Back to {masjid}
        </a>
      </header>

      <div className="dtkt__body">
        {sent ? (
          <div className="dtkt__done" tabIndex={-1} ref={doneRef}>
            <p className="dtkt__ref">{sent.ref}</p>
            <h2 className="dtkt__doneH">That is with us.</h2>
            <p className="dtkt__doneP">
              It is on our queue against <strong>{masjid}</strong>, with the
              reference above. Somebody picks it up from there — no part of it
              goes to an inbox and waits to be noticed.
            </p>
            <p className="dtkt__doneP">
              {sent.mayEnter ? (
                <>
                  You have said we may sign into your system to look. When we
                  do, <strong>your own audit trail records it</strong> —
                  our name and the time, in your log, where you can see it
                  without asking us.
                </>
              ) : (
                <>
                  You have not asked us to sign in, so the queue shows this one
                  as look-but-do-not-enter. If it turns out we cannot answer it
                  from the outside we will come back and ask first.
                </>
              )}
            </p>
            <p className="dtkt__small">
              Demonstration — nothing was sent, and the reference is invented.
            </p>
            <button
              type="button"
              className="dtkt__again"
              onClick={() => {
                setSent(null);
                setDetail("");
              }}
            >
              Log another
            </button>
          </div>
        ) : (
          <form className="dtkt__form" onSubmit={submit} noValidate>
            <p className="dtkt__lede">
              This comes to MasjidOne, not to your own committee. Hall bookings,
              nikah requests and anything else from your congregation stay in
              the masjid office — this is for when the software itself is in the
              way.
            </p>

            <div className="dtkt__row">
              <label className="dtkt__f">
                <span className="dtkt__lab">Which masjid</span>
                <input
                  className="dtkt__in"
                  value={masjid}
                  onChange={(e) => setMasjid(e.target.value)}
                  autoComplete="organization"
                />
              </label>
              <label className="dtkt__f">
                <span className="dtkt__lab">Your name</span>
                <input className="dtkt__in" autoComplete="name" />
              </label>
            </div>

            <div className="dtkt__row">
              <label className="dtkt__f">
                <span className="dtkt__lab">Your role</span>
                <select className="dtkt__in" defaultValue={ROLES[0]}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="dtkt__f">
                <span className="dtkt__lab">What is it about</span>
                <select
                  className="dtkt__in"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                >
                  {ABOUT.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset className="dtkt__fs">
              <legend className="dtkt__lab">How much is it holding you up</legend>
              <div className="dtkt__urg">
                {URGENCY.map((u) => (
                  <label
                    key={u.key}
                    className={`dtkt__opt${urgency === u.key ? " is-on" : ""}`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={u.key}
                      checked={urgency === u.key}
                      onChange={() => setUrgency(u.key)}
                    />
                    <span className="dtkt__optT">{u.label}</span>
                    <span className="dtkt__optH">{u.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="dtkt__f">
              <span className="dtkt__lab">What has happened</span>
              <textarea
                className="dtkt__in dtkt__ta"
                rows={5}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="What you did, what you expected, and what happened instead."
              />
            </label>
            {/* Said once, here, because the field invites exactly the paste we
                do not want. Everything else on this site tells a committee the
                same thing; a support form that stayed quiet about it would be
                where the first real child's name arrives. */}
            <p className="dtkt__warn">
              Please do not type a child&apos;s name, a family&apos;s balance or
              anybody&apos;s phone number in here. A class name or a household
              number is enough for us to find it.
            </p>

            <div className="dtkt__row">
              <label className="dtkt__f">
                <span className="dtkt__lab">Email to reply to</span>
                <input className="dtkt__in" type="email" autoComplete="email" />
              </label>
              <label className="dtkt__f">
                <span className="dtkt__lab">Phone, if it is urgent</span>
                <input className="dtkt__in" type="tel" autoComplete="tel" />
              </label>
            </div>

            <label className="dtkt__consent">
              <input
                type="checkbox"
                checked={mayEnter}
                onChange={(e) => setMayEnter(e.target.checked)}
              />
              <span>
                <strong>You may sign into our system to look.</strong> We know
                this writes a line into our own audit trail with your name and
                the time, and that we can read it whenever we like. Leave it
                clear and we will ask before anybody opens anything.
              </span>
            </label>

            {error ? (
              <p className="dtkt__err" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="dtkt__send">
              Send to MasjidOne
            </button>
          </form>
        )}
      </div>

      <footer className="dtkt__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

export default DemoTicket;
