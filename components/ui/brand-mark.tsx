import * as React from "react";

/**
 * The MasjidOne mark: a dome between two minarets, the seam running through
 * the base rule. Inlined rather than loaded as a file so it inherits
 * `currentColor` — the supplied SVGs hardcode brass, and the mark has to work
 * on paper, on the board and in both themes without three copies of it.
 *
 * Decorative here: it always sits beside the wordmark, which already carries
 * the accessible name.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 72"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13.5 31a5 5 0 0 1 10 0" />
      <path d="M14 31V57M23 31V57" />
      <circle cx="18.5" cy="25" r="2" fill="currentColor" stroke="none" />
      <path d="M18.5 27V31" />
      <path d="M36 44a24 24 0 0 1 48 0" />
      <path d="M35 44v13M85 44v13" />
      <circle cx="60" cy="14" r="3" fill="currentColor" stroke="none" />
      <path d="M60 17v3" />
      <path d="M96.5 31a5 5 0 0 1 10 0" />
      <path d="M97 31V57M106 31V57" />
      <circle cx="101.5" cy="25" r="2" fill="currentColor" stroke="none" />
      <path d="M101.5 27V31" />
      <path d="M8 58h104" strokeWidth={4} />
    </svg>
  );
}

export default BrandMark;
