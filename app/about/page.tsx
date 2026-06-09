import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About OnlineCalc - our mission to help people understand benefits, taxes, and exemptions through free, region-aware, officially-sourced calculators.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalShell
      title={`About ${SITE.name}`}
      intro="OnlineCalc helps people answer one practical question: 'Am I missing money?' - benefits they could claim, exemptions they qualify for, refunds they're owed, or tax they're overpaying."
    >
      <h2 className="text-headline-md text-primary">Our mission</h2>
      <p>
        Government rules about money are often scattered across dense pages, buried in clunky forms, or simply hard
        to find. We turn them into fast, plain-language calculators and eligibility checks that anyone can use for
        free - no account, no jargon. We start with the United States, United Kingdom, and Canada, and expand to
        more countries over time, always keeping results region-aware (local currency, dates, and the correct tax
        or benefit year).
      </p>

      <h2 className="pt-2 text-headline-md text-primary">What makes us different</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-primary">Sourced, not guessed.</strong> Figures come from official publications - IRS, HMRC, CRA, and equivalent agencies - and each calculator links to its source.</li>
        <li><strong className="text-primary">Deterministic results.</strong> A rules engine computes every answer; AI is used only to explain and translate, never to decide eligibility.</li>
        <li><strong className="text-primary">Transparent.</strong> Every tool shows when its rules were last verified, a confidence level, and a clear disclaimer that an estimate isn&apos;t advice.</li>
        <li><strong className="text-primary">Private by design.</strong> No account required, and the details you enter aren&apos;t stored as part of an identity.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Our commitment to accuracy</h2>
      <p>
        We follow official formulas and update calculators when laws or thresholds change. We&apos;re honest about
        limits, too: complex individual situations can differ from a quick estimate, and our tools never replace
        advice from the relevant agency or a qualified professional. You can read exactly how we build and verify
        our tools in our <a className="text-secondary underline" href="/methodology">methodology &amp; editorial standards</a>.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">How we&apos;re funded</h2>
      <p>
        OnlineCalc is free and supported by advertising, which never influences a calculation or its result. See
        our <a className="text-secondary underline" href="/advertising-disclosure">advertising disclosure</a> for details.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Get in touch</h2>
      <p>
        Operated by {SITE.owner}. Questions, corrections, or suggestions are welcome at{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> or via our{" "}
        <a className="text-secondary underline" href="/contact">contact page</a>.
      </p>
    </LegalShell>
  );
}
