import * as React from "react";

/**
 * The supplied component, adapted to MasjidOne. Four deliberate changes:
 *
 *  1. Colour comes from tokens, never from Tailwind's zinc scale or a literal
 *     #ffffff. The house rule is that hex values live in `app/globals.css`
 *     and nowhere else, so the beam, its rim and the inset sheen are new
 *     tokens defined across all three theme blocks.
 *  2. Square, not `rounded-full`. Pills are the pricing block's deliberate
 *     exception and are not meant to spread outward.
 *  3. Renders an <a> when given an href. Both site CTAs navigate to #contact,
 *     and a <button> that navigates is the wrong element.
 *  4. The spin is behind `motion-safe:`, so it stops under
 *     prefers-reduced-motion. The hover still reads — the beam fades in, it
 *     just does not rotate.
 */

const OUTER =
  "group relative isolate inline-flex items-center justify-center overflow-hidden " +
  "p-px no-underline cursor-pointer border-0 bg-transparent " +
  "transition-transform duration-300 ease-out hover:-translate-y-0.5 active:translate-y-px " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[var(--brass)]";

/** The rotating conic sweep. Sits behind the surface and shows through the 1px padding. */
const BEAM =
  "pointer-events-none absolute inset-[-100%] opacity-0 " +
  "bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,var(--beam)_100%)] " +
  "transition-opacity duration-300 " +
  "group-hover:opacity-100 group-focus-visible:opacity-100 " +
  "motion-safe:animate-[spin_3s_linear_infinite]";

/** The resting hairline, swapped out for the beam on hover. */
const RIM =
  "pointer-events-none absolute inset-0 bg-[var(--beam-rim)] " +
  "transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0";

const SURFACE =
  "relative flex h-full w-full items-center justify-center gap-2 " +
  "px-6 py-2.5 text-xs uppercase tracking-widest " +
  "[font-variation-settings:'wght'_600,'wdth'_92] " +
  "bg-[var(--cta-bg)] text-[var(--cta-fg)] " +
  "shadow-[inset_0_1px_0_var(--beam-sheen)]";

function Inner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className={BEAM} />
      <span className={RIM} />
      <span className={SURFACE}>
        <span className="relative z-10">{children}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </>
  );
}

export type SpinningBorderLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export const SpinningBorderLink = React.forwardRef<
  HTMLAnchorElement,
  SpinningBorderLinkProps
>(function SpinningBorderLink({ children = "Request a demo", className, ...props }, ref) {
  return (
    <a ref={ref} className={className ? `${OUTER} ${className}` : OUTER} {...props}>
      <Inner>{children}</Inner>
    </a>
  );
});

export type SpinningBorderButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SpinningBorderButton = React.forwardRef<
  HTMLButtonElement,
  SpinningBorderButtonProps
>(function SpinningBorderButton(
  { children = "Request a demo", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={className ? `${OUTER} ${className}` : OUTER}
      {...props}
    >
      <Inner>{children}</Inner>
    </button>
  );
});

export default SpinningBorderButton;
