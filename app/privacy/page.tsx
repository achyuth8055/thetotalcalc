import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How OnlineCalc handles data, cookies, and advertising - including Google AdSense, your GDPR and CCPA rights, and how to control personalized ads.",
  alternates: { canonical: "/privacy" },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="pt-2 text-headline-md text-primary">{children}</h2>;
}

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="June 9, 2026"
      intro={`This Privacy Policy explains what information ${SITE.name} collects, how it is used, and the choices you have - including how advertising and cookies work on this site.`}
    >
      <H2>1. Who we are</H2>
      <p>
        {SITE.name} ({SITE.url}) provides free online calculators and eligibility checks for taxes,
        benefits, and property. You can reach us at{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        This policy applies to this website only.
      </p>

      <H2>2. Information we collect</H2>
      <p>
        <strong className="text-primary">Calculator inputs.</strong> The values you enter into a
        calculator (such as income, household size, or property value) are processed to produce a result.
        We do not require an account, and we do not store these inputs on our servers as part of your
        identity. Some preferences (like your selected region and language) may be saved in your browser&apos;s
        local storage so the site remembers them on your next visit.
      </p>
      <p>
        <strong className="text-primary">Usage and device data.</strong> Like most websites, we and our
        service providers automatically receive standard information such as IP address, browser type,
        pages viewed, and approximate location, used to operate, secure, and improve the site.
      </p>
      <p>
        <strong className="text-primary">Approximate location.</strong> To show region-relevant calculators,
        we may detect your approximate country from your IP address or browser settings. This is used only to
        tailor content and is not stored as part of an identifiable profile.
      </p>

      <H2>3. Cookies and similar technologies</H2>
      <p>
        We use cookies and local storage for essential functionality (remembering your region, language, and
        consent choices) and for analytics and advertising as described below. You can control non-essential
        cookies through our consent banner and your browser settings. Blocking some cookies may affect how the
        site works.
      </p>

      <H2>4. Advertising and Google AdSense</H2>
      <p>
        This site is supported by advertising and uses{" "}
        <strong className="text-primary">Google AdSense</strong>. Advertising never influences a calculation
        or its result.
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this
          and other websites.
        </li>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your
          visits to this site and/or other sites on the Internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{" "}
          <a className="text-secondary underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
          You can also opt out of some third-party vendors&apos; use of cookies for personalized advertising at{" "}
          <a className="text-secondary underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a>.
        </li>
        <li>
          For more on how Google uses data, see{" "}
          <a className="text-secondary underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses information from sites that use its services</a>.
        </li>
      </ul>
      <p>
        See our <a className="text-secondary underline" href="/advertising-disclosure">Advertising Disclosure</a> for
        how advertising relates to our content.
      </p>

      <H2>5. Analytics</H2>
      <p>
        We use privacy-respecting analytics (such as Google Analytics) to understand aggregate usage and improve
        the site. This data is used in aggregate and not to identify you personally.
      </p>

      <H2>6. Your rights (GDPR / UK GDPR)</H2>
      <p>
        If you are in the European Economic Area or the United Kingdom, you have the right to access, correct,
        delete, or restrict processing of your personal data, to object to processing, and to data portability.
        Where we rely on consent (for example, for personalized advertising cookies), you can withdraw it at any
        time via the consent banner. To exercise these rights, contact{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>

      <H2>7. Your rights (CCPA - California)</H2>
      <p>
        California residents have the right to know what personal information is collected, to request deletion,
        and to opt out of the "sale" or "sharing" of personal information as defined by the CCPA/CPRA. We do not
        sell personal information for money; certain ad-cookie activity may be considered "sharing." You can opt
        out using our consent banner and the ad-vendor opt-out links above.
      </p>

      <H2>8. Children&apos;s privacy</H2>
      <p>
        This site is intended for a general audience and is not directed at children under 13 (or the applicable
        age in your jurisdiction). We do not knowingly collect personal information from children.
      </p>

      <H2>9. Data retention &amp; security</H2>
      <p>
        We keep automatically-collected operational data only as long as necessary for the purposes described
        and apply reasonable safeguards to protect it. No method of transmission or storage is completely secure.
      </p>

      <H2>10. Changes to this policy</H2>
      <p>
        We may update this policy from time to time. Material changes will be reflected by updating the "Last
        updated" date above.
      </p>

      <H2>11. Contact</H2>
      <p>
        Questions about this policy? Email{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> or use
        our <a className="text-secondary underline" href="/contact">contact page</a>.
      </p>
    </LegalShell>
  );
}
