import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graphing Calculator - Plot Functions Online",
  description:
    "Plot and explore mathematical functions interactively. Free online graphing calculator for equations, curves, and data.",
  keywords: ["graphing calculator","graphing calculator online","free graphing calculator"],
  alternates: { canonical: "/calculators/math/graphing-calculator" },
  openGraph: {
    title: "Graphing Calculator - Plot Functions Online | OnlineCalc",
    description: "Plot and explore mathematical functions interactively. Free online graphing calculator for equations, curves, and data.",
    url: "/calculators/math/graphing-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graphing Calculator - Plot Functions Online",
    description: "Plot and explore mathematical functions interactively. Free online graphing calculator for equations, curves, and data.",
  },
};

export default function GraphingCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
