import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medicaid Eligibility Calculator - Income Limits",
  description:
    "Check Medicaid eligibility by state, income, and household size. Free Medicaid calculator to see if you qualify for coverage.",
  keywords: ["medicaid eligibility","medicaid eligibility online","free medicaid eligibility","medicaid eligibility calculator"],
  alternates: { canonical: "/calculators/finance/medicaid-eligibility" },
  openGraph: {
    title: "Medicaid Eligibility Calculator - Income Limits | OnlineCalc",
    description: "Check Medicaid eligibility by state, income, and household size. Free Medicaid calculator to see if you qualify for coverage.",
    url: "/calculators/finance/medicaid-eligibility",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicaid Eligibility Calculator - Income Limits",
    description: "Check Medicaid eligibility by state, income, and household size. Free Medicaid calculator to see if you qualify for coverage.",
  },
};

export default function MedicaidEligibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
