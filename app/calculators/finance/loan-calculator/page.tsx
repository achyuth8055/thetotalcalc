"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [result, setResult] = useState<{
    monthly: number;
    totalInterest: number;
    totalPayment: number;
    principalPct: number;
    interestPct: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["loan", ...recent.filter((id: string) => id !== "loan")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [loanAmount, interestRate, loanTerm, termUnit]);

  const calculate = () => {
    const P = loanAmount;
    const r = interestRate / 100 / 12;
    const n = termUnit === "years" ? loanTerm * 12 : loanTerm;
    if (P <= 0 || n <= 0) return;
    const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const totalInterest = total - P;
    setResult({
      monthly,
      totalInterest,
      totalPayment: total,
      principalPct: (P / total) * 100,
      interestPct: (totalInterest / total) * 100,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
        <p className="text-base text-gray-600">Calculate monthly payment, total interest, and total cost for any loan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={1000} max={500000} step={500} value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Annual Interest Rate</label>
              <div className="flex items-center gap-1">
                <input type="number" value={interestRate} step={0.1}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-orange-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <input type="range" min={0.5} max={30} step={0.1} value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Loan Term</label>
              <div className="flex items-center gap-2">
                <input type="number" value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value) || 1)}
                  className="w-16 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <select value={termUnit} onChange={(e) => setTermUnit(e.target.value as "years" | "months")}
                  className="px-2 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700">
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            <input type="range" min={1} max={termUnit === "years" ? 30 : 360} step={1} value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                <div className="text-4xl font-bold text-blue-600">{fmt(result.monthly)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Loan Amount</div>
                  <div className="text-lg font-bold text-gray-800">{fmt(loanAmount)}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Interest</div>
                  <div className="text-lg font-bold text-red-600">{fmt(result.totalInterest)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Total Repayment</div>
                  <div className="text-lg font-bold text-green-700">{fmt(result.totalPayment)}</div>
                </div>
              </div>
              <div>
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

      <CalculatorLayout title="" description=""
        explanation={<p>Enter any loan amount, interest rate, and term to instantly see your monthly payment and total cost. Works for personal loans, auto loans, student loans, and more.</p>}
        faqs={[
          { question: "What is APR vs interest rate?", answer: "The interest rate is the base cost of borrowing. APR (Annual Percentage Rate) includes fees and other costs, giving a truer picture of loan cost." },
          { question: "How can I reduce my total interest?", answer: "Make extra payments toward principal, choose a shorter loan term, or refinance at a lower rate." },
          { question: "Does this work for car loans?", answer: "Yes — this is a generic loan calculator. For car-specific details, also try our Car Loan Calculator." },
        ]}
        relatedCalculators={[
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Car Loan EMI", href: "/calculators/finance/car-loan-emi-calculator" },
          { name: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Loan Payment Formula</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-mono bg-white p-2 rounded border">M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]</p>
            <p className="text-xs text-gray-600 mt-2">P = principal, r = monthly rate, n = number of payments</p>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
