"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import CurrencySelector from "@/components/CurrencySelector";
import { detectCurrency, formatCurrency as formatCurrencyUtil, CurrencyConfig, CURRENCIES } from "@/lib/currency";

export default function BrokerageCalculator() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [segment, setSegment] = useState<"equity" | "futures" | "options">("equity");
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1100);
  const [quantity, setQuantity] = useState(100);
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [result, setResult] = useState<{
    grossProfit: number;
    brokerage: number;
    stt: number;
    exchangeTxn: number;
    gst: number;
    sebiCharges: number;
    stampDuty: number;
    totalCharges: number;
    netProfit: number;
    breakeven: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["brokerage", ...recent.filter((id: string) => id !== "brokerage")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    
    detectCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency);
      setIsLoadingCurrency(false);
    });
    
    calculateBrokerage();
  }, []);

  useEffect(() => {
    calculateBrokerage();
  }, [buyPrice, sellPrice, quantity, segment]);

  const calculateBrokerage = () => {
    const buyValue = buyPrice * quantity;
    const sellValue = sellPrice * quantity;
    const turnover = buyValue + sellValue;
    
    // Brokerage (assuming 0.03% or ₹20 per order, whichever is lower)
    const brokeragePerTrade = Math.min(buyValue * 0.0003, 20) + Math.min(sellValue * 0.0003, 20);
    
    // STT (Securities Transaction Tax)
    let stt = 0;
    if (segment === "equity") {
      stt = sellValue * 0.00025; // 0.025% on sell side
    } else if (segment === "futures") {
      stt = sellValue * 0.000125; // 0.0125% on sell side
    } else if (segment === "options") {
      stt = sellValue * 0.0005; // 0.05% on sell side
    }

    // Exchange Transaction Charges
    const exchangeTxn = turnover * 0.0000325; // 0.00325%

    // SEBI Charges
    const sebiCharges = turnover * 0.000001; // ₹10 per crore

    // Stamp Duty
    const stampDuty = buyValue * 0.00015; // 0.015% on buy side

    // GST (18% on brokerage + transaction charges)
    const gst = (brokeragePerTrade + exchangeTxn + sebiCharges) * 0.18;

    const totalCharges = brokeragePerTrade + stt + exchangeTxn + gst + sebiCharges + stampDuty;
    const grossProfit = sellValue - buyValue;
    const netProfit = grossProfit - totalCharges;

    // Breakeven calculation
    const chargesPerShare = totalCharges / quantity;
    const breakeven = buyPrice + chargesPerShare;

    setResult({
      grossProfit: Math.round(grossProfit * 100) / 100,
      brokerage: Math.round(brokeragePerTrade * 100) / 100,
      stt: Math.round(stt * 100) / 100,
      exchangeTxn: Math.round(exchangeTxn * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      sebiCharges: Math.round(sebiCharges * 100) / 100,
      stampDuty: Math.round(stampDuty * 100) / 100,
      totalCharges: Math.round(totalCharges * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      breakeven: Math.round(breakeven * 100) / 100,
    });
  };

  const formatCurrency = (value: number) => {
    return formatCurrencyUtil(value, currency);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Brokerage Calculator", href: "/calculators/finance/brokerage-calculator" },
        ]}
      />

      <div className="mb-8 relative">
        <div className="absolute top-0 right-0">
          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
            isLoading={isLoadingCurrency}
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Brokerage Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate all trading charges including brokerage, STT, taxes and find your breakeven price
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-6">
            {/* Segment Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Segment</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSegment("equity")}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    segment === "equity"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Equity
                </button>
                <button
                  onClick={() => setSegment("futures")}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    segment === "futures"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Futures
                </button>
                <button
                  onClick={() => setSegment("options")}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    segment === "options"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Options
                </button>
              </div>
            </div>

            {/* Buy Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buy Price (₹)</label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                step="0.01"
              />
            </div>

            {/* Sell Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sell Price (₹)</label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                step="0.01"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-semibold"
                step="1"
              />
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-gray-900 mb-1">Transaction Value:</p>
              <p className="text-xl font-bold text-blue-600">
                Buy: {formatCurrency(buyPrice * quantity)} | Sell: {formatCurrency(sellPrice * quantity)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {result && (
            <div className="space-y-6">
              {/* Net Profit - Highlight */}
              <div className={`bg-gradient-to-br ${result.netProfit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 text-white`}>
                <div className="text-sm font-medium mb-2 opacity-90">Net Profit/Loss</div>
                <div className="text-4xl font-bold">
                  {result.netProfit >= 0 ? '+' : ''}{formatCurrency(result.netProfit)}
                </div>
                <div className="text-sm mt-2 opacity-90">
                  After all charges ({((result.netProfit / (buyPrice * quantity)) * 100).toFixed(2)}%)
                </div>
              </div>

              {/* Profit Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-xs text-gray-600 mb-1">Gross Profit</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(result.grossProfit)}
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="text-xs text-gray-600 mb-1">Total Charges</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(result.totalCharges)}
                  </div>
                </div>
              </div>

              {/* Detailed Charges Breakdown */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Charges Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Brokerage</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.brokerage)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">STT (Securities Transaction Tax)</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.stt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Exchange Transaction Charges</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.exchangeTxn)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.gst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SEBI Charges</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.sebiCharges)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stamp Duty</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(result.stampDuty)}</span>
                  </div>
                  <div className="flex justify-between text-base pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total Charges</span>
                    <span className="font-bold text-red-600">{formatCurrency(result.totalCharges)}</span>
                  </div>
                </div>
              </div>

              {/* Breakeven Analysis */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Breakeven Analysis</p>
                <p className="text-sm text-gray-700">
                  You need to sell at <strong className="text-amber-700">{formatCurrency(result.breakeven)}</strong> per share 
                  to breakeven after all charges.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Minimum profit target: {formatCurrency(result.breakeven)} ({((result.breakeven / buyPrice - 1) * 100).toFixed(2)}% above buy price)
                </p>
              </div>

              {/* Summary Table */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buy Value</span>
                    <span className="font-semibold">{formatCurrency(buyPrice * quantity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sell Value</span>
                    <span className="font-semibold">{formatCurrency(sellPrice * quantity)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Gross P&L</span>
                    <span className="font-semibold">{result.grossProfit >= 0 ? '+' : ''}{formatCurrency(result.grossProfit)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Total Charges</span>
                    <span className="font-semibold">-{formatCurrency(result.totalCharges)}</span>
                  </div>
                  <div className={`flex justify-between font-bold text-base pt-2 border-t border-gray-300 ${result.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span>Net P&L</span>
                    <span>{result.netProfit >= 0 ? '+' : ''}{formatCurrency(result.netProfit)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Section */}
      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Trading Charges</h2>
            <p className="mb-4 text-gray-700">
              Every trade involves multiple charges that reduce your profits. Understanding these charges helps you plan better trading strategies.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Key Trading Charges:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Brokerage:</strong> Fee charged by broker (typically 0.01-0.05% or flat fee)</li>
                <li><strong>STT:</strong> Securities Transaction Tax levied by government</li>
                <li><strong>Exchange Charges:</strong> Fees charged by NSE/BSE</li>
                <li><strong>GST:</strong> 18% tax on brokerage and transaction charges</li>
                <li><strong>Stamp Duty:</strong> State tax on purchase transactions</li>
              </ul>
            </div>
          </div>
        }
        faqs={[
          {
            question: "Why are there so many charges in trading?",
            answer: "Trading involves multiple entities - brokers, exchanges, regulators (SEBI), and government. Each entity charges fees for their services and regulatory compliance.",
          },
          {
            question: "Can I reduce trading charges?",
            answer: "You can choose discount brokers with lower brokerage, reduce trading frequency, and maintain larger position sizes to reduce per-share cost impact.",
          },
          {
            question: "Are charges same for all segments?",
            answer: "No, charges vary by segment. STT is different for equity, futures, and options. Always check your broker's charge structure.",
          },
        ]}
        relatedCalculators={[
          { name: "Margin Calculator", href: "/calculators/finance/margin-calculator" },
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
          { name: "FD Calculator", href: "/calculators/finance/fd-calculator" },
        ]}
      >
        <div></div>
      </CalculatorLayout>
    </div>
  );
}
