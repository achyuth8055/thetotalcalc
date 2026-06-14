import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator - Monthly Loan Payment & Interest",
  description:
    "Free EMI calculator to find your monthly loan payment, total interest, and amortization schedule. Enter loan amount, rate, and tenure for instant results.",
  keywords: ["emi calculator","emi calculator online","free emi calculator"],
  alternates: { canonical: "/calculators/finance/emi-calculator" },
  openGraph: {
    title: "EMI Calculator - Monthly Loan Payment & Interest | OnlineCalc",
    description: "Free EMI calculator to find your monthly loan payment, total interest, and amortization schedule. Enter loan amount, rate, and tenure for instant results.",
    url: "/calculators/finance/emi-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMI Calculator - Monthly Loan Payment & Interest",
    description: "Free EMI calculator to find your monthly loan payment, total interest, and amortization schedule. Enter loan amount, rate, and tenure for instant results.",
  },
};

export default function EmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
