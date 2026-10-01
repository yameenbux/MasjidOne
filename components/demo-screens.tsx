"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { DemoNav } from "@/components/demo-nav";
import { HallScreen } from "@/components/demo-hall-screen";
import {
  DEMO_PRAYERS,
  type PrayerRow,
  DEMO_JUMUAH,
  DEMO_NEXT_JAMAAH,
  DEMO_NOTICES,
} from "@/lib/demo-data";

/**
 * Timetable and in-masjid screens.
 *
 * What a caretaker or an office volunteer opens: what the screens around the
 * building are saying right now, and the two things that change it — the
 * jamāʿah times, and the line that runs along the bottom.
 *
 * WHAT IS REAL AND WHAT IS NOT, because this matters before anyone demonstrates
 * it to a committee:
 *
 *  - The timetable is real. prayer_times holds a row per day with begins and
 *    jamāʿah for each prayer plus Jumuʿah, and a year is loaded.
 *  - A screen showing those times is real. It is a page opened on a television.
 *  - The announcement line is derived here from the most recent PUBLISHED
 *    notice, which needs no new table — notices already has `published`. That
 *    is also why it is honest: the screen cannot say something the website is
 *    not also saying, which is the behaviour a masjid actually wants.
 *  - A REGISTRY OF SCREENS IS NOT BUILT. There is no screens table, so there
 *    is no per-screen content, no "this television is offline", no naming the
 *    foyer one. This page therefore shows ONE screen output and says so. Do
 *    not let it imply four managed devices.
 */

