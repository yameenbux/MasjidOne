import type { Metadata } from "next";

/**
 * The live console is ours, not a page for anybody else. Noindex it the way
 * /demo/ is, and for a stronger reason: /demo/ is merely not useful to a
 * search engine, whereas this one is the door our own people sign in through.
 */
export const metadata: Metadata = {
  title: "Support console",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
