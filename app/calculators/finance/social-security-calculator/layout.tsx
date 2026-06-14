import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Security Calculator - Benefit Estimator",
  description:
    "Estimate your Social Security benefits at 62, 67, and 70 and find the best age to claim. Free Social Security benefits calculator.",
  keywords: ["social security calculator","social security calculator online","free social security calculator"],
  alternates: { canonical: "/calculators/finance/social-security-calculator" },
  openGraph: {
    title: "Social Security Calculator - Benefit Estimator | OnlineCalc",
    description: "Estimate your Social Security benefits at 62, 67, and 70 and find the best age to claim. Free Social Security benefits calculator.",
    url: "/calculators/finance/social-security-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Security Calculator - Benefit Estimator",
    description: "Estimate your Social Security benefits at 62, 67, and 70 and find the best age to claim. Free Social Security benefits calculator.",
  },
};

export default function SocialSecurityCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
