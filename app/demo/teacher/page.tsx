"use client";

import * as React from "react";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import { DemoTeacher } from "@/components/demo-teacher";
import { DEMO_MASJID_DEFAULT } from "@/lib/demo-data";

/** A teacher's own door. See components/demo-teacher.tsx for why it is separate. */
const CREDS = { user: "teacher", pass: "teacher" } as const;

export default function DemoTeacherPage() {
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
          Sample data. Invented pupils, and not a real sign-in.
        </span>
      </p>

      {signedIn ? (
        <DemoTeacher masjidName={masjid} onSignOut={() => setSignedIn(false)} />
      ) : (
        <MasjidAccessLogin
          masjidName={masjid}
          portalLabel="Teacher Portal"
          onSignIn={(user, pass) =>
            user.trim().toLowerCase() === CREDS.user && pass === CREDS.pass
              ? (setSignedIn(true), null)
              : `Use ${CREDS.user} / ${CREDS.pass} — this is a demonstration.`
          }
          hint={
            <>
              Sign in with <code>teacher</code> / <code>teacher</code>. The
              madrasah issues teacher logins; they are not self-registered.
            </>
          }
        />
      )}
    </div>
  );
}
