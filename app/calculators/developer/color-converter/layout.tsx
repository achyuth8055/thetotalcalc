import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter - HEX, RGB & HSL",
  description:
    "Convert colors between HEX, RGB, and HSL formats with a live preview. Free color converter for web designers and developers.",
  keywords: ["color converter","color converter online","free color converter"],
  alternates: { canonical: "/calculators/developer/color-converter" },
  openGraph: {
    title: "Color Converter - HEX, RGB & HSL | OnlineCalc",
    description: "Convert colors between HEX, RGB, and HSL formats with a live preview. Free color converter for web designers and developers.",
    url: "/calculators/developer/color-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Converter - HEX, RGB & HSL",
    description: "Convert colors between HEX, RGB, and HSL formats with a live preview. Free color converter for web designers and developers.",
  },
};

export default function ColorConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
