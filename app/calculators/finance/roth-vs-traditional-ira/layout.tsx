import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roth vs Traditional IRA Calculator",
  description:
    "Compare a Roth and Traditional IRA to see which saves you more based on your tax bracket. Free side-by-side IRA comparison calculator.",
  keywords: ["roth vs traditional ira","roth vs traditional ira online","free roth vs traditional ira","roth vs traditional ira calculator"],
  alternates: { canonical: "/calculators/finance/roth-vs-traditional-ira" },
  openGraph: {
    title: "Roth vs Traditional IRA Calculator | OnlineCalc",
    description: "Compare a Roth and Traditional IRA to see which saves you more based on your tax bracket. Free side-by-side IRA comparison calculator.",
    url: "/calculators/finance/roth-vs-traditional-ira",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roth vs Traditional IRA Calculator",
    description: "Compare a Roth and Traditional IRA to see which saves you more based on your tax bracket. Free side-by-side IRA comparison calculator.",
  },
};

export default function RothVsTraditionalIraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
