import {
  SiteHeader,
  Join,
  Stack,
  Modules,
  Setup,
  Previews,
  Trust,
  SiteFooter,
} from "@/components/site-sections";
import { SiteBehaviour } from "@/components/site-behaviour";
import { MasjidOnePricing } from "@/components/masjidone-pricing";
import { MasjidOneHero } from "@/components/masjidone-hero";

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
        <Join />
        <Stack />
        <Modules />
        <Previews />
        <section className="sect wrap" id="pricing">
          <MasjidOnePricing />
        </section>
        <Setup />
        <Trust />
      </main>
      <SiteFooter />
      <SiteBehaviour />
    </>
  );
}
