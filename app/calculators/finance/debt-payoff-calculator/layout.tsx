import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator - Snowball & Avalanche",
  description:
    "Plan your debt payoff with the snowball or avalanche method. See your debt-free date, total interest, and monthly plan, for free.",
  keywords: ["debt payoff calculator","debt payoff calculator online","free debt payoff calculator"],
  alternates: { canonical: "/calculators/finance/debt-payoff-calculator" },
  openGraph: {
    title: "Debt Payoff Calculator - Snowball & Avalanche | OnlineCalc",
    description: "Plan your debt payoff with the snowball or avalanche method. See your debt-free date, total interest, and monthly plan, for free.",
    url: "/calculators/finance/debt-payoff-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Payoff Calculator - Snowball & Avalanche",
    description: "Plan your debt payoff with the snowball or avalanche method. See your debt-free date, total interest, and monthly plan, for free.",
  },
};

export default function DebtPayoffCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
