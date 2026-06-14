import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freelance Tax Calculator - Self-Employment Tax",
  description:
    "Estimate self-employment tax, quarterly payments, and deductions for 1099 work. Free freelance tax calculator for contractors and gig workers.",
  keywords: ["freelance tax calculator","freelance tax calculator online","free freelance tax calculator"],
  alternates: { canonical: "/calculators/finance/freelance-tax-calculator" },
  openGraph: {
    title: "Freelance Tax Calculator - Self-Employment Tax | OnlineCalc",
    description: "Estimate self-employment tax, quarterly payments, and deductions for 1099 work. Free freelance tax calculator for contractors and gig workers.",
    url: "/calculators/finance/freelance-tax-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelance Tax Calculator - Self-Employment Tax",
    description: "Estimate self-employment tax, quarterly payments, and deductions for 1099 work. Free freelance tax calculator for contractors and gig workers.",
  },
};

export default function FreelanceTaxCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
