import type { Metadata } from "next";

/** Same exclusion as the rest of /demo/: never indexed, and robots.txt
 *  disallows the whole /demo/ tree. */
export const metadata: Metadata = {
  title: "Parents Portal — demonstration",
  robots: { index: false, follow: false, nocache: true },
};

export default function ParentDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
