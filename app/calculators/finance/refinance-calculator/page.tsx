"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(300000);
  const [currentRate, setCurrentRate] = useState(7.5);
  const [remainingTerm, setRemainingTerm] = useState(25);
  const [newRate, setNewRate] = useState(6.0);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(5000);
  const [cashOut, setCashOut] = useState(0);

  const [result, setResult] = useState<{
    currentMonthly: number;
    newMonthly: number;
    monthlySavings: number;
    breakEvenMonths: number;
    breakEvenDate: string;
    totalInterestCurrent: number;
    totalInterestNew: number;
    totalInterestSaved: number;
    newLoanAmount: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["refinance", ...recent.filter((id: string) => id !== "refinance")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [currentBalance, currentRate, remainingTerm, newRate, newTerm, closingCosts, cashOut]);

  const calcMonthly = (principal: number, annualRate: number, termYears: number) => {
    const r = annualRate / 100 / 12;
    const n = termYears * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const calculate = () => {
    if (currentBalance <= 0) return;
    const currentMonthly = calcMonthly(currentBalance, currentRate, remainingTerm);
    const newLoanAmount = currentBalance + cashOut;
    const newMonthly = calcMonthly(newLoanAmount, newRate, newTerm);
    const monthlySavings = currentMonthly - newMonthly;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;

    const breakEvenDate = monthlySavings > 0
      ? new Date(Date.now() + breakEvenMonths * 30 * 24 * 60 * 60 * 1000)
          .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "N/A";

    const totalInterestCurrent = currentMonthly * remainingTerm * 12 - currentBalance;
    const totalInterestNew = newMonthly * newTerm * 12 - newLoanAmount;
    const totalInterestSaved = totalInterestCurrent - totalInterestNew;

    setResult({
      currentMonthly,
      newMonthly,
      monthlySavings,
      breakEvenMonths,
      breakEvenDate,
      totalInterestCurrent,
      totalInterestNew,
      totalInterestSaved,
      newLoanAmount,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtDec = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Refinance Calculator", href: "/calculators/finance/refinance-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refinance Break-Even Calculator</h1>
        <p className="text-base text-gray-600">Find out if refinancing is worth it and how long until you break even on closing costs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Current Loan</h2>
          {[
            { label: "Current Balance", value: currentBalance, set: setCurrentBalance, min: 10000, max: 2000000, step: 5000, prefix: "$" },
            { label: "Current Interest Rate", value: currentRate, set: setCurrentRate, min: 0.5, max: 20, step: 0.1, suffix: "%" },
            { label: "Remaining Term", value: remainingTerm, set: setRemainingTerm, min: 1, max: 30, step: 1, suffix: "yrs" },
          ].map(({ label, value, set, min, max, step, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          ))}

          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-2">New Loan</h2>
          {[
            { label: "New Interest Rate", value: newRate, set: setNewRate, min: 0.5, max: 20, step: 0.1, suffix: "%" },
            { label: "New Loan Term", value: newTerm, set: setNewTerm, min: 5, max: 30, step: 1, suffix: "yrs" },
            { label: "Closing Costs", value: closingCosts, set: setClosingCosts, min: 0, max: 30000, step: 500, prefix: "$" },
            { label: "Cash-Out Amount (optional)", value: cashOut, set: setCashOut, min: 0, max: 200000, step: 1000, prefix: "$" },
          ].map(({ label, value, set, min, max, step, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Monthly Savings</div>
                <div className={`text-4xl font-bold ${result.monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {result.monthlySavings >= 0 ? fmtDec(result.monthlySavings) : `-${fmtDec(Math.abs(result.monthlySavings))}`}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Current Monthly</div>
                  <div className="text-lg font-bold text-gray-700">{fmtDec(result.currentMonthly)}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">New Monthly</div>
                  <div className="text-lg font-bold text-blue-600">{fmtDec(result.newMonthly)}</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Break-Even Point</div>
                {result.monthlySavings > 0 ? (
                  <>
                    <div className="text-xl font-bold text-amber-700">{result.breakEvenMonths} months</div>
                    <div className="text-sm text-amber-600">{result.breakEvenDate}</div>
                  </>
                ) : (
                  <div className="text-sm font-semibold text-red-600">Refinancing increases monthly cost</div>
                )}
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Total Interest Saved (over new loan)</div>
                <div className={`text-lg font-bold ${result.totalInterestSaved >= 0 ? "text-purple-700" : "text-red-600"}`}>
                  {result.totalInterestSaved >= 0 ? fmt(result.totalInterestSaved) : `-${fmt(Math.abs(result.totalInterestSaved))}`}
                </div>
              </div>

              {result.monthlySavings > 0 && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-sm text-green-800 font-medium text-center">
                  Worth refinancing if you stay more than {result.breakEvenMonths} months
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Current interest total</div>
                  <div className="font-semibold text-gray-700">{fmt(result.totalInterestCurrent)}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">New interest total</div>
                  <div className="font-semibold text-gray-700">{fmt(result.totalInterestNew)}</div>
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
            <p className="mb-4">A refinance break-even calculator helps you determine whether refinancing your mortgage makes financial sense. You pay closing costs upfront in exchange for a lower interest rate — the break-even point is when your cumulative monthly savings equal those closing costs.</p>
            <p className="mb-3">The key formula: <strong>Break-Even Months = Closing Costs / Monthly Savings</strong></p>
            <p>If you plan to stay in the home longer than the break-even period, refinancing is generally beneficial. Cash-out refinancing lets you borrow additional equity but increases your loan balance and may reduce monthly savings.</p>
          </div>
        }
        faqs={[
          { question: "What is a good break-even period for refinancing?", answer: "Most financial advisors suggest a break-even period of 2–3 years (24–36 months) or less is favorable. If you plan to sell or move before then, the closing costs may not be recouped." },
          { question: "What closing costs should I expect?", answer: "Typical closing costs range from 2–5% of the loan amount and include origination fees, appraisal, title insurance, and prepaid interest. Some lenders offer no-closing-cost refinances, which roll costs into the rate instead." },
          { question: "Does refinancing reset my loan clock?", answer: "Yes. Refinancing into a new 30-year loan when you have 25 years left extends your total repayment period by 5 years. Even with a lower rate, you may pay more total interest. Consider refinancing into a shorter term (15 or 20 years) to avoid this." },
          { question: "When does a cash-out refinance make sense?", answer: "A cash-out refinance makes sense when the interest rate is lower than alternatives (personal loans, HELOCs), you're using funds for home improvements or debt consolidation, and you have sufficient equity (typically 20%+ remaining after cash-out)." },
        ]}
        relatedCalculators={[
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
          { name: "Home Affordability Calculator", href: "/calculators/finance/home-affordability-calculator" },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">How the Break-Even Calculation Works</h2>
          <p className="text-gray-700 text-sm">The break-even analysis compares your total monthly savings against the upfront closing costs. Once cumulative savings exceed closing costs, every subsequent month puts money back in your pocket.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
