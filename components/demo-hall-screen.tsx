"use client";

import * as React from "react";
import {
  DEMO_PRAYERS,
  DEMO_JUMUAH,
  DEMO_NEXT_JAMAAH,
  DEMO_NOTICES,
  DEMO_SCREEN_CLOCK,
} from "@/lib/demo-data";

/**
 * The prayer hall screen, rendered from the timetable rather than photographed.
 *
 * WHY THIS IS A COMPONENT AND NOT A PICTURE. It used to be both: the Timetable
 * view rendered it live, and the portal chooser showed a fixed capture,
 * public/devices/hall-screen.webp. The capture was made before the demo's
 * prayer times were last edited, so the two drifted — the chooser read Fajr
 * 05:12 and a clock of 18:42 while the Timetable view two clicks later read
 * 05:42 and 15:52. Same masjid, same sitting, two timetables.
 *
 * That is worse than an ordinary stale asset. Prayer times are the one thing
 * in this system every man in the room knows by heart, and the claim the
 * screen makes is "change a time here and they all follow — there is only one
 * set of times". A demonstration showing two timetables contradicts the exact
 * feature being sold, on the screen that sells it.
 *
 * So there is one source now. An edit to DEMO_PRAYERS moves every place the
 * screen appears, which is also what the real product does.
 *
 * It remains an interface preview, not a photograph of a television.
 */
export function HallScreen({
  masjidName,
  /** Smaller type and tighter rows, for the thumbnail on the portal chooser. */
  compact = false,
}: {
  masjidName: string;
  compact?: boolean;
}) {
  /* The line along the bottom is the most recent published notice. It needs no
     table of its own, and it means the screen cannot say something the website
     is not also saying. */
  const onScreen = DEMO_NOTICES.find((n) => n.published);

  return (
    <div className={compact ? "hallscr hallscr--compact" : "hallscr"}>
      <div className="hallscr__top">
        <span className="hallscr__brand">{masjidName} · Prayer hall</span>
        <span className="hallscr__clock">{DEMO_SCREEN_CLOCK}</span>
      </div>
      <table className="hallscr__table">
        <caption className="u-visually-hidden">
          What the prayer hall screen is showing: beginning and jamāʿah times,
          with the next jamāʿah marked.
        </caption>
        <thead>
          <tr>
            <th scope="col">Prayer</th>
            <th scope="col">Begins</th>
            <th scope="col">Jamāʿah</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_PRAYERS.map((p) => {
            const next = p.name === DEMO_NEXT_JAMAAH.name;
            return (
              <tr key={p.name} className={next ? "hallscr__next" : undefined}>
                <th scope="row">
                  {next ? (
                    <span aria-hidden="true" className="hallscr__dot">
                      ▪
                    </span>
                  ) : null}
                  {p.name}
                  {next ? <span className="u-visually-hidden"> — next</span> : null}
                </th>
                <td>{p.begins}</td>
                <td>{p.jamaah}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="hallscr__foot">
        <span>{DEMO_JUMUAH.map((j) => `${j.label} ${j.time}`).join(" · ")}</span>
        <span className="hallscr__ticker">
          {onScreen ? onScreen.title : "No notice published"}
        </span>
      </div>
    </div>
  );
}
