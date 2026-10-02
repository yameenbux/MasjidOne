"use client";

import * as React from "react";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import { DemoChooser, type ChooserOption } from "@/components/demo-chooser";
import { DemoAdmin } from "@/components/demo-admin";
import { DemoScreens } from "@/components/demo-screens";
import { HallScreen } from "@/components/demo-hall-screen";
import { DemoOffice } from "@/components/demo-office";
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
 * means there is no server here to authenticate against. Nothing typed into it
 * leaves the page and nothing is stored: no localStorage, no cookie. A reload
 * returns to whichever screen the URL names, because only the URL survives.
 *
 * WHY THE CREDENTIALS ARE PRINTED ON THE SCREEN. Because a login box on a
 * public URL that appears to guard something real, but does not, is a
 * credential-harvesting shape.
 *
 * THE TREE
 *
 *   sign in
 *     portals ──┬─ madrasah
 *               └─ congregation ──┬─ timetable & screens
 *                                 └─ masjid office
 *
 * NAVIGATION IS THE URL, not component state. Each screen has a hash —
 * /demo/#office — and the stage is derived from it on mount and on every
 * `hashchange`. Back and Home move the hash; the browser does the rest, so the
 * back button and, the one that actually matters, the phone's back gesture
 * work. Before this, swiping back left the site entirely.
 *
 * WHY THE HASH AND NOT `history.state`. That was the first attempt and it was
 * wrong. Next's App Router owns `popstate` on this page: when you go back it
 * replaceState's its own router tree onto the restored entry and the page
 * remounts, so a mount effect that seeds the stage wipes whatever entry you
 * just returned to — one Back jumped three screens. A hash-only change does
 * not touch the router at all, and `hashchange` is ours. Deriving the stage
 * from the URL also means a remount is harmless: it re-reads the same hash.
 *
 * A SIDE EFFECT WORTH HAVING: the screens are now linkable. Send a committee
 * /demo/?masjid=Their+Masjid#screens and they open on the timetable, no
 * clicking through. Which also means the hash can skip the sign-in screen —
 * fine, and deliberate: that form guards nothing, as above. It is a screen to
 * be shown, not a lock.
 *
 * Back goes up one step. Home goes to the top of the portal you are in; on a
 * portal's own home page it goes to the portal chooser, and the button says
 * which, because an unlabelled Home in a two-level tree is a guess.
 *
 * ?masjid= IS THE WHITE-LABEL SLOT. Open /demo/?masjid=Masjid%20e%20Taqwa
 * before a call and the committee sees their own name above the form. The
 * "Demonstration · sample data" strip stays regardless, so a screenshot can
 * never be passed around as evidence that they are a customer.
 */

const STAGES = [
  "login",
  "portals",
  "madrasah",
  "congregation",
  "screens",
  "office",
] as const;

type Stage = (typeof STAGES)[number];

