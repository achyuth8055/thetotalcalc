import type { Metadata } from "next";
import Link from "next/link";
import DynamicCalculator from "@/components/engine/DynamicCalculator";
import { usChildTaxCredit2025 as def } from "@/data/calculators/us-child-tax-credit-2025";

export const metadata: Metadata = {
  title: "US Child Tax Credit Calculator 2025 - Estimate & Eligibility",
  description:
    "Estimate your 2025 US Child Tax Credit (up to $2,200 per child), see how much could be refundable, and check whether you likely qualify. Plain language, official IRS sources.",
  alternates: { canonical: "/calculators/benefits/us-child-tax-credit" },
};

const WHO_FOR = [
  "Parents and guardians with children under 17",
  "Families wanting to estimate their refund",
  "Anyone checking eligibility before filing",
];

const RELATED = [
  { name: "Earned Income Tax Credit", href: "/calculators" },
  { name: "US Salary After Tax", href: "/calculators" },
  { name: "Capital Gains Estimator", href: "/calculators" },
];

export default function UsChildTaxCreditPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-surface-border bg-surface-container-low pb-stack-lg pt-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <nav className="mb-stack-md">
            <ol className="flex items-center gap-stack-sm text-label-sm text-on-surface-variant">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">Home</Link>
              </li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li>
                <Link href="/calculators" className="transition-colors hover:text-primary">Calculators</Link>
              </li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li className="font-bold text-primary">Child Tax Credit</li>
            </ol>
          </nav>

          <div className="flex flex-col justify-between gap-stack-md md:flex-row md:items-end">
            <div>
              <h1 className="mb-unit text-headline-lg text-primary">{def.title}</h1>
              <div className="flex flex-wrap items-center gap-stack-md text-label-md text-on-surface-variant">
                <span className="flex items-center gap-unit">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  United States (Federal)
                </span>
                <span className="flex items-center gap-unit">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Last Updated: {def.lastVerified}
                </span>
                <a
                  href={def.sources[0]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-unit font-bold text-secondary hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Source: IRS.gov
                </a>
              </div>
            </div>
            <div className="flex gap-stack-sm">
              <button className="flex items-center gap-unit rounded-lg border-2 border-primary px-stack-md py-stack-sm font-bold text-primary transition-all hover:bg-primary hover:text-on-primary active:scale-95">
                <span className="material-symbols-outlined">bookmark</span>
                <span>Bookmark</span>
              </button>
              <button className="flex items-center gap-unit rounded-lg border-2 border-primary px-stack-md py-stack-sm font-bold text-primary transition-all hover:bg-primary hover:text-on-primary active:scale-95">
                <span className="material-symbols-outlined">share</span>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <main className="mx-auto max-w-container-max px-margin-mobile py-stack-lg md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
          {/* Left: context */}
          <aside className="flex flex-col gap-stack-lg md:col-span-3">
            <section>
              <h3 className="mb-stack-sm text-headline-md text-primary">Overview</h3>
              <p className="text-body-md text-on-surface-variant">{def.description}</p>
            </section>

            <section className="rounded-xl bg-surface-container p-stack-md">
              <h4 className="mb-stack-sm text-label-md text-primary">Who this is for</h4>
              <ul className="flex flex-col gap-stack-sm text-label-sm text-on-surface-variant">
                {WHO_FOR.map((w) => (
                  <li key={w} className="flex items-start gap-unit">
                    <span className="material-symbols-outlined mt-0.5 text-[16px] text-secondary">check_circle</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-l-4 border-primary-container py-stack-sm pl-stack-md">
              <h4 className="mb-stack-sm text-label-md text-primary">What you&apos;ll need</h4>
              <ul className="flex flex-col gap-stack-sm text-label-sm text-on-surface-variant">
                {def.documents?.map((d) => <li key={d}>• {d}</li>)}
              </ul>
            </section>
          </aside>

          {/* Center: calculator + FAQ */}
          <article className="flex flex-col gap-stack-lg md:col-span-6">
            <DynamicCalculator def={def} />

            {def.faqs && def.faqs.length > 0 && (
              <section className="flex flex-col gap-stack-md">
                <h3 className="text-headline-md text-primary">Frequently Asked Questions</h3>
                <div className="flex flex-col gap-stack-sm">
                  {def.faqs.map((faq) => (
                    <details key={faq.question} className="premium-card group cursor-pointer rounded-lg p-stack-md">
                      <summary className="flex list-none items-center justify-between text-label-md text-primary">
                        <span>{faq.question}</span>
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                      </summary>
                      <p className="mt-stack-sm text-body-md text-on-surface-variant">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Right: sticky sidebar */}
          <aside className="flex flex-col gap-stack-lg md:col-span-3">
            <div className="sticky top-24 flex flex-col gap-stack-lg">
              <section className="premium-card overflow-hidden rounded-xl">
                <div className="bg-primary p-stack-md">
                  <h4 className="text-label-md text-on-primary">Related Calculators</h4>
                </div>
                <div className="flex flex-col p-stack-sm">
                  {RELATED.map((r) => (
                    <Link
                      key={r.name}
                      href={r.href}
                      className="group flex items-center justify-between rounded-lg p-stack-sm transition-colors hover:bg-surface-container-low"
                    >
                      <span className="text-label-sm text-on-surface-variant group-hover:text-primary">{r.name}</span>
                      <span className="material-symbols-outlined text-[18px] text-outline opacity-0 transition-opacity group-hover:opacity-100">
                        arrow_forward
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border-none bg-tertiary-fixed p-stack-md text-on-tertiary-fixed shadow-lg">
                <h4 className="mb-stack-sm text-headline-md">Need Expert Advice?</h4>
                <p className="mb-stack-md text-label-sm opacity-80">
                  Connect with a certified tax professional to review your Child Tax Credit and full return.
                </p>
                <button className="w-full rounded-lg bg-primary py-stack-sm text-label-md font-bold text-on-primary transition-all hover:bg-primary-container">
                  Find a Professional
                </button>
              </section>
            </div>
          </aside>
        </div>
      </main>

      {/* Disclaimer band */}
      <section className="mt-stack-lg border-t border-surface-border bg-surface-container-low">
        <div className="mx-auto max-w-container-max px-margin-mobile py-stack-lg md:px-margin-desktop">
          <div className="mx-auto flex max-w-3xl flex-col gap-stack-sm text-center">
            <h5 className="text-label-md text-primary">Disclaimer &amp; Accuracy</h5>
            <p className="text-label-sm leading-relaxed text-on-surface-variant">{def.disclaimer}</p>
          </div>
        </div>
      </section>
    </>
  );
}
