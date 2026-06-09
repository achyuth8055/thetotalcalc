import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Advertising Disclosure",
  description:
    "How OnlineCalc is funded: advertising and affiliate relationships, and our commitment that they never influence calculations or results.",
  alternates: { canonical: "/advertising-disclosure" },
};

export default function AdvertisingDisclosurePage() {
  return (
    <LegalShell
      title="Advertising Disclosure"
      updated="June 9, 2026"
      intro="OnlineCalc is free to use. To keep it that way, the site is supported by advertising and, in some places, affiliate relationships. We want to be transparent about how that works."
    >
      <h2 className="text-headline-md text-primary">Advertising</h2>
      <p>
        We display ads through third-party networks, including Google AdSense. Ads are clearly distinguishable
        from our content. Advertising revenue helps us build and maintain calculators, keep figures current, and
        offer the tools for free without requiring an account.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Ads never affect calculations</h2>
      <p>
        This is the most important commitment on this page: advertising has <strong className="text-primary">no
        influence</strong> on any calculation, eligibility result, ranking, or recommendation. The numbers a
        calculator returns come from a deterministic rules engine based on official formulas - never from an
        advertiser. We do not change a result, hide a tool, or reorder anything in exchange for ad revenue.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Affiliate relationships</h2>
      <p>
        Some links to third-party services (for example, tax software or professional advisers) may be affiliate
        links, meaning we could earn a small commission at no extra cost to you if you sign up. Where this applies,
        it does not change the calculator&apos;s output or which options we describe. We aim to only reference services
        we consider genuinely relevant.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Controlling the ads you see</h2>
      <p>
        You can manage personalized advertising through your cookie-consent choice on this site and via{" "}
        <a className="text-secondary underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>{" "}
        and <a className="text-secondary underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a>. See our{" "}
        <a className="text-secondary underline" href="/privacy">Privacy Policy</a> for full details on cookies and data.
      </p>
    </LegalShell>
  );
}
