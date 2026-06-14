import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade Calculator - Profit, Loss & ROI",
  description:
    "Calculate profit, loss, ROI, and break-even price for any trade. Free trade calculator for stocks, crypto, and forex positions.",
  keywords: ["trade calculator","trade calculator online","free trade calculator"],
  alternates: { canonical: "/calculators/finance/trade-calculator" },
  openGraph: {
    title: "Trade Calculator - Profit, Loss & ROI | OnlineCalc",
    description: "Calculate profit, loss, ROI, and break-even price for any trade. Free trade calculator for stocks, crypto, and forex positions.",
    url: "/calculators/finance/trade-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade Calculator - Profit, Loss & ROI",
    description: "Calculate profit, loss, ROI, and break-even price for any trade. Free trade calculator for stocks, crypto, and forex positions.",
  },
};

export default function TradeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
