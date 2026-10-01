import {
  SiteHeader,
  Walkthrough,
  Join,
  Stack,
  Modules,
  Setup,
  Previews,
  Trust,
  Contact,
  SiteFooter,
} from "@/components/site-sections";
import { SiteBehaviour } from "@/components/site-behaviour";
import { MasjidOnePricing } from "@/components/masjidone-pricing";
import { MasjidOneHero } from "@/components/masjidone-hero";

import type { Metadata } from "next";
import { openGraphFor } from "@/lib/site";

/** The canonical used to come from the root layout, where every other page
 *  inherited it by mistake. It belongs to this page. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: openGraphFor("/"),
};


export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <span id="top" />
        <MasjidOneHero />
        <Walkthrough />
        <Join />
        <Stack />
        <Modules />
        <Previews />
        <section className="sect wrap" id="pricing">
          <MasjidOnePricing />
        </section>
        <Setup />
        <Trust />
        <Contact />
      </main>
      <SiteFooter />
      <SiteBehaviour />
    </>
  );
}
