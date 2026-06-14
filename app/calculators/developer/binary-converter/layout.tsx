import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Binary Converter - Binary, Decimal, Hex, Octal",
  description:
    "Convert between binary, decimal, hexadecimal, and octal in one click. Free binary converter for programmers and students.",
  keywords: ["binary converter","binary converter online","free binary converter"],
  alternates: { canonical: "/calculators/developer/binary-converter" },
  openGraph: {
    title: "Binary Converter - Binary, Decimal, Hex, Octal | OnlineCalc",
    description: "Convert between binary, decimal, hexadecimal, and octal in one click. Free binary converter for programmers and students.",
    url: "/calculators/developer/binary-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Binary Converter - Binary, Decimal, Hex, Octal",
    description: "Convert between binary, decimal, hexadecimal, and octal in one click. Free binary converter for programmers and students.",
  },
};

export default function BinaryConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
