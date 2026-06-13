import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator - Should You Rent or Buy a Home?",
  description:
    "Free rent vs buy calculator. Compare the true cost of renting against buying over the years you plan to stay, with mortgage, property tax, maintenance, appreciation, and the investment return on your down payment. See your break-even year.",
  keywords: [
    "rent vs buy calculator",
    "should i rent or buy",
    "rent or buy a house",
    "buy vs rent calculator",
    "rent versus buy",
    "break even rent vs buy",
    "is it better to rent or buy",
  ],
  alternates: { canonical: "/calculators/finance/rent-vs-buy-calculator" },
  openGraph: {
    title: "Rent vs Buy Calculator - Should You Rent or Buy a Home?",
    description:
      "Compare renting against buying over the years you plan to stay, including the investment return on money you do not tie up in a home. Find your break-even year.",
    url: "/calculators/finance/rent-vs-buy-calculator",
    type: "website",
  },
};

export default function RentVsBuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
