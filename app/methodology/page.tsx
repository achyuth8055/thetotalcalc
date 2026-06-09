import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Methodology & Editorial Standards",
  description:
    "How OnlineCalc builds and verifies its calculators: official sources, a deterministic rules engine, last-verified dates, confidence levels, and how we handle errors.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <LegalShell
      title="Methodology & Editorial Standards"
      updated="June 9, 2026"
      intro="We hold our calculators to a simple standard: if a number appears on this site, it should trace back to an official formula, law, or government publication - not a rule of thumb."
    >
      <h2 className="text-headline-md text-primary">A deterministic rules engine</h2>
      <p>
        Every calculation runs through a deterministic rules engine. Inputs, thresholds, rates, and eligibility
        conditions are defined as data and evaluated the same way every time, so a given set of inputs always
        produces the same, reproducible result. We use AI only to explain a result in plain language or to
        translate it - never to decide an amount or whether you qualify.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Official sources we rely on</h2>
      <p>By region, the primary sources behind our tax, benefit, and property calculators are:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-primary">United States:</strong> Internal Revenue Service (IRS), Social Security Administration, Medicaid.gov, state revenue departments, and county assessors.</li>
        <li><strong className="text-primary">United Kingdom:</strong> GOV.UK, HM Revenue &amp; Customs (HMRC), and local councils.</li>
        <li><strong className="text-primary">Canada:</strong> Canada.ca, the Canada Revenue Agency (CRA), and provincial benefit and tax authorities.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Transparency on every calculator</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-primary">Last verified date</strong> - when we last confirmed the figures against the source.</li>
        <li><strong className="text-primary">Official source links</strong> - so you can check the rule yourself.</li>
        <li><strong className="text-primary">Confidence level</strong> - high, medium, or low, reflecting how clearly the rules apply to your inputs.</li>
        <li><strong className="text-primary">Clear disclaimers</strong> - every result states that an estimate is not tax, legal, or financial advice.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Keeping figures current</h2>
      <p>
        Tax years change, credits are adjusted for inflation, and thresholds move. When that happens we update the
        affected calculators and refresh their "last verified" date. Our flagship US Child Tax Credit calculator,
        for example, reflects the figures in force for the 2025 tax year.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">When we can&apos;t be exact</h2>
      <p>
        Some situations are genuinely complex - multiple dependents with different statuses, foreign income, or
        rules that vary by county. In those cases we tell you that local review is needed rather than presenting a
        falsely precise figure. The tools are a fast, well-sourced starting point, not a replacement for the
        relevant agency or a qualified professional.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Reporting an error</h2>
      <p>
        Found a figure that looks wrong? Please tell us at{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with the
        calculator, your inputs, and the result you expected. We investigate every credible report and correct
        confirmed issues promptly.
      </p>
    </LegalShell>
  );
}
