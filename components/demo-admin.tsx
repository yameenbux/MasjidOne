"use client";

import * as React from "react";
import { DemoFilter, DemoEmpty, matches } from "@/components/demo-filter";
import { PoweredBy } from "@/components/ui/powered-by";
import { DemoNav } from "@/components/demo-nav";
import {
  DEMO_CLOSURES,
  DEMO_EVENTS,
  DEMO_IMPORT,
  DEMO_THREADS,
  DEMO_PROGRESS,
  DEMO_CONCERNS,
} from "@/lib/demo-data";
import {
  DEMO_TOTALS,
  DEMO_REGISTERS,
  DEMO_FEES,
  DEMO_FEE_SUMMARY,
  DEMO_PUPILS,
  type RegisterState,
} from "@/lib/demo-data";

/**
 * The admin side of the demonstration tenant.
 *
 * Three tabs, chosen because they are the three things that actually close a
 * meeting, in the order a committee cares about them:
 *
 *   Registers — one class never took theirs, and the system says so. A paper
 *               register cannot tell you that, which is the entire argument.
 *   Fees      — per family, not per pupil, with arrears visible and a reminder
 *               that can be sent from the same screen.
 *   Pupils    — the record itself, with siblings sharing one household.
 *
 * Everything is read-only. Nothing here writes anywhere, because this is a
 * showcase and not the platform: see the note at the top of app/demo/page.tsx.
 *
 * The masjid's name sits alone in the header at display size; MasjidOne's
 * credit sits in the footer, matching the sign-in screen, so the white-label
 * reads the same way on every screen a committee is shown.
 */

const money = (n: number) =>
  `${n < 0 ? "−" : ""}£${Math.abs(n).toLocaleString("en-GB")}`;

const STATE_LABEL: Record<RegisterState, string> = {
  locked: "Locked",
  submitted: "Submitted",
  draft: "Draft",
  missing: "Not taken",
};

type Tab = "registers" | "fees" | "pupils" | "calendar" | "progress" | "concerns" | "messages";

