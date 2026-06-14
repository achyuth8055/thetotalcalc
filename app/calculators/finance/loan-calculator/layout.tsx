import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Calculator - Monthly Payment & Total Cost",
  description:
    "Free loan calculator for any personal, auto, or home loan. Find your monthly payment, total interest, and full amortization schedule.",
  keywords: ["loan calculator","loan calculator online","free loan calculator"],
  alternates: { canonical: "/calculators/finance/loan-calculator" },
  openGraph: {
    title: "Loan Calculator - Monthly Payment & Total Cost | OnlineCalc",
    description: "Free loan calculator for any personal, auto, or home loan. Find your monthly payment, total interest, and full amortization schedule.",
    url: "/calculators/finance/loan-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Calculator - Monthly Payment & Total Cost",
    description: "Free loan calculator for any personal, auto, or home loan. Find your monthly payment, total interest, and full amortization schedule.",
  },
};

export default function LoanCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
