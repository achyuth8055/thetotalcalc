"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import CurrencySelector from "@/components/CurrencySelector";
import { detectCurrency, formatCurrency as formatCurrencyUtil, CurrencyConfig, CURRENCIES } from "@/lib/currency";

export default function MarginCalculator() {
  const [positionValue, setPositionValue] = useState(100000);
  const [leverage, setLeverage] = useState(5);
  const [brokerageType, setBrokerageType] = useState<"equity" | "futures" | "options">("equity");
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [result, setResult] = useState<{
    marginRequired: number;
    exposureValue: number;
    effectiveLeverage: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["margin", ...recent.filter((id: string) => id !== "margin")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    
    detectCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency);
      setIsLoadingCurrency(false);
    });
    
    calculateMargin();
  }, []);

  useEffect(() => {
    calculateMargin();
  }, [positionValue, leverage, brokerageType]);

  const calculateMargin = () => {
    let marginPercentage = 0;

    // Typical margin requirements
    switch (brokerageType) {
      case "equity":
        marginPercentage = 20; // 5x leverage
        break;
      case "futures":
        marginPercentage = 10; // 10x leverage
        break;
      case "options":
        marginPercentage = 100; // Full margin
        break;
    }

    // Custom leverage for equity and futures
    if (brokerageType !== "options") {
      marginPercentage = 100 / leverage;
    }

    const marginRequired = (positionValue * marginPercentage) / 100;
    const exposureValue = positionValue;
    const effectiveLeverage = positionValue / marginRequired;

    setResult({
      marginRequired: Math.round(marginRequired),
      exposureValue: Math.round(exposureValue),
      effectiveLeverage: Math.round(effectiveLeverage * 10) / 10,
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
          { label: "Margin Calculator", href: "/calculators/finance/margin-calculator" },
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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Margin Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate margin requirements and leverage for trading positions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-8">
            {/* Trade Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Trade Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setBrokerageType("equity")}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    brokerageType === "equity"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Equity
                </button>
                <button
                  onClick={() => setBrokerageType("futures")}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    brokerageType === "futures"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Futures
                </button>
                <button
                  onClick={() => setBrokerageType("options")}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    brokerageType === "options"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Options
                </button>
              </div>
            </div>

            {/* Position Value */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Position Value</label>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(positionValue)}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={positionValue}
                onChange={(e) => setPositionValue(Number(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((positionValue - 10000) / (1000000 - 10000)) * 100}%, #dbeafe ${((positionValue - 10000) / (1000000 - 10000)) * 100}%, #dbeafe 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹10K</span>
                <span>₹10L</span>
              </div>
            </div>

            {/* Leverage */}
            {brokerageType !== "options" && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Leverage</label>
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                    <span className="text-xl font-bold text-purple-600">{leverage}x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((leverage - 1) / (20 - 1)) * 100}%, #f3e8ff ${((leverage - 1) / (20 - 1)) * 100}%, #f3e8ff 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1x</span>
                  <span>20x</span>
                </div>
              </div>
            )}
          </div>

          {/* Information Box */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">⚠️ Risk Warning</p>
            <p>
              Trading with leverage amplifies both profits and losses. Only trade with money you can afford to lose.
            </p>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {result && (
            <div className="space-y-6">
              {/* Margin Required - Highlight */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="text-sm font-medium mb-2 opacity-90">Margin Required</div>
                <div className="text-4xl font-bold">{formatCurrency(result.marginRequired)}</div>
              </div>

              {/* Visual Representation */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="text-sm text-gray-700 mb-3 font-semibold">Margin vs Exposure</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Margin</span>
                      <span>{formatCurrency(result.marginRequired)}</span>
                    </div>
                    <div className="h-3 bg-purple-200 rounded-full">
                      <div 
                        className="h-3 bg-purple-500 rounded-full"
                        style={{ width: `${(result.marginRequired / positionValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Full Position</span>
                      <span>{formatCurrency(positionValue)}</span>
                    </div>
                    <div className="h-3 bg-blue-200 rounded-full">
                      <div className="h-3 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Exposure Value</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(result.exposureValue)}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Effective Leverage</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {result.effectiveLeverage}x
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Trade Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{brokerageType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Position Value</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(positionValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Margin Required</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.marginRequired)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Margin %</span>
                  <span className="font-semibold text-gray-900">
                    {((result.marginRequired / positionValue) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Profit/Loss Example */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-gray-900 mb-2">Example:</p>
                <p className="text-gray-700">
                  With {formatCurrency(result.marginRequired)} margin, you control {formatCurrency(positionValue)} position. 
                  A 1% price movement = {formatCurrency(positionValue * 0.01)} profit/loss.
                </p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Margin Trading</h2>
            <p className="mb-4 text-gray-700">
              Margin trading allows you to trade larger positions than your capital by borrowing from your broker. 
              The margin is the collateral you need to maintain the position.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Key Concepts:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Leverage:</strong> The ratio of position value to margin required</li>
                <li><strong>Margin:</strong> The amount you need to deposit</li>
                <li><strong>Exposure:</strong> The total value of your position</li>
                <li><strong>Margin Call:</strong> Request to add funds when margin falls below requirement</li>
              </ul>
            </div>
          </div>
        }
        faqs={[
          {
            question: "What is margin in trading?",
            answer: "Margin is the amount of capital required to open and maintain a leveraged trading position. It acts as collateral for the borrowed funds.",
          },
          {
            question: "What happens if I don't maintain margin?",
            answer: "If your account falls below the maintenance margin requirement, you'll receive a margin call and may need to deposit more funds or close positions.",
          },
          {
            question: "Is margin trading risky?",
            answer: "Yes, margin trading amplifies both gains and losses. You can lose more than your initial investment in some cases.",
          },
        ]}
        relatedCalculators={[
          { name: "Brokerage Calculator", href: "/calculators/finance/brokerage-calculator" },
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
          { name: "EMI Calculator", href: "/calculators/finance/emi-calculator" },
        ]}
      >
        <div></div>
      </CalculatorLayout>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid currentColor;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid currentColor;
        }
      `}</style>
    </div>
  );
}
