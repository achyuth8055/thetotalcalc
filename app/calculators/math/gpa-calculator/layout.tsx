import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPA Calculator - College & High School GPA",
  description:
    "Calculate your college or high school GPA from grades and credit hours. Free GPA calculator supporting weighted and unweighted scales.",
  keywords: ["gpa calculator","gpa calculator online","free gpa calculator"],
  alternates: { canonical: "/calculators/math/gpa-calculator" },
  openGraph: {
    title: "GPA Calculator - College & High School GPA | OnlineCalc",
    description: "Calculate your college or high school GPA from grades and credit hours. Free GPA calculator supporting weighted and unweighted scales.",
    url: "/calculators/math/gpa-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator - College & High School GPA",
    description: "Calculate your college or high school GPA from grades and credit hours. Free GPA calculator supporting weighted and unweighted scales.",
  },
};

export default function GpaCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
