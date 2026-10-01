"use client";

import * as React from "react";
import { MasjidAccessLogin } from "@/components/ui/masjid-access-login";
import { PoweredBy } from "@/components/ui/powered-by";
import { DEMO_PARENT_CREDENTIALS } from "@/lib/demo-data";

/**
 * Getting a parent in, and what happens when they cannot get in.
 *
 * THE JOURNEY
 *   3 wrong      a way out appears: have you forgotten your password?
 *   reset        they type their address and we send a link
 *   5 wrong      locked — contact the office, and a ticket from this screen
 *
 * THREE THINGS THAT ARE NOT NEGOTIABLE, and are the reason this is its own
 * file rather than a few lines in the page:
 *
 * 1. THE RESET SCREEN NEVER SAYS WHETHER THE ADDRESS EXISTS. It answers the
 *    same way for an address on file and one that is not. Anything else is an
 *    oracle for "is this family at this madrasah", which is a question about
 *    children that a stranger should not be able to ask.
 *
 * 2. THE LOCK RELEASES ITSELF. Fifteen minutes, with the office ticket as an
 *    immediate override. A permanent lock is a denial of service somebody can
 *    aim at a parent whose address they know, and every genuine one becomes
 *    work for the volunteer in the office. Change RELEASE_AFTER to 0 for a
 *    lock that only the office can clear.
 *
 * 3. COUNTING ATTEMPTS IN THE BROWSER IS THEATRE. It is fine here, where there
 *    is no account to protect. In the platform the counter has to live beside
 *    the password or it is cleared by reopening the tab.
 *
 * Email is the username because the platform already works that way — a parent
 * login is a Supabase auth user keyed on address. The office-issued sign-in
 * stays available underneath for the households with no email at all; at
 * Taiyabah that is twelve of them, and they are not worth excluding.
 */

const PROMPT_AFTER = 3;
const LOCK_AFTER = 5;
/** Minutes until a lock releases itself. 0 means only the office can clear it. */
const RELEASE_AFTER = 15;

type Stage = "signin" | "reset" | "resetSent" | "locked" | "ticket" | "ticketSent";

