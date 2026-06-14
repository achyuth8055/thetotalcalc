import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMR Calculator - Basal Metabolic Rate & Calories",
  description:
    "Calculate your Basal Metabolic Rate (BMR) and daily calorie needs. Free BMR calculator using the Mifflin-St Jeor equation.",
  keywords: ["bmr calculator","bmr calculator online","free bmr calculator"],
  alternates: { canonical: "/calculators/health/bmr-calculator" },
  openGraph: {
    title: "BMR Calculator - Basal Metabolic Rate & Calories | OnlineCalc",
    description: "Calculate your Basal Metabolic Rate (BMR) and daily calorie needs. Free BMR calculator using the Mifflin-St Jeor equation.",
    url: "/calculators/health/bmr-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMR Calculator - Basal Metabolic Rate & Calories",
    description: "Calculate your Basal Metabolic Rate (BMR) and daily calorie needs. Free BMR calculator using the Mifflin-St Jeor equation.",
  },
};

export default function BmrCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
