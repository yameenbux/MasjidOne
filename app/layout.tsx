import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MasjidOne — the madrasah and the congregation on one system",
  description:
    "MasjidOne runs a UK mosque's madrasah and its congregation on one system. Prayer times, congregation app, website, hall screens and donations at 0% commission. A product of YSB Ventures Ltd, Bolton.",
  openGraph: {
    title: "MasjidOne",
    description: "The madrasah and the congregation, on one system.",
    type: "website",
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
