import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Health Calculators - BMI, BMR, Calorie & Ideal Weight",
  description:
    "Free health calculators: BMI, BMR, daily calories (TDEE), and ideal weight, with the formula behind each result and how to interpret it.",
  alternates: { canonical: "/health-calculators" },
};

export default function HealthCalculators() {
  const category = categories.find((c) => c.id === "health")!;
  return <CategoryPage category={category} breadcrumbLabel="Health & Fitness" />;
}
