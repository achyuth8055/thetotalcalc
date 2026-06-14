"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import MobileResultBar from "@/components/calculators/MobileResultBar";

interface MonthRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface YearSummary {
  year: number;
  totalPrincipal: number;
  totalInterest: number;
  endBalance: number;
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [activeTab, setActiveTab] = useState<"annual" | "monthly">("annual");
  const [monthPage, setMonthPage] = useState(0);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["loan", ...recent.filter((id: string) => id !== "loan")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const totalMonths = termUnit === "years" ? loanTerm * 12 : loanTerm;
  const totalYears = Math.ceil(totalMonths / 12);

  const { result, schedule, yearSummaries, chartData } = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 100 / 12;
    const n = totalMonths;
    if (P <= 0 || n <= 0) return { result: null, schedule: [], yearSummaries: [], chartData: [] };

    const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const schedule: MonthRow[] = [];
    let balance = P;
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principal = Math.min(monthly - interest, balance);
      balance = Math.max(0, balance - principal);
      schedule.push({ month: m, payment: monthly, principal, interest, balance });
    }

    const total = monthly * n;
    const totalInterest = total - P;

    const yearSummaries: YearSummary[] = [];
    for (let yr = 1; yr <= totalYears; yr++) {
      const rows = schedule.slice((yr - 1) * 12, yr * 12);
      yearSummaries.push({
        year: yr,
        totalPrincipal: rows.reduce((s, r) => s + r.principal, 0),
        totalInterest: rows.reduce((s, r) => s + r.interest, 0),
        endBalance: rows[rows.length - 1]?.balance ?? 0,
      });
    }

    // Running balance chart data (monthly)
    const chartData = schedule
      .filter((_, i) => i % Math.max(1, Math.floor(n / 60)) === 0 || i === n - 1)
      .map((row) => ({
        month: row.month,
        Balance: Math.round(row.balance),
        Principal: Math.round(P - row.balance),
      }));

