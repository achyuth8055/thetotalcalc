import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASCII Converter - Text to ASCII & Back",
  description:
    "Convert text to ASCII codes and ASCII codes back to text. Free ASCII converter supporting decimal, hex, and binary output.",
  keywords: ["ascii converter","ascii converter online","free ascii converter"],
  alternates: { canonical: "/calculators/developer/ascii-converter" },
  openGraph: {
    title: "ASCII Converter - Text to ASCII & Back | OnlineCalc",
    description: "Convert text to ASCII codes and ASCII codes back to text. Free ASCII converter supporting decimal, hex, and binary output.",
    url: "/calculators/developer/ascii-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCII Converter - Text to ASCII & Back",
    description: "Convert text to ASCII codes and ASCII codes back to text. Free ASCII converter supporting decimal, hex, and binary output.",
  },
};

export default function AsciiConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
