"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly" | "annually";
const FREQUENCIES: { label: string; value: PayFrequency; perYear: number }[] = [
  { label: "Weekly", value: "weekly", perYear: 52 },
  { label: "Bi-Weekly", value: "biweekly", perYear: 26 },
  { label: "Semi-Monthly", value: "semimonthly", perYear: 24 },
  { label: "Monthly", value: "monthly", perYear: 12 },
  { label: "Annually", value: "annually", perYear: 1 },
];

export default function PaycheckCalculator() {
  const [grossPay, setGrossPay] = useState(3000);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [federalRate, setFederalRate] = useState(22);
  const [stateRate, setStateRate] = useState(5);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [result, setResult] = useState<{
    annualGross: number;
    federalTax: number;
    socialSecurity: number;
    medicare: number;
    stateTax: number;
    totalDeductions: number;
    netPay: number;
    annualNet: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["paycheck", ...recent.filter((id: string) => id !== "paycheck")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [grossPay, frequency, federalRate, stateRate, otherDeductions]);

  const calculate = () => {
    const freq = FREQUENCIES.find(f => f.value === frequency)!;
    const annual = grossPay * freq.perYear;

    const federalTax = grossPay * (federalRate / 100);
    const socialSecurity = Math.min(grossPay * 0.062, (160200 / freq.perYear) * 0.062);
    const medicare = grossPay * 0.0145;
    const stateTax = grossPay * (stateRate / 100);
    const totalDeductions = federalTax + socialSecurity + medicare + stateTax + otherDeductions;
    const netPay = grossPay - totalDeductions;

    setResult({
      annualGross: annual,
      federalTax,
      socialSecurity,
      medicare,
      stateTax,
      totalDeductions,
      netPay,
      annualNet: netPay * freq.perYear,
    });
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paycheck Calculator</h1>
          <p className="text-base text-gray-600">Estimate your take-home pay after federal tax, FICA, and state taxes</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg shrink-0 ml-4">↓ PDF</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Gross Pay per Period</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={grossPay}
                  onChange={(e) => setGrossPay(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={500} max={20000} step={100} value={grossPay}
              onChange={(e) => setGrossPay(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Pay Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map(f => (
                <button key={f.value} onClick={() => setFrequency(f.value)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${frequency === f.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {[
            { label: "Federal Tax Rate", value: federalRate, set: setFederalRate, color: "red" },
            { label: "State Tax Rate", value: stateRate, set: setStateRate, color: "orange" },
          ].map(({ label, value, set, color }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  <input type="number" value={value} step={0.5}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-16 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input type="range" min={0} max={50} step={0.5} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Other Deductions (401k, health, etc.)</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Take-Home Pay</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.netPay)}</div>
                <div className="text-xs text-gray-500 mt-1">per {frequency === "annually" ? "year" : "paycheck"}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Annual Gross</div>
                  <div className="font-bold text-blue-700">{fmt(result.annualGross)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Annual Net</div>
                  <div className="font-bold text-green-700">{fmt(result.annualNet)}</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-600 mb-2">Deductions per Paycheck</div>
                {[
                  { label: "Federal Income Tax", value: result.federalTax, color: "red" },
                  { label: "Social Security (6.2%)", value: result.socialSecurity, color: "orange" },
                  { label: "Medicare (1.45%)", value: result.medicare, color: "yellow" },
                  { label: "State Income Tax", value: result.stateTax, color: "purple" },
                  ...(otherDeductions > 0 ? [{ label: "Other Deductions", value: otherDeductions, color: "gray" }] : []),
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-600">{label}</span>
                    <span className={`font-semibold text-${color}-600`}>{fmt(value)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span className="text-gray-800">Total Deductions</span>
                  <span className="text-red-700">{fmt(result.totalDeductions)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Gross Pay Breakdown (per Paycheck)</h3>
            <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: "Federal Tax", value: Math.round(result.federalTax) },
                  { name: "Social Security", value: Math.round(result.socialSecurity) },
                  { name: "Medicare", value: Math.round(result.medicare) },
                  { name: "State Tax", value: Math.round(result.stateTax) },
                  ...(otherDeductions > 0 ? [{ name: "Other Deductions", value: Math.round(otherDeductions) }] : []),
                  { name: "Take-Home Net Pay", value: Math.round(Math.max(0, result.netPay)) },
                ].filter((s) => s.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f97316" />
                <Cell fill="#eab308" />
                <Cell fill="#f59e0b" />
                <Cell fill="#9ca3af" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Annual Summary</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={[
                { name: "Annual Gross", value: Math.round(result.annualGross) },
                { name: "Annual Net", value: Math.round(result.annualNet) },
                { name: "Total Annual Tax", value: Math.round(result.annualGross - result.annualNet) },
              ]}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={<div><p className="mb-2">This calculator estimates your take-home pay by subtracting federal income tax, FICA taxes (Social Security + Medicare), and state taxes from your gross pay.</p><p className="text-xs text-gray-500 mt-2">⚠️ Estimate only. Actual withholding depends on your W-4, credits, and other factors.</p></div>}
        faqs={[
          { question: "What is FICA?", answer: "FICA stands for Federal Insurance Contributions Act. It includes Social Security (6.2%) and Medicare (1.45%) taxes, totaling 7.65% of your gross pay." },
          { question: "How do I find my federal tax rate?", answer: "Use our Income Tax Calculator to find your marginal bracket, then enter that rate here. Or use an estimated rate like 22% for most middle-income earners." },
          { question: "What are pre-tax deductions?", answer: "401(k), HSA, and FSA contributions reduce your taxable income. Enter these under 'Other Deductions' to see their effect on your take-home pay." },
        ]}
        relatedCalculators={[
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
          { name: "Salary Calculator", href: "/calculators/finance/paycheck-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Your Paycheck</h2>
          <p className="text-sm text-gray-700">Your gross pay is what you earn before deductions. After federal tax, state tax, and FICA, your take-home (net) pay is what hits your bank account.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
