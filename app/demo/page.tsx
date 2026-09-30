"use client";

import * as React from "react";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import { DemoAdmin } from "@/components/demo-admin";
import { DEMO_MASJID_DEFAULT, DEMO_CREDENTIALS } from "@/lib/demo-data";

/**
 * The demonstration tenant.
 *
 * WHAT THIS IS. A showcase of the portal's screens, built from the fictional
 * dataset in lib/demo-data.ts, so a masjid committee can be walked through it
 * on a call. It is part of the marketing site and deploys with it.
 *
 * WHAT THIS IS NOT. The platform. There is no database behind it, no session,
 * and the sign-in is a string comparison in the browser — `output: 'export'`
 * means there is no server here to authenticate against, and adding one is
 * forbidden. Nothing typed into it leaves the page, and nothing is stored: no
 * localStorage, no cookie, so a reload returns to the sign-in screen. Real
 * software behaviour needs a real tenant; see founder/demo-tenant.md.
 *
 * WHY THE CREDENTIALS ARE PRINTED ON THE SCREEN. Because a login box on a
 * public URL that appears to guard something real, but does not, is a
 * credential-harvesting shape. Saying "demo / demo, this is a demonstration"
 * in plain sight removes any doubt about what the visitor is looking at.
 *
 * THE ?masjid= PARAMETER is the white-label slot, and the reason this is worth
 * more than a slide deck: open /demo/?masjid=Masjid%20e%20Taqwa before a call
 * and the committee sees their own masjid's name above the sign-in. The
 * "Demonstration · sample data" strip stays regardless, so a screenshot can
 * never be passed around as evidence that they are a customer.
 *
 * Read from window.location rather than useSearchParams: the latter forces a
 * Suspense boundary and a client-side bailout under static export, for a value
 * this page can perfectly well pick up after mount.
 */

export default function DemoPage() {
  const [masjid, setMasjid] = React.useState(DEMO_MASJID_DEFAULT);
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("masjid");
    if (!raw) return;
    // Trim, collapse whitespace and cap the length. The value lands in a
    // heading at display size, and React escapes it, so the only real risk is
    // someone pasting an essay and breaking the layout.
    const name = raw.replace(/\s+/g, " ").trim().slice(0, 48);
    if (name) setMasjid(name);
  }, []);

  return (
    <>
      {/* Permanent, on every screen, above everything. */}
      <p className="dstrip">
        <strong>Demonstration</strong>
        <span>
          Sample data. Not a live masjid, and not a real sign-in — these are
          invented pupils and invented balances.
        </span>
      </p>

      {signedIn ? (
        <DemoAdmin masjidName={masjid} onSignOut={() => setSignedIn(false)} />
      ) : (
        <MasjidAccessLogin
          masjidName={masjid}
          onSignIn={(user, pass) => {
            if (
              user.toLowerCase() === DEMO_CREDENTIALS.user &&
              pass === DEMO_CREDENTIALS.pass
            ) {
              setSignedIn(true);
              return null;
            }
            return `Use ${DEMO_CREDENTIALS.user} / ${DEMO_CREDENTIALS.pass} — this is a demonstration.`;
          }}
          hint={
            <>
              Sign in with <code>demo</code> / <code>demo</code>. Add{" "}
              <code>?masjid=Your+Masjid+Name</code> to the address to show a
              masjid&apos;s own name here.
            </>
          }
        />
      )}
    </>
  );
}
