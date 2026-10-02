"use client";

import * as React from "react";

/**
 * A masjid's own front page, live, inside a monitor.
 *
 * WHY A FRAME AND NOT A SCREENSHOT. A screenshot is a claim about the past.
 * "Is their screen showing the right thing" is only worth asking about now, and
 * a stored image would go stale silently, which is the worst way to be wrong.
 *
 * THERE IS NO LOAD DETECTION HERE, AND THAT IS DELIBERATE — the first version
 * had some and it was wrong. It started a timer and cancelled it on the frame's
 * `onLoad`, meaning to show a message if the page never came. But `onLoad`
 * fires for a refused or aborted frame too, so the timer was always cancelled
 * and a dead site rendered as a silent blank rectangle: the one answer this
 * component must never give, since a blank monitor is exactly what a broken
 * masjid screen looks like. A test that aborted the request caught it.
 *
 * Nothing available to a cross-origin frame distinguishes the cases reliably —
 * the content cannot be read, and a browser's own "refused to connect" page
 * paints over anything placed behind the frame. So this claims nothing about
 * what the monitor is doing, and instead says, every time and regardless, what
 * a blank one would mean and where to look instead. Guidance that is always
 * true beats detection that is sometimes wrong.
 */
export function LiveScreen({ src, label }: { src: string; label: string }) {
  const host = src.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <figure className="lscr">
      <div className="lscr__monitor">
        <iframe
          className="lscr__frame"
          src={src}
          title={label}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <figcaption className="lscr__cap">
        <a href={src} target="_blank" rel="noopener noreferrer">
          {host}
        </a>{" "}
        — live. <strong>A blank monitor is not a verdict:</strong> some sites
        refuse to be framed, so open it before concluding anything. And whether
        a television in the building is switched on and pointed at this is not
        something the platform can see.
      </figcaption>
    </figure>
  );
}

export default LiveScreen;
