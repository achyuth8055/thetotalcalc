import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Calculator - Project Portfolio Growth",
  description:
    "Project your investment growth from a starting amount, regular contributions, and expected return. Free calculator with compounding charts.",
  keywords: ["investment calculator","investment calculator online","free investment calculator"],
  alternates: { canonical: "/calculators/finance/investment-calculator" },
  openGraph: {
    title: "Investment Calculator - Project Portfolio Growth | OnlineCalc",
    description: "Project your investment growth from a starting amount, regular contributions, and expected return. Free calculator with compounding charts.",
    url: "/calculators/finance/investment-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Calculator - Project Portfolio Growth",
    description: "Project your investment growth from a starting amount, regular contributions, and expected return. Free calculator with compounding charts.",
  },
};

export default function InvestmentCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
