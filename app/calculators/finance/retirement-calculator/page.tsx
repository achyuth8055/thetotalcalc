"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(25000);
  const [monthlyContribution, setMonthlyContribution] = useState(800);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [result, setResult] = useState<{
    finalNestEgg: number;
    yearsToRetire: number;
    totalContributions: number;
    totalEarnings: number;
    yearsMoneyLasts: number;
    monthlyIncome: number;
    chartData: { year: number; balance: number; target: number }[];
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["retirement", ...recent.filter((id: string) => id !== "retirement")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, monthlyExpenses]);

  const calculate = () => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const r = annualReturn / 100 / 12;
    const n = yearsToRetire * 12;

    // Future value of current savings + monthly contributions
    const fvSavings = currentSavings * Math.pow(1 + r, n);
    const fvContributions = r > 0 ? monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) : monthlyContribution * n;
    const finalNestEgg = fvSavings + fvContributions;

    const totalContributions = currentSavings + monthlyContribution * n;

    // Withdrawal phase - how long does nest egg last at monthly expenses (4% withdrawal rate in retirement)
    const monthlyIncome = finalNestEgg * 0.04 / 12;
    const postRetirementRate = 0.05 / 12; // conservative 5% in retirement
    let yearsMoneyLasts = 0;
    if (monthlyExpenses > 0 && finalNestEgg > 0) {
      if (monthlyIncome >= monthlyExpenses) {
        yearsMoneyLasts = 100; // sustainable indefinitely
      } else {
        let balance = finalNestEgg;
        while (balance > 0 && yearsMoneyLasts < 100) {
          for (let m = 0; m < 12 && balance > 0; m++) {
            balance = balance * (1 + postRetirementRate) - monthlyExpenses;
          }
          yearsMoneyLasts++;
        }
      }
    }

    const target = monthlyExpenses * 12 / 0.04;
    const chartData: { year: number; balance: number; target: number }[] = [];
    for (let yr = 0; yr <= yearsToRetire; yr++) {
      const nMonths = yr * 12;
      const bal = currentSavings * Math.pow(1 + r, nMonths) +
        (r > 0 ? monthlyContribution * ((Math.pow(1 + r, nMonths) - 1) / r) : monthlyContribution * nMonths);
      chartData.push({ year: yr, balance: Math.round(bal), target: Math.round(target) });
    }

    setResult({
      finalNestEgg,
      yearsToRetire,
      totalContributions,
      totalEarnings: finalNestEgg - totalContributions,
      yearsMoneyLasts,
      monthlyIncome,
      chartData,
    });
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Retirement Calculator</h1>
        <p className="text-base text-gray-600">See how much you'll have at retirement and how long it will last</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Current Age", value: currentAge, set: setCurrentAge, min: 18, max: 80, color: "blue" },
              { label: "Retirement Age", value: retirementAge, set: setRetirementAge, min: 40, max: 80, color: "purple" },
            ].map(({ label, value, set, min, max, color }) => (
              <div key={label}>
                <label className="text-xs font-semibold text-gray-700 block mb-1">{label}</label>
                <input type="number" value={value} min={min} max={max}
                  onChange={(e) => set(Number(e.target.value) || min)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
              </div>
            ))}
          </div>

          {[
            { label: "Current Savings", value: currentSavings, set: setCurrentSavings, min: 0, max: 1000000, step: 1000, color: "blue", prefix: "$" },
            { label: "Monthly Contribution", value: monthlyContribution, set: setMonthlyContribution, min: 0, max: 10000, step: 50, color: "green", prefix: "$" },
            { label: "Annual Return (pre-retirement)", value: annualReturn, set: setAnnualReturn, min: 1, max: 20, step: 0.5, color: "orange", suffix: "%" },
            { label: "Monthly Expenses in Retirement", value: monthlyExpenses, set: setMonthlyExpenses, min: 500, max: 20000, step: 100, color: "red", prefix: "$" },
          ].map(({ label, value, set, min, max, step, color, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-xs text-gray-500">{prefix}</span>}
                  <input type="number" value={value} step={step}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-22 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-${color}-600 focus:ring-1 focus:ring-${color}-500 focus:border-transparent`} />
                  {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Retirement Nest Egg</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.finalNestEgg)}</div>
                <div className="text-xs text-gray-500 mt-1">in {result.yearsToRetire} years</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Total Invested</div>
                  <div className="font-bold text-blue-700 text-sm">{fmt(result.totalContributions)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Investment Gains</div>
                  <div className="font-bold text-orange-600 text-sm">{fmt(result.totalEarnings)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Monthly Income (4%)</div>
                  <div className="font-bold text-purple-600 text-sm">{fmt(result.monthlyIncome)}</div>
                </div>
                <div className={`rounded-lg p-3 ${result.yearsMoneyLasts >= 100 ? "bg-green-50" : result.yearsMoneyLasts >= 25 ? "bg-yellow-50" : "bg-red-50"}`}>
                  <div className="text-xs text-gray-500">Money Lasts</div>
                  <div className={`font-bold text-sm ${result.yearsMoneyLasts >= 100 ? "text-green-700" : result.yearsMoneyLasts >= 25 ? "text-yellow-700" : "text-red-600"}`}>
                    {result.yearsMoneyLasts >= 100 ? "Forever ✓" : `~${result.yearsMoneyLasts} yrs`}
                  </div>
                </div>
              </div>
              {result.yearsMoneyLasts < 25 && result.yearsMoneyLasts < 100 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                  ⚠️ At your projected expenses, savings may run out too quickly. Consider increasing contributions or reducing retirement expenses.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Retirement Balance Growth</h3>
            <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ Download PDF</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => v >= 1000000 ? '$'+(v/1000000).toFixed(1)+'M' : v >= 1000 ? '$'+(v/1000).toFixed(0)+'k' : '$'+v} />
              <Tooltip formatter={(value: number, name: string) => [new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value), name === "balance" ? "Projected Balance" : "Goal"]} labelFormatter={(label) => `Year ${label}`} />
              <ReferenceLine y={result.chartData[0]?.target} stroke="#ef4444" strokeDasharray="4 3" label={{ value: "Goal", position: "insideTopRight", fontSize: 11, fill: "#ef4444" }} />
              <Area type="monotone" dataKey="balance" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="balance" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="inline-block w-3 h-3 rounded-sm bg-green-500"></span>Projected Balance</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="inline-block w-5 border-t-2 border-dashed border-red-500"></span>Retirement Goal</span>
          </div>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={<div><p className="mb-2">This calculator projects your retirement savings using compound growth during the accumulation phase, then estimates how long the nest egg lasts based on the 4% withdrawal rule and your monthly expenses.</p><p className="text-xs text-gray-500 mt-2">⚠️ Estimates only. Inflation, taxes, and Social Security are not included.</p></div>}
        faqs={[
          { question: "What is the 4% rule?", answer: "The 4% rule suggests withdrawing 4% of your portfolio annually in retirement, which historically has lasted 30+ years. Monthly income shown is based on this rule." },
          { question: "How much should I save for retirement?", answer: "A common target is 10–15% of gross income. Many experts suggest having 25× your annual expenses saved by retirement." },
          { question: "Should I include Social Security?", answer: "This calculator doesn't include Social Security. Add your estimated SS benefit to the monthly income figure for a more complete picture." },
        ]}
        relatedCalculators={[
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
          { name: "Inflation Calculator", href: "/calculators/finance/inflation-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Retirement Planning Basics</h2>
          <p className="text-sm text-gray-700">The earlier you start, the less you need to contribute. Thanks to compounding, time is your greatest retirement asset.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
