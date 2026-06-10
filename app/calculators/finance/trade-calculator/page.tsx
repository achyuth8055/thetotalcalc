"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function TradeCalculator() {
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(120);
  const [shares, setShares] = useState(50);
  const [buyFee, setBuyFee] = useState(0);
  const [sellFee, setSellFee] = useState(0);
  const [result, setResult] = useState<{
    totalInvested: number;
    totalRevenue: number;
    grossProfit: number;
    netProfit: number;
    roi: number;
    breakEven: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["trade", ...recent.filter((id: string) => id !== "trade")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [buyPrice, sellPrice, shares, buyFee, sellFee]);

  const calculate = () => {
    const totalInvested = buyPrice * shares + buyFee;
    const totalRevenue = sellPrice * shares - sellFee;
    const grossProfit = (sellPrice - buyPrice) * shares;
    const netProfit = totalRevenue - totalInvested;
    const roi = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;
    const breakEven = shares > 0 ? (totalInvested + sellFee) / shares : 0;

    setResult({ totalInvested, totalRevenue, grossProfit, netProfit, roi, breakEven });
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  const isProfit = result ? result.netProfit >= 0 : true;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Trade Calculator", href: "/calculators/finance/trade-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trade Calculator</h1>
        <p className="text-base text-gray-600">Calculate profit, loss, ROI, and break-even price for any trade</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {[
            { label: "Buy Price (per share/unit)", value: buyPrice, set: setBuyPrice, min: 0.01, max: 100000, step: 0.01, color: "red", prefix: "$" },
            { label: "Sell Price (per share/unit)", value: sellPrice, set: setSellPrice, min: 0.01, max: 100000, step: 0.01, color: "green", prefix: "$" },
            { label: "Quantity (shares/units)", value: shares, set: setShares, min: 1, max: 100000, step: 1, color: "blue" },
          ].map(({ label, value, set, min, max, step, color, prefix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input type="number" value={value} step={step} min={min}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Buy Fee / Commission</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={buyFee} min={0} step={0.01}
                  onChange={(e) => setBuyFee(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-700 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Sell Fee / Commission</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={sellFee} min={0} step={0.01}
                  onChange={(e) => setSellFee(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-700 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              <div className={`border-2 rounded-lg p-4 text-center ${isProfit ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="text-sm text-gray-600 mb-1">Net Profit / Loss</div>
                <div className={`text-4xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                  {result.netProfit >= 0 ? "+" : ""}{fmt(result.netProfit)}
                </div>
                <div className={`text-sm font-semibold mt-1 ${isProfit ? "text-green-700" : "text-red-700"}`}>
                  ROI: {result.roi >= 0 ? "+" : ""}{result.roi.toFixed(2)}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Cost</div>
                  <div className="font-bold text-red-700 text-sm">{fmt(result.totalInvested)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                  <div className="font-bold text-green-700 text-sm">{fmt(result.totalRevenue)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Gross Profit</div>
                  <div className={`font-bold text-sm ${result.grossProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {result.grossProfit >= 0 ? "+" : ""}{fmt(result.grossProfit)}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Break-Even Price</div>
                  <div className="font-bold text-yellow-700 text-sm">{fmt(result.breakEven)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout title="" description=""
        explanation={<p>Enter your buy and sell prices, quantity, and any commissions to instantly see profit/loss, ROI, and your break-even point. Works for stocks, crypto, options, forex, and any traded asset.</p>}
        faqs={[
          { question: "What is ROI?", answer: "Return on Investment = (Net Profit / Total Cost) × 100. It tells you what percentage return you made relative to what you invested." },
          { question: "What is the break-even price?", answer: "The break-even price is the sell price at which you neither profit nor lose, after accounting for all fees." },
          { question: "Does this include taxes?", answer: "No. Capital gains taxes vary by jurisdiction and holding period. Consult a tax professional for your specific situation." },
        ]}
        relatedCalculators={[
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
          { name: "Margin Calculator", href: "/calculators/finance/margin-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Trade Profit Formulas</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
            <p><strong>Gross Profit</strong> = (Sell Price − Buy Price) × Quantity</p>
            <p><strong>Net Profit</strong> = Gross Profit − Buy Fee − Sell Fee</p>
            <p><strong>ROI</strong> = (Net Profit / Total Cost) × 100</p>
            <p><strong>Break-Even</strong> = (Total Cost + Sell Fee) / Quantity</p>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
