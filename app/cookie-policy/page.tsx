import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How OnlineCalc uses cookies and similar technologies, including Google AdSense and Google Analytics cookies, consent choices, and how to opt out.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      updated="June 9, 2026"
      intro="This policy explains what cookies are, which ones we use, why we use them, and how you can control them. It complements our Privacy Policy."
    >
      <h2 className="text-headline-md text-primary">What cookies are</h2>
      <p>
        Cookies are small text files stored on your device by your browser. Similar technologies include local
        storage and pixels. They let a site remember your choices and help us and our partners understand how the
        site is used.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Categories of cookies we use</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong className="text-primary">Strictly necessary</strong> - required for the site to function, such as
          remembering your cookie-consent choice and your selected region and language. These do not require consent.
        </li>
        <li>
          <strong className="text-primary">Analytics</strong> - Google Analytics 4 helps us understand which
          calculators are useful and where pages can be improved. Loaded only after you accept analytics cookies.
        </li>
        <li>
          <strong className="text-primary">Advertising</strong> - Google AdSense and its partners may set cookies to
          serve and measure ads, including the DoubleClick cookie. Loaded only after you accept advertising cookies.
        </li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Consent and Google Consent Mode</h2>
      <p>
        We use Google Consent Mode v2 with a default-deny setting: analytics and advertising storage are denied until
        you choose to accept them in our cookie banner. You can change your choice at any time by clearing this
        site&apos;s cookies in your browser, which makes the banner appear again.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">How Google uses advertising cookies</h2>
      <p>
        Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to this and other
        websites. You can opt out of personalized advertising through{" "}
        <a className="text-secondary underline" href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">Google Ads Settings</a>{" "}
        and{" "}
        <a className="text-secondary underline" href="https://www.aboutads.info/choices" rel="nofollow noopener" target="_blank">aboutads.info/choices</a>.
        See also{" "}
        <a className="text-secondary underline" href="https://policies.google.com/technologies/ads" rel="nofollow noopener" target="_blank">how Google uses cookies in advertising</a>.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Managing cookies in your browser</h2>
      <p>
        Most browsers let you block or delete cookies in their settings. Blocking strictly necessary cookies may stop
        parts of the site from working. For more detail on the data we collect, read our{" "}
        <Link className="text-secondary underline" href="/privacy">Privacy Policy</Link> and{" "}
        <Link className="text-secondary underline" href="/advertising-disclosure">Advertising Disclosure</Link>.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">Questions</h2>
      <p>
        Contact us at{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalShell>
  );
}
