import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Net Worth Calculator - Assets & Liabilities",
  description:
    "Calculate your net worth by adding up assets and subtracting liabilities. Free net worth calculator to track your financial progress.",
  keywords: ["net worth calculator","net worth calculator online","free net worth calculator"],
  alternates: { canonical: "/calculators/finance/net-worth-calculator" },
  openGraph: {
    title: "Net Worth Calculator - Assets & Liabilities | OnlineCalc",
    description: "Calculate your net worth by adding up assets and subtracting liabilities. Free net worth calculator to track your financial progress.",
    url: "/calculators/finance/net-worth-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Net Worth Calculator - Assets & Liabilities",
    description: "Calculate your net worth by adding up assets and subtracting liabilities. Free net worth calculator to track your financial progress.",
  },
};

export default function NetWorthCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
