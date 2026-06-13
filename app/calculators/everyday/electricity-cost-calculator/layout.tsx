import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electricity Cost Calculator - Appliance Running Cost",
  description:
    "Free electricity cost calculator. Work out the daily, monthly, and yearly running cost of any appliance from its wattage, hours of use, and your price per kWh. Works in any currency.",
  keywords: [
    "electricity cost calculator",
    "appliance cost calculator",
    "energy cost calculator",
    "kwh cost calculator",
    "power consumption cost",
    "how much does it cost to run",
    "running cost calculator",
    "watt to cost calculator",
  ],
  alternates: { canonical: "/calculators/everyday/electricity-cost-calculator" },
  openGraph: {
    title: "Electricity Cost Calculator - Appliance Running Cost",
    description:
      "Work out the daily, monthly, and yearly running cost of any appliance from its wattage, hours of use, and your price per kWh.",
    url: "/calculators/everyday/electricity-cost-calculator",
    type: "website",
  },
};

export default function ElectricityCostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
