import type { Metadata } from "next";
import "./globals.css";

import { BASE_PATH, SITE_ORIGIN, openGraphFor } from "@/lib/site";
import { StructuredData } from "@/components/structured-data";

/**
 * TITLE AND DESCRIPTION ARE WRITTEN FOR A SEARCH RESULT, not for the page.
 *
 * The page's own headline stays "The madrasah and the congregation, on one
 * system" — that is the line that does the work once somebody is reading. But
 * nobody searches for it, and nobody searches for "MasjidOne" either, because
 * there is no brand awareness to search with yet. A title has to carry the
 * words a committee actually types, and the two head terms are "mosque
 * management software" and "madrasah management software". This title holds
 * both without reading like a keyword list, and keeps the brand on the end.
 *
 * The description is kept under about 155 characters because Google truncates
 * roughly there; the old one ran to 251 and lost its point mid-sentence. It
 * also listed "parent access" among the things the product does, which breaks
 * the house rule — parent access is in development, and a search result is a
 * commercial claim like any other.
 */
const TITLE = "Mosque and madrasah management software, UK — MasjidOne";
const DESCRIPTION =
  "Mosque and madrasah management software for UK masajid. Registers and fees joined to prayer times, the app, your website and donations at 0% commission.";

/**
 * Open Graph gets its own words. A search result is read by somebody hunting;
 * a shared link is read by a committee member being sent it by a friend, and
 * the keyword-led line is the wrong register for that. Neither claims parent
 * access.
 */
const SOCIAL_DESCRIPTION =
  "A UK mosque's madrasah and its congregation on one system — one record of the same family, reachable from both sides. Published prices, and 0% commission on donations.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: TITLE,
    template: "%s — MasjidOne",
  },
  description: DESCRIPTION,
  applicationName: "MasjidOne",
  authors: [{ name: "YSB Ventures Ltd" }],
  creator: "YSB Ventures Ltd",
  publisher: "YSB Ventures Ltd",
  // NO DEFAULT CANONICAL HERE, deliberately. A canonical in the root layout is
  // inherited by every page that does not override it, so /privacy/ was telling
  // Google it was a duplicate of the home page and should not be indexed on its
  // own. Each page declares its own; the home page's lives in app/page.tsx.
  // Search Console. A Domain property verified by DNS TXT at the registrar is
  // the better route — it covers http, https, www and every subdomain at once,
  // and survives a host move. This meta tag is here for the URL-prefix
  // property, which is verified per-origin: set GOOGLE_SITE_VERIFICATION as a
  // repository variable and the tag appears; leave it unset and it does not.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Icons are emitted verbatim rather than resolved against metadataBase, so
  // each of these carries the base path itself. Two SVG favicons, picked by
  // prefers-color-scheme: the brass mark on the board for dark, the same mark
  // on paper for light. apple-touch-icon stays a PNG because iOS does not take
  // an SVG there.
  icons: {
    icon: [
      {
        url: `${BASE_PATH}/favicon-light-32.svg`,
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: `${BASE_PATH}/favicon-32.svg`,
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: [{ url: `${BASE_PATH}/favicon-32.svg`, type: "image/svg+xml" }],
    apple: [{ url: `${BASE_PATH}/apple-touch-icon.png`, sizes: "180x180" }],
  },
  // Next replaces openGraph wholesale rather than merging it, so every page
  // builds its own block from one helper — see lib/site.ts. A fixed url here
  // used to make every shared sub-page link resolve to the home page.
  openGraph: openGraphFor("/", {
    title: "The madrasah and the congregation, on one system",
    description: SOCIAL_DESCRIPTION,
  }),
  twitter: {
    card: "summary_large_image",
    title: "The madrasah and the congregation, on one system",
    description: SOCIAL_DESCRIPTION,
    images: ["/social-card.png"],
  },
  other: {
    // Matches --board. A meta tag cannot read a custom property, which is why
    // the design rules name this as one of the two hex exceptions.
    "theme-color": "#0C2A21",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..110,400..700&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&display=swap"
        />
      </head>
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
