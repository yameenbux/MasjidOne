"use client";

import { DemoTicket } from "@/components/demo-ticket";

/**
 * Where "Having issues? Log a ticket" goes.
 *
 * Inside /demo/ with every other door, so it carries the same noindex and the
 * same demonstration strip. The strip matters more here than almost anywhere:
 * a form headed "Tell us what is wrong" with a working Send button is the one
 * screen somebody might mistake for live support.
 */
export default function DemoTicketPage() {
  return (
    <div className="dshell">
      <p className="dstrip">
        <strong>Demonstration</strong>
        <span>
          Nothing typed here is sent anywhere, and no ticket is raised. This is
          what the form will look like.
        </span>
      </p>
      <DemoTicket />
    </div>
  );
}
