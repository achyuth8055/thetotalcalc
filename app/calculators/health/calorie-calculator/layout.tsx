import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calorie Calculator - Daily Calorie Needs",
  description:
    "Calculate your daily calorie needs to maintain, lose, or gain weight. Free calorie calculator based on age, activity, and goals.",
  keywords: ["calorie calculator","calorie calculator online","free calorie calculator"],
  alternates: { canonical: "/calculators/health/calorie-calculator" },
  openGraph: {
    title: "Calorie Calculator - Daily Calorie Needs | OnlineCalc",
    description: "Calculate your daily calorie needs to maintain, lose, or gain weight. Free calorie calculator based on age, activity, and goals.",
    url: "/calculators/health/calorie-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calorie Calculator - Daily Calorie Needs",
    description: "Calculate your daily calorie needs to maintain, lose, or gain weight. Free calorie calculator based on age, activity, and goals.",
  },
};

export default function CalorieCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
