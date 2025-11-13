import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export default function EverydayCalculators() {
  const category = categories.find((c) => c.id === "everyday")!;
  return <CategoryPage category={category} breadcrumbLabel="Everyday Tools" />;
}
