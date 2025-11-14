"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function FlatVsReducingRateCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState<string>("500000");
  const [flatRate, setFlatRate] = useState<string>("12");
  const [reducingRate, setReducingRate] = useState<string>("12");
  const [loanTenure, setLoanTenure] = useState<string>("5");
  const [results, setResults] = useState({
    flatRate: {
      totalInterest: 0,
      totalAmount: 0,
      monthlyEMI: 0,
    },
    reducingRate: {
      totalInterest: 0,
      totalAmount: 0,
      monthlyEMI: 0,
    },
    difference: {
      interestSaved: 0,
      totalSaved: 0,
      percentageSaved: 0,
    }
  });

  const calculateRates = () => {
    const principal = parseFloat(loanAmount) || 0;
    const flatRateAnnual = parseFloat(flatRate) || 0;
    const reducingRateAnnual = parseFloat(reducingRate) || 0;
    const tenure = parseFloat(loanTenure) || 0;
    const months = tenure * 12;

    if (principal <= 0 || flatRateAnnual <= 0 || reducingRateAnnual <= 0 || tenure <= 0) {
      setResults({
        flatRate: { totalInterest: 0, totalAmount: 0, monthlyEMI: 0 },
        reducingRate: { totalInterest: 0, totalAmount: 0, monthlyEMI: 0 },
        difference: { interestSaved: 0, totalSaved: 0, percentageSaved: 0 }
      });
      return;
    }

    // Flat Rate Calculation
    const flatInterestTotal = (principal * flatRateAnnual * tenure) / 100;
    const flatTotalAmount = principal + flatInterestTotal;
    const flatMonthlyEMI = flatTotalAmount / months;

    // Reducing Rate Calculation (EMI Formula)
    const monthlyReducingRate = reducingRateAnnual / (12 * 100);
    const reducingEMI = principal * monthlyReducingRate * 
      Math.pow(1 + monthlyReducingRate, months) / 
      (Math.pow(1 + monthlyReducingRate, months) - 1);
    const reducingTotalAmount = reducingEMI * months;
    const reducingInterestTotal = reducingTotalAmount - principal;

    // Difference Calculation
    const interestSaved = flatInterestTotal - reducingInterestTotal;
    const totalSaved = flatTotalAmount - reducingTotalAmount;
    const percentageSaved = (totalSaved / flatTotalAmount) * 100;

    setResults({
      flatRate: {
        totalInterest: flatInterestTotal,
        totalAmount: flatTotalAmount,
        monthlyEMI: flatMonthlyEMI,
      },
      reducingRate: {
        totalInterest: reducingInterestTotal,
        totalAmount: reducingTotalAmount,
        monthlyEMI: reducingEMI,
      },
      difference: {
        interestSaved: Math.max(0, interestSaved),
        totalSaved: Math.max(0, totalSaved),
        percentageSaved: Math.max(0, percentageSaved),
      }
    });
  };

  useEffect(() => {
    calculateRates();
  }, [loanAmount, flatRate, reducingRate, loanTenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <CalculatorLayout
      title="Flat vs Reducing Rate Calculator"
      description="Compare flat rate vs reducing rate loans to understand the real cost difference and make informed borrowing decisions."
      keywords={["flat rate", "reducing rate", "loan calculator", "interest rate comparison", "EMI calculator"]}
    >
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Flat vs Reducing Rate Calculator", href: "/calculators/finance/flat-vs-reducing-rate-calculator" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Flat vs Reducing Rate Calculator</h1>
            <span className="text-4xl">📊</span>
          </div>
          <p className="text-lg text-gray-600">
            Compare flat rate vs reducing rate loans to understand which option saves you more money.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter loan amount"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Flat Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    value={flatRate}
                    onChange={(e) => setFlatRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter flat rate"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reducing Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    value={reducingRate}
                    onChange={(e) => setReducingRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter reducing rate"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loan Tenure (years)
                  </label>
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter tenure"
                    min="1"
                    step="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Comparison Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Flat Rate Results */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                    📉 Flat Rate Loan
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-red-700">Monthly EMI:</span>
                      <span className="text-lg font-bold text-red-800">
                        {formatCurrency(results.flatRate.monthlyEMI)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-red-700">Total Interest:</span>
                      <span className="text-lg font-bold text-red-800">
                        {formatCurrency(results.flatRate.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-red-300 pt-2">
                      <span className="text-sm font-medium text-red-700">Total Amount:</span>
                      <span className="text-xl font-bold text-red-900">
                        {formatCurrency(results.flatRate.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reducing Rate Results */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    📈 Reducing Rate Loan
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-700">Monthly EMI:</span>
                      <span className="text-lg font-bold text-green-800">
                        {formatCurrency(results.reducingRate.monthlyEMI)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-700">Total Interest:</span>
                      <span className="text-lg font-bold text-green-800">
                        {formatCurrency(results.reducingRate.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-green-300 pt-2">
                      <span className="text-sm font-medium text-green-700">Total Amount:</span>
                      <span className="text-xl font-bold text-green-900">
                        {formatCurrency(results.reducingRate.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  💰 Your Savings with Reducing Rate
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(results.difference.interestSaved)}
                    </div>
                    <div className="text-sm text-blue-700">Interest Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(results.difference.totalSaved)}
                    </div>
                    <div className="text-sm text-blue-700">Total Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {formatNumber(results.difference.percentageSaved, 1)}%
                    </div>
                    <div className="text-sm text-blue-700">Percentage Saved</div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Key Insights</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>
                      <strong>Reducing Rate</strong> is generally cheaper as interest is calculated on the outstanding principal balance.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">⚠</span>
                    <span>
                      <strong>Flat Rate</strong> calculates interest on the original loan amount throughout the tenure, making it more expensive.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">💡</span>
                    <span>
                      The longer the loan tenure, the greater the difference between flat and reducing rates.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">🎯</span>
                    <span>
                      Always compare the <strong>effective interest rate</strong> and total cost when choosing between loan options.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Understanding Section */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Flat vs Reducing Rate</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Flat Rate Method</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Interest calculated on original principal amount</li>
                <li>• Same interest amount throughout loan tenure</li>
                <li>• Higher effective interest rate</li>
                <li>• Commonly used for personal loans, car loans</li>
                <li>• Simple calculation: Principal × Rate × Time</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">📈 Reducing Rate Method</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Interest calculated on outstanding principal</li>
                <li>• Interest amount decreases with each payment</li>
                <li>• Lower effective interest rate</li>
                <li>• Standard for home loans, business loans</li>
                <li>• Uses compound interest calculation (EMI formula)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Pro Tip:</strong> When comparing loan offers, always ask for the Annual Percentage Rate (APR) or effective interest rate to make an accurate comparison between flat and reducing rate loans.
            </p>
          </div>
        </div>

        {/* Related Calculators */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Calculators</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/calculators/finance/emi-calculator"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">EMI Calculator</h3>
              <p className="text-sm text-gray-600">Calculate monthly EMI for loans</p>
            </Link>
            <Link
              href="/calculators/finance/home-loan-emi-calculator"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">Home Loan EMI</h3>
              <p className="text-sm text-gray-600">Calculate home loan payments</p>
            </Link>
            <Link
              href="/calculators/finance/car-loan-emi-calculator"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">Car Loan EMI</h3>
              <p className="text-sm text-gray-600">Calculate car loan payments</p>
            </Link>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}