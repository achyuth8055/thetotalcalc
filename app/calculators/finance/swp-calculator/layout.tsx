import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWP Calculator - Systematic Withdrawal Plan",
  description:
    "Plan systematic withdrawals from your investments. Calculate how long your corpus lasts and the monthly income it can generate, for free.",
  keywords: ["swp calculator","swp calculator online","free swp calculator"],
  alternates: { canonical: "/calculators/finance/swp-calculator" },
  openGraph: {
    title: "SWP Calculator - Systematic Withdrawal Plan | OnlineCalc",
    description: "Plan systematic withdrawals from your investments. Calculate how long your corpus lasts and the monthly income it can generate, for free.",
    url: "/calculators/finance/swp-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SWP Calculator - Systematic Withdrawal Plan",
    description: "Plan systematic withdrawals from your investments. Calculate how long your corpus lasts and the monthly income it can generate, for free.",
  },
};

export default function SwpCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
