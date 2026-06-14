import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split Bill Calculator - Divide a Bill Evenly",
  description:
    "Split a bill evenly or by custom shares, with an optional tip. Free split bill calculator for groups, roommates, and dining out.",
  keywords: ["split bill calculator","split bill calculator online","free split bill calculator"],
  alternates: { canonical: "/calculators/everyday/split-bill-calculator" },
  openGraph: {
    title: "Split Bill Calculator - Divide a Bill Evenly | OnlineCalc",
    description: "Split a bill evenly or by custom shares, with an optional tip. Free split bill calculator for groups, roommates, and dining out.",
    url: "/calculators/everyday/split-bill-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split Bill Calculator - Divide a Bill Evenly",
    description: "Split a bill evenly or by custom shares, with an optional tip. Free split bill calculator for groups, roommates, and dining out.",
  },
};

export default function SplitBillCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
