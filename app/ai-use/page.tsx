import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Use Policy",
  description:
    "How OnlineCalc uses AI: it never decides amounts or eligibility. Calculations are deterministic. AI is limited to optional helper features such as practice-quiz generation.",
  alternates: { canonical: "/ai-use" },
};

export default function AiUsePage() {
  return (
    <LegalShell
      title="AI Use Policy"
      updated="June 9, 2026"
      intro="We are transparent about where AI is and is not used on this site."
    >
      <h2 className="text-headline-md text-primary">AI never decides your numbers</h2>
      <p>
        Every tax, benefit, property, and finance figure on this site is produced by a deterministic rules engine -
        defined formulas and thresholds evaluated the same way every time. AI is <strong className="text-primary">not</strong>{" "}
        used to calculate an amount or to decide whether you qualify for anything. See our{" "}
        <Link className="text-secondary underline" href="/methodology">Methodology</Link>.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Where AI is used</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong className="text-primary">Practice question generation</strong> - the Math Quiz feature can use a
          large language model (Groq) to generate practice arithmetic questions. If the model is unavailable, a
          deterministic generator is used instead. This feature does not affect any calculator result.
        </li>
        <li>
          <strong className="text-primary">Plain-language help and translation (where offered)</strong> - AI may be
          used to rephrase or translate an explanation. It never changes the underlying figure.
        </li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Human oversight</h2>
      <p>
        Editorial content and calculator rules are written and reviewed by people against official sources. AI-assisted
        helper output is clearly secondary to the deterministic result.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Questions</h2>
      <p>
        Contact us at{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalShell>
  );
}
