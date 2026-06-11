"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

interface FinancialItem {
  id: number;
  label: string;
  amount: number;
}

let assetNextId = 20;
let liabilityNextId = 30;

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState<FinancialItem[]>([
    { id: 1, label: "Checking / Savings", amount: 15000 },
    { id: 2, label: "Investments", amount: 30000 },
    { id: 3, label: "Retirement Accounts", amount: 50000 },
    { id: 4, label: "Home Value", amount: 350000 },
    { id: 5, label: "Car Value", amount: 20000 },
    { id: 6, label: "Other Assets", amount: 5000 },
  ]);

  const [liabilities, setLiabilities] = useState<FinancialItem[]>([
    { id: 11, label: "Mortgage Balance", amount: 280000 },
    { id: 12, label: "Car Loan", amount: 12000 },
    { id: 13, label: "Student Loans", amount: 25000 },
    { id: 14, label: "Credit Card Debt", amount: 3000 },
    { id: 15, label: "Other Debts", amount: 0 },
  ]);

  const [result, setResult] = useState<{
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    assetPct: number;
    liabilityPct: number;
    healthRating: string;
    healthColor: string;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["net-worth", ...recent.filter((id: string) => id !== "net-worth")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [assets, liabilities]);

  const calculate = () => {
    const totalAssets = assets.reduce((sum, a) => sum + (a.amount || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (l.amount || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    const total = totalAssets + totalLiabilities;
    const assetPct = total > 0 ? (totalAssets / total) * 100 : 50;
    const liabilityPct = total > 0 ? (totalLiabilities / total) * 100 : 50;

    let healthRating = "Building Phase";
    let healthColor = "text-red-600";
    if (netWorth < 0) { healthRating = "Building Phase"; healthColor = "text-red-600"; }
    else if (netWorth < 50000) { healthRating = "Starting Strong"; healthColor = "text-amber-600"; }
    else if (netWorth < 500000) { healthRating = "Growing Wealth"; healthColor = "text-blue-600"; }
    else { healthRating = "Wealth Stage"; healthColor = "text-green-600"; }

    setResult({ totalAssets, totalLiabilities, netWorth, assetPct, liabilityPct, healthRating, healthColor });
  };

  const updateItem = (list: FinancialItem[], setList: React.Dispatch<React.SetStateAction<FinancialItem[]>>, id: number, field: "label" | "amount", value: string | number) => {
    setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = (setList: React.Dispatch<React.SetStateAction<FinancialItem[]>>, isAsset: boolean) => {
    const id = isAsset ? assetNextId++ : liabilityNextId++;
    setList(prev => [...prev, { id, label: isAsset ? "New Asset" : "New Debt", amount: 0 }]);
  };

  const removeItem = (setList: React.Dispatch<React.SetStateAction<FinancialItem[]>>, id: number) => {
    setList(prev => prev.filter(item => item.id !== id));
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(n));

  const ItemList = ({
    items, setItems, isAsset, color
  }: {
    items: FinancialItem[];
    setItems: React.Dispatch<React.SetStateAction<FinancialItem[]>>;
    isAsset: boolean;
    color: string;
  }) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            type="text"
            value={item.label}
            onChange={(e) => updateItem(items, setItems, item.id, "label", e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">$</span>
            <input
              type="number"
              value={item.amount}
              onChange={(e) => updateItem(items, setItems, item.id, "amount", Number(e.target.value) || 0)}
              className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold focus:ring-2 focus:border-transparent ${color}`}
            />
          </div>
          <button onClick={() => removeItem(setItems, item.id)}
            className="text-gray-400 hover:text-red-500 text-lg leading-none font-bold">×</button>
        </div>
      ))}
      <button
        onClick={() => addItem(setItems, isAsset)}
        className="w-full mt-1 py-1.5 text-xs border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
        + Add {isAsset ? "Asset" : "Liability"}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Net Worth Calculator", href: "/calculators/finance/net-worth-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Net Worth Calculator</h1>
        <p className="text-base text-gray-600">Calculate your total net worth by entering your assets and liabilities</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-green-700">ASSETS</h2>
              {result && <span className="text-sm font-semibold text-green-700">{fmt(result.totalAssets)}</span>}
            </div>
            <ItemList items={assets} setItems={setAssets} isAsset={true} color="text-green-700 focus:ring-green-500" />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-red-600">LIABILITIES</h2>
              {result && <span className="text-sm font-semibold text-red-600">{fmt(result.totalLiabilities)}</span>}
            </div>
            <ItemList items={liabilities} setItems={setLiabilities} isAsset={false} color="text-red-600 focus:ring-red-500" />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className={`border-2 rounded-lg p-4 text-center ${result.netWorth >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="text-sm text-gray-600 mb-1">Your Net Worth</div>
                <div className={`text-4xl font-bold ${result.netWorth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {result.netWorth < 0 ? "-" : ""}{fmt(result.netWorth)}
                </div>
                <div className={`text-sm font-semibold mt-1 ${result.healthColor}`}>{result.healthRating}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Assets</div>
                  <div className="text-xl font-bold text-green-700">{fmt(result.totalAssets)}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Liabilities</div>
                  <div className="text-xl font-bold text-red-600">{fmt(result.totalLiabilities)}</div>
                </div>
              </div>

              {/* Visual bar */}
              <div>
                <div className="text-xs text-gray-500 mb-1">Assets vs Liabilities</div>
                <div className="w-full h-5 rounded-full overflow-hidden flex bg-gray-100">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${result.assetPct}%` }}
                  />
                  <div
                    className="bg-red-400 h-full transition-all duration-300"
                    style={{ width: `${result.liabilityPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-green-600 font-medium">Assets {result.assetPct.toFixed(0)}%</span>
                  <span className="text-red-500 font-medium">Debts {result.liabilityPct.toFixed(0)}%</span>
                </div>
              </div>

              {/* Health stages */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-700 mb-2">Net Worth Health Stages</div>
                <div className="space-y-1 text-xs">
                  {[
                    { label: "Building Phase", range: "Negative", color: "text-red-600" },
                    { label: "Starting Strong", range: "$0 – $50K", color: "text-amber-600" },
                    { label: "Growing Wealth", range: "$50K – $500K", color: "text-blue-600" },
                    { label: "Wealth Stage", range: "$500K+", color: "text-green-600" },
                  ].map(({ label, range, color }) => (
                    <div key={label} className={`flex justify-between ${result.healthRating === label ? "font-bold" : "opacity-60"}`}>
                      <span className={color}>{label}</span>
                      <span className="text-gray-500">{range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">Net worth is the single most important number in personal finance. It's the foundation of your financial health and the key metric for tracking long-term wealth building progress.</p>
            <p className="mb-3"><strong>Net Worth = Total Assets − Total Liabilities</strong></p>
            <p>Assets are everything you own with value. Liabilities are everything you owe. The goal is to grow assets over time while reducing liabilities — the gap between them is your net worth.</p>
          </div>
        }
        faqs={[
          { question: "What is a good net worth by age?", answer: "A common benchmark is 1× your annual income by age 30, 3× by 40, 6× by 50, and 8× by 60. However, these are rough guides — net worth trajectories vary greatly based on income, location, and financial goals. The most important thing is a positive trend over time." },
          { question: "Should I include my home in net worth?", answer: "Yes, your home's current market value is an asset, and the mortgage balance is a liability. The difference (home equity) contributes to net worth. However, since you can't easily spend home equity, many financial planners also track 'liquid net worth' which excludes real estate and retirement accounts." },
          { question: "How often should I calculate my net worth?", answer: "Once a month or once a quarter is ideal. Monthly tracking helps you see trends and spot problems early. The goal isn't to maximize the number every month — it's to ensure the long-term trajectory is upward." },
          { question: "What's the fastest way to increase net worth?", answer: "There are two paths: increase assets (save more, invest, grow income) or reduce liabilities (pay off debt, avoid new debt). High-interest debt reduction often has the best 'return' — paying off a 20% APR credit card is equivalent to a guaranteed 20% investment return." },
        ]}
        relatedCalculators={[
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Debt Payoff Calculator", href: "/calculators/finance/debt-payoff-calculator" },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Building Net Worth Over Time</h2>
          <p className="text-sm text-gray-700">Net worth grows through consistent saving, smart investing, and debt reduction. Track it regularly to stay on course toward your financial goals.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
