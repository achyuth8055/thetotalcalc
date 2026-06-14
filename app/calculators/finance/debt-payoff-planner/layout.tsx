import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debt Payoff Planner - Build Your Payoff Plan",
  description:
    "Build a month-by-month plan to clear multiple debts. Compare snowball vs avalanche, find your debt-free date, and cut total interest paid.",
  keywords: ["debt payoff planner","debt payoff planner online","free debt payoff planner"],
  alternates: { canonical: "/calculators/finance/debt-payoff-planner" },
  openGraph: {
    title: "Debt Payoff Planner - Build Your Payoff Plan | OnlineCalc",
    description: "Build a month-by-month plan to clear multiple debts. Compare snowball vs avalanche, find your debt-free date, and cut total interest paid.",
    url: "/calculators/finance/debt-payoff-planner",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Payoff Planner - Build Your Payoff Plan",
    description: "Build a month-by-month plan to clear multiple debts. Compare snowball vs avalanche, find your debt-free date, and cut total interest paid.",
  },
};

export default function DebtPayoffPlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
