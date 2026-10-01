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
 * ONE MARKUP, TWO LAYOUTS, chosen by width in globals.css:
 *
 *   Wide    two full-height halves, board against paper, each device bleeding
 *           off the bottom edge. A choice of two worlds, no card chrome.
 *   Narrow  the masjid's own prayer board: one dark ground, brass hairlines,
 *           an index numeral and a small inset per row.
 *
 * The split is the better desktop screen and the worse phone one — at 360px
 * its two halves run about 700px each, so the second option sits below the
 * fold and a committee member has to scroll to discover there is a choice at
 * all. Rows put both on one screen. That is the whole reason for the swap.
 *
 * It is one DOM either way. Rendering two component trees and hiding one would
 * double the markup, load both images twice, and leave a screen reader
 * announcing the hidden copy. So every element below is present at both
 * widths; the stylesheet moves them and hides the two that only belong to one
 * layout — the numeral, which is decorative, and the word "Open", whose arrow
 * stays and carries the meaning on its own.
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
      <header className="pick__head">
        <h1 className="pick__masjid">{masjidName}</h1>
        <p className="pick__ask">Where would you like to go?</p>
      </header>

      {PORTALS.map((p, i) => (
        <button
          key={p.key}
          type="button"
          className={`pchoose pchoose--${p.key}`}
          onClick={() => onChoose(p.key)}
        >
          <span className="pchoose__no" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="pchoose__text">
            <span className="pchoose__title">{p.title}</span>
            <span className="pchoose__blurb">{p.blurb}</span>
          </span>
          {/* A direct child of the button, not of the text: the narrow layout
              puts it in its own grid cell at the end of the row, the wide one
              lets it fall under the text as the next flex item. Nested inside
              the text it could only ever be one or the other. */}
          <span className="pchoose__go" aria-hidden="true">
            <span className="pchoose__goword">Open </span>
            <span className="pchoose__arrow">→</span>
          </span>
          <span className="pchoose__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt={p.alt} loading="lazy" width={1600} height={1000} />
          </span>
        </button>
      ))}
    </div>
  );
}

export default DemoChooser;
