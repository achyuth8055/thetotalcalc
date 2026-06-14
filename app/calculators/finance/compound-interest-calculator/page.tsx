"use client";

import { useState, useEffect } from "react";
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

const COMPOUND_OPTIONS = [
  { label: "Annually", value: 1 },
  { label: "Semi-annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

interface YearRow {
  year: number;
  balance: number;
  invested: number;
  interest: number;
  interestThisYear: number;
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [n, setN] = useState(12);
  const [monthlyContrib, setMonthlyContrib] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [yearData, setYearData] = useState<YearRow[]>([]);
  const [result, setResult] = useState<{
    finalAmount: number;
    totalInterest: number;
    growthPct: number;
    rule72: number;
    totalInvested: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["compound-interest", ...recent.filter((id: string) => id !== "compound-interest")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { calculate(); }, [principal, rate, years, n, monthlyContrib]);

  const calculate = () => {
    if (principal < 0 || years <= 0 || rate < 0) return;
    const annualRate = rate / 100;
    // Monthly effective rate derived from chosen compounding frequency
    const monthlyRate = n === 365
      ? Math.pow(1 + annualRate / 365, 365 / 12) - 1
      : Math.pow(1 + annualRate / n, n / 12) - 1;

    const data: YearRow[] = [];
    let prevBalance = principal;

    for (let yr = 1; yr <= Math.min(years, 50); yr++) {
      const m = yr * 12;
      const growthFactor = Math.pow(1 + monthlyRate, m);
      const balance =
        principal * growthFactor +
        (monthlyRate > 0 && monthlyContrib > 0
          ? monthlyContrib * ((growthFactor - 1) / monthlyRate)
          : monthlyContrib * m);

      const invested = principal + monthlyContrib * 12 * yr;
      const interest = Math.max(0, balance - invested);
      const interestThisYear = Math.max(0, balance - prevBalance - monthlyContrib * 12);

      data.push({ year: yr, balance, invested, interest, interestThisYear });
      prevBalance = balance;
    }

    const last = data[data.length - 1];
    const finalAmount = last?.balance ?? principal;
    const totalInvested = principal + monthlyContrib * 12 * years;

    setYearData(data);
    setResult({
      finalAmount,
      totalInterest: Math.max(0, finalAmount - totalInvested),
      growthPct: totalInvested > 0 ? ((finalAmount - totalInvested) / totalInvested) * 100 : 0,
      rule72: rate > 0 ? 72 / rate : 0,
      totalInvested,
    });
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const fmtK = (v: number) => {
    if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v.toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">Year {label}</p>
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
          { label: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
        ]}
      />

      {/* Header row */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Compound Interest Calculator</h1>
          <p className="text-base text-gray-600">See how your money grows over time with the power of compounding</p>
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
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">Compound Interest Report</h1>
        <p className="text-sm text-gray-600">Generated at thetotalcalc.com</p>
      </div>

      {/* Inputs + Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5 print:shadow-none print:border-gray-300">
          {[
            { label: "Principal Amount", value: principal, set: setPrincipal, min: 0, max: 1000000, step: 500, color: "blue", prefix: "$" },
            { label: "Annual Interest Rate", value: rate, set: setRate, min: 0.1, max: 30, step: 0.1, color: "orange", suffix: "%" },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 50, step: 1, color: "green" },
            { label: "Monthly Contribution", value: monthlyContrib, set: setMonthlyContrib, min: 0, max: 10000, step: 50, color: "purple", prefix: "$" },
          ].map(({ label, value, set, min, max, step, color, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input
                    type="number"
                    value={value}
                    step={step}
                    min={min}
                    max={max}
                    onChange={(e) => set(Math.max(min, Number(e.target.value) || 0))}
                    className={`w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
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
            <label className="text-sm font-semibold text-gray-700 block mb-2">Compound Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {COMPOUND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setN(opt.value)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors ${n === opt.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 print:shadow-none print:border-gray-300">
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 text-center">
                <div className="text-sm text-gray-600 mb-1">Final Amount</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.finalAmount)}</div>
                <div className="text-sm text-green-700 mt-1.5 font-medium">
                  +{result.growthPct.toFixed(1)}% growth on invested amount
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">Total Invested</div>
                  <div className="text-lg font-bold text-blue-600">{fmt(result.totalInvested)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">Interest Earned</div>
                  <div className="text-lg font-bold text-orange-600">{fmt(result.totalInterest)}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Principal</span>
                  <span>Interest</span>
                </div>
                <div className="w-full h-4 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${(result.totalInvested / result.finalAmount) * 100}%` }}
                  />
                  <div
                    className="bg-orange-400 h-full transition-all duration-300"
                    style={{ width: `${(result.totalInterest / result.finalAmount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-600 font-medium">
                    {((result.totalInvested / result.finalAmount) * 100).toFixed(0)}%
                  </span>
                  <span className="text-orange-500 font-medium">
                    {((result.totalInterest / result.finalAmount) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Rule of 72 */}
              {result.rule72 > 0 && result.rule72 < 100 && (
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                  <div className="text-xs font-semibold text-indigo-700 mb-0.5">Rule of 72</div>
                  <div className="text-sm text-indigo-800">
                    At {rate}%, money doubles every <span className="font-bold">{result.rule72.toFixed(1)} years</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Growth Chart */}
      {yearData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 print:shadow-none print:border-gray-300 print:break-inside-avoid">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Growth Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={yearData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `Yr ${v}`}
              />
              <YAxis
                tickFormatter={fmtK}
                tick={{ fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="invested"
                stackId="1"
                fill="#dbeafe"
                stroke="#3b82f6"
                name="Principal + Contributions"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="interest"
                stackId="1"
                fill="#fed7aa"
                stroke="#f97316"
                name="Interest Earned"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-6 justify-center mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-300 inline-block" />Principal + Contributions</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-300 inline-block" />Interest Earned</span>
          </div>
        </div>
      )}

      {/* Year-by-Year Breakdown Table */}
      {yearData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 print:shadow-none print:border-gray-300 print:break-inside-avoid">
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="text-lg font-bold text-gray-900">Year-by-Year Breakdown</h2>
            <button
              onClick={() => setShowTable(!showTable)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showTable ? "▲ Hide table" : "▼ Show table"}
            </button>
          </div>
          <h2 className="hidden print:block text-lg font-bold text-gray-900 mb-4">Year-by-Year Breakdown</h2>

          <div className={showTable ? "block" : "hidden print:block"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="px-3 py-2.5 text-left font-semibold border-b border-gray-200">Year</th>
                    <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Balance</th>
                    <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Total Invested</th>
                    <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Cumulative Interest</th>
                    <th className="px-3 py-2.5 text-right font-semibold border-b border-gray-200">Interest This Year</th>
                  </tr>
                </thead>
                <tbody>
                  {yearData.map((row, i) => (
                    <tr
                      key={row.year}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="px-3 py-2 border-b border-gray-100 font-medium text-gray-700">Year {row.year}</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right font-semibold text-green-700">{fmt(row.balance)}</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right text-blue-600">{fmt(row.invested)}</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right text-orange-600">{fmt(row.interest)}</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right text-gray-600">{fmt(row.interestThisYear)}</td>
                    </tr>
                  ))}
                </tbody>
                {result && (
                  <tfoot>
                    <tr className="bg-green-50 font-bold">
                      <td className="px-3 py-2.5 text-gray-800">Total</td>
                      <td className="px-3 py-2.5 text-right text-green-700">{fmt(result.finalAmount)}</td>
                      <td className="px-3 py-2.5 text-right text-blue-700">{fmt(result.totalInvested)}</td>
                      <td className="px-3 py-2.5 text-right text-orange-700">{fmt(result.totalInterest)}</td>
                      <td className="px-3 py-2.5 text-right text-gray-600">—</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
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
              Compound interest means you earn interest on your interest — making your money grow
              exponentially over time. The more frequently it compounds, the faster it grows.
            </p>
            <p className="mb-2">
              Formula: <span className="font-mono bg-gray-100 px-1 rounded">A = P(1 + r/n)^(nt)</span>
            </p>
            <p className="text-sm text-gray-600">
              With monthly contributions, each deposit also starts compounding — the earlier you
              start, the more each dollar works for you.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the difference between simple and compound interest?",
            answer:
              "Simple interest is calculated only on the principal. Compound interest is calculated on the principal plus accumulated interest, so it grows exponentially over time.",
          },
          {
            question: "How do monthly contributions affect compound interest?",
            answer:
              "Each monthly contribution begins compounding immediately — so regular contributions can dramatically outpace a single lump sum over long time horizons.",
          },
          {
            question: "How often should interest compound?",
            answer:
              "More frequent compounding means slightly more growth. Daily compounding earns a bit more than monthly, which earns more than annually — though the difference diminishes at lower rates.",
          },
          {
            question: "What is the Rule of 72?",
            answer:
              "Divide 72 by your annual rate to estimate how many years it takes to double your money. At 8%, money doubles in approximately 9 years.",
          },
          {
            question: "How does the PDF download work?",
            answer:
              "Click 'Download PDF' to open your browser's print dialog. Select 'Save as PDF' as the destination. The year-by-year table is included automatically in the printout.",
          },
        ]}
        relatedCalculators={[
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Compound Interest Formula</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">
            A = P(1 + r/n)^(nt)
          </div>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>A = Final amount</li>
            <li>P = Principal (initial investment)</li>
            <li>r = Annual interest rate (decimal)</li>
            <li>n = Compounding frequency per year</li>
            <li>t = Time in years</li>
          </ul>
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Sources &amp; methodology</h3>
            <p className="text-xs text-gray-600">
              This calculator uses the standard compound-interest formula above. Results are
              estimates; actual investment returns are not guaranteed and may be higher or lower.
              Reference:{" "}
              <a
                href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-primary underline"
              >
                Compound Interest Calculator, U.S. SEC (Investor.gov)
              </a>
              .
            </p>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
