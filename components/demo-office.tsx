"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { DemoNav } from "@/components/demo-nav";
import { DEMO_ROLES, DEMO_AUDIT, DEMO_STAFF, DEMO_STAFF_SUMMARY, DEMO_LOGIN_STATE } from "@/lib/demo-data";
import {
  DEMO_PUSHES,
  DEMO_APP_REACH,
  DEMO_REQUESTS,
  DEMO_NOTICES,
  DEMO_DONATIONS,
  DEMO_GIVING,
  DEMO_CONGREGATION,
} from "@/lib/demo-data";

/**
 * The masjid office: everything on the congregation side that is not the
 * timetable or the screens.
 *
 * The congregation portal was one screen and is now two, because the two jobs
 * have nothing to do with each other and are rarely done by the same person. A
 * caretaker changing ʿIshāʾ for the winter does not want to walk past hall
 * deposits to reach it, and the trustee chasing a nikah fee does not want the
 * prayer table in the way. Timetable and screens live next door; this is the
 * desk work.
 *
 * Three tabs, matching the madrasah portal's three so the halves read as one
 * product. Each opens with the thing somebody most often came to do.
 *
 *   Requests  hall hire, nikah, chanda collections, course places and madrasah
 *             admissions. Five public forms the office must answer, all
 *             carrying the same reference/status/office_notes shape, and
 *             together most of the actual work. The admission is marked
 *             because it is the join in one row: a form on the congregation
 *             side becoming a child on the madrasah side.
 *   Notices   drafts until somebody presses Publish, and publishing can send
 *             to the app AND changes the line along the bottom of every screen
 *             in the building. The janāzah is the case that matters — a death
 *             known at eleven, a burial after Zuhr, so the only useful version
 *             reaches people in minutes.
 *   Giving    0% commission, and unclaimed Gift Aid, which is money the
 *             committee can go and collect.
 *
 * Every shape mirrors a table that is built. Nothing here shows hall screens
 * as managed devices or an appeal with a running total: neither has a table,
 * and a demo that shows a screen the platform cannot produce is a promise that
 * comes due in week three.
 */

const money = (n: number) => `£${n.toLocaleString("en-GB")}`;

type Tab = "requests" | "notices" | "giving" | "committee";

