import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "One Rep Max Calculator - Estimate Your 1RM",
  description: "Calculate your estimated one rep max (1RM) using Brzycki, Epley, or Lombardi formulas. Get training percentages for strength and hypertrophy.",
  keywords: ["one rep max calculator", "1rm calculator", "1 rep max", "strength training calculator"],
  alternates: { canonical: "/calculators/health/one-rep-max-calculator" },
  openGraph: {
    title: "One Rep Max Calculator - Estimate Your 1RM | TheTotal",
    description: "Calculate your estimated one rep max (1RM) using Brzycki, Epley, or Lombardi formulas.",
    url: "/calculators/health/one-rep-max-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "One Rep Max Calculator - Estimate Your 1RM",
    description: "Calculate your estimated one rep max (1RM) using Brzycki, Epley, or Lombardi formulas.",
  },
};
export default function OneRepMaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
