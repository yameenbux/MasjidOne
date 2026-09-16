"use client";

import * as React from "react";
import { StackSpread, type StackSpreadCard } from "@/components/ui/stack-spread";
import { SpinningBorderLink } from "@/components/ui/spinning-border-button";

/**
 * The opening screen. Eight cards cluster, then spread as you scroll, each one
 * a device MasjidOne runs on with what that device shows.
 *
 * Every card is a real screen of a shipped product, used with Taiyabah Masjid's
 * permission (given 16 September 2026). Filenames are exactly as uploaded —
 * do not rename them, the references here follow the files rather than the
 * other way round.
 *
 * There are deliberately no madrasah-portal or parent-access cards: those
 * modules are not built, and an invented screen for them would be the page's
 * biggest untrue claim. They join the stack when they exist.
 *
 * Card sizes are set so each one's vw/vh ratio roughly matches its image, since
 * `object-fit: cover` crops the difference. 16:9 display captures get wide
 * cards, 9:16 and phone captures get tall ones.
 *
 * NEXT_PUBLIC_BASE_PATH is prefixed by hand. `next/image` is not in use here
 * (the export is unoptimised anyway) and a plain <img src="/devices/..."> would
 * resolve to the domain root and 404 on a project page.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const img = (file: string) => `${BASE}/devices/${file}`;

const CARDS: StackSpreadCard[] = [
  // Prayer hall screen, landscape — 1920x1080
  {
    item: {
      src: img("timetable_landscape_raw.png"),
      alt: "A prayer hall screen: the live clock, the next jamāʿah countdown, and today's beginning and jamāʿah times",
      caption: "Prayer hall screen",
      status: "live",
    },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -12,
    target: { x: -30, y: -30, rotate: 0, scale: 1, w: 30, h: 27 },
    targetSm: { x: -22, y: -40 },
    z: 2,
  },
  // The same timetable, portrait — 1080x1920
  {
    item: {
      src: img("timetable_portrait_raw.png"),
      alt: "The same timetable on a portrait wall-mounted display",
      caption: "Hall screen · portrait",
      status: "live",
    },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 15,
    target: { x: 36, y: -24, rotate: 0, scale: 1, w: 12, h: 30 },
    targetSm: { x: 22, y: -40 },
    z: 3,
  },
  // Website on a laptop — 3000x2040
  {
    item: {
      src: img("taiyabah-website-laptop.png"),
      alt: "The managed mosque website on a laptop, with prayer times in the header",
      caption: "Managed website",
      status: "live",
    },
    stackOffset: { x: -16, y: 2 },
    stackRotate: -5,
    target: { x: -34, y: 10, rotate: 0, scale: 1, w: 28, h: 28 },
    targetSm: { x: -22, y: -19 },
    z: 4,
  },
  // App · prayer times — 1179x2556
  {
    item: {
      src: img("times.png"),
      alt: "The congregation app showing beginning and jamāʿah times side by side",
      caption: "Congregation app · the masjid's own times",
      status: "live",
    },
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: -14, y: -38, rotate: 0, scale: 1, w: 11, h: 28 },
    targetSm: { x: 22, y: -19 },
    z: 5,
  },
  // Foyer appeal screen, landscape — 1920x1080
  {
    item: {
      src: img("foyer_landscape_raw.png"),
      alt: "A foyer screen running the new build appeal, with the phases so far and how to give",
      caption: "Foyer screen · appeals",
      status: "live",
    },
    stackOffset: { x: 18, y: 2 },
    stackRotate: 7,
    target: { x: 34, y: 14, rotate: 0, scale: 1, w: 26, h: 23 },
    targetSm: { x: 22, y: 20 },
    z: 6,
  },
  // App · giving — 1179x2556
  {
    item: {
      src: img("donate.png"),
      alt: "Giving in the app, with Apple Pay and Google Pay, at 0% commission",
      caption: "Donations · 0% commission",
      status: "live",
    },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 5,
    target: { x: -18, y: 38, rotate: 0, scale: 1, w: 11, h: 28 },
    targetSm: { x: -22, y: 20 },
    z: 7,
  },
  // App · madrasah curriculum — 1179x2556
  {
    item: {
      src: img("curriculum.png"),
      alt: "The madrasah curriculum in the app: what students learn, by subject",
      caption: "Madrasah · what is taught",
      status: "live",
    },
    stackOffset: { x: 8, y: 8 },
    stackRotate: 3,
    target: { x: 16, y: 38, rotate: 0, scale: 1, w: 11, h: 28 },
    targetSm: { x: -22, y: 40 },
    z: 8,
  },
  // App · everyday duʿās — 1179x2556
  {
    item: {
      src: img("duas.png"),
      alt: "Everyday duʿās in the app, by occasion, with transliteration",
      caption: "Everyday duʿās",
      status: "live",
    },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -8,
    target: { x: 14, y: -38, rotate: 0, scale: 1, w: 11, h: 28 },
    targetSm: { x: 22, y: 40 },
    z: 9,
  },
];

export function MasjidOneHero() {
  return (
    <StackSpread cards={CARDS}>
      <p className="eyebrow eyebrow--brass stack__eyebrow">YSB Ventures Ltd</p>
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
        Live screens from Taiyabah Masjid, Bolton · used with permission
      </p>
    </StackSpread>
  );
}

export default MasjidOneHero;
