import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hex Converter - Hexadecimal to Decimal & Binary",
  description:
    "Convert hexadecimal to decimal, binary, and octal instantly. Free hex converter for developers, debugging, and color codes.",
  keywords: ["hex converter","hex converter online","free hex converter"],
  alternates: { canonical: "/calculators/developer/hex-converter" },
  openGraph: {
    title: "Hex Converter - Hexadecimal to Decimal & Binary | OnlineCalc",
    description: "Convert hexadecimal to decimal, binary, and octal instantly. Free hex converter for developers, debugging, and color codes.",
    url: "/calculators/developer/hex-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hex Converter - Hexadecimal to Decimal & Binary",
    description: "Convert hexadecimal to decimal, binary, and octal instantly. Free hex converter for developers, debugging, and color codes.",
  },
};

export default function HexConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
