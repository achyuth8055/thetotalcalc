import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countdown Calculator - Days Until a Date",
  description:
    "Count down the days, hours, and minutes until any future date or event. Free countdown calculator for holidays, birthdays, and deadlines.",
  keywords: ["countdown calculator","countdown calculator online","free countdown calculator"],
  alternates: { canonical: "/calculators/date/countdown-calculator" },
  openGraph: {
    title: "Countdown Calculator - Days Until a Date | OnlineCalc",
    description: "Count down the days, hours, and minutes until any future date or event. Free countdown calculator for holidays, birthdays, and deadlines.",
    url: "/calculators/date/countdown-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Calculator - Days Until a Date",
    description: "Count down the days, hours, and minutes until any future date or event. Free countdown calculator for holidays, birthdays, and deadlines.",
  },
};

export default function CountdownCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
