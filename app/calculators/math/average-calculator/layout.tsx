import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Average Calculator - Mean, Median & Mode",
  description:
    "Calculate the mean, median, mode, and range of any set of numbers. Free average calculator with clear, step-by-step results.",
  keywords: ["average calculator","average calculator online","free average calculator"],
  alternates: { canonical: "/calculators/math/average-calculator" },
  openGraph: {
    title: "Average Calculator - Mean, Median & Mode | OnlineCalc",
    description: "Calculate the mean, median, mode, and range of any set of numbers. Free average calculator with clear, step-by-step results.",
    url: "/calculators/math/average-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Average Calculator - Mean, Median & Mode",
    description: "Calculate the mean, median, mode, and range of any set of numbers. Free average calculator with clear, step-by-step results.",
  },
};

export default function AverageCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
