import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flat vs Reducing Rate Calculator - Loan Compare",
  description:
    "Compare flat-rate and reducing-balance loans side by side. See the true interest cost and effective rate so you never overpay on a loan.",
  keywords: ["flat vs reducing rate calculator","flat vs reducing rate calculator online","free flat vs reducing rate calculator"],
  alternates: { canonical: "/calculators/finance/flat-vs-reducing-rate-calculator" },
  openGraph: {
    title: "Flat vs Reducing Rate Calculator - Loan Compare | OnlineCalc",
    description: "Compare flat-rate and reducing-balance loans side by side. See the true interest cost and effective rate so you never overpay on a loan.",
    url: "/calculators/finance/flat-vs-reducing-rate-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flat vs Reducing Rate Calculator - Loan Compare",
    description: "Compare flat-rate and reducing-balance loans side by side. See the true interest cost and effective rate so you never overpay on a loan.",
  },
};

export default function FlatVsReducingRateCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
