"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

// IRS Uniform Lifetime Table (simplified)
const IRS_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9,
  78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7,
  84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2,
};

function getDistributionPeriod(age: number): number | null {
  if (age < 73) return null;
  if (age >= 90) return 12.2;
  if (IRS_TABLE[age]) return IRS_TABLE[age];
  // Linear interpolation
  const lower = Math.floor(age);
  const upper = Math.ceil(age);
  if (IRS_TABLE[lower] && IRS_TABLE[upper]) {
    return IRS_TABLE[lower] + (IRS_TABLE[upper] - IRS_TABLE[lower]) * (age - lower);
  }
  return IRS_TABLE[lower] || IRS_TABLE[upper] || null;
}

export default function RMDCalculator() {
  const [age, setAge] = useState(75);
  const [balance, setBalance] = useState(500000);
  const [accountType, setAccountType] = useState<"Traditional IRA" | "401k" | "403b">("Traditional IRA");
  const [beneficiaryType, setBeneficiaryType] = useState<"Account owner" | "Surviving spouse" | "Other">("Account owner");
  const [taxRate, setTaxRate] = useState(22);

  const [result, setResult] = useState<{
    annualRMD: number;
    monthlyRMD: number;
    distributionPeriod: number;
    estimatedTax: number;
    penaltyForMissing: number;
    rmdPct: number;
    requiresRMD: boolean;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["rmd", ...recent.filter((id: string) => id !== "rmd")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [age, balance, accountType, beneficiaryType, taxRate]);

  const calculate = () => {
    const dp = getDistributionPeriod(age);
    if (!dp || balance <= 0) {
      setResult(null);
      return;
    }
    const annualRMD = balance / dp;
    const monthlyRMD = annualRMD / 12;
    const estimatedTax = annualRMD * (taxRate / 100);
    const penaltyForMissing = annualRMD * 0.25;
    const rmdPct = (annualRMD / balance) * 100;

    setResult({
      annualRMD,
      monthlyRMD,
      distributionPeriod: dp,
      estimatedTax,
      penaltyForMissing,
      rmdPct,
      requiresRMD: true,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtDec = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  const requiresRMD = age >= 73;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "RMD Calculator", href: "/calculators/finance/rmd-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Required Minimum Distribution (RMD) Calculator</h1>
        <p className="text-base text-gray-600">Calculate your annual RMD from traditional IRAs, 401(k)s, and other retirement accounts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
          {/* Age slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Age</label>
              <span className="text-lg font-bold text-blue-600">{age} years</span>
            </div>
            <input type="range" min={60} max={100} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>60</span><span>100</span>
            </div>
          </div>

          {/* Balance */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-700">Retirement Account Balance</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value) || 0)}
                  className="w-32 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={10000} max={5000000} step={10000} value={balance} onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          {/* Account Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Account Type</label>
            <div className="flex gap-2 flex-wrap">
              {(["Traditional IRA", "401k", "403b"] as const).map((t) => (
                <button key={t} onClick={() => setAccountType(t)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${accountType === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Beneficiary Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Beneficiary Type</label>
            <div className="flex gap-2 flex-wrap">
              {(["Account owner", "Surviving spouse", "Other"] as const).map((t) => (
                <button key={t} onClick={() => setBeneficiaryType(t)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${beneficiaryType === t ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tax Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Federal Tax Rate (estimate)</label>
              <span className="text-lg font-bold text-orange-600">{taxRate}%</span>
            </div>
            <input type="range" min={10} max={37} step={1} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span><span>37%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {!requiresRMD ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
              <div className="text-5xl">📅</div>
              <div className="text-xl font-bold text-gray-700">RMDs Begin at Age 73</div>
              <p className="text-gray-500 text-sm max-w-xs">
                Under the SECURE 2.0 Act, required minimum distributions now start at age 73 (increased from 72). You're currently {age} years old — RMDs will begin in {73 - age} year{73 - age !== 1 ? "s" : ""}.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 w-full">
                No RMD required until age 73
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Annual RMD for Age {age}</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.annualRMD)}</div>
                <div className="text-xs text-gray-500 mt-1">{result.rmdPct.toFixed(2)}% of balance</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Monthly Equivalent</div>
                  <div className="text-lg font-bold text-blue-600">{fmtDec(result.monthlyRMD)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Distribution Period</div>
                  <div className="text-lg font-bold text-gray-700">{result.distributionPeriod} years</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Est. Federal Tax ({taxRate}%)</div>
                  <div className="text-lg font-bold text-orange-600">{fmt(result.estimatedTax)}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Penalty if Missed (25%)</div>
                  <div className="text-lg font-bold text-red-600">{fmt(result.penaltyForMissing)}</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <strong>Account:</strong> {accountType} &bull; <strong>Beneficiary:</strong> {beneficiaryType}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                RMD is calculated using the IRS Uniform Lifetime Table. Deadline is December 31 each year (April 1 for your first RMD).
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">Required Minimum Distributions (RMDs) are the minimum amounts the IRS requires you to withdraw annually from traditional IRAs, 401(k)s, 403(b)s, and most other tax-deferred retirement accounts starting at age 73 (per SECURE 2.0 Act).</p>
            <p className="mb-3"><strong>Formula:</strong> RMD = Account Balance ÷ Distribution Period (from IRS Uniform Lifetime Table)</p>
            <p>The distribution period decreases as you age, meaning the percentage you must withdraw increases each year. Missing an RMD results in a 25% excise tax on the amount not withdrawn (reduced from 50% by SECURE 2.0).</p>
          </div>
        }
        faqs={[
          { question: "What happens if I miss my RMD deadline?", answer: "Missing an RMD triggers a 25% excise tax (reduced from 50% by the SECURE 2.0 Act) on the amount you should have withdrawn but didn't. The IRS may waive this penalty under specific circumstances, but it's important to take RMDs on time. The deadline is December 31, except for your first RMD which can be delayed until April 1 of the following year." },
          { question: "Do Roth IRAs have RMDs?", answer: "No! Roth IRAs do not have RMDs during the original account owner's lifetime. This is one of the major advantages of Roth accounts — your money can continue growing tax-free as long as you live. However, inherited Roth IRAs are subject to RMD rules for beneficiaries." },
          { question: "Can I withdraw more than the RMD?", answer: "Yes, you can always withdraw more than the RMD amount. The RMD is the minimum required — not a maximum. However, withdrawals beyond the RMD are still subject to ordinary income tax (and potentially the 10% early withdrawal penalty if under 59½)." },
          { question: "What if I have multiple retirement accounts?", answer: "If you have multiple IRAs, you calculate an RMD for each, but you can take the total from any one IRA or combination of IRAs. For 401(k)s and 403(b)s, however, you must calculate and take separate RMDs from each individual plan." },
        ]}
        relatedCalculators={[
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Required Minimum Distributions</h2>
          <p className="text-sm text-gray-700">The IRS Uniform Lifetime Table assigns a distribution period to each age, which decreases over time — requiring you to withdraw a larger percentage of your balance each year.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
