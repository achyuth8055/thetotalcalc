import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export default function ConvertersPage() {
  const category = categories.find((c) => c.id === "converters")!;
  return <CategoryPage category={category} breadcrumbLabel="Unit Converters" />;
}
