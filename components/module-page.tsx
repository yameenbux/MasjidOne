import * as React from "react";
import { SiteHeader, SiteFooter } from "@/components/site-sections";
import { SiteBehaviour } from "@/components/site-behaviour";
import { BASE_PATH, SITE_ORIGIN, DEMO_MAILTO, PRICING } from "@/lib/site";

/**
 * Shared shell for the module pages — one page per thing a committee actually
 * searches for, rather than one page carrying every intent at once.
 *
 * WHY THESE PAGES EXIST. The site was a single URL. A single URL competes with
 * itself: a committee searching "madrasah registers software" and one searching
 * "mosque donations gift aid" want different pages, and Google will only rank
 * one page for one intent. Each page here has its own title, its own heading
 * and its own body, and links to the others so none of them is an orphan.
 *
 * WHAT THEY MAY NOT DO. They are commercial claims, so the house rules in
 * CLAUDE.md apply in full and are tighter than the SEO temptation:
 *
 *   - Nothing claims a feature that is not built. Anything in development
 *     carries the same tag it carries on the home page, on the same page as
 *     the sell, not in a footnote underneath it.
 *   - No competitor is named. The comparison happens in the room.
 *   - No social proof: no counts, no logos, no testimonials. There are no
 *     customers yet, and a page that implies otherwise is the one thing a
 *     committee will check.
 *   - Prices come from lib/site.ts, so a page cannot quote a figure the
 *     pricing cards do not.
 *   - Compliance stays in the future tense. ICO registration and the DPA are
 *     promised before a masjid is invoiced; neither is done.
 *
 * Thin pages built to catch a search term are worth less than nothing — Google
 * discounts them and a committee reading one loses confidence. Each page is
 * written to be worth reading on its own.
 */

export type ModulePoint = { h: string; p: React.ReactNode };

export function ModulePage({
  slug,
  eyebrow,
  title,
  status,
  lede,
  points,
  pending,
  plan,
  children,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  /** Matches the tag the same module carries on the home page. */
  status: "live" | "dev";
  lede: React.ReactNode;
  points: ModulePoint[];
  /** What is honestly not built yet on this page's subject. Omit if nothing. */
  pending?: React.ReactNode;
  plan: { name: string; pounds: number; note: React.ReactNode };
  children?: React.ReactNode;
}) {
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "MasjidOne", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: title, item: `${SITE_ORIGIN}/${slug}/` },
    ],
  };

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="sect wrap">
          <nav className="modp__crumb" aria-label="Breadcrumb">
            <a href={`${BASE_PATH}/`}>MasjidOne</a>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{title}</span>
          </nav>

          <p className="eyebrow eyebrow--brass">{eyebrow}</p>
          <h1 className="measure" style={{ marginTop: "1rem" }}>
            {title}
          </h1>
          {/* .tag is built for an inline span — on a block element its border
              stretches the full column. */}
          <p className="modp__tag">
            <span className={`tag tag--${status === "live" ? "live" : "dev"}`}>
              {status === "live" ? "Live" : "In development"}
            </span>
          </p>
          <p className="modp__lede measure">{lede}</p>

          <div className="btn-row">
            <a className="btn" href={DEMO_MAILTO}>
              <span className="btn__t">
                Request a demo <span className="arw" aria-hidden="true">→</span>
              </span>
            </a>
            <a className="btn btn--ghost" href={`${BASE_PATH}/#pricing`}>
              <span className="btn__t">See the pricing</span>
            </a>
          </div>
        </section>

        <section className="sect wrap">
          <h2 className="measure">What it does</h2>
          <div className="modp__points">
            {points.map((pt) => (
              <div className="modp__point" key={pt.h}>
                <h3>{pt.h}</h3>
                <p>{pt.p}</p>
              </div>
            ))}
          </div>

          {pending ? (
            <div className="modp__pending">
              <p className="modp__tag" style={{ marginTop: 0 }}>
                <span className="tag tag--dev">In development</span>
              </p>
              <p>{pending}</p>
            </div>
          ) : null}

          {children}
        </section>

        <section className="sect wrap">
          <h2 className="measure">What it costs</h2>
          <p className="modp__lede measure">
            Part of <strong>{plan.name}</strong> at{" "}
            <strong>£{plan.pounds} a month</strong>, with setup and migration
            charged once at £{PRICING.setup} — waived outright on twelve months
            prepaid. Unlimited pupils, teachers and screens; no per-pupil
            pricing and no paid add-ons. {plan.note}
          </p>
          <div className="btn-row">
            <a className="btn" href={DEMO_MAILTO}>
              <span className="btn__t">
                Request a demo <span className="arw" aria-hidden="true">→</span>
              </span>
            </a>
          </div>
        </section>

        <RelatedModules current={slug} />
      </main>
      <SiteFooter />
      <SiteBehaviour />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
    </>
  );
}

/** Every module page, in one list, so the set stays navigable from any of them. */
export const MODULES: { slug: string; label: string; blurb: string }[] = [
  {
    slug: "madrasah-software",
    label: "Madrasah software",
    blurb: "Registers, fees, classes and families.",
  },
  {
    slug: "mosque-prayer-times-screens",
    label: "Prayer times and hall screens",
    blurb: "Your own jamāʿah times, on every screen in the building.",
  },
  {
    slug: "mosque-app",
    label: "Congregation app",
    blurb: "Times, reminders, notices and giving, in one app.",
  },
  {
    slug: "mosque-website",
    label: "Managed mosque website",
    blurb: "A site that is current because nobody has to update it.",
  },
  {
    slug: "mosque-donations",
    label: "Donations and Gift Aid",
    blurb: "0% commission, permanently.",
  },
];

function RelatedModules({ current }: { current: string }) {
  const rest = MODULES.filter((m) => m.slug !== current);
  return (
    <section className="sect wrap">
      <h2 className="measure">The rest of the system</h2>
      <p className="modp__lede measure">
        Every part below runs from the same record of the same family. That join
        is the product — the modules on their own are not the argument.
      </p>
      <ul className="modp__rel">
        {rest.map((m) => (
          <li key={m.slug}>
            <a href={`${BASE_PATH}/${m.slug}/`}>
              <strong>{m.label}</strong>
              <span>{m.blurb}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
