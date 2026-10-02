"use client";

import { DemoSupport } from "@/components/demo-support";

/**
 * Our own door, not a masjid's — the console MasjidOne support signs into.
 * Kept inside /demo/ so it carries the same noindex and the same sample data
 * as every other door.
 */
export default function SupportDemoPage() {
  return <DemoSupport />;
}
