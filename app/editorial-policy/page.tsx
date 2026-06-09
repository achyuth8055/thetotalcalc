import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "OnlineCalc's editorial standards: how we research, source, write, review, and update calculators and guides to keep them accurate, original, and people-first.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <LegalShell
      title="Editorial Policy"
      updated="June 9, 2026"
      intro="Our content exists to help people make sense of money, benefits, and tax. This policy describes how we create and maintain it."
    >
      <h2 className="text-headline-md text-primary">People-first, original content</h2>
      <p>
        Every calculator and guide is written to answer a real question clearly. We do not publish thin or
        auto-generated pages, and we do not duplicate the same content across pages. Each page is written to stand on
        its own with original explanations, examples, and context.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Sourcing and accuracy</h2>
      <p>
        Tax, benefit, and property figures trace back to official sources - for example the IRS and Social Security
        Administration in the US, GOV.UK and HMRC in the UK, and the CRA in Canada. Calculations run through a
        deterministic rules engine so the same inputs always produce the same result. See our{" "}
        <Link className="text-secondary underline" href="/methodology">Methodology</Link> for the full process.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Review and verification</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Each engine calculator carries a <strong className="text-primary">last verified date</strong> and links to its sources.</li>
        <li>Calculations are covered by golden test vectors that must pass before changes ship.</li>
        <li>We state a <strong className="text-primary">confidence level</strong> and flag when local review is needed instead of presenting a falsely precise figure.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Independence from advertising</h2>
      <p>
        Advertising and affiliate relationships never influence a calculation, a result, or the substance of a guide.
        See our{" "}
        <Link className="text-secondary underline" href="/advertising-disclosure">Advertising Disclosure</Link>.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Updates and corrections</h2>
      <p>
        When laws, rates, or thresholds change, we update the affected tools and refresh their verified date. To
        report an error, see our{" "}
        <Link className="text-secondary underline" href="/corrections">Corrections Policy</Link> or email{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalShell>
  );
}
