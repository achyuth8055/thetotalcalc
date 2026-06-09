import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "OnlineCalc's commitment to accessibility: our WCAG 2.1 AA target, what we have implemented, known limitations, and how to request help or report a barrier.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalShell
      title="Accessibility Statement"
      updated="June 9, 2026"
      intro="We want everyone to be able to use our calculators, including people who rely on assistive technology."
    >
      <h2 className="text-headline-md text-primary">Our standard</h2>
      <p>
        We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Accessibility is an ongoing
        effort, and we treat barriers as bugs to be fixed.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">What we have implemented</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Semantic HTML with labeled form controls and accessible names on interactive elements.</li>
        <li>Keyboard operability for inputs, menus, and buttons.</li>
        <li>Text alternatives for icons, and icons rendered as scalable SVG rather than emoji.</li>
        <li>Color choices intended to meet AA contrast for body text and controls.</li>
        <li>Responsive layouts that reflow on small screens and support browser zoom.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Known limitations</h2>
      <p>
        Some data visualizations and older calculator pages are still being improved for full screen-reader parity.
        Where a chart is shown, the same figures are also presented as text. We are working through remaining gaps.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Get help or report a barrier</h2>
      <p>
        If you encounter an accessibility barrier, or need a result provided in a different format, email{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> and we will
        help and prioritize a fix. Please include the page and the assistive technology you are using.
      </p>
    </LegalShell>
  );
}
