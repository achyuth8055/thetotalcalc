import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grade Calculator - Final Grade & Exam Score",
  description:
    "Calculate your current grade and the score you need on the final to hit your target. Free grade calculator for students.",
  keywords: ["grade calculator","grade calculator online","free grade calculator"],
  alternates: { canonical: "/calculators/math/grade-calculator" },
  openGraph: {
    title: "Grade Calculator - Final Grade & Exam Score | OnlineCalc",
    description: "Calculate your current grade and the score you need on the final to hit your target. Free grade calculator for students.",
    url: "/calculators/math/grade-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grade Calculator - Final Grade & Exam Score",
    description: "Calculate your current grade and the score you need on the final to hit your target. Free grade calculator for students.",
  },
};

export default function GradeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
