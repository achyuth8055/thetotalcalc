import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converter - Length, Weight, Volume & More",
  description:
    "Convert between units of length, weight, volume, area, and speed. Free all-in-one unit converter with instant, accurate results.",
  keywords: ["unit converter","unit converter online","free unit converter"],
  alternates: { canonical: "/calculators/everyday/unit-converter" },
  openGraph: {
    title: "Unit Converter - Length, Weight, Volume & More | OnlineCalc",
    description: "Convert between units of length, weight, volume, area, and speed. Free all-in-one unit converter with instant, accurate results.",
    url: "/calculators/everyday/unit-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Converter - Length, Weight, Volume & More",
    description: "Convert between units of length, weight, volume, area, and speed. Free all-in-one unit converter with instant, accurate results.",
  },
};

export default function UnitConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
