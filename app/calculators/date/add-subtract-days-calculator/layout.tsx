import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add or Subtract Days Calculator - Date Math",
  description:
    "Add or subtract days, weeks, months, or years from any date. Free date calculator to find a future or past date instantly.",
  keywords: ["add subtract days calculator","add subtract days calculator online","free add subtract days calculator","add or subtract days calculator"],
  alternates: { canonical: "/calculators/date/add-subtract-days-calculator" },
  openGraph: {
    title: "Add or Subtract Days Calculator - Date Math | OnlineCalc",
    description: "Add or subtract days, weeks, months, or years from any date. Free date calculator to find a future or past date instantly.",
    url: "/calculators/date/add-subtract-days-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add or Subtract Days Calculator - Date Math",
    description: "Add or subtract days, weeks, months, or years from any date. Free date calculator to find a future or past date instantly.",
  },
};

export default function AddSubtractDaysCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
