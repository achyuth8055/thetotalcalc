import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ratio Calculator - Simplify & Solve Ratios",
  description:
    "Simplify ratios, solve proportions, and scale ratios up or down. Free ratio calculator with instant, accurate results.",
  keywords: ["ratio calculator","ratio calculator online","free ratio calculator"],
  alternates: { canonical: "/calculators/math/ratio-calculator" },
  openGraph: {
    title: "Ratio Calculator - Simplify & Solve Ratios | OnlineCalc",
    description: "Simplify ratios, solve proportions, and scale ratios up or down. Free ratio calculator with instant, accurate results.",
    url: "/calculators/math/ratio-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratio Calculator - Simplify & Solve Ratios",
    description: "Simplify ratios, solve proportions, and scale ratios up or down. Free ratio calculator with instant, accurate results.",
  },
};

export default function RatioCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
