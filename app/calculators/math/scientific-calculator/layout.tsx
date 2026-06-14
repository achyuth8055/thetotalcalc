import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scientific Calculator - Free & Online",
  description:
    "Free online scientific calculator with trigonometric, logarithmic, exponential, and power functions. Works on desktop and mobile.",
  keywords: ["scientific calculator","scientific calculator online","free scientific calculator"],
  alternates: { canonical: "/calculators/math/scientific-calculator" },
  openGraph: {
    title: "Scientific Calculator - Free & Online | OnlineCalc",
    description: "Free online scientific calculator with trigonometric, logarithmic, exponential, and power functions. Works on desktop and mobile.",
    url: "/calculators/math/scientific-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scientific Calculator - Free & Online",
    description: "Free online scientific calculator with trigonometric, logarithmic, exponential, and power functions. Works on desktop and mobile.",
  },
};

export default function ScientificCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
