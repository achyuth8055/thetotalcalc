import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export default function MathCalculators() {
  const category = categories.find((c) => c.id === "math")!;
  return <CategoryPage category={category} breadcrumbLabel="Math & Percentage" />;
}
