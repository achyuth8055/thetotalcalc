import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corrections Policy",
  description:
    "How to report an error in an OnlineCalc calculator or guide, what happens after you report it, and how we publish corrections.",
  alternates: { canonical: "/corrections" },
};

export default function CorrectionsPage() {
  return (
    <LegalShell
      title="Corrections Policy"
      updated="June 9, 2026"
      intro="We aim to be accurate, but rules are complex and they change. If something looks wrong, we want to know and fix it."
    >
      <h2 className="text-headline-md text-primary">How to report an error</h2>
      <p>
        Email{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>The calculator or page (a link is ideal).</li>
        <li>The exact inputs you used.</li>
        <li>The result you received and the result you expected.</li>
        <li>An official source for the expected figure, if you have one.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">What happens next</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>We acknowledge credible reports, usually within a few business days.</li>
        <li>We reproduce the issue and check it against the official source.</li>
        <li>If confirmed, we correct the calculation or content and refresh the calculator&apos;s verified date.</li>
        <li>For significant factual corrections, we note what changed so the record is transparent.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Estimates versus errors</h2>
      <p>
        Some tools are clearly labeled as estimates or pre-checks because the underlying rules vary by location or
        personal circumstances. A figure being an estimate is not an error; we still welcome reports where an estimate
        looks materially off. For how we build and verify tools, see our{" "}
        <Link className="text-secondary underline" href="/methodology">Methodology</Link> and{" "}
        <Link className="text-secondary underline" href="/editorial-policy">Editorial Policy</Link>.
      </p>
    </LegalShell>
  );
}
