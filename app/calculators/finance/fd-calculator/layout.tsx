import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FD Calculator - Fixed Deposit Maturity & Interest",
  description:
    "Free fixed deposit calculator to find your FD maturity amount and total interest. Compare simple vs compound interest across tenures and rates.",
  keywords: ["fd calculator","fd calculator online","free fd calculator"],
  alternates: { canonical: "/calculators/finance/fd-calculator" },
  openGraph: {
    title: "FD Calculator - Fixed Deposit Maturity & Interest | OnlineCalc",
    description: "Free fixed deposit calculator to find your FD maturity amount and total interest. Compare simple vs compound interest across tenures and rates.",
    url: "/calculators/finance/fd-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FD Calculator - Fixed Deposit Maturity & Interest",
    description: "Free fixed deposit calculator to find your FD maturity amount and total interest. Compare simple vs compound interest across tenures and rates.",
  },
};

export default function FdCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