export function DemoAdmin({
  masjidName,
  onBack,
  onHome,
  onSwitch,
  onSignOut,
}: {
  masjidName: string;
  onBack: () => void;
  onHome: () => void;
  onSwitch: () => void;
  onSignOut: () => void;
}) {
  const [tab, setTab] = React.useState<Tab>("registers");

  /* Search and filter state for the three lists that have enough rows to need
     it. Kept here rather than in each tab so switching tabs does not lose what
     somebody has typed mid-demonstration. */
  const [pupilQ, setPupilQ] = React.useState("");
  const [pupilClass, setPupilClass] = React.useState("All classes");
  const [feeQ, setFeeQ] = React.useState("");
  const [feeState, setFeeState] = React.useState("All families");
  const [regQ, setRegQ] = React.useState("");
  const [regState, setRegState] = React.useState("All registers");

  const pupilClasses = React.useMemo(
    () => ["All classes", ...Array.from(new Set(DEMO_PUPILS.map((p) => p.className))).sort()],
    [],
  );
  const pupils = DEMO_PUPILS.filter(
    (p) =>
      (pupilClass === "All classes" || p.className === pupilClass) &&
      matches(pupilQ, p.ref, p.name, p.className, p.guardian),
  );
  const fees = DEMO_FEES.filter(
    (f) =>
      (feeState === "All families" ||
        (feeState === "Behind" ? f.behind > 0 : f.behind === 0)) &&
      matches(feeQ, f.household),
  );
  /* "Awaiting lock" is draft or submitted — the same definition the tab count
     uses, so the filter and the tab cannot disagree. */
  const registers = DEMO_REGISTERS.filter(
    (r) =>
      (regState === "All registers"
        ? true
        : regState === "Awaiting lock"
          ? r.state === "draft" || r.state === "submitted"
          : regState === "Not taken"
            ? r.state === "missing"
            : r.state === "locked") && matches(regQ, r.className, r.teacher),
  );

  const missing = DEMO_REGISTERS.filter((r) => r.state === "missing").length;
  const open = DEMO_REGISTERS.filter(
    (r) => r.state === "draft" || r.state === "submitted",
  ).length;

  return (
    <div className="dadmin">
      <header className="dadmin__top">
        <div>
          <p className="dadmin__portal">Madrasah Portal</p>
          <h1 className="dadmin__name">{masjidName}</h1>
        </div>
        <div className="dadmin__acts">
          <button type="button" className="dadmin__out" onClick={onSwitch}>
            Switch portal
          </button>
          <button type="button" className="dadmin__out" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="dadmin__body">
        <DemoNav onBack={onBack} onHome={onHome} homeLabel="Portals" />

        {/* Five figures, the ones a committee asks for first. */}
        <ul className="dadmin__tiles">
          {[
            ["Pupils on roll", DEMO_TOTALS.pupils],
            ["Classes", DEMO_TOTALS.classes],
            ["Staff", DEMO_TOTALS.staff],
            ["Households", DEMO_TOTALS.households],
            ["Guardians", DEMO_TOTALS.guardians],
          ].map(([label, value]) => (
            <li key={String(label)} className="dadmin__tile">
              <span className="dadmin__tileN">{Number(value).toLocaleString("en-GB")}</span>
              <span className="dadmin__tileL">{label}</span>
            </li>
          ))}
        </ul>

        {/* The one line that sells the register module. Stated as a fact about
            today rather than a feature claim. */}
        {missing > 0 ? (
          <p className="dadmin__alert" role="status">
            <strong>{missing} register not taken today.</strong> Nāẓirah 4B has no
            entry for this evening. The office was notified at 18:15 and the
            teacher has been asked to complete it.
          </p>
        ) : null}

        <nav className="dadmin__tabs" aria-label="Sections">
          {(
            [
              ["registers", `Registers · ${open} open`],
              ["fees", `Fees · ${DEMO_FEE_SUMMARY.inArrears} in arrears`],
              ["pupils", "Pupils"],
              ["calendar", "Calendar"],
              ["progress", "Hifz & sabaq"],
              [
                "concerns",
                `Concerns · ${DEMO_CONCERNS.filter((c) => c.state !== "Closed").length}`,
              ],
              [
                "messages",
                `Messages · ${DEMO_THREADS.filter((t) => t.unread).length} unread`,
              ],
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

        {tab === "registers" ? (
          <section aria-label="Today's registers">
            <DemoFilter
              label="Find a class or teacher"
              placeholder="Class name or teacher"
              query={regQ}
              onQuery={setRegQ}
              selects={[
                {
                  id: "state",
                  label: "Showing",
                  value: regState,
                  options: ["All registers", "Awaiting lock", "Not taken", "Locked"],
                  onChange: setRegState,
                },
              ]}
              showing={registers.length}
              loaded={DEMO_REGISTERS.length}
              total={DEMO_REGISTERS.length}
              noun="registers"
            />
            {registers.length === 0 ? (
              <DemoEmpty
                query={regQ}
                loaded={DEMO_REGISTERS.length}
                total={DEMO_REGISTERS.length}
                noun="registers"
              />
            ) : (
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Registers table, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Tonight&apos;s registers, newest state first. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Class</th>
                    <th scope="col">Teacher</th>
                    <th scope="col" className="dadmin__num">On roll</th>
                    <th scope="col" className="dadmin__num">Present</th>
                    <th scope="col">State</th>
                    <th scope="col" className="dadmin__num">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {registers.map((r) => (
                    <tr key={r.className}>
                      <th scope="row">{r.className}</th>
                      <td>{r.teacher}</td>
                      <td className="dadmin__num">{r.onRoll}</td>
                      <td className="dadmin__num">
                        {r.state === "missing" ? "—" : r.present}
                      </td>
                      <td>
                        <span className={`dadmin__pill dadmin__pill--${r.state}`}>
                          {STATE_LABEL[r.state]}
                        </span>
                      </td>
                      <td className="dadmin__num">{r.at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </section>
        ) : null}

        {tab === "fees" ? (
          <section aria-label="Fees by family">
            <ul className="dadmin__tiles dadmin__tiles--fee">
              <li className="dadmin__tile">
                <span className="dadmin__tileN">{money(DEMO_FEE_SUMMARY.outstanding)}</span>
                <span className="dadmin__tileL">Outstanding</span>
              </li>
              <li className="dadmin__tile">
                <span className="dadmin__tileN">{money(DEMO_FEE_SUMMARY.billedMonthly)}</span>
                <span className="dadmin__tileL">Billed this month</span>
              </li>
              <li className="dadmin__tile">
                <span className="dadmin__tileN">{DEMO_FEE_SUMMARY.inArrears}</span>
                <span className="dadmin__tileL">Families in arrears</span>
              </li>
            </ul>
            <DemoFilter
              label="Find a family"
              placeholder="Household number or surname"
              query={feeQ}
              onQuery={setFeeQ}
              selects={[
                {
                  id: "state",
                  label: "Showing",
                  value: feeState,
                  options: ["All families", "Behind", "Up to date"],
                  onChange: setFeeState,
                },
              ]}
              showing={fees.length}
              loaded={DEMO_FEES.length}
              total={DEMO_TOTALS.households}
              noun="households"
            />
            {fees.length === 0 ? (
              <DemoEmpty query={feeQ} loaded={DEMO_FEES.length} total={DEMO_TOTALS.households} noun="households" />
            ) : (
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Fees table, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  The families behind, and those who have just settled — {DEMO_FEE_SUMMARY.shown} of{" "}
                  {DEMO_TOTALS.households} households, not the whole ledger. Charged per family,
                  with the sibling rate applied. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Household</th>
                    <th scope="col" className="dadmin__num">Children</th>
                    <th scope="col" className="dadmin__num">Monthly</th>
                    <th scope="col" className="dadmin__num">Balance</th>
                    <th scope="col">Last paid</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.household}>
                      <th scope="row">{f.household}</th>
                      <td className="dadmin__num">{f.children}</td>
                      <td className="dadmin__num">{money(f.monthly)}</td>
                      <td className="dadmin__num">
                        <span className={f.behind > 0 ? "dadmin__owed" : undefined}>
                          {money(f.balance)}
                        </span>
                        {f.behind > 0 ? (
                          <span className="dadmin__behind"> · {f.behind}m</span>
                        ) : null}
                      </td>
                      <td>{f.lastPaid}</td>
                      <td>
                        {f.behind > 0 ? (
                          <span className="dadmin__pill dadmin__pill--draft">
                            Reminder queued
                          </span>
                        ) : (
                          <span className="dadmin__muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </section>
        ) : null}

        {tab === "pupils" ? (
          <section aria-label="Pupils">
            <DemoFilter
              label="Find a pupil"
              placeholder="Name, reference, class or household"
              query={pupilQ}
              onQuery={setPupilQ}
              selects={[
                {
                  id: "class",
                  label: "Class",
                  value: pupilClass,
                  options: pupilClasses,
                  onChange: setPupilClass,
                },
              ]}
              showing={pupils.length}
              loaded={DEMO_PUPILS.length}
              total={DEMO_TOTALS.pupils}
              noun="pupils"
            />
            {pupils.length === 0 ? (
              <DemoEmpty query={pupilQ} loaded={DEMO_PUPILS.length} total={DEMO_TOTALS.pupils} noun="pupils" />
            ) : (
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Pupils table, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Siblings share one household record. Sample data — these are
                  not real children.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Ref</th>
                    <th scope="col">Pupil</th>
                    <th scope="col">Class</th>
                    <th scope="col">Household</th>
                    <th scope="col" className="dadmin__num">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {pupils.map((p) => (
                    <tr key={p.ref}>
                      <th scope="row">{p.ref}</th>
                      <td>{p.name}</td>
                      <td>{p.className}</td>
                      <td>{p.guardian}</td>
                      <td className="dadmin__num">{p.attendance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}

            {/* How the roll arrived. This sits under the pupils rather than on
                its own tab because "how does our data get in?" is a question
                somebody asks while looking at the roll, and because it is the
                honest answer to what the setup fee buys. */}
            <div className="dimport">
              <h2 className="dadmin__h">How this roll got here</h2>
              <p className="dadmin__muted dimport__src">
                From: {DEMO_IMPORT.source}. Nobody at the masjid retyped a name.
              </p>
              <ul className="dimport__nums">
                {[
                  [DEMO_IMPORT.pupils, "pupils"],
                  [DEMO_IMPORT.classes, "classes"],
                  [DEMO_IMPORT.guardians, "guardians"],
                  [DEMO_IMPORT.households, "households"],
                  [DEMO_IMPORT.siblingsLinked, "siblings linked"],
                ].map(([n, label]) => (
                  <li key={label as string}>
                    <span className="dadmin__tileN">{n as number}</span>
                    <span className="dadmin__tileL">{label as string}</span>
                  </li>
                ))}
              </ul>
              <p className="dimport__review">
                <strong>{DEMO_IMPORT.siblingsForReview} sibling links need a human.</strong>{" "}
                The system proposes a link and says why it thinks so — same
                surname, same address, same phone — and somebody at the masjid
                confirms or rejects it. Guessing silently is how two brothers
                end up as two unrelated families and get billed twice.
              </p>
              <p className="dimport__carried">
                Carried across with them: {DEMO_IMPORT.carried.join(", ")}.
                These are the fields a migration usually drops, and they are the
                ones that matter most on the evening somebody needs them.
              </p>
            </div>
          </section>
        ) : null}
        {tab === "calendar" ? (
          <>
            <p className="dadmin__intro">
              The year, in the two halves a madrasah actually keeps: when you
              are closed, and the dates the community works around.
            </p>

            <h2 className="dadmin__h">Closures</h2>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Closures, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Entered as ranges, not single days — a half term is a week,
                  and nobody should type it five times. Registers are not asked
                  for on a closed day, so nothing is chased over a holiday.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Closure</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_CLOSURES.map((c) => (
                    <tr key={c.name + c.from}>
                      <th scope="row">
                        {c.name}
                        {c.note ? <span className="dadmin__muted"> — {c.note}</span> : null}
                      </th>
                      <td>{c.from}</td>
                      <td>{c.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="dadmin__h">The Islamic calendar</h2>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Islamic calendar, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Every moon-dependent date is marked estimated until it is
                  sighted. A system that printed ʿĪd as a fixed date would be
                  wrong about one year in two, and the madrasah would be the
                  one explaining it.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Hijrī</th>
                    <th scope="col">Expected</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_EVENTS.map((e) => (
                    <tr key={e.name}>
                      <th scope="row">{e.name}</th>
                      <td className="dadmin__muted">{e.hijri}</td>
                      <td>
                        {e.on}
                        {e.estimated ? (
                          <span className="dadmin__muted"> · estimated</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tab === "progress" ? (
          <>
            <div className="dadmin__alert">
              <p className="modp__tag" style={{ margin: "0 0 .5rem" }}>
                <span className="tag tag--live">Live</span>
              </p>
              <p style={{ margin: 0 }}>
                <strong>Nobody has written an entry at the founding masjid
                yet.</strong> The feature works — a teacher records it, and a
                parent sees whatever was marked shared. Sample data below.
              </p>
            </div>

            <p className="dadmin__intro">
              Sabaq is the new lesson, sabqi the recent revision, manzil the
              older. A teacher writes them after hearing a child, and decides
              per entry whether the parent sees it.
            </p>

            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Progress entries, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  The private note is the column that matters. A teacher needs
                  somewhere to write &ldquo;tired all week, ask whether anything
                  has changed at home&rdquo; without it arriving on a father&rsquo;s
                  phone. Nothing reaches a parent unless it is marked shared.
                  Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Pupil</th>
                    <th scope="col">When</th>
                    <th scope="col">Sabaq</th>
                    <th scope="col">Sabqi</th>
                    <th scope="col">Manzil</th>
                    <th scope="col">Parent sees</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_PROGRESS.map((r) => (
                    <tr key={r.pupilRef + r.on}>
                      <th scope="row">{r.pupilRef}</th>
                      <td className="dadmin__muted">{r.on}</td>
                      <td>{r.sabaq}</td>
                      <td>{r.sabqi}</td>
                      <td>{r.manzil}</td>
                      <td>
                        {r.shared ? (
                          <>
                            <span className="dcong__next" aria-hidden="true">▪ </span>
                            Shared
                            {r.noteForParent ? (
                              <span className="dadmin__muted"> — &ldquo;{r.noteForParent}&rdquo;</span>
                            ) : null}
                          </>
                        ) : (
                          <span className="dadmin__muted">
                            Not shared{r.noteInternal ? " — private note only" : ""}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tab === "concerns" ? (
          <>
            <div className="dadmin__alert">
              <p className="modp__tag" style={{ margin: "0 0 .5rem" }}>
                <span className="tag tag--live">Live</span>
              </p>
              <p style={{ margin: 0 }}>
                No concern has been raised at the founding masjid, which is the
                outcome everyone wants. This is the office half of what a
                teacher sends.
              </p>
            </div>

            <p className="dadmin__intro">
              <strong>Only the designated person reaches this screen.</strong>{" "}
              Not the committee, not the treasurer, not the other teachers. A
              concern is never deleted, only closed with a note — a
              safeguarding record that can be removed is not a safeguarding
              record.
            </p>

            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Concerns, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  What a teacher raised, when, and where it got to. Sample data
                  — these are not real children.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Reference</th>
                    <th scope="col">Child</th>
                    <th scope="col">Kind</th>
                    <th scope="col">Raised by</th>
                    <th scope="col">State</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_CONCERNS.map((c) => (
                    <tr key={c.ref}>
                      <th scope="row">{c.ref}</th>
                      <td>{c.pupil}</td>
                      <td>{c.kind}</td>
                      <td className="dadmin__muted">{c.raisedBy} · {c.at}</td>
                      <td>
                        {c.state === "Closed" ? (
                          <span className="dadmin__muted">{c.state}</span>
                        ) : (
                          <>
                            <span className="dcong__next" aria-hidden="true">▪ </span>
                            {c.state}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tab === "messages" ? (
          <>
            <div className="dadmin__alert">
              <p className="modp__tag" style={{ margin: "0 0 .5rem" }}>
                <span className="tag tag--live">Live</span>
              </p>
              <p style={{ margin: 0 }}>
                <strong>Threads run both ways.</strong> A parent writes from
                their own portal and it lands here against their family, not in
                somebody&apos;s personal WhatsApp.
              </p>
            </div>

            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Message threads, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  One thread per subject per family, so a question about
                  Thursday pickup does not end up buried under a fee query.
                  Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col">Family</th>
                    <th scope="col">Last</th>
                    <th scope="col">State</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_THREADS.map((t) => (
                    <tr key={t.subject}>
                      <th scope="row">
                        {t.unread ? (
                          <span className="dcong__next" aria-hidden="true">▪ </span>
                        ) : null}
                        {t.subject}
                        {t.unread ? (
                          <span className="u-visually-hidden"> — unread</span>
                        ) : null}
                      </th>
                      <td>{t.household}</td>
                      <td className="dadmin__muted">{t.last}</td>
                      <td>{t.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

      </div>

      <footer className="dadmin__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

export default DemoAdmin;
