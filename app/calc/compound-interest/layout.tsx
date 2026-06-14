import type { Metadata } from "next";

const title = "Compound Interest Calculator - Daily & Monthly";
const description =
  "Free compound interest calculator. See how your investment grows with daily, monthly, quarterly, or annual compounding, plus optional regular contributions.";
const path = "/calc/compound-interest";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["compound interest calculator", "daily compound interest", "monthly compound interest", "investment growth calculator", "savings calculator"],
  alternates: { canonical: path },
  openGraph: { title: title + " | OnlineCalc", description, url: path, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function CompoundInterestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
