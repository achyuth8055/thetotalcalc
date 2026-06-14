import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retirement Calculator - Savings Projection",
  description:
    "See how much you will have at retirement and how long it will last. Free retirement calculator with contributions, returns, and withdrawals.",
  keywords: ["retirement calculator","retirement calculator online","free retirement calculator"],
  alternates: { canonical: "/calculators/finance/retirement-calculator" },
  openGraph: {
    title: "Retirement Calculator - Savings Projection | OnlineCalc",
    description: "See how much you will have at retirement and how long it will last. Free retirement calculator with contributions, returns, and withdrawals.",
    url: "/calculators/finance/retirement-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Calculator - Savings Projection",
    description: "See how much you will have at retirement and how long it will last. Free retirement calculator with contributions, returns, and withdrawals.",
  },
};

export default function RetirementCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
