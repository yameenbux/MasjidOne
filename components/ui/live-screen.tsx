"use client";

import * as React from "react";

/**
 * A masjid's own front page, live, inside a monitor — with their logo behind it.
 *
 * WHY A FRAME AND NOT A SCREENSHOT. A screenshot is a claim about the past.
 * "Is their screen showing the right thing" is only worth asking about now, and
 * a stored image would go stale silently, which is the worst way to be wrong.
 *
 * THE LOGO IS THE MONITOR'S RESTING STATE, not decoration. It sits underneath
 * the frame, so it is what you see while the page is still coming and what is
 * left if the page never comes. A dark empty rectangle on a console about
 * screens reads as a fault; the masjid's own mark reads as a masjid whose page
 * has not painted yet, which is both truer and the better thing to hand
 * somebody mid-conversation.
 *
 * THERE IS NO LOAD DETECTION HERE, AND THAT IS DELIBERATE — the first version
 * had some and it was wrong. It started a timer and cancelled it on the frame's
 * `onLoad`, meaning to show a message if the page never came. But `onLoad`
 * fires for a refused or aborted frame too, so the timer was always cancelled
 * and a dead site rendered as a silent blank rectangle. A test that aborted the
 * request caught it. Nothing available across an origin distinguishes the cases
 * reliably, so this claims nothing about what the monitor is doing and instead
 * says, every time, what a blank one would mean.
 *
 * SO THE FRAME IS NOT MOUNTED UNTIL THE SITE ANSWERS. A browser's own "refused
 * to connect" page is opaque and paints over anything beneath it, so a frame
 * pointed at a dead host hides the very logo meant to stand in for it — which
 * is what a screenshot showed after the logo was added and the assertions still
 * passed, because an <img> can be present, complete and 600px wide while an
 * error page sits on top of it.
 *
 * A no-cors fetch settles that much: it resolves when the host answered and
 * rejects when nothing came back. That is network reachability only — an opaque
 * response cannot reveal a 404, and nothing reveals a frame-ancestors refusal
 * in advance — so this is not a health check and is not presented as one. It
 * decides one thing: whether mounting a frame would paint an error page over
 * the masjid's own mark.
 */
export function LiveScreen({
  src,
  label,
  logo,
}: {
  src: string;
  label: string;
  logo?: { url: string; alt: string } | null;
}) {
  const host = src.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const [answered, setAnswered] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let live = true;
    /* no-cors so the request is allowed at all; the response is opaque and
       deliberately unread. Only whether it settled matters. */
    fetch(src, { mode: "no-cors", cache: "no-store" })
      .then(() => live && setAnswered(true))
      .catch(() => live && setAnswered(false));
    return () => {
      live = false;
    };
  }, [src]);

  return (
    <figure className="lscr">
      <div className="lscr__monitor">
        {logo ? (
          /* Decorative here: the masjid is already named in the heading above,
             and a screen reader announcing the logo would say it twice. */
          // eslint-disable-next-line @next/next/no-img-element
          <img className="lscr__logo" src={logo.url} alt="" aria-hidden="true" />
        ) : null}
        {answered ? (
          <iframe
            className="lscr__frame"
            src={src}
            title={label}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : null}
      </div>
      {/* Short, because four of these sit in a row. What a blank monitor means
          and what it cannot tell you is said once under the grid instead of
          four times across it — see LiveScreenNote. */}
      <figcaption className="lscr__cap">
        <a href={src} target="_blank" rel="noopener noreferrer">
          {host}
        </a>
      </figcaption>
    </figure>
  );
}

/**
 * What the monitors above do not tell you, said once.
 *
 * It used to sit in every caption. At one masjid that was thorough; at four
 * across a row it was the same three lines of small print four times, which is
 * how a caveat stops being read. Once, under the grid, is where somebody
 * actually takes it in — and it is never omitted, because a live picture is
 * persuasive and these are precisely the conclusions it invites and cannot
 * support.
 */
export function LiveScreenNote() {
  return (
    <p className="lscr__note">
      <strong>A blank monitor is not a verdict.</strong> Some sites refuse to be
      framed, so open one before concluding anything is wrong with it. And
      whether a television in the building is switched on and pointed at the
      page is not something the platform can see — there is no screens table and
      nothing takes a screen id.
    </p>
  );
}

export default LiveScreen;
