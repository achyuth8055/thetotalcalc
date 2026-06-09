import type { Metadata } from "next";
import Link from "next/link";
import { runCalculator } from "@/lib/engine/evaluate";
import { usChildTaxCredit2025 } from "@/data/calculators/us-child-tax-credit-2025";

export const metadata: Metadata = {
  title: "Your Personalized Benefits Report (Sample)",
  description:
    "A sample personalized eligibility report showing the benefits, credits, and savings a household may qualify for, with confidence levels and official sources.",
  alternates: { canonical: "/report" },
};

// The Child Tax Credit figure is computed by the real rules engine for a sample
// household; the other programs are illustrative placeholders for the preview.
const sampleHousehold = {
  filingStatus: "mfj",
  qualifyingChildren: 2,
  otherDependents: 0,
  agi: 42500,
  earnedIncome: 42500,
  childrenHaveValidSSN: true,
};

const ctcResult = runCalculator(usChildTaxCredit2025, sampleHousehold);
const ctcAnnual = Number(ctcResult.outputs.find((o) => o.primary)?.value ?? 0);
const ctcMonthly = Math.round(ctcAnnual / 12);

type Card = {
  status: "positive" | "warning";
  statusLabel: string;
  monthly: number;
  title: string;
  desc: string;
  metaIcon: string;
  meta: string;
};

const CARDS: Card[] = [
  {
    status: "positive",
    statusLabel: "Likely Qualifies",
    monthly: ctcMonthly,
    title: "Child Tax Credit",
    desc: `Computed by our rules engine for 2 qualifying children and income of $42,500 (refundable portion included).`,
    metaIcon: "verified",
    meta: "Calculated from IRS 2025 rules",
  },
  {
    status: "warning",
    statusLabel: "May Qualify",
    monthly: 640,
    title: "Housing Assistance",
    desc: "Regional voucher program for families in low-to-middle income brackets.",
    metaIcon: "info",
    meta: "Requires document upload",
  },
  {
    status: "positive",
    statusLabel: "Likely Qualifies",
    monthly: 150,
    title: "Internet Subsidy",
    desc: "Broadband accessibility grant for high-density residential zones.",
    metaIcon: "bolt",
    meta: "Auto-enrolled eligible",
  },
  {
    status: "warning",
    statusLabel: "May Qualify",
    monthly: 150,
    title: "Utility Credits",
    desc: "Seasonal heating and cooling assistance programs from local providers.",
    metaIcon: "account_balance",
    meta: "Verification pending",
  },
];

const totalMonthly = CARDS.reduce((sum, c) => sum + c.monthly, 0);

const STEPS = [
  { label: "Profile", done: true },
  { label: "Details", done: true },
  { label: "Results", done: false, active: true },
];

