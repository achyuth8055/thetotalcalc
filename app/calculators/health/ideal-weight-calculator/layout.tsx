import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideal Weight Calculator - Healthy Weight Range",
  description:
    "Find your ideal weight range based on height, age, and gender. Free ideal weight calculator using proven medical formulas.",
  keywords: ["ideal weight calculator","ideal weight calculator online","free ideal weight calculator"],
  alternates: { canonical: "/calculators/health/ideal-weight-calculator" },
  openGraph: {
    title: "Ideal Weight Calculator - Healthy Weight Range | OnlineCalc",
    description: "Find your ideal weight range based on height, age, and gender. Free ideal weight calculator using proven medical formulas.",
    url: "/calculators/health/ideal-weight-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Weight Calculator - Healthy Weight Range",
    description: "Find your ideal weight range based on height, age, and gender. Free ideal weight calculator using proven medical formulas.",
  },
};

export default function IdealWeightCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