/** 24-hour HH:MM, which is what a UK prayer board shows. */
function validTime(v: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

export function DemoScreens({
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
  const [said, setSaid] = React.useState<string | null>(null);
  const act = (m: string) => () => setSaid(m);

  /**
   * What the screens are showing, and what an editor has typed but not yet
   * saved. Keeping them apart is the whole point of the Edit mode: the preview
   * follows the draft so a committee can see the change before it reaches the
   * hall, and Cancel throws the draft away without anything having moved.
   *
   * In the real platform `live` would come from prayer_times and notices. Here
   * it starts as the published fixtures.
   */
  const [live, setLive] = React.useState<{
    prayers: PrayerRow[];
    announcements: string[];
  }>(() => ({
    prayers: DEMO_PRAYERS.map((p) => ({ ...p })),
    announcements: DEMO_NOTICES.filter((n) => n.published).map((n) => n.title),
  }));

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(live);
  /* The dialog holds the change until somebody says yes, and names it while it
     waits — a confirmation that only asks "are you sure?" teaches people to
     press Yes without reading it. */
  const [confirming, setConfirming] = React.useState(false);

  const prayers = editing ? draft.prayers : live.prayers;
  /* A half-typed time must not reach the screens, so Save waits for all of
     them to be whole. The previews show the draft either way, which is how
     somebody sees that 16:3 is not yet a time. */
  const timesOk = draft.prayers.every((p) => p.jamaah === "—" || validTime(p.jamaah));
  const announcements = editing ? draft.announcements : live.announcements;

  /** Exactly what is about to change, in the words the dialog will use. */
  const changes = React.useMemo(() => {
    const out: string[] = [];
    draft.prayers.forEach((d, i) => {
      const was = live.prayers[i];
      if (was && was.jamaah !== d.jamaah) {
        out.push(`${d.name} jamāʿah ${was.jamaah} → ${d.jamaah}`);
      }
      if (was && was.begins !== d.begins) {
        out.push(`${d.name} begins ${was.begins} → ${d.begins}`);
      }
    });
    draft.announcements.forEach((a, i) => {
      const was = live.announcements[i];
      if (was !== a) {
        out.push(was ? `Announcement: “${was}” → “${a}”` : `New announcement: “${a}”`);
      }
    });
    if (draft.announcements.length < live.announcements.length) {
      out.push(`${live.announcements.length - draft.announcements.length} announcement removed`);
    }
    return out;
  }, [draft, live]);

  function startEditing() {
    setDraft({
      prayers: live.prayers.map((p) => ({ ...p })),
      announcements: [...live.announcements],
    });
    setSaid(null);
    setEditing(true);
  }

  /* A modal that cannot be dismissed from the keyboard is a trap. Escape
     closes it, and focus moves into it on open so a screen reader lands on the
     heading rather than being left behind on the Save button. */
  const dialogRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!confirming) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirming(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming]);

  function applyChanges() {
    setLive(draft);
    setEditing(false);
    setConfirming(false);
    setSaid(
      `Saved. ${changes.length} change${changes.length === 1 ? "" : "s"} pushed to every screen and to the app. ` +
        "Recorded against your name in the audit trail.",
    );
  }

  return (
    <div className="dadmin">
      <header className="dadmin__top">
        <div>
          <p className="dadmin__portal">Timetable &amp; screens</p>
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

        <p className="dadmin__alert" role="status">
          <strong>
            Next jamāʿah: {DEMO_NEXT_JAMAAH.name} at {DEMO_NEXT_JAMAAH.at}.
          </strong>{" "}
          Every screen in the building is showing the table below. Change a time
          here and they all follow — there is only one set of times.
        </p>

        <p className="dcong__said" role="status" aria-live="polite">
          {said}
        </p>

        <section aria-label="What the screens are showing" className="dscreen__wallsect">
          <h2 className="dscreen__h">On the screens now</h2>
          {/* TWO SHAPES, ONE OUTPUT — and the caption says exactly that,
              because there is no screens table in the platform and no
              per-screen content. Showing four configurable televisions here
              would sell a committee something that does not exist. What does
              exist is better framed anyway: they manage one timetable, not a
              wall of screens. */}
          <div className="dscreen__wall">
            <figure className="dscreen__fig dscreen__fig--land">
              <div className="hallfrm hallfrm--land">
                <HallScreen
                  masjidName={masjidName}
                  orientation="landscape"
                  prayers={prayers}
                  announcements={announcements}
                />
              </div>
              <figcaption>
                <strong>Landscape</strong> — the wide screen over the miḥrāb.
              </figcaption>
            </figure>

            <figure className="dscreen__fig dscreen__fig--port">
              <div className="hallfrm hallfrm--port">
                <HallScreen
                  masjidName={masjidName}
                  orientation="portrait"
                  prayers={prayers}
                  announcements={announcements}
                />
              </div>
              <figcaption>
                <strong>Portrait</strong> — the tall one in the foyer.
              </figcaption>
            </figure>
          </div>

          <p className="dscreen__oneout">
            The same output in two shapes, not two screens to keep in step.
            Every television in the building shows this, however many you hang
            and whichever way round. Interface preview — the design is fixed,
            the words are yours.
          </p>

          {/* WHAT A MASJID ACTUALLY NEEDS.
              The first question after "that looks good" is "what do we have to
              buy", and a committee that cannot answer it cannot say yes. Every
              line here is true of a page opened on a television, which is what
              this is — so there is no box from us, nothing to install and no
              per-screen charge to find later.

              The network line is deliberately NOT written as "Ethernet is
              essential". It is not: the screen works on Wi-Fi. Writing a
              requirement the product does not have gets found out at
              installation, and a masjid with no cable run to the prayer hall
              would be sent to do building work it does not need. Giving the
              reason is stronger than giving the order. */}
          <div className="dreq">
            <h3 className="dreq__h">What a masjid needs for this</h3>
            <p className="dreq__lede">
              It is a web page shown on a television. That is the whole of it,
              and it is why the list is short.
            </p>

            <div className="dreq__cols">
              <div className="dreq__col">
                <p className="dreq__kicker">You will need</p>
                <ol className="dreq__list">
                  <li>
                    <strong>A screen.</strong> Any television or display with an
                    HDMI input, any size. Hang it landscape or portrait — for
                    portrait you want a panel or a bracket that turns.
                  </li>
                  <li>
                    <strong>A way to open a web page on it.</strong> Most smart
                    televisions have a browser built in and that is enough on
                    its own. If yours has not, any streaming stick or small
                    media player will do it. There is no box from us and nothing
                    proprietary to buy.
                  </li>
                  <li>
                    <strong>A network connection, wired if you can run one.</strong>{" "}
                    Wi-Fi works. But a screen that runs from Fajr to ʿIshāʾ every
                    day should not depend on it: a dropout leaves a blank screen
                    at jamāʿah and nobody notices until somebody complains. One
                    cable to the prayer hall is the best thing you can do for it.
                  </li>
                  <li>
                    <strong>Power that comes back by itself.</strong> Set the
                    television to switch on after a power cut, so the screen
                    returns without anybody fetching a remote.
                  </li>
                  <li>
                    <strong>Your address.</strong> One web address for your
                    masjid. Open it, make it full screen, leave it. Every screen
                    in the building opens the same one.
                  </li>
                </ol>
              </div>

              <div className="dreq__col">
                <p className="dreq__kicker">You will not need</p>
                <ul className="dreq__not">
                  <li>A Fire Stick, Chromecast or any box from us</li>
                  <li>Digital signage software, or a subscription to it</li>
                  <li>A computer in a cupboard</li>
                  <li>Anything to install, update or patch — it is a web page</li>
                  <li>A charge per screen, however many you hang</li>
                  <li>Anybody to come out and configure each one</li>
                </ul>
                <p className="dreq__note">
                  A consumer television is fine. A commercial panel is built to
                  be left on all day and will last longer if the hall screen
                  never goes off — worth knowing, not worth insisting on.
                </p>
              </div>
            </div>
          </div>

        </section>

        <div className="dscreen">
          <section aria-label="The announcement line" className="dscreen__live">
            <div className="dscreen__row">
              <p className="dscreen__label">The line along the bottom</p>
              <p className="dscreen__value">
                {announcements.length ? announcements.join(" · ") : "Nothing published"}
              </p>
              <p className="dscreen__note">
                Every published notice takes its turn along the bottom of the
                screen, so a janāzah today and half term next week both reach the
                hall. Publish another in the masjid office and the screens change
                with the website — a screen cannot say something the website is
                not also saying.
              </p>
            </div>
          </section>

          <section aria-label="Today's times" className="dscreen__times">
            <div className="dcong__bar">
              {editing ? (
                <>
                  <button
                    type="button"
                    className="dcong__do"
                    disabled={changes.length === 0 || !timesOk}
                    onClick={() => setConfirming(true)}
                  >
                    Save {changes.length ? `· ${changes.length}` : ""}
                  </button>
                  <button
                    type="button"
                    className="dscreen__cancel"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <span className="dadmin__muted">
                    {!timesOk
                      ? "A jamāʿah time needs to read HH:MM before this can be saved."
                      : changes.length
                        ? "The screens above are showing your draft. Nothing is live yet."
                        : "Change a time or an announcement and the screens above follow."}
                  </span>
                </>
              ) : (
                <>
                  <button type="button" className="dcong__do" onClick={startEditing}>
                    Edit these screens
                  </button>
                  <span className="dadmin__muted">365 days loaded for this year</span>
                </>
              )}
            </div>

            {editing ? (
              <div className="dscreen__edit">
                <h3 className="dscreen__editH">The announcement line</h3>
                <p className="dadmin__muted dscreen__editNote">
                  Each one takes its turn along the bottom of every screen.
                </p>
                {draft.announcements.map((a, idx) => (
                  <p className="dscreen__editField" key={idx}>
                    <label htmlFor={`ann-${idx}`}>Announcement {idx + 1}</label>
                    <span className="dscreen__editRow">
                      <input
                        id={`ann-${idx}`}
                        type="text"
                        value={a}
                        maxLength={80}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            announcements: d.announcements.map((x, j) =>
                              j === idx ? e.target.value : x,
                            ),
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="dscreen__drop"
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            announcements: d.announcements.filter((_, j) => j !== idx),
                          }))
                        }
                      >
                        Take off<span className="u-visually-hidden"> announcement {idx + 1}</span>
                      </button>
                    </span>
                  </p>
                ))}
              </div>
            ) : null}
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
                  {prayers.map((p, idx) => (
                    <tr key={p.name}>
                      <th scope="row">
                        {p.name === DEMO_NEXT_JAMAAH.name ? (
                          <span className="dcong__next">{p.name} · next</span>
                        ) : (
                          p.name
                        )}
                      </th>
                      {/* Begins is calculated from the almanac, so it is read-only
                          even in Edit. Jamāʿah is the masjid's own decision, which
                          is the whole reason this screen exists. */}
                      <td className="dadmin__num">{p.begins}</td>
                      <td className="dadmin__num">
                        {p.jamaah === "—" ? (
                          <span className="dadmin__muted">—</span>
                        ) : editing ? (
                          <>
                            <label
                              className="u-visually-hidden"
                              htmlFor={`jam-${idx}`}
                            >
                              {p.name} jamāʿah time
                            </label>
                            {/* A text field rather than type="time", which
                                renders in the BROWSER's locale: on a machine
                                set to en-US it prints "04:30 PM" in a column
                                whose other figures read 15:46. A UK masjid
                                board is 24-hour throughout and the demo cannot
                                depend on whose laptop it is opened on. */}
                            <input
                              id={`jam-${idx}`}
                              className={
                                validTime(p.jamaah)
                                  ? "dscreen__time"
                                  : "dscreen__time dscreen__time--bad"
                              }
                              type="text"
                              inputMode="numeric"
                              maxLength={5}
                              placeholder="HH:MM"
                              aria-invalid={!validTime(p.jamaah)}
                              value={p.jamaah}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  prayers: d.prayers.map((x, j) =>
                                    j === idx ? { ...x, jamaah: e.target.value } : x,
                                  ),
                                }))
                              }
                            />
                          </>
                        ) : (
                          p.jamaah
                        )}
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
        </div>
      </div>

      {/* THE CONFIRMATION, and why it is written like this.
          "Are you sure?" on every save teaches people to press Yes without
          reading, and within a month it is furniture. So the dialog names the
          exact change and its reach instead — a last check that carries
          information rather than friction. It also says "within the minute"
          rather than "instantly", because a screen on hall wifi is not instant
          and a committee will hold you to the word. */}
      {confirming ? (
        <div className="dmodal" role="presentation" onClick={() => setConfirming(false)}>
          <div
            className="dmodal__box"
            ref={dialogRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-h"
            aria-describedby="confirm-list"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="dmodal__h" id="confirm-h">
              {changes.length === 1
                ? "One change, going to every screen"
                : `${changes.length} changes, going to every screen`}
            </h2>
            <ul className="dmodal__list" id="confirm-list">
              {changes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="dmodal__reach">
              Every television in the building and everyone&rsquo;s app updates
              within the minute. Reminders shift with the time. It is recorded
              against your name.
            </p>
            <div className="dmodal__acts">
              <button type="button" className="dcong__do" onClick={applyChanges}>
                Yes, make it live
              </button>
              <button
                type="button"
                className="dscreen__cancel"
                onClick={() => setConfirming(false)}
              >
                No, keep editing
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

export default DemoScreens;
