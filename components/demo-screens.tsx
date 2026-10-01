"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { DemoNav } from "@/components/demo-nav";
import { HallScreen } from "@/components/demo-hall-screen";
import {
  DEMO_PRAYERS,
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

  /** The screen's bottom line is the latest published notice. One source. */
  const onScreen = DEMO_NOTICES.find((n) => n.published);

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

        <div className="dscreen">
          <section aria-label="What the screens are showing" className="dscreen__live">
            <h2 className="dscreen__h">On the screens now</h2>
            <figure className="dscreen__fig">
              {/* The preview is RENDERED FROM THE SAME DATA as the table beside
                  it, not a picture of a screen. It has to be: this view's whole
                  claim is "every screen is showing the table below", so a static
                  capture would be visibly contradicting that claim on the very
                  page that makes it — different times, a notice from a different
                  day. Rendered, an edit to the times moves both at once, which
                  is also what the real product does. It is still an interface
                  preview, not a photograph of a television. */}
              <HallScreen masjidName={masjidName} />
              <figcaption>
                One output, shown on every television in the building. Interface
                preview — the design is fixed, the words are yours.
              </figcaption>
            </figure>

            <div className="dscreen__row">
              <p className="dscreen__label">The line along the bottom</p>
              <p className="dscreen__value">
                {onScreen ? onScreen.title : "Nothing published"}
              </p>
              <p className="dscreen__note">
                This is your most recent published notice. Publish another in the
                masjid office and the screens change with the website — a screen
                cannot say something the website is not also saying.
              </p>
            </div>
          </section>

          <section aria-label="Today's times" className="dscreen__times">
            <div className="dcong__bar">
              <button
                type="button"
                className="dcong__do"
                onClick={act(
                  "ʿAsr jamāʿah moved to 16:30. Every screen follows within the minute, the app updates, and the reminder shifts to 16:00 for everyone who asked for half an hour.",
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
        </div>
      </div>

      <footer className="dadmin__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

export default DemoScreens;
