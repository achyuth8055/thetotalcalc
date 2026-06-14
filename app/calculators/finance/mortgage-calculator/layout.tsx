import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Calculator - Monthly Payment & Interest",
  description:
    "Free mortgage calculator to estimate your monthly payment, total interest, and amortization, including principal, interest, taxes, and insurance.",
  keywords: ["mortgage calculator","mortgage calculator online","free mortgage calculator"],
  alternates: { canonical: "/calculators/finance/mortgage-calculator" },
  openGraph: {
    title: "Mortgage Calculator - Monthly Payment & Interest | OnlineCalc",
    description: "Free mortgage calculator to estimate your monthly payment, total interest, and amortization, including principal, interest, taxes, and insurance.",
    url: "/calculators/finance/mortgage-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Calculator - Monthly Payment & Interest",
    description: "Free mortgage calculator to estimate your monthly payment, total interest, and amortization, including principal, interest, taxes, and insurance.",
  },
};

export default function MortgageCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