    return {
      result: { monthly, totalInterest, totalPayment: total, principalPct: (P / total) * 100, interestPct: (totalInterest / total) * 100 },
      schedule,
      yearSummaries,
      chartData,
    };
  }, [loanAmount, interestRate, totalMonths, totalYears]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const fmtK = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v.toFixed(0)}`;
  };

  const monthlyRows = schedule.slice(monthPage * 12, monthPage * 12 + 12);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">Month {label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-gray-600">{p.name}: <span className="font-medium">{fmt(p.value)}</span></p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
        ]}
      />

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Loan Calculator</h1>
          <p className="text-base text-gray-600">Calculate monthly payment, total interest, and full amortization schedule</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-bold">Loan Amortization Report</h1>
        <p className="text-sm text-gray-600">
          Loan: {fmt(loanAmount)} | Rate: {interestRate}% | Term: {loanTerm} {termUnit} | thetotalcalc.com
        </p>
      </div>

      {/* Inputs + Results */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5 print:shadow-none print:border-gray-300">
          {/* Loan amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <input
              type="range"
              min={1000}
              max={500000}
              step={500}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Interest rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-700">Annual Interest Rate</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={interestRate}
                  step={0.1}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-orange-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={30}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          {/* Loan term */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-700">Loan Term</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => { setLoanTerm(Number(e.target.value) || 1); setMonthPage(0); }}
                  className="w-16 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <select
                  value={termUnit}
                  onChange={(e) => { setTermUnit(e.target.value as "years" | "months"); setMonthPage(0); }}
                  className="px-2 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={termUnit === "years" ? 30 : 360}
              step={1}
              value={loanTerm}
              onChange={(e) => { setLoanTerm(Number(e.target.value)); setMonthPage(0); }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div id="results" className="scroll-mt-24 bg-white rounded-xl shadow-md p-6 border border-gray-200 print:shadow-none print:border-gray-300">
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 text-center">
                <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                <div className="text-4xl font-bold text-blue-600">{fmt(result.monthly)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">Loan Amount</div>
                  <div className="text-lg font-bold text-gray-800">{fmt(loanAmount)}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">Total Interest</div>
                  <div className="text-lg font-bold text-red-600">{fmt(result.totalInterest)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-500 mb-0.5">Total Repayment</div>
                  <div className="text-lg font-bold text-green-700">{fmt(result.totalPayment)}</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Principal</span>
                  <span>Interest</span>
                </div>
                <div className="w-full h-4 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${result.principalPct}%` }} />
                  <div className="bg-red-400 h-full transition-all" style={{ width: `${result.interestPct}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-600 font-medium">Principal {result.principalPct.toFixed(0)}%</span>
                  <span className="text-red-500 font-medium">Interest {result.interestPct.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Balance over time chart */}
      {chartData.length > 1 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 print:shadow-none print:border-gray-300 print:break-inside-avoid">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Balance Over Time</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `M${v}`}
              />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Balance" fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} name="Remaining Balance" />
              <Area type="monotone" dataKey="Principal" fill="#dcfce7" stroke="#22c55e" strokeWidth={2} name="Equity Built" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-6 justify-center mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-300 inline-block" />Remaining Balance</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-300 inline-block" />Equity / Paid Off</span>
          </div>
        </div>
      )}

      {/* Amortization Schedule */}
      {yearSummaries.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 print:shadow-none print:border-gray-300 print:break-inside-avoid">
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="text-lg font-bold text-gray-900">Amortization Schedule</h2>
            <div className="flex gap-1 text-sm">
              {(["annual", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setActiveTab(t); setMonthPage(0); }}
                  className={`px-3 py-1.5 rounded-lg font-medium capitalize border transition-colors ${activeTab === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                >
                  {t === "annual" ? "Year-by-Year" : "Month-by-Month"}
                </button>
              ))}
            </div>
          </div>
          <h2 className="hidden print:block text-lg font-bold text-gray-900 mb-4">Year-by-Year Amortization</h2>

          {/* Annual table */}
          {activeTab === "annual" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="px-3 py-2.5 text-left font-semibold border-b border-gray-200">Year</th>
                    <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Principal Paid</th>
                    <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Interest Paid</th>
                    <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {yearSummaries.map((row, i) => (
                    <tr key={row.year} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium text-gray-700">Year {row.year}</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right text-blue-600">{fmt(row.totalPrincipal)}</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right text-red-500">{fmt(row.totalInterest)}</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right text-gray-600">{fmt(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Print-only annual table */}
          <div className="hidden print:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-3 py-2 text-left font-semibold border border-gray-300">Year</th>
                    <th className="px-3 py-2 text-right font-semibold border border-gray-300">Principal Paid</th>
                    <th className="px-3 py-2 text-right font-semibold border border-gray-300">Interest Paid</th>
                    <th className="px-3 py-2 text-right font-semibold border border-gray-300">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {yearSummaries.map((row) => (
                    <tr key={row.year} className="border border-gray-200">
                      <td className="px-3 py-1.5 border border-gray-200">Year {row.year}</td>
                      <td className="px-3 py-1.5 text-right border border-gray-200">{fmt(row.totalPrincipal)}</td>
                      <td className="px-3 py-1.5 text-right border border-gray-200">{fmt(row.totalInterest)}</td>
                      <td className="px-3 py-1.5 text-right border border-gray-200">{fmt(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly table */}
          {activeTab === "monthly" && (
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">Year {monthPage + 1} of {totalYears}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMonthPage((p) => Math.max(0, p - 1))}
                    disabled={monthPage === 0}
                    className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setMonthPage((p) => Math.min(totalYears - 1, p + 1))}
                    disabled={monthPage >= totalYears - 1}
                    className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="px-3 py-2.5 text-left font-semibold border-b border-gray-200">Month</th>
                      <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Payment</th>
                      <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Principal</th>
                      <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Interest</th>
                      <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRows.map((row, i) => (
                      <tr key={row.month} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                        <td className="px-3 py-2 border-b border-gray-100 text-gray-700">Month {row.month}</td>
                        <td className="px-3 py-2 border-b border-gray-100 text-right text-gray-600">{fmt(row.payment)}</td>
                        <td className="px-3 py-2 border-b border-gray-100 text-right text-blue-600">{fmt(row.principal)}</td>
                        <td className="px-3 py-2 border-b border-gray-100 text-right text-red-500">{fmt(row.interest)}</td>
                        <td className="px-3 py-2 border-b border-gray-100 text-right font-medium text-gray-700">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
        }
      `}</style>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <p>
            Enter any loan amount, interest rate, and term to instantly see your monthly payment
            and total cost. Works for personal loans, auto loans, student loans, and more. Switch to
            the Month-by-Month tab for a full amortization breakdown.
          </p>
        }
        faqs={[
          {
            question: "What is APR vs interest rate?",
            answer:
              "The interest rate is the base cost of borrowing. APR (Annual Percentage Rate) includes fees and other costs, giving a truer picture of the total loan cost.",
          },
          {
            question: "How do I download the amortization table?",
            answer:
              "Click 'Download PDF' to open the print dialog, then choose 'Save as PDF'. The year-by-year breakdown is included automatically.",
          },
          {
            question: "How can I reduce my total interest?",
            answer:
              "Make extra payments toward principal, choose a shorter loan term, or refinance at a lower rate. Even one extra payment per year can save thousands.",
          },
          {
            question: "Does this work for car loans?",
            answer:
              "Yes — this is a generic amortizing loan calculator. Enter any loan amount, rate, and term. For car-specific features, also try our Car Loan EMI calculator.",
          },
        ]}
        relatedCalculators={[
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Debt Payoff Planner", href: "/calculators/finance/debt-payoff-planner" },
          { name: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Loan Payment Formula</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-mono bg-white p-2 rounded border text-gray-700">M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]</p>
            <p className="text-xs text-gray-500 mt-2">P = principal · r = monthly rate · n = number of payments</p>
          </div>
        </div>
      </CalculatorLayout>

      <MobileResultBar
        label="Monthly payment"
        value={result ? fmt(result.monthly) : ""}
        sub={result ? `Total interest ${fmt(result.totalInterest)}` : undefined}
        show={!!result}
      />
    </div>
  );
}
