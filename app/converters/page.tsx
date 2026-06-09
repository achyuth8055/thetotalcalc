import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Unit Converters - Length, Weight, Temperature & Currency",
  description:
    "Free unit converters for length, weight, temperature, and currency, with conversion formulas and quick-reference tables.",
  alternates: { canonical: "/converters" },
};

export default function ConvertersPage() {
  const category = categories.find((c) => c.id === "converters")!;
  return <CategoryPage category={category} breadcrumbLabel="Unit Converters" />;
}
