import type { Metadata } from "next";

/** Same exclusion as the rest of /demo/: never indexed, and robots.txt
 *  disallows the whole /demo/ tree. */
export const metadata: Metadata = {
  title: "The congregation app — demonstration",
  robots: { index: false, follow: false, nocache: true },
};

export default function AppDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
