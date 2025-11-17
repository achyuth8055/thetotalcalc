"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import CurrencySelector from "@/components/CurrencySelector";
import { detectCurrency, formatCurrency as formatCurrencyUtil, CurrencyConfig, CURRENCIES } from "@/lib/currency";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [result, setResult] = useState<{
    invested: number;
    returns: number;
    maturityValue: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["sip", ...recent.filter((id: string) => id !== "sip")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    
    // Detect currency based on user's location
    detectCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency);
      setIsLoadingCurrency(false);
    });
    
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const calculate = () => {
    const P = monthlyInvestment;
    const r = expectedReturn / 12 / 100;
    const n = timePeriod * 12;

    if (P > 0 && r > 0 && n > 0) {
      const maturityValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      const invested = P * n;
      const returns = maturityValue - invested;

      setResult({
        invested: Math.round(invested),
        returns: Math.round(returns),
        maturityValue: Math.round(maturityValue),
      });
    }
  };

  const formatCurrency = (value: number) => {
    return formatCurrencyUtil(value, currency);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SIP Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate returns on your monthly SIP investments with compound growth
          </p>
        </div>
        {!isLoadingCurrency && (
          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
          />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {/* Monthly Investment */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Monthly Investment</label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)}
                  className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Amount"
                />
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{currency.symbol}500</span>
                <span>{currency.symbol}100K</span>
              </div>
            </div>

            {/* Expected Return */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Expected Return (p.a)</label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  step="0.1"
                  placeholder="%"
                />
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Time Period</label>
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  placeholder="Years"
                />
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>40 Yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Results with Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-5">
              {/* Maturity Value - Highlight */}
              <div className="bg-green-600 rounded-xl p-5 text-white">
                <div className="text-xs font-medium mb-1 opacity-90">Maturity Value</div>
                <div className="text-3xl font-bold">{formatCurrency(result.maturityValue)}</div>
              </div>

              {/* Donut Chart */}
              <div className="relative flex items-center justify-center py-6">
                <svg className="w-48 h-48 sm:w-56 sm:h-56" viewBox="0 0 192 192">
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="24"
                    strokeDasharray={`${(result.invested / result.maturityValue) * 440} 440`}
                    transform="rotate(-90 96 96)"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="24"
                    strokeDasharray={`${(result.returns / result.maturityValue) * 440} 440`}
                    strokeDashoffset={`-${(result.invested / result.maturityValue) * 440}`}
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Total Value</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(result.maturityValue)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Invested</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(result.invested)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Returns</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(result.returns)}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-gray-200 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Investment</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(monthlyInvestment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Invested</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.invested)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Returns</span>
                  <span className="font-semibold text-green-600">{formatCurrency(result.returns)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2.5 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Maturity Value</span>
                  <span className="font-bold text-gray-900">{formatCurrency(result.maturityValue)}</span>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="mb-1">
                  <strong>Duration:</strong> {timePeriod * 12} months ({timePeriod} years)
                </p>
                <p>
                  <strong>Wealth Gain:</strong> {((result.returns / result.invested) * 100).toFixed(1)}%
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How SIP Works</h2>
            <p className="mb-4 text-gray-700">
              Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds. 
              Your investment grows through the power of compounding, where returns generate more returns over time.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Benefits of SIP:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Rupee cost averaging reduces market timing risk</li>
                <li>Power of compounding grows your wealth</li>
                <li>Disciplined investment habit</li>
                <li>Start with as little as ₹500 per month</li>
              </ul>
            </div>
          </div>
        }
        faqs={[
          {
            question: "What is SIP?",
            answer: "SIP (Systematic Investment Plan) is a method of investing in mutual funds where you invest a fixed amount at regular intervals, typically monthly.",
          },
          {
            question: "Can I stop SIP anytime?",
            answer: "Yes, SIP is flexible. You can pause, increase, decrease, or stop your SIP at any time without penalties.",
          },
          {
            question: "What returns can I expect?",
            answer: "Returns depend on market performance. Historically, equity mutual funds have given 12-15% annual returns over long periods.",
          },
        ]}
        relatedCalculators={[
          { name: "EMI Calculator", href: "/calculators/finance/emi-calculator" },
          { name: "FD Calculator", href: "/calculators/finance/fd-calculator" },
          { name: "SWP Calculator", href: "/calculators/finance/swp-calculator" },
        ]}
      >
        <div></div>
      </CalculatorLayout>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        
        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"].accent-blue-600::-webkit-slider-thumb {
          border: 3px solid #2563eb;
        }
        
        input[type="range"].accent-green-600::-webkit-slider-thumb {
          border: 3px solid #16a34a;
        }
        
        input[type="range"].accent-purple-600::-webkit-slider-thumb {
          border: 3px solid #9333ea;
        }
      `}</style>
    </div>
  );
}
