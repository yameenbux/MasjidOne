"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { DEMO_PARENT, DEMO_PARENT_SESSION } from "@/lib/demo-data";

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

export function DemoParent({
  masjidName,
  onSignOut,
}: {
  masjidName: string;
  onSignOut: () => void;
}) {
  const [said, setSaid] = React.useState("");
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

            <button
              type="button"
              className="dcong__do dcong__do--small"
              onClick={act(
                `${c.name} reported absent. ${c.teacher} sees it before the register opens, and nobody has to telephone the masjid.`,
              )}
            >
              Tell the madrasah they will be absent
            </button>
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

        {/* ── The office ───────────────────────────────────────────────── */}
        <section className="pfee" aria-label="Messages">
          <h2 className="pchild__name">Your message to the office</h2>
          <p className="dadmin__muted">
            <strong>{DEMO_PARENT.openThread}</strong> — open, the office has not
            replied yet.
          </p>
          <button
            type="button"
            className="dcong__do dcong__do--small"
            onClick={act(
              "Message sent to the office. It arrives in their Masjid office screen as a thread against your family rather than in somebody's personal WhatsApp.",
            )}
          >
            Write to the office
          </button>
        </section>
      </div>

      <div className="dadmin__foot">
        <PoweredBy />
      </div>
    </div>
  );
}
