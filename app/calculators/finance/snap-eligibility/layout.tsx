import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SNAP Eligibility Calculator - Food Benefits",
  description:
    "Check if you qualify for SNAP food assistance and estimate your monthly benefit by household size and income. Free SNAP eligibility calculator.",
  keywords: ["snap eligibility","snap eligibility online","free snap eligibility","snap eligibility calculator"],
  alternates: { canonical: "/calculators/finance/snap-eligibility" },
  openGraph: {
    title: "SNAP Eligibility Calculator - Food Benefits | OnlineCalc",
    description: "Check if you qualify for SNAP food assistance and estimate your monthly benefit by household size and income. Free SNAP eligibility calculator.",
    url: "/calculators/finance/snap-eligibility",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SNAP Eligibility Calculator - Food Benefits",
    description: "Check if you qualify for SNAP food assistance and estimate your monthly benefit by household size and income. Free SNAP eligibility calculator.",
  },
};

export default function SnapEligibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
