import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Hours Calculator - Time Card & Pay Estimator",
  description:
    "Free work hours calculator. Enter your start time, end time, and break to get total hours worked, with optional gross pay from your hourly rate. Handles overnight shifts.",
  keywords: [
    "work hours calculator",
    "time card calculator",
    "hours worked calculator",
    "timesheet calculator",
    "hours between two times",
    "payroll hours calculator",
    "shift hours calculator",
    "time clock calculator",
  ],
  alternates: { canonical: "/calculators/everyday/work-hours-calculator" },
  openGraph: {
    title: "Work Hours Calculator - Time Card & Pay Estimator",
    description:
      "Enter start time, end time, and break to get total hours worked, with optional gross pay from your hourly rate. Handles overnight shifts.",
    url: "/calculators/everyday/work-hours-calculator",
    type: "website",
  },
};

export default function WorkHoursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
