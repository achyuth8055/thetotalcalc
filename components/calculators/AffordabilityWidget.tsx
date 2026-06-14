"use client";

import { useState } from "react";
import { NumberField, PrimaryResult, ResultCard, ResultRow, fmtUSD } from "./ui";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import MobileResultBar from "./MobileResultBar";

// Estimate the home price you can afford from income, debts, and a back-end DTI.
export default function AffordabilityWidget() {
  const [income, setIncome] = useState(90000);
  const [monthlyDebts, setMonthlyDebts] = useState(400);
  const [down, setDown] = useState(40000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [dti, setDti] = useState(36);
  const [taxInsMonthly, setTaxInsMonthly] = useState(400);

  const monthlyIncome = income / 12;
  const maxTotalDebt = (monthlyIncome * dti) / 100;
  const maxHousing = Math.max(0, maxTotalDebt - monthlyDebts);
  const maxPI = Math.max(0, maxHousing - taxInsMonthly);

  const r = rate / 100 / 12;
  const n = term * 12;
  const maxLoan = r === 0 ? maxPI * n : (maxPI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  const maxPrice = maxLoan + down;

  return (
    <ResultCard>
      <div className="grid gap-stack-lg md:grid-cols-2">
        <div className="flex flex-col gap-stack-md">
          <NumberField label="Gross annual income" value={income} onChange={setIncome} min={0} max={1000000} step={1000} prefix="$" />
          <NumberField label="Monthly debt payments" value={monthlyDebts} onChange={setMonthlyDebts} min={0} max={20000} step={50} prefix="$" help="Car loans, student loans, credit-card minimums, etc." />
          <NumberField label="Down payment" value={down} onChange={setDown} min={0} max={1000000} step={5000} prefix="$" />
          <NumberField label="Interest rate" value={rate} onChange={setRate} min={0} max={15} step={0.1} suffix="%" />
          <NumberField label="Loan term" value={term} onChange={setTerm} min={5} max={40} step={1} suffix="years" />
          <NumberField label="Monthly tax + insurance" value={taxInsMonthly} onChange={setTaxInsMonthly} min={0} max={5000} step={50} prefix="$" />
          <NumberField label="Debt-to-income limit" value={dti} onChange={setDti} min={20} max={50} step={1} suffix="%" help="Lenders commonly use 36% (back-end). Some allow up to 43-45%." />
        </div>

        <div id="results" className="flex flex-col gap-stack-md scroll-mt-24">
          <PrimaryResult label="Estimated home price you can afford" value={fmtUSD(maxPrice)} note={`Based on a ${dti}% debt-to-income limit`} />
          <div>
            <ResultRow label="Max total monthly debt" value={fmtUSD(maxTotalDebt)} />
            <ResultRow label="Max housing payment" value={fmtUSD(maxHousing)} />
            <ResultRow label="Max principal & interest" value={fmtUSD(maxPI)} />
            <ResultRow label="Max loan amount" value={fmtUSD(maxLoan)} />
            <ResultRow label="Plus down payment" value={fmtUSD(down)} />
          </div>
          {maxTotalDebt > 0 && (
            <div className="mt-2">
              <p className="text-label-sm font-semibold text-on-surface-variant mb-2">Monthly Budget Breakdown</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "P&I Payment", value: Math.round(Math.max(0, maxPI)) },
                      { name: "Tax + Insurance", value: Math.round(taxInsMonthly) },
                      { name: "Existing Debts", value: Math.round(monthlyDebts) },
                      { name: "Remaining Budget", value: Math.round(Math.max(0, monthlyIncome - maxTotalDebt)) },
                    ].filter((s) => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f97316" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}/mo`, undefined]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      <MobileResultBar
        label="Home price you can afford"
        value={fmtUSD(maxPrice)}
        sub={`Max loan ${fmtUSD(maxLoan)}`}
      />
    </ResultCard>
  );
}
