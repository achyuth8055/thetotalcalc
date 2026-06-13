"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const FILING_STATUS = ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"] as const;
type FilingStatus = typeof FILING_STATUS[number];

// 2024 US Federal Tax Brackets
const BRACKETS: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  "Single": [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  "Married Filing Jointly": [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  "Married Filing Separately": [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, max: Infinity, rate: 0.37 },
  ],
  "Head of Household": [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  "Single": 14600,
  "Married Filing Jointly": 29200,
  "Married Filing Separately": 14600,
  "Head of Household": 21900,
};

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("Single");
  const [deductions, setDeductions] = useState(0);
  const [result, setResult] = useState<{
    federalTax: number;
    effectiveRate: number;
    marginalRate: number;
    taxableIncome: number;
    afterTax: number;
    brackets: { rate: number; taxable: number; tax: number }[];
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["income-tax", ...recent.filter((id: string) => id !== "income-tax")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [income, filingStatus, deductions]);

  const calculate = () => {
    const stdDed = STANDARD_DEDUCTION[filingStatus];
    const totalDed = Math.max(stdDed, deductions);
    const taxableIncome = Math.max(0, income - totalDed);
    const brackets = BRACKETS[filingStatus];

    let federalTax = 0;
    let marginalRate = 0;
    const bracketBreakdown: { rate: number; taxable: number; tax: number }[] = [];

    for (const bracket of brackets) {
      if (taxableIncome <= bracket.min) break;
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      const taxInBracket = taxableInBracket * bracket.rate;
      federalTax += taxInBracket;
      marginalRate = bracket.rate;
      if (taxableInBracket > 0) {
        bracketBreakdown.push({ rate: bracket.rate, taxable: taxableInBracket, tax: taxInBracket });
      }
    }

    setResult({
      federalTax,
      effectiveRate: income > 0 ? (federalTax / income) * 100 : 0,
      marginalRate: marginalRate * 100,
      taxableIncome,
      afterTax: income - federalTax,
      brackets: bracketBreakdown,
    });
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Tax Calculator</h1>
          <p className="text-base text-gray-600">Estimate your 2024 US federal income tax using current brackets</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg shrink-0 ml-4">↓ PDF</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Filing Status</label>
            <div className="grid grid-cols-2 gap-2">
              {FILING_STATUS.map((s) => (
                <button key={s} onClick={() => setFilingStatus(s)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors text-left ${filingStatus === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Annual Income</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={income}
                  onChange={(e) => setIncome(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={500000} step={1000} value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Itemized Deductions <span className="text-xs text-gray-400">(leave 0 for standard)</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
            <p className="text-xs text-gray-500">Standard deduction: {fmt(STANDARD_DEDUCTION[filingStatus])}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Estimated Federal Tax</div>
                <div className="text-4xl font-bold text-red-600">{fmt(result.federalTax)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Effective Rate</div>
                  <div className="text-lg font-bold text-orange-600">{result.effectiveRate.toFixed(1)}%</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Marginal Rate</div>
                  <div className="text-lg font-bold text-purple-600">{result.marginalRate.toFixed(0)}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Taxable Income</div>
                  <div className="text-lg font-bold text-gray-800">{fmt(result.taxableIncome)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">After-Tax Income</div>
                  <div className="text-lg font-bold text-green-600">{fmt(result.afterTax)}</div>
                </div>
              </div>
              {result.brackets.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2">Tax by Bracket</div>
                  {result.brackets.map((b, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-100">
                      <span>{(b.rate * 100).toFixed(0)}% bracket</span>
                      <span className="text-gray-500">{fmt(b.taxable)}</span>
                      <span className="font-semibold text-red-600">{fmt(b.tax)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {result && result.brackets.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Federal Tax Breakdown by Bracket</h3>
            <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={result.brackets.map((b) => ({ name: `${(b.rate * 100).toFixed(0)}%`, "Taxable Income": Math.round(b.taxable), "Tax Paid": Math.round(b.tax) }))} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]} />
              <Legend />
              <Bar dataKey="Taxable Income" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Tax Paid" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Take-Home Income Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: "Federal Tax", value: Math.round(result.federalTax) },
                  { name: "FICA (SS + Medicare)", value: Math.round(income * 0.0765) },
                  { name: "State Tax (est.)", value: 0 },
                  { name: "Take-Home", value: Math.round(Math.max(0, income - result.federalTax - income * 0.0765)) },
                ].filter((s) => s.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f97316" />
                <Cell fill="#9ca3af" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={<div><p className="mb-2">This calculator uses 2024 US federal tax brackets. It applies the standard deduction unless you enter higher itemized deductions.</p><p className="text-xs text-gray-500 mt-2">⚠️ This is an estimate only. State taxes, FICA, credits, and other factors are not included. Consult a tax professional for filing.</p></div>}
        faqs={[
          { question: "What is the difference between effective and marginal tax rate?", answer: "Your marginal rate is the rate on your last dollar earned. Your effective rate is total tax divided by total income — usually much lower than marginal." },
          { question: "What is the standard deduction?", answer: "A flat amount the IRS lets you deduct without itemizing. In 2024 it's $14,600 for single filers and $29,200 for married filing jointly." },
          { question: "Does this include state taxes?", answer: "No — this only estimates federal income tax. State tax rates vary significantly by state." },
        ]}
        relatedCalculators={[
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
          { name: "Salary Calculator", href: "/calculators/finance/paycheck-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">How Tax Brackets Work</h2>
          <p className="text-sm text-gray-700">The US uses a progressive tax system — you pay a lower rate on the first dollars earned and a higher rate only on income above each threshold. Only the income <em>within</em> each bracket is taxed at that rate.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
