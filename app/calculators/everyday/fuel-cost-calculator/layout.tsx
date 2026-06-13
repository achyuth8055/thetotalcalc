import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuel Cost Calculator - Trip Gas & Petrol Cost Estimator",
  description:
    "Free fuel cost calculator. Estimate the gas or petrol cost of any trip from distance, fuel economy, and price. Works with MPG (US and UK), L/100km, and km/L, and with price per gallon or per litre.",
  keywords: [
    "fuel cost calculator",
    "gas cost calculator",
    "petrol cost calculator",
    "trip fuel calculator",
    "fuel cost per mile",
    "cost of driving calculator",
    "mpg fuel cost",
    "litres per 100km cost",
  ],
  alternates: { canonical: "/calculators/everyday/fuel-cost-calculator" },
  openGraph: {
    title: "Fuel Cost Calculator - Trip Gas & Petrol Cost Estimator",
    description:
      "Estimate the fuel cost of any trip from distance, fuel economy, and price. Supports MPG, L/100km, km/L, and price per gallon or litre.",
    url: "/calculators/everyday/fuel-cost-calculator",
    type: "website",
  },
};

export default function FuelCostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
