import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator",
  description:
    "Find out how much house you can afford from your income, debts, and down payment. Free affordability calculator with DTI-based estimates.",
  keywords: ["mortgage affordability calculator","mortgage affordability calculator online","free mortgage affordability calculator"],
  alternates: { canonical: "/calculators/finance/mortgage-affordability-calculator" },
  openGraph: {
    title: "Mortgage Affordability Calculator | OnlineCalc",
    description: "Find out how much house you can afford from your income, debts, and down payment. Free affordability calculator with DTI-based estimates.",
    url: "/calculators/finance/mortgage-affordability-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Affordability Calculator",
    description: "Find out how much house you can afford from your income, debts, and down payment. Free affordability calculator with DTI-based estimates.",
  },
};

export default function MortgageAffordabilityCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
