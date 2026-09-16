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

const NAV_LINKS = [
  { href: "#join", label: "The join" },
  { href: "#what", label: "What it runs" },
  { href: "#previews", label: "Previews" },
  { href: "#pricing", label: "Pricing" },
  { href: "#trust", label: "Your data" },
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
