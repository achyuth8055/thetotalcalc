import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fraction Calculator - Add, Subtract, Multiply",
  description:
    "Add, subtract, multiply, and divide fractions with automatic simplification. Free fraction calculator that supports mixed numbers.",
  keywords: ["fraction calculator","fraction calculator online","free fraction calculator"],
  alternates: { canonical: "/calculators/math/fraction-calculator" },
  openGraph: {
    title: "Fraction Calculator - Add, Subtract, Multiply | OnlineCalc",
    description: "Add, subtract, multiply, and divide fractions with automatic simplification. Free fraction calculator that supports mixed numbers.",
    url: "/calculators/math/fraction-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fraction Calculator - Add, Subtract, Multiply",
    description: "Add, subtract, multiply, and divide fractions with automatic simplification. Free fraction calculator that supports mixed numbers.",
  },
};

export default function FractionCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
