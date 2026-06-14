import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inflation Calculator - Purchasing Power Over Time",
  description:
    "Calculate how inflation changes the value of money over time. Free inflation calculator using CPI to compare past and future purchasing power.",
  keywords: ["inflation calculator","inflation calculator online","free inflation calculator"],
  alternates: { canonical: "/calculators/finance/inflation-calculator" },
  openGraph: {
    title: "Inflation Calculator - Purchasing Power Over Time | OnlineCalc",
    description: "Calculate how inflation changes the value of money over time. Free inflation calculator using CPI to compare past and future purchasing power.",
    url: "/calculators/finance/inflation-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inflation Calculator - Purchasing Power Over Time",
    description: "Calculate how inflation changes the value of money over time. Free inflation calculator using CPI to compare past and future purchasing power.",
  },
};

export default function InflationCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