const SOURCES = ["Official rules used: IRS (2025)", "Social Security Administration (SSA)", "State Department of Finance"];

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-container-max px-margin-mobile py-stack-lg md:px-margin-desktop">
      {/* Sample notice */}
      <div className="mb-stack-md rounded-lg border border-surface-border bg-surface-container-low px-4 py-2 text-center text-label-sm text-on-surface-variant">
        This is a <span className="font-bold text-primary">sample report</span> for preview. Run a real
        calculator from the{" "}
        <Link href="/calculators" className="text-secondary underline">directory</Link> for your own numbers.
      </div>

      {/* Stepper */}
      <div className="mx-auto mb-stack-lg flex max-w-2xl items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
                <span className="material-symbols-outlined">{s.done ? "check" : "stars"}</span>
              </div>
              <span className={`text-label-sm text-primary ${s.active ? "font-bold" : ""}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="mx-4 h-0.5 flex-1 bg-primary" />}
          </div>
        ))}
      </div>

      {/* Hero */}
      <section className="custom-shadow relative mb-stack-lg overflow-hidden rounded-xl border border-surface-border bg-surface-container-lowest p-stack-lg text-center md:p-12">
        <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
        <span className="status-badge-positive mb-4 inline-flex items-center rounded-full px-3 py-1 text-label-md">
          <span className="material-symbols-outlined mr-1 text-sm">verified</span> Likelihood: High
        </span>
        <h1 className="mb-2 text-display-lg text-primary">
          You likely qualify for ${totalMonthly.toLocaleString()}/month in benefits.
        </h1>
        <p className="mx-auto max-w-2xl text-body-lg text-on-surface-variant">
          Based on your household profile and current guidelines, we identified {CARDS.length} programs for
          which you meet the eligibility threshold.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Stat icon="analytics" label="Confidence Score" value="95%" />
          <Stat icon="policy" label="Programs Found" value={String(CARDS.length).padStart(2, "0")} />
        </div>
      </section>

      {/* Bento grid */}
      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
        {/* Benefit cards */}
        <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2 lg:col-span-8">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="custom-shadow rounded-xl border border-surface-border bg-surface-container-lowest p-stack-md transition-transform duration-200 hover:scale-[1.01]"
            >
              <div className="mb-4 flex items-start justify-between">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-label-sm ${
                    c.status === "positive" ? "status-badge-positive" : "status-badge-warning"
                  }`}
                >
                  {c.statusLabel}
                </span>
                <span className="text-headline-md text-primary">
                  ${c.monthly}
                  <span className="text-label-sm text-on-surface-variant">/mo</span>
                </span>
              </div>
              <h3 className="mb-2 text-headline-md text-primary">{c.title}</h3>
              <p className="mb-6 text-body-md text-on-surface-variant">{c.desc}</p>
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">{c.metaIcon}</span>
                <span>{c.meta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Side panels */}
        <aside className="flex flex-col gap-gutter lg:col-span-4">
          <div className="custom-shadow sticky top-24 rounded-xl bg-primary p-stack-lg text-on-primary">
            <h4 className="mb-6 text-headline-md">Next Steps</h4>
            <div className="flex flex-col gap-4">
              <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white font-bold text-primary transition-colors hover:bg-primary-fixed">
                <span className="material-symbols-outlined">picture_as_pdf</span> Download Full Report (PDF)
              </button>
              <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-white font-bold text-on-primary transition-colors hover:bg-primary-container">
                <span className="material-symbols-outlined">notifications_active</span> Set Deadline Reminders
              </button>
              <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg font-bold text-on-primary underline transition-colors hover:text-primary-fixed">
                <span className="material-symbols-outlined">person_search</span> Find Local Professional
              </button>
            </div>
            <div className="mt-8 border-t border-primary-container pt-8">
              <p className="mb-4 text-label-sm uppercase tracking-widest text-on-primary-container">Source Checklist</p>
              <ul className="space-y-3">
                {SOURCES.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-label-sm">
                    <span className="material-symbols-outlined text-sm text-secondary-fixed">task_alt</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Annual impact bar viz */}
          <div className="rounded-xl border border-surface-border bg-surface-container-low p-stack-md">
            <h5 className="mb-4 text-label-md text-primary">Annual Impact Visualization</h5>
            <div className="relative flex h-48 w-full items-end gap-4 overflow-hidden rounded-lg bg-surface-container px-4">
              <div className="h-1/2 flex-1 rounded-t-sm bg-primary opacity-50" title="Current Baseline" />
              <div className="h-3/4 flex-1 rounded-t-sm bg-primary" title="Projected Benefits" />
              <div className="h-full flex-1 rounded-t-sm bg-primary" title="Potential Maximum" />
            </div>
            <div className="mt-2 flex justify-between text-label-sm text-on-surface-variant">
              <span>Current</span>
              <span>Projected</span>
              <span>Potential</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Featured professional */}
      <section className="mt-stack-lg flex flex-col items-center gap-gutter rounded-xl border border-surface-border bg-surface-container-low p-stack-lg md:flex-row">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
          <span className="material-symbols-outlined text-[40px]">support_agent</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-headline-md text-primary">Need help filing?</h4>
          <p className="text-body-md text-on-surface-variant">
            Connect with a verified specialist to walk through the application process for these results.
            Average response time: 4 minutes.
          </p>
        </div>
        <button className="h-12 rounded-lg bg-primary px-gutter font-bold text-on-primary transition-all hover:bg-primary-container">
          Start Chat Now
        </button>
      </section>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-4">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <div className="text-left">
        <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</p>
        <p className="text-headline-md text-primary">{value}</p>
      </div>
    </div>
  );
}
