"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    loanAmount: number;
    principalPct: number;
    interestPct: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["mortgage", ...recent.filter((id: string) => id !== "mortgage")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [homePrice, downPayment, interestRate, loanTerm]);

  const calculate = () => {
    const P = homePrice - downPayment;
    if (P <= 0) return;
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const totalInterest = total - P;
    setResult({
      monthlyPayment: monthly,
      totalPayment: total,
      totalInterest,
      loanAmount: P,
      principalPct: (P / total) * 100,
      interestPct: (totalInterest / total) * 100,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const downPct = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Calculator</h1>
        <p className="text-base text-gray-600">Calculate your monthly mortgage payment, total interest, and loan breakdown</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {[
            { label: "Home Price", value: homePrice, set: setHomePrice, min: 50000, max: 2000000, step: 5000, color: "blue", prefix: "$" },
            { label: `Down Payment (${downPct}%)`, value: downPayment, set: setDownPayment, min: 0, max: homePrice, step: 1000, color: "green", prefix: "$" },
            { label: "Annual Interest Rate", value: interestRate, set: setInterestRate, min: 0.5, max: 15, step: 0.1, color: "orange", suffix: "%" },
          ].map(({ label, value, set, min, max, step, color, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
                  />
                  {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Loan Term</label>
            <div className="flex gap-2">
              {[10, 15, 20, 30].map((y) => (
                <button key={y} onClick={() => setLoanTerm(y)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${loanTerm === y ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {y}yr
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                <div className="text-4xl font-bold text-blue-600">{fmt(result.monthlyPayment)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Loan Amount</div>
                  <div className="text-lg font-bold text-gray-800">{fmt(result.loanAmount)}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Interest</div>
                  <div className="text-lg font-bold text-red-600">{fmt(result.totalInterest)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Total Cost ({loanTerm} years)</div>
                  <div className="text-lg font-bold text-green-700">{fmt(result.totalPayment)}</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Principal vs Interest</div>
                <div className="w-full h-4 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: `${result.principalPct}%` }} />
                  <div className="bg-red-400 h-full" style={{ width: `${result.interestPct}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-600">Principal {result.principalPct.toFixed(0)}%</span>
                  <span className="text-red-500">Interest {result.interestPct.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">A mortgage calculator helps you estimate monthly payments on a home loan. Enter your home price, down payment, interest rate, and loan term to see the full breakdown.</p>
            <p>The monthly payment includes principal and interest. Property taxes, insurance, and HOA fees are not included.</p>
          </div>
        }
        faqs={[
          { question: "What is a good down payment?", answer: "20% is the traditional benchmark — it avoids Private Mortgage Insurance (PMI). However, many loans allow 3–5% down for first-time buyers." },
          { question: "How does the loan term affect my payment?", answer: "A 30-year term gives lower monthly payments but much more total interest. A 15-year term costs more monthly but saves significantly on interest over the life of the loan." },
          { question: "What is not included in this calculator?", answer: "Property taxes, homeowner's insurance, PMI (if down payment < 20%), and HOA fees are not included. Your actual payment may be higher." },
        ]}
        relatedCalculators={[
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
          { name: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">How Mortgage Payments Work</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Payment Formula</h3>
            <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded border">M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]</p>
            <p className="text-xs text-gray-600 mt-2">Where P = loan amount, r = monthly rate, n = total payments</p>
          </div>
          <p className="text-gray-700 text-sm">Early payments are mostly interest; as years pass, more goes to principal — this is called amortization.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
