"use client";

import * as React from "react";
import { PoweredBy } from "@/components/ui/powered-by";
import { CONTACT_EMAIL } from "@/lib/site";
import { DemoNav } from "@/components/demo-nav";

/**
 * A screen that asks the person to choose between two places.
 *
 * Used twice: once at the top to pick a portal, and once inside the
 * congregation portal to pick between the masjid's screens and the office. It
 * is the same component both times because it is the same question, and
 * because a committee that learns the shape once should not have to learn it
 * again one level down.
 *
 * ONE MARKUP, TWO LAYOUTS, chosen by width in globals.css:
 *
 *   Wide    two full-height halves, board against paper, each device bleeding
 *           off the bottom edge. A choice of two worlds, no card chrome.
 *   Narrow  two cards stacked down the middle, the device above the words.
 *
 * The split is the better desktop screen and the worse phone one — at 390px
 * its two halves run about 700px each, so the second option sits below the
 * fold and a committee member has to scroll to discover there is a choice at
 * all. Stacked cards put both on one screen.
 *
 * It is one DOM either way. Rendering two component trees and hiding one would
 * double the markup, load both images twice, and leave a screen reader
 * announcing the hidden copy.
 *
 * Images are drawn `contain`, never `cover`. The files are pictures of a
 * device on a transparent surround, and cover crops the bezel off the top —
 * the part that says "this is a screen".
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type ChooserOption = {
  key: string;
  title: string;
  blurb: string;
  /** File name inside public/devices. */
  img: string;
  alt: string;
};

export function demoImg(file: string) {
  return `${BASE}/devices/${file}`;
}

export function DemoChooser({
  masjidName,
  ask,
  options,
  onChoose,
  nav,
}: {
  masjidName: string;
  /** The question. Different one level down, so it is a prop. */
  ask: string;
  options: [ChooserOption, ChooserOption];
  onChoose: (key: string) => void;
  /** Absent at the top of the tree, where there is nowhere above to go. */
  nav?: React.ComponentProps<typeof DemoNav>;
}) {
  return (
    <div className="pick">
      {/* The masjid's name is the page's heading, because the masjid is whose
          building this is. The question underneath is what the person is
          actually here to answer, so it is set in brass rather than left to
          look like a caption. */}
      <header className="pick__head">
        {nav ? <DemoNav {...nav} tone="board" /> : null}
        <h1 className="pick__masjid">{masjidName}</h1>
        <p className="pick__ask">{ask}</p>
      </header>

      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className={`pchoose pchoose--${o.key}`}
          onClick={() => onChoose(o.key)}
        >
          <span className="pchoose__text">
            <span className="pchoose__title">{o.title}</span>
            <span className="pchoose__blurb">{o.blurb}</span>
          </span>
          {/* A direct child of the button, not of the text: the narrow layout
              puts it in its own grid cell at the end of the row, the wide one
              lets it fall under the text as the next flex item. */}
          <span className="pchoose__go" aria-hidden="true">
            <span className="pchoose__goword">Open </span>
            <span className="pchoose__arrow">→</span>
          </span>
          <span className="pchoose__shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={demoImg(o.img)} alt={o.alt} loading="lazy" width={1600} height={1000} />
          </span>
        </button>
      ))}

      {/* The credit sits in the footer of every portal screen. The support
          line goes with it: a committee that cannot find the way to report a
          problem reports it by stopping using the thing. */}
      <footer className="pick__foot">
        <p className="pick__help">
          Having issues?{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MasjidOne support")}`}>
            Log a ticket
          </a>
        </p>
        <PoweredBy />
      </footer>
    </div>
  );
}

export default DemoChooser;
