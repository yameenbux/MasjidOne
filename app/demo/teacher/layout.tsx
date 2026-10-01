import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Portal — demonstration",
  robots: { index: false, follow: false, nocache: true },
};

export default function TeacherDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
