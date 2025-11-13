import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export default function HealthCalculators() {
  const category = categories.find((c) => c.id === "health")!;
  return <CategoryPage category={category} breadcrumbLabel="Health & Fitness" />;
}
