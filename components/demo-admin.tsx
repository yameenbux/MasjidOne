"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
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

type Tab = "registers" | "fees" | "pupils";

export function DemoAdmin({
  masjidName,
  onSwitch,
  onSignOut,
}: {
  masjidName: string;
  onSwitch: () => void;
  onSignOut: () => void;
}) {
  const [tab, setTab] = React.useState<Tab>("registers");

  const missing = DEMO_REGISTERS.filter((r) => r.state === "missing").length;
  const open = DEMO_REGISTERS.filter(
    (r) => r.state === "draft" || r.state === "submitted",
  ).length;

  return (
    <div className="dadmin">
      <header className="dadmin__top">
        <div>
          <p className="dadmin__portal">Madrasah Portal</p>
          <p className="dadmin__name">{masjidName}</p>
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
                  {DEMO_REGISTERS.map((r) => (
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
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Fees table, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Charged per family, with the sibling rate applied. Sample data.
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
                  {DEMO_FEES.map((f) => (
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
          </section>
        ) : null}

        {tab === "pupils" ? (
          <section aria-label="Pupils">
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
                  {DEMO_PUPILS.map((p) => (
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
          </section>
        ) : null}
      </div>

      <footer className="dadmin__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

export default DemoAdmin;
