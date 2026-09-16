"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/**
 * A grid of small tiles with an optional closing band, in the shape of the
 * "one system replaces all of this" pattern.
 *
 * Deliberately data-driven and claim-free: the component renders what it is
 * given and asserts nothing. The commercial content lives in
 * components/masjidone-*.tsx, which is where the rules about what may be
 * claimed are enforced.
 *
 * Motion matches components/ui/feature.tsx — the whileInView rise, the hover
 * and tap scale — so the page has one card idiom rather than three. Tiles
 * carry .mod-card so the html:not(.js) reset in globals.css unwinds framer's
 * SSR-baked transform for them too.
 */

export type Tile = {
  key: string;
  title: string;
  body: string;
  Icon: LucideIcon;
};

export interface TileGridProps {
  tiles: readonly Tile[];
  /** Optional dark closing band under the grid. */
  band?: { lead: React.ReactNode; sub?: React.ReactNode };
  className?: string;
}

export function TileGrid({ tiles, band, className }: TileGridProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.key}
            className="mod-card bg-muted rounded-xl p-6 flex flex-col gap-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, delay: (i % 3) * 0.08 }}
          >
            <span className="tile__icon">
              <tile.Icon className="tile__glyph" aria-hidden="true" />
            </span>
            <h3 className="font-serif text-lg text-foreground">{tile.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{tile.body}</p>
          </motion.div>
        ))}
      </div>

      {band && (
        <div className="tile__band">
          <p className="tile__band-lead">{band.lead}</p>
          {band.sub && <p className="tile__band-sub">{band.sub}</p>}
        </div>
      )}
    </div>
  );
}

export default TileGrid;
