import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "401k Calculator - Retirement Growth & Match",
  description:
    "Project your 401k balance at retirement, including employer match and contributions. Free 401k calculator with tax-deferred growth charts.",
  keywords: ["401k calculator","401k calculator online","free 401k calculator"],
  alternates: { canonical: "/calculators/finance/401k-calculator" },
  openGraph: {
    title: "401k Calculator - Retirement Growth & Match | OnlineCalc",
    description: "Project your 401k balance at retirement, including employer match and contributions. Free 401k calculator with tax-deferred growth charts.",
    url: "/calculators/finance/401k-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401k Calculator - Retirement Growth & Match",
    description: "Project your 401k balance at retirement, including employer match and contributions. Free 401k calculator with tax-deferred growth charts.",
  },
};

export default function Plan401kCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
