import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator - Percent, Increase, Decrease",
  description:
    "Calculate percentages, percentage increase and decrease, and what percent one number is of another. Free, easy percentage calculator.",
  keywords: ["percentage calculator","percentage calculator online","free percentage calculator"],
  alternates: { canonical: "/calculators/math/percentage-calculator" },
  openGraph: {
    title: "Percentage Calculator - Percent, Increase, Decrease | OnlineCalc",
    description: "Calculate percentages, percentage increase and decrease, and what percent one number is of another. Free, easy percentage calculator.",
    url: "/calculators/math/percentage-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Calculator - Percent, Increase, Decrease",
    description: "Calculate percentages, percentage increase and decrease, and what percent one number is of another. Free, easy percentage calculator.",
  },
};

export default function PercentageCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
