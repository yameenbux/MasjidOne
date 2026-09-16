// Comparison 2, adapted from Hirael <https://hirael.com/blocks/comparison/comparison-02>
// MIT · Mohammad Shehadeh · https://github.com/MohammadShehadeh/hirael
//
// Changes from the supplied block, and why:
//
// - Data moved to props. The original hardcoded COLUMNS/ROWS at module scope,
//   which would have put commercial claims inside components/ui/. This repo
//   already keeps that split (ui/pricing.tsx + masjidone-pricing.tsx), so the
//   MasjidOne table lives in components/masjidone-comparison.tsx.
// - shadcn card/border/radius classes replaced with the MasjidOne tokens. The
//   featured column is a --paper-2 fill between hairlines, not a rounded card:
//   the rounded styling is a deliberate one-off in the pricing block.
// - The scroll container is a labelled, focusable region. The original was a
//   bare overflow-x-auto div, which a keyboard user cannot scroll.
// - A third cell kind, { label, emphasis: "pending" }, renders the house
//   "In development" tag, so a half-built row cannot be mistaken for a tick.
// - The <caption> is real (sr-only) rather than decorative.

import { Check, Minus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ComparisonCell =
  | boolean
  | string
  | { label: string; emphasis: "pending" };

export interface ComparisonColumn {
  name: string;
  summary: string;
  /** The column this page is arguing for. One per table. */
  featured?: boolean;
  /** Short marker beside a featured column's name, e.g. "This one". */
  badge?: string;
}

export interface ComparisonRow {
  label: string;
  /** One cell per column, in the same order. */
  cells: readonly ComparisonCell[];
}

export interface Comparison02Props {
  /** Describes the table to a screen reader. Not shown. */
  caption: string;
  /** Label for the first column's header cell. */
  rowHeader: string;
  columns: readonly ComparisonColumn[];
  rows: readonly ComparisonRow[];
  /** Read out when the region takes focus. */
  scrollRegionLabel?: string;
  className?: string;
}

const CellValue = ({ value }: { value: ComparisonCell }) => {
  if (typeof value === "object") {
    return <span className="tag tag--dev">{value.label}</span>;
  }
  if (typeof value === "string") {
    return <span className="cmp__note">{value}</span>;
  }
  return value ? (
    <>
      <Check aria-hidden="true" className="cmp__yes" />
      <span className="sr-only">Yes</span>
    </>
  ) : (
    <>
      <Minus aria-hidden="true" className="cmp__no" />
      <span className="sr-only">No</span>
    </>
  );
};

export function Comparison02({
  caption,
  rowHeader,
  columns,
  rows,
  scrollRegionLabel = "Comparison table",
  className,
}: Comparison02Props) {
  return (
    // Wide content scrolls inside its own container so the page body never
    // does. tabIndex makes the region reachable by keyboard, which an
    // overflow container needs in order to be scrollable without a mouse.
    <div className={cn(className)}>
      <p className="cmp__hint" aria-hidden="true">
        Swipe the table sideways
      </p>
      <div
        className="cmp__scroll"
        role="region"
        aria-label={scrollRegionLabel}
        tabIndex={0}
      >
        <table className="cmp">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className="cmp__corner">
                <span className="cmp__kicker">{rowHeader}</span>
              </th>
              {columns.map((column) => (
                <th
                  key={column.name}
                  scope="col"
                  className={cn("cmp__head", column.featured && "is-featured")}
                >
                  <span className="cmp__name">
                    {column.name}
                    {column.badge && (
                      <span className="tag tag--rec">{column.badge}</span>
                    )}
                  </span>
                  <span className="cmp__summary">{column.summary}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="cmp__row-head">
                  {row.label}
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={columns[index].name}
                    className={cn(
                      "cmp__cell",
                      columns[index].featured && "is-featured",
                    )}
                  >
                    <span className="cmp__v">
                      <CellValue value={cell} />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Comparison02;
