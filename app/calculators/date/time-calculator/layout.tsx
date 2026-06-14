import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Calculator - Add, Subtract & Duration",
  description:
    "Add or subtract hours and minutes and calculate the duration between two times. Free time calculator for work hours and scheduling.",
  keywords: ["time calculator","time calculator online","free time calculator"],
  alternates: { canonical: "/calculators/date/time-calculator" },
  openGraph: {
    title: "Time Calculator - Add, Subtract & Duration | OnlineCalc",
    description: "Add or subtract hours and minutes and calculate the duration between two times. Free time calculator for work hours and scheduling.",
    url: "/calculators/date/time-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Calculator - Add, Subtract & Duration",
    description: "Add or subtract hours and minutes and calculate the duration between two times. Free time calculator for work hours and scheduling.",
  },
};

export default function TimeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
