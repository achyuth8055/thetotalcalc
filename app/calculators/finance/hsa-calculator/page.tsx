"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const HSA_LIMITS = { individual: 4300, family: 8550, catchUp: 1000 };

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const fmtPct = (v: number) => v.toFixed(1) + "%";

export default function HSACalculator() {
  const [coverageType, setCoverageType] = useState<"individual" | "family">("individual");
  const [age, setAge] = useState(40);
  const [annualContribution, setAnnualContribution] = useState(3000);
  const [employerContribution, setEmployerContribution] = useState(500);
  const [annualExpenses, setAnnualExpenses] = useState(1500);
  const [investmentReturn, setInvestmentReturn] = useState(6);
  const [yearsTo65, setYearsTo65] = useState(25);
  const [marginalRate, setMarginalRate] = useState(22);

  const [result, setResult] = useState<{
    maxAllowed: number;
    yourMaxAllowed: number;
    totalContributions: number;
    taxSavings: number;
    annualNetMedical: number;
    annualInvested: number;
    balanceAt65: number;
    overLimit: boolean;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["hsa", ...recent.filter((id: string) => id !== "hsa")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [coverageType, age, annualContribution, employerContribution, annualExpenses, investmentReturn, yearsTo65, marginalRate]);

  const calculate = () => {
    const base = coverageType === "individual" ? HSA_LIMITS.individual : HSA_LIMITS.family;
    const catchUp = age >= 55 ? HSA_LIMITS.catchUp : 0;
    const maxAllowed = base + catchUp;

    // Your max = limit minus employer contribution
    const yourMaxAllowed = Math.max(0, maxAllowed - employerContribution);
    const totalContributions = Math.min(annualContribution, yourMaxAllowed) + employerContribution;
    const overLimit = annualContribution > yourMaxAllowed;

    const effectiveContribution = Math.min(annualContribution, yourMaxAllowed);
    const taxSavings = effectiveContribution * (marginalRate / 100);

    const annualNetMedical = Math.max(0, annualExpenses - totalContributions);

    // Annual surplus invested
    const annualInvested = Math.max(0, totalContributions - annualExpenses);

    // Compound surplus at investment return for yearsTo65
    const r = investmentReturn / 100;
    let balanceAt65 = 0;
    for (let y = 0; y < yearsTo65; y++) {
      balanceAt65 = (balanceAt65 + annualInvested) * (1 + r);
    }

    setResult({ maxAllowed, yourMaxAllowed, totalContributions, taxSavings, annualNetMedical, annualInvested, balanceAt65, overLimit });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "HSA Calculator", href: "/calculators/finance/hsa-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HSA Calculator</h1>
        <p className="text-base text-gray-600">Estimate your HSA tax savings and long-term investment growth (2025 limits)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {/* Coverage Type Toggle */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Coverage Type</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {(["individual", "family"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCoverageType(type)}
                  className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${
                    coverageType === type
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {type} ({fmt(type === "individual" ? HSA_LIMITS.individual : HSA_LIMITS.family)})
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Your Age</label>
              <input
                type="number" value={age} min={18} max={64}
                onChange={(e) => setAge(Number(e.target.value) || 18)}
                className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-blue-600 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input type="range" min={18} max={64} value={age} onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            {age >= 55 && (
              <p className="text-xs text-amber-600 mt-1 font-medium">Age 55+: +{fmt(HSA_LIMITS.catchUp)} catch-up contribution allowed</p>
            )}
          </div>

          {/* Annual Contribution */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Your Annual Contribution</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={annualContribution} min={0} max={10000} step={100}
                  onChange={(e) => setAnnualContribution(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-green-600 focus:ring-1 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={9550} step={100} value={annualContribution}
              onChange={(e) => setAnnualContribution(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
          </div>

          {/* Employer Contribution */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Employer Contribution</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={employerContribution} min={0} max={5000} step={50}
                  onChange={(e) => setEmployerContribution(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-purple-600 focus:ring-1 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={5000} step={50} value={employerContribution}
              onChange={(e) => setEmployerContribution(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>

          {/* Annual Medical Expenses */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Annual Medical Expenses</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={annualExpenses} min={0} max={20000} step={100}
                  onChange={(e) => setAnnualExpenses(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-red-600 focus:ring-1 focus:ring-red-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={20000} step={100} value={annualExpenses}
              onChange={(e) => setAnnualExpenses(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
          </div>

          {/* Investment Return */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Investment Return (annual)</label>
              <div className="flex items-center gap-1">
                <input type="number" value={investmentReturn} min={0} max={15} step={0.5}
                  onChange={(e) => setInvestmentReturn(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-orange-600 focus:ring-1 focus:ring-orange-500 focus:border-transparent" />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <input type="range" min={0} max={15} step={0.5} value={investmentReturn}
              onChange={(e) => setInvestmentReturn(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>

          {/* Years to 65 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Years Until Age 65</label>
              <input type="number" value={yearsTo65} min={1} max={45}
                onChange={(e) => setYearsTo65(Number(e.target.value) || 1)}
                className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-blue-600 focus:ring-1 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <input type="range" min={1} max={45} value={yearsTo65}
              onChange={(e) => setYearsTo65(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          {/* Marginal Tax Rate */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Marginal Tax Rate</label>
            <div className="flex gap-2">
              {[22, 24, 32].map((rate) => (
                <button key={rate} onClick={() => setMarginalRate(rate)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    marginalRate === rate ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Tax Savings This Year</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.taxSavings)}</div>
                <div className="text-xs text-gray-500 mt-1">at {marginalRate}% marginal rate</div>
              </div>

              {result.overLimit && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 font-medium">
                  Your contribution exceeds the allowed maximum. Capped at {fmt(result.yourMaxAllowed)}.
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">2025 HSA Limit</div>
                  <div className="font-bold text-blue-700 text-sm">{fmt(result.maxAllowed)}</div>
                  <div className="text-xs text-gray-400">{coverageType}{age >= 55 ? " + catch-up" : ""}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Total HSA Funding</div>
                  <div className="font-bold text-purple-600 text-sm">{fmt(result.totalContributions)}</div>
                  <div className="text-xs text-gray-400">you + employer</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Available for Investment</div>
                  <div className="font-bold text-orange-600 text-sm">{fmt(result.annualInvested)}/yr</div>
                  <div className="text-xs text-gray-400">after medical costs</div>
                </div>
                <div className={`rounded-lg p-3 ${result.annualNetMedical > 0 ? "bg-red-50" : "bg-green-50"}`}>
                  <div className="text-xs text-gray-500">Out-of-Pocket Gap</div>
                  <div className={`font-bold text-sm ${result.annualNetMedical > 0 ? "text-red-600" : "text-green-600"}`}>
                    {result.annualNetMedical > 0 ? fmt(result.annualNetMedical) : "Fully covered"}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <div className="text-xs text-gray-500 mb-1">Projected HSA Balance at Age 65</div>
                <div className="text-2xl font-bold text-green-700">{fmt(result.balanceAt65)}</div>
                <div className="text-xs text-gray-500 mt-1">at {investmentReturn}% return over {yearsTo65} years</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                <p className="font-semibold mb-1">Triple Tax Advantage</p>
                <p>Contributions are pre-tax, growth is tax-free, and qualified medical withdrawals are tax-free. After age 65, your HSA acts like a Traditional IRA - withdrawals for any reason are taxed as ordinary income, but there's no 20% penalty.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (() => {
        const r = investmentReturn / 100;
        const chartData: { year: number; Contributions: number; "Investment Growth": number }[] = [];
        let runningBalance = 0;
        let runningContribs = 0;
        for (let y = 1; y <= yearsTo65; y++) {
          runningContribs += result.annualInvested;
          runningBalance = (runningBalance + result.annualInvested) * (1 + r);
          const growth = Math.max(0, runningBalance - runningContribs);
          chartData.push({ year: y, Contributions: Math.round(runningContribs), "Investment Growth": Math.round(growth) });
        }
        return (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">HSA Balance Growth to Age 65</h3>
              <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Contributions" stackId="1" stroke="#3b82f6" fill="#bfdbfe" />
                <Area type="monotone" dataKey="Investment Growth" stackId="1" stroke="#22c55e" fill="#bbf7d0" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      })()}

      <CalculatorLayout title="" description=""
        explanation={
          <div>
            <p className="mb-2">An HSA is only available when you're enrolled in a High-Deductible Health Plan (HDHP). Contributions reduce your taxable income, funds grow tax-free, and withdrawals for qualified medical expenses are tax-free - a rare triple tax advantage.</p>
            <p className="mb-2">The 2025 contribution limits are $4,300 for self-only coverage and $8,550 for family coverage. If you're 55 or older, you can contribute an additional $1,000 as a catch-up contribution. Your employer's contributions count toward the limit.</p>
            <p className="text-xs text-gray-500 mt-2">Note: This calculator estimates potential savings. Consult a tax professional for personalized advice.</p>
          </div>
        }
        faqs={[
          { question: "Who is eligible for an HSA?", answer: "You must be enrolled in an HSA-qualified High-Deductible Health Plan (HDHP), not covered by other health insurance, not enrolled in Medicare, and not claimed as a dependent on someone else's tax return." },
          { question: "What are qualified medical expenses?", answer: "Qualified expenses include deductibles, copayments, dental, vision, prescriptions, and hundreds of other medical costs. After age 65, you can withdraw for any reason (just pay income tax, like a traditional IRA)." },
          { question: "Can I invest my HSA funds?", answer: "Yes, most HSA providers allow you to invest funds in mutual funds or ETFs once your balance exceeds a threshold (often $1,000–$2,000). Investing unused funds is what creates the long-term wealth-building potential." },
          { question: "Do HSA funds roll over?", answer: "Yes. Unlike FSAs, HSA funds never expire. Unused money rolls over year after year, making the HSA one of the best long-term savings vehicles available." },
        ]}
        relatedCalculators={[
          { name: "401k Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">HSA - The Triple Tax Advantage Account</h2>
          <p className="text-sm text-gray-700">No other savings vehicle offers a triple tax benefit: pre-tax contributions, tax-free growth, and tax-free qualified withdrawals.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
