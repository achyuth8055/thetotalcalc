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

            <section className="flex flex-col gap-stack-md text-body-md leading-relaxed text-on-surface-variant">
              <div className="flex flex-col gap-stack-sm">
                <h2 className="text-headline-md text-primary">How to use this calculator</h2>
                <p>
                  The estimator turns four pieces of information into a credit figure: your filing status, the number of
                  qualifying children under 17, the number of other dependents, and your income. Two income boxes matter,
                  and people often confuse them. Adjusted gross income (AGI) is your total income after adjustments, and it
                  decides whether the credit starts to phase out at the top. Earned income is your wages and net
                  self-employment income, and it decides how much of the credit can come back as a refund if your tax bill
                  is small. Enter both honestly, because using one in place of the other is the most common reason an
                  estimate comes out wrong.
                </p>
                <p>
                  Once you enter those figures, the result splits into two numbers worth reading separately: the total
                  credit you could claim, and the slice of it that could be refundable. The first reduces the tax you owe.
                  The second can be paid to you as cash even when you owe little or no tax. Understanding why those two
                  numbers differ is the whole point of the tool.
                </p>
              </div>

              <div className="flex flex-col gap-stack-sm">
                <h2 className="text-headline-md text-primary">The four tests a qualifying child must pass</h2>
                <p>
                  For the full $2,200 credit, a child has to meet every one of the IRS tests, not just one or two. Getting
                  a single test wrong is enough to lose the credit for that child, so it is worth checking each:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Age: the child must have been under 17 at the end of the tax year. A child who turned 17 during the
                    year is over the limit for the main credit, though they may still bring the $500 Credit for Other
                    Dependents.
                  </li>
                  <li>
                    Relationship: the child must be your son, daughter, stepchild, foster child, sibling, half-sibling,
                    step-sibling, or a descendant of any of these, such as a grandchild, niece, or nephew.
                  </li>
                  <li>
                    Residency and support: the child must have lived with you for more than half the year and not have
                    provided more than half of their own support.
                  </li>
                  <li>
                    Identification: the child needs a Social Security number valid for work, issued before your return&apos;s
                    due date. Without it, the child does not count for the main credit.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-stack-sm">
                <h2 className="text-headline-md text-primary">How the phase-out works</h2>
                <p>
                  The credit is generous well into the upper-middle class, but it does not last forever. Once your AGI
                  passes $200,000 (or $400,000 if you are married filing jointly), the credit begins to taper. The
                  reduction is mechanical: for every $1,000 of income above your threshold, and any part of a thousand
                  counts as a whole step, you lose $50 of credit. A married couple earning $410,000 with two children sees
                  ten steps of reduction, or $500 off their $4,400 base, leaving $3,900. Most families never reach the
                  phase-out at all, which is why the refundable rules below usually matter more.
                </p>
              </div>

              <div className="flex flex-col gap-stack-sm">
                <h2 className="text-headline-md text-primary">A worked example of the refundable part</h2>
                <p>
                  Suppose you have three qualifying children and $20,000 of earned income, with little or no income tax
                  owed. The base credit is three times $2,200, or $6,600, but a low tax bill means most of it cannot be
                  used as a non-refundable credit. The refundable Additional Child Tax Credit steps in, and it is capped two
                  ways. First, it cannot exceed $1,700 per child, here a ceiling of $5,100. Second, it is limited to 15% of
                  earned income above $2,500. With $20,000 of earnings, that is 15% of $17,500, or $2,625. The lower of the
                  two caps wins, so the refund is limited to about $2,625, not the $5,100 ceiling. The lesson is that earned
                  income, not just the number of children, drives the refund for lower-income families.
                </p>
              </div>

              <div className="flex flex-col gap-stack-sm">
                <h2 className="text-headline-md text-primary">Other dependents and state credits</h2>
                <p>
                  Dependents who do not meet the under-17 test, such as a 17-year-old, a college student, or a qualifying
                  relative you support, can still bring the $500 Credit for Other Dependents. It is non-refundable, so it
                  reduces tax you owe but is not paid out as cash, yet families routinely forget to claim it. Separately,
                  more than a dozen states run their own child tax credit on top of the federal one, and several are
                  refundable, so it is worth checking your state&apos;s rules after you estimate the federal figure.
                </p>
              </div>

              <div className="flex flex-col gap-stack-sm">
                <h2 className="text-headline-md text-primary">Mistakes that quietly cost families money</h2>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Assuming the whole $2,200 per child comes back as cash. Only up to $1,700 is refundable, and only if earnings support it.</li>
                  <li>Using take-home pay instead of AGI to judge the phase-out, which can over- or under-state the credit.</li>
                  <li>Overlooking the $500 Credit for Other Dependents for older children and qualifying relatives.</li>
                  <li>Confusing this credit with the Child and Dependent Care Credit, which offsets childcare costs and can be claimed alongside it for the same child.</li>
                  <li>Letting a child&apos;s Social Security number lapse or filing after the due date without the required identification.</li>
                </ul>
              </div>
            </section>

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
