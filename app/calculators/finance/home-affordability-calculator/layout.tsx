import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Affordability Calculator - How Much House",
  description:
    "Find out how much house you can afford based on income, debts, and down payment. Free home affordability calculator with a monthly budget.",
  keywords: ["home affordability calculator","home affordability calculator online","free home affordability calculator"],
  alternates: { canonical: "/calculators/finance/home-affordability-calculator" },
  openGraph: {
    title: "Home Affordability Calculator - How Much House | OnlineCalc",
    description: "Find out how much house you can afford based on income, debts, and down payment. Free home affordability calculator with a monthly budget.",
    url: "/calculators/finance/home-affordability-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Affordability Calculator - How Much House",
    description: "Find out how much house you can afford based on income, debts, and down payment. Free home affordability calculator with a monthly budget.",
  },
};

export default function HomeAffordabilityCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
