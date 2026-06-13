import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Price Calculator - Compare Cost Per Unit",
  description:
    "Free unit price calculator. Compare two products by their price per unit to see which is the better deal, and exactly how much you save. Perfect for grocery shopping and bulk buying.",
  keywords: [
    "unit price calculator",
    "cost per unit calculator",
    "price comparison calculator",
    "which is cheaper calculator",
    "price per ounce calculator",
    "cost per item calculator",
    "bulk buy comparison",
    "grocery price comparison",
  ],
  alternates: { canonical: "/calculators/everyday/unit-price-calculator" },
  openGraph: {
    title: "Unit Price Calculator - Compare Cost Per Unit",
    description:
      "Compare two products by their price per unit to see which is the better deal and exactly how much you save.",
    url: "/calculators/everyday/unit-price-calculator",
    type: "website",
  },
};

export default function UnitPriceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
