import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export default function DateCalculators() {
  const category = categories.find((c) => c.id === "date")!;
  return <CategoryPage category={category} breadcrumbLabel="Date & Time" />;
}
