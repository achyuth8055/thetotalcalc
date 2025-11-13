import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export default function FinanceCalculators() {
  const category = categories.find((c) => c.id === "finance")!;
  return <CategoryPage category={category} breadcrumbLabel="Finance Calculators" />;
}
