"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from "recharts";

type FilingStatus = "single" | "mfj";
type CoverageType = "partb" | "partb_partd" | "advantage";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

// 2025 IRMAA brackets for Part B
// Single thresholds; MFJ thresholds are double
const IRMAA_BRACKETS: { singleThreshold: number; surcharge: number }[] = [
  { singleThreshold: 0, surcharge: 0 },         // base: $185/mo
  { singleThreshold: 106000, surcharge: 74.90 },
  { singleThreshold: 133000, surcharge: 187.20 },
  { singleThreshold: 167000, surcharge: 299.40 },
  { singleThreshold: 200000, surcharge: 411.60 },
  { singleThreshold: 500000, surcharge: 503.50 },
];

const IRMAA_PARTD_BRACKETS: { singleThreshold: number; surcharge: number }[] = [
  { singleThreshold: 0, surcharge: 0 },
  { singleThreshold: 106000, surcharge: 12.90 },
  { singleThreshold: 133000, surcharge: 33.30 },
  { singleThreshold: 167000, surcharge: 53.80 },
  { singleThreshold: 200000, surcharge: 74.20 },
  { singleThreshold: 500000, surcharge: 81.00 },
];

function getIRMAA(income: number, filingStatus: FilingStatus, brackets: typeof IRMAA_BRACKETS): number {
  const threshold = filingStatus === "mfj" ? 2 : 1;
  let surcharge = 0;
  for (const bracket of brackets) {
    const adjustedThreshold = bracket.singleThreshold * threshold;
    if (income > adjustedThreshold) {
      surcharge = bracket.surcharge;
    }
  }
  return surcharge;
}

