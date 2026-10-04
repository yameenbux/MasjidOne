import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/brand-mark";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * MasjidOne's credit, as it appears in the footer of every portal screen.
 *
 * One component rather than a line of markup repeated per screen, so "always
 * in the footer" is a property of the code and not of whoever adds the next
 * screen. Add a screen, import this, done.
 *
 * It is deliberately a notch above fine print — brass, letterspaced, at the
 * small-text size rather than the label size, with the mark beside it — so it
 * reads as a badge. The masjid's own name carries the top of the screen; this
 * carries the bottom. That is the ordinary white-label arrangement and it is
 * also the commercially useful one: a committee reads the footer of a screen
 * they use every evening far more often than they read a sales page.
 *
 * IT IS A LINK, and the href is absolute rather than base-path relative. A
 * masjid's portal is served from the masjid's own domain, so a relative link
 * would point at a page on their site that does not exist. SITE_ORIGIN is the
 * canonical MasjidOne address whatever is hosting the screen this sits on.
 *
 * It opens in a new tab on purpose: a teacher halfway through a register
 * should not lose it to a stray click on the footer. That makes the new-tab
 * warning for screen readers mandatory, not optional — hence the hidden span.
 */
export function PoweredBy({ className }: { className?: string }) {
  return (
    <p className={cn("powered", className)}>
      <a className="powered__link" href={SITE_ORIGIN} target="_blank" rel="noopener noreferrer">
        {/* BrandMark takes only className, so the decorative hiding goes on a
            wrapper rather than through a prop it does not accept. */}
        <span className="powered__mark" aria-hidden="true">
          <BrandMark />
        </span>
        <span>
          Powered by <strong>MasjidOne</strong>
        </span>
        <span className="u-visually-hidden"> (opens in a new tab)</span>
      </a>
    </p>
  );
}

export default PoweredBy;
