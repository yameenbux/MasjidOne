"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The supplied nav imports this file but does not include it, so it is written
 * here. It animates a variable font's axes per character on hover, staggered
 * outward from a chosen anchor.
 *
 * Archivo is loaded across `wght 400..700` in app/layout.tsx, so the default
 * 400 -> 700 sweep is within the range the browser actually has. Asking for a
 * weight outside a loaded range does nothing visible.
 *
 * Two problems the naive version has, both handled below:
 *
 *  - **Layout shift.** A heavier weight is a wider glyph: measured against the
 *    real font, "What it runs" grows 5.5px from 400 to 700, which nudged the
 *    header every time a link was hovered. So the label is rendered twice —
 *    once in normal flow at the *target* weight to reserve the widest it will
 *    ever be, and once absolutely positioned on top carrying the animation.
 *    Nothing moves.
 *  - **Accessible name.** Splitting a label into one span per character leaves
 *    a link with a name assembled from individual letters. The reserving copy
 *    is the real text — kept in the accessibility tree with `opacity: 0`
 *    rather than `visibility: hidden` — and the animated characters are
 *    aria-hidden and unselectable, so a link reads and copies as one word.
 */

export type StaggerFrom = "first" | "last" | "center" | number;

type BaseProps = {
  label: string;
  /** e.g. "'wght' 400" */
  fromFontVariationSettings?: string;
  /** e.g. "'wght' 700" */
  toFontVariationSettings?: string;
  /** Seconds between each character starting. */
  staggerDuration?: number;
  staggerFrom?: StaggerFrom;
  /** Seconds for one character to travel. */
  duration?: number;
  className?: string;
};

export type VariableFontHoverProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;

function anchorIndex(staggerFrom: StaggerFrom, total: number) {
  if (staggerFrom === "first") return 0;
  if (staggerFrom === "last") return total - 1;
  if (staggerFrom === "center") return (total - 1) / 2;
  return staggerFrom;
}

export function VariableFontHover({
  label,
  fromFontVariationSettings = "'wght' 400",
  toFontVariationSettings = "'wght' 700",
  staggerDuration = 0.03,
  staggerFrom = "center",
  duration = 0.28,
  className,
  href,
  ...rest
}: VariableFontHoverProps) {
  const [active, setActive] = React.useState(false);
  const reduce = useReducedMotion();

  const chars = React.useMemo(() => Array.from(label), [label]);
  const anchor = anchorIndex(staggerFrom, chars.length);

  const Tag = (href ? "a" : "span") as "a";

  return (
    <Tag
      href={href}
      className={className}
      style={{ position: "relative", display: "inline-block" }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      {...rest}
    >
      {/* Reserves the bold width and supplies the accessible name. */}
      <span
        style={{
          opacity: 0,
          whiteSpace: "pre",
          // Excluded from selection so a drag-copy of the nav returns each
          // label once, from the visible layer, rather than twice.
          userSelect: "none",
          fontVariationSettings: toFontVariationSettings,
        }}
      >
        {label}
      </span>

      {/* The visible, animated layer. */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          whiteSpace: "pre",
        }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            initial={false}
            animate={{
              fontVariationSettings: active
                ? toFontVariationSettings
                : fromFontVariationSettings,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration,
                    delay: Math.abs(i - anchor) * staggerDuration,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            {char}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
}

export default VariableFontHover;
