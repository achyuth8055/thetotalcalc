"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import CurrencySelector from "@/components/CurrencySelector";
import { detectCurrency, formatCurrency as formatCurrencyUtil, CurrencyConfig, CURRENCIES } from "@/lib/currency";

export default function FDCalculator() {
  const [depositAmount, setDepositAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenure, setTenure] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<"monthly" | "quarterly" | "annually">("quarterly");
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [result, setResult] = useState<{
    maturityAmount: number;
    interestEarned: number;
    principalPercentage: number;
    interestPercentage: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["fd", ...recent.filter((id: string) => id !== "fd")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    
    detectCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency);
      setIsLoadingCurrency(false);
    });
    
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [depositAmount, interestRate, tenure, compoundingFrequency]);

  const calculate = () => {
    const P = depositAmount;
    const r = interestRate / 100;
    const t = tenure;

    let n = 4; // Quarterly by default
    if (compoundingFrequency === "monthly") n = 12;
    else if (compoundingFrequency === "annually") n = 1;

    if (P > 0 && r > 0 && t > 0) {
      const maturityAmount = P * Math.pow(1 + r / n, n * t);
      const interestEarned = maturityAmount - P;
      const principalPercentage = (P / maturityAmount) * 100;
      const interestPercentage = (interestEarned / maturityAmount) * 100;

      setResult({
        maturityAmount: Math.round(maturityAmount),
        interestEarned: Math.round(interestEarned),
        principalPercentage,
        interestPercentage,
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
          { label: "FD Calculator", href: "/calculators/finance/fd-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fixed Deposit (FD) Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate your FD maturity amount and interest earnings with compound interest
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
            {/* Deposit Amount */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Deposit Amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                  className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Amount"
                />
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{currency.symbol}10K</span>
                <span>{currency.symbol}1M</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Interest Rate (p.a)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  step="0.1"
                  placeholder="%"
                />
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  placeholder="Years"
                />
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>10 Yr</span>
              </div>
            </div>

            {/* Compounding Frequency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Compounding Frequency</label>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(e.target.value as "monthly" | "quarterly" | "annually")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm font-semibold text-orange-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side - Results with Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-5">
              {/* Maturity Amount - Highlight */}
              <div className="bg-green-600 rounded-xl p-5 text-white">
                <div className="text-xs font-medium mb-1 opacity-90">Maturity Amount</div>
                <div className="text-3xl font-bold">{formatCurrency(result.maturityAmount)}</div>
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
                    strokeDasharray={`${result.principalPercentage * 4.4} 440`}
                    transform="rotate(-90 96 96)"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="24"
                    strokeDasharray={`${result.interestPercentage * 4.4} 440`}
                    strokeDashoffset={`-${result.principalPercentage * 4.4}`}
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Total Value</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(result.maturityAmount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Principal</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(depositAmount)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Interest</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(result.interestEarned)}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-gray-200 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deposit amount</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Interest earned</span>
                  <span className="font-semibold text-green-600">{formatCurrency(result.interestEarned)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2.5 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Maturity value</span>
                  <span className="font-bold text-gray-900">{formatCurrency(result.maturityAmount)}</span>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="mb-1">
                  <strong>Tenure:</strong> {tenure} years ({tenure * 12} months)
                </p>
                <p>
                  <strong>Compounding:</strong> {compoundingFrequency.charAt(0).toUpperCase() + compoundingFrequency.slice(1)}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How FD Interest Works</h2>
            <p className="mb-4 text-gray-700">
              Fixed Deposit (FD) is a safe investment option where you deposit a lump sum for a fixed period
              and earn guaranteed returns through compound interest. Your interest earnings are reinvested to generate more interest.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Key Benefits:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Guaranteed returns with no market risk</li>
                <li>Higher interest than savings accounts</li>
                <li>Insurance up to ₹5 lakh per bank (DICGC)</li>
                <li>Tax deduction under Section 80C (for tax-saver FDs)</li>
              </ul>
            </div>
            <p className="text-gray-700">
              <strong>Tip:</strong> Quarterly compounding typically offers better returns than annual compounding due to more frequent interest reinvestment.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the difference between compounding frequencies?",
            answer: "Monthly compounding gives the highest returns as interest is calculated and added 12 times a year, followed by quarterly (4 times) and annually (once). The more frequent the compounding, the higher your maturity amount.",
          },
          {
            question: "Can I withdraw my FD before maturity?",
            answer: "Yes, but premature withdrawal typically attracts a penalty (usually 0.5-1% reduction in interest rate). Some banks also charge processing fees for early withdrawal.",
          },
          {
            question: "Are FD returns taxable?",
            answer: "Yes, FD interest is fully taxable as per your income tax slab. Banks deduct TDS if your interest income exceeds ₹40,000 per year (₹50,000 for senior citizens).",
          },
        ]}
        relatedCalculators={[
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
          { name: "EMI Calculator", href: "/calculators/finance/emi-calculator" },
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
