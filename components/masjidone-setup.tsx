"use client";

// Client, because lucide icon components are passed through to TileGrid and a
// function cannot cross the server-to-client boundary.
import {
  CalendarDays,
  FileCheck,
  FileUp,
  GraduationCap,
  Receipt,
  CalendarCheck,
} from "lucide-react";

import { TileGrid, type Tile } from "@/components/ui/tile-grid";

/**
 * "What the £499 actually buys."
 *
 * The competitor pattern this borrows from says "a small team behind you",
 * "your messages written for you", "everything built for you". That is an
 * agency describing an agency, and it is charged at £399 a month. None of it
 * is true here and none of it is affordable at £79.
 *
 * Every tile below is something already committed elsewhere on this site: the
 * setup description in the FAQ, the waiver in the pricing section, and the
 * compliance promises in Your data. This section moves them somewhere a
 * committee will actually read them, next to the number they are about to be
 * asked for. Nothing here is a new claim.
 */

const TILES: readonly Tile[] = [
  {
    key: "lists",
    title: "Your class lists, imported",
    body: "From paper, a spreadsheet, or whatever system you are on now. Nobody at the masjid retypes a single name.",
    Icon: FileUp,
  },
  {
    key: "training",
    title: "Your teachers trained",
    body: "On the system they will actually use, before the first register is marked. Migration from paper is usually the simpler one.",
    Icon: GraduationCap,
  },
  {
    key: "times",
    title: "Your timetable, your times",
    body: "The masjid's own jamāʿah times loaded as they are on the board, not a calculation that drifts from it.",
    Icon: CalendarCheck,
  },
  {
    key: "weekend",
    title: "One weekend, before a new term",
    body: "Madrasahs change systems between years, not in the middle of one. The switch works to your calendar, not ours.",
    Icon: CalendarDays,
  },
  {
    key: "written",
    title: "In writing before you are invoiced",
    body: "ICO registration and a signed data processing agreement for your masjid, in place before the first bill is raised.",
    Icon: FileCheck,
  },
  {
    key: "waived",
    title: "£499 once, or nothing",
    body: "A single setup fee rather than a monthly one, and it is waived outright on twelve months prepaid. The monthly rate never changes.",
    Icon: Receipt,
  },
];

export function MasjidOneSetup() {
  return <TileGrid tiles={TILES} />;
}

export default MasjidOneSetup;
