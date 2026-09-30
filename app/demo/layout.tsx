import type { Metadata } from "next";

/**
 * The demonstration tenant is for showing a committee on a call, not for
 * ranking in search. An indexed sign-in page that is not a real sign-in page is
 * worse than useless: it competes with the marketing site for the brand name
 * and invites people to type credentials into something that guards nothing.
 *
 * Belt and braces — noindex here, and Disallow in app/robots.ts. app/sitemap.ts
 * lists its routes by hand, so /demo/ was never going to appear there.
 */
export const metadata: Metadata = {
  title: "MasjidOne — demonstration portal",
  description:
    "A demonstration of the MasjidOne madrasah portal, using sample data. Not a live masjid.",
  robots: { index: false, follow: false, nocache: true },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
