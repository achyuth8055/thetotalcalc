import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HSA Calculator - Contribution Limits & Tax Savings",
  description:
    "Calculate HSA contribution limits, tax savings, and projected balance at retirement. Free health savings account (HSA) calculator.",
  keywords: ["hsa calculator","hsa calculator online","free hsa calculator"],
  alternates: { canonical: "/calculators/finance/hsa-calculator" },
  openGraph: {
    title: "HSA Calculator - Contribution Limits & Tax Savings | OnlineCalc",
    description: "Calculate HSA contribution limits, tax savings, and projected balance at retirement. Free health savings account (HSA) calculator.",
    url: "/calculators/finance/hsa-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSA Calculator - Contribution Limits & Tax Savings",
    description: "Calculate HSA contribution limits, tax savings, and projected balance at retirement. Free health savings account (HSA) calculator.",
  },
};

export default function HsaCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
