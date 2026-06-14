import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tip Calculator - Gratuity & Bill Split",
  description:
    "Calculate the tip and total bill, and split it between any number of people. Free tip calculator for restaurants, bars, and delivery.",
  keywords: ["tip calculator","tip calculator online","free tip calculator"],
  alternates: { canonical: "/calculators/everyday/tip-calculator" },
  openGraph: {
    title: "Tip Calculator - Gratuity & Bill Split | OnlineCalc",
    description: "Calculate the tip and total bill, and split it between any number of people. Free tip calculator for restaurants, bars, and delivery.",
    url: "/calculators/everyday/tip-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tip Calculator - Gratuity & Bill Split",
    description: "Calculate the tip and total bill, and split it between any number of people. Free tip calculator for restaurants, bars, and delivery.",
  },
};

export default function TipCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
