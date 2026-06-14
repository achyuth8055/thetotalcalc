import type { Metadata } from "next";

const title = "IP Subnet Calculator - CIDR & Network Range";
const description =
  "Free IP subnet calculator. Enter an IP address and CIDR prefix to get the network address, broadcast address, usable host range, subnet mask, and host count.";
const path = "/calc/ip-subnet-calculator";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["ip subnet calculator", "cidr calculator", "subnet mask calculator", "network calculator", "ipv4 subnet"],
  alternates: { canonical: path },
  openGraph: { title: title + " | OnlineCalc", description, url: path, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function IpSubnetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
