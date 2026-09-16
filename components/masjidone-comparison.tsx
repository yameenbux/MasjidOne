import {
  Comparison02,
  type ComparisonColumn,
  type ComparisonRow,
} from "@/components/ui/comparison-02";

/**
 * The join, as a table.
 *
 * Three content rules shape every cell here, and none of them are negotiable:
 *
 *  - Competitors are not named. These are categories, which is how the rest of
 *    the page already talks about them ("one keeps the children, the other
 *    keeps the congregation"). The comparison by name happens in the room.
 *  - The congregation column genuinely ticks the congregation rows. Claiming
 *    otherwise would be false — several platforms do that side, and well.
 *  - Nothing unbuilt gets a tick. Everything in the madrasah and the bridge
 *    rows carries the "In development" tag, because that is what it is.
 *
 * Read down the MasjidOne column and the argument is the shape of the table,
 * not an adjective in it: the top four rows are matched by one neighbour, the
 * next two by the other, and the last two by nobody.
 */

const COLUMNS: readonly ComparisonColumn[] = [
  {
    name: "A madrasah system",
    summary: "Keeps the children's record. Never sees the masjid.",
  },
  {
    name: "MasjidOne",
    summary: "One record of the family, reachable from both sides.",
    featured: true,
    badge: "The join",
  },
  {
    name: "A congregation app",
    summary: "Keeps the masjid's day. Never sees the madrasah.",
  },
];

const ROWS: readonly ComparisonRow[] = [
  { label: "Prayer times and jamāʿah reminders", cells: [false, true, true] },
  { label: "Announcements and janāzah notices", cells: [false, true, true] },
  { label: "Website and hall screens", cells: [false, true, true] },
  { label: "Donations and Gift Aid", cells: [false, true, true] },
  {
    label: "Registers, Hifz and sabaq progress",
    cells: [true, { label: "In development", emphasis: "pending" }, false],
  },
  {
    label: "Madrasah fees and automatic chasing",
    cells: [true, { label: "In development", emphasis: "pending" }, false],
  },
  {
    label: "One record of the same family on both sides",
    cells: [false, { label: "In development", emphasis: "pending" }, false],
  },
  {
    label: "Parents use the app they already have",
    cells: [false, { label: "In development", emphasis: "pending" }, false],
  },
];

export function MasjidOneComparison() {
  return (
    <Comparison02
      rowHeader="What it keeps"
      caption="What a madrasah system, MasjidOne, and a congregation app each keep for a mosque."
      scrollRegionLabel="What each system keeps — scrollable table"
      columns={COLUMNS}
      rows={ROWS}
    />
  );
}

export default MasjidOneComparison;
