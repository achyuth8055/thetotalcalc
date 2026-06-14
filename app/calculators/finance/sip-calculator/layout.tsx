import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator - Mutual Fund Returns Estimator",
  description:
    "Calculate the future value of your monthly SIP investments. See projected returns, total invested, and wealth gained with this free SIP calculator.",
  keywords: ["sip calculator","sip calculator online","free sip calculator"],
  alternates: { canonical: "/calculators/finance/sip-calculator" },
  openGraph: {
    title: "SIP Calculator - Mutual Fund Returns Estimator | OnlineCalc",
    description: "Calculate the future value of your monthly SIP investments. See projected returns, total invested, and wealth gained with this free SIP calculator.",
    url: "/calculators/finance/sip-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP Calculator - Mutual Fund Returns Estimator",
    description: "Calculate the future value of your monthly SIP investments. See projected returns, total invested, and wealth gained with this free SIP calculator.",
  },
};

export default function SipCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
