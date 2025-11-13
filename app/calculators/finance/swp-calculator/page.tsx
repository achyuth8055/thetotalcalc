"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import CurrencySelector from "@/components/CurrencySelector";
import { detectCurrency, formatCurrency as formatCurrencyUtil, CurrencyConfig, CURRENCIES } from "@/lib/currency";

export default function SWPCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [withdrawalAmount, setWithdrawalAmount] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [result, setResult] = useState<{
    totalWithdrawn: number;
    finalValue: number;
    totalMonths: number;
    wealthGenerated: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["swp", ...recent.filter((id: string) => id !== "swp")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    
    detectCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency);
      setIsLoadingCurrency(false);
    });
    
    calculateSWP();
  }, []);

  useEffect(() => {
    calculateSWP();
  }, [totalInvestment, withdrawalAmount, expectedReturn, timePeriod]);

  const calculateSWP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let balance = totalInvestment;
    let totalWithdrawn = 0;

    for (let i = 0; i < months; i++) {
      if (balance <= 0) break;
      
      // Add monthly returns
      balance = balance * (1 + monthlyRate);
      
      // Withdraw amount
      if (balance >= withdrawalAmount) {
        balance -= withdrawalAmount;
        totalWithdrawn += withdrawalAmount;
      } else {
        totalWithdrawn += balance;
        balance = 0;
        break;
      }
    }

    setResult({
      totalWithdrawn: Math.round(totalWithdrawn),
      finalValue: Math.round(balance),
      totalMonths: months,
      wealthGenerated: Math.round(totalWithdrawn + balance - totalInvestment),
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
          { label: "SWP Calculator", href: "/calculators/finance/swp-calculator" },
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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">SWP Calculator</h1>
        <p className="text-lg text-gray-600">
          Calculate Systematic Withdrawal Plan returns and plan your retirement income
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-8">
            {/* Total Investment */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Total Investment</label>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(totalInvestment)}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((totalInvestment - 100000) / (10000000 - 100000)) * 100}%, #dbeafe ${((totalInvestment - 100000) / (10000000 - 100000)) * 100}%, #dbeafe 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹1L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Monthly Withdrawal */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Monthly Withdrawal</label>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                  <span className="text-xl font-bold text-green-600">{formatCurrency(withdrawalAmount)}</span>
                </div>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((withdrawalAmount - 5000) / (100000 - 5000)) * 100}%, #d1fae5 ${((withdrawalAmount - 5000) / (100000 - 5000)) * 100}%, #d1fae5 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹5K</span>
                <span>₹1L</span>
              </div>
            </div>

            {/* Expected Return */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Expected Return (p.a)</label>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                  <span className="text-xl font-bold text-purple-600">{expectedReturn}%</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((expectedReturn - 1) / (30 - 1)) * 100}%, #f3e8ff ${((expectedReturn - 1) / (30 - 1)) * 100}%, #f3e8ff 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Time Period</label>
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
                  <span className="text-xl font-bold text-orange-600">{timePeriod} Yr</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${((timePeriod - 1) / (40 - 1)) * 100}%, #fed7aa ${((timePeriod - 1) / (40 - 1)) * 100}%, #fed7aa 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 Yr</span>
                <span>40 Yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {result && (
            <div className="space-y-6">
              {/* Total Withdrawn - Highlight */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="text-sm font-medium mb-2 opacity-90">Total Amount Withdrawn</div>
                <div className="text-4xl font-bold">{formatCurrency(result.totalWithdrawn)}</div>
              </div>

              {/* Visual Progress Bar */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-3">Investment Breakdown</div>
                <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(totalInvestment / (totalInvestment + result.wealthGenerated)) * 100}%` }}
                  >
                    Investment
                  </div>
                  <div 
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(result.wealthGenerated / (totalInvestment + result.wealthGenerated)) * 100}%` }}
                  >
                    Returns
                  </div>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Initial Investment</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(totalInvestment)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Wealth Generated</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(result.wealthGenerated)}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Withdrawn</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.totalWithdrawn)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Final Value</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.finalValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Withdrawal</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(withdrawalAmount)}</span>
                </div>
                <div className="flex justify-between text-base pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Value</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(result.totalWithdrawn + result.finalValue)}
                  </span>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                <p className="mb-2">
                  <strong>Withdrawal Period:</strong> {result.totalMonths} months ({timePeriod} years)
                </p>
                <p>
                  You can withdraw <strong>{formatCurrency(withdrawalAmount)}</strong> per month while your investment grows at {expectedReturn}% annually.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is SWP?</h2>
            <p className="mb-4 text-gray-700">
              Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount from your mutual fund investment at regular intervals. 
              It's an ideal tool for generating regular income during retirement while keeping your capital invested.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Benefits of SWP:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Regular income while staying invested</li>
                <li>Tax-efficient way to generate income</li>
                <li>Rupee cost averaging benefits</li>
                <li>Flexible withdrawal amounts</li>
              </ul>
            </div>
          </div>
        }
        faqs={[
          {
            question: "What is the difference between SWP and SIP?",
            answer: "SIP (Systematic Investment Plan) involves regular investments, while SWP (Systematic Withdrawal Plan) involves regular withdrawals from your existing investment.",
          },
          {
            question: "Is SWP tax-efficient?",
            answer: "Yes, SWP can be more tax-efficient than fixed deposits as only the capital gains portion is taxed, not the entire withdrawal amount.",
          },
          {
            question: "Can I change my SWP amount?",
            answer: "Yes, most mutual funds allow you to modify or stop your SWP at any time without penalties.",
          },
        ]}
        relatedCalculators={[
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
          { name: "FD Calculator", href: "/calculators/finance/fd-calculator" },
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