/** The URL is the source of truth. Anything unrecognised means the sign-in screen. */
function stageFromHash(): Stage {
  const h = window.location.hash.replace(/^#\/?/, "");
  return (STAGES as readonly string[]).includes(h) ? (h as Stage) : "login";
}

/* Built per render rather than held as constants, because the congregation
   previews are rendered from the demo's own prayer data and carry the masjid's
   name — which a committee can change on the sign-in screen before a call. */
const HALL_ALT =
  "A prayer hall screen showing the beginning and jamāʿah times with the next jamāʿah marked";

function portalOptions(masjid: string): [ChooserOption, ChooserOption] {
  return [
    {
      key: "madrasah",
      title: "Madrasah Portal",
      blurb: "Registers, classes, families and fees.",
      img: "admin-register.webp",
      alt: "The madrasah register for one class, with the evening's attendance and the lock",
    },
    {
      key: "congregation",
      title: "Congregation Portal",
      blurb: "Prayer times, screens, notices and giving.",
      alt: HALL_ALT,
      preview: <HallScreen masjidName={masjid} compact />,
    },
  ];
}

function congregationOptions(masjid: string): [ChooserOption, ChooserOption] {
  return [
    {
      key: "screens",
      title: "Timetable & screens",
      blurb: "The times, and what the screens say.",
      alt: HALL_ALT,
      preview: <HallScreen masjidName={masjid} compact />,
    },
    {
      key: "office",
      title: "Masjid office",
      blurb: "Hall hire, nikah, notices, donations and Gift Aid.",
      img: "admin-committee.webp",
      alt: "The committee and roles screen: who can edit times, notices, money and users",
    },
  ];
}

export default function DemoPage() {
  const [masjid, setMasjid] = React.useState(DEMO_MASJID_DEFAULT);
  /* Arrived from the support console. The band then follows you through every
     page, because the one thing somebody must not be able to forget is whose
     system they are standing in. */
  const [support, setSupport] = React.useState(false);
  const [stage, setStage] = React.useState<Stage>("login");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSupport(params.get("support") === "1");
    const raw = params.get("masjid");
    if (raw) {
      // Trim, collapse whitespace and cap the length. The value lands in a
      // heading at display size and React escapes it, so the only real risk is
      // someone pasting an essay and breaking the layout.
      const name = raw.replace(/\s+/g, " ").trim().slice(0, 48);
      if (name) setMasjid(name);
    }

    // Honour a hash that was typed, bookmarked or sent in a link.
    setStage(stageFromHash());
    const onHash = () => setStage(stageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /**
   * Every move goes through here. Setting the hash pushes a history entry and
   * fires `hashchange`, which sets the stage — so state can never drift from
   * the URL, because the URL is the only thing driving it.
   */
  const go = React.useCallback((next: Stage) => {
    window.location.hash = next;
  }, []);

  const back = React.useCallback(() => window.history.back(), []);

  return (
    <div className="dshell">
      {/* Permanent, on every screen, above everything. */}
      <p className="dstrip">
        <strong>Demonstration</strong>
        <span>
          Sample data. Not a live masjid, and not a real sign-in — these are
          invented pupils and invented balances.
        </span>
      </p>

      {support ? (
        <p className="dsupband" role="status">
          <strong>Support access</strong>
          <span>
            You are in <strong>{masjid}</strong>&rsquo;s system as MasjidOne
            support. Recorded in their audit trail.
          </span>
          <a href="support/">Leave</a>
        </p>
      ) : null}

      {stage === "login" ? (
        <MasjidAccessLogin
          masjidName={masjid}
          onSignIn={(user, pass) => {
            if (
              user.toLowerCase() === DEMO_CREDENTIALS.user &&
              pass === DEMO_CREDENTIALS.pass
            ) {
              go("portals");
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

      {stage === "portals" ? (
        <DemoChooser
          masjidName={masjid}
          ask="Where would you like to go?"
          options={portalOptions(masjid)}
          doors={[
            { href: "support/", label: "MasjidOne support" },
            { href: "app/", label: "The congregation app" },
            { href: "teacher/", label: "A teacher" },
            { href: "parent/", label: "A parent" },
          ]}
          onChoose={(k) => go(k as Stage)}
        />
      ) : null}

      {stage === "congregation" ? (
        <DemoChooser
          masjidName={masjid}
          ask="Congregation — which part?"
          options={congregationOptions(masjid)}
          onChoose={(k) => go(k as Stage)}
          nav={{ onBack: back, onHome: () => go("portals"), homeLabel: "Portals" }}
        />
      ) : null}

      {stage === "madrasah" ? (
        <DemoAdmin
          masjidName={masjid}
          onBack={back}
          onHome={() => go("portals")}
          onSwitch={() => go("portals")}
          onSignOut={() => go("login")}
        />
      ) : null}

      {stage === "screens" ? (
        <DemoScreens
          masjidName={masjid}
          onBack={back}
          onHome={() => go("congregation")}
          onSwitch={() => go("portals")}
          onSignOut={() => go("login")}
        />
      ) : null}

      {stage === "office" ? (
        <DemoOffice
          masjidName={masjid}
          onBack={back}
          onHome={() => go("congregation")}
          onSwitch={() => go("portals")}
          onSignOut={() => go("login")}
        />
      ) : null}
    </div>
  );
}
