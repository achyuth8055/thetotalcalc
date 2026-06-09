import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Finance Calculators - Loans, EMI, Mortgage, Investment & Tax",
  description:
    "Free finance calculators: mortgage, EMI, SIP, FD, compound interest, retirement savings, and debt payoff, with clear breakdowns and worked examples.",
  alternates: { canonical: "/finance-calculators" },
};

export default function FinanceCalculators() {
  const category = categories.find((c) => c.id === "finance")!;
  return <CategoryPage category={category} breadcrumbLabel="Finance Calculators" />;
}
