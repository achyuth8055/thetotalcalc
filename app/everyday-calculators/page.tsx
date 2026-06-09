import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Everyday Calculators - Tip, Discount, Split Bill & Units",
  description:
    "Free everyday calculators for tips, discounts, splitting a bill, and unit conversions, with simple inputs and instant results.",
  alternates: { canonical: "/everyday-calculators" },
};

export default function EverydayCalculators() {
  const category = categories.find((c) => c.id === "everyday")!;
  return <CategoryPage category={category} breadcrumbLabel="Everyday Tools" />;
}
