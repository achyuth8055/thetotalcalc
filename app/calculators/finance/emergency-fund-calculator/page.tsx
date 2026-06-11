"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function EmergencyFundCalculator() {
  const [rent, setRent] = useState(1500);
  const [utilities, setUtilities] = useState(200);
  const [groceries, setGroceries] = useState(500);
  const [transportation, setTransportation] = useState(300);
  const [insurance, setInsurance] = useState(250);
  const [otherEssentials, setOtherEssentials] = useState(200);
  const [monthsCoverage, setMonthsCoverage] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlySavings, setMonthlySavings] = useState(500);

  const [result, setResult] = useState<{
    monthlyEssentials: number;
    targetFund: number;
    gap: number;
    monthsToGoal: number;
    targetDate: string;
    progressPct: number;
    monthlyNeededFor6Mo: number;
    alreadyFunded: boolean;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["emergency-fund", ...recent.filter((id: string) => id !== "emergency-fund")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [rent, utilities, groceries, transportation, insurance, otherEssentials, monthsCoverage, currentSavings, monthlySavings]);

  const calculate = () => {
    const monthlyEssentials = rent + utilities + groceries + transportation + insurance + otherEssentials;
    const targetFund = monthlyEssentials * monthsCoverage;
    const gap = Math.max(0, targetFund - currentSavings);
    const monthsToGoal = gap > 0 && monthlySavings > 0 ? Math.ceil(gap / monthlySavings) : 0;
    const progressPct = targetFund > 0 ? Math.min(100, (currentSavings / targetFund) * 100) : 0;

    const targetDate = gap > 0 && monthlySavings > 0
      ? new Date(Date.now() + monthsToGoal * 30 * 24 * 60 * 60 * 1000)
          .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "Already reached!";

    const target6Mo = monthlyEssentials * 6;
    const gap6Mo = Math.max(0, target6Mo - currentSavings);
    const monthlyNeededFor6Mo = gap6Mo > 0 ? Math.ceil(gap6Mo / 6) : 0;

    setResult({
      monthlyEssentials,
      targetFund,
      gap,
      monthsToGoal,
      targetDate,
      progressPct,
      monthlyNeededFor6Mo,
      alreadyFunded: gap <= 0,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const inputFields = [
    { label: "Monthly Rent / Mortgage", value: rent, set: setRent, min: 0, max: 5000, step: 50 },
    { label: "Monthly Utilities", value: utilities, set: setUtilities, min: 0, max: 1000, step: 25 },
    { label: "Monthly Groceries", value: groceries, set: setGroceries, min: 0, max: 2000, step: 25 },
    { label: "Monthly Transportation", value: transportation, set: setTransportation, min: 0, max: 2000, step: 25 },
    { label: "Monthly Insurance", value: insurance, set: setInsurance, min: 0, max: 2000, step: 25 },
    { label: "Other Monthly Essentials", value: otherEssentials, set: setOtherEssentials, min: 0, max: 2000, step: 25 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Emergency Fund Calculator", href: "/calculators/finance/emergency-fund-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Fund Calculator</h1>
        <p className="text-base text-gray-600">Find out how much to save for your emergency fund and when you'll reach your goal</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Monthly Essential Expenses</h2>
          {inputFields.map(({ label, value, set, min, max, step }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">$</span>
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className="w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          ))}

          <h2 className="text-base font-semibold text-gray-800 border-b pb-2 pt-2">Coverage Goal & Savings</h2>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Months of Coverage</label>
            <div className="flex gap-2">
              {[3, 6, 9, 12].map((m) => (
                <button key={m} onClick={() => setMonthsCoverage(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${monthsCoverage === m ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {m} mo
                </button>
              ))}
            </div>
          </div>

          {[
            { label: "Current Emergency Savings", value: currentSavings, set: setCurrentSavings, min: 0, max: 100000, step: 500, color: "green" },
            { label: "Monthly Amount You Can Save", value: monthlySavings, set: setMonthlySavings, min: 0, max: 5000, step: 50, color: "purple" },
          ].map(({ label, value, set, min, max, step, color }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">$</span>
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Target Emergency Fund ({monthsCoverage} months)</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.targetFund)}</div>
                <div className="text-xs text-gray-500 mt-1">{fmt(result.monthlyEssentials)}/month × {monthsCoverage} months</div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700">Savings Progress</span>
                  <span className={`font-bold ${result.progressPct >= 100 ? "text-green-600" : "text-blue-600"}`}>
                    {result.progressPct.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${result.progressPct >= 100 ? "bg-green-500" : result.progressPct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                    style={{ width: `${result.progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Saved: {fmt(currentSavings)}</span>
                  <span className="text-gray-500">Goal: {fmt(result.targetFund)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg p-3 ${result.alreadyFunded ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
                  <div className="text-xs text-gray-500 mb-1">{result.alreadyFunded ? "Surplus" : "Remaining Gap"}</div>
                  <div className={`text-xl font-bold ${result.alreadyFunded ? "text-green-700" : "text-amber-700"}`}>
                    {result.alreadyFunded ? "Goal Met!" : fmt(result.gap)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Months to Goal</div>
                  <div className="text-xl font-bold text-gray-800">
                    {result.alreadyFunded ? "0" : result.monthsToGoal}
                    {!result.alreadyFunded && monthlySavings === 0 && <span className="text-sm font-normal text-red-500"> (set savings)</span>}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Target Completion Date</div>
                <div className="text-lg font-bold text-blue-700">{result.targetDate}</div>
              </div>

              {!result.alreadyFunded && result.monthlyNeededFor6Mo > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
                  <div className="text-xs text-gray-500 mb-1">To reach 6-month goal in 6 months, save:</div>
                  <div className="text-lg font-bold text-purple-700">{fmt(result.monthlyNeededFor6Mo)}/month</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">An emergency fund is a dedicated cash reserve set aside for unexpected expenses — job loss, medical emergencies, major car repairs, or home repairs. It's the foundation of any sound financial plan.</p>
            <p className="mb-3">Financial experts recommend saving 3–6 months of essential expenses. If you have an unstable income, work in a volatile industry, or have dependents, aim for 6–12 months.</p>
            <p>Essential expenses are your true survival costs: housing, food, utilities, transportation, and insurance. Discretionary spending like dining out, subscriptions, or entertainment is intentionally excluded.</p>
          </div>
        }
        faqs={[
          { question: "How much should I have in an emergency fund?", answer: "The standard recommendation is 3–6 months of essential living expenses. If you are self-employed, have one income in your household, work in a volatile industry, or have dependents with special needs, aim for 9–12 months. Single-income households and those with variable income should lean toward the higher end." },
          { question: "Where should I keep my emergency fund?", answer: "A high-yield savings account (HYSA) is ideal — it's FDIC insured, liquid (accessible within 1–2 business days), and earns more interest than a traditional savings account. Avoid investing emergency funds in stocks or long-term bonds, as you may need to access the money when markets are down." },
          { question: "Should I pay off debt or build an emergency fund first?", answer: "Build a small emergency fund ($1,000–$2,000) first, then aggressively pay off high-interest debt. Without a small buffer, any unexpected expense derails your debt payoff plan and pushes you further into debt. Once high-interest debt is cleared, build the full 3–6 month fund." },
          { question: "What counts as an emergency?", answer: "True emergencies are unexpected, necessary, and urgent: job loss, medical bills, car breakdown needed for work, urgent home repairs (burst pipe, broken heating). Planned expenses (vacations, holiday gifts, car insurance) are not emergencies — those belong in dedicated sinking funds." },
        ]}
        relatedCalculators={[
          { name: "Net Worth Calculator", href: "/calculators/finance/net-worth-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Debt Payoff Calculator", href: "/calculators/finance/debt-payoff-calculator" },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Building Your Financial Safety Net</h2>
          <p className="text-sm text-gray-700">An emergency fund prevents small setbacks from becoming major financial crises. It lets you handle surprises without going into debt.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
