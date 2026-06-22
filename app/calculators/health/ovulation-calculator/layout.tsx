import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ovulation Calculator - Find Your Fertile Window",
  description: "Calculate your ovulation date and fertile window based on your last menstrual period and cycle length. Understand your most fertile days for conception planning.",
  keywords: ["ovulation calculator", "fertile window calculator", "ovulation date", "menstrual cycle calculator", "conception calculator"],
  alternates: { canonical: "/calculators/health/ovulation-calculator" },
  openGraph: {
    title: "Ovulation Calculator - Find Your Fertile Window | TheTotal",
    description: "Calculate your ovulation date and fertile window based on your last menstrual period and cycle length.",
    url: "/calculators/health/ovulation-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ovulation Calculator - Find Your Fertile Window",
    description: "Calculate your ovulation date and fertile window based on your last menstrual period and cycle length.",
  },
};

export default function OvulationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
