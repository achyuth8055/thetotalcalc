"use client";

import { useState } from "react";
import { PrimaryResult, ResultCard, ResultRow, fmtUSD } from "./ui";

interface Debt {
  id: number;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

type Strategy = "avalanche" | "snowball";

function simulate(debts: Debt[], extra: number, strategy: Strategy) {
  const active = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d, bal: d.balance }));
  if (active.length === 0) return { months: 0, totalInterest: 0, totalPaid: 0, order: [] as string[], payable: true };

  const budget = active.reduce((s, d) => s + d.minPayment, 0) + extra;
  const order = [...active].sort((a, b) => (strategy === "avalanche" ? b.apr - a.apr : a.bal - b.bal));

  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const clearedOrder: string[] = [];

  while (active.some((d) => d.bal > 0.005) && month < 1200) {
    month++;
    // Accrue interest
    for (const d of active) {
      if (d.bal > 0) {
        const i = (d.bal * d.apr) / 100 / 12;
        d.bal += i;
        totalInterest += i;
      }
    }
    let remaining = budget;
    // Minimum payments
    for (const d of active) {
      if (d.bal > 0 && remaining > 0) {
        const pay = Math.min(d.bal, d.minPayment, remaining);
        d.bal -= pay;
        remaining -= pay;
        totalPaid += pay;
      }
    }
    // Extra toward the priority target(s)
    for (const d of order) {
      if (remaining <= 0) break;
      if (d.bal > 0) {
        const pay = Math.min(d.bal, remaining);
        d.bal -= pay;
        remaining -= pay;
        totalPaid += pay;
      }
    }
    // Track newly cleared debts
    for (const d of order) {
      if (d.bal <= 0.005 && !clearedOrder.includes(d.name)) clearedOrder.push(d.name);
    }
  }

  return { months: month, totalInterest, totalPaid, order: clearedOrder, payable: month < 1200 };
}

function describeMonths(m: number) {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  return `${y > 0 ? `${y} yr ` : ""}${mo} mo`;
}

let nextId = 4;

export default function DebtPayoffWidget() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit card", balance: 6000, apr: 22, minPayment: 150 },
    { id: 2, name: "Car loan", balance: 12000, apr: 7, minPayment: 280 },
    { id: 3, name: "Student loan", balance: 18000, apr: 5, minPayment: 200 },
  ]);
  const [extra, setExtra] = useState(200);
  const [strategy, setStrategy] = useState<Strategy>("avalanche");

  const update = (id: number, field: keyof Debt, value: string) => {
    setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, [field]: field === "name" ? value : Number(value) || 0 } : d)));
  };
  const addDebt = () => setDebts((ds) => [...ds, { id: nextId++, name: "New debt", balance: 1000, apr: 15, minPayment: 50 }]);
  const removeDebt = (id: number) => setDebts((ds) => ds.filter((d) => d.id !== id));

  const result = simulate(debts, extra, strategy);
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);

  return (
    <ResultCard>
      <div className="flex flex-col gap-stack-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label-sm font-semibold text-on-surface-variant">Strategy:</span>
          {(["avalanche", "snowball"] as Strategy[]).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`rounded-full border px-4 py-1.5 text-label-sm transition-colors ${
                strategy === s ? "border-primary bg-primary-fixed text-primary" : "border-surface-border text-on-surface-variant hover:border-primary"
              }`}
            >
              {s === "avalanche" ? "Avalanche (highest APR first)" : "Snowball (smallest balance first)"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-label-sm">
            <thead>
              <tr className="text-left text-on-surface-variant">
                <th className="py-1 pr-2 font-semibold">Debt</th>
                <th className="py-1 pr-2 font-semibold">Balance</th>
                <th className="py-1 pr-2 font-semibold">APR %</th>
                <th className="py-1 pr-2 font-semibold">Min/mo</th>
                <th className="py-1" />
              </tr>
            </thead>
            <tbody>
              {debts.map((d) => (
                <tr key={d.id}>
                  <td className="py-1 pr-2"><input value={d.name} onChange={(e) => update(d.id, "name", e.target.value)} className="w-28 rounded border border-surface-border bg-surface px-2 py-1 text-on-surface focus:border-primary focus:outline-none" /></td>
                  <td className="py-1 pr-2"><input type="number" value={d.balance} onChange={(e) => update(d.id, "balance", e.target.value)} className="w-24 rounded border border-surface-border bg-surface px-2 py-1 text-on-surface focus:border-primary focus:outline-none" /></td>
                  <td className="py-1 pr-2"><input type="number" value={d.apr} step={0.1} onChange={(e) => update(d.id, "apr", e.target.value)} className="w-16 rounded border border-surface-border bg-surface px-2 py-1 text-on-surface focus:border-primary focus:outline-none" /></td>
                  <td className="py-1 pr-2"><input type="number" value={d.minPayment} onChange={(e) => update(d.id, "minPayment", e.target.value)} className="w-20 rounded border border-surface-border bg-surface px-2 py-1 text-on-surface focus:border-primary focus:outline-none" /></td>
                  <td className="py-1"><button onClick={() => removeDebt(d.id)} aria-label={`Remove ${d.name}`} className="material-symbols-outlined text-on-surface-variant hover:text-error">close</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={addDebt} className="inline-flex items-center gap-1 rounded-full border border-surface-border px-4 py-1.5 text-label-sm text-primary hover:border-primary">
            <span className="material-symbols-outlined text-[18px]">add</span> Add debt
          </button>
          <label className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            Extra per month
            <span className="flex items-center rounded-lg border border-surface-border bg-surface px-2 focus-within:border-primary">
              <span className="text-on-surface-variant">$</span>
              <input type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value) || 0)} className="w-24 border-none bg-transparent px-1 py-1.5 text-on-surface focus:outline-none" />
            </span>
          </label>
        </div>

        {result.payable ? (
          <div className="grid gap-stack-md md:grid-cols-2">
            <PrimaryResult label="Debt-free in" value={describeMonths(result.months)} note={`Paying ${fmtUSD(debts.reduce((s, d) => s + d.minPayment, 0) + extra)}/mo total`} />
            <div>
              <ResultRow label="Total balance" value={fmtUSD(totalBalance)} />
              <ResultRow label="Total interest paid" value={fmtUSD(result.totalInterest)} />
              <ResultRow label="Total paid" value={fmtUSD(result.totalPaid)} />
              <ResultRow label="Payoff order" value={result.order.join(" → ") || "-"} />
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-error bg-error-container/30 p-stack-md text-label-md text-error">
            With these payments the balances are not being paid down (interest exceeds payments). Increase the minimum or extra payment.
          </p>
        )}
      </div>
    </ResultCard>
  );
}
