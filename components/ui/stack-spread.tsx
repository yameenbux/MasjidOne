"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

/**
 * The supplied stack-spread stage, adapted. Four changes worth knowing:
 *
 *  1. Imports from `framer-motion`, which this project already depends on,
 *     rather than adding `motion` alongside it. They are the same library
 *     under two names; installing both ships two animation runtimes.
 *  2. Colour comes from tokens. The hardcoded #ececeb / #141414 are not in
 *     this palette.
 *  3. Cards carry a caption and an optional status, because the things being
 *     shown are interface previews, and two of the modules are not built yet.
 *     Silent images would let the hero claim more than the rest of the page.
 *  4. Works with JavaScript disabled. Framer bakes the clustered position into
 *     the exported HTML as an inline transform, which with no JS would leave a
 *     heap of overlapping cards and an invisible headline. `html:not(.js)`
 *     rules in globals.css unwind that into a plain grid — the same contract
 *     the rest of the site uses for its reveals.
 */

const SCATTER_START = 0.12;
const SCATTER_END = 0.9;

const PARALLAX_X = 2.6;
const PARALLAX_Y = 2.2;
const PARALLAX_SPRING = { stiffness: 90, damping: 22, mass: 0.6 };
const parallaxDepth = (i: number, total: number) =>
  total <= 1 ? 1 : 0.55 + (i / (total - 1)) * 0.75;

export interface StackSpreadItem {
  src: string;
  alt: string;
  /** Shown under the device. Say what the screen is, not what it proves. */
  caption?: string;
  status?: "live" | "dev";
}

export interface StackSpreadTarget {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  w: number;
  h: number;
}

export interface StackSpreadCard {
  item: StackSpreadItem;
  target: StackSpreadTarget;
  targetSm?: { x: number; y: number };
  stackRotate?: number;
  stackOffset?: { x: number; y: number };
  z?: number;
}

const RESPONSIVE = {
  desktop: { scale: null as number | null, small: false, colX: null as number | null },
  small: { scale: 0.72, small: true, colX: 22 },
};

function useResponsive() {
  const [r, setR] = React.useState(RESPONSIVE.desktop);
  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const read = () => setR(mq.matches ? RESPONSIVE.small : RESPONSIVE.desktop);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return r;
}

function usePointerParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  React.useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, rawX, rawY]);

  return { x, y };
}

/**
 * The screenshots are supplied separately and may not be in place yet, so a
 * missing file falls back to a labelled frame rather than a broken-image icon.
 */
function CardFace({ item, capOpacity }: { item: StackSpreadItem; capOpacity: MotionValue<number> }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <figure className="stack-card__face">
      {failed ? (
        <div className="stack-card__pending">
          <span>{item.caption ?? item.alt}</span>
        </div>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
      {item.caption && (
        // EDIT: while the cards are stacked the captions pile on top of one
        // another and on the headline. They only mean anything once the cards
        // have separated, so they arrive with the spread.
        <motion.figcaption className="stack-card__cap" style={{ opacity: capOpacity }}>
          {item.caption}
          {item.status && (
            <span
              className={`tag ${item.status === "live" ? "tag--live" : "tag--dev"}`}
            >
              {item.status === "live" ? "Live" : "In development"}
            </span>
          )}
        </motion.figcaption>
      )}
    </figure>
  );
}

function Card({
  card,
  progress,
  reduce,
  scaleMul,
  isSmall,
  colX,
  stackScale,
  pointer,
  depth,
}: {
  card: StackSpreadCard;
  progress: MotionValue<number>;
  reduce: boolean | null;
  scaleMul: number | null;
  isSmall: boolean;
  colX: number | null;
  stackScale: number;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  depth: number;
}) {
  const { item, target } = card;
  const capOpacity = useTransform(progress, [0.45, 0.8], [0, 1]);
  const flat = reduce === true;
  const stackRotate = flat ? 0 : card.stackRotate ?? 0;
  const stackOffset = card.stackOffset ?? { x: 0, y: 0 };
  const restScale = scaleMul ?? target.scale ?? 1;

  const sm = isSmall && card.targetSm ? card.targetSm : null;
  const endX = sm ? (colX != null ? Math.sign(sm.x) * colX : sm.x) : target.x;
  const endY = sm ? sm.y : target.y;
  const endRotate = flat || isSmall ? 0 : target.rotate;

  const translate = useTransform(
    [progress, pointer.x, pointer.y],
    ([p, px, py]: number[]) => {
      const tx = stackOffset.x + (endX - stackOffset.x) * p;
      const ty = stackOffset.y + (endY - stackOffset.y) * p;
      const drift = depth * p;
      return `calc(-50% + ${tx - px * PARALLAX_X * drift}vw) calc(-50% + ${
        ty - py * PARALLAX_Y * drift
      }vh)`;
    },
  );
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate]);
  const scale = useTransform(progress, [0, 1], [stackScale, restScale]);

  return (
    <motion.div
      className="stack-card"
      style={{
        width: `${target.w}vw`,
        height: `${target.h}vh`,
        zIndex: card.z ?? 1,
        translate,
        rotate,
        scale,
      }}
    >
      <CardFace item={item} capOpacity={capOpacity} />
    </motion.div>
  );
}

