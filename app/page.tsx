import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "OnlineCalc - Find benefits, exemptions & tax savings you may qualify for",
  description:
    "Free, region-aware calculators and guided eligibility checks for benefits, property tax, exemptions, and tax credits across the US, UK, and Canada. Plain language, official sources.",
};

export default function Home() {
  return <HomeContent />;
}
