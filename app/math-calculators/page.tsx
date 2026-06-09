import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Math Calculators - Percentage, GPA, Grade, Ratio & Average",
  description:
    "Free math calculators for percentages, GPA, grades, ratios, and averages, plus a scientific calculator, each with formulas and step-by-step examples.",
  alternates: { canonical: "/math-calculators" },
};

export default function MathCalculators() {
  const category = categories.find((c) => c.id === "math")!;
  return <CategoryPage category={category} breadcrumbLabel="Math & Percentage" />;
}