export function DemoParentAccess({
  masjidName,
  onSignedIn,
}: {
  masjidName: string;
  onSignedIn: () => void;
}) {
  const [stage, setStage] = React.useState<Stage>("signin");
  const [tries, setTries] = React.useState(0);
  const [address, setAddress] = React.useState("");

  const left = LOCK_AFTER - tries;

  if (stage === "signin") {
    return (
      <MasjidAccessLogin
        masjidName={masjidName}
        portalLabel="Parents Portal"
        userLabel="Your email address"
        userType="email"
        onSignIn={(user, pass) => {
          const ok =
            user.trim().toLowerCase() === DEMO_PARENT_CREDENTIALS.user &&
            pass === DEMO_PARENT_CREDENTIALS.pass;
          if (ok) {
            onSignedIn();
            return null;
          }
          const n = tries + 1;
          setTries(n);
          if (n >= LOCK_AFTER) {
            setStage("locked");
            return null;
          }
          // Never says which of the two was wrong.
          return n >= PROMPT_AFTER
            ? `Not recognised. ${LOCK_AFTER - n} ${LOCK_AFTER - n === 1 ? "attempt" : "attempts"} left before this account is locked.`
            : "Those details were not recognised.";
        }}
        notice={
          tries >= PROMPT_AFTER ? (
            <p className="mlogin__help">
              Have you forgotten your password?{" "}
              <button
                type="button"
                className="mlogin__link"
                onClick={() => setStage("reset")}
              >
                Click here to reset it
              </button>
            </p>
          ) : null
        }
        hint={
          <>
            Sign in with <code>{DEMO_PARENT_CREDENTIALS.user}</code> /{" "}
            <code>{DEMO_PARENT_CREDENTIALS.pass}</code>. Get it wrong{" "}
            {PROMPT_AFTER} times to see the reset, {LOCK_AFTER} to see the lock.
            {tries > 0 && left > 0 ? ` ${left} left.` : ""}
          </>
        }
      />
    );
  }

  return (
    <main className="paccess">
      <div className="paccess__panel">
        <h1 className="paccess__name">{masjidName}</h1>
        <p className="mlogin__sub">Parents Portal</p>

        {stage === "reset" ? (
          <form
            className="paccess__body"
            onSubmit={(e) => {
              e.preventDefault();
              setStage("resetSent");
            }}
          >
            <h2 className="paccess__h">Reset your password</h2>
            <p className="paccess__p">
              Type the address the madrasah has for you and we will send a link
              to set a new password.
            </p>
            <div className="pform__field">
              <label htmlFor="reset-email">Your email address</label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="paccess__acts">
              <button type="submit" className="dcong__do">
                Send the link
              </button>
              <button
                type="button"
                className="dcong__do dcong__do--small"
                onClick={() => setStage("signin")}
              >
                Back to sign in
              </button>
            </div>
          </form>
        ) : null}

        {stage === "resetSent" ? (
          <div className="paccess__body">
            <h2 className="paccess__h">Check your email</h2>
            {/* Deliberately the same answer whether or not the address is on
                file. Confirming it would tell a stranger which families attend
                this madrasah. */}
            <p className="paccess__p">
              If <strong>{address || "that address"}</strong> is on file for a
              parent here, a link to set a new password is on its way. It works
              once and expires in an hour.
            </p>
            <p className="paccess__p paccess__muted">
              Nothing arrived? It may not be the address the madrasah holds.
              The office can tell you which one they have.
            </p>
            <button
              type="button"
              className="dcong__do dcong__do--small"
              onClick={() => { setStage("signin"); setTries(0); }}
            >
              Back to sign in
            </button>
          </div>
        ) : null}

        {stage === "locked" ? (
          <div className="paccess__body">
            <p className="modp__tag" style={{ margin: "0 0 .6rem" }}>
              <span className="tag tag--dev">Account locked</span>
            </p>
            <h2 className="paccess__h">Contact the office to get your password reset</h2>
            <p className="paccess__p">
              There have been {LOCK_AFTER} failed attempts on this account, so
              it is locked.{" "}
              {RELEASE_AFTER > 0
                ? `It unlocks itself in ${RELEASE_AFTER} minutes. If you need it sooner, send the office a ticket and they will reset it.`
                : "The office will need to reset it for you."}
            </p>
            <div className="paccess__acts">
              <button
                type="button"
                className="dcong__do"
                onClick={() => setStage("ticket")}
              >
                Send a ticket to the office
              </button>
            </div>
          </div>
        ) : null}

        {stage === "ticket" ? (
          <form
            className="paccess__body"
            onSubmit={(e) => {
              e.preventDefault();
              setStage("ticketSent");
            }}
          >
            <h2 className="paccess__h">Ask the office to reset your credentials</h2>
            <p className="paccess__p">
              This reaches the Masjid office screen as a request against your
              family, not somebody&apos;s personal phone.
            </p>
            <div className="pform__field">
              <label htmlFor="tkt-email">Your email address</label>
              <input
                id="tkt-email"
                type="email"
                autoComplete="email"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="pform__field">
              <label htmlFor="tkt-child">Your child&apos;s name</label>
              <input id="tkt-child" type="text" required />
            </div>
            <p className="paccess__p paccess__muted">
              The office checks the child against the family on file before
              resetting anything, so a stranger cannot have a parent&apos;s
              password changed by asking.
            </p>
            <div className="paccess__acts">
              <button type="submit" className="dcong__do">Send the ticket</button>
              <button
                type="button"
                className="dcong__do dcong__do--small"
                onClick={() => setStage("locked")}
              >
                Back
              </button>
            </div>
          </form>
        ) : null}

        {stage === "ticketSent" ? (
          <div className="paccess__body">
            <h2 className="paccess__h">The office has it</h2>
            <p className="paccess__p">
              Your request is in the office&apos;s queue with a reference. They
              will check your child against the family on file and reset the
              password. You will get an email when they have.
            </p>
            <button
              type="button"
              className="dcong__do dcong__do--small"
              onClick={() => { setStage("signin"); setTries(0); }}
            >
              Back to sign in
            </button>
          </div>
        ) : null}

        <div className="paccess__foot">
          <PoweredBy />
        </div>
      </div>
    </main>
  );
}
