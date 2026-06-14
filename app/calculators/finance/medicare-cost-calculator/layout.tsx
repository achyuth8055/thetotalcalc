import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicare Cost Calculator - Part A, B & D",
  description:
    "Estimate your Medicare premiums for Part A, B, and D, including IRMAA surcharges. Free Medicare cost calculator based on your income.",
  keywords: ["medicare cost calculator","medicare cost calculator online","free medicare cost calculator"],
  alternates: { canonical: "/calculators/finance/medicare-cost-calculator" },
  openGraph: {
    title: "Medicare Cost Calculator - Part A, B & D | OnlineCalc",
    description: "Estimate your Medicare premiums for Part A, B, and D, including IRMAA surcharges. Free Medicare cost calculator based on your income.",
    url: "/calculators/finance/medicare-cost-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicare Cost Calculator - Part A, B & D",
    description: "Estimate your Medicare premiums for Part A, B, and D, including IRMAA surcharges. Free Medicare cost calculator based on your income.",
  },
};

export default function MedicareCostCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
