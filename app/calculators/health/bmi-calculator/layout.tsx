import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator - Body Mass Index & Range",
  description:
    "Calculate your Body Mass Index (BMI) and healthy weight range in metric or imperial units. Free BMI calculator with a category chart.",
  keywords: ["bmi calculator","bmi calculator online","free bmi calculator"],
  alternates: { canonical: "/calculators/health/bmi-calculator" },
  openGraph: {
    title: "BMI Calculator - Body Mass Index & Range | OnlineCalc",
    description: "Calculate your Body Mass Index (BMI) and healthy weight range in metric or imperial units. Free BMI calculator with a category chart.",
    url: "/calculators/health/bmi-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator - Body Mass Index & Range",
    description: "Calculate your Body Mass Index (BMI) and healthy weight range in metric or imperial units. Free BMI calculator with a category chart.",
  },
};

export default function BmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
