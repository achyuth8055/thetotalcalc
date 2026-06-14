import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brokerage Calculator - Trading Charges & Fees",
  description:
    "Calculate brokerage, taxes, and total trading charges on your buy and sell orders. Know your real cost and break-even price, for free.",
  keywords: ["brokerage calculator","brokerage calculator online","free brokerage calculator"],
  alternates: { canonical: "/calculators/finance/brokerage-calculator" },
  openGraph: {
    title: "Brokerage Calculator - Trading Charges & Fees | OnlineCalc",
    description: "Calculate brokerage, taxes, and total trading charges on your buy and sell orders. Know your real cost and break-even price, for free.",
    url: "/calculators/finance/brokerage-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brokerage Calculator - Trading Charges & Fees",
    description: "Calculate brokerage, taxes, and total trading charges on your buy and sell orders. Know your real cost and break-even price, for free.",
  },
};

export default function BrokerageCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
