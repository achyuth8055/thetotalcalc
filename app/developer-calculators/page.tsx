import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export default function DeveloperCalculators() {
  const category = categories.find((c) => c.id === "developer")!;
  return <CategoryPage category={category} breadcrumbLabel="Developer Tools" />;
}
