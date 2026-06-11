"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

interface Debt {
  id: number;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

interface PayoffResult {
  months: number;
  totalInterest: number;
  payoffOrder: string[];
  payoffDate: string;
}

function simulatePayoff(debts: Debt[], extraPayment: number, strategy: "avalanche" | "snowball"): PayoffResult {
  if (debts.length === 0) return { months: 0, totalInterest: 0, payoffOrder: [], payoffDate: "" };

  // Deep copy
  let remaining = debts.map((d) => ({ ...d, balance: d.balance }));
  const payoffOrder: string[] = [];
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 600; // 50 years

  while (remaining.length > 0 && months < maxMonths) {
    months++;

    // Add interest to all
    remaining = remaining.map((d) => {
      const interest = d.balance * (d.rate / 100 / 12);
      totalInterest += interest;
      return { ...d, balance: d.balance + interest };
    });

    // Determine target debt
    let target: Debt;
    if (strategy === "avalanche") {
      target = [...remaining].sort((a, b) => b.rate - a.rate)[0];
    } else {
      target = [...remaining].sort((a, b) => a.balance - b.balance)[0];
    }

    // Pay minimums on all except target
    remaining = remaining.map((d) => {
      if (d.id !== target.id) {
        return { ...d, balance: Math.max(0, d.balance - d.minPayment) };
      }
      return d;
    });

    // Pay minimums + extra on target
    const targetIdx = remaining.findIndex((d) => d.id === target.id);
    const totalMinOthers = remaining.reduce((sum, d) => (d.id !== target.id ? sum + d.minPayment : sum), 0);
    const budgetForTarget = target.minPayment + extraPayment;
    remaining[targetIdx].balance = Math.max(0, remaining[targetIdx].balance - budgetForTarget);

    // Remove paid-off debts
    const paid = remaining.filter((d) => d.balance <= 0.01);
    paid.forEach((d) => payoffOrder.push(d.name));
    remaining = remaining.filter((d) => d.balance > 0.01);

    // Roll freed-up minimum payments into extra for subsequent months
    // (handled implicitly as we always put extra toward target)
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + months);
  const payoffDateStr = payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return { months, totalInterest, payoffOrder, payoffDate: payoffDateStr };
}

let nextId = 4;

const defaultDebts: Debt[] = [
  { id: 1, name: "Credit Card", balance: 5000, rate: 22, minPayment: 100 },
  { id: 2, name: "Car Loan", balance: 12000, rate: 7, minPayment: 280 },
  { id: 3, name: "Student Loan", balance: 8500, rate: 5.5, minPayment: 90 },
];

export default function DebtPayoffPlanner() {
  const [debts, setDebts] = useState<Debt[]>(defaultDebts);
  const [extraPayment, setExtraPayment] = useState(200);
  const [avalanche, setAvalanche] = useState<PayoffResult | null>(null);
  const [snowball, setSnowball] = useState<PayoffResult | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["debt-payoff", ...recent.filter((id: string) => id !== "debt-payoff")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [debts, extraPayment]);

  const calculate = () => {
    if (debts.length === 0) { setAvalanche(null); setSnowball(null); return; }
    setAvalanche(simulatePayoff(debts, extraPayment, "avalanche"));
    setSnowball(simulatePayoff(debts, extraPayment, "snowball"));
  };

  const addDebt = () => {
    setDebts([...debts, { id: nextId++, name: "New Debt", balance: 1000, rate: 10, minPayment: 25 }]);
  };

  const updateDebt = (id: number, field: keyof Debt, value: string | number) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: field === "name" ? value : Number(value) || 0 } : d)));
  };

  const removeDebt = (id: number) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinPayments = debts.reduce((s, d) => s + d.minPayment, 0);

  const avalancheWins = avalanche && snowball && avalanche.totalInterest <= snowball.totalInterest;
  const monthDiff = avalanche && snowball ? Math.abs(avalanche.months - snowball.months) : 0;
  const interestDiff = avalanche && snowball ? Math.abs(avalanche.totalInterest - snowball.totalInterest) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Debt Payoff Planner", href: "/calculators/finance/debt-payoff-planner" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Debt Payoff Planner</h1>
        <p className="text-base text-gray-600">Compare Avalanche vs Snowball strategies and find your fastest path to debt freedom</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800">Your Debts</h2>
              <button onClick={addDebt}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                + Add Debt
              </button>
            </div>

            <div className="space-y-3">
              {debts.map((debt) => (
                <div key={debt.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-semibold text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Debt name"
                    />
                    <button onClick={() => removeDebt(debt.id)}
                      className="text-red-400 hover:text-red-600 text-xs font-bold px-1">
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Balance ($)</div>
                      <input
                        type="number"
                        value={debt.balance}
                        min={0}
                        onChange={(e) => updateDebt(debt.id, "balance", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-semibold text-green-600 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Rate (%)</div>
                      <input
                        type="number"
                        value={debt.rate}
                        min={0}
                        max={100}
                        step={0.1}
                        onChange={(e) => updateDebt(debt.id, "rate", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-semibold text-red-600 focus:ring-1 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Min. Pmt ($)</div>
                      <input
                        type="number"
                        value={debt.minPayment}
                        min={0}
                        onChange={(e) => updateDebt(debt.id, "minPayment", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-semibold text-blue-600 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500">Total Balance: <span className="font-bold text-gray-800">{fmt(totalBalance)}</span></div>
            <div className="text-xs text-gray-500">Total Min Payments: <span className="font-bold text-gray-800">{fmt(totalMinPayments)}/mo</span></div>
          </div>

          {/* Extra Payment Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Extra Monthly Payment</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={extraPayment} min={0} max={2000} step={25}
                  onChange={(e) => setExtraPayment(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-green-600 focus:ring-1 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={2000} step={25} value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            <p className="text-xs text-gray-400 mt-1">Total monthly budget: {fmt(totalMinPayments + extraPayment)}</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {avalanche && snowball && (
            <div className="space-y-3">
              {/* Recommendation */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Recommended: {avalancheWins ? "Avalanche" : "Snowball"}</div>
                <div className="text-4xl font-bold text-green-600">{fmt(Math.min(avalanche.totalInterest, snowball.totalInterest))}</div>
                <div className="text-xs text-gray-500 mt-1">total interest with best strategy</div>
              </div>

              {/* Comparison */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                {avalancheWins ? (
                  <>
                    <p>Avalanche saves <span className="font-bold text-green-700">{fmt(interestDiff)}</span> in interest compared to Snowball.</p>
                    {monthDiff > 0 && <p>Snowball pays off <span className="font-bold">{monthDiff} month{monthDiff !== 1 ? "s" : ""}</span> {snowball.months < avalanche.months ? "earlier" : "later"}.</p>}
                  </>
                ) : (
                  <>
                    <p>Snowball pays off <span className="font-bold text-green-700">{monthDiff} month{monthDiff !== 1 ? "s" : ""} earlier</span> than Avalanche.</p>
                    {interestDiff > 0 && <p>Avalanche saves <span className="font-bold">{fmt(interestDiff)}</span> more in interest.</p>}
                  </>
                )}
              </div>

              {/* Side by side */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Avalanche", result: avalanche, color: "blue", desc: "Highest rate first" },
                  { label: "Snowball", result: snowball, color: "purple", desc: "Smallest balance first" },
                ].map(({ label, result: r, color, desc }) => (
                  <div key={label} className={`bg-${color}-50 rounded-lg p-3`}>
                    <div className={`text-xs font-bold text-${color}-700 mb-1`}>{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                    <div className={`text-lg font-bold text-${color}-700 mt-1`}>{Math.floor(r.months / 12)}y {r.months % 12}m</div>
                    <div className="text-xs text-gray-500">Interest: {fmt(r.totalInterest)}</div>
                    <div className="text-xs text-gray-500">Debt-free: {r.payoffDate}</div>
                    {r.payoffOrder.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 font-medium mb-1">Payoff order:</div>
                        <ol className="list-decimal list-inside space-y-0.5">
                          {r.payoffOrder.map((name, i) => (
                            <li key={i} className="text-xs text-gray-600">{name}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {debts.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg font-medium mb-2">No debts added</p>
              <p className="text-sm">Click "+ Add Debt" to get started</p>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout title="" description=""
        explanation={
          <div>
            <p className="mb-2">The Avalanche method targets the highest-interest debt first, minimizing total interest paid. The Snowball method targets the smallest balance first, giving you quick psychological wins. Both strategies pay minimums on all other debts.</p>
            <p className="mb-2">As each debt is paid off, that payment "rolls" into the next target, accelerating payoff speed over time. Adding any extra monthly payment significantly reduces both time and interest.</p>
            <p className="text-xs text-gray-500 mt-2">Simulation assumes minimum payments stay constant. Actual results may vary with balance changes and interest compounding.</p>
          </div>
        }
        faqs={[
          { question: "Which strategy saves more money?", answer: "Avalanche almost always saves more money in total interest because you eliminate high-rate debt first. Snowball may cost more in interest but provides motivational milestones by clearing individual debts faster." },
          { question: "What if I can't afford more than minimums?", answer: "Paying only minimums on high-interest debt means most of each payment goes to interest. Even an extra $25–$50/month can meaningfully reduce payoff time. Consider temporarily reducing expenses or finding additional income." },
          { question: "Should I pay off debt or invest?", answer: "Generally, if your debt interest rate exceeds your expected investment return (typically 6–8% for diversified portfolios), prioritize paying off the debt. Low-rate debt (under 4–5%) may not be worth rushing to pay off if you can invest at higher returns." },
          { question: "How does the debt snowball effect work?", answer: "When you pay off a debt completely, you redirect that payment to the next debt on your list. Since you're now putting more money toward fewer debts, the payoff speed accelerates exponentially — this is the snowball effect." },
        ]}
        relatedCalculators={[
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Avalanche vs. Snowball: Which is Right for You?</h2>
          <p className="text-sm text-gray-700">Both strategies work — the best one is the one you'll stick with. The avalanche saves the most money; the snowball builds momentum.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
