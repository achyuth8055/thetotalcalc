"use client";

import Link from "next/link";
import RegionCards from "@/components/home/RegionCards";
import { useT } from "@/components/LanguageContext";

const SMALL_CATEGORIES = [
  { label: "Family", icon: "family_restroom" },
  { label: "Senior", icon: "elderly" },
  { label: "Disability", icon: "person_off" },
  { label: "Veteran", icon: "military_tech" },
];

const STEPS = [
  { n: 1, title: "Choose region", text: "Pick your country and state or province." },
  { n: 2, title: "Answer a few questions", text: "Anonymously enter income, household, and dependents." },
  { n: 3, title: "See results", text: "Get a clear estimate, eligibility, and confidence level." },
  { n: 4, title: "Take action", text: "Follow links to official forms and filing instructions." },
];

const TRUST = [
  { icon: "verified_user", title: "Verified Sources", text: "Data drawn from IRS, HMRC, and CRA official publications." },
  { icon: "update", title: "Last Updated", text: "Every calculator shows the date its rules were last verified." },
  { icon: "shield_person", title: "Privacy First", text: "No account required. We don't store or sell your financial profile." },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are the calculators really free?",
    a: "Yes. Every calculator and eligibility check is completely free, with no account, login, or premium tier. The site is supported by advertising, which never influences a calculation or its result.",
  },
  {
    q: "Do you store the information I enter?",
    a: "No. Calculations run in your browser, and we don't require an account or store the income, household, or other details you type into a calculator. See our Privacy Policy for exactly what is and isn't collected.",
  },
  {
    q: "How accurate are the results?",
    a: "Tax and benefit calculators follow the official formulas and published figures for the relevant year, so they typically match government calculators closely. Complex individual situations can differ, and the tools don't replace advice from the relevant agency or a qualified professional.",
  },
  {
    q: "How current are the figures?",
    a: "Each calculator shows the date its rules were last verified and links to the official source. When laws or thresholds change, we update the affected calculators and refresh that date.",
  },
  {
    q: "Is this tax, legal, or financial advice?",
    a: "No. OnlineCalc provides estimates and general information to help you understand your situation. Always confirm with the official agency (such as the IRS, HMRC, or CRA) or a qualified professional before making decisions.",
  },
];

