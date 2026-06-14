import type { Metadata } from "next";

const title = "Homestead Exemption Calculator - Property Tax";
const description =
  "Estimate your property tax savings from your state's homestead exemption, including extra senior, veteran, and disability exemptions. Free homestead calculator.";
const path = "/calc/us-homestead-exemption";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["homestead exemption calculator", "property tax exemption", "homestead exemption by state", "property tax savings", "senior homestead exemption"],
  alternates: { canonical: path },
  openGraph: { title: title + " | OnlineCalc", description, url: path, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function UsHomesteadExemptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
