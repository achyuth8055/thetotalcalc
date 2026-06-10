"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const COMPOUND_OPTIONS = [
  { label: "Annually", value: 1 },
  { label: "Semi-annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [n, setN] = useState(12);
  const [result, setResult] = useState<{
    finalAmount: number;
    totalInterest: number;
    growthPct: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["compound-interest", ...recent.filter((id: string) => id !== "compound-interest")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [principal, rate, years, n]);

  const calculate = () => {
    if (principal <= 0 || years <= 0) return;
    const A = principal * Math.pow(1 + rate / 100 / n, n * years);
    setResult({
      finalAmount: A,
      totalInterest: A - principal,
      growthPct: ((A - principal) / principal) * 100,
    });
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compound Interest Calculator</h1>
        <p className="text-base text-gray-600">See how your money grows over time with the power of compounding</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {[
            { label: "Principal Amount", value: principal, set: setPrincipal, min: 100, max: 1000000, step: 100, color: "blue", prefix: "$" },
            { label: "Annual Interest Rate", value: rate, set: setRate, min: 0.1, max: 30, step: 0.1, color: "orange", suffix: "%" },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 50, step: 1, color: "green" },
          ].map(({ label, value, set, min, max, step, color, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input type="number" value={value} step={step}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
                  {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Compound Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {COMPOUND_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setN(opt.value)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors ${n === opt.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Final Amount</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.finalAmount)}</div>
                <div className="text-sm text-green-700 mt-1">+{result.growthPct.toFixed(1)}% growth</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Principal</div>
                  <div className="text-lg font-bold text-blue-600">{fmt(principal)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Interest Earned</div>
                  <div className="text-lg font-bold text-orange-600">{fmt(result.totalInterest)}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Principal vs Interest</div>
                <div className="w-full h-4 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${(principal / result.finalAmount) * 100}%` }} />
                  <div className="bg-orange-400 h-full transition-all" style={{ width: `${(result.totalInterest / result.finalAmount) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-600">Principal {((principal / result.finalAmount) * 100).toFixed(0)}%</span>
                  <span className="text-orange-500">Interest {((result.totalInterest / result.finalAmount) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout title="" description=""
        explanation={<div><p className="mb-3">Compound interest means you earn interest on your interest — making your money grow exponentially over time. The more frequently it compounds, the faster it grows.</p><p>Formula: <span className="font-mono bg-gray-100 px-1 rounded">A = P(1 + r/n)^(nt)</span></p></div>}
        faqs={[
          { question: "What is the difference between simple and compound interest?", answer: "Simple interest is calculated only on the principal. Compound interest is calculated on the principal plus accumulated interest, so it grows faster over time." },
          { question: "How often should interest compound?", answer: "More frequent compounding means more growth. Daily compounding earns slightly more than monthly, which earns more than annually." },
          { question: "What is the Rule of 72?", answer: "Divide 72 by your annual rate to estimate how many years it takes to double your money. At 8%, money doubles in approximately 9 years." },
        ]}
        relatedCalculators={[
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Compound Interest Formula</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">A = P(1 + r/n)^(nt)</div>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>A = Final amount</li>
            <li>P = Principal</li>
            <li>r = Annual rate (decimal)</li>
            <li>n = Compounding frequency per year</li>
            <li>t = Time in years</li>
          </ul>
        </div>
      </CalculatorLayout>
    </div>
  );
}