export default function MedicareCostCalculator() {
  const [age, setAge] = useState(67);
  const [hasDisability, setHasDisability] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [coverageType, setCoverageType] = useState<CoverageType>("partb_partd");
  const [workQuarters, setWorkQuarters] = useState<"40plus" | "30to39" | "under30">("40plus");

  const [result, setResult] = useState<{
    partAPremium: number;
    partBBase: number;
    partBIRMAA: number;
    partBTotal: number;
    partDBase: number;
    partDIRMAA: number;
    partDTotal: number;
    advantagePremium: number;
    monthlyTotal: number;
    annualPremiums: number;
    annualOutOfPocket: number;
    irmaaSurcharge: boolean;
    eligible: boolean;
    eligibilityNote: string;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["medicare", ...recent.filter((id: string) => id !== "medicare")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [age, hasDisability, annualIncome, filingStatus, coverageType, workQuarters]);

  const calculate = () => {
    const eligible = age >= 65 || hasDisability;
    const eligibilityNote = !eligible
      ? "You must be 65+ or have a qualifying disability to enroll in Medicare."
      : age >= 65
      ? "You are eligible for Medicare based on age (65+)."
      : "You may be eligible for Medicare based on disability status.";

    if (!eligible) {
      setResult({
        partAPremium: 0, partBBase: 0, partBIRMAA: 0, partBTotal: 0,
        partDBase: 0, partDIRMAA: 0, partDTotal: 0, advantagePremium: 0,
        monthlyTotal: 0, annualPremiums: 0, annualOutOfPocket: 0,
        irmaaSurcharge: false, eligible: false, eligibilityNote,
      });
      return;
    }

    // Part A
    const partAPremium =
      workQuarters === "40plus" ? 0 :
      workQuarters === "30to39" ? 284 : // reduced premium
      518; // full premium 2025

    // Part B
    const partBBase = 185.00;
    const partBIRMAA = getIRMAA(annualIncome, filingStatus, IRMAA_BRACKETS);
    const partBTotal = partBBase + partBIRMAA;

    // Part D
    const partDBase = 47.50; // 2025 national avg
    const partDIRMAA = getIRMAA(annualIncome, filingStatus, IRMAA_PARTD_BRACKETS);
    const partDTotal = partDBase + partDIRMAA;

    // Medicare Advantage (Part C)
    const advantagePremium = 17.00; // 2025 avg, still requires Part B

    const irmaaSurcharge = partBIRMAA > 0;

    let monthlyTotal = 0;
    let annualOutOfPocket = 0;

    if (coverageType === "partb") {
      monthlyTotal = partAPremium + partBTotal;
      // Part B deductible $257/yr, Part A deductible $1,676/benefit period (2 periods avg = ~$3,352/yr estimate)
      annualOutOfPocket = 257 + 3352;
    } else if (coverageType === "partb_partd") {
      monthlyTotal = partAPremium + partBTotal + partDTotal;
      annualOutOfPocket = 257 + 3352 + 325; // Part D deductible avg
    } else if (coverageType === "advantage") {
      // Advantage replaces Part B+D but Part B premium still required
      monthlyTotal = partAPremium + partBTotal + advantagePremium;
      annualOutOfPocket = 3000; // avg MA OOP estimate
    }

    const annualPremiums = monthlyTotal * 12;

    setResult({
      partAPremium, partBBase, partBIRMAA, partBTotal,
      partDBase, partDIRMAA, partDTotal, advantagePremium,
      monthlyTotal, annualPremiums,
      annualOutOfPocket: annualPremiums + annualOutOfPocket,
      irmaaSurcharge, eligible, eligibilityNote,
    });
  };

  const coverageOptions: { key: CoverageType; label: string; desc: string }[] = [
    { key: "partb", label: "Part A + Part B", desc: "Hospital + Medical (no drug coverage)" },
    { key: "partb_partd", label: "Part A + B + D", desc: "Hospital + Medical + Prescription drugs" },
    { key: "advantage", label: "Medicare Advantage", desc: "Part C: bundled coverage via private insurer" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Medicare Cost Calculator", href: "/calculators/finance/medicare-cost-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicare Cost Calculator</h1>
        <p className="text-base text-gray-600">Estimate your 2025 Medicare premiums including IRMAA income-based surcharges</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {/* Age */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Age</label>
              <input type="number" value={age} min={0} max={110}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <input type="range" min={55} max={90} step={1} value={Math.min(90, Math.max(55, age))}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          {/* Disability */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="disability" checked={hasDisability}
              onChange={(e) => setHasDisability(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded" />
            <label htmlFor="disability" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Under 65 with qualifying disability (SSDI 24+ months)
            </label>
          </div>

          {/* Work Quarters (Part A) */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Work History (affects Part A premium)</label>
            <div className="space-y-2">
              {([
                { key: "40plus", label: "40+ work quarters", sub: "Part A: FREE (most people)" },
                { key: "30to39", label: "30–39 work quarters", sub: "Part A: $284/mo" },
                { key: "under30", label: "Under 30 quarters", sub: "Part A: $518/mo" },
              ] as const).map(({ key, label, sub }) => (
                <button key={key} onClick={() => setWorkQuarters(key)}
                  className={`w-full py-2 px-3 rounded-lg text-sm border transition-colors text-left ${workQuarters === key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  <span className="font-medium">{label}</span>
                  <span className={`ml-2 text-xs ${workQuarters === key ? "text-blue-100" : "text-gray-400"}`}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Income */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Annual Income (2 years ago)</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={600000} step={5000} value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <p className="text-xs text-gray-400 mt-1">IRMAA surcharges are based on MAGI from 2 years prior</p>
          </div>

          {/* Filing Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Filing Status</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "single", label: "Single / MFS" },
                { key: "mfj", label: "Married Filing Jointly" },
              ] as const).map(({ key, label }) => (
                <button key={key} onClick={() => setFilingStatus(key)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${filingStatus === key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Coverage Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Coverage Type</label>
            <div className="space-y-2">
              {coverageOptions.map(({ key, label, desc }) => (
                <button key={key} onClick={() => setCoverageType(key)}
                  className={`w-full py-2 px-3 rounded-lg text-sm border transition-colors text-left ${coverageType === key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  <span className="font-medium">{label}</span>
                  <span className={`ml-2 text-xs ${coverageType === key ? "text-blue-100" : "text-gray-400"}`}>{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result && !result.eligible && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-yellow-700 mb-2">Not Yet Eligible</div>
              <p className="text-sm text-gray-600">{result.eligibilityNote}</p>
              <p className="text-xs text-gray-500 mt-2">Medicare eligibility typically begins at age 65 or after 24 months of receiving SSDI.</p>
            </div>
          )}

          {result && result.eligible && (
            <>
              {result.irmaaSurcharge && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-orange-800">IRMAA Surcharge Applies</p>
                  <p className="text-xs text-orange-700">Your income exceeds the IRMAA threshold. You pay higher Part B (and Part D if applicable) premiums. IRMAA is based on your MAGI from 2 years ago.</p>
                </div>
              )}

              {/* Total Monthly */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Estimated Monthly Premium</div>
                <div className="text-4xl font-bold text-blue-600">{fmtD(result.monthlyTotal)}</div>
                <div className="text-sm text-gray-500 mt-1">({fmt(result.annualPremiums)}/year in premiums)</div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 space-y-2">
                <div className="text-sm font-semibold text-gray-700 mb-3">Monthly Premium Breakdown</div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-700 font-medium">Part A (Hospital)</span>
                    <span className="text-xs text-gray-400 ml-2">inpatient, hospice, SNF</span>
                  </div>
                  <span className={`text-sm font-bold ${result.partAPremium === 0 ? "text-green-600" : "text-gray-800"}`}>
                    {result.partAPremium === 0 ? "FREE" : fmtD(result.partAPremium)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-700 font-medium">Part B (Medical)</span>
                    {result.partBIRMAA > 0 && <span className="text-xs text-orange-500 ml-2">+IRMAA {fmtD(result.partBIRMAA)}</span>}
                  </div>
                  <span className="text-sm font-bold text-gray-800">{fmtD(result.partBTotal)}</span>
                </div>

                {coverageType === "partb_partd" && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Part D (Drugs)</span>
                      {result.partDIRMAA > 0 && <span className="text-xs text-orange-500 ml-2">+IRMAA {fmtD(result.partDIRMAA)}</span>}
                    </div>
                    <span className="text-sm font-bold text-gray-800">{fmtD(result.partDTotal)}</span>
                  </div>
                )}

                {coverageType === "advantage" && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700 font-medium">Medicare Advantage Plan</span>
                    <span className="text-sm font-bold text-gray-800">{fmtD(result.advantagePremium)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 font-semibold">
                  <span className="text-sm text-gray-800">Monthly Total</span>
                  <span className="text-base text-blue-600">{fmtD(result.monthlyTotal)}</span>
                </div>
              </div>

              {/* Annual estimate */}
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-700 mb-3">Annual Cost Estimate</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Annual Premiums</span>
                    <span className="font-semibold text-gray-800">{fmt(result.annualPremiums)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deductibles &amp; Cost-Sharing (est.)</span>
                    <span className="font-semibold text-gray-800">{fmt(result.annualOutOfPocket - result.annualPremiums)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2 mt-2">
                    <span className="font-semibold text-gray-800">Total Annual Estimate</span>
                    <span className="font-bold text-blue-600">{fmt(result.annualOutOfPocket)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Deductibles include: Part B {fmt(257)}/yr, Part A {fmt(1676)}/benefit period. Actual costs vary by usage.</p>
              </div>

              {/* Key Facts */}
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                <p><strong>Part B deductible:</strong> $257/year (2025)</p>
                <p><strong>Part A deductible:</strong> $1,676 per benefit period (not per year)</p>
                {coverageType === "advantage" && <p><strong>Medicare Advantage:</strong> avg $17/mo plan premium + required Part B premium. Plans have an annual OOP maximum (avg ~$3,000–$8,000).</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {result && result.eligible && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Part B Premiums by Income Bracket</h3>
            <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { bracket: "≤$106k", premium: 185.00, threshold: 0 },
                { bracket: "$106-133k", premium: 185.00 + 74.90, threshold: 106000 },
                { bracket: "$133-167k", premium: 185.00 + 187.20, threshold: 133000 },
                { bracket: "$167-200k", premium: 185.00 + 299.40, threshold: 167000 },
                { bracket: "$200-500k", premium: 185.00 + 411.60, threshold: 200000 },
                { bracket: ">$500k", premium: 185.00 + 503.50, threshold: 500000 },
              ].map((d) => ({
                ...d,
                isUser: (() => {
                  const thresholdMult = filingStatus === "mfj" ? 2 : 1;
                  const userBracketIdx = IRMAA_BRACKETS.reduce((acc, b, i) => {
                    return annualIncome > b.singleThreshold * thresholdMult ? i : acc;
                  }, 0);
                  const bracketIdx = [0, 106000, 133000, 167000, 200000, 500000].indexOf(d.threshold);
                  return bracketIdx === userBracketIdx;
                })(),
              }))}
              margin={{ top: 5, right: 10, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bracket" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}/mo`, "Part B Premium"]} />
              <Bar dataKey="premium" radius={[4, 4, 0, 0]}>
                {[
                  { bracket: "≤$106k", threshold: 0 },
                  { bracket: "$106-133k", threshold: 106000 },
                  { bracket: "$133-167k", threshold: 133000 },
                  { bracket: "$167-200k", threshold: 167000 },
                  { bracket: "$200-500k", threshold: 200000 },
                  { bracket: ">$500k", threshold: 500000 },
                ].map((d) => {
                  const thresholdMult = filingStatus === "mfj" ? 2 : 1;
                  const userBracketIdx = IRMAA_BRACKETS.reduce((acc, b, i) => {
                    return annualIncome > b.singleThreshold * thresholdMult ? i : acc;
                  }, 0);
                  const bracketIdx = [0, 106000, 133000, 167000, 200000, 500000].indexOf(d.threshold);
                  return <Cell key={d.bracket} fill={bracketIdx === userBracketIdx ? "#3b82f6" : "#cbd5e1"} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-1 text-center">Blue bar = your current bracket. Single filer thresholds shown; MFJ limits are double.</p>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Part A (Hospital Insurance):</strong> Covers inpatient hospital stays, skilled nursing facility care, hospice, and some home health care. Most people pay $0 premium if they (or their spouse) worked 40+ quarters.</p>
            <p><strong>Part B (Medical Insurance):</strong> Covers doctor visits, outpatient care, preventive services, and durable medical equipment. The standard 2025 premium is $185/month, but higher-income beneficiaries pay an IRMAA surcharge.</p>
            <p><strong>IRMAA (Income Related Monthly Adjustment Amount):</strong> Higher-income Medicare beneficiaries pay more for Part B and Part D. IRMAA is based on your MAGI from 2 years prior to enrollment.</p>
            <p><strong>Medicare Advantage (Part C):</strong> Private plans that bundle Part A, B, and usually D. Often has lower monthly premiums but may have network restrictions and different cost-sharing.</p>
          </div>
        }
        faqs={[
          { question: "When should I enroll in Medicare?", answer: "Your Initial Enrollment Period starts 3 months before your 65th birthday and ends 3 months after. Missing this window may result in late enrollment penalties - 10% per year for Part B, 1% per month for Part D." },
          { question: "What is the Medicare late enrollment penalty?", answer: "Part B: 10% added to your premium for each full 12-month period you were eligible but didn't enroll. Part D: 1% of the national base beneficiary premium per month you went without creditable coverage." },
          { question: "Can I use an HSA with Medicare?", answer: "Once you enroll in any part of Medicare, you can no longer contribute to an HSA (Health Savings Account). However, you can continue to spend existing HSA funds on Medicare premiums and medical expenses." },
          { question: "What is Medigap (Medicare Supplement)?", answer: "Medigap policies sold by private insurers help cover costs that Original Medicare doesn't cover - deductibles, copayments, and coinsurance. They cannot be used alongside Medicare Advantage plans." },
        ]}
        relatedCalculators={[
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
