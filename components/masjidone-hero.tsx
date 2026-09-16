"use client";

import * as React from "react";
import { StackSpread, type StackSpreadCard } from "@/components/ui/stack-spread";
import { SpinningBorderLink } from "@/components/ui/spinning-border-button";

/**
 * The opening screen. Eight cards cluster, then spread as you scroll, each one
 * a device MasjidOne actually runs on with what that device shows.
 *
 * The screenshots are supplied separately. Drop them in `public/devices/` under
 * the filenames below and they appear; until then each card shows a labelled
 * frame rather than a broken image, so the page is never embarrassing.
 *
 * NEXT_PUBLIC_BASE_PATH is prefixed by hand. `next/image` is not in use here
 * (the export is unoptimised anyway) and a plain <img src="/devices/..."> would
 * resolve to the domain root and 404 on a project page.
 *
 * Two cards are tagged In development, matching #what and the pricing cards.
 * A hero that quietly showed an unbuilt parent portal as though it shipped
 * would be the page's biggest untrue claim.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const img = (file: string) => `${BASE}/devices/${file}`;

const CARDS: StackSpreadCard[] = [
  {
    item: {
      src: img("hall-screen.png"),
      alt: "A prayer hall screen showing today's begins and jamāʿah times",
      caption: "Prayer hall screen",
      status: "live",
    },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -14,
    target: { x: -30, y: -28, rotate: 0, scale: 1, w: 24, h: 26 },
    targetSm: { x: -22, y: -40 },
    z: 2,
  },
  {
    item: {
      src: img("app-jamaah.png"),
      alt: "The congregation app showing a jamāʿah reminder with a personal offset",
      caption: "Congregation app · jamāʿah reminders",
      status: "live",
    },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 16,
    target: { x: 30, y: -30, rotate: 0, scale: 1, w: 13, h: 34 },
    targetSm: { x: 22, y: -40 },
    z: 3,
  },
  {
    item: {
      src: img("website.png"),
      alt: "The managed mosque website on a laptop",
      caption: "Managed mosque website",
      status: "live",
    },
    stackOffset: { x: -16, y: 0 },
    stackRotate: -5,
    target: { x: -36, y: 4, rotate: 0, scale: 1, w: 24, h: 26 },
    targetSm: { x: -22, y: -19 },
    z: 4,
  },
  {
    item: {
      src: img("giving.png"),
      alt: "One-tap giving in the congregation app, at 0% commission",
      caption: "Donations · 0% commission",
      status: "live",
    },
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: 3, y: -33, rotate: 0, scale: 1, w: 13, h: 32 },
    targetSm: { x: 22, y: -19 },
    z: 5,
  },
  {
    item: {
      src: img("janazah.png"),
      alt: "A janāzah notice reaching the hall screens and the app together",
      caption: "Janāzah notices",
      status: "live",
    },
    stackOffset: { x: 18, y: 1 },
    stackRotate: 7,
    target: { x: 35, y: 8, rotate: 0, scale: 1, w: 22, h: 24 },
    targetSm: { x: 22, y: 20 },
    z: 6,
  },
  {
    item: {
      src: img("committee.png"),
      alt: "The committee view, with announcements and the timetable in one place",
      caption: "Committee view",
      status: "live",
    },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 5,
    target: { x: -26, y: 34, rotate: 0, scale: 1, w: 24, h: 25 },
    targetSm: { x: -22, y: 20 },
    z: 7,
  },
  {
    item: {
      src: img("parent.png"),
      alt: "A parent seeing their child's attendance inside the congregation app",
      caption: "Parent access · the join",
      status: "dev",
    },
    stackOffset: { x: 8, y: 7 },
    stackRotate: 3,
    target: { x: 2, y: 34, rotate: 0, scale: 1, w: 13, h: 32 },
    targetSm: { x: -22, y: 40 },
    z: 8,
  },
  {
    item: {
      src: img("register.png"),
      alt: "A teacher taking the daily register on a tablet",
      caption: "Madrasah register",
      status: "dev",
    },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -8,
    target: { x: 30, y: 34, rotate: 0, scale: 1, w: 20, h: 24 },
    targetSm: { x: 22, y: 40 },
    z: 9,
  },
];

export function MasjidOneHero() {
  return (
    <StackSpread cards={CARDS}>
      <p className="eyebrow eyebrow--brass stack__eyebrow">
        YSB Ventures Ltd
      </p>
      <h1 className="stack__h1">
        The madrasah and the congregation, <em>on one system</em>.
      </h1>
      <p className="stack__sub">
        Prayer times, the congregation app, your website, the hall screens and
        donations — running today. Registers, fees and parent access join the
        same system, from the same record of the same family.
      </p>
      <div className="stack__act">
        <SpinningBorderLink href="#contact">Request a demo</SpinningBorderLink>
        <a className="btn btn--ghost" href="#pricing">
          <span className="btn__t">See the pricing</span>
        </a>
      </div>
      <p className="stack__note">
        Interface previews, not screenshots of a specific masjid.
      </p>
    </StackSpread>
  );
}

export default MasjidOneHero;
