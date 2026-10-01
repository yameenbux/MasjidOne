"use client";

import * as React from "react";

/**
 * Back and Home, on every screen below the sign-in.
 *
 * Back calls history.back() rather than setting state directly, so it does
 * exactly what the browser's own back does — and so the phone's back gesture,
 * which people use without thinking, lands in the same place. The screens in
 * this portal are React state rather than routes; before the history wiring in
 * app/demo/page.tsx, a swipe back left the site altogether, which is a worse
 * failure than not having the button at all.
 *
 * Home goes to the top of whichever portal the person is in, not to the portal
 * chooser. "Home" means the madrasah's home or the congregation's home — a
 * caretaker who only ever uses the screens should not be sent somewhere that
 * offers them the madrasah.
 *
 * `tone` exists because the same control sits on the board-green chooser and
 * on the paper-coloured portals, and brass on board needs a different value
 * from brass on paper to clear AA.
 */
export function DemoNav({
  onBack,
  onHome,
  homeLabel,
  tone = "paper",
}: {
  onBack: () => void;
  onHome: () => void;
  /** Named, so the button says where it goes rather than just "Home". */
  homeLabel: string;
  tone?: "board" | "paper";
}) {
  return (
    <nav className={`dnav dnav--${tone}`} aria-label="Within this portal">
      <button type="button" className="dnav__btn" onClick={onBack}>
        <span aria-hidden="true">←</span> Back
      </button>
      <button type="button" className="dnav__btn" onClick={onHome}>
        <span aria-hidden="true">⌂</span> {homeLabel}
      </button>
    </nav>
  );
}

export default DemoNav;
