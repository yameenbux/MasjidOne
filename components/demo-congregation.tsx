"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import {
  DEMO_PRAYERS,
  DEMO_JUMUAH,
  DEMO_NEXT_JAMAAH,
  DEMO_REQUESTS,
  DEMO_NOTICES,
  DEMO_DONATIONS,
  DEMO_GIVING,
  DEMO_CONGREGATION,
} from "@/lib/demo-data";

/**
 * The congregation half of the demonstration tenant.
 *
 * The first version of this screen was a dashboard: five figures and two
 * read-only lists. Looking at what the platform actually stores changed the
 * shape of it. The congregation side is not a dashboard, it is a DAY — a
 * handful of times that must be right, a queue of things the public has asked
 * for that nobody has answered yet, and one or two things the masjid needs to
 * say. So the screen is organised around what the office has to do, not around
 * numbers that make a committee feel good.
 *
 * Four tabs, matching the madrasah portal's three so the two halves read as
 * one product:
 *
 *   Today     the times, begins against jamāʿah, and the one being reminded
 *             next. Changing a jamāʿah time is the most frequent act on this
 *             side of the masjid and it is the first button on the screen.
 *   Requests  hall hire, nikah, chanda collections, course places and madrasah
 *             admissions. Every one of those is a public form the office must
 *             answer, they all carry the same reference/status/office_notes
 *             shape, and together they are most of the actual work. The
 *             admission is marked, because it is the join in one row: a form
 *             on the congregation side becoming a child on the madrasah side.
 *   Notices   drafts until somebody presses Publish, and publishing can send
 *             to the app. The janāzah is the case that matters — a death is
 *             known at eleven and the burial is after Zuhr, so the only useful
 *             version of this reaches people in minutes.
 *   Giving    0% commission, and unclaimed Gift Aid, which is money the
 *             committee can go and collect.
 *
 * Nothing here shows hall screens as managed devices, or an appeal with a
 * running total and phases. Neither has a table behind it, and a demo that
 * shows a screen the platform cannot produce is a promise that comes due in
 * week three.
 */

const money = (n: number) => `£${n.toLocaleString("en-GB")}`;

type Tab = "today" | "requests" | "notices" | "giving";