export default function HomeContent() {
  const t = useT();

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden pb-24 pt-stack-lg">
        <div className="mx-auto flex max-w-container-max flex-col items-center px-margin-mobile text-center md:px-margin-desktop">
          <div className="animate-fade-in mb-stack-lg inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-1 text-on-primary-fixed">
            <span className="material-symbols-outlined fill text-[16px]">verified</span>
            <span className="text-label-sm">{t("hero.badge")}</span>
          </div>
          <h1 className="mb-stack-md max-w-4xl text-display-lg leading-tight text-primary">
            {t("hero.titleA")} <span className="text-secondary">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mb-stack-lg max-w-2xl text-body-lg text-on-surface-variant">{t("hero.subtitle")}</p>

          {/* Search */}
          <form
            action="/calculators"
            className="glass-card mb-stack-lg flex w-full max-w-3xl items-center gap-stack-sm rounded-xl p-2 shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary/20"
          >
            <span className="material-symbols-outlined pl-4 text-outline">search</span>
            <input
              name="q"
              type="text"
              placeholder={t("hero.searchPlaceholder")}
              className="flex-grow border-none bg-transparent py-4 text-body-md focus:ring-0"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-8 py-4 text-label-md text-on-primary transition-all hover:bg-primary-container"
            >
              {t("common.search")}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-stack-md">
            <Link
              href="/report"
              className="flex h-12 items-center rounded-lg bg-primary px-10 font-bold text-on-primary transition-all hover:shadow-lg active:scale-95"
            >
              {t("hero.startCheck")}
            </Link>
            <Link
              href="/calculators"
              className="flex h-12 items-center rounded-lg border-2 border-primary bg-white px-10 font-bold text-primary transition-all hover:bg-surface-container-low active:scale-95"
            >
              {t("hero.browse")}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-10 left-1/2 flex w-full max-w-container-max -translate-x-1/2 justify-around opacity-20">
          <span className="material-symbols-outlined text-[120px] text-primary">account_balance</span>
          <span className="material-symbols-outlined text-[120px] text-primary">payments</span>
          <span className="material-symbols-outlined text-[120px] text-primary">home_work</span>
        </div>
      </section>

      {/* Choose Region */}
      <section className="bg-surface py-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-stack-lg flex items-center justify-between">
            <h2 className="text-headline-lg text-primary">{t("home.chooseRegion")}</h2>
            <Link href="/calculators" className="text-label-md text-primary hover:underline">
              {t("home.viewAll")}
            </Link>
          </div>
          <RegionCards />
        </div>
      </section>

      {/* Browse Categories - bento grid */}
      <section className="bg-surface-container-lowest py-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <h2 className="mb-stack-lg text-headline-lg text-primary">{t("home.browseCategories")}</h2>
          <div className="grid grid-cols-2 gap-stack-md md:grid-cols-4 lg:grid-cols-6">
            <Link
              href="/calculators?category=tax-credits"
              className="group relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-stack-lg text-on-primary"
            >
              <div className="z-10">
                <span className="material-symbols-outlined mb-4 text-[40px]">payments</span>
                <h3 className="text-headline-md">{t("nav.taxCredits")}</h3>
                <p className="mt-2 text-body-md opacity-80">
                  Maximize annual returns with eligibility screening for federal credits.
                </p>
              </div>
              <span className="z-10 mt-8 w-fit rounded-lg bg-white px-4 py-2 text-label-md text-primary transition-transform group-hover:scale-105">
                {t("hero.browse")}
              </span>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 rotate-12 text-[160px] opacity-10">
                trending_up
              </span>
            </Link>

            <Link
              href="/calculators?category=property-tax"
              className="group col-span-2 flex items-center justify-between rounded-xl bg-secondary p-stack-md text-on-secondary"
            >
              <div>
                <h3 className="text-headline-md">{t("nav.propertyTax")}</h3>
                <p className="text-label-sm">Owner &amp; Renter Relief</p>
              </div>
              <span className="material-symbols-outlined text-[32px] transition-transform group-hover:translate-x-1">home</span>
            </Link>

            {SMALL_CATEGORIES.map((c) => (
              <Link
                key={c.label}
                href="/calculators"
                className="rounded-xl bg-surface-container p-stack-md transition-all hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined mb-2 text-primary">{c.icon}</span>
                <h4 className="text-label-md text-primary">{c.label}</h4>
              </Link>
            ))}

            <Link
              href="/calculators?category=salary"
              className="group col-span-2 flex items-center justify-between rounded-xl bg-tertiary-fixed p-stack-md text-on-tertiary-fixed"
            >
              <div>
                <h3 className="text-headline-md">Salary &amp; Wages</h3>
                <p className="text-label-sm">Paycheck Calculators</p>
              </div>
              <span className="material-symbols-outlined text-[32px] transition-transform group-hover:-translate-y-1">
                account_balance_wallet
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-surface-container-low py-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-stack-lg text-center">
            <h2 className="text-headline-lg text-primary">{t("home.howItWorks")}</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">From zero to eligible in four simple steps.</p>
          </div>
          <div className="relative grid grid-cols-1 gap-gutter md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-on-primary shadow-md">
                  {s.n}
                </div>
                <h4 className="mb-2 text-label-md text-primary">{s.title}</h4>
                <p className="text-label-sm text-on-surface-variant">{s.text}</p>
              </div>
            ))}
            <div className="absolute left-1/2 top-6 -z-10 hidden h-[2px] w-4/5 -translate-x-1/2 bg-outline-variant md:block" />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-surface-border py-stack-lg">
        <div className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter px-margin-mobile text-center md:grid-cols-3 md:px-margin-desktop">
          {TRUST.map((tr, i) => (
            <div key={tr.title} className={`p-stack-md ${i === 1 ? "md:border-x md:border-surface-border" : ""}`}>
              <span className="material-symbols-outlined fill mb-2 text-[40px] text-secondary">{tr.icon}</span>
              <h4 className="text-headline-md text-primary">{tr.title}</h4>
              <p className="text-label-sm text-on-surface-variant">{tr.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value proposition */}
      <section className="py-stack-lg">
        <div className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <h2 className="mb-stack-md text-headline-lg text-primary">
            Calculators and eligibility checks that tell you what you may be owed
          </h2>
          <div className="space-y-4 text-body-md leading-relaxed text-on-surface-variant">
            <p>
              OnlineCalc brings together the calculations people most often need to make about money: taxes,
              government benefits, property tax, exemptions, and take-home pay. Instead of asking you to read pages
              of legislation, each tool asks a few plain-language questions and returns a clear answer in seconds.
              No account, no sign-up, and no newsletter required.
            </p>
            <p>
              We focus first on the United States, United Kingdom, and Canada, and the platform is built to expand
              to more countries over time. Every result is region-aware: amounts use your local currency, dates
              follow your local format, and eligibility rules reflect the correct tax or benefit year.
            </p>
            <p>
              Critically, the numbers come from a deterministic rules engine - not from a guess. We use AI only to
              explain results in plain language and to translate them, never to decide whether you qualify. Every
              calculator shows the date its rules were last verified, links to the official source, states a
              confidence level, and carries a clear reminder that an estimate is not tax, legal, or financial advice.
            </p>
          </div>
        </div>
      </section>

      {/* How we calculate */}
      <section className="bg-surface-container-low py-stack-lg">
        <div className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <h2 className="mb-stack-md text-headline-lg text-primary">{t("home.howWeCalculate")}</h2>
          <p className="mb-stack-md text-body-md leading-relaxed text-on-surface-variant">
            Each calculator is built on official formulas and published figures - not rules of thumb. When a value
            appears on the site, it comes from a law, regulation, or official government publication. Here are the
            primary sources behind each region:
          </p>
          <div className="space-y-3 text-body-md text-on-surface-variant">
            <p>
              <strong className="text-primary">United States -</strong> Internal Revenue Service (income tax, Child
              Tax Credit, EITC), Social Security Administration, Medicaid.gov, and individual state tax agencies and
              county assessors for property tax and exemptions.
            </p>
            <p>
              <strong className="text-primary">United Kingdom -</strong> GOV.UK and HMRC for Income Tax, National
              Insurance, VAT, and benefits such as Universal Credit, Child Benefit, and Council Tax Reduction.
            </p>
            <p>
              <strong className="text-primary">Canada -</strong> Canada.ca and the Canada Revenue Agency for the
              Canada Child Benefit, GST/HST credit, CWB, OAS/GIS, and capital gains; provincial pages for regional
              benefits and property tax.
            </p>
          </div>
          <p className="mt-stack-md text-body-md leading-relaxed text-on-surface-variant">
            When figures change, we update the affected calculators and refresh their &quot;last verified&quot; date.
            Read more in our{" "}
            <Link href="/methodology" className="text-secondary underline">methodology &amp; editorial standards</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-stack-lg">
        <div className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <h2 className="mb-stack-md text-headline-lg text-primary">{t("home.faq")}</h2>
          <div className="flex flex-col gap-stack-sm">
            {FAQS.map((f) => (
              <details key={f.q} className="premium-card group cursor-pointer rounded-lg p-stack-md">
                <summary className="flex list-none items-center justify-between text-label-md text-primary">
                  <span>{f.q}</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-stack-sm text-body-md leading-relaxed text-on-surface-variant">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
