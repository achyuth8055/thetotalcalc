"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function InflationCalculator() {
  const [amount, setAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(20);
  const [mode, setMode] = useState<"future" | "past">("future");
  const [result, setResult] = useState<{
    adjustedAmount: number;
    purchasingPowerLost: number;
    purchasingPowerPct: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["inflation", ...recent.filter((id: string) => id !== "inflation")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [amount, inflationRate, years, mode]);

  const calculate = () => {
    if (amount <= 0 || years <= 0) return;
    const factor = Math.pow(1 + inflationRate / 100, years);
    if (mode === "future") {
      // What will today's amount be worth in the future?
      const futureEquivalent = amount * factor;
      setResult({
        adjustedAmount: futureEquivalent,
        purchasingPowerLost: futureEquivalent - amount,
        purchasingPowerPct: ((factor - 1) * 100),
      });
    } else {
      // What was a past amount worth in today's dollars?
      const todayEquivalent = amount * factor;
      setResult({
        adjustedAmount: todayEquivalent,
        purchasingPowerLost: todayEquivalent - amount,
        purchasingPowerPct: ((factor - 1) * 100),
      });
    }
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Inflation Calculator", href: "/calculators/finance/inflation-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inflation Calculator</h1>
        <p className="text-base text-gray-600">Calculate the impact of inflation on purchasing power over time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Mode</label>
            <div className="flex gap-2">
              <button onClick={() => setMode("future")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === "future" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                Future Value
              </button>
              <button onClick={() => setMode("past")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === "past" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                Past → Today
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {mode === "future"
                ? "How much will you need in the future to match today's purchasing power?"
                : "What is a past amount worth in today's dollars?"}
            </p>
          </div>

          {[
            { label: mode === "future" ? "Amount Today" : "Amount in the Past", value: amount, set: setAmount, min: 1, max: 1000000, step: 100, color: "blue", prefix: "$" },
            { label: "Annual Inflation Rate", value: inflationRate, set: setInflationRate, min: 0.1, max: 20, step: 0.1, color: "orange", suffix: "%" },
            { label: "Number of Years", value: years, set: setYears, min: 1, max: 100, step: 1, color: "green" },
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
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">
                  {mode === "future" ? `You'll need in ${years} years` : `Worth today`}
                </div>
                <div className="text-4xl font-bold text-orange-600">{fmt(result.adjustedAmount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">
                    {mode === "future" ? "Today's Amount" : "Original Amount"}
                  </div>
                  <div className="text-lg font-bold text-blue-700">{fmt(amount)}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Inflation Impact</div>
                  <div className="text-lg font-bold text-red-600">+{fmt(result.purchasingPowerLost)}</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Total Price Increase over {years} years</div>
                <div className="text-xl font-bold text-gray-700">+{result.purchasingPowerPct.toFixed(1)}%</div>
              </div>
              <div className="text-xs text-gray-500 p-2 bg-yellow-50 border border-yellow-100 rounded">
                At {inflationRate}% per year, prices roughly double every {(72 / inflationRate).toFixed(1)} years (Rule of 72)
              </div>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout title="" description=""
        explanation={<p>Inflation erodes purchasing power over time. This calculator shows either how much you'll need in the future to match today's buying power, or what a historical amount is worth in today's dollars.</p>}
        faqs={[
          { question: "What is the average inflation rate in the US?", answer: "Historically, the US Federal Reserve targets 2% annual inflation. Actual rates have ranged from near 0% to over 9% in recent years (2022)." },
          { question: "How does inflation affect savings?", answer: "If your savings earn less than the inflation rate, you're losing real purchasing power even if the balance grows. A savings account at 1% during 3% inflation loses 2% in real terms annually." },
          { question: "What is the Rule of 72?", answer: "Divide 72 by the inflation rate to estimate how many years until prices double. At 3% inflation, prices double in about 24 years." },
        ]}
        relatedCalculators={[
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Inflation</h2>
          <p className="text-sm text-gray-700">Inflation means prices rise over time, reducing what your money can buy. Planning for inflation is critical for retirement, savings goals, and long-term financial decisions.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
