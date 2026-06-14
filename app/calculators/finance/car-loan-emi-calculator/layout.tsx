import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Loan EMI Calculator - Monthly Auto Payment",
  description:
    "Free car loan calculator to estimate your monthly auto loan payment, total interest, and overall cost. Compare terms and rates before you buy.",
  keywords: ["car loan emi calculator","car loan emi calculator online","free car loan emi calculator"],
  alternates: { canonical: "/calculators/finance/car-loan-emi-calculator" },
  openGraph: {
    title: "Car Loan EMI Calculator - Monthly Auto Payment | OnlineCalc",
    description: "Free car loan calculator to estimate your monthly auto loan payment, total interest, and overall cost. Compare terms and rates before you buy.",
    url: "/calculators/finance/car-loan-emi-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Loan EMI Calculator - Monthly Auto Payment",
    description: "Free car loan calculator to estimate your monthly auto loan payment, total interest, and overall cost. Compare terms and rates before you buy.",
  },
};

export default function CarLoanEmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
