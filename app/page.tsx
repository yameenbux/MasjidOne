import {
  SiteHeader,
  Hero,
  Join,
  Modules,
  Previews,
  Trust,
  Contact,
  SiteFooter,
} from "@/components/site-sections";
import { SiteBehaviour } from "@/components/site-behaviour";
import { MasjidOnePricing } from "@/components/masjidone-pricing";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <span id="top" />
        <Hero />
        <Join />
        <Modules />
        <Previews />
        <section className="sect wrap" id="pricing">
          <MasjidOnePricing />
        </section>
        <Trust />
        <Contact />
      </main>
      <SiteFooter />
      <SiteBehaviour />
    </>
  );
}
