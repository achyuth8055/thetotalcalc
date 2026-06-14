"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [activeTab, setActiveTab] = useState<"summary" | "annual" | "monthly">("summary");
  const [monthPage, setMonthPage] = useState(0); // page = year index (0-based)

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["mortgage", ...recent.filter((id: string) => id !== "mortgage")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const { result, schedule, yearSummaries, chartData } = useMemo(() => {
    const P = homePrice - downPayment;
    if (P <= 0) return { result: null, schedule: [], yearSummaries: [], chartData: [] };

    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const monthly =
      r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const schedule: MonthRow[] = [];
    let balance = P;

    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principal = monthly - interest;
      balance = Math.max(0, balance - principal);
      schedule.push({ month: m, payment: monthly, principal, interest, balance });
    }

    const total = monthly * n;
    const totalInterest = total - P;

    // Year summaries
    const yearSummaries: YearSummary[] = [];
    for (let yr = 1; yr <= loanTerm; yr++) {
      const rows = schedule.slice((yr - 1) * 12, yr * 12);
      yearSummaries.push({
        year: yr,
        totalPrincipal: rows.reduce((s, r) => s + r.principal, 0),
        totalInterest: rows.reduce((s, r) => s + r.interest, 0),
        endBalance: rows[rows.length - 1]?.balance ?? 0,
      });
    }

    // Chart data (every other year for readability if > 20yr)
    const chartData = yearSummaries
      .filter((_, i) => loanTerm <= 20 || i % 2 === 0)
      .map((y) => ({
        year: `Yr ${y.year}`,
        Principal: Math.round(y.totalPrincipal),
        Interest: Math.round(y.totalInterest),
      }));

    return {
      result: {
        monthlyPayment: monthly,
        totalPayment: total,
        totalInterest,
        loanAmount: P,
        principalPct: (P / total) * 100,
        interestPct: (totalInterest / total) * 100,
      },
      schedule,
      yearSummaries,
      chartData,
    };
  }, [homePrice, downPayment, interestRate, loanTerm]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const fmtK = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v.toFixed(0)}`;
  };

  const downPct = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : "0";
  const monthlyRows = schedule.slice(monthPage * 12, monthPage * 12 + 12);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
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
          { label: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
        ]}
      />

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mortgage Calculator</h1>
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

      {/* Print-only title */}
      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-bold">Mortgage Amortization Report</h1>
        <p className="text-sm text-gray-600">
          Home: {fmt(homePrice)} | Down: {fmt(downPayment)} | Rate: {interestRate}% | Term: {loanTerm}yr | thetotalcalc.com
        </p>
      </div>

      {/* Inputs + Results */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5 print:shadow-none print:border-gray-300">
          {[
            { label: "Home Price", value: homePrice, set: setHomePrice, min: 50000, max: 2000000, step: 5000, color: "blue", prefix: "$" },
            { label: `Down Payment (${downPct}%)`, value: downPayment, set: setDownPayment, min: 0, max: homePrice, step: 1000, color: "green", prefix: "$" },
            { label: "Annual Interest Rate", value: interestRate, set: setInterestRate, min: 0.5, max: 15, step: 0.1, color: "orange", suffix: "%" },
          ].map(({ label, value, set, min, max, step, color, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
                  />
                  {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`}
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Loan Term</label>
            <div className="flex gap-2">
              {[10, 15, 20, 30].map((y) => (
                <button
                  key={y}
                  onClick={() => { setLoanTerm(y); setMonthPage(0); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${loanTerm === y ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
                >
                  {y}yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div id="results" className="scroll-mt-24 bg-white rounded-xl shadow-md p-6 border border-gray-200 print:shadow-none print:border-gray-300">
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 text-center">
                <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                <div className="text-4xl font-bold text-blue-600">{fmt(result.monthlyPayment)}</div>
                <div className="text-xs text-gray-500 mt-1">Principal + Interest only</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">Loan Amount</div>
                  <div className="text-lg font-bold text-gray-800">{fmt(result.loanAmount)}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">Total Interest</div>
                  <div className="text-lg font-bold text-red-600">{fmt(result.totalInterest)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-500 mb-0.5">Total Cost ({loanTerm} years)</div>
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

      {/* Annual Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 print:shadow-none print:border-gray-300 print:break-inside-avoid">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Principal vs Interest Per Year</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Principal" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Interest" fill="#f87171" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Amortization Schedule */}
      {yearSummaries.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 print:shadow-none print:border-gray-300 print:break-inside-avoid">
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="text-lg font-bold text-gray-900">Amortization Schedule</h2>
            <div className="flex gap-1 text-sm">
              {(["summary", "annual", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setActiveTab(t); setMonthPage(0); }}
                  className={`px-3 py-1.5 rounded-lg font-medium capitalize border transition-colors ${activeTab === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                >
                  {t === "summary" ? "Summary" : t === "annual" ? "Year-by-Year" : "Monthly"}
                </button>
              ))}
            </div>
          </div>
          <h2 className="hidden print:block text-lg font-bold text-gray-900 mb-4">Year-by-Year Amortization</h2>

          {/* Summary tab */}
          {(activeTab === "summary") && result && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Loan Amount</div>
                <div className="text-2xl font-bold text-blue-700">{fmt(result.loanAmount)}</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Total Interest Paid</div>
                <div className="text-2xl font-bold text-red-600">{fmt(result.totalInterest)}</div>
                <div className="text-xs text-gray-500 mt-1">over {loanTerm} years</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Total Paid</div>
                <div className="text-2xl font-bold text-green-700">{fmt(result.totalPayment)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Year 1 Interest</div>
                <div className="text-xl font-bold text-gray-800">{fmt(yearSummaries[0]?.totalInterest ?? 0)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Midpoint Balance</div>
                <div className="text-xl font-bold text-gray-800">{fmt(yearSummaries[Math.floor(loanTerm / 2)]?.endBalance ?? 0)}</div>
                <div className="text-xs text-gray-500 mt-1">at year {Math.floor(loanTerm / 2)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Monthly Payment</div>
                <div className="text-xl font-bold text-gray-800">{fmt(result.monthlyPayment)}</div>
              </div>
            </div>
          )}

          {/* Annual tab */}
          {(activeTab === "annual" || activeTab === "summary") && (
            <div className={activeTab === "summary" ? "hidden" : "block"}>
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
            </div>
          )}

          {/* Print: always show annual */}
          <div className="hidden print:block mt-4">
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

          {/* Monthly tab */}
          {activeTab === "monthly" && (
            <div>
              {/* Year selector */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">Year {monthPage + 1} of {loanTerm}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMonthPage((p) => Math.max(0, p - 1))}
                    disabled={monthPage === 0}
                    className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                  >
                    ← Prev Year
                  </button>
                  <button
                    onClick={() => setMonthPage((p) => Math.min(loanTerm - 1, p + 1))}
                    disabled={monthPage >= loanTerm - 1}
                    className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                  >
                    Next Year →
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
          <div>
            <p className="mb-3">
              A mortgage calculator helps you estimate monthly payments on a home loan. Enter your
              home price, down payment, interest rate, and loan term to see the full breakdown.
            </p>
            <p className="text-sm text-gray-600">
              The monthly payment shown includes principal and interest only. Property taxes,
              insurance, and HOA fees are not included and will increase your actual payment.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is a good down payment?",
            answer:
              "20% is the traditional benchmark — it avoids Private Mortgage Insurance (PMI). However, many loans allow 3–5% down for first-time buyers.",
          },
          {
            question: "How does the loan term affect my payment?",
            answer:
              "A 30-year term gives lower monthly payments but much more total interest. A 15-year term costs more monthly but saves significantly on interest.",
          },
          {
            question: "How do I download the amortization schedule?",
            answer:
              "Click the 'Download PDF' button to open your browser's print dialog. Select 'Save as PDF' — the year-by-year breakdown is included automatically.",
          },
          {
            question: "Why does so much of my early payment go to interest?",
            answer:
              "Early in the loan the balance is highest, so interest charges are largest. Over time, each payment chips away more at principal — this is amortization.",
          },
        ]}
        relatedCalculators={[
          { name: "Home Affordability Calculator", href: "/calculators/finance/home-affordability-calculator" },
          { name: "PMI Calculator", href: "/calculators/finance/pmi-calculator" },
          { name: "Refinance Calculator", href: "/calculators/finance/refinance-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">How Mortgage Payments Work</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Payment Formula</h3>
            <p className="text-sm font-mono bg-white p-2 rounded border text-gray-700">M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]</p>
            <p className="text-xs text-gray-500 mt-2">P = loan amount · r = monthly rate · n = total months</p>
          </div>
          <p className="text-sm text-gray-700">
            Early payments are mostly interest; as years pass, more goes to principal — this is called amortization. Switch to the Month-by-Month tab to see exactly how each payment splits.
          </p>
        </div>
      </CalculatorLayout>

      <MobileResultBar
        label="Monthly payment"
        value={result ? fmt(result.monthlyPayment) : ""}
        sub={result ? `Total interest ${fmt(result.totalInterest)}` : undefined}
        show={!!result}
      />
    </div>
  );
}
