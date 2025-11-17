"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CurrencySelector from "@/components/CurrencySelector";
import { detectCurrency, formatCurrency as formatCurrencyUtil, CurrencyConfig, CURRENCIES } from "@/lib/currency";

export default function FlatVsReducingRateCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(5);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(true);
  const [results, setResults] = useState({
    flatRate: {
      monthlyEMI: 0,
      totalInterest: 0,
      totalAmount: 0,
    },
    reducingBalance: {
      monthlyEMI: 0,
      totalInterest: 0,
      totalAmount: 0,
    },
    savings: 0
  });

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["flat-vs-reducing-rate", ...recent.filter((id: string) => id !== "flat-vs-reducing-rate")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    
    // Detect currency based on user's location
    detectCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency);
      setIsLoadingCurrency(false);
    });
    
    calculateRates();
  }, []);

  useEffect(() => {
    calculateRates();
  }, [loanAmount, interestRate, loanTenure, tenureType]);

  const calculateRates = () => {
    const principal = loanAmount;
    const rate = interestRate;
    const tenure = tenureType === "years" ? loanTenure : loanTenure / 12;
    const months = tenureType === "years" ? loanTenure * 12 : loanTenure;

    if (principal <= 0 || rate <= 0 || months <= 0) {
      setResults({
        flatRate: { monthlyEMI: 0, totalInterest: 0, totalAmount: 0 },
        reducingBalance: { monthlyEMI: 0, totalInterest: 0, totalAmount: 0 },
        savings: 0
      });
      return;
    }

    // Flat Rate Calculation
    const flatInterestTotal = (principal * rate * tenure) / 100;
    const flatTotalAmount = principal + flatInterestTotal;
    const flatMonthlyEMI = flatTotalAmount / months;

    // Reducing Balance Calculation (EMI Formula)
    const monthlyRate = rate / (12 * 100);
    const reducingEMI = principal * monthlyRate * 
      Math.pow(1 + monthlyRate, months) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    const reducingTotalAmount = reducingEMI * months;
    const reducingInterestTotal = reducingTotalAmount - principal;

    const savings = flatTotalAmount - reducingTotalAmount;

    setResults({
      flatRate: {
        monthlyEMI: flatMonthlyEMI,
        totalInterest: flatInterestTotal,
        totalAmount: flatTotalAmount,
      },
      reducingBalance: {
        monthlyEMI: reducingEMI,
        totalInterest: reducingInterestTotal,
        totalAmount: reducingTotalAmount,
      },
      savings: Math.max(0, savings)
    });
  };

  const formatCurrency = (value: number) => {
    return formatCurrencyUtil(value, currency);
  };

  const circumference = 2 * Math.PI * 70;
  const clampPercent = (value: number) =>
    Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const getComposition = (totalAmount: number) => {
    if (!totalAmount) {
      return { principal: 0, interest: 0 };
    }
    const principal = clampPercent((loanAmount / totalAmount) * 100);
    return {
      principal,
      interest: clampPercent(100 - principal),
    };
  };

  const flatComposition = getComposition(results.flatRate.totalAmount);
  const reducingComposition = getComposition(results.reducingBalance.totalAmount);
  const maxAmount = Math.max(results.flatRate.totalAmount, results.reducingBalance.totalAmount, 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Flat vs Reducing Rate Calculator", href: "/calculators/finance/flat-vs-reducing-rate-calculator" },
        ]}
      />

      <div className="glow-card p-6 sm:p-8 text-white/90">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
          <div>
            <span className="inline-flex items-center text-xs uppercase tracking-[0.4em] text-white/60 mb-3">Finance</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Flat vs Reducing Rate Calculator</h1>
            <p className="text-white/70 text-base max-w-2xl">
              Visualize the difference between flat-rate and reducing-balance loans with interactive charts, instant savings insights, and currency-aware controls.
            </p>
          </div>
          {!isLoadingCurrency && (
            <CurrencySelector
              selectedCurrency={currency}
              onCurrencyChange={setCurrency}
            />
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white/95 rounded-[28px] shadow-[0_20px_80px_rgba(15,23,42,0.18)] p-6 sm:p-8 border border-white/80">
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
                min="50000"
                max="5000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{currency.symbol}50K</span>
                <span>{currency.symbol}5M</span>
              </div>
            </div>

            {/* Rate of Interest */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Rate of Interest (per annum)</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                    className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step="0.1"
                    placeholder="%"
                  />
                  <span className="text-sm text-green-600 font-semibold">%</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value) || 0)}
                    className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tenure"
                  />
                  <div className="flex bg-gray-100 rounded-md">
                    <button
                      onClick={() => setTenureType("years")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        tenureType === "years" 
                          ? "bg-purple-600 text-white" 
                          : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      Years
                    </button>
                    <button
                      onClick={() => setTenureType("months")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        tenureType === "months" 
                          ? "bg-purple-600 text-white" 
                          : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      Months
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={tenureType === "years" ? "1" : "6"}
                max={tenureType === "years" ? "30" : "360"}
                step={tenureType === "years" ? "1" : "6"}
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{tenureType === "years" ? "1" : "6"} {tenureType}</span>
                <span>{tenureType === "years" ? "30" : "360"} {tenureType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="space-y-6">
          {/* Comparison Results */}
          <div className="bg-white/95 rounded-[28px] border border-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.12)] overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Flat vs Reducing Balance Interest</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                  <div></div>
                  <div className="text-center">Flat Interest Rate</div>
                  <div className="text-center">Reducing Balance Interest</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-700">Monthly EMI</div>
                  <div className="text-center text-lg font-bold text-orange-600">
                    {formatCurrency(results.flatRate.monthlyEMI)}
                  </div>
                  <div className="text-center text-lg font-bold text-green-600">
                    {formatCurrency(results.reducingBalance.monthlyEMI)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-700">Total Interest</div>
                  <div className="text-center text-lg font-bold text-orange-600">
                    {formatCurrency(results.flatRate.totalInterest)}
                  </div>
                  <div className="text-center text-lg font-bold text-green-600">
                    {formatCurrency(results.reducingBalance.totalInterest)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-sm font-medium text-gray-700">Total Amount</div>
                  <div className="text-center text-lg font-bold text-orange-600">
                    {formatCurrency(results.flatRate.totalAmount)}
                  </div>
                  <div className="text-center text-lg font-bold text-green-600">
                    {formatCurrency(results.reducingBalance.totalAmount)}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em] mb-3">Total Cost Visualizer</p>
                <div className="space-y-4">
                  {[
                    {
                      label: "Flat Rate",
                      value: results.flatRate.totalAmount,
                      color: "bg-orange-500",
                      accent: "text-orange-600",
                    },
                    {
                      label: "Reducing Balance",
                      value: results.reducingBalance.totalAmount,
                      color: "bg-green-500",
                      accent: "text-green-600",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                        <span>{item.label}</span>
                        <span className={item.accent}>{formatCurrency(item.value)}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`${item.color} h-full rounded-full transition-[width] duration-500`}
                          style={{
                            width: `${
                              item.value > 0
                                ? Math.max(12, (item.value / maxAmount) * 100)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight & Graphs */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-400 to-primary-500 rounded-[28px] p-6 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70 mb-2">Smart choice</p>
              <h3 className="text-2xl font-semibold mb-3">You Save with Reducing Balance</h3>
              <div className="text-4xl font-bold mb-2">
                {formatCurrency(results.savings)}
              </div>
              <p className="text-white/80 text-sm mb-5">
                Switching to reducing balance interest trims your repayment schedule and keeps more money in your pocket.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-1">Flat EMI</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.flatRate.monthlyEMI)}</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-1">Reducing EMI</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.reducingBalance.monthlyEMI)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/95 rounded-[28px] border border-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Interest composition</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Flat Rate",
                    color: "#fb923c",
                    bg: "bg-orange-50",
                    composition: flatComposition,
                    interest: results.flatRate.totalInterest,
                  },
                  {
                    label: "Reducing",
                    color: "#34d399",
                    bg: "bg-emerald-50",
                    composition: reducingComposition,
                    interest: results.reducingBalance.totalInterest,
                  },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-2xl p-4 text-center`}>
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">{item.label}</h4>
                    <div className="relative flex items-center justify-center mb-3">
                      <svg className="w-36 h-36" viewBox="0 0 192 192">
                        <circle
                          cx="96"
                          cy="96"
                          r="70"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="18"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="70"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="18"
                          strokeDasharray={`${(item.composition.principal / 100) * circumference} ${circumference}`}
                          transform="rotate(-90 96 96)"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-xs text-gray-500">Principal share</p>
                        <p className="text-xl font-bold text-gray-800">
                          {item.composition.principal.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">Interest paid</p>
                    <p className="text-base font-semibold text-gray-800">{formatCurrency(item.interest)}</p>
                    <p className="text-xs text-gray-500 mt-1">Interest share: {item.composition.interest.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Understanding Section */}
          <div className="bg-white/95 rounded-[28px] shadow-[0_15px_60px_rgba(15,23,42,0.12)] p-6 border border-white/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">i</div>
              <h3 className="text-lg font-semibold text-gray-900">Understanding the Difference</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong className="text-orange-600">Flat Rate:</strong> Interest calculated on original principal amount throughout the loan tenure
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong className="text-green-600">Reducing Balance:</strong> Interest calculated on outstanding principal balance, decreasing over time
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
