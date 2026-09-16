"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

/**
 * EDIT: the site tags every module Live or In development, and the price cards
 * have to carry the same tags or the pricing block quietly claims more than the
 * rest of the page does. A plan-level status covers a plan that is wholly one or
 * the other; a feature-level one covers the mixed card.
 */
type Status = "live" | "dev";

type PricingFeature = string | { text: string; status: Status };

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  /** EDIT: the period label when twelve months are prepaid, e.g. "year". */
  yearlyPeriod?: string;
  /** EDIT: shown as a tag under the plan name. */
  status?: Status;
  features: PricingFeature[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

const TAG_LABEL: Record<Status, string> = {
  live: "Live",
  dev: "In development",
};

/** EDIT: reuses the site's own .tag rules so the wording and colour match #what. */
function StatusTag({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "tag",
        status === "live" ? "tag--live" : "tag--dev",
        className
      )}
    >
      {TAG_LABEL[status]}
    </span>
  );
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // EDIT: the repo's quality bar requires prefers-reduced-motion guards, and
  // neither the card motion nor the confetti had one.
  const reduceMotion = useReducedMotion();
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current && !reduceMotion) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // EDIT: canvas-confetti parses hex and nothing else — its colorsToRgb
      // maps every entry through hexToRgb, which strips non-hex characters and
      // slices the result. Handing it "hsl(162 56% 11%)" does not fail loudly,
      // it silently yields a garbage colour, which is why the confetti came out
      // mauve instead of brass. The shadcn tokens stay the source of truth, so
      // resolve them off the document and convert to hex here.
      const hslToHex = (hsl: string) => {
        const [h, sPct, lPct] = hsl
          .split(/[\s,/]+/)
          .slice(0, 3)
          .map((n) => parseFloat(n));
        if ([h, sPct, lPct].some(Number.isNaN)) return null;
        const sat = sPct / 100;
        const light = lPct / 100;
        const c = (1 - Math.abs(2 * light - 1)) * sat;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = light - c / 2;
        const seg = Math.floor(((h % 360) + 360) % 360 / 60);
        const [r, g, b] = [
          [c, x, 0], [x, c, 0], [0, c, x],
          [0, x, c], [x, 0, c], [c, 0, x],
        ][seg];
        const hex = (v: number) =>
          Math.round((v + m) * 255).toString(16).padStart(2, "0");
        return `#${hex(r)}${hex(g)}${hex(b)}`;
      };

      const styles = getComputedStyle(document.documentElement);
      const token = (name: string) => {
        const raw = styles.getPropertyValue(name).trim();
        if (!raw) return null;
        // The raw MasjidOne tokens are already hex; the shadcn ones are HSL.
        return raw.startsWith("#") ? raw : hslToHex(raw);
      };

      const palette = [
        token("--accent"),
        token("--primary"),
        token("--secondary"),
        token("--brass-2"),
      ].filter((c): c is string => Boolean(c));

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        // Omitting `colors` entirely would give canvas-confetti's own default
        // palette, which is not ours — so only pass it when we resolved some.
        ...(palette.length ? { colors: palette } : {}),
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* EDIT: was an empty <label> wrapping an empty <Label> wrapping the
          Switch, with the only text in a sibling <span> — so the control had no
          accessible name at all and a screen reader announced a bare "switch".
          One Label, associated by id, and the visible text is the name. */}
      <div className="flex items-center justify-center mb-10">
        <Switch
          id="masjidone-billing-toggle"
          ref={switchRef as any}
          checked={!isMonthly}
          onCheckedChange={handleToggle}
          className="relative"
        />
        <Label
          htmlFor="masjidone-billing-toggle"
          className="ml-3 font-semibold cursor-pointer"
        >
          {/* EDIT: MasjidOne never discounts the monthly — the setup fee is
              waived instead, so the label says what actually happens. */}
          Twelve months prepaid{" "}
          <span className="text-primary">(setup fee waived)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
        {plans.map((plan, index) => {
          // EDIT: where the card comes to rest. The sideways offset and the
          // slight scale-down are the decorative part, so they only apply on a
          // desktop viewport; the phone layout rests flat.
          const restingLayout = isDesktop
            ? {
                y: plan.isPopular ? -20 : 0,
                opacity: 1,
                x: index === 2 ? -30 : index === 0 ? 30 : 0,
                scale: index === 0 || index === 2 ? 0.94 : 1.0,
              }
            : { y: 0, opacity: 1, x: 0, scale: 1 };

          return (
          <motion.div
            key={index}
            // EDIT: `initial` pushed every card down 50px and the mobile branch
            // animated to `{}`. An empty target animates nothing, so below 768px
            // the cards stayed stranded at y:50 permanently. An empty target is
            // never safe here, so the resting layout is computed once and both
            // branches animate to it; reduced motion starts there and skips the
            // travel rather than skipping the animation.
            initial={reduceMotion ? restingLayout : { y: 50, opacity: 1 }}
            whileInView={restingLayout}
            // EDIT: default `amount` ("some" — any pixel). A fractional amount
            // can never be met by a card taller than the viewport/amount ratio,
            // which would strand it at its initial offset for good.
            viewport={{ once: true }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 30,
                    delay: 0.4,
                    opacity: { duration: 0.5 },
                  }
            }
            className={cn(
              `price-card rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
              plan.isPopular ? "border-primary border-2" : "border-border",
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                : "z-10",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star aria-hidden="true" className="text-primary-foreground h-4 w-4 fill-current" />
                <span className="text-primary-foreground ml-1 font-sans font-semibold">
                  {/* EDIT: was "Popular". MasjidOne has no customers yet, so a
                      popularity claim would be false. This is our own view. */}
                  Recommended
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className={cn(
                "text-base font-semibold text-muted-foreground",
                // EDIT: the absolute badge collides with a long plan name.
                plan.isPopular && "mt-3"
              )}>
                {plan.name}
              </p>
              {/* EDIT: rendered unconditionally so a card without a status
                  does not pull its price up out of line with the other two. */}
              <p className="mt-2 flex justify-center min-h-[1.75rem]">
                {plan.status && <StatusTag status={plan.status} />}
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      // EDIT: GBP, not USD.
                      style: "currency",
                      currency: "GBP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    // EDIT: `formatter` was removed from @number-flow/react.
                    // `format` with currency GBP and an en-GB locale already
                    // renders £79, so the prop is no longer needed.
                    locales="en-GB"
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                {/* EDIT: was a leftover demo check on "Next 3 months". A
                    one-off fee has no unit — "£499 / once" reads as a rate.
                    The line underneath already says it is charged once. */}
                {plan.period !== "once" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                    {/* EDIT: the unit changes with the toggle — per month
                        when billed monthly, per year when prepaid. */}
                    / {isMonthly ? plan.period : plan.yearlyPeriod ?? plan.period}
                  </span>
                )}
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {/* EDIT: "billed annually" would imply an annual price. It is
                    the same monthly price, paid twelve months up front. And a
                    one-off fee is never "billed monthly". */}
                {plan.period === "once"
                  ? isMonthly
                    ? "charged once, at the start"
                    : "waived"
                  : isMonthly
                    ? "billed monthly"
                    : `£${plan.price} a month, paid twelve months up front`}
              </p>

              <ul className="mt-5 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => {
                  const text =
                    typeof feature === "string" ? feature : feature.text;
                  const status =
                    typeof feature === "string" ? undefined : feature.status;
                  return (
                    <li key={idx} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-left">
                        {text}
                        {status && (
                          <StatusTag status={status} className="ml-2 align-middle" />
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <hr className="w-full my-4" />

              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
                  plan.isPopular
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground"
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}
