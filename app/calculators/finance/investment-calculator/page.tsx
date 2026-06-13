"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(20);
  const [result, setResult] = useState<{
    finalValue: number;
    totalContributions: number;
    totalEarnings: number;
    growthPct: number;
    yearlyData: { year: number; value: number }[];
    chartData: { year: number; invested: number; returns: number }[];
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["investment", ...recent.filter((id: string) => id !== "investment")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [initialAmount, monthlyContribution, annualReturn, years]);

  const calculate = () => {
    const r = annualReturn / 100 / 12;
    const n = years * 12;
    let value = initialAmount;
    const yearlyData: { year: number; value: number }[] = [{ year: 0, value: initialAmount }];

    for (let month = 1; month <= n; month++) {
      value = value * (1 + r) + monthlyContribution;
      if (month % 12 === 0) yearlyData.push({ year: month / 12, value });
    }

    const totalContributions = initialAmount + monthlyContribution * n;
    const chartData = yearlyData.map(({ year, value: val }) => {
      const invested = initialAmount + monthlyContribution * 12 * year;
      return { year, invested, returns: Math.max(0, val - invested) };
    });
    setResult({
      finalValue: value,
      totalContributions,
      totalEarnings: value - totalContributions,
      growthPct: ((value - totalContributions) / totalContributions) * 100,
      yearlyData,
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
          { label: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Calculator</h1>
        <p className="text-base text-gray-600">Project your investment growth with initial amount, monthly contributions, and rate of return</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {[
            { label: "Initial Investment", value: initialAmount, set: setInitialAmount, min: 0, max: 1000000, step: 500, color: "blue", prefix: "$" },
            { label: "Monthly Contribution", value: monthlyContribution, set: setMonthlyContribution, min: 0, max: 10000, step: 50, color: "green", prefix: "$" },
            { label: "Annual Return Rate", value: annualReturn, set: setAnnualReturn, min: 1, max: 30, step: 0.5, color: "orange", suffix: "%" },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 50, step: 1, color: "purple" },
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
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Final Value after {years} years</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.finalValue)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Invested</div>
                  <div className="text-lg font-bold text-blue-700">{fmt(result.totalContributions)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Earnings</div>
                  <div className="text-lg font-bold text-orange-600">{fmt(result.totalEarnings)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Investment Growth Over Time</h3>
            <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ Download PDF</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => v >= 1000000 ? '$'+(v/1000000).toFixed(1)+'M' : v >= 1000 ? '$'+(v/1000).toFixed(0)+'k' : '$'+v} />
              <Tooltip formatter={(value: number, name: string) => [new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value), name === "invested" ? "Invested" : "Returns"]} labelFormatter={(label) => `Year ${label}`} />
              <Area type="monotone" dataKey="invested" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.7} name="invested" />
              <Area type="monotone" dataKey="returns" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.7} name="returns" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="inline-block w-3 h-3 rounded-sm bg-indigo-500"></span>Invested</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="inline-block w-3 h-3 rounded-sm bg-amber-400"></span>Returns</span>
          </div>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={<p>This calculator compounds monthly contributions at your chosen annual return rate. It shows how consistent investing grows wealth dramatically over time through compounding.</p>}
        faqs={[
          { question: "What annual return should I use?", answer: "The S&P 500 has historically averaged ~10% annually before inflation, ~7% after. Conservative estimates use 6–7%; aggressive use 10–12%." },
          { question: "Does this account for inflation?", answer: "No. To see real (inflation-adjusted) returns, subtract ~3% from your rate (e.g., use 5% instead of 8%)." },
          { question: "What if I can only invest a small amount?", answer: "Even small monthly contributions compound dramatically. $100/month at 8% for 30 years grows to over $150,000." },
        ]}
        relatedCalculators={[
          { name: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">The Power of Compounding</h2>
          <p className="text-sm text-gray-700">Starting early is more powerful than investing more later. Time in the market is the biggest factor — even a few extra years can double your final value.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
