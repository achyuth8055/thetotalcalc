import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Loan EMI Calculator - Monthly Payment",
  description:
    "Calculate your home loan EMI, total interest, and full repayment breakdown. See how loan amount, rate, and tenure change your monthly payment.",
  keywords: ["home loan emi calculator","home loan emi calculator online","free home loan emi calculator"],
  alternates: { canonical: "/calculators/finance/home-loan-emi-calculator" },
  openGraph: {
    title: "Home Loan EMI Calculator - Monthly Payment | OnlineCalc",
    description: "Calculate your home loan EMI, total interest, and full repayment breakdown. See how loan amount, rate, and tenure change your monthly payment.",
    url: "/calculators/finance/home-loan-emi-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Loan EMI Calculator - Monthly Payment",
    description: "Calculate your home loan EMI, total interest, and full repayment breakdown. See how loan amount, rate, and tenure change your monthly payment.",
  },
};

export default function HomeLoanEmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
