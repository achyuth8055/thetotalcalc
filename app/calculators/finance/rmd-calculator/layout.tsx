import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RMD Calculator - Required Minimum Distribution",
  description:
    "Calculate your required minimum distribution (RMD) from an IRA or 401k at age 73+. Free RMD calculator using current IRS life-expectancy tables.",
  keywords: ["rmd calculator","rmd calculator online","free rmd calculator"],
  alternates: { canonical: "/calculators/finance/rmd-calculator" },
  openGraph: {
    title: "RMD Calculator - Required Minimum Distribution | OnlineCalc",
    description: "Calculate your required minimum distribution (RMD) from an IRA or 401k at age 73+. Free RMD calculator using current IRS life-expectancy tables.",
    url: "/calculators/finance/rmd-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RMD Calculator - Required Minimum Distribution",
    description: "Calculate your required minimum distribution (RMD) from an IRA or 401k at age 73+. Free RMD calculator using current IRS life-expectancy tables.",
  },
};

export default function RmdCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
