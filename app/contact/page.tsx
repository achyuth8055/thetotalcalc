import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the OnlineCalc team - report an error, suggest a calculator, or ask a question.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalShell
      title="Contact"
      intro="We read every message. Whether you've spotted an incorrect figure, want to suggest a new calculator, or have a question about how a result was produced, here's how to reach us."
    >
      <h2 className="text-headline-md text-primary">Email</h2>
      <p>
        The fastest way to reach us is by email at{" "}
        <a className="text-secondary underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. We
        aim to respond within a few business days.
      </p>

      <h2 className="pt-2 text-headline-md text-primary">What to include</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-primary">Reporting an error:</strong> tell us which calculator, the inputs you used, and the result you expected - it helps us reproduce and fix the issue quickly.</li>
        <li><strong className="text-primary">Suggesting a calculator:</strong> describe the calculation and, if you can, link to the official source or formula.</li>
        <li><strong className="text-primary">Privacy or data requests:</strong> see our <a className="text-secondary underline" href="/privacy">Privacy Policy</a> for your rights and how to exercise them.</li>
      </ul>

      <h2 className="pt-2 text-headline-md text-primary">Send a message</h2>
      <p className="text-label-sm text-on-surface-variant">
        This form opens your email client. (A hosted form can be connected later.)
      </p>
      <form action={`mailto:${SITE.contactEmail}`} method="post" encType="text/plain" className="not-prose grid gap-stack-md">
        <label className="flex flex-col gap-1 text-label-md text-primary">
          Your email
          <input
            type="email"
            name="from"
            required
            className="rounded-lg border border-surface-border bg-white p-stack-md text-body-md text-on-surface focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-md text-primary">
          Message
          <textarea
            name="body"
            rows={5}
            required
            className="rounded-lg border border-surface-border bg-white p-stack-md text-body-md text-on-surface focus:border-primary"
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-lg bg-primary px-6 py-3 text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container"
        >
          Send message
        </button>
      </form>
    </LegalShell>
  );
}
