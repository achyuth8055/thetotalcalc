import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import { categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Developer Tools - Binary, Hex, ASCII, Base64 & Color",
  description:
    "Free developer converters: binary, hexadecimal, ASCII, Base64 encode and decode, and color formats, with quick-reference explanations.",
  alternates: { canonical: "/developer-calculators" },
};

export default function DeveloperCalculators() {
  const category = categories.find((c) => c.id === "developer")!;
  return <CategoryPage category={category} breadcrumbLabel="Developer Tools" />;
}
