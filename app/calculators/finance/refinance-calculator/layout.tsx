import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refinance Calculator - Break-Even & Savings",
  description:
    "See if refinancing your mortgage pays off. Calculate your break-even month and total interest saved with this free refinance calculator.",
  keywords: ["refinance calculator","refinance calculator online","free refinance calculator"],
  alternates: { canonical: "/calculators/finance/refinance-calculator" },
  openGraph: {
    title: "Refinance Calculator - Break-Even & Savings | OnlineCalc",
    description: "See if refinancing your mortgage pays off. Calculate your break-even month and total interest saved with this free refinance calculator.",
    url: "/calculators/finance/refinance-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refinance Calculator - Break-Even & Savings",
    description: "See if refinancing your mortgage pays off. Calculate your break-even month and total interest saved with this free refinance calculator.",
  },
};

export default function RefinanceCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
