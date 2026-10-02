"use client";

import { DemoSupport } from "@/components/demo-support";

/**
 * Our own door, not a masjid's — the console MasjidOne support signs into.
 * Kept inside /demo/ so it carries the same noindex and the same sample data
 * as every other door.
 */
export default function SupportDemoPage() {
  return (
    <div className="dshell">
      {/* Permanent, above everything, like every other door. It was missing
          here, and this is the worst screen to omit it from: a capture of
          "Masjids we support" with four cards on it reads as four customers,
          and there are none yet. The strip also gives .mlogin the flex parent
          it needs — without it the sign-in stopped short of the fold. */}
      <p className="dstrip">
        <strong>Demonstration</strong>
        <span>
          Sample data. These masajid are invented and are not customers, and
          this is not a real sign-in.
        </span>
      </p>
      <DemoSupport />
    </div>
  );
}
