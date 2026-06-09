import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Date & Time Calculators - Age, Date Difference & Countdown",
  description:
    "Free date and time calculators: age, difference between dates, add or subtract days, and countdowns, with clear, accurate results.",
  alternates: { canonical: "/date-calculators" },
};

export default function DateCalculators() {
  const category = categories.find((c) => c.id === "date")!;
  return <CategoryPage category={category} breadcrumbLabel="Date & Time" />;
}
