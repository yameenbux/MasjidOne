"use client";

import * as React from "react";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import {
  DEMO_MASJID_DEFAULT,
  DEMO_PARENT_CREDENTIALS,
} from "@/lib/demo-data";

/**
 * The parents' door.
 *
 * WHY THIS IS A SEPARATE ENTRANCE, not another option on the staff chooser.
 * A parent is not a smaller administrator. They arrive to answer one question
 * — was my child marked in, what do I owe — and they should never see a screen
 * that implies the rest of the madrasah is theirs to look at. Staff come in at
 * /demo/ and choose a portal; a parent comes in here and lands on their own
 * children. Keeping the doors apart is also the honest shape for access: the
 * parent role reaches one household and nothing else.
 *
 * WHAT THIS IS. The demonstration surface, built from invented data, so a
 * committee can be shown what a parent will see. There is no database behind
 * it and the sign-in is a string comparison in the browser, which is why the
 * credentials are printed on the screen.
 *
 * WHAT IS NOT BUILT. Parent access in the real platform. `user_roles` holds
 * zero parent accounts and no parent has ever signed in. This screen is a
 * design, not a claim, and the strip at the top says so.
 */
export default function DemoParentPage() {
  const [masjid, setMasjid] = React.useState(DEMO_MASJID_DEFAULT);
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("masjid");
    if (raw) {
      const name = raw.replace(/\s+/g, " ").trim().slice(0, 48);
      if (name) setMasjid(name);
    }
  }, []);

  return (
    <div className="dshell">
      <p className="dstrip">
        <strong>Demonstration</strong>
        <span>
          Sample data, and a design rather than a working portal — parent
          access is still in development.
        </span>
      </p>

      {signedIn ? (
        <section className="sect wrap">
          <h1 className="measure">Signed in</h1>
          <p className="modp__lede measure">
            This is where {masjid}&apos;s parents will land. The screens behind
            this door are the next thing to build.
          </p>
        </section>
      ) : (
        <MasjidAccessLogin
          masjidName={masjid}
          portalLabel="Parents Portal"
          onSignIn={(user, pass) => {
            if (
              user.trim().toLowerCase() === DEMO_PARENT_CREDENTIALS.user &&
              pass === DEMO_PARENT_CREDENTIALS.pass
            ) {
              setSignedIn(true);
              return null;
            }
            // Deliberately does not say which of the two was wrong.
            return `Use ${DEMO_PARENT_CREDENTIALS.user} / ${DEMO_PARENT_CREDENTIALS.pass} — this is a demonstration.`;
          }}
          hint={
            <>
              Sign in with <code>parent</code> / <code>parent</code>. Your
              madrasah issues this — you do not create it yourself.
            </>
          }
        />
      )}
    </div>
  );
}
