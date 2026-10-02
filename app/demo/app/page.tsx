"use client";

import * as React from "react";
import { DemoApp } from "@/components/demo-app";
import { DEMO_MASJID_DEFAULT } from "@/lib/demo-data";

/**
 * The congregation app.
 *
 * WHY THIS EXISTS, AND WHY IT WAS MISSING. The demo had three doors — staff,
 * teacher, parent — and not one view of what an ordinary member of the
 * congregation sees. That was worse than a gap. The site's central claim, in
 * three places, is "the same app a parent already has for jamāʿah times — no
 * second app to install. This is the bridge." With a standalone Parents Portal
 * and no app, the demonstration showed the opposite of the claim: a second
 * thing to sign in to.
 *
 * NO SIGN-IN WALL, deliberately. Anybody installs this for prayer times, and
 * that is how it opens. Signing in is what ADDS a household — which is the
 * actual shape of the product and the only way to show the bridge in one
 * screen rather than describe it.
 */
export default function AppDemoPage() {
  const [masjid, setMasjid] = React.useState(DEMO_MASJID_DEFAULT);

  /* Same courtesy as the other doors: ?masjid=Their+Name puts the committee's
     own masjid at the top of the screen before a call. */
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("masjid");
    if (q) setMasjid(q.slice(0, 60));
  }, []);

  return (
    <div className="dshell">
      {/* Missing here too. Every other door carries it. */}
      <p className="dstrip">
        <strong>Demonstration</strong>
        <span>
          Sample data. Not a live masjid and not a real sign-in — invented
          children, invented balances, an interface preview of the app.
        </span>
      </p>
      <DemoApp masjidName={masjid} />
    </div>
  );
}
