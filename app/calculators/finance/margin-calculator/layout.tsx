import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Margin Calculator - Trading Margin & Leverage",
  description:
    "Calculate the margin required for your trading positions and the leverage involved. Free margin calculator for stocks, futures, and forex.",
  keywords: ["margin calculator","margin calculator online","free margin calculator"],
  alternates: { canonical: "/calculators/finance/margin-calculator" },
  openGraph: {
    title: "Margin Calculator - Trading Margin & Leverage | OnlineCalc",
    description: "Calculate the margin required for your trading positions and the leverage involved. Free margin calculator for stocks, futures, and forex.",
    url: "/calculators/finance/margin-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Margin Calculator - Trading Margin & Leverage",
    description: "Calculate the margin required for your trading positions and the leverage involved. Free margin calculator for stocks, futures, and forex.",
  },
};

export default function MarginCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
