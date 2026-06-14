import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compound Interest Calculator - Savings Growth",
  description:
    "See how your savings grow with compound interest. Free calculator with monthly contributions, custom rates, and year-by-year growth charts.",
  keywords: ["compound interest calculator","compound interest calculator online","free compound interest calculator"],
  alternates: { canonical: "/calculators/finance/compound-interest-calculator" },
  openGraph: {
    title: "Compound Interest Calculator - Savings Growth | OnlineCalc",
    description: "See how your savings grow with compound interest. Free calculator with monthly contributions, custom rates, and year-by-year growth charts.",
    url: "/calculators/finance/compound-interest-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compound Interest Calculator - Savings Growth",
    description: "See how your savings grow with compound interest. Free calculator with monthly contributions, custom rates, and year-by-year growth charts.",
  },
};

export default function CompoundInterestCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