export function DemoOffice({
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
  const [tab, setTab] = React.useState<Tab>("requests");

  /* The push composer. A notification is the one thing on this portal that
     cannot be taken back, so the draft is held here and only leaves on an
     explicit confirmation that says so. */
  const [push, setPush] = React.useState({
    topic: "Masjid",
    title: "",
    body: "",
    alsoPublish: true,
  });
  const [confirmPush, setConfirmPush] = React.useState(false);
  const pushReady = push.title.trim().length > 3;

  /* Same keyboard contract as the screens confirmation: focus enters on open,
     Escape leaves. A modal that can only be dismissed with a mouse is a trap. */
  const pushDialogRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!confirmPush) return;
    pushDialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmPush(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmPush]);
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
          <p className="dadmin__portal">Masjid office</p>
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
        <DemoNav onBack={onBack} onHome={onHome} homeLabel="Congregation home" />

        <ul className="dadmin__tiles">
          {[
            [String(DEMO_CONGREGATION.needsYou), "Need an answer"],
            [String(DEMO_CONGREGATION.drafts), "Notices in draft"],
            [money(DEMO_GIVING.month), "Given this month"],
            [money(DEMO_GIVING.unclaimed), "Gift Aid unclaimed"],
          ].map(([value, label]) => (
            <li key={label} className="dadmin__tile">
              <span className="dadmin__tileN">{value}</span>
              <span className="dadmin__tileL">{label}</span>
            </li>
          ))}
        </ul>

        <p className="dadmin__alert" role="status">
          <strong>{DEMO_CONGREGATION.needsYou} requests are waiting.</strong> The
          oldest has been sitting four days, and one hall hold expires in 46
          hours. Prayer times and the screens are next door, under Timetable
          &amp; screens.
        </p>

        <nav className="dadmin__tabs" aria-label="Sections">
          {(
            [
              ["requests", `Requests · ${DEMO_CONGREGATION.needsYou}`],
              ["notices", `Notices · ${DEMO_CONGREGATION.drafts} draft`],
              ["giving", "Giving"],
              ["committee", "Committee"],
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
            {/* SEND TO THE APP.
                Built: app_notification_start and app_notification_finish write
                app_notifications, app_notifications_list reads it back, and one
                has been sent for real. The shape below follows that table — a
                topic, a title, a body, an optional link to a notice, a status
                and a recipient count — rather than being invented for a demo.

                A push is the one action in this portal that CANNOT BE UNDONE.
                A prayer time can be changed back; a notification on fourteen
                hundred lock screens cannot. That is why the confirmation says
                so in those words instead of asking "are you sure". */}
            <div className="dpush">
              <h2 className="dadmin__h">Send to the app</h2>
              <p className="dadmin__muted dpush__lede">
                Reaches {DEMO_APP_REACH.devices.toLocaleString("en-GB")} phones —{" "}
                {DEMO_APP_REACH.ios.toLocaleString("en-GB")} iPhone,{" "}
                {DEMO_APP_REACH.android.toLocaleString("en-GB")} Android. One
                message, both stores.
              </p>

              <div className="dpush__form">
                <p className="dpush__field dpush__field--topic">
                  <label htmlFor="push-topic">Topic</label>
                  <select
                    id="push-topic"
                    value={push.topic}
                    onChange={(e) => setPush((d) => ({ ...d, topic: e.target.value }))}
                  >
                    {["Janāzah", "Masjid", "Madrasah", "Appeal", "Reminder"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </p>
                <p className="dpush__field dpush__field--wide">
                  <label htmlFor="push-title">What it says</label>
                  <input
                    id="push-title"
                    type="text"
                    maxLength={65}
                    placeholder="Janāzah after Zuhr today"
                    value={push.title}
                    onChange={(e) => setPush((d) => ({ ...d, title: e.target.value }))}
                  />
                  <span className="dpush__count">
                    {push.title.length}/65 — a lock screen shows about this much
                  </span>
                </p>
                <p className="dpush__field dpush__field--wide">
                  <label htmlFor="push-body">The line underneath</label>
                  <input
                    id="push-body"
                    type="text"
                    maxLength={120}
                    placeholder="Burial to follow at the cemetery."
                    value={push.body}
                    onChange={(e) => setPush((d) => ({ ...d, body: e.target.value }))}
                  />
                </p>
                <p className="dpush__check">
                  <input
                    id="push-publish"
                    type="checkbox"
                    checked={push.alsoPublish}
                    onChange={(e) => setPush((d) => ({ ...d, alsoPublish: e.target.checked }))}
                  />
                  <label htmlFor="push-publish">
                    Publish the same words to the website and the hall screens
                    <span className="dadmin__muted">
                      {" "}— so a screen cannot say something the website is not
                      also saying.
                    </span>
                  </label>
                </p>
              </div>

              <div className="dcong__bar">
                <button
                  type="button"
                  className="dcong__do"
                  disabled={!pushReady}
                  onClick={() => setConfirmPush(true)}
                >
                  Send to the app
                </button>
                <span className="dadmin__muted">
                  {pushReady
                    ? "This cannot be unsent."
                    : "Write what it says before it can be sent."}
                </span>
              </div>

              <h3 className="dpush__h">Already sent</h3>
              <ul className="dpush__list">
                {DEMO_PUSHES.map((n) => (
                  <li className={`dpush__row dpush__row--${n.status}`} key={n.title}>
                    <span className="dpush__kind">{n.topic}</span>
                    <span className="dpush__title">
                      {n.title}
                      {n.body ? <span className="dpush__body">{n.body}</span> : null}
                    </span>
                    <span className="dpush__when">{n.when}</span>
                    <span className="dpush__reach">
                      {n.status === "sent" ? (
                        <>
                          {n.recipients?.toLocaleString("en-GB")} phones
                          {n.alsoPublished ? (
                            <span className="dadmin__muted"> · also on the website</span>
                          ) : null}
                        </>
                      ) : n.status === "failed" ? (
                        <span className="dpush__failed">Failed — {n.error}</span>
                      ) : (
                        "Sending…"
                      )}
                    </span>
                  </li>
                ))}
              </ul>
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
        {tab === "committee" ? (
          <>
            <p className="dadmin__intro">
              Who can do what, and what has been done. This is the first thing
              trustees ask about and the last thing most systems answer, because
              the usual answer is one shared password in a drawer.
            </p>

            {/* The screen that unblocks the product. Parent access is not
                waiting on code so much as on somebody pressing this. */}
            <div className="dimport" style={{ marginTop: 0 }}>
              <h2 className="dadmin__h">Give somebody an account</h2>
              <ul className="dimport__nums">
                <li>
                  <span className="dadmin__tileN">
                    {DEMO_LOGIN_STATE.teachersWithLogin}/{DEMO_LOGIN_STATE.teachersTotal}
                  </span>
                  <span className="dadmin__tileL">teachers have a login</span>
                </li>
                <li>
                  <span className="dadmin__tileN">
                    {DEMO_LOGIN_STATE.parentsWithLogin}/{DEMO_LOGIN_STATE.householdsTotal}
                  </span>
                  <span className="dadmin__tileL">households have a login</span>
                </li>
              </ul>
              <div className="dcong__bar">
                <button
                  type="button"
                  className="dcong__do"
                  onClick={act(
                    "Account created and an invitation sent. They set their own password from the link — nobody at the masjid ever types or knows it, and nobody has to telephone anyone a password.",
                  )}
                >
                  Create a teacher login
                </button>
                <button
                  type="button"
                  className="dcong__do dcong__do--small"
                  onClick={act(
                    "Invitations sent to every household with an email on file — 256 of 268. The twelve without one get an office-issued sign-in on paper instead, so no family is left out.",
                  )}
                >
                  Invite the parents
                </button>
              </div>
              <p className="dimport__carried">
                An account is always issued, never self-registered. The office
                decides who is a parent of which family, because that is the
                one question a stranger must not be able to answer for
                themselves.
              </p>
            </div>

            <h2 className="dadmin__h">Roles</h2>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Roles, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Access is granted per person, per role. Nobody sees everything
                  by default — including the admins, who can see everything but
                  leave a trail doing it. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col" className="dadmin__num">People</th>
                    <th scope="col">What it reaches</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ROLES.map((r) => (
                    <tr key={r.role}>
                      <th scope="row">
                        {r.role}
                        {r.unused ? (
                          <span className="dadmin__muted"> · no invitations sent yet</span>
                        ) : null}
                      </th>
                      <td className={r.unused ? "dadmin__num dadmin__muted" : "dadmin__num"}>
                        {r.people}
                      </td>
                      <td>{r.can}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="dcong__said">
              The parent role is built and ready to issue; this masjid has
              simply not invited its families yet, which is what day one looks
              like. Use the button above and a household signs in to the same
              app it already has for jamāʿah times. The role is listed rather
              than hidden — a role that exists in the system should be visible
              in the system.
            </p>

            <h2 className="dadmin__h">
              Staff and DBS
              {DEMO_STAFF_SUMMARY.attention > 0 ? (
                <span className="dadmin__muted">
                  {" "}· {DEMO_STAFF_SUMMARY.attention} need attention
                </span>
              ) : null}
            </h2>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Staff, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  A trustee asks about DBS before they ask about anything else,
                  and the honest answer is a list rather than a reassurance.
                  Missing and expiring are shown, not hidden. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                    <th scope="col" className="dadmin__num">Classes</th>
                    <th scope="col">DBS</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_STAFF.map((p) => (
                    <tr key={p.name}>
                      <th scope="row">{p.name}</th>
                      <td>{p.role}</td>
                      <td className="dadmin__num">{p.classes}</td>
                      <td>
                        {p.dbs === "Valid" ? (
                          <span className="dadmin__muted">Valid · {p.dbsOn}</span>
                        ) : (
                          <>
                            <span className="dcong__next" aria-hidden="true">▪ </span>
                            {p.dbs}{p.dbsOn ? ` · ${p.dbsOn}` : ""}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="dadmin__h">What has been done</h2>
            <div className="dadmin__scroll" tabIndex={0} role="region" aria-label="Audit log, scrollable">
              <table className="dadmin__table">
                <caption className="dadmin__cap">
                  Not only a list of who clicked what. Most of this log is the
                  platform keeping the retention promises the masjid was sold —
                  holds released, records aged out on schedule — alongside the
                  human actions and anything that looks wrong. Sample data.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">Who</th>
                    <th scope="col">What</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_AUDIT.map((a) => (
                    <tr key={a.at + a.action}>
                      <th scope="row" className="dadmin__muted">{a.at}</th>
                      <td>{a.who}</td>
                      <td>
                        <span className={a.kind === "flag" ? "dcong__next" : undefined}>
                          {a.detail}
                        </span>
                        <span className="dadmin__muted dcong__ref"> {a.action}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

      </div>

      {/* A push cannot be recalled. The screens dialog says what a change will
          reach; this one has to say what cannot be taken back, because that is
          the difference between the two actions and the only thing somebody
          needs to weigh in the second before they press it. */}
      {confirmPush ? (
        <div className="dmodal" role="presentation" onClick={() => setConfirmPush(false)}>
          <div
            className="dmodal__box"
            ref={pushDialogRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="push-confirm-h"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="dmodal__h" id="push-confirm-h">
              This cannot be unsent
            </h2>
            <ul className="dmodal__list">
              <li>
                <strong>{push.topic}</strong> — {push.title}
                {push.body ? <span className="dadmin__muted"> · {push.body}</span> : null}
              </li>
              <li>
                {DEMO_APP_REACH.devices.toLocaleString("en-GB")} phones:{" "}
                {DEMO_APP_REACH.ios.toLocaleString("en-GB")} iPhone and{" "}
                {DEMO_APP_REACH.android.toLocaleString("en-GB")} Android
              </li>
              {push.alsoPublish ? (
                <li>Also published to the website and every hall screen</li>
              ) : null}
            </ul>
            <p className="dmodal__reach">
              It arrives on lock screens within about a minute. A notification
              cannot be recalled once it has gone — you can send a correction,
              but you cannot take this one back. It is recorded against your
              name.
            </p>
            <div className="dmodal__acts">
              <button
                type="button"
                className="dcong__do"
                onClick={() => {
                  setConfirmPush(false);
                  setSaid(
                    `Sent. "${push.title}" reached ${DEMO_APP_REACH.devices.toLocaleString("en-GB")} phones` +
                      (push.alsoPublish ? ", the website and every screen." : ".") +
                      " Recorded against your name.",
                  );
                  setPush((d) => ({ ...d, title: "", body: "" }));
                }}
              >
                Yes, send it now
              </button>
              <button
                type="button"
                className="dscreen__cancel"
                onClick={() => setConfirmPush(false)}
              >
                No, go back
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="dadmin__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

export default DemoOffice;
