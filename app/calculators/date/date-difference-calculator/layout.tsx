import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date Difference Calculator - Days Between Dates",
  description:
    "Calculate the number of days, weeks, and months between two dates. Free date difference calculator with or without the end date.",
  keywords: ["date difference calculator","date difference calculator online","free date difference calculator"],
  alternates: { canonical: "/calculators/date/date-difference-calculator" },
  openGraph: {
    title: "Date Difference Calculator - Days Between Dates | OnlineCalc",
    description: "Calculate the number of days, weeks, and months between two dates. Free date difference calculator with or without the end date.",
    url: "/calculators/date/date-difference-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date Difference Calculator - Days Between Dates",
    description: "Calculate the number of days, weeks, and months between two dates. Free date difference calculator with or without the end date.",
  },
};

export default function DateDifferenceCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
