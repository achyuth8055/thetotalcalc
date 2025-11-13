"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import CurrencySelector from "@/components/CurrencySelector";
import { detectCurrency, formatCurrency as formatCurrencyUtil, CurrencyConfig, CURRENCIES } from "@/lib/currency";

export default function CarLoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [result, setResult] = useState<{
    emi: number;
    totalInterest: number;
    totalAmount: number;
    principalPercentage: number;
    interestPercentage: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["car-loan-emi", ...recent.filter((id: string) => id !== "car-loan-emi")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    
    detectCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency);
      setIsLoadingCurrency(false);
    });
    
    calculateEMI();
  }, []);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    if (P > 0 && r > 0 && n > 0) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;
      const principalPercentage = (P / totalAmount) * 100;
      const interestPercentage = (totalInterest / totalAmount) * 100;

      setResult({
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalAmount: Math.round(totalAmount),
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
          { label: "Car Loan EMI Calculator", href: "/calculators/finance/car-loan-emi-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Loan EMI Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate your monthly car loan EMI with detailed breakdown of principal and interest
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
            {/* Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Amount"
                />
              </div>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{currency.symbol}100K</span>
                <span>{currency.symbol}5M</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Rate of Interest (p.a)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.1"
                  placeholder="%"
                />
              </div>
              <input
                type="range"
                min="7"
                max="18"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>7%</span>
                <span>18%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Years"
                />
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>7 Yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Results with Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-5">
              {/* Monthly EMI - Highlight */}
              <div className="bg-blue-600 rounded-xl p-5 text-white">
                <div className="text-xs font-medium mb-1 opacity-90">Monthly EMI</div>
                <div className="text-3xl font-bold">{formatCurrency(result.emi)}</div>
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
                    stroke="#e0e7ff"
                    strokeWidth="24"
                    strokeDasharray={`${result.interestPercentage * 4.4} 440`}
                    strokeDashoffset={`-${result.principalPercentage * 4.4}`}
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Total Amount</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(result.totalAmount)}
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
                    {formatCurrency(loanAmount)}
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-indigo-200 rounded-full"></div>
                    <span className="text-xs text-gray-600">Interest</span>
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(result.totalInterest)}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-gray-200 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Principal amount</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total interest</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2.5 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total amount</span>
                  <span className="font-bold text-gray-900">{formatCurrency(result.totalAmount)}</span>
                </div>
              </div>

              {/* Amortization Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="mb-1">
                  <strong>Monthly Payment:</strong> {formatCurrency(result.emi)}
                </p>
                <p>
                  Pay for <strong>{loanTenure * 12} months</strong> ({loanTenure} years)
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Car Loan EMI Calculation</h2>
            <p className="mb-4 text-gray-700">
              A car loan EMI calculator helps you budget for your vehicle purchase by showing your monthly payment commitment.
              Plan your car financing wisely to ensure comfortable payments without straining your budget.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Smart Financing Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Make a higher down payment to reduce EMI burden</li>
                <li>Car loans typically range from 1 to 7 years</li>
                <li>Interest rates are usually higher than home loans</li>
                <li>Consider resale value before choosing tenure</li>
              </ul>
            </div>
            <p className="text-gray-700">
              <strong>Tip:</strong> A down payment of 20-25% of the car's value is recommended for better loan terms and lower interest burden.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is a good down payment for a car loan?",
            answer: "A down payment of 20-25% of the car's on-road price is considered ideal. This reduces your loan amount, lowers EMI, and helps you get better interest rates.",
          },
          {
            question: "Should I choose a longer tenure for lower EMI?",
            answer: "While longer tenure reduces EMI, remember that cars depreciate quickly. A 3-5 year tenure is often recommended to balance affordable EMI with lower total interest.",
          },
          {
            question: "Can I prepay my car loan?",
            answer: "Yes, most banks allow car loan prepayment. Check if your lender charges prepayment penalties. Early closure can save you significant interest costs.",
          },
        ]}
        relatedCalculators={[
          { name: "EMI Calculator", href: "/calculators/finance/emi-calculator" },
          { name: "Home Loan EMI", href: "/calculators/finance/home-loan-emi-calculator" },
          { name: "SIP Calculator", href: "/calculators/finance/sip-calculator" },
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
