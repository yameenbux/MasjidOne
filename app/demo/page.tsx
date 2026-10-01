"use client";

import * as React from "react";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import { DemoChooser, type PortalKey } from "@/components/demo-chooser";
import { DemoAdmin } from "@/components/demo-admin";
import { DemoCongregation } from "@/components/demo-congregation";
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
 * software behaviour needs a real tenant, in its own Supabase project.
 *
 * WHY THE CREDENTIALS ARE PRINTED ON THE SCREEN. Because a login box on a
 * public URL that appears to guard something real, but does not, is a
 * credential-harvesting shape. Saying "demo / demo, this is a demonstration"
 * in plain sight removes any doubt about what the visitor is looking at.
 *
 * THE FLOW is sign in → choose a portal → that portal, with "Switch portal" to
 * come back. Both halves lead somewhere real: a chooser whose second door
 * opens onto nothing would undercut the one claim the product rests on.
 *
 * ?masjid= IS THE WHITE-LABEL SLOT. Open /demo/?masjid=Masjid%20e%20Taqwa
 * before a call and the committee sees their own name above the form. The
 * "Demonstration · sample data" strip stays regardless, so a screenshot can
 * never be passed around as evidence that they are a customer.
 *
 * It is read from window.location rather than useSearchParams, which forces a
 * Suspense boundary and a client-side bailout under static export for a value
 * this page can perfectly well pick up after mount.
 */

type Stage = "login" | "pick" | "madrasah" | "congregation";

export default function DemoPage() {
  const [masjid, setMasjid] = React.useState(DEMO_MASJID_DEFAULT);
  const [stage, setStage] = React.useState<Stage>("login");

  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);

    const raw = q.get("masjid");
    if (raw) {
      // Trim, collapse whitespace and cap the length. The value lands in a
      // heading at display size and React escapes it, so the only real risk is
      // someone pasting an essay and breaking the layout.
      const name = raw.replace(/\s+/g, " ").trim().slice(0, 48);
      if (name) setMasjid(name);
    }
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

      {stage === "login" ? (
        <MasjidAccessLogin
          masjidName={masjid}
          onSignIn={(user, pass) => {
            if (
              user.toLowerCase() === DEMO_CREDENTIALS.user &&
              pass === DEMO_CREDENTIALS.pass
            ) {
              setStage("pick");
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
      ) : null}

      {stage === "pick" ? (
        <DemoChooser masjidName={masjid} onChoose={(k: PortalKey) => setStage(k)} />
      ) : null}

      {stage === "madrasah" ? (
        <DemoAdmin
          masjidName={masjid}
          onSwitch={() => setStage("pick")}
          onSignOut={() => setStage("login")}
        />
      ) : null}

      {stage === "congregation" ? (
        <DemoCongregation
          masjidName={masjid}
          onSwitch={() => setStage("pick")}
          onSignOut={() => setStage("login")}
        />
      ) : null}
    </>
  );
}
