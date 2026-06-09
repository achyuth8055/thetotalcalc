import type { Metadata } from "next";
import { Suspense } from "react";
import DirectoryClient from "@/components/directory/DirectoryClient";

export const metadata: Metadata = {
  title: "Free Calculators & Eligibility Checkers",
  description:
    "Browse authoritative, region-aware financial tools for taxes, benefits, property tax, and exemptions. Zero cost, official sources, plain language.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsDirectoryPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-lg md:px-margin-desktop">
      <div className="mb-stack-lg">
        <h1 className="mb-stack-sm text-display-lg text-primary">
          Free Calculators and Eligibility Checkers
        </h1>
        <p className="max-w-2xl text-body-lg text-on-surface-variant">
          Access authoritative financial tools designed to provide clarity on taxes, benefits, and
          institutional requirements - with zero cost.
        </p>
      </div>

      <Suspense fallback={<div className="py-16 text-center text-on-surface-variant">Loading calculators…</div>}>
        <DirectoryClient />
      </Suspense>
    </div>
  );
}
