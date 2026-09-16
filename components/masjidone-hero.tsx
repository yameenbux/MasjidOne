"use client";

import * as React from "react";
import { StackSpread, type StackSpreadCard } from "@/components/ui/stack-spread";
import { SpinningBorderLink } from "@/components/ui/spinning-border-button";
import { DEMO_MAILTO } from "@/lib/site";

/**
 * The opening screen. Eight cards cluster, then spread as you scroll, each one
 * a device MasjidOne runs on with what that device shows.
 *
 * Every card is an interface preview rather than a capture of a live masjid.
 * No masjid is named and every figure is example data, which is why the note
 * under the stack says so rather than claiming a permission.
 *
 * Eight cards, which is what the geometry below is tuned for. Eleven collided
 * with the headline and buried the note under the stack, so the madrasah
 * screens — registers, fees and parent access — live in the previews section
 * instead, where each gets a full-size tab rather than a corner of this one.
 *
 * Card sizes match each image's aspect ratio, because the images are rendered
 * `object-fit: contain` rather than cover. Every one of them is a picture of a
 * device on a transparent surround, and cover cropped the bezel off the top —
 * the part that says "this is a screen". Landscape screens are about 1.7:1,
 * the laptop and admin screens 1.57:1, and the phones 0.48:1.
 *
 * NEXT_PUBLIC_BASE_PATH is prefixed by hand. `next/image` is not in use here
 * (the export is unoptimised anyway) and a plain <img src="/devices/..."> would
 * resolve to the domain root and 404 on a project page.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const img = (file: string) => `${BASE}/devices/${file}`;

const CARDS: StackSpreadCard[] = [
  // Hall screen, landscape
  {
    item: {
      src: img("hall-screen.webp"),
      alt: "A prayer hall screen: the live clock, today's beginning and jamāʿah times, and the next jamāʿah marked",
      caption: "Prayer hall screen",
      status: "live",
    },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -12,
    target: { x: -30, y: -30, rotate: 0, scale: 1, w: 29, h: 27 },
    targetSm: { x: -22, y: -40 },
    z: 2,
  },
  // Foyer appeal screen, landscape
  {
    item: {
      src: img("foyer-appeal.webp"),
      alt: "A foyer screen running an appeal: the total raised, the phases so far, and a QR code to give",
      caption: "Foyer appeals",
      status: "live",
    },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 15,
    target: { x: 36, y: -24, rotate: 0, scale: 1, w: 25, h: 23 },
    targetSm: { x: 22, y: -40 },
    z: 3,
  },
  // Managed website, laptop
  {
    item: {
      src: img("website.webp"),
      alt: "The managed masjid website, with the next jamāʿah in the header and today's times below the headline",
      caption: "Managed website",
      status: "live",
    },
    stackOffset: { x: -16, y: 2 },
    stackRotate: -5,
    target: { x: -34, y: 10, rotate: 0, scale: 1, w: 28, h: 28 },
    targetSm: { x: -22, y: -19 },
    z: 4,
  },
  // App · prayer times
  {
    item: {
      src: img("app-prayer-times.webp"),
      alt: "The congregation app showing beginning and jamāʿah times side by side, with a per-person reminder offset",
      caption: "Congregation app",
      status: "live",
    },
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: -14, y: -38, rotate: 0, scale: 1, w: 9, h: 28 },
    targetSm: { x: 22, y: -19 },
    z: 5,
  },
  // App · notices
  {
    item: {
      src: img("app-notices.webp"),
      alt: "Notices in the app: janāzah today, Jumuʿah times, madrasah half term",
      caption: "Notices",
      status: "live",
    },
    stackOffset: { x: 18, y: 2 },
    stackRotate: 7,
    target: { x: 34, y: 14, rotate: 0, scale: 1, w: 9, h: 28 },
    targetSm: { x: 22, y: 20 },
    z: 6,
  },
  // App · giving
  {
    item: {
      src: img("app-giving.webp"),
      alt: "Giving in the app, with Gift Aid added and Apple Pay and Google Pay, at 0% commission",
      caption: "Donations · 0%",
      status: "live",
    },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 5,
    target: { x: -18, y: 38, rotate: 0, scale: 1, w: 9, h: 28 },
    targetSm: { x: -22, y: 20 },
    z: 7,
  },
  // Admin · committee and roles
  {
    item: {
      src: img("admin-committee.webp"),
      alt: "The committee and roles screen: who can edit times, notices, money and users",
      caption: "Committee & roles",
      status: "live",
    },
    stackOffset: { x: 8, y: 8 },
    stackRotate: 3,
    target: { x: 16, y: 38, rotate: 0, scale: 1, w: 23, h: 23 },
    targetSm: { x: -22, y: 40 },
    z: 8,
  },
  // App · everyday duʿās
  {
    item: {
      src: img("app-duas.webp"),
      alt: "Everyday duʿās in the app, by occasion, with transliteration",
      caption: "Everyday duʿās",
      status: "live",
    },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -8,
    target: { x: 14, y: -38, rotate: 0, scale: 1, w: 9, h: 28 },
    targetSm: { x: 22, y: 40 },
    z: 9,
  },

];

export function MasjidOneHero() {
  return (
    <StackSpread cards={CARDS}>
      <h1 className="stack__h1">
        The madrasah and the congregation, <em>on one system</em>.
      </h1>
      <p className="stack__sub">
        Prayer times, the congregation app, your website, the hall screens and
        donations — running today. Registers, fees and parent access join the
        same system, from the same record of the same family.
      </p>
      <div className="stack__act">
        <SpinningBorderLink href={DEMO_MAILTO}>Request a demo</SpinningBorderLink>
        <a className="btn btn--ghost" href="#pricing">
          <span className="btn__t">See the pricing</span>
        </a>
      </div>
      <p className="stack__note">
        Interface previews · example data, no masjid named
      </p>
    </StackSpread>
  );
}

export default MasjidOneHero;
