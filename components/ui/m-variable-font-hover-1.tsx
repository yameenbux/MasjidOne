"use client";

import { VariableFontHover } from "@/components/ui/variable-font-hover";

/**
 * The header's section nav. Same links and same anchors as before; the only
 * change is that each label now thickens from the middle outward on hover.
 *
 * Colour is left to the existing `.nav a` rules in app/globals.css — ink-2 at
 * rest, brass on hover — rather than the demo's `text-muted-foreground` /
 * `hover:text-foreground`, so the header keeps the palette it already had.
 */

// Absolute and basePath-aware: the header also renders on /privacy/, /terms/
// and 404.html, where a bare "#join" points at nothing. On the home page the
// path is unchanged so the browser still treats it as a hash jump.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const NAV_LINKS = [
  { href: BASE + "/#join", label: "The join" },
  { href: BASE + "/#what", label: "What it runs" },
  { href: BASE + "/#previews", label: "Previews" },
  { href: BASE + "/#pricing", label: "Pricing" },
  { href: BASE + "/#trust", label: "Your data" },
];

export function SectionNav() {
  return (
    <nav className="nav" aria-label="Sections">
      {NAV_LINKS.map(({ href, label }) => (
        <VariableFontHover
          key={href}
          href={href}
          label={label}
          fromFontVariationSettings="'wght' 400"
          toFontVariationSettings="'wght' 700"
          staggerDuration={0.03}
          staggerFrom="center"
        />
      ))}
    </nav>
  );
}

export default SectionNav;
