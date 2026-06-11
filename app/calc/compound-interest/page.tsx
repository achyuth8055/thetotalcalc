"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface YearRow {
  year: number;
  invested: number;
  interest: number;
  balance: number;
}

interface MonthRow {
  month: number;
  label: string;
  payment: number;
  interestThisMonth: number;
  balance: number;
}

interface ChartPoint {
  year: number;
  label: string;
  invested: number;
  interest: number;
  balance: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FREQ_OPTIONS = [
  { label: "Annually", n: 1 },
  { label: "Semi-ann.", n: 2 },
  { label: "Quarterly", n: 4 },
  { label: "Monthly", n: 12 },
  { label: "Daily", n: 365 },
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ─── Formatting helpers ───────────────────────────────────────────────────────

const fmtCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const fmtCompact = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v.toFixed(0)}`;
};

const fmtPct = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(v / 100);

// ─── Calculation core ─────────────────────────────────────────────────────────

function calcBalance(
  principal: number,
  monthlyRate: number,
  months: number,
  contrib: number
): number {
  if (monthlyRate === 0) return principal + contrib * months;
  return (
    principal * Math.pow(1 + monthlyRate, months) +
    contrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  );
}

function getMonthlyRate(annualRate: number, n: number): number {
  if (n === 365) {
    return Math.pow(1 + annualRate / 100 / 365, 365 / 12) - 1;
  }
  return Math.pow(1 + annualRate / 100 / n, n / 12) - 1;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  decimals = 0,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  onChange: (v: number) => void;
}) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : String(value);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-label-md text-primary">{label}</span>
        <div className="flex items-center gap-1">
          {prefix && (
            <span className="text-label-sm text-on-surface-variant">{prefix}</span>
          )}
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={displayValue}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className="w-28 rounded-lg border border-surface-border bg-white px-2 py-1 text-right text-sm font-semibold text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {suffix && (
            <span className="text-label-sm text-on-surface-variant">{suffix}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high accent-primary"
      />
      <div className="flex justify-between text-label-sm text-on-surface-variant">
        <span>
          {prefix}
          {min}
          {suffix}
        </span>
        <span>
          {prefix}
          {max >= 1000 ? `${max / 1000}k` : max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string | number;
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-surface-border bg-white p-3 shadow-md">
      <p className="mb-1 text-label-md text-primary">Year {label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-label-sm" style={{ color: p.color }}>
          {p.name === "invested" ? "Total Invested" : "Interest Earned"}:{" "}
          <span className="font-semibold">{fmtCurrency(p.value)}</span>
        </p>
      ))}
      <p className="mt-1 text-label-sm font-semibold text-primary">
        Balance:{" "}
        {fmtCurrency(
          (payload.find((p) => p.name === "invested")?.value ?? 0) +
            (payload.find((p) => p.name === "interest")?.value ?? 0)
        )}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CompoundInterestPage() {
  // Inputs
  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(10);
  const [contrib, setContrib] = useState(0);
  const [freqN, setFreqN] = useState(12);

  // UI state
  const [tableView, setTableView] = useState<"year" | "month">("year");
  const [showTable, setShowTable] = useState(false);
  const [monthPage, setMonthPage] = useState(0); // which year we're viewing in month mode

  // localStorage recent
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recentCalcs");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const next = ["compound-interest", ...arr.filter((s) => s !== "compound-interest")].slice(0, 5);
      localStorage.setItem("recentCalcs", JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  // Reset monthPage when years changes
  useEffect(() => {
    if (monthPage >= years) setMonthPage(Math.max(0, years - 1));
  }, [years, monthPage]);

  // ── Core derived data ──────────────────────────────────────────────────────

  const monthlyRate = useMemo(
    () => getMonthlyRate(annualRate, freqN),
    [annualRate, freqN]
  );

  const yearData: YearRow[] = useMemo(() => {
    const rows: YearRow[] = [];
    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      const balance = calcBalance(principal, monthlyRate, months, contrib);
      const invested = principal + contrib * 12 * y;
      const interest = balance - invested;
      rows.push({ year: y, invested, interest, balance });
    }
    return rows;
  }, [principal, monthlyRate, years, contrib]);

  const finalRow = yearData[yearData.length - 1] ?? {
    year: years,
    invested: principal,
    interest: 0,
    balance: principal,
  };

  const futureValue = finalRow.balance;
  const totalInvested = finalRow.invested;
  const interestEarned = finalRow.interest;
  const growthPct = totalInvested > 0 ? ((futureValue - totalInvested) / totalInvested) * 100 : 0;
  const rule72 = annualRate > 0 ? (72 / annualRate).toFixed(1) : "∞";

  // ── Chart data ─────────────────────────────────────────────────────────────

  const chartData: ChartPoint[] = useMemo(() => {
    return yearData.map((r) => ({
      year: r.year,
      label: `Yr ${r.year}`,
      invested: Math.round(r.invested),
      interest: Math.round(r.interest),
      balance: Math.round(r.balance),
    }));
  }, [yearData]);

  // Decide X-axis tick interval
  const xTicks = useMemo(() => {
    if (years <= 10) return chartData.map((d) => d.year);
    const ticks: number[] = [];
    for (let y = 5; y <= years; y += 5) ticks.push(y);
    if (!ticks.includes(years)) ticks.push(years);
    return ticks;
  }, [years, chartData]);

  // ── Month breakdown ────────────────────────────────────────────────────────

  const monthRows: MonthRow[] = useMemo(() => {
    const startMonth = monthPage * 12; // 0-indexed
    let runningBalance =
      startMonth === 0
        ? principal
        : calcBalance(principal, monthlyRate, startMonth, contrib);

    const rows: MonthRow[] = [];
    for (let i = 0; i < 12; i++) {
      const absMonth = startMonth + i; // 0-indexed from start
      if (absMonth >= years * 12) break;
      const interestThisMonth = runningBalance * monthlyRate;
      const newBalance = runningBalance + interestThisMonth + contrib;
      const calendarMonth = absMonth % 12;
      rows.push({
        month: absMonth + 1,
        label: `${MONTH_NAMES[calendarMonth]} ${monthPage + 1}`,
        payment: contrib,
        interestThisMonth,
        balance: newBalance,
      });
      runningBalance = newBalance;
    }
    return rows;
  }, [principal, monthlyRate, contrib, years, monthPage]);

  // ── Progress bar widths ────────────────────────────────────────────────────

  const investedPct = futureValue > 0 ? (totalInvested / futureValue) * 100 : 100;
  const interestBarPct = 100 - investedPct;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .year-table-section {
            display: block !important;
          }
        }
      `}</style>

      {/* ── Header ── */}
      <header className="border-b border-surface-border bg-surface-container-low pb-stack-lg pt-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <nav className="mb-stack-md" aria-label="Breadcrumb">
            <ol className="flex items-center gap-stack-sm text-label-sm text-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li className="material-symbols-outlined text-sm leading-none">
                chevron_right
              </li>
              <li>
                <Link href="/calculators" className="hover:text-primary">
                  Calculators
                </Link>
              </li>
              <li className="material-symbols-outlined text-sm leading-none">
                chevron_right
              </li>
              <li className="font-bold text-primary">
                Compound Interest Calculator
              </li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="mb-unit text-headline-lg text-primary">
                Compound Interest Calculator
              </h1>
              <p className="max-w-3xl text-body-md text-on-surface-variant">
                Project how your savings grow with compound interest and optional
                monthly contributions.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="print:hidden flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              ↓ Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-4xl px-margin-mobile py-stack-lg md:px-margin-desktop">

        {/* Inputs + Results side by side */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* LEFT: Inputs */}
          <div className="premium-card rounded-xl p-6 flex flex-col gap-6">
            <h2 className="text-headline-sm text-primary">Parameters</h2>

            <SliderRow
              label="Initial Amount"
              value={principal}
              min={0}
              max={1_000_000}
              step={500}
              prefix="$"
              onChange={setPrincipal}
            />

            <SliderRow
              label="Annual Return"
              value={annualRate}
              min={0}
              max={30}
              step={0.1}
              suffix="%"
              decimals={1}
              onChange={setAnnualRate}
            />

            <SliderRow
              label="Years"
              value={years}
              min={1}
              max={50}
              step={1}
              suffix=" yrs"
              onChange={setYears}
            />

            <SliderRow
              label="Monthly Contribution"
              value={contrib}
              min={0}
              max={10_000}
              step={50}
              prefix="$"
              onChange={setContrib}
            />

            {/* Compound Frequency */}
            <div className="flex flex-col gap-2">
              <span className="text-label-md text-primary">
                Compound Frequency
              </span>
              <div className="flex flex-wrap gap-2">
                {FREQ_OPTIONS.map((opt) => (
                  <button
                    key={opt.n}
                    onClick={() => setFreqN(opt.n)}
                    className={`rounded-lg px-3 py-1.5 text-label-sm font-medium transition-colors ${
                      freqN === opt.n
                        ? "bg-primary text-white"
                        : "border border-surface-border bg-white text-on-surface-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="premium-card rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-headline-sm text-primary">Results</h2>

            {/* Future Value — hero number */}
            <div className="rounded-xl bg-surface-container-low p-4 text-center">
              <p className="text-label-md text-on-surface-variant">
                Future Value
              </p>
              <p className="mt-1 text-[2.25rem] font-bold leading-none text-primary">
                {fmtCurrency(futureValue)}
              </p>
              <p className="mt-1 text-label-sm text-on-surface-variant">
                after {years} year{years !== 1 ? "s" : ""}
              </p>
            </div>

            {/* 2×2 secondary results */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-surface-border bg-white p-3">
                <p className="text-label-sm text-on-surface-variant">
                  Total Invested
                </p>
                <p className="mt-0.5 text-label-md font-semibold text-primary">
                  {fmtCurrency(totalInvested)}
                </p>
              </div>
              <div className="rounded-lg border border-surface-border bg-white p-3">
                <p className="text-label-sm text-on-surface-variant">
                  Interest Earned
                </p>
                <p className="mt-0.5 text-label-md font-semibold text-primary">
                  {fmtCurrency(interestEarned)}
                </p>
              </div>
              <div className="rounded-lg border border-surface-border bg-white p-3">
                <p className="text-label-sm text-on-surface-variant">
                  Growth %
                </p>
                <p className="mt-0.5 text-label-md font-semibold text-primary">
                  {fmtPct(growthPct)}
                </p>
              </div>
              <div className="rounded-lg border border-surface-border bg-white p-3">
                <p className="text-label-sm text-on-surface-variant">
                  Rule of 72
                </p>
                <p className="mt-0.5 text-label-md font-semibold text-primary">
                  Doubles in {rule72} yrs
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="mb-1 flex justify-between text-label-sm text-on-surface-variant">
                <span>Invested</span>
                <span>Interest</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-l-full bg-primary transition-all duration-500"
                  style={{ width: `${investedPct.toFixed(1)}%` }}
                />
                <div
                  className="h-full rounded-r-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${interestBarPct.toFixed(1)}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-label-sm text-on-surface-variant">
                <span>{investedPct.toFixed(0)}%</span>
                <span>{interestBarPct.toFixed(0)}%</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] leading-relaxed text-on-surface-variant">
              Results are estimates based on constant rate assumptions. Actual
              returns vary. Not financial advice.
            </p>
          </div>
        </div>

        {/* ── Growth Chart ── */}
        <div className="premium-card rounded-xl p-6 mt-6">
          <h2 className="mb-4 text-headline-sm text-primary">Growth Over Time</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                ticks={xTicks}
                tickFormatter={(v) => `Yr ${v}`}
                tick={{ fontSize: 11, fill: "#43474e" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtCompact}
                tick={{ fontSize: 11, fill: "#43474e" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Area
                type="monotone"
                dataKey="invested"
                stackId="1"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#gradInvested)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="interest"
                stackId="1"
                stroke="#d97706"
                strokeWidth={2}
                fill="url(#gradInterest)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-4 text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-600" />
              Total Invested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500" />
              Interest Earned
            </span>
          </div>
        </div>

        {/* ── Year-by-Year Breakdown ── */}
        <div className="premium-card rounded-xl p-6 mt-6">
          {/* Toggle show/hide */}
          <button
            onClick={() => setShowTable((s) => !s)}
            className="flex w-full items-center justify-between text-label-md text-primary hover:opacity-80 transition-opacity"
            aria-expanded={showTable}
          >
            <span className="text-headline-sm text-primary">
              {showTable ? "▲" : "▼"} Year-by-Year Breakdown
            </span>
            <span className="text-label-sm text-on-surface-variant">
              {showTable ? "Hide" : "Show"}
            </span>
          </button>

          {showTable && (
            <div className="year-table-section mt-4">
              {/* Year / Month tabs */}
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setTableView("year")}
                  className={`rounded-lg px-4 py-1.5 text-label-sm font-medium transition-colors ${
                    tableView === "year"
                      ? "bg-primary text-white"
                      : "border border-surface-border bg-white text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  Year
                </button>
                <button
                  onClick={() => setTableView("month")}
                  className={`rounded-lg px-4 py-1.5 text-label-sm font-medium transition-colors ${
                    tableView === "month"
                      ? "bg-primary text-white"
                      : "border border-surface-border bg-white text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  Month
                </button>
              </div>

              {tableView === "year" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-label-sm">
                    <thead>
                      <tr className="bg-surface-container-low text-label-sm font-semibold text-primary">
                        <th className="px-3 py-2">Year</th>
                        <th className="px-3 py-2 text-right">Total Invested</th>
                        <th className="px-3 py-2 text-right">Interest Earned</th>
                        <th className="px-3 py-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearData.map((row, i) => (
                        <tr
                          key={row.year}
                          className={
                            i % 2 === 0
                              ? "bg-white"
                              : "bg-surface-container-low/50"
                          }
                        >
                          <td className="px-3 py-2 text-on-surface-variant">
                            {row.year}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {fmtCurrency(row.invested)}
                          </td>
                          <td className="px-3 py-2 text-right text-amber-600">
                            {fmtCurrency(row.interest)}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-primary">
                            {fmtCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  {/* Month pagination nav */}
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      onClick={() => setMonthPage((p) => Math.max(0, p - 1))}
                      disabled={monthPage === 0}
                      className="flex items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 text-label-sm text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-40 transition-colors"
                    >
                      ← Year {monthPage}
                    </button>
                    <span className="text-label-md font-semibold text-primary">
                      Year {monthPage + 1}
                    </span>
                    <button
                      onClick={() =>
                        setMonthPage((p) => Math.min(years - 1, p + 1))
                      }
                      disabled={monthPage >= years - 1}
                      className="flex items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 text-label-sm text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-40 transition-colors"
                    >
                      Year {monthPage + 2} →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-label-sm">
                      <thead>
                        <tr className="bg-surface-container-low text-label-sm font-semibold text-primary">
                          <th className="px-3 py-2">Month</th>
                          <th className="px-3 py-2 text-right">Payment</th>
                          <th className="px-3 py-2 text-right">
                            Interest This Month
                          </th>
                          <th className="px-3 py-2 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthRows.map((row, i) => (
                          <tr
                            key={row.month}
                            className={
                              i % 2 === 0
                                ? "bg-white"
                                : "bg-surface-container-low/50"
                            }
                          >
                            <td className="px-3 py-2 text-on-surface-variant">
                              {row.label}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {fmtCurrency(row.payment)}
                            </td>
                            <td className="px-3 py-2 text-right text-amber-600">
                              {fmtCurrency(row.interestThisMonth)}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-primary">
                              {fmtCurrency(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FAQs ── */}
        <section className="mt-stack-lg flex flex-col gap-stack-md">
          <h2 className="text-headline-md text-primary">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-stack-sm">
            {[
              {
                question: "What is compound interest?",
                answer:
                  "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, it causes your balance to grow exponentially over time — often described as 'interest on interest'. The more frequently it compounds, the faster your money grows.",
              },
              {
                question: "How does compounding frequency affect my returns?",
                answer:
                  "The more often interest compounds, the higher your effective annual yield. For example, at 7% annual rate: annual compounding yields 7.00%, monthly yields ~7.23%, and daily yields ~7.25%. Over many years these differences add up meaningfully. Daily compounding is most commonly used in savings accounts and money market funds.",
              },
              {
                question: "What is the Rule of 72?",
                answer:
                  "The Rule of 72 is a quick mental shortcut: divide 72 by the annual interest rate to estimate how many years it takes for an investment to double. At 7% it takes about 72 ÷ 7 ≈ 10.3 years to double. It's a useful approximation that works well for rates between 6% and 10%.",
              },
              {
                question: "Does making regular monthly contributions make a big difference?",
                answer:
                  "Yes — dramatically so. Even modest monthly contributions benefit from compound growth over a long horizon. For example, $10,000 at 7% for 30 years grows to about $76k. Adding just $200/month turns that into ~$308k. This is because every contribution immediately starts compounding, and earlier contributions compound for more periods.",
              },
              {
                question: "Is this calculator suitable for retirement planning?",
                answer:
                  "It's a useful starting point for projecting growth under constant-rate assumptions. However, real-world investing involves variable returns, taxes, inflation, and fees that this tool doesn't model. For formal retirement planning, consult a licensed financial advisor who can account for your specific situation, tax-advantaged accounts (401k, IRA), and withdrawal strategy.",
              },
            ].map((faq) => (
              <details
                key={faq.question}
                className="premium-card group cursor-pointer rounded-lg p-stack-md"
              >
                <summary className="flex list-none items-center justify-between text-label-md text-primary">
                  <span>{faq.question}</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <p className="mt-stack-sm text-body-md text-on-surface-variant">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
