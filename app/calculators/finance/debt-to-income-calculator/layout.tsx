import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debt-to-Income Calculator - DTI Ratio",
  description:
    "Calculate your debt-to-income (DTI) ratio and see if you qualify for a mortgage or loan. Free DTI calculator with front-end and back-end ratios.",
  keywords: ["debt to income calculator","debt to income calculator online","free debt to income calculator","debt-to-income calculator"],
  alternates: { canonical: "/calculators/finance/debt-to-income-calculator" },
  openGraph: {
    title: "Debt-to-Income Calculator - DTI Ratio | OnlineCalc",
    description: "Calculate your debt-to-income (DTI) ratio and see if you qualify for a mortgage or loan. Free DTI calculator with front-end and back-end ratios.",
    url: "/calculators/finance/debt-to-income-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt-to-Income Calculator - DTI Ratio",
    description: "Calculate your debt-to-income (DTI) ratio and see if you qualify for a mortgage or loan. Free DTI calculator with front-end and back-end ratios.",
  },
};

export default function DebtToIncomeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
