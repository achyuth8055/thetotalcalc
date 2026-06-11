"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const QUARTERLY_DATES = [
  { q: "Q1", due: "April 15, 2025" },
  { q: "Q2", due: "June 16, 2025" },
  { q: "Q3", due: "September 15, 2025" },
  { q: "Q4", due: "January 15, 2026" },
];

// 2025 federal tax brackets
const BRACKETS_SINGLE = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];
const BRACKETS_MFJ = [
  { min: 0, max: 23850, rate: 0.10 },
  { min: 23850, max: 96950, rate: 0.12 },
  { min: 96950, max: 206700, rate: 0.22 },
  { min: 206700, max: 394600, rate: 0.24 },
  { min: 394600, max: 501050, rate: 0.32 },
  { min: 501050, max: 751600, rate: 0.35 },
  { min: 751600, max: Infinity, rate: 0.37 },
];
const STD_DEDUCTION = { single: 15750, mfj: 31500 };
const SS_WAGE_BASE = 176100;

function calcFederalTax(taxableIncome: number, filing: "single" | "mfj"): number {
  const brackets = filing === "single" ? BRACKETS_SINGLE : BRACKETS_MFJ;
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    tax += (Math.min(taxableIncome, b.max) - b.min) * b.rate;
  }
  return Math.max(0, tax);
}

