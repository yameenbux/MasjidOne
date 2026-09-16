"use client";

import * as React from "react";
import { BookOpen, HandCoins, Smartphone, Tv, Users, type LucideIcon } from "lucide-react";

import { AnimatedBeam } from "@/components/ui/animated-beam";

/**
 * "Five modules, one record of the family", drawn.
 *
 * Geometry follows the Magic UI block's demo rather than being re-invented,
 * because the sweep is the whole effect and it only exists when two things are
 * true: the stage is much taller than the band the nodes occupy, so the curves
 * have somewhere to travel, and the control point is pushed to the far side of
 * the start (negative curvature for a node above the hub, positive for one
 * below). Flatten the stage or flip those signs and the beams collapse into
 * short straight stubs.
 *
 * No container fill and no border: the beams read against the page, as in the
 * original. Round nodes are a deliberate departure from the flat, hairline
 * vernacular — a graph node is not a card, and this is the shape the block is.
 *
 * Three things the site requires and the supplied block did not do:
 *  - Without JavaScript AnimatedBeam renders nothing, so the circles, icons and
 *    labels are ordinary flow markup. The diagram loses its lines, not its
 *    meaning.
 *  - prefers-reduced-motion keeps the static path and drops the travelling
 *    gradient.
 *  - The status word under each label has to agree with the module cards below
 *    and the comparison table above.
 */

type NodeSpec = { key: string; label: string; status: "Live" | "In development"; Icon: LucideIcon };

const MADRASAH: NodeSpec[] = [
  { key: "portal", label: "Madrasah portal", status: "In development", Icon: BookOpen },
  { key: "parent", label: "Parent access", status: "In development", Icon: Users },
];

const CONGREGATION: NodeSpec[] = [
  { key: "app", label: "Congregation app", status: "Live", Icon: Smartphone },
  { key: "screens", label: "Website and hall screens", status: "Live", Icon: Tv },
  { key: "giving", label: "Donations and Gift Aid", status: "Live", Icon: HandCoins },
];

/** Beam shape per spoke, mirroring the demo's -75 / 0 / +75 fan. */
const LEFT_BEAMS = [
  { curvature: -70, endYOffset: -10 },
  { curvature: 70, endYOffset: 10 },
];
const RIGHT_BEAMS = [
  { curvature: -75, endYOffset: -10 },
  { curvature: 0, endYOffset: 0 },
  { curvature: 75, endYOffset: 10 },
];

const Node = React.forwardRef<HTMLDivElement, { spec: NodeSpec }>(({ spec }, ref) => (
  <div className="dgm__node">
    <div className="dgm__circle" ref={ref}>
      <spec.Icon className="dgm__glyph" aria-hidden="true" />
    </div>
    <span className="dgm__label">
      {spec.label}
      <span className={spec.status === "Live" ? "dgm__status is-live" : "dgm__status"}>
        {spec.status}
      </span>
    </span>
  </div>
));
Node.displayName = "Node";

export function MasjidOneModulesDiagram() {
  const container = React.useRef<HTMLDivElement>(null);
  const hub = React.useRef<HTMLDivElement>(null);
  const l0 = React.useRef<HTMLDivElement>(null);
  const l1 = React.useRef<HTMLDivElement>(null);
  const r0 = React.useRef<HTMLDivElement>(null);
  const r1 = React.useRef<HTMLDivElement>(null);
  const r2 = React.useRef<HTMLDivElement>(null);
  const left = [l0, l1];
  const right = [r0, r1, r2];

  return (
    <figure className="dgm">
      <div className="dgm__stage" ref={container}>
        <div className="dgm__band">
          <div className="dgm__col dgm__col--left">
            <p className="dgm__side">The madrasah</p>
            {MADRASAH.map((spec, i) => (
              <Node key={spec.key} spec={spec} ref={left[i]} />
            ))}
          </div>

          <div className="dgm__hubwrap">
            <div className="dgm__hub" ref={hub}>
              <span className="dgm__mark">
                Masjid<i>One</i>
              </span>
            </div>
            <span className="dgm__hubsub">One record of the family</span>
          </div>

          <div className="dgm__col dgm__col--right">
            <p className="dgm__side">The congregation</p>
            {CONGREGATION.map((spec, i) => (
              <Node key={spec.key} spec={spec} ref={right[i]} />
            ))}
          </div>
        </div>

        {left.map((ref, i) => (
          <AnimatedBeam
            key={`l${i}`}
            containerRef={container}
            fromRef={ref}
            toRef={hub}
            curvature={LEFT_BEAMS[i].curvature}
            endYOffset={LEFT_BEAMS[i].endYOffset}
            delay={i * 0.9}
            duration={5}
          />
        ))}
        {right.map((ref, i) => (
          <AnimatedBeam
            key={`r${i}`}
            containerRef={container}
            fromRef={ref}
            toRef={hub}
            curvature={RIGHT_BEAMS[i].curvature}
            endYOffset={RIGHT_BEAMS[i].endYOffset}
            delay={0.45 + i * 0.9}
            duration={5}
            reverse
          />
        ))}
      </div>
      <figcaption className="dgm__cap">
        Diagram, not a screenshot. Two modules are in development for the
        September 2027 intake; the other three are running in a Bolton masjid
        today.
      </figcaption>
    </figure>
  );
}

export default MasjidOneModulesDiagram;
