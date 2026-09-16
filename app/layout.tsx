import type { Metadata } from "next";
import "./globals.css";

import { BASE_PATH, SITE_ORIGIN } from "@/lib/site";

/**
 * The favicon is an SVG data URI: three brass rules on the bottle green of a
 * prayer-time board. The house rule forbids hex outside globals.css, and names
 * this and <meta name="theme-color"> as the two unavoidable exceptions, since
 * neither can read a CSS custom property.
 */
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230C2A21'/%3E%3Crect x='7' y='9' width='18' height='2' fill='%239A7638'/%3E%3Crect x='7' y='15' width='18' height='2' fill='%239A7638'/%3E%3Crect x='7' y='21' width='18' height='2' fill='%239A7638'/%3E%3C/svg%3E";

const TITLE = "MasjidOne — the madrasah and the congregation on one system";
const DESCRIPTION =
  "MasjidOne runs a UK mosque's madrasah and its congregation on one system. Prayer times, a congregation app, your website, the hall screens and donations at 0% commission — with registers, fees and parent access joining the same record of the same family.";

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
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: FAVICON, type: "image/svg+xml" }],
    shortcut: [{ url: FAVICON, type: "image/svg+xml" }],
    // Icons are emitted verbatim rather than resolved against metadataBase,
    // so this one carries the base path itself. 180x180, as iOS expects.
    apple: [{ url: `${BASE_PATH}/apple-touch-icon.png`, sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "MasjidOne",
    locale: "en_GB",
    url: SITE_ORIGIN,
    title: "The madrasah and the congregation, on one system",
    description: DESCRIPTION,
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "MasjidOne — the madrasah and the congregation, on one system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The madrasah and the congregation, on one system",
    description: DESCRIPTION,
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
      <body>{children}</body>
    </html>
  );
}
