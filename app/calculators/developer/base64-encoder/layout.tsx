import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder - Online Tool",
  description:
    "Encode text to Base64 and decode Base64 back to text instantly. Free, browser-based Base64 encoder and decoder, no upload needed.",
  keywords: ["base64 encoder","base64 encoder online","free base64 encoder","base64 encoder & decoder"],
  alternates: { canonical: "/calculators/developer/base64-encoder" },
  openGraph: {
    title: "Base64 Encoder & Decoder - Online Tool | OnlineCalc",
    description: "Encode text to Base64 and decode Base64 back to text instantly. Free, browser-based Base64 encoder and decoder, no upload needed.",
    url: "/calculators/developer/base64-encoder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder & Decoder - Online Tool",
    description: "Encode text to Base64 and decode Base64 back to text instantly. Free, browser-based Base64 encoder and decoder, no upload needed.",
  },
};

export default function Base64EncoderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
