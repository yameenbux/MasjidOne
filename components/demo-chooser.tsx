"use client";

import * as React from "react";

/**
 * The screen between signing in and the portal itself: madrasah, or congregation.
 *
 * This is the join made visible. Everything MasjidOne argues rests on the two
 * halves being one system over one record of one family, and a committee has
 * to SEE both halves exist before that sentence means anything. So neither
 * option is a dead end — both lead somewhere real.
 *
 * Two full-height halves rather than cards: board against paper, each with its
 * device bleeding off the bottom edge. A choice of two worlds, with no card
 * chrome between the person and either one. Chosen from three drafts; the
 * other two — a grid of cards, and a prayer-board of rows — are gone.
 *
 * The device images are the existing interface previews, admin-register and
 * hall-screen. Both are modules that are built and running, so neither needs an
 * "in development" tag. app-parent is deliberately NOT used: parent access has
 * no accounts yet and may not be shown without its tag.
 *
 * They are drawn `contain`, never `cover`. The files are pictures of a device
 * on a transparent surround, and cover crops the bezel off the top — the part
 * that says "this is a screen".
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type PortalKey = "madrasah" | "congregation";

type Portal = {
  key: PortalKey;
  title: string;
  blurb: string;
  img: string;
  alt: string;
};

const PORTALS: Portal[] = [
  {
    key: "madrasah",
    title: "Madrasah Portal",
    blurb: "Registers, classes, families and fees.",
    img: `${BASE}/devices/admin-register.webp`,
    alt: "The madrasah register for one class, with the evening's attendance and the lock",
  },
  {
    key: "congregation",
    title: "Congregation Portal",
    blurb: "Prayer times, notices, screens and giving.",
    img: `${BASE}/devices/hall-screen.webp`,
    alt: "A prayer hall screen showing the beginning and jamāʿah times with the next jamāʿah marked",
  },
];

export function DemoChooser({
  masjidName,
  onChoose,
}: {
  masjidName: string;
  onChoose: (k: PortalKey) => void;
}) {
  return (
    <div className="pick">
      {/* The masjid's name is the page's heading, because the masjid is whose
          building this is. The question underneath is what the person is
          actually here to answer, so it is set in brass rather than left to
          look like a caption. */}
      <header className="psplit__head">
        <h1 className="psplit__masjid">{masjidName}</h1>
        <p className="psplit__ask">Where would you like to go?</p>
      </header>

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
              Open <span className="psplit__arrow">→</span>
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

export default DemoChooser;
