"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PoweredBy } from "@/components/ui/powered-by";

/**
 * The masjid's sign-in screen.
 *
 * Adapted from a supplied "mercury/neural access" concept. What was kept is the
 * part that was good: a left-aligned, generous layout, the field that shifts on
 * focus, the underline that lights up, a slow field of drifting light behind
 * glass, and the gooey blend on the button. What was dropped is the black
 * cyberpunk skin and its wording — this screen is the one a mosque committee
 * sees most, and it has to look safe with children's records, not like a
 * trading terminal. So it is rebuilt on --board, the deep bottle green the rest
 * of MasjidOne already uses, with brass and Newsreader.
 *
 * Every colour here is a token. The original hardcoded a dozen hex values,
 * which the design rules forbid outright, and which would have broken the
 * moment the theme flipped.
 *
 * Deliberate departures from the supplied code, all of them bugs:
 *
 *  - The ref callback was `ref={el => (arr[i] = el)}`, whose arrow body RETURNS
 *    the assigned element. React 19 reads a returned function as a cleanup and
 *    a returned non-function as an error. Harmless on React 18, which this repo
 *    is on, and a breakage on the next major. Written with a block body here.
 *  - `height: 100vh` is wrong on mobile browsers, where the toolbar makes the
 *    viewport shorter than 100vh and the form ends up under the chrome. 100dvh.
 *  - `width: 100vw` includes the scrollbar gutter and pushes the page sideways.
 *  - The mousemove handler wrote to six elements' styles on every event, which
 *    on a trackpad is hundreds of layout writes a second. Throttled to one
 *    write per animation frame.
 *  - Fonts were pulled in with an `@import` inside a <style> tag in the
 *    component. app/layout.tsx already loads Newsreader and Archivo; a second
 *    fetch inside a client component blocks paint for nothing.
 *  - The labels were not associated with their inputs, so a screen reader
 *    announced two unlabelled boxes. Proper id/htmlFor, and the placeholder is
 *    no longer carrying the label's job.
 *  - No autocomplete attributes, so password managers could not fill it.
 *  - No prefers-reduced-motion guard, which this project requires. The drift
 *    and the parallax both stop; see .mlogin rules in globals.css.
 */

export type MasjidAccessLoginProps = {
  /** Shown as the dominant heading. This is the white-label slot. */
  masjidName: string;
  /**
   * The smaller line under the masjid's name, saying which door this is.
   * The masjid's name stays the largest thing on the screen either way —
   * a parent should recognise their own masjid before they read anything
   * else, and certainly before they read our name.
   */
  portalLabel?: string;
  /** Called with the typed credentials. Returns a message on failure. */
  onSignIn: (user: string, pass: string) => string | null;
  /** Small print under the form, e.g. the seeded demo credentials. */
  hint?: React.ReactNode;
  className?: string;
};

/**
 * Six drifting shapes. Their geometry is fixed at module scope rather than
 * randomised per mount: a random layout differs between the server render and
 * the client hydration, which is a hydration mismatch. The supplied component
 * used useMemo, which does not help — useMemo runs on the server too, with a
 * different result.
 */
const BLOBS = [
  { size: 320, left: 12, top: 18, delay: -2, duration: 26 },
  { size: 240, left: 68, top: 10, delay: -9, duration: 31 },
  { size: 380, left: 46, top: 62, delay: -14, duration: 24 },
  { size: 200, left: 82, top: 48, delay: -5, duration: 29 },
  { size: 280, left: 24, top: 74, delay: -18, duration: 22 },
  { size: 180, left: 58, top: 30, delay: -11, duration: 34 },
] as const;

export function MasjidAccessLogin({
  masjidName,
  portalLabel = "Madrasah & congregation portal",
  onSignIn,
  hint,
  className,
}: MasjidAccessLoginProps) {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const blobs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Parallax, one style write per frame rather than one per mousemove. Skipped
  // entirely when the visitor has asked for reduced motion, and never armed on
  // a touch device, where there is no pointer to follow.
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduced.matches || !fine.matches) return;

    let frame = 0;
    let nx = 0.5;
    let ny = 0.5;

    const paint = () => {
      frame = 0;
      blobs.current.forEach((el, i) => {
        if (!el) return;
        const depth = (i + 1) * 14;
        // Margin rather than transform, so this does not fight the keyframe
        // animation that is already driving transform on the same element.
        el.style.marginLeft = `${(nx - 0.5) * depth}px`;
        el.style.marginTop = `${(ny - 0.5) * depth}px`;
      });
    };

    const onMove = (e: MouseEvent) => {
      nx = e.clientX / window.innerWidth;
      ny = e.clientY / window.innerHeight;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(onSignIn(user.trim(), pass));
  };

  return (
    <div className={cn("mlogin", className)}>
      {/* The gooey filter. Two shapes whose blurs overlap get pulled into one
          blob by the alpha ramp in feColorMatrix, which is what makes the
          drifting field read as liquid rather than as six circles. */}
      <svg className="mlogin__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="mlogin-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="mlogin__stage" aria-hidden="true">
        {BLOBS.map((b, i) => (
          <div
            key={i}
            ref={(el) => {
              blobs.current[i] = el;
            }}
            className="mlogin__blob"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              top: `${b.top}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>

      <main className="mlogin__panel">
        <header className="mlogin__head">
          {/* The masjid's name is the only thing at the top, and the largest
              thing on the screen, because the masjid is whose building this
              is. MasjidOne's credit lives in the footer below. */}
          <h1 className="mlogin__name">{masjidName}</h1>
          <p className="mlogin__sub">{portalLabel}</p>
        </header>

        <form onSubmit={submit} noValidate>
          <div className="mlogin__field">
            <label htmlFor="mlogin-user">Your sign-in</label>
            <input
              id="mlogin-user"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <span className="mlogin__glow" aria-hidden="true" />
          </div>

          <div className="mlogin__field">
            <label htmlFor="mlogin-pass">Password</label>
            <input
              id="mlogin-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <span className="mlogin__glow" aria-hidden="true" />
          </div>

          {/* aria-live so the failure is announced, not just drawn. */}
          <p className="mlogin__error" role="status" aria-live="polite">
            {error}
          </p>

          <div className="mlogin__submit">
            <span className="mlogin__drop" aria-hidden="true" />
            <button type="submit" className="mlogin__btn">
              Sign in
            </button>
          </div>
        </form>

        {hint ? <div className="mlogin__hint">{hint}</div> : null}
      </main>

      <footer className="mlogin__foot">
        <PoweredBy />
      </footer>
    </div>
  );
}

export default MasjidAccessLogin;
