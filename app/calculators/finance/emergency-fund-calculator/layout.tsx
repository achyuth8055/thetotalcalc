import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emergency Fund Calculator - How Much to Save",
  description:
    "Find out how large your emergency fund should be and how long to build it. Free calculator based on your monthly expenses and savings rate.",
  keywords: ["emergency fund calculator","emergency fund calculator online","free emergency fund calculator"],
  alternates: { canonical: "/calculators/finance/emergency-fund-calculator" },
  openGraph: {
    title: "Emergency Fund Calculator - How Much to Save | OnlineCalc",
    description: "Find out how large your emergency fund should be and how long to build it. Free calculator based on your monthly expenses and savings rate.",
    url: "/calculators/finance/emergency-fund-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emergency Fund Calculator - How Much to Save",
    description: "Find out how large your emergency fund should be and how long to build it. Free calculator based on your monthly expenses and savings rate.",
  },
};

export default function EmergencyFundCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
