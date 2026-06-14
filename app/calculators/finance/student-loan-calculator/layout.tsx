import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Loan Calculator - Repayment Plans",
  description:
    "Compare Standard, Extended, and income-driven repayment plans for federal student loans. Free student loan payoff and payment calculator.",
  keywords: ["student loan calculator","student loan calculator online","free student loan calculator"],
  alternates: { canonical: "/calculators/finance/student-loan-calculator" },
  openGraph: {
    title: "Student Loan Calculator - Repayment Plans | OnlineCalc",
    description: "Compare Standard, Extended, and income-driven repayment plans for federal student loans. Free student loan payoff and payment calculator.",
    url: "/calculators/finance/student-loan-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Loan Calculator - Repayment Plans",
    description: "Compare Standard, Extended, and income-driven repayment plans for federal student loans. Free student loan payoff and payment calculator.",
  },
};

export default function StudentLoanCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
