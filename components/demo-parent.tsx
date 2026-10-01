"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import {
  DEMO_PARENT,
  DEMO_PARENT_SESSION,
  DEMO_PROGRESS,
  DEMO_TERM,
  DEMO_LEDGER,
  DEMO_ABSENCE_REASONS,
  DEMO_PARENT_NOTICES,
  DEMO_PARENT_THREAD,
  type ParentChildRow,
} from "@/lib/demo-data";

/**
 * What a parent sees after signing in.
 *
 * DESIGNED FOR A PHONE FIRST. A parent checks this standing in a kitchen, not
 * at a desk, and usually for one reason: was my child marked in, and do I owe
 * anything. Those two answers are above the fold and everything else is below
 * them.
 *
 * WHAT IS DELIBERATELY ABSENT. Any way to see another family, any class list,
 * any figure about the madrasah as a whole. The parent role reaches one
 * household; a screen that hinted otherwise would be describing an access model
 * we do not have and should not want.
 *
 * Every number comes from DEMO_PARENT, which derives from the same DEMO_FEES
 * and DEMO_PUPILS rows the office screens read. The parent's view and the
 * office's view of one family cannot drift apart, which is the product thesis
 * and would be a poor thing to fake in the demonstration of it.
 */

const MARK: Record<string, { label: string; glyph: string; cls: string }> = {
  in:       { label: "In",       glyph: "✓", cls: "pmark--in" },
  absent:   { label: "Absent",   glyph: "✗", cls: "pmark--absent" },
  // "L" rather than a dot: a parent reading this at arm's length should not
  // have to work out what a dot means, and there is no room for a legend.
  late:     { label: "Late",     glyph: "L", cls: "pmark--late" },
  closed:   { label: "Closed",   glyph: "—", cls: "pmark--closed" },
  upcoming: { label: "To come",  glyph: "",  cls: "pmark--upcoming" },
};
const DAYS = ["Mon", "Tue", "Wed", "Thu"];


