import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discount Calculator - Sale Price & Savings",
  description:
    "Calculate the final sale price and how much you save with any percentage discount. Free discount calculator with double-discount support.",
  keywords: ["discount calculator","discount calculator online","free discount calculator"],
  alternates: { canonical: "/calculators/everyday/discount-calculator" },
  openGraph: {
    title: "Discount Calculator - Sale Price & Savings | OnlineCalc",
    description: "Calculate the final sale price and how much you save with any percentage discount. Free discount calculator with double-discount support.",
    url: "/calculators/everyday/discount-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discount Calculator - Sale Price & Savings",
    description: "Calculate the final sale price and how much you save with any percentage discount. Free discount calculator with double-discount support.",
  },
};

export default function DiscountCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
