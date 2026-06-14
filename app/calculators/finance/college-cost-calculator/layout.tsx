import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College Cost Calculator - Tuition & Savings",
  description:
    "Project the total future cost of college with inflation and the monthly savings you need. Free 529 college cost and savings calculator.",
  keywords: ["college cost calculator","college cost calculator online","free college cost calculator"],
  alternates: { canonical: "/calculators/finance/college-cost-calculator" },
  openGraph: {
    title: "College Cost Calculator - Tuition & Savings | OnlineCalc",
    description: "Project the total future cost of college with inflation and the monthly savings you need. Free 529 college cost and savings calculator.",
    url: "/calculators/finance/college-cost-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Cost Calculator - Tuition & Savings",
    description: "Project the total future cost of college with inflation and the monthly savings you need. Free 529 college cost and savings calculator.",
  },
};

export default function CollegeCostCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