export interface StackSpreadProps {
  cards: StackSpreadCard[];
  /** scatter scroll distance, in vh */
  scrollLength?: number;
  stackScale?: number;
  textFadeStart?: number;
  showScrollHint?: boolean;
  children?: React.ReactNode;
}

export function StackSpread({
  cards,
  scrollLength = 320,
  stackScale = 0.82,
  textFadeStart = 0.3,
  showScrollHint = true,
  children,
}: StackSpreadProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scale: scaleMul, small: isSmall, colX } = useResponsive();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(
    scrollYProgress,
    [0, SCATTER_START, SCATTER_END, 1],
    [0, 0, 1, 1],
  );

  const parallaxEnabled = reduce !== true && !isSmall;
  const pointer = usePointerParallax(parallaxEnabled);

  // EDIT: the supplied component starts the headline at opacity 0 and fades it
  // in as the cards scatter. On a portfolio splash that reveal is the point; on
  // a page a mosque committee lands on after a phone call, it means the single
  // most important sentence on the site is invisible until someone scrolls —
  // and it is what a social preview or a search crawler sees first. The copy is
  // therefore readable at rest and sits above every card; only a slight settle
  // is left on the scroll.
  const copyScale = useTransform(progress, [textFadeStart, 0.9], [0.97, 1]);
  const scrimOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const hintOpacity = useTransform(progress, [0, SCATTER_START], [1, 0]);

  return (
    <section
      ref={wrapRef}
      className="stack"
      style={{ height: `${scrollLength}vh` }}
    >
      <div className="stack__stage">
        {/* The wash that keeps the headline legible over the clustered cards.
            It is only needed while they are stacked behind the copy — left on,
            it bleaches the screenshots, which are the point of the section. */}
        <motion.div
          className="stack__scrim"
          style={{ opacity: reduce === true ? 0 : scrimOpacity }}
          aria-hidden="true"
        />
        <motion.div
          className="stack__copy"
          style={{
            scale: reduce === true ? 1 : copyScale,
          }}
        >
          {children}
        </motion.div>

        <div className="stack__cards">
          {cards.map((card, i) => (
            <Card
              key={i}
              card={card}
              progress={progress}
              reduce={reduce}
              scaleMul={scaleMul}
              isSmall={isSmall}
              colX={colX}
              stackScale={stackScale}
              pointer={pointer}
              depth={parallaxEnabled ? parallaxDepth(i, cards.length) : 0}
            />
          ))}
        </div>

        {showScrollHint && (
          <motion.p
            className="stack__hint"
            style={{ opacity: reduce === true ? 0 : hintOpacity }}
            aria-hidden="true"
          >
            Scroll
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default StackSpread;
