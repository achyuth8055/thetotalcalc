import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator - Exact Age in Years & Days",
  description:
    "Calculate your exact age in years, months, weeks, and days from your date of birth. Free age calculator with a next-birthday countdown.",
  keywords: ["age calculator","age calculator online","free age calculator"],
  alternates: { canonical: "/calculators/date/age-calculator" },
  openGraph: {
    title: "Age Calculator - Exact Age in Years & Days | OnlineCalc",
    description: "Calculate your exact age in years, months, weeks, and days from your date of birth. Free age calculator with a next-birthday countdown.",
    url: "/calculators/date/age-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Age Calculator - Exact Age in Years & Days",
    description: "Calculate your exact age in years, months, weeks, and days from your date of birth. Free age calculator with a next-birthday countdown.",
  },
};

export default function AgeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
