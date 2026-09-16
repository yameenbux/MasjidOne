"use client";

import * as React from "react";
import { BookOpen, HandCoins, Smartphone, Tv, Users, type LucideIcon } from "lucide-react";

import { AnimatedBeam } from "@/components/ui/animated-beam";

/**
 * "Five modules, one record of the family", drawn.
 *
 * The geometry is the argument, not decoration: the madrasah side sits on the
 * left, the congregation side on the right, and every beam runs through one
 * hub in the middle. That is the whole claim of the page in one picture.
 *
 * It has to survive three things the rest of the site already requires:
 *
 *  - No JavaScript. The nodes, the hub and their labels are ordinary flow
 *    markup styled in CSS. Only the beams need JS, and AnimatedBeam renders
 *    nothing until it has measured, so without JS this degrades to the
 *    diagram's boxes with no lines — still legible, still labelled.
 *  - prefers-reduced-motion. AnimatedBeam draws the static path and skips the
 *    travelling gradient entirely.
 *  - 360px. The columns stack, the hub sits between them, and the beams
 *    re-measure because they are computed from live positions rather than
 *    fixed coordinates.
 *
 * The status word under each label is load-bearing: "In development" here has
 * to agree with the module cards below it and with the comparison table above.
 */

type NodeSpec = {
  key: string;
  label: string;
  status: "Live" | "In development";
  Icon: LucideIcon;
};

const MADRASAH: NodeSpec[] = [
  { key: "portal", label: "Madrasah portal", status: "In development", Icon: BookOpen },
  { key: "parent", label: "Parent access", status: "In development", Icon: Users },
];

const CONGREGATION: NodeSpec[] = [
  { key: "app", label: "Congregation app", status: "Live", Icon: Smartphone },
  { key: "screens", label: "Website and hall screens", status: "Live", Icon: Tv },
  { key: "giving", label: "Donations and Gift Aid", status: "Live", Icon: HandCoins },
];

// Control-point offset per spoke. AnimatedBeam puts the control point at
// startY - curvature, so a node ABOVE the hub needs a positive value to bow
// away from the centre line. Getting the sign backwards makes neighbouring
// beams cross each other on their way in, which reads as a tangle rather than
// a hub.
const LEFT_CURVE = [26, -26];
const RIGHT_CURVE = [34, 0, -34];

const Node = React.forwardRef<HTMLDivElement, { spec: NodeSpec }>(
  ({ spec }, ref) => (
    <div className="dgm__node" ref={ref}>
      <span className="dgm__icon">
        <spec.Icon className="dgm__glyph" aria-hidden="true" />
      </span>
      <span className="dgm__label">
        {spec.label}
        <span
          className={
            spec.status === "Live" ? "dgm__status is-live" : "dgm__status"
          }
        >
          {spec.status}
        </span>
      </span>
    </div>
  ),
);
Node.displayName = "Node";

export function MasjidOneModulesDiagram() {
  const container = React.useRef<HTMLDivElement>(null);
  const hub = React.useRef<HTMLDivElement>(null);
  const left = [
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ];
  const right = [
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ];

  return (
    <figure className="dgm">
      <div className="dgm__stage" ref={container}>
        <div className="dgm__col dgm__col--left">
          <p className="dgm__side">The madrasah</p>
          {MADRASAH.map((spec, i) => (
            <Node key={spec.key} spec={spec} ref={left[i]} />
          ))}
        </div>

        <div className="dgm__hub" ref={hub}>
          <span className="dgm__mark">
            Masjid<i>One</i>
          </span>
          <span className="dgm__hubsub">One record of the family</span>
        </div>

        <div className="dgm__col dgm__col--right">
          <p className="dgm__side">The congregation</p>
          {CONGREGATION.map((spec, i) => (
            <Node key={spec.key} spec={spec} ref={right[i]} />
          ))}
        </div>

        {left.map((ref, i) => (
          <AnimatedBeam
            key={`l${i}`}
            containerRef={container}
            fromRef={ref}
            toRef={hub}
            curvature={LEFT_CURVE[i]}
            delay={i * 0.8}
            duration={5}
          />
        ))}
        {right.map((ref, i) => (
          <AnimatedBeam
            key={`r${i}`}
            containerRef={container}
            fromRef={ref}
            toRef={hub}
            curvature={RIGHT_CURVE[i]}
            delay={0.4 + i * 0.8}
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
