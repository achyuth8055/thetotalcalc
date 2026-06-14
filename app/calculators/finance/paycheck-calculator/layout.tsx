import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paycheck Calculator - Take-Home Pay After Tax",
  description:
    "Calculate your take-home pay after federal tax, FICA, and state taxes. Free paycheck calculator for hourly and salaried workers.",
  keywords: ["paycheck calculator","paycheck calculator online","free paycheck calculator"],
  alternates: { canonical: "/calculators/finance/paycheck-calculator" },
  openGraph: {
    title: "Paycheck Calculator - Take-Home Pay After Tax | OnlineCalc",
    description: "Calculate your take-home pay after federal tax, FICA, and state taxes. Free paycheck calculator for hourly and salaried workers.",
    url: "/calculators/finance/paycheck-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paycheck Calculator - Take-Home Pay After Tax",
    description: "Calculate your take-home pay after federal tax, FICA, and state taxes. Free paycheck calculator for hourly and salaried workers.",
  },
};

export default function PaycheckCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
