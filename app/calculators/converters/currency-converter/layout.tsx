import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currency Converter - Live Exchange Rates",
  description:
    "Convert between USD, EUR, GBP, INR, JPY, and more currencies. Free currency converter with up-to-date exchange rates.",
  keywords: ["currency converter","currency converter online","free currency converter"],
  alternates: { canonical: "/calculators/converters/currency-converter" },
  openGraph: {
    title: "Currency Converter - Live Exchange Rates | OnlineCalc",
    description: "Convert between USD, EUR, GBP, INR, JPY, and more currencies. Free currency converter with up-to-date exchange rates.",
    url: "/calculators/converters/currency-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Converter - Live Exchange Rates",
    description: "Convert between USD, EUR, GBP, INR, JPY, and more currencies. Free currency converter with up-to-date exchange rates.",
  },
};

export default function CurrencyConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
