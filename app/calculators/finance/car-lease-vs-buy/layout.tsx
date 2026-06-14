import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Lease vs Buy Calculator - Total Cost",
  description:
    "Compare the total cost of leasing vs buying a car over your ownership period. Free lease-vs-buy calculator to find the cheaper option.",
  keywords: ["car lease vs buy","car lease vs buy online","free car lease vs buy","car lease vs buy calculator"],
  alternates: { canonical: "/calculators/finance/car-lease-vs-buy" },
  openGraph: {
    title: "Car Lease vs Buy Calculator - Total Cost | OnlineCalc",
    description: "Compare the total cost of leasing vs buying a car over your ownership period. Free lease-vs-buy calculator to find the cheaper option.",
    url: "/calculators/finance/car-lease-vs-buy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Lease vs Buy Calculator - Total Cost",
    description: "Compare the total cost of leasing vs buying a car over your ownership period. Free lease-vs-buy calculator to find the cheaper option.",
  },
};

export default function CarLeaseVsBuyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
