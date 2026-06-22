import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Heart Rate Zone Calculator - Find Your Training Zones",
  description: "Calculate your 5 heart rate training zones using the simple max HR method or the Karvonen Heart Rate Reserve formula. Personalized BPM ranges for cardio and endurance.",
  keywords: ["heart rate zone calculator", "heart rate zones", "karvonen formula", "max heart rate", "cardio zones"],
  alternates: { canonical: "/calculators/health/heart-rate-zone-calculator" },
  openGraph: {
    title: "Heart Rate Zone Calculator | TheTotal",
    description: "Calculate your 5 heart rate training zones using the simple max HR method or the Karvonen Heart Rate Reserve formula.",
    url: "/calculators/health/heart-rate-zone-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heart Rate Zone Calculator - Find Your Training Zones",
    description: "Calculate your 5 heart rate training zones using the simple max HR method or the Karvonen Heart Rate Reserve formula.",
  },
};
export default function HeartRateZoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
