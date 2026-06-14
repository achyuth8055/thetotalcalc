import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Length Converter - cm, feet, inches, m & More",
  description:
    "Convert length and height between cm, meters, feet, inches, miles, and km. Free, instant length converter for any measurement.",
  keywords: ["length converter","length converter online","free length converter"],
  alternates: { canonical: "/calculators/converters/length-converter" },
  openGraph: {
    title: "Length Converter - cm, feet, inches, m & More | OnlineCalc",
    description: "Convert length and height between cm, meters, feet, inches, miles, and km. Free, instant length converter for any measurement.",
    url: "/calculators/converters/length-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Length Converter - cm, feet, inches, m & More",
    description: "Convert length and height between cm, meters, feet, inches, miles, and km. Free, instant length converter for any measurement.",
  },
};

export default function LengthConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
