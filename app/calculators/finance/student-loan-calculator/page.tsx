"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type RepaymentPlan = "standard" | "extended" | "idr" | "graduated";

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia",
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

interface PlanResult {
  monthly: number;
  totalPaid: number;
  totalInterest: number;
  payoffDate: string;
  payments: number;
  forgiven?: number;
}

function calcStandard(balance: number, rate: number, months: number): PlanResult {
  const r = rate / 100 / 12;
  if (balance <= 0 || months <= 0) return { monthly: 0, totalPaid: 0, totalInterest: 0, payoffDate: "", payments: 0 };
  const monthly = r === 0 ? balance / months : (balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPaid = monthly * months;
  const totalInterest = totalPaid - balance;
  const payoffDate = new Date(Date.now() + months * 30.44 * 24 * 3600 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return { monthly, totalPaid, totalInterest, payoffDate, payments: months };
}

function calcGraduated(balance: number, rate: number): PlanResult {
  const r = rate / 100 / 12;
  const totalMonths = 120;
  // Payments increase 2% every 24 months (5 periods of 24 months = 120 months)
  let lo = balance * r / 100, hi = balance * 0.5;
  let p0 = balance * r;
  for (let iter = 0; iter < 60; iter++) {
    p0 = (lo + hi) / 2;
    let remaining = balance;
    let totalPaid = 0;
    for (let period = 0; period < 5; period++) {
      const payment = p0 * Math.pow(1.02, period);
      for (let m = 0; m < 24; m++) {
        const interest = remaining * r;
        remaining = remaining + interest - payment;
        totalPaid += payment;
      }
    }
    if (remaining > 0.01) lo = p0;
    else hi = p0;
  }
  let remaining = balance;
  let totalPaid = 0;
  for (let period = 0; period < 5; period++) {
    const payment = p0 * Math.pow(1.02, period);
    for (let m = 0; m < 24; m++) {
      const interest = remaining * r;
      remaining = Math.max(0, remaining + interest - payment);
      totalPaid += payment;
    }
  }
  const totalInterest = totalPaid - balance;
  const payoffDate = new Date(Date.now() + totalMonths * 30.44 * 24 * 3600 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return { monthly: p0, totalPaid, totalInterest, payoffDate, payments: totalMonths };
}

function calcIDR(balance: number, rate: number, income: number, familySize: number): PlanResult {
  const povertyLine = familySize * 15060 * 1.5;
  const discretionary = Math.max(0, income - povertyLine);
  const monthly = (discretionary * 0.10) / 12;
  const r = rate / 100 / 12;
  const maxPayments = 240; // 20 years (or 120 for PSLF)
  let remaining = balance;
  let totalPaid = 0;
  let months = 0;
  while (remaining > 0 && months < maxPayments) {
    const interest = remaining * r;
    remaining = remaining + interest - monthly;
    totalPaid += monthly;
    months++;
  }
  const forgiven = remaining > 0 ? remaining : 0;
  const payoffDate = new Date(Date.now() + months * 30.44 * 24 * 3600 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return { monthly, totalPaid, totalInterest: totalPaid - (balance - forgiven), payoffDate, payments: months, forgiven: forgiven > 0 ? forgiven : 0 };
}

// Compute monthly balance trace for a plan (subsampled every 6 months)
function balanceTrace(balance: number, rate: number, monthly: number, totalPayments: number): number[] {
  const r = rate / 100 / 12;
  const trace: number[] = [];
  let rem = balance;
  for (let m = 0; m <= totalPayments; m++) {
    if (m % 6 === 0) trace.push(Math.max(0, rem));
    if (m < totalPayments) {
      const interest = rem * r;
      rem = Math.max(0, rem + interest - monthly);
    }
  }
  return trace;
}

function graduatedBalanceTrace(balance: number, rate: number, p0: number): number[] {
  const r = rate / 100 / 12;
  const totalMonths = 120;
  const trace: number[] = [];
  let rem = balance;
  let m = 0;
  for (let period = 0; period < 5; period++) {
    const payment = p0 * Math.pow(1.02, period);
    for (let pm = 0; pm < 24; pm++, m++) {
      if (m % 6 === 0) trace.push(Math.max(0, rem));
      const interest = rem * r;
      rem = Math.max(0, rem + interest - payment);
    }
  }
  trace.push(0);
  return trace;
}

export default function StudentLoanCalculator() {
  const [loanBalance, setLoanBalance] = useState(30000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [activeTab, setActiveTab] = useState<RepaymentPlan>("standard");
  const [income, setIncome] = useState(50000);
  const [familySize, setFamilySize] = useState(1);

  const [results, setResults] = useState<Record<RepaymentPlan, PlanResult | null>>({
    standard: null, extended: null, idr: null, graduated: null,
  });

  const [payoffData, setPayoffData] = useState<{ month: number; standard: number; extended: number; idr: number; graduated: number }[]>([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["student-loan", ...recent.filter((id: string) => id !== "student-loan")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [loanBalance, interestRate, income, familySize]);

  const calculate = () => {
    if (loanBalance <= 0) return;

    const standard = calcStandard(loanBalance, interestRate, 120);
    const extended = calcStandard(loanBalance, interestRate, 300);
    const idr = calcIDR(loanBalance, interestRate, income, familySize);
    const graduated = calcGraduated(loanBalance, interestRate);

    setResults({ standard, extended, idr, graduated });

    // Build payoff chart data (subsampled every 6 months)
    const stdTrace = standard ? balanceTrace(loanBalance, interestRate, standard.monthly, standard.payments) : [];
    const extTrace = extended ? balanceTrace(loanBalance, interestRate, extended.monthly, extended.payments) : [];
    const idrTrace = idr ? balanceTrace(loanBalance, interestRate, idr.monthly, idr.payments) : [];
    const gradTrace = graduated ? graduatedBalanceTrace(loanBalance, interestRate, graduated.monthly) : [];

    const maxLen = Math.max(stdTrace.length, extTrace.length, idrTrace.length, gradTrace.length);
    const data: { month: number; standard: number; extended: number; idr: number; graduated: number }[] = [];
    for (let i = 0; i < maxLen; i++) {
      data.push({
        month: i * 6,
        standard: stdTrace[i] ?? 0,
        extended: extTrace[i] ?? 0,
        idr: idrTrace[i] ?? 0,
        graduated: gradTrace[i] ?? 0,
      });
    }
    setPayoffData(data);
  };

  const planLabels: Record<RepaymentPlan, string> = {
    standard: "Standard (10yr)",
    extended: "Extended (25yr)",
    idr: "SAVE/IDR",
    graduated: "Graduated",
  };

  const activeResult = results[activeTab];

  const planList: RepaymentPlan[] = ["standard", "extended", "idr", "graduated"];
  const cheapest = planList.reduce<RepaymentPlan | null>((best, plan) => {
    const r = results[plan];
    if (!r) return best;
    if (!best || (results[best]?.totalPaid ?? Infinity) > r.totalPaid) return plan;
    return best;
  }, null);

  const povertyLine = familySize * 15060 * 1.5;
  const discretionary = Math.max(0, income - povertyLine);

  const fmtK = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Student Loan Calculator", href: "/calculators/finance/student-loan-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Loan Payoff Calculator</h1>
        <p className="text-base text-gray-600">Compare repayment plans and find the best option for your student loans</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Loan Balance</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={loanBalance}
                  onChange={(e) => setLoanBalance(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={1000} max={200000} step={500} value={loanBalance}
              onChange={(e) => setLoanBalance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$1,000</span><span>$200,000</span></div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Interest Rate</label>
              <div className="flex items-center gap-1">
                <input type="number" value={interestRate} step={0.1}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-orange-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <input type="range" min={0} max={15} step={0.1} value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>

          {/* Plan Tabs */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Repayment Plan</label>
            <div className="grid grid-cols-2 gap-2">
              {planList.map((plan) => (
                <button key={plan} onClick={() => setActiveTab(plan)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${activeTab === plan ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {planLabels[plan]}
                </button>
              ))}
            </div>
          </div>

          {/* IDR Inputs */}
          {activeTab === "idr" && (
            <div className="space-y-4 border-t pt-4">
              <p className="text-xs text-blue-700 bg-blue-50 rounded p-2">SAVE plan: payments are 10% of discretionary income (income above 150% of poverty line)</p>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Annual Income</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">$</span>
                    <input type="number" value={income}
                      onChange={(e) => setIncome(Number(e.target.value) || 0)}
                      className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <input type="range" min={0} max={200000} step={1000} value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Family Size</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7,8].map((n) => (
                    <button key={n} onClick={() => setFamilySize(n)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold border transition-colors ${familySize === n ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between"><span>Poverty line (150% FPL):</span><span className="font-semibold">{fmt(povertyLine)}</span></div>
                <div className="flex justify-between"><span>Discretionary income:</span><span className="font-semibold">{fmt(discretionary)}</span></div>
                <div className="flex justify-between"><span>10% of discretionary:</span><span className="font-semibold">{fmt(discretionary * 0.10)}/yr</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {activeResult && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{planLabels[activeTab]} Plan</div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                <div className="text-4xl font-bold text-blue-600">{fmtD(activeResult.monthly)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Paid</div>
                  <div className="text-lg font-bold text-gray-800">{fmt(activeResult.totalPaid)}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Interest</div>
                  <div className="text-lg font-bold text-red-600">{fmt(activeResult.totalInterest)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Payoff Date</div>
                  <div className="text-lg font-bold text-green-700">{activeResult.payoffDate}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Number of Payments</div>
                  <div className="text-lg font-bold text-purple-700">{activeResult.payments}</div>
                </div>
              </div>
              {activeTab === "idr" && activeResult.forgiven !== undefined && activeResult.forgiven > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 font-semibold mb-1">Balance Forgiven after 20 years: {fmt(activeResult.forgiven)}</p>
                  <p className="text-xs text-yellow-700">PSLF: qualifying borrowers can have the remaining balance forgiven after just 120 payments (10 years) while working for a qualifying public service employer.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Plan Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600 font-semibold">Plan</th>
                <th className="text-right py-2 text-gray-600 font-semibold">Monthly Payment</th>
                <th className="text-right py-2 text-gray-600 font-semibold">Total Paid</th>
                <th className="text-right py-2 text-gray-600 font-semibold">Total Interest</th>
                <th className="text-right py-2 text-gray-600 font-semibold">Payoff Date</th>
              </tr>
            </thead>
            <tbody>
              {planList.map((plan) => {
                const r = results[plan];
                const isCheapest = plan === cheapest;
                return (
                  <tr key={plan} className={`border-b border-gray-100 ${isCheapest ? "bg-green-50" : ""} ${activeTab === plan ? "font-semibold" : ""}`}>
                    <td className="py-2.5 text-gray-800">
                      <span>{planLabels[plan]}</span>
                      {isCheapest && <span className="ml-2 text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full">Cheapest</span>}
                    </td>
                    <td className="py-2.5 text-right text-blue-600">{r ? fmtD(r.monthly) : "—"}</td>
                    <td className="py-2.5 text-right text-gray-700">{r ? fmt(r.totalPaid) : "—"}</td>
                    <td className="py-2.5 text-right text-red-500">{r ? fmt(r.totalInterest) : "—"}</td>
                    <td className="py-2.5 text-right text-gray-600">{r?.payoffDate || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      {payoffData.length > 1 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Loan Balance Over Time by Repayment Plan</h3>
            <button
              onClick={() => window.print()}
              className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
            >
              ↓ PDF
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={payoffData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `Mo ${v}`}
                label={{ value: "Month", position: "insideBottomRight", offset: -4, fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtK} width={56} />
              <Tooltip
                formatter={(value: number, name: string) => [fmt(value), name]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="standard" stroke="#3b82f6" strokeWidth={2} dot={false} name="Standard (10yr)" />
              <Line type="monotone" dataKey="extended" stroke="#f97316" strokeWidth={2} dot={false} name="Extended (25yr)" />
              <Line type="monotone" dataKey="idr" stroke="#22c55e" strokeWidth={2} dot={false} name="SAVE/IDR" />
              <Line type="monotone" dataKey="graduated" stroke="#a855f7" strokeWidth={2} dot={false} name="Graduated" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">Remaining balance shown every 6 months. IDR line may end at month 240 with forgiven balance.</p>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Standard Plan:</strong> Fixed payments over 10 years — lowest total interest but highest monthly payment.</p>
            <p><strong>Extended Plan:</strong> Lower monthly payments spread over 25 years — significantly more interest paid over time.</p>
            <p><strong>SAVE/IDR Plan:</strong> Payments based on 10% of discretionary income (income above 150% of the federal poverty line for your family size). Remaining balance forgiven after 20–25 years. PSLF borrowers can get forgiveness after 120 qualifying payments.</p>
            <p><strong>Graduated Plan:</strong> Payments start lower and increase roughly 2% every two years, designed for borrowers expecting income growth.</p>
          </div>
        }
        faqs={[
          { question: "What is SAVE and how is it different from IBR?", answer: "SAVE (Saving on a Valuable Education) is the newest IDR plan. It calculates payments on 10% of discretionary income defined as income above 225% of the poverty line for undergrad loans (we use 150% for the standard SAVE formula). It replaced REPAYE and generally has lower payments than older IDR plans." },
          { question: "What is Public Service Loan Forgiveness (PSLF)?", answer: "PSLF forgives the remaining balance on Direct Loans after 120 qualifying monthly payments (10 years) while working full-time for a qualifying government or non-profit employer. You must be on an IDR plan." },
          { question: "Can I switch repayment plans?", answer: "Yes — federal student loan borrowers can switch between repayment plans at any time by contacting their servicer or via studentaid.gov." },
          { question: "Does refinancing affect IDR eligibility?", answer: "Yes — refinancing federal loans with a private lender removes eligibility for IDR plans, PSLF, and federal protections. Consider this carefully before refinancing." },
        ]}
        relatedCalculators={[
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