export function DemoCongregation({
  masjidName,
  onSwitch,
  onSignOut,
}: {
  masjidName: string;
  onSwitch: () => void;
  onSignOut: () => void;
}) {
  const [tab, setTab] = React.useState<Tab>("today");
  /**
   * Nothing here writes anywhere — there is no server behind a static export.
   * Rather than leave the buttons inert, which demonstrates nothing, each one
   * states what it would have done. On a call that is the more useful half
   * anyway: the committee wants to hear "and then 1,180 phones get it", not
   * watch a row change colour.
   */
  const [said, setSaid] = React.useState<string | null>(null);
  const act = (message: string) => () => setSaid(message);

  React.useEffect(() => setSaid(null), [tab]);

  return (
    <div className="dadmin">
      <header className="dadmin__top">
        <div>
          <p className="dadmin__portal">Congregation Portal</p>
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
        <ul className="dadmin__tiles">
          {[
            [String(DEMO_CONGREGATION.needsYou), "Need an answer"],
            [String(DEMO_CONGREGATION.drafts), "Notices in draft"],
            [money(DEMO_GIVING.month), "Given this month"],
            [money(DEMO_GIVING.unclaimed), "Gift Aid unclaimed"],
            [DEMO_CONGREGATION.lastReach.toLocaleString("en-GB"), "Reached last send"],
          ].map(([value, label]) => (
            <li key={label} className="dadmin__tile">
              <span className="dadmin__tileN">{value}</span>
              <span className="dadmin__tileL">{label}</span>
            </li>
          ))}
        </ul>

        <p className="dadmin__alert" role="status">
          <strong>
            Next jamāʿah: {DEMO_NEXT_JAMAAH.name} at {DEMO_NEXT_JAMAAH.at}.
          </strong>{" "}
          Everyone who asked for thirty minutes&apos; notice is reminded at{" "}
          {DEMO_NEXT_JAMAAH.remindAt}. The hall screens are showing these times,
          from this table — there is only one set.
        </p>

        <nav className="dadmin__tabs" aria-label="Sections">
          {(
            [
              ["today", "Today"],
              ["requests", `Requests · ${DEMO_CONGREGATION.needsYou}`],
              ["notices", `Notices · ${DEMO_CONGREGATION.drafts} draft`],
              ["giving", "Giving"],
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

        {/* What the pressed button would have done. aria-live so it is
            announced rather than only drawn. */}
        <p className="dcong__said" role="status" aria-live="polite">
          {said}
        </p>

        {tab === "today" ? (
          <section aria-label="Today's prayer times">
            <div className="dcong__bar">
              <button
                type="button"
                className="dcong__do"
                onClick={act(
                  "ʿAsr jamāʿah moved to 16:30. The hall screens and the app follow within the minute, and the reminder shifts to 16:00 for everyone who asked for half an hour.",
                )}
              >
                Change a jamāʿah time
              </button>
              <span className="dadmin__muted">365 days loaded for this year</span>
            </div>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Prayer times, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Jamāʿah is the masjid&apos;s own, not a calculated time. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Prayer</th>
                    <th scope="col" className="dadmin__num">Begins</th>
                    <th scope="col" className="dadmin__num">Jamāʿah</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_PRAYERS.map((p) => (
                    <tr key={p.name}>
                      <th scope="row">
                        {p.name === DEMO_NEXT_JAMAAH.name ? (
                          <span className="dcong__next">{p.name} · next</span>
                        ) : (
                          p.name
                        )}
                      </th>
                      <td className="dadmin__num">{p.begins}</td>
                      <td className="dadmin__num">
                        {p.jamaah === "—" ? <span className="dadmin__muted">—</span> : p.jamaah}
                      </td>
                    </tr>
                  ))}
                  {DEMO_JUMUAH.map((j) => (
                    <tr key={j.label}>
                      <th scope="row">{j.label}</th>
                      <td className="dadmin__num dadmin__muted">—</td>
                      <td className="dadmin__num">{j.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {tab === "requests" ? (
          <section aria-label="Requests awaiting the office">
            <div className="dcong__bar">
              <span className="dadmin__muted">
                Everything the public asked for that nobody has answered yet.
              </span>
            </div>
            <ul className="dcong__list">
              {DEMO_REQUESTS.map((r) => (
                <li key={r.reference} className="dcong__item">
                  <p className="dcong__itemTop">
                    <span className="dcong__kind">{r.kind}</span>
                    <span className="dcong__ref">{r.reference}</span>
                    <span className={`dadmin__pill dadmin__pill--${r.status === "New" ? "draft" : "submitted"}`}>
                      {r.status}
                    </span>
                  </p>
                  <p className="dcong__who">{r.who}</p>
                  <p className="dcong__detail">{r.detail}</p>
                  <p className="dcong__meta">
                    <span className="dadmin__muted">{r.submitted}</span>
                    {r.money ? <span className="dadmin__owed">{r.money}</span> : null}
                    {r.crosses ? (
                      <span className="dcong__join">
                        Opens a pupil record on the madrasah side
                      </span>
                    ) : null}
                  </p>
                  <button
                    type="button"
                    className="dcong__do dcong__do--small"
                    onClick={act(
                      r.crosses
                        ? `${r.reference} accepted. The children appear on the madrasah roll with the household already linked — nobody types the family in twice.`
                        : `${r.reference} opened. Add an office note, agree a date, and the person who asked is emailed the reference.`,
                    )}
                  >
                    {r.crosses ? "Accept the admission" : "Open"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === "notices" ? (
          <section aria-label="Notices">
            <div className="dcong__bar">
              <button
                type="button"
                className="dcong__do"
                onClick={act(
                  "A janāzah notice goes out as you write it — about 1,180 phones inside a minute, the website, and every screen in the building.",
                )}
              >
                Write a notice
              </button>
              <span className="dadmin__muted">Drafts go nowhere until you publish</span>
            </div>
            <ul className="dcong__list">
              {DEMO_NOTICES.map((n) => (
                <li key={n.title} className="dcong__item">
                  <p className="dcong__itemTop">
                    <span className="dcong__kind">{n.topic}</span>
                    <span
                      className={`dadmin__pill dadmin__pill--${
                        n.urgent ? "missing" : n.published ? "locked" : "draft"
                      }`}
                    >
                      {n.published ? (n.urgent ? "Sent now" : "Published") : "Draft"}
                    </span>
                  </p>
                  <p className="dcong__who">{n.title}</p>
                  <p className="dcong__detail">{n.body}</p>
                  <p className="dcong__meta">
                    <span className="dadmin__muted">{n.when}</span>
                    {n.reached ? (
                      <span className="dadmin__muted">
                        Reached {n.reached.toLocaleString("en-GB")} phones
                      </span>
                    ) : null}
                  </p>
                  {!n.published ? (
                    <button
                      type="button"
                      className="dcong__do dcong__do--small"
                      onClick={act(
                        `"${n.title}" published to the website and sent to about 1,180 phones. Anyone who turned notices off is not counted.`,
                      )}
                    >
                      Publish and send
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === "giving" ? (
          <section aria-label="Giving">
            <div className="dcong__bar">
              <button
                type="button"
                className="dcong__do"
                onClick={act(
                  `Gift Aid schedule prepared: ${money(DEMO_GIVING.unclaimed)} across ${
                    DEMO_DONATIONS.filter((d) => d.giftAid && !d.claimed).length
                  } donations, in the format HMRC accepts.`,
                )}
              >
                Claim the Gift Aid
              </button>
              <span className="dadmin__muted">
                MasjidOne takes {DEMO_GIVING.commission} of what is given
              </span>
            </div>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Donations, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  A donation without a Gift Aid declaration stores nothing that
                  names anybody. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Reference</th>
                    <th scope="col">Purpose</th>
                    <th scope="col" className="dadmin__num">Amount</th>
                    <th scope="col">Gift Aid</th>
                    <th scope="col">When</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_DONATIONS.map((d) => (
                    <tr key={d.reference}>
                      <th scope="row">{d.reference}</th>
                      <td>{d.purpose}</td>
                      <td className="dadmin__num">{money(d.amount)}</td>
                      <td>
                        {d.giftAid ? (
                          <span
                            className={`dadmin__pill dadmin__pill--${d.claimed ? "locked" : "draft"}`}
                          >
                            {d.claimed ? "Claimed" : "To claim"}
                          </span>
                        ) : (
                          <span className="dadmin__muted">No declaration</span>
                        )}
                      </td>
                      <td>{d.when}</td>
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

export default DemoCongregation;
