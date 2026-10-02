import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MasjidOne support — demonstration",
  robots: { index: false, follow: false, nocache: true },
};

export default function SupportDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
