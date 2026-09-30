import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/brand-mark";

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
 */
export function PoweredBy({ className }: { className?: string }) {
  return (
    <p className={cn("powered", className)}>
      {/* BrandMark takes only className, so the decorative hiding goes on a
          wrapper rather than through a prop it does not accept. */}
      <span className="powered__mark" aria-hidden="true">
        <BrandMark />
      </span>
      <span>
        Powered by <strong>MasjidOne</strong>
      </span>
    </p>
  );
}

export default PoweredBy;
