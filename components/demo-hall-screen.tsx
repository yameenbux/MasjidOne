"use client";

import * as React from "react";
import {
  DEMO_PRAYERS,
  DEMO_JUMUAH,
  DEMO_NEXT_JAMAAH,
  DEMO_NOTICES,
  DEMO_SCREEN_CLOCK,
  type PrayerRow,
} from "@/lib/demo-data";

/**
 * The prayer hall screen, rendered from the timetable rather than photographed.
 *
 * WHY THIS IS A COMPONENT AND NOT A PICTURE. It used to be both: the Timetable
 * view rendered it live, and the portal chooser showed a fixed capture. The
 * capture was made before the demo's prayer times were last edited, so the two
 * drifted — the chooser read Fajr 05:12 and a clock of 18:42 while the
 * Timetable view two clicks later read 05:42 and 15:52.
 *
 * That is worse than an ordinary stale asset. Prayer times are the one thing in
 * this system every man in the room knows by heart, and the claim the screen
 * makes is "change a time here and they all follow — there is only one set of
 * times". A demonstration showing two timetables contradicts the exact feature
 * being sold, on the screen that sells it.
 *
 * TWO SHAPES, ONE OUTPUT. A masjid mounts televisions both ways round — a wide
 * one over the miḥrāb, a tall one in the foyer — so the screen has a portrait
 * layout as well as a landscape one. They are the same content in a different
 * shape, NOT two configurable displays: there is no screens table in the
 * platform and no per-screen content. Do not let this imply otherwise. The
 * honest line, and the better sales line, is that a committee manages one
 * timetable rather than four screens.
 *
 * It remains an interface preview, not a photograph of a television.
 */

export type HallOrientation = "landscape" | "portrait";

/** How long each announcement holds before the next one slides up. */
const ROTATE_MS = 5000;

export function HallScreen({
  masjidName,
  orientation = "landscape",
  /** Smaller type and tighter rows, for the thumbnail on the portal chooser. */
  compact = false,
  /** Overrides the published timetable, so an edit can be previewed live. */
  prayers,
  /** Overrides the announcement line, same reason. */
  announcements,
}: {
  masjidName: string;
  orientation?: HallOrientation;
  compact?: boolean;
  prayers?: readonly PrayerRow[];
  announcements?: readonly string[];
}) {
  const rows = prayers ?? DEMO_PRAYERS;

  /* The line along the bottom carries every PUBLISHED notice in turn. It needs
     no table of its own, and it means the screen cannot say something the
     website is not also saying — the same rule the single-notice version had,
     now able to carry a janāzah today and half term next week at once. */
  const live = React.useMemo(
    () =>
      announcements ??
      DEMO_NOTICES.filter((n) => n.published).map((n) => n.title),
    [announcements],
  );

  const [i, setI] = React.useState(0);

  /* Reset when the list changes, or editing down to one notice leaves the
     index pointing past the end and the banner goes blank. */
  React.useEffect(() => {
    setI(0);
  }, [live.length]);

  React.useEffect(() => {
    if (compact || live.length < 2) return;
    /* Somebody who has asked for less motion gets the first notice and no
       rotation, rather than a banner that moves for the length of a meeting. */
    const still =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still) return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % live.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(t);
  }, [compact, live.length]);

  const showing = live.length ? live[i % live.length] : "No notice published";

  return (
    <div
      className={[
        "hallscr",
        `hallscr--${orientation}`,
        compact ? "hallscr--compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
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
          {rows.map((p) => {
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

        {/* The rotation is hidden from assistive technology and the whole list
            given once instead. A live region re-announcing a notice every five
            seconds for the length of a meeting is worse than useless. */}
        <span className="hallscr__ticker" aria-hidden="true">
          <span key={`${i}-${showing}`} className="hallscr__tickerItem">
            {showing}
          </span>
        </span>
        <span className="u-visually-hidden">
          {live.length
            ? `Announcements showing in turn: ${live.join(". ")}`
            : "No notice published"}
        </span>
      </div>
    </div>
  );
}
