"use client";

// Client, because lucide icon components are passed through to TileGrid and a
// function cannot cross the server-to-client boundary.
import {
  ClipboardList,
  Clock,
  CreditCard,
  FileSpreadsheet,
  Globe,
  MessageSquare,
} from "lucide-react";

import { TileGrid, type Tile } from "@/components/ui/tile-grid";

/**
 * "What you are running instead."
 *
 * The competitor pattern this borrows puts named products and a monthly price
 * on each tile and totals them. Neither is available here:
 *
 *  - Naming sixteen third-party products turns a mosque system into a
 *    tool-consolidation pitch, and the house rule keeps comparison out of the
 *    page and in the room.
 *  - The prices on that pattern are illustrative. Printing a figure for what
 *    someone else charges means defending it, and a committee member on a free
 *    tier will know it is wrong. Rule 3 does not allow invented numbers.
 *
 * So the tiles name categories and nothing else. There is no closing band and
 * no total: the section states what a masjid is holding together by hand and
 * lets the join section, directly above it, carry the argument.
 */

const TILES: readonly Tile[] = [
  {
    key: "site",
    title: "A website",
    body: "Built by somebody's nephew, or on a builder subscription nobody can log into any more. The prayer times on it are months out.",
    Icon: Globe,
  },
  {
    key: "times",
    title: "A prayer-times app",
    body: "Calculated times rather than the ones on your board, so the app and the hall disagree and the congregation trusts neither.",
    Icon: Clock,
  },
  {
    key: "giving",
    title: "A donation platform",
    body: "It takes a percentage, and the list of who gave lives with them rather than with the masjid.",
    Icon: CreditCard,
  },
  {
    key: "msg",
    title: "Broadcast messages",
    body: "Announcements and janāzah notices sent by bulk text or a WhatsApp broadcast, to whichever numbers somebody remembered to add.",
    Icon: MessageSquare,
  },
  {
    key: "register",
    title: "A paper register and a fees book",
    body: "One teacher's handwriting, one drawer. Nobody can answer who missed three weeks running without turning pages.",
    Icon: ClipboardList,
  },
  {
    key: "sheet",
    title: "A spreadsheet of families",
    body: "Out of date the week after it was made, and living on one volunteer's laptop.",
    Icon: FileSpreadsheet,
  },
];

export function MasjidOneStack() {
  return <TileGrid tiles={TILES} />;
}

export default MasjidOneStack;