export default function FreelanceTaxCalculator() {
  const [freelanceIncome, setFreelanceIncome] = useState(75000);
  const [w2Income, setW2Income] = useState(0);
  const [businessExpenses, setBusinessExpenses] = useState(8000);
  const [retirementContrib, setRetirementContrib] = useState(10000);
  const [filingStatus, setFilingStatus] = useState<"single" | "mfj">("single");
  const [stateTaxRate, setStateTaxRate] = useState(5);

  const [result, setResult] = useState<{
    netSEIncome: number;
    seTax: number;
    deductibleSETax: number;
    agi: number;
    federalTax: number;
    stateTax: number;
    totalTax: number;
    effectiveRate: number;
    quarterlyPayment: number;
    setAsidePct: number;
    maxRetirement: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["freelance-tax", ...recent.filter((id: string) => id !== "freelance-tax")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [freelanceIncome, w2Income, businessExpenses, retirementContrib, filingStatus, stateTaxRate]);

  const calculate = () => {
    const netProfit = Math.max(0, freelanceIncome - businessExpenses);

    // Max retirement contribution = 25% of net profit (after SE tax deduction)
    // Simplified: 20% of net profit for SEP-IRA (more accurate approximation)
    const maxRetirement = Math.min(retirementContrib, Math.floor(netProfit * 0.25));
    const effectiveRetirement = Math.min(retirementContrib, maxRetirement);

    // SE tax calculation with SS wage base cap
    const seNetIncome = netProfit * 0.9235;
    const ssTaxable = Math.min(seNetIncome, SS_WAGE_BASE);
    const medicareTaxable = seNetIncome;
    const ssTax = ssTaxable * 0.124; // 12.4% SS (both halves)
    const medicareTax = medicareTaxable * 0.029; // 2.9% Medicare (both halves)
    const seTax = ssTax + medicareTax;

    const deductibleSETax = seTax / 2;

    const grossIncome = freelanceIncome + w2Income;
    const agi = Math.max(0, netProfit + w2Income - deductibleSETax - effectiveRetirement);

    const stdDeduction = filingStatus === "single" ? STD_DEDUCTION.single : STD_DEDUCTION.mfj;
    const taxableIncome = Math.max(0, agi - stdDeduction);

    const federalTax = calcFederalTax(taxableIncome, filingStatus);
    const stateTax = agi * (stateTaxRate / 100);
    const totalTax = federalTax + stateTax + seTax;
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
    const quarterlyPayment = totalTax / 4;
    const setAsidePct = grossIncome > 0 ? Math.ceil((totalTax / grossIncome) * 100) : 0;

    setResult({
      netSEIncome: netProfit,
      seTax,
      deductibleSETax,
      agi,
      federalTax,
      stateTax,
      totalTax,
      effectiveRate,
      quarterlyPayment,
      setAsidePct,
      maxRetirement,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Freelance Tax Calculator", href: "/calculators/finance/freelance-tax-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelance / 1099 Tax Calculator</h1>
        <p className="text-base text-gray-600">Estimate self-employment taxes, quarterly payments, and your effective rate (2025)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {/* Filing Status */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Filing Status</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {([["single", "Single"], ["mfj", "Married Filing Jointly"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => setFilingStatus(val)}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${filingStatus === val ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {[
            { label: "Annual Freelance Income", value: freelanceIncome, set: setFreelanceIncome, min: 0, max: 500000, step: 1000, color: "green", prefix: "$" },
            { label: "Other W-2 Income", value: w2Income, set: setW2Income, min: 0, max: 500000, step: 1000, color: "blue", prefix: "$" },
            { label: "Business Expenses (deductible)", value: businessExpenses, set: setBusinessExpenses, min: 0, max: 100000, step: 500, color: "orange", prefix: "$" },
            { label: "Retirement Contribution (SEP-IRA / Solo 401k)", value: retirementContrib, set: setRetirementContrib, min: 0, max: 69000, step: 500, color: "purple", prefix: "$" },
          ].map(({ label, value, set, min, max, step, color, prefix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-xs text-gray-500">{prefix}</span>}
                  <input type="number" value={value} min={min} max={max} step={step}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-24 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-${color}-600 focus:ring-1 focus:ring-${color}-500 focus:border-transparent`} />
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}

          {/* State Tax Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">State Income Tax Rate</label>
              <div className="flex items-center gap-1">
                <input type="number" value={stateTaxRate} min={0} max={15} step={0.1}
                  onChange={(e) => setStateTaxRate(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-red-600 focus:ring-1 focus:ring-red-500 focus:border-transparent" />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <input type="range" min={0} max={15} step={0.5} value={stateTaxRate}
              onChange={(e) => setStateTaxRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
            <p className="text-xs text-gray-400 mt-1">0% for TX, FL, NV, WA, SD, WY, AK • ~9-13% for CA, NJ, NY</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Total Tax Owed</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.totalTax)}</div>
                <div className="text-xs text-gray-500 mt-1">Effective rate: {result.effectiveRate.toFixed(1)}%</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-xs text-gray-600 font-semibold mb-1">Estimated Quarterly Payments</div>
                <div className="text-xl font-bold text-amber-700">{fmt(result.quarterlyPayment)} per quarter</div>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {QUARTERLY_DATES.map(({ q, due }) => (
                    <div key={q} className="text-xs text-gray-500">{q}: <span className="font-medium text-gray-700">{due}</span></div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Self-Employment Tax</div>
                  <div className="font-bold text-red-600 text-sm">{fmt(result.seTax)}</div>
                  <div className="text-xs text-gray-400">SS + Medicare</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Federal Income Tax</div>
                  <div className="font-bold text-blue-700 text-sm">{fmt(result.federalTax)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">State Tax (est.)</div>
                  <div className="font-bold text-orange-600 text-sm">{fmt(result.stateTax)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Adjusted Gross Income</div>
                  <div className="font-bold text-purple-600 text-sm">{fmt(result.agi)}</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 space-y-1">
                <p className="font-semibold">Savings Tip</p>
                <p>Set aside <span className="font-bold">{result.setAsidePct}%</span> of every payment you receive to cover taxes.</p>
                {result.maxRetirement > 0 && retirementContrib > result.maxRetirement && (
                  <p className="text-amber-700 font-medium mt-1">Retirement contribution capped at {fmt(result.maxRetirement)} (25% of net earnings).</p>
                )}
              </div>

              <div className="text-xs text-gray-400 border-t pt-2">
                <p>SE tax deduction: {fmt(result.deductibleSETax)} | Net profit: {fmt(result.netSEIncome)}</p>
                <p>2025 SS wage base: {fmt(SS_WAGE_BASE)} | Std deduction: {fmt(filingStatus === "single" ? 15750 : 31500)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout title="" description=""
        explanation={
          <div>
            <p className="mb-2">As a freelancer or 1099 contractor, you pay self-employment (SE) tax on top of regular income tax. SE tax covers both the employee and employer portions of Social Security (12.4%) and Medicare (2.9%), totaling 15.3% on 92.35% of net earnings.</p>
            <p className="mb-2">The good news: you can deduct half of SE tax from your income, reducing your AGI. Business expenses, retirement contributions (SEP-IRA up to 25% of net earnings, or Solo 401k), and the standard deduction all help lower your taxable income.</p>
            <p className="text-xs text-gray-500 mt-2">Based on 2025 tax brackets and limits. This is an estimate — consult a CPA for your specific situation.</p>
          </div>
        }
        faqs={[
          { question: "What is self-employment tax?", answer: "SE tax is 15.3% of your net self-employment income (after business expenses). It covers Social Security (12.4%) and Medicare (2.9%). Employees only pay half (7.65%) because employers pay the other half — freelancers pay both." },
          { question: "How do I pay quarterly taxes?", answer: "Use IRS Form 1040-ES to estimate and pay quarterly. Due dates are typically April 15, June 15, September 15, and January 15. Underpayment penalties apply if you owe more than $1,000 and don't pay enough quarterly." },
          { question: "What business expenses can I deduct?", answer: "Common deductions include home office, equipment, software, phone/internet (business portion), professional development, health insurance premiums, and business travel. Keep receipts and documentation for everything." },
          { question: "Should I set up an S-Corp to reduce SE tax?", answer: "At higher income levels (typically $50,000+ net profit), electing S-Corp status lets you pay yourself a reasonable salary and take remaining profit as distributions (not subject to SE tax). Consult a CPA to assess whether the savings justify the added complexity and costs." },
        ]}
        relatedCalculators={[
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
          { name: "HSA Calculator", href: "/calculators/finance/hsa-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Understanding 1099 / Freelance Taxes</h2>
          <p className="text-sm text-gray-700">Freelancers are responsible for both halves of FICA taxes plus income tax. Planning ahead with quarterly payments prevents surprises at tax time.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
