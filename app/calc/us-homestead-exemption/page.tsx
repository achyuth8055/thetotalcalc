"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── State data ───────────────────────────────────────────────────────────────

const STATE_DATA: Record<string, {
  name: string;
  effRate: number; // effective property tax rate %
  base: number; // base homestead exemption $
  senior: number; // additional senior (65+) exemption $
  seniorIncomeLimit: number; // 0 = no limit
  veteran: number; // veteran exemption $
  disability: number; // disability exemption $
  notes: string;
}> = {
  AL: { name: "Alabama", effRate: 0.40, base: 4000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$4,000 off assessed value for owner-occupied." },
  AK: { name: "Alaska", effRate: 1.04, base: 0, senior: 150000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "No base exemption; seniors get $150k exemption." },
  AZ: { name: "Arizona", effRate: 0.62, base: 3000, senior: 0, seniorIncomeLimit: 0, veteran: 3000, disability: 3000, notes: "Qualifying veterans and disabled get additional $3k." },
  AR: { name: "Arkansas", effRate: 0.61, base: 375, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$375 annual credit for primary residence." },
  CA: { name: "California", effRate: 0.71, base: 7000, senior: 0, seniorIncomeLimit: 0, veteran: 4000, disability: 0, notes: "Prop 19 allows seniors to transfer base year value." },
  CO: { name: "Colorado", effRate: 0.49, base: 0, senior: 200000, seniorIncomeLimit: 72000, veteran: 0, disability: 0, notes: "50% of first $400k (up to $200k) for seniors with income ≤ $72k." },
  CT: { name: "Connecticut", effRate: 1.79, base: 1000, senior: 2000, seniorIncomeLimit: 40300, veteran: 0, disability: 0, notes: "Senior exemption requires income ≤ $40,300." },
  DE: { name: "Delaware", effRate: 0.55, base: 0, senior: 500, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$500 senior credit applied at county level." },
  FL: { name: "Florida", effRate: 0.86, base: 50000, senior: 25000, seniorIncomeLimit: 35167, veteran: 5000, disability: 5000, notes: "Additional $25k senior exemption for low-income age 65+; $5k for veterans." },
  GA: { name: "Georgia", effRate: 0.87, base: 2000, senior: 10000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$10k school tax exemption for seniors 62+." },
  HI: { name: "Hawaii", effRate: 0.29, base: 100000, senior: 140000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Senior exemption increases to $140k for age 65+." },
  ID: { name: "Idaho", effRate: 0.69, base: 125000, senior: 0, seniorIncomeLimit: 37000, veteran: 0, disability: 0, notes: "Income must be ≤ $37k to qualify for base exemption." },
  IL: { name: "Illinois", effRate: 2.08, base: 10000, senior: 8000, seniorIncomeLimit: 0, veteran: 5000, disability: 0, notes: "Multiple senior freeze programs available." },
  IN: { name: "Indiana", effRate: 0.84, base: 48000, senior: 12480, seniorIncomeLimit: 30000, veteran: 14000, disability: 12480, notes: "Senior exemption requires age 65+ and income ≤ $30k." },
  IA: { name: "Iowa", effRate: 1.50, base: 4850, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead credit of up to $4,850." },
  KS: { name: "Kansas", effRate: 1.41, base: 20000, senior: 0, seniorIncomeLimit: 40000, veteran: 0, disability: 0, notes: "Income must be ≤ $40k to qualify." },
  KY: { name: "Kentucky", effRate: 0.80, base: 46350, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$46,350 exemption from assessed value." },
  LA: { name: "Louisiana", effRate: 0.55, base: 75000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$75k homestead exemption from property value." },
  ME: { name: "Maine", effRate: 1.09, base: 25000, senior: 0, seniorIncomeLimit: 0, veteran: 6000, disability: 0, notes: "$6k additional exemption for veterans." },
  MD: { name: "Maryland", effRate: 1.07, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Maryland caps annual assessment increases at 10% (Homestead Tax Credit) rather than a fixed exemption." },
  MA: { name: "Massachusetts", effRate: 1.12, base: 100000, senior: 175000, seniorIncomeLimit: 0, veteran: 400, disability: 0, notes: "Clause 41C gives seniors up to $175k exemption." },
  MI: { name: "Michigan", effRate: 1.54, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Michigan's Principal Residence Exemption caps school millage - reduces school tax portion significantly." },
  MN: { name: "Minnesota", effRate: 1.02, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead classification reduces taxable market value by up to 33%. No fixed dollar exemption." },
  MS: { name: "Mississippi", effRate: 0.65, base: 300, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$300 homestead credit off tax bill." },
  MO: { name: "Missouri", effRate: 0.93, base: 0, senior: 30000, seniorIncomeLimit: 30000, veteran: 0, disability: 0, notes: "Senior Circuit Breaker for income ≤ $30k." },
  MT: { name: "Montana", effRate: 0.74, base: 0, senior: 0, seniorIncomeLimit: 45000, veteran: 0, disability: 0, notes: "Property Tax Assistance Program for income ≤ $45k." },
  NE: { name: "Nebraska", effRate: 1.61, base: 0, senior: 0, seniorIncomeLimit: 52800, veteran: 0, disability: 0, notes: "Homestead exemption for seniors/disabled with income ≤ $52,800." },
  NV: { name: "Nevada", effRate: 0.48, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 2000, disability: 0, notes: "$2k veteran exemption off assessed value." },
  NH: { name: "New Hampshire", effRate: 2.09, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "No statewide homestead exemption; municipalities may offer local relief." },
  NJ: { name: "New Jersey", effRate: 2.21, base: 0, senior: 250, seniorIncomeLimit: 0, veteran: 250, disability: 0, notes: "$250 senior/veteran deductions from tax bill. Senior Freeze (PTR) available." },
  NM: { name: "New Mexico", effRate: 0.67, base: 2000, senior: 0, seniorIncomeLimit: 0, veteran: 4000, disability: 0, notes: "$4k additional veteran exemption." },
  NY: { name: "New York", effRate: 1.40, base: 30000, senior: 50000, seniorIncomeLimit: 93200, veteran: 5400, disability: 0, notes: "Enhanced STAR for seniors with income ≤ $93,200; Basic STAR for all." },
  NC: { name: "North Carolina", effRate: 0.80, base: 25000, senior: 50000, seniorIncomeLimit: 33800, veteran: 45000, disability: 0, notes: "Elderly/disabled exemption ($50k) with income ≤ $33,800. Disabled veterans may get full exemption." },
  ND: { name: "North Dakota", effRate: 0.98, base: 9000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$9,000 homestead exemption for primary residence." },
  OH: { name: "Ohio", effRate: 1.41, base: 25000, senior: 25000, seniorIncomeLimit: 36100, veteran: 0, disability: 0, notes: "Homestead exemption for seniors with income ≤ $36,100." },
  OK: { name: "Oklahoma", effRate: 0.85, base: 1000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$1,000 homestead exemption; additional senior freeze program available." },
  OR: { name: "Oregon", effRate: 0.82, base: 0, senior: 0, seniorIncomeLimit: 26280, veteran: 0, disability: 0, notes: "Property Tax Deferral for seniors/disabled with income ≤ $26,280." },
  PA: { name: "Pennsylvania", effRate: 1.49, base: 0, senior: 0, seniorIncomeLimit: 45000, veteran: 0, disability: 0, notes: "Homestead exclusion varies by school district; Senior Rebate for income ≤ $45k." },
  RI: { name: "Rhode Island", effRate: 1.53, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Exemptions vary by municipality - check your city/town." },
  SC: { name: "South Carolina", effRate: 0.55, base: 50000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$50k exemption for legal residence." },
  SD: { name: "South Dakota", effRate: 1.14, base: 0, senior: 0, seniorIncomeLimit: 16000, veteran: 0, disability: 0, notes: "Freeze program for low-income seniors." },
  TN: { name: "Tennessee", effRate: 0.66, base: 25000, senior: 0, seniorIncomeLimit: 43560, veteran: 0, disability: 0, notes: "Income ≤ $43,560 required for base exemption." },
  TX: { name: "Texas", effRate: 1.68, base: 100000, senior: 60000, seniorIncomeLimit: 0, veteran: 12000, disability: 12000, notes: "Additional $60k school tax exemption for age 65+; no school tax for 65+ in many districts." },
  UT: { name: "Utah", effRate: 0.57, base: 0, senior: 0, seniorIncomeLimit: 38369, veteran: 0, disability: 0, notes: "Circuit Breaker property tax credit for low-income seniors." },
  VT: { name: "Vermont", effRate: 1.83, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead declaration + income sensitivity adjustment reduces school tax." },
  VA: { name: "Virginia", effRate: 0.82, base: 0, senior: 0, seniorIncomeLimit: 75000, veteran: 0, disability: 0, notes: "Many localities offer senior/disability relief; varies significantly by jurisdiction." },
  WA: { name: "Washington", effRate: 0.84, base: 0, senior: 60000, seniorIncomeLimit: 58423, veteran: 0, disability: 0, notes: "Senior exemption for income ≤ $58,423." },
  WV: { name: "West Virginia", effRate: 0.58, base: 20000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$20,000 homestead exemption for age 65+ or disabled." },
  WI: { name: "Wisconsin", effRate: 1.61, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead Credit for low-income homeowners." },
  WY: { name: "Wyoming", effRate: 0.57, base: 0, senior: 3000, seniorIncomeLimit: 41012, veteran: 3000, disability: 0, notes: "Senior/veteran exemption for qualifying income." },
  DC: { name: "Washington D.C.", effRate: 0.56, base: 84550, senior: 50000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$84,550 base; additional senior exemption for age 65+." },
};

// ─── Sorted state list ────────────────────────────────────────────────────────

const STATE_LIST = Object.entries(STATE_DATA)
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

type ProgramStatus = "qualifies" | "check_income" | "not_eligible";

interface Program {
  name: string;
  status: ProgramStatus;
  exemption: number;
  reason: string;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HomesteadExemptionPage() {
  const [stateCode, setStateCode] = useState("FL");
  const [primaryResidence, setPrimaryResidence] = useState(true);
  const [age, setAge] = useState(45);
  const [isVeteran, setIsVeteran] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [income, setIncome] = useState(50000);
  const [homeValue, setHomeValue] = useState(300000);

  const stateData = STATE_DATA[stateCode];
  const stateName = stateData.name;

  const programs = useMemo<Program[]>(() => {
    const list: Program[] = [];

    if (primaryResidence && stateData.base > 0) {
      list.push({
        name: "Base Homestead Exemption",
        status: "qualifies",
        exemption: stateData.base,
        reason: `${stateName} offers a ${fmt(stateData.base)} exemption for primary residences.`,
      });
    }

    if (age >= 65 && stateData.senior > 0) {
      const incomeOk = stateData.seniorIncomeLimit === 0 || income <= stateData.seniorIncomeLimit;
      list.push({
        name: "Senior Homeowner Exemption (Age 65+)",
        status: incomeOk ? "qualifies" : "check_income",
        exemption: incomeOk ? stateData.senior : 0,
        reason: incomeOk
          ? `Additional ${fmt(stateData.senior)} exemption for homeowners age 65+.`
          : `Your state offers this but income limit is ${fmt(stateData.seniorIncomeLimit)}. Your entered income is ${fmt(income)}.`,
      });
    }

    if (isVeteran && stateData.veteran > 0) {
      list.push({
        name: "Veteran / Military Exemption",
        status: "qualifies",
        exemption: stateData.veteran,
        reason: `${stateName} provides a ${fmt(stateData.veteran)} exemption for qualifying veterans and active military.`,
      });
    }

    if (hasDisability && stateData.disability > 0) {
      list.push({
        name: "Disability Exemption",
        status: "qualifies",
        exemption: stateData.disability,
        reason: `${stateName} provides a ${fmt(stateData.disability)} exemption for homeowners with a qualifying disability.`,
      });
    }

    if (!primaryResidence) {
      list.push({
        name: "Homestead Exemption",
        status: "not_eligible",
        exemption: 0,
        reason: "Homestead exemptions require the property to be your primary residence.",
      });
    }

    return list;
  }, [stateCode, primaryResidence, age, isVeteran, hasDisability, income, homeValue, stateData, stateName]);

  const { totalExemption, annualSavings } = useMemo(() => {
    const total = programs
      .filter((p) => p.status === "qualifies")
      .reduce((sum, p) => sum + p.exemption, 0);
    const savings = Math.min(total, homeValue) * stateData.effRate / 100;
    return { totalExemption: total, annualSavings: savings };
  }, [programs, homeValue, stateData.effRate]);

  const hasSavings = annualSavings > 0;

  // ── Shared input class ──
  const inputCls =
    "w-full rounded-lg border border-surface-border bg-white p-3 text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-surface-border bg-surface-container-low pb-stack-lg pt-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <nav className="mb-stack-md" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-stack-sm text-label-sm text-on-surface-variant">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">Home</Link>
              </li>
              <li aria-hidden="true" className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li>
                <Link href="/calculators" className="transition-colors hover:text-primary">Calculators</Link>
              </li>
              <li aria-hidden="true" className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li className="font-bold text-primary">Homestead Exemption Checker</li>
            </ol>
          </nav>
          <h1 className="mb-unit text-headline-lg text-primary">Homestead Exemption Checker</h1>
          <p className="max-w-3xl text-body-md text-on-surface-variant">
            Answer a few questions to see which property tax exemptions you likely qualify for in your state - including senior, veteran, and disability programs.
          </p>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-margin-mobile py-stack-lg md:px-margin-desktop">

        {/* ── Single card: inputs + results ─────────────────────────────────── */}
        <div className="premium-card relative overflow-hidden rounded-xl bg-white p-stack-lg">
          <div className="summary-accent absolute left-0 right-0 top-0" />

          <h2 className="mb-stack-lg text-headline-md text-primary">Your Property &amp; Profile</h2>

          {/* ── Inputs ──────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-stack-md">

            {/* State */}
            <div className="flex flex-col gap-unit">
              <label htmlFor="state-select" className="text-label-md text-primary">State</label>
              <select
                id="state-select"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className={inputCls}
              >
                {STATE_LIST.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Primary residence */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border p-stack-md">
              <input
                type="checkbox"
                checked={primaryResidence}
                onChange={(e) => setPrimaryResidence(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-surface-border text-primary focus:ring-primary"
              />
              <span>
                <span className="text-label-md text-primary">Is this your primary residence?</span>
                <span className="mt-0.5 block text-label-sm text-on-surface-variant">
                  Homestead exemptions only apply to your main home.
                </span>
              </span>
            </label>

            {/* Age */}
            <div className="flex flex-col gap-unit">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="age-input" className="text-label-md text-primary">Your age</label>
                <input
                  id="age-input"
                  type="number"
                  min={18}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(Math.min(100, Math.max(18, Number(e.target.value) || 18)))}
                  className="w-28 rounded-lg border border-surface-border bg-white px-3 py-2 text-right text-label-md font-semibold text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="text-label-sm text-on-surface-variant">Age 65+ qualifies for senior exemptions.</p>
            </div>

            {/* Veteran */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border p-stack-md">
              <input
                type="checkbox"
                checked={isVeteran}
                onChange={(e) => setIsVeteran(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-surface-border text-primary focus:ring-primary"
              />
              <span className="text-label-md text-primary">Are you a veteran or active military?</span>
            </label>

            {/* Disability */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border p-stack-md">
              <input
                type="checkbox"
                checked={hasDisability}
                onChange={(e) => setHasDisability(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-surface-border text-primary focus:ring-primary"
              />
              <span className="text-label-md text-primary">Do you have a qualifying disability?</span>
            </label>

            {/* Annual household income */}
            <div className="flex flex-col gap-unit">
              <label htmlFor="income-input" className="text-label-md text-primary">Annual household income</label>
              <input
                id="income-input"
                type="number"
                min={0}
                step={1000}
                value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                className={inputCls}
              />
              <p className="text-label-sm text-on-surface-variant">Required for income-limited programs.</p>
            </div>

            {/* Estimated home value */}
            <div className="flex flex-col gap-unit">
              <label htmlFor="home-value-input" className="text-label-md text-primary">Estimated home value</label>
              <input
                id="home-value-input"
                type="number"
                min={0}
                step={5000}
                value={homeValue}
                onChange={(e) => setHomeValue(Math.max(0, Number(e.target.value) || 0))}
                className={inputCls}
              />
              <p className="text-label-sm text-on-surface-variant">Used to estimate your tax savings.</p>
            </div>
          </div>

          {/* ── Results ─────────────────────────────────────────────────────── */}
          <div className="mt-stack-lg border-t border-surface-border pt-stack-lg">

            {/* Summary card */}
            {hasSavings ? (
              <div className="mb-stack-md rounded-xl border-2 border-green-200 bg-green-50 p-stack-md text-center">
                <p className="text-label-sm text-on-surface-variant">Estimated Annual Savings</p>
                <p className="text-headline-lg text-green-700">{fmt(annualSavings)}</p>
                <p className="mt-unit text-label-sm text-on-surface-variant">
                  Total exemption: {fmt(totalExemption)} &nbsp;|&nbsp; State effective rate: {stateData.effRate.toFixed(2)}%
                </p>
              </div>
            ) : (
              <div className="mb-stack-md rounded-xl border-2 border-surface-border bg-surface-container-low p-stack-md text-center">
                <p className="text-headline-md text-primary">No standard homestead exemption in your state</p>
                <p className="mt-unit text-body-md text-on-surface-variant">
                  {stateName} may offer other forms of property tax relief - see the state notes below.
                </p>
              </div>
            )}

            {/* Program list */}
            {programs.length > 0 && (
              <div className="flex flex-col gap-stack-sm">
                {programs.map((prog) => (
                  <ProgramCard key={prog.name} program={prog} />
                ))}
              </div>
            )}

            {/* State notes */}
            <div className="mt-stack-md rounded-lg bg-surface-container-low p-stack-md">
              <p className="mb-unit text-label-md text-primary">{stateName} - State Notes</p>
              <p className="text-body-md text-on-surface-variant">{stateData.notes}</p>
            </div>
          </div>
        </div>

        {/* ── How to Apply ──────────────────────────────────────────────────── */}
        <section className="mt-stack-lg">
          <h2 className="mb-stack-md text-headline-md text-primary">How to Apply</h2>
          <div className="premium-card rounded-xl bg-white p-stack-lg">
            <ol className="flex flex-col gap-stack-md">
              {[
                "Contact your county assessor's office to obtain the homestead exemption application.",
                "Submit your application with the required supporting documents.",
                "Typical deadline: April 1 (varies by state - check with your local assessor).",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-stack-sm">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-label-sm font-bold text-on-primary">
                    {i + 1}
                  </span>
                  <span className="text-body-md text-on-surface-variant">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-stack-md border-t border-surface-border pt-stack-md">
              <p className="mb-stack-sm text-label-md text-primary">Documents typically needed</p>
              <ul className="flex flex-col gap-unit text-body-md text-on-surface-variant">
                <li className="flex items-start gap-unit">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  Proof of primary residence (utility bill, driver&apos;s license)
                </li>
                <li className="flex items-start gap-unit">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  Deed or property tax bill
                </li>
                <li className="flex items-start gap-unit">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  Government-issued ID showing property address
                </li>
                {age >= 65 && (
                  <li className="flex items-start gap-unit">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    Proof of age (passport, birth certificate)
                  </li>
                )}
                {isVeteran && (
                  <li className="flex items-start gap-unit">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    DD-214 discharge document (veterans)
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQs ─────────────────────────────────────────────────────────── */}
        <section className="mt-stack-lg flex flex-col gap-stack-md">
          <h2 className="text-headline-md text-primary">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-stack-sm">
            {FAQS.map((faq) => (
              <details key={faq.q} className="premium-card group cursor-pointer rounded-lg p-stack-md">
                <summary className="flex list-none items-center justify-between text-label-md text-primary">
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined flex-shrink-0 transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <p className="mt-stack-sm text-body-md text-on-surface-variant">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────────────────────── */}
        <p className="mt-stack-lg rounded-lg border border-surface-border bg-surface-container-low px-stack-md py-stack-sm text-label-sm text-on-surface-variant">
          <strong className="text-primary">Disclaimer:</strong> This is an estimate based on statewide averages. Actual exemption amounts and eligibility rules are set by your county/city assessor. Apply directly with your local government.
        </p>
      </main>
    </>
  );
}

// ─── ProgramCard component ────────────────────────────────────────────────────

function ProgramCard({ program }: { program: Program }) {
  const badgeConfig: Record<ProgramStatus, { cls: string; label: string }> = {
    qualifies: {
      cls: "bg-green-100 text-green-800 border border-green-200",
      label: "✓ Likely Qualify",
    },
    check_income: {
      cls: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      label: "⚠ Check Income Limit",
    },
    not_eligible: {
      cls: "bg-surface-container text-on-surface-variant border border-surface-border",
      label: "✗ Does Not Apply",
    },
  };

  const { cls, label } = badgeConfig[program.status];
  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="rounded-lg border border-surface-border bg-white p-stack-md">
      <div className="flex flex-wrap items-start justify-between gap-stack-sm">
        <p className="text-label-md text-primary">{program.name}</p>
        <span className={`rounded-full px-3 py-0.5 text-label-sm font-semibold ${cls}`}>{label}</span>
      </div>
      {program.exemption > 0 && (
        <p className="mt-unit text-body-md text-on-surface-variant">
          Exemption amount: <span className="font-semibold text-primary">{fmt(program.exemption)}</span>
        </p>
      )}
      <p className="mt-unit text-label-sm text-on-surface-variant">{program.reason}</p>
    </div>
  );
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is a homestead exemption?",
    a: "A homestead exemption reduces the taxable value of your primary residence, lowering your annual property tax bill. Most states offer a base exemption for all qualifying homeowners, with additional exemptions for seniors, veterans, and disabled individuals.",
  },
  {
    q: "Do I need to apply every year?",
    a: "In most states, you apply once and the exemption automatically renews each year as long as you remain eligible. However, some states require annual renewal or periodic recertification. Check with your county assessor for your state's specific rules.",
  },
  {
    q: "What if my state isn't showing an exemption?",
    a: "Some states - like Michigan, Minnesota, and Vermont - provide property tax relief through percentage reductions or caps on assessment increases rather than a fixed dollar exemption. Others have income-based programs that may still provide significant savings. Always check with your local assessor's office.",
  },
  {
    q: "Can I claim multiple exemptions?",
    a: "Yes. In many states, qualifying homeowners can stack multiple exemptions. For example, a 65+ veteran with a disability in Texas can receive the base homestead exemption, the senior school tax exemption, and the veteran exemption, significantly reducing their tax bill.",
  },
];
