"use client";

import * as React from "react";
import { DEMO_TOTALS, DEMO_CONGREGATION } from "@/lib/demo-data";

/**
 * The screen between signing in and the portal itself: madrasah, or congregation.
 *
 * This is the join made visible. Everything MasjidOne argues rests on the two
 * halves being one system over one record of one family, and a committee has
 * to SEE both halves exist before that sentence means anything. So neither
 * option is a dead end — both lead somewhere real.
 *
 * Three variants are drafted here so one can be chosen. They are three
 * different structures, not one structure in three colourways:
 *
 *   A · Cards   two cards on paper, image above title. The safe, familiar
 *               shape. Reads instantly, looks like most software.
 *   B · Split   two full-height halves, board against paper, imagery bleeding
 *               off the edge. No card chrome. A choice of worlds.
 *   C · Board   the masjid's own prayer board: dark ground, brass hairlines,
 *               two wide rows with an index numeral and a begins/jamāʿah pair.
 *               The most particular to this product, the least generic.
 *
 * Pick with ?chooser=a|b|c. Whichever wins, the losers come out.
 *
 * Imagery is the existing interface previews — admin-register for the madrasah
 * and hall-screen for the congregation. Both are modules that are built and
 * running, so neither needs an "in development" tag. app-parent is deliberately
 * NOT used here: parent access has no accounts yet and may not be shown without
 * its tag.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type PortalKey = "madrasah" | "congregation";

type Portal = {
  key: PortalKey;
  title: string;
  blurb: string;
  /** Two figures, shown as a begins/jamāʿah-style pair in variant C. */
  stats: [string, string][];
  img: string;
  alt: string;
};

const PORTALS: Portal[] = [
  {
    key: "madrasah",
    title: "Madrasah Portal",
    blurb: "Registers, classes, families and fees.",
    stats: [
      [`${DEMO_TOTALS.pupils}`, "pupils"],
      [`${DEMO_TOTALS.classes}`, "classes"],
    ],
    img: `${BASE}/devices/admin-register.webp`,
    alt: "The madrasah register for one class, with the evening's attendance and the lock",
  },
  {
    key: "congregation",
    title: "Congregation Portal",
    blurb: "Prayer times, notices, screens and giving.",
    stats: [
      ["6", "prayers"],
      [`${DEMO_CONGREGATION.hallScreens}`, "screens"],
    ],
    img: `${BASE}/devices/hall-screen.webp`,
    alt: "A prayer hall screen showing the beginning and jamāʿah times with the next jamāʿah marked",
  },
];

export type ChooserVariant = "a" | "b" | "c";

export function DemoChooser({
  masjidName,
  variant,
  onChoose,
}: {
  masjidName: string;
  variant: ChooserVariant;
  onChoose: (k: PortalKey) => void;
}) {
  if (variant === "b") return <Split masjidName={masjidName} onChoose={onChoose} />;
  if (variant === "c") return <Board masjidName={masjidName} onChoose={onChoose} />;
  return <Cards masjidName={masjidName} onChoose={onChoose} />;
}

/* ------------------------------------------------------------------ A · Cards */

function Cards({
  masjidName,
  onChoose,
}: {
  masjidName: string;
  onChoose: (k: PortalKey) => void;
}) {
  return (
    <div className="pick pick--cards">
      <header className="pick__head">
        <p className="pick__eyebrow">Signed in</p>
        <h1 className="pick__masjid">{masjidName}</h1>
        <p className="pick__ask">Where would you like to go?</p>
      </header>

      <ul className="pcards">
        {PORTALS.map((p) => (
          <li key={p.key}>
            <button type="button" className="pcard" onClick={() => onChoose(p.key)}>
              <span className="pcard__shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.alt} loading="lazy" width={1600} height={1000} />
              </span>
              <span className="pcard__body">
                <span className="pcard__title">{p.title}</span>
                <span className="pcard__blurb">{p.blurb}</span>
                <span className="pcard__go" aria-hidden="true">
                  Open <span className="pcard__arrow">→</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ B · Split */

function Split({
  masjidName,
  onChoose,
}: {
  masjidName: string;
  onChoose: (k: PortalKey) => void;
}) {
  return (
    <div className="pick pick--split">
      <p className="psplit__masjid">{masjidName}</p>
      {PORTALS.map((p) => (
        <button
          key={p.key}
          type="button"
          className={`psplit__half psplit__half--${p.key}`}
          onClick={() => onChoose(p.key)}
        >
          <span className="psplit__text">
            <span className="psplit__title">{p.title}</span>
            <span className="psplit__blurb">{p.blurb}</span>
            <span className="psplit__go" aria-hidden="true">
              Open <span className="pcard__arrow">→</span>
            </span>
          </span>
          <span className="psplit__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt={p.alt} loading="lazy" width={1600} height={1000} />
          </span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ C · Board */

function Board({
  masjidName,
  onChoose,
}: {
  masjidName: string;
  onChoose: (k: PortalKey) => void;
}) {
  return (
    <div className="pick pick--board">
      <header className="pboard__head">
        <h1 className="pboard__masjid">{masjidName}</h1>
        <p className="pboard__ask">Choose a portal</p>
      </header>

      <ul className="pboard">
        {PORTALS.map((p, i) => (
          <li key={p.key}>
            <button type="button" className="prow" onClick={() => onChoose(p.key)}>
              <span className="prow__no" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="prow__main">
                <span className="prow__title">{p.title}</span>
                <span className="prow__blurb">{p.blurb}</span>
              </span>
              <span className="prow__stats">
                {p.stats.map(([n, label]) => (
                  <span key={label} className="prow__stat">
                    <span className="prow__n">{n}</span>
                    <span className="prow__l">{label}</span>
                  </span>
                ))}
              </span>
              <span className="prow__shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.alt} loading="lazy" width={1600} height={1000} />
              </span>
              <span className="prow__arrow" aria-hidden="true">→</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DemoChooser;
