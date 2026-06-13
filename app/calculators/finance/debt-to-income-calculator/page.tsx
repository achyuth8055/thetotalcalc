"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from "recharts";

interface DebtItem {
  id: number;
  label: string;
  amount: number;
  isHousing?: boolean;
}

let nextId = 10;

export default function DebtToIncomeCalculator() {
  const [grossIncome, setGrossIncome] = useState(6000);
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: 1, label: "Mortgage / Rent", amount: 1500, isHousing: true },
    { id: 2, label: "Car Payment", amount: 400 },
    { id: 3, label: "Student Loan", amount: 250 },
    { id: 4, label: "Credit Card Minimums", amount: 150 },
    { id: 5, label: "Other Loans", amount: 0 },
  ]);

  const [result, setResult] = useState<{
    frontEndDTI: number;
    backEndDTI: number;
    totalDebt: number;
    housingDebt: number;
    conventional: "pass" | "marginal" | "fail";
    fha: "pass" | "marginal" | "fail";
    va: "pass" | "marginal" | "fail";
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["debt-to-income", ...recent.filter((id: string) => id !== "debt-to-income")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [grossIncome, debts]);

  const calculate = () => {
    if (grossIncome <= 0) return;
    const totalDebt = debts.reduce((sum, d) => sum + (d.amount || 0), 0);
    const housingDebt = debts.filter(d => d.isHousing).reduce((sum, d) => sum + (d.amount || 0), 0);
    const frontEndDTI = (housingDebt / grossIncome) * 100;
    const backEndDTI = (totalDebt / grossIncome) * 100;

    const qualify = (limit: number): "pass" | "marginal" | "fail" => {
      if (backEndDTI <= limit - 5) return "pass";
      if (backEndDTI <= limit) return "marginal";
      return "fail";
    };

    setResult({
      frontEndDTI,
      backEndDTI,
      totalDebt,
      housingDebt,
      conventional: qualify(43),
      fha: qualify(50),
      va: qualify(41),
    });
  };

  const updateDebt = (id: number, field: "label" | "amount", value: string | number) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const addDebt = () => {
    setDebts(prev => [...prev, { id: nextId++, label: "Other Debt", amount: 0 }]);
  };

  const removeDebt = (id: number) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const dtiColor = (pct: number) => {
    if (pct < 36) return "text-green-600";
    if (pct <= 43) return "text-amber-600";
    return "text-red-600";
  };

  const dtiBg = (pct: number) => {
    if (pct < 36) return "bg-green-50 border-green-200";
    if (pct <= 43) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const qualifyBadge = (status: "pass" | "marginal" | "fail") => {
    if (status === "pass") return "bg-green-100 text-green-800";
    if (status === "marginal") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const qualifyLabel = (status: "pass" | "marginal" | "fail") => {
    if (status === "pass") return "Likely Qualify";
    if (status === "marginal") return "Marginal";
    return "May Not Qualify";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Debt-to-Income Calculator", href: "/calculators/finance/debt-to-income-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Debt-to-Income Ratio Calculator</h1>
        <p className="text-base text-gray-600">Calculate your DTI ratio and see if you qualify for conventional, FHA, or VA loans</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-700">Gross Monthly Income</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={grossIncome} onChange={(e) => setGrossIncome(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={1000} max={30000} step={100} value={grossIncome} onChange={(e) => setGrossIncome(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-700">Monthly Debt Payments</label>
              <button onClick={addDebt}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                + Add Debt
              </button>
            </div>
            <div className="space-y-2">
              {debts.map((debt) => (
                <div key={debt.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={debt.label}
                    onChange={(e) => updateDebt(debt.id, "label", e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">$</span>
                    <input
                      type="number"
                      value={debt.amount}
                      onChange={(e) => updateDebt(debt.id, "amount", Number(e.target.value) || 0)}
                      className={`w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold focus:ring-2 focus:border-transparent ${debt.isHousing ? "text-purple-600 focus:ring-purple-500" : "text-gray-700 focus:ring-blue-500"}`}
                    />
                  </div>
                  {!debt.isHousing && (
                    <button onClick={() => removeDebt(debt.id)}
                      className="text-red-400 hover:text-red-600 text-lg leading-none font-bold">×</button>
                  )}
                  {debt.isHousing && (
                    <span className="text-xs text-purple-600 font-medium w-5" title="Housing expense">H</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2"><span className="font-semibold text-purple-600">H</span> = housing expense used for front-end DTI</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className={`border-2 rounded-lg p-4 text-center ${dtiBg(result.backEndDTI)}`}>
                <div className="text-sm text-gray-600 mb-1">Back-End DTI (All Debts)</div>
                <div className={`text-4xl font-bold ${dtiColor(result.backEndDTI)}`}>
                  {result.backEndDTI.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.backEndDTI < 36 ? "Excellent — well within limits" : result.backEndDTI <= 43 ? "Acceptable — near conventional limit" : "High — may affect loan approval"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg p-3 border ${dtiBg(result.frontEndDTI)}`}>
                  <div className="text-xs text-gray-500 mb-1">Front-End DTI (Housing)</div>
                  <div className={`text-xl font-bold ${dtiColor(result.frontEndDTI)}`}>{result.frontEndDTI.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">of gross income</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Monthly Debt</div>
                  <div className="text-xl font-bold text-gray-800">{fmt(result.totalDebt)}</div>
                  <div className="text-xs text-gray-500">housing: {fmt(result.housingDebt)}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Loan Qualification</h3>
                <div className="space-y-2">
                  {[
                    { name: "Conventional Loan", status: result.conventional, limit: "43% back-end" },
                    { name: "FHA Loan", status: result.fha, limit: "50% back-end" },
                    { name: "VA Loan", status: result.va, limit: "41% back-end" },
                  ].map(({ name, status, limit }) => (
                    <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{name}</span>
                        <span className="text-xs text-gray-500 ml-2">({limit})</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${qualifyBadge(status)}`}>
                        {qualifyLabel(status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <div className="font-semibold text-blue-800 mb-1">DTI Benchmarks</div>
                <div className="space-y-1 text-xs text-blue-700">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Under 36% — Excellent</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> 36–43% — Acceptable</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Over 43% — High risk</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">DTI Ratio Gauge</h3>
            <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
          </div>
          {/* Front-end DTI bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Front-End DTI: {result.frontEndDTI.toFixed(1)}%</span>
              <span>Limit: 28% (Conv.) / 31% (FHA)</span>
            </div>
            <div className="flex h-6 rounded-full overflow-hidden bg-gray-100">
              <div className={`h-full transition-all ${result.frontEndDTI <= 28 ? 'bg-green-500' : result.frontEndDTI <= 31 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (result.frontEndDTI / 50) * 100)}%` }} />
            </div>
          </div>
          {/* Back-end DTI bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Back-End DTI: {result.backEndDTI.toFixed(1)}%</span>
              <span>Limit: 36-43% (Conv.) / 43% (FHA)</span>
            </div>
            <div className="flex h-6 rounded-full overflow-hidden bg-gray-100">
              <div className={`h-full transition-all ${result.backEndDTI <= 36 ? 'bg-green-500' : result.backEndDTI <= 43 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (result.backEndDTI / 60) * 100)}%` }} />
            </div>
          </div>
          {/* Scale labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0%</span><span>Excellent</span><span>Good</span><span>Fair</span><span>High Risk</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Monthly Payment Breakdown</h3>
            <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[{
              name: "Monthly Budget",
              "Housing Costs": result.housingDebt,
              "Other Debts": result.totalDebt - result.housingDebt,
              "Available Income": Math.max(0, grossIncome - result.totalDebt),
            }]} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Housing Costs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Other Debts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Available Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">Debt-to-income ratio (DTI) is the percentage of your gross monthly income that goes toward monthly debt payments. Lenders use this metric as a primary factor in loan approval decisions.</p>
            <p className="mb-3"><strong>Front-end DTI</strong> (also called housing ratio) = Housing costs / Gross income. Most lenders want this below 28%.</p>
            <p><strong>Back-end DTI</strong> = All monthly debts / Gross income. This includes housing, car payments, student loans, credit cards, and any other recurring obligations.</p>
          </div>
        }
        faqs={[
          { question: "What DTI do I need to qualify for a mortgage?", answer: "Conventional loans typically require a back-end DTI under 43%, though some lenders approve up to 50% with compensating factors. FHA loans allow up to 50% with strong credit. VA loans have a 41% guideline but are more flexible. A DTI under 36% gives you the best rates and terms." },
          { question: "Does my DTI include all debts?", answer: "DTI includes all recurring monthly debt obligations: mortgage/rent, car payments, student loans, credit card minimums, personal loans, and child support. It does NOT include utilities, phone bills, insurance, or grocery expenses." },
          { question: "How can I quickly lower my DTI?", answer: "The two levers are income (increase gross income through raises, side income, or a second job) and debt (pay off small balances, refinance to lower payments, or avoid taking on new debt). Paying off a credit card entirely removes its minimum payment from the DTI calculation." },
          { question: "Is front-end or back-end DTI more important?", answer: "Back-end DTI is the more important figure for lenders, as it captures your total financial obligations. Front-end DTI matters mostly for FHA loans, which have separate front-end (31%) and back-end (43%) limits. Conventional lenders focus primarily on back-end DTI." },
        ]}
        relatedCalculators={[
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Home Affordability Calculator", href: "/calculators/finance/home-affordability-calculator" },
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">How DTI Affects Loan Approval</h2>
          <p className="text-sm text-gray-700">Lenders use DTI alongside credit score, assets, and employment history. A low DTI signals that you have room in your budget for a new payment and are a lower default risk.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
