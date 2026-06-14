import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weight Converter - kg, lbs, g, oz & More",
  description:
    "Convert weight between kilograms, pounds, grams, ounces, stones, and tons. Free, instant weight converter with accurate results.",
  keywords: ["weight converter","weight converter online","free weight converter"],
  alternates: { canonical: "/calculators/converters/weight-converter" },
  openGraph: {
    title: "Weight Converter - kg, lbs, g, oz & More | OnlineCalc",
    description: "Convert weight between kilograms, pounds, grams, ounces, stones, and tons. Free, instant weight converter with accurate results.",
    url: "/calculators/converters/weight-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weight Converter - kg, lbs, g, oz & More",
    description: "Convert weight between kilograms, pounds, grams, ounces, stones, and tons. Free, instant weight converter with accurate results.",
  },
};

export default function WeightConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
