import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Temperature Converter - Celsius, Fahrenheit, K",
  description:
    "Convert temperature between Celsius, Fahrenheit, and Kelvin instantly. Free temperature converter with formulas and accurate results.",
  keywords: ["temperature converter","temperature converter online","free temperature converter"],
  alternates: { canonical: "/calculators/converters/temperature-converter" },
  openGraph: {
    title: "Temperature Converter - Celsius, Fahrenheit, K | OnlineCalc",
    description: "Convert temperature between Celsius, Fahrenheit, and Kelvin instantly. Free temperature converter with formulas and accurate results.",
    url: "/calculators/converters/temperature-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temperature Converter - Celsius, Fahrenheit, K",
    description: "Convert temperature between Celsius, Fahrenheit, and Kelvin instantly. Free temperature converter with formulas and accurate results.",
  },
};

export default function TemperatureConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
