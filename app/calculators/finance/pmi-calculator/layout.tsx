import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PMI Calculator - Private Mortgage Insurance Cost",
  description:
    "Calculate your private mortgage insurance (PMI) cost and when you reach 20% equity to drop it. Free PMI calculator for home buyers.",
  keywords: ["pmi calculator","pmi calculator online","free pmi calculator"],
  alternates: { canonical: "/calculators/finance/pmi-calculator" },
  openGraph: {
    title: "PMI Calculator - Private Mortgage Insurance Cost | OnlineCalc",
    description: "Calculate your private mortgage insurance (PMI) cost and when you reach 20% equity to drop it. Free PMI calculator for home buyers.",
    url: "/calculators/finance/pmi-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMI Calculator - Private Mortgage Insurance Cost",
    description: "Calculate your private mortgage insurance (PMI) cost and when you reach 20% equity to drop it. Free PMI calculator for home buyers.",
  },
};

export default function PmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
