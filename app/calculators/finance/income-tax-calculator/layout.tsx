import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Income Tax Calculator - Federal Tax Estimator",
  description:
    "Estimate your federal income tax and effective rate using current brackets. Free income tax calculator for quick, accurate take-home estimates.",
  keywords: ["income tax calculator","income tax calculator online","free income tax calculator"],
  alternates: { canonical: "/calculators/finance/income-tax-calculator" },
  openGraph: {
    title: "Income Tax Calculator - Federal Tax Estimator | OnlineCalc",
    description: "Estimate your federal income tax and effective rate using current brackets. Free income tax calculator for quick, accurate take-home estimates.",
    url: "/calculators/finance/income-tax-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Income Tax Calculator - Federal Tax Estimator",
    description: "Estimate your federal income tax and effective rate using current brackets. Free income tax calculator for quick, accurate take-home estimates.",
  },
};

export default function IncomeTaxCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
