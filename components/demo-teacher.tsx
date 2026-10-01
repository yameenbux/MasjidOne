"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import {
  DEMO_TEACHER_NAME,
  DEMO_TEACHER_CLASSES,
  DEMO_TEACHER_ROLL,
  DEMO_CONCERN_KINDS,
  DEMO_PROGRESS,
} from "@/lib/demo-data";

/**
 * The teacher's portal.
 *
 * WHY IT IS ITS OWN DOOR. Forty of the forty-three accounts at the founding
 * masjid are teachers. They are the people who touch this every evening, and
 * what they must see is almost the opposite of what an administrator sees: two
 * classes rather than forty-nine, no roll, no fees, no family's balance. The
 * platform gates that with is_teacher() across eight functions. Showing a
 * teacher the admin screens in a demonstration would be selling an access
 * model that does not exist and that no committee would accept.
 *
 * WHAT A TEACHER CAN DO HERE
 *   take tonight's register — draft, then submit
 *   raise a concern about a child
 *   write progress for their own classes (in development)
 *
 * The register opens on the class nobody took. That is deliberate: a teacher
 * met by the one thing they have not done is the argument for the product.
 */

type Tab = "tonight" | "concern" | "progress";
type Mark = "in" | "absent" | "late";

export function DemoTeacher({
  masjidName,
  onSignOut,
}: {
  masjidName: string;
  onSignOut: () => void;
}) {
  const [tab, setTab] = React.useState<Tab>("tonight");
  const [said, setSaid] = React.useState("");
  const [marks, setMarks] = React.useState<Record<string, Mark>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const missing = DEMO_TEACHER_CLASSES.find((c) => c.state === "missing");
  const marked = Object.keys(marks).length;
  const total = DEMO_TEACHER_ROLL.length;
  const present = Object.values(marks).filter((m) => m !== "absent").length;

  return (
    <div className="dadmin">
      <div className="dadmin__top">
        <div>
          <p className="dadmin__portal">Teacher Portal</p>
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
          {DEMO_TEACHER_NAME} · {DEMO_TEACHER_CLASSES.length} classes. You see
          your own classes and nothing else — not the roll, not fees, not
          another teacher&apos;s register.
        </p>

        {missing && !submitted ? (
          <div className="dadmin__alert">
            <strong>{missing.className} has no register for this evening.</strong>{" "}
            The office was told at 18:15. It takes about a minute.
          </div>
        ) : null}

        <p className="dcong__said" role="status" aria-live="polite">
          {said}
        </p>

        <nav className="dadmin__tabs" aria-label="Sections">
          {(
            [
              ["tonight", submitted ? "Tonight · submitted" : "Tonight's register"],
              ["concern", "Raise a concern"],
              ["progress", "Hifz & sabaq"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="dadmin__tab"
              aria-current={tab === key ? "page" : undefined}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "tonight" ? (
          <>
            <h2 className="dadmin__h">{missing?.className} · {total} on roll</h2>
            <p className="dadmin__muted" style={{ marginTop: 0 }}>
              {submitted
                ? "Submitted. It locks at the end of the evening and cannot be quietly changed after that."
                : `${marked} of ${total} marked.`}
            </p>

            <ul className="treg">
              {DEMO_TEACHER_ROLL.map((p) => (
                <li className="treg__row" key={p.ref}>
                  <div className="treg__who">
                    <span className="treg__name">{p.name}</span>
                    {p.flag ? (
                      <span className="treg__flag">{p.flag}</span>
                    ) : null}
                  </div>
                  <div className="treg__marks" role="group" aria-label={`Mark ${p.name}`}>
                    {(["in", "late", "absent"] as Mark[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`treg__btn${marks[p.ref] === m ? " is-on" : ""}`}
                        aria-pressed={marks[p.ref] === m}
                        disabled={submitted}
                        onClick={() =>
                          setMarks((prev) => ({ ...prev, [p.ref]: m }))
                        }
                      >
                        {m === "in" ? "In" : m === "late" ? "Late" : "Absent"}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            {!submitted ? (
              <div className="dcong__bar">
                <button
                  type="button"
                  className="dcong__do"
                  disabled={marked < total}
                  onClick={() => {
                    setSubmitted(true);
                    setSaid(
                      `Register submitted — ${present} of ${total} in. The office stops chasing it, and any parent who reported an absence tonight already shows as expected.`,
                    );
                  }}
                >
                  {marked < total
                    ? `Mark all ${total} to submit`
                    : `Submit · ${present} of ${total} in`}
                </button>
                <span className="dadmin__muted">
                  A draft saves as you go. Nothing is final until you submit.
                </span>
              </div>
            ) : null}
          </>
        ) : null}

        {tab === "concern" ? (
          <>
            <h2 className="dadmin__h">Raise a concern</h2>
            <p className="dadmin__muted" style={{ marginTop: 0, maxWidth: "62ch" }}>
              This goes to the designated person at the masjid, not to the
              parent and not to the other teachers. You do not need to be sure
              before you raise it — that judgement is not yours to make alone,
              and a concern nobody wrote down is the one that gets lost.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSaid(
                  "Concern logged and the designated person notified. It is timestamped against you and the child, visible only to them, and it cannot be deleted — only closed with a note.",
                );
              }}
            >
              <div className="pform__field">
                <label htmlFor="c-child">Which child</label>
                <select id="c-child">
                  {DEMO_TEACHER_ROLL.map((p) => (
                    <option key={p.ref}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="pform__field">
                <label htmlFor="c-kind">What kind of concern</label>
                <select id="c-kind">
                  {DEMO_CONCERN_KINDS.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div className="pform__field pform__field--wide">
                <label htmlFor="c-what">What happened</label>
                <textarea id="c-what" rows={4} defaultValue="" />
              </div>
              <button type="submit" className="dcong__do">
                Raise it
              </button>
            </form>
          </>
        ) : null}

        {tab === "progress" ? (
          <>
            <div className="dadmin__alert">
              <p className="modp__tag" style={{ margin: "0 0 .5rem" }}>
                <span className="tag tag--dev">In development</span>
              </p>
              <p style={{ margin: 0 }}>
                Designed, not built. No teacher has written an entry yet.
              </p>
            </div>
            <h2 className="dadmin__h">What you heard</h2>
            <p className="dadmin__muted" style={{ marginTop: 0, maxWidth: "62ch" }}>
              Sabaq, sabqi and manzil as you would write them. The note for the
              parent is the one they read; the private note stays with the
              madrasah, so you can write what you actually think.
            </p>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Your recent entries, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Your own entries only. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">Sabaq</th>
                    <th scope="col">Shared with the parent</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_PROGRESS.slice(0, 3).map((r) => (
                    <tr key={r.on + r.pupilRef}>
                      <th scope="row" className="dadmin__muted">{r.on}</th>
                      <td>{r.sabaq}</td>
                      <td>
                        {r.shared ? "Shared" : (
                          <span className="dadmin__muted">Kept private</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>

      <div className="dadmin__foot">
        <PoweredBy />
      </div>
    </div>
  );
}