/** One child, opened: the term, what the teacher wrote, nothing else. */
function ChildDetail({ child, onBack }: { child: ParentChildRow; onBack: () => void }) {
  const term = DEMO_TERM[child.ref] ?? [];
  // Only entries the teacher chose to share. The private note never leaves
  // the madrasah, which is the point of the `shared` flag being per entry.
  const shared = DEMO_PROGRESS.filter((r) => r.pupilRef === child.ref && r.shared);
  return (
    <>
      <button type="button" className="dnav__btn pback" onClick={onBack}>
        <span aria-hidden="true">←</span> All children
      </button>

      <section className="pchild" aria-label={child.name}>
        <h2 className="pchild__name">{child.name}</h2>
        <p className="pchild__class">{child.className} · {child.teacher}</p>

        <h3 className="pdet__h">This term</h3>
        <ul className="pterm">
          {term.map((w) => (
            <li className="pterm__row" key={w.week}>
              <span className="pterm__week">{w.week}</span>
              <span className="pterm__marks">
                {w.marks.map((m, i) => (
                  <span key={i} className={`pmark ${MARK[m].cls} pmark--tiny`}>
                    <span className="pmark__glyph" aria-hidden="true">{MARK[m].glyph}</span>
                    <span className="u-visually-hidden">{DAYS[i]} {MARK[m].label}</span>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="dadmin__muted pdet__note">
          <strong>{child.attendance}%</strong> across the term. Closed days are
          not counted against a child.
        </p>
      </section>

      <section className="pfee" aria-label="Progress">
        <div className="pdet__tagrow">
          <h3 className="pdet__h" style={{ margin: 0 }}>Hifz and sabaq</h3>
          <span className="tag tag--live">Live</span>
        </div>
        <p className="dadmin__muted pdet__note">
          What the teacher heard, and chose to share. Sabaq is the new lesson,
          sabqi the recent revision, manzil the older. A teacher can also write
          a note only the madrasah sees — none of those appear here.
        </p>
        {shared.length === 0 ? (
          <p className="dadmin__muted">Nothing shared yet.</p>
        ) : (
          <ul className="pprog">
            {shared.map((r) => (
              <li className="pprog__row" key={r.on}>
                <p className="pprog__when">{r.on}</p>
                <dl className="pprog__dl">
                  <dt>Sabaq</dt><dd>{r.sabaq}</dd>
                  <dt>Sabqi</dt><dd>{r.sabqi}</dd>
                  <dt>Manzil</dt><dd>{r.manzil}</dd>
                </dl>
                {r.noteForParent ? <p className="pprog__note">“{r.noteForParent}”</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/** Telling the madrasah before the register opens. */
function AbsenceForm({
  child, onCancel, onSend,
}: { child: ParentChildRow; onCancel: () => void; onSend: (day: string, reason: string) => void }) {
  const [day, setDay] = React.useState("This evening");
  const [reason, setReason] = React.useState<string>(DEMO_ABSENCE_REASONS[0]);
  return (
    <>
      <button type="button" className="dnav__btn pback" onClick={onCancel}>
        <span aria-hidden="true">←</span> Cancel
      </button>
      <section className="pfee" aria-label={`Report an absence for ${child.name}`}>
        <h2 className="pchild__name">Report an absence</h2>
        <p className="dadmin__muted pdet__note">
          {child.name} · {child.className} · {child.teacher}
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); onSend(day, reason); }}
        >
          <div className="pform__field">
            <label htmlFor="abs-day">Which session</label>
            <select id="abs-day" value={day} onChange={(e) => setDay(e.target.value)}>
              {["This evening", "Tomorrow evening", "The rest of this week"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="pform__field">
            <label htmlFor="abs-why">Why</label>
            <select id="abs-why" value={reason} onChange={(e) => setReason(e.target.value)}>
              {DEMO_ABSENCE_REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="dcong__do">Tell the madrasah</button>
        </form>
      </section>
    </>
  );
}


/** The thread, both sides, with a reply box. Previously this told a parent
 *  they could write to the office; now they can. */
function OfficeThread({ onBack, onSend }: { onBack: () => void; onSend: () => void }) {
  const [draft, setDraft] = React.useState("");
  return (
    <>
      <button type="button" className="dnav__btn pback" onClick={onBack}>
        <span aria-hidden="true">←</span> Back
      </button>
      <section className="pfee" aria-label="Your thread with the office">
        <h2 className="pchild__name">{DEMO_PARENT_THREAD.subject}</h2>
        <ul className="pthread">
          {DEMO_PARENT_THREAD.messages.map((m, i) => (
            <li key={i} className={`pmsg pmsg--${m.from}`}>
              <p className="pmsg__who">{m.who} · {m.at}</p>
              <p className="pmsg__body">{m.body}</p>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => { e.preventDefault(); onSend(); }}
        >
          <div className="pform__field pform__field--wide">
            <label htmlFor="reply">Your reply</label>
            <textarea
              id="reply" rows={3} value={draft}
              onChange={(e) => setDraft(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="dcong__do">Send</button>
        </form>
      </section>
    </>
  );
}

export function DemoParent({
  masjidName,
  onSignOut,
}: {
  masjidName: string;
  onSignOut: () => void;
}) {
  const [said, setSaid] = React.useState("");
  const [open, setOpen] = React.useState<ParentChildRow | null>(null);
  const [absence, setAbsence] = React.useState<ParentChildRow | null>(null);
  const [thread, setThread] = React.useState(false);
  const { fees, children } = DEMO_PARENT;

  const act = (message: string) => () => setSaid(message);

  return (
    <div className="dadmin">
      <div className="dadmin__top">
        <div>
          <p className="dadmin__portal">Parents Portal</p>
          <h1 className="dadmin__name">{masjidName}</h1>
        </div>
        <div className="dadmin__acts">
          <button type="button" className="dadmin__out" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="dadmin__body">
        <p className="dadmin__intro">
          {DEMO_PARENT.guardian} · {children.length} children ·{" "}
          {DEMO_PARENT_SESSION.days}, {DEMO_PARENT_SESSION.from}–
          {DEMO_PARENT_SESSION.to}
        </p>

        <p className="dcong__said" role="status" aria-live="polite">
          {said}
        </p>

        {absence ? (
          <AbsenceForm
            child={absence}
            onCancel={() => setAbsence(null)}
            onSend={(day, reason) => {
              setAbsence(null);
              setSaid(
                `${absence.name} reported absent — ${day.toLowerCase()}, ${reason.toLowerCase()}. ${absence.teacher} sees it before the register opens, the office sees it on their screen, and nobody had to telephone the masjid.`,
              );
            }}
          />
        ) : thread ? (
          <OfficeThread
            onBack={() => setThread(false)}
            onSend={() => {
              setThread(false);
              setSaid("Sent. It arrives on the office's Masjid office screen as a thread against your family, not in somebody's personal WhatsApp.");
            }}
          />
        ) : open ? (
          <ChildDetail child={open} onBack={() => setOpen(null)} />
        ) : (
        <>
        {/* ── Each child, with this week at a glance ───────────────────── */}
        {children.map((c) => (
          <section className="pchild" key={c.ref} aria-label={c.name}>
            <div className="pchild__head">
              <h2 className="pchild__name">{c.name}</h2>
              <p className="pchild__class">
                {c.className} · {c.teacher}
              </p>
            </div>

            <ul className="pweek" aria-label={`This week for ${c.name}`}>
              {c.week.map((m, i) => (
                <li key={DAYS[i]} className={`pmark ${MARK[m].cls}`}>
                  <span className="pmark__day">{DAYS[i]}</span>
                  <span className="pmark__glyph" aria-hidden="true">
                    {MARK[m].glyph}
                  </span>
                  <span className="u-visually-hidden">{MARK[m].label}</span>
                </li>
              ))}
            </ul>

            <p className="pchild__rate">
              <strong>{c.attendance}%</strong> this term
              {c.note ? <span className="pchild__note"> — {c.note}</span> : null}
            </p>

            <div className="pchild__acts">
              <button
                type="button"
                className="dcong__do"
                onClick={() => { setOpen(c); setSaid(""); }}
              >
                Open {c.name.split(" ").slice(-2).join(" ")}
              </button>
              <button
                type="button"
                className="dcong__do dcong__do--small"
                onClick={() => { setAbsence(c); setSaid(""); }}
              >
                Report an absence
              </button>
            </div>
          </section>
        ))}

        {/* ── What is owed ─────────────────────────────────────────────── */}
        <section className="pfee" aria-label="Fees">
          <h2 className="pchild__name">Fees</h2>
          <p className="pfee__sum">
            <span className="pfee__big">£{fees.outstanding}</span>
            <span className="pfee__lab">
              outstanding · {fees.monthsBehind} months behind
            </span>
          </p>
          <p className="dadmin__muted">
            £{fees.monthly} a month for the family, not per child. Last paid{" "}
            {fees.lastPaid}.
          </p>
          <button
            type="button"
            className="dcong__do"
            onClick={act(
              `£${fees.outstanding} paid by card. The office ledger updates at once, the reminder stops, and a receipt reaches you — no cash in an envelope and no note in a book.`,
            )}
          >
            Pay £{fees.outstanding}
          </button>
        </section>

        {/* ── From the madrasah ────────────────────────────────────── */}
        <section className="pfee" aria-label="Notices">
          <h2 className="pchild__name">
            From the madrasah
            {DEMO_PARENT_NOTICES.some((n) => n.unread) ? (
              <span className="pnew">
                {DEMO_PARENT_NOTICES.filter((n) => n.unread).length} new
              </span>
            ) : null}
          </h2>
          <ul className="pnotices">
            {DEMO_PARENT_NOTICES.map((n) => (
              <li className="pnotice" key={n.title}>
                <p className="pnotice__top">
                  <span className="pnotice__kind">{n.kind}</span>
                  <span className="dadmin__muted">{n.when}</span>
                </p>
                <p className="pnotice__title">
                  {n.unread ? <span className="dcong__next" aria-hidden="true">▪ </span> : null}
                  {n.title}
                  {n.unread ? <span className="u-visually-hidden"> — unread</span> : null}
                </p>
                <p className="pnotice__body">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── The office ───────────────────────────────────────────────── */}
        <section className="pfee" aria-label="Messages">
          <h2 className="pchild__name">Your message to the office</h2>
          <p className="dadmin__muted">
            <strong>{DEMO_PARENT_THREAD.subject}</strong> — the office has
            replied.
          </p>
          <button
            type="button"
            className="dcong__do dcong__do--small"
            onClick={() => { setThread(true); setSaid(""); }}
          >
            Open the conversation
          </button>
        </section>
        </>
        )}
      </div>

      <div className="dadmin__foot">
        <PoweredBy />
      </div>
    </div>
  );
}
