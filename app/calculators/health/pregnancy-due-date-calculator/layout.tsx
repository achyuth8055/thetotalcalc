import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator - Estimate Your Baby's Arrival",
  description: "Calculate your pregnancy due date from your last menstrual period, conception date, or IVF transfer date. Get gestational age, trimester, and key milestone dates.",
  keywords: ["pregnancy due date calculator", "due date calculator", "gestational age calculator", "ivf due date", "pregnancy weeks calculator"],
  alternates: { canonical: "/calculators/health/pregnancy-due-date-calculator" },
  openGraph: {
    title: "Pregnancy Due Date Calculator | TheTotal",
    description: "Calculate your pregnancy due date from LMP, conception date, or IVF transfer date.",
    url: "/calculators/health/pregnancy-due-date-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pregnancy Due Date Calculator - Estimate Your Baby's Arrival",
    description: "Calculate your pregnancy due date from your last menstrual period, conception date, or IVF transfer date.",
  },
};
export default function PregnancyDueDateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
