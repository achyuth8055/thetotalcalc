"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CarLeaseVsBuyCalculator() {
  const [carPrice, setCarPrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(3000);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [monthlyLease, setMonthlyLease] = useState(400);
  const [residualPct, setResidualPct] = useState(55);
  const [buyLoanTerm, setBuyLoanTerm] = useState(5);
  const [buyRate, setBuyRate] = useState(6.5);
  const [yearsToKeep, setYearsToKeep] = useState(5);
  const [milesPerYear, setMilesPerYear] = useState(12000);
  const [leaseAllowance, setLeaseAllowance] = useState(12000);
  const [salesTax, setSalesTax] = useState(8);

  const [result, setResult] = useState<{
    leaseTotalCost: number;
    buyTotalCost: number;
    leaseMonthly: number;
    buyMonthly: number;
    cheaper: "lease" | "buy";
    difference: number;
    leaseBreakdown: { label: string; value: number }[];
    buyBreakdown: { label: string; value: number }[];
    mileageOverage: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["car-lease-buy", ...recent.filter((id: string) => id !== "car-lease-buy")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [carPrice, downPayment, leaseTerm, monthlyLease, residualPct, buyLoanTerm, buyRate, yearsToKeep, milesPerYear, leaseAllowance, salesTax]);

  const calculate = () => {
    if (carPrice <= 0) return;

    const totalMonths = yearsToKeep * 12;

    // --- Lease total cost ---
    const mileageOverage = Math.max(0, (milesPerYear - leaseAllowance) * yearsToKeep) * 0.25;
    const leasePayments = monthlyLease * Math.min(leaseTerm, totalMonths);
    const leaseCycles = Math.ceil(totalMonths / leaseTerm);
    const totalLeasePayments = monthlyLease * totalMonths;
    const dispositionFee = 350 * leaseCycles;
    const taxOnLease = (monthlyLease * totalMonths) * (salesTax / 100);
    const leaseTotalCost = totalLeasePayments + downPayment + dispositionFee + mileageOverage + taxOnLease;

    // --- Buy total cost ---
    const r = buyRate / 100 / 12;
    const loanAmount = (carPrice - downPayment) * (1 + salesTax / 100);
    const n = buyLoanTerm * 12;
    const buyMonthlyPayment = r === 0 ? loanAmount / n : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalLoanPayments = buyMonthlyPayment * n;
    const residualValue = carPrice * (residualPct / 100) * Math.pow(0.85, yearsToKeep - (leaseTerm / 12));
    const finalCarValue = carPrice * Math.pow(0.85, yearsToKeep);
    const buyTotalCost = totalLoanPayments + downPayment - finalCarValue;

    const leaseMonthly = leaseTotalCost / totalMonths;
    const buyMonthly = buyTotalCost / totalMonths;
    const cheaper = leaseTotalCost < buyTotalCost ? "lease" : "buy";
    const difference = Math.abs(leaseTotalCost - buyTotalCost);

    setResult({
      leaseTotalCost,
      buyTotalCost,
      leaseMonthly,
      buyMonthly,
      cheaper,
      difference,
      mileageOverage,
      leaseBreakdown: [
        { label: "Total Lease Payments", value: totalLeasePayments },
        { label: "Down / Cap Cost Reduction", value: downPayment },
        { label: "Mileage Overage Fees", value: mileageOverage },
        { label: "Disposition Fee(s)", value: dispositionFee },
        { label: "Sales Tax on Payments", value: taxOnLease },
      ],
      buyBreakdown: [
        { label: "Total Loan Payments", value: totalLoanPayments },
        { label: "Down Payment", value: downPayment },
        { label: "Car Value at End (credit)", value: -finalCarValue },
      ],
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Car Lease vs Buy", href: "/calculators/finance/car-lease-vs-buy" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Lease vs Buy Calculator</h1>
        <p className="text-base text-gray-600">Compare the true total cost of leasing vs buying a car over your ownership period</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-700">Car Price</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={5000} max={150000} step={1000} value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-700">Down Payment / Cap Cost Reduction</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={30000} step={500} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <h3 className="text-sm font-bold text-gray-700 border-b pb-1">Lease Details</h3>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Lease Term</label>
            <div className="flex gap-2">
              {[24, 36, 48].map((m) => (
                <button key={m} onClick={() => setLeaseTerm(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${leaseTerm === m ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {m} mo
                </button>
              ))}
            </div>
          </div>

          {[
            { label: "Monthly Lease Payment", value: monthlyLease, set: setMonthlyLease, min: 100, max: 2000, step: 25, prefix: "$" },
            { label: "Residual Value %", value: residualPct, set: setResidualPct, min: 30, max: 80, step: 1, suffix: "%" },
          ].map(({ label, value, set, min, max, step, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          ))}

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Annual Mile Allowance</label>
            <div className="flex gap-2">
              {[10000, 12000, 15000].map((m) => (
                <button key={m} onClick={() => setLeaseAllowance(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${leaseAllowance === m ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {(m / 1000).toFixed(0)}k mi
                </button>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-700 border-b pb-1">Buy Details</h3>
          {[
            { label: "Loan Term", value: buyLoanTerm, set: setBuyLoanTerm, min: 1, max: 7, step: 1, suffix: "yrs" },
            { label: "Buy Interest Rate", value: buyRate, set: setBuyRate, min: 0, max: 20, step: 0.1, suffix: "%" },
            { label: "Years to Keep Car", value: yearsToKeep, set: setYearsToKeep, min: 1, max: 10, step: 1, suffix: "yrs" },
            { label: "Miles per Year (actual)", value: milesPerYear, set: setMilesPerYear, min: 5000, max: 30000, step: 1000, suffix: "mi" },
            { label: "Sales Tax Rate", value: salesTax, set: setSalesTax, min: 0, max: 15, step: 0.25, suffix: "%" },
          ].map(({ label, value, set, min, max, step, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <span className="text-sm text-gray-500">{suffix}</span>
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className={`border-2 rounded-lg p-4 text-center ${result.cheaper === "buy" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
                <div className="text-sm text-gray-600 mb-1">{yearsToKeep}-Year Total - {result.cheaper === "lease" ? "Leasing" : "Buying"} is Cheaper</div>
                <div className={`text-4xl font-bold ${result.cheaper === "buy" ? "text-green-600" : "text-blue-600"}`}>
                  {fmt(result.difference)}
                </div>
                <div className="text-xs text-gray-500 mt-1">cheaper to {result.cheaper}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Lease Total Cost</div>
                  <div className="text-xl font-bold text-blue-700">{fmt(result.leaseTotalCost)}</div>
                  <div className="text-xs text-gray-500">{fmt(result.leaseMonthly)}/mo effective</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Buy Total Cost</div>
                  <div className="text-xl font-bold text-green-700">{fmt(result.buyTotalCost)}</div>
                  <div className="text-xs text-gray-500">{fmt(result.buyMonthly)}/mo effective</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Lease Breakdown</h3>
                <div className="space-y-1">
                  {result.leaseBreakdown.map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-800">{fmt(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Buy Breakdown</h3>
                <div className="space-y-1">
                  {result.buyBreakdown.map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className={`font-medium ${value < 0 ? "text-green-700" : "text-gray-800"}`}>{value < 0 ? `-${fmt(Math.abs(value))}` : fmt(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.mileageOverage > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  <strong>Mileage Warning:</strong> You drive {fmt(milesPerYear - leaseAllowance).replace("$", "")} miles over the lease limit per year. Estimated overage: {fmt(result.mileageOverage)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {result && (() => {
        const barData = [
          { name: "Total Cost", Lease: Math.round(result.leaseTotalCost), Buy: Math.round(result.buyTotalCost) },
          ...result.leaseBreakdown.slice(0, 3).map((item, i) => ({
            name: item.label.replace("Total Lease Payments", "Payments").replace("Down / Cap Cost Reduction", "Down Pmt").replace("Mileage Overage Fees", "Mileage"),
            Lease: Math.round(Math.max(0, item.value)),
            Buy: Math.round(Math.max(0, result.buyBreakdown[i]?.value ?? 0)),
          })),
        ];
        return (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">5-Year Total Cost: Lease vs Buy</h3>
              <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Lease" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Buy" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })()}

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">The lease vs buy comparison looks at the true total cost of each option over the same time horizon. For leasing, this includes all payments, down payment, disposition fees, and potential mileage penalties. For buying, it includes all loan payments and down payment, minus the car's residual value at the end (since you own an asset).</p>
            <p>Leasing typically has lower monthly payments and you drive a newer car, but you build no equity. Buying costs more monthly but you own the asset outright. The breakeven depends heavily on how long you keep the car and how many miles you drive.</p>
          </div>
        }
        faqs={[
          { question: "Why does leasing often appear cheaper short-term but more expensive long-term?", answer: "Lease payments are lower because you're only paying for the car's depreciation during the lease period, not its full value. But you never build equity, and perpetual leasing means perpetual payments. After 5–7 years of ownership, a purchased car is paid off and you drive for free." },
          { question: "What is a residual value?", answer: "The residual value is the car's projected worth at the end of the lease term, set by the leasing company. A higher residual (e.g., 55–60%) means lower monthly payments because you're financing less depreciation. It also determines the buyout price if you want to purchase the car at lease end." },
          { question: "How do mileage overages affect lease cost?", answer: "Most leases allow 10,000–15,000 miles per year. Going over typically costs $0.15–$0.30 per mile. At $0.25/mile, driving 5,000 miles over a 3-year lease costs an extra $3,750 - significantly affecting the lease vs buy calculation." },
          { question: "Is it ever smarter to lease?", answer: "Leasing makes sense if you want a new car every 2–3 years, drive under the mileage limit, don't want maintenance worries (new car warranty), or use it for business (lease payments may be deductible). If you keep cars long-term or drive many miles, buying is almost always better financially." },
        ]}
        relatedCalculators={[
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Net Worth Calculator", href: "/calculators/finance/net-worth-calculator" },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Lease vs Buy</h2>
          <p className="text-sm text-gray-700">This calculator uses the concept of total cost of ownership - every dollar you spend (or avoid spending) over the comparison period.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
