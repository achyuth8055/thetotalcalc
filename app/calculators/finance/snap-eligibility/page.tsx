"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from "recharts";

const FPL_2025: Record<number, number> = {
  1: 15060, 2: 20440, 3: 25820, 4: 31200,
  5: 36580, 6: 41960, 7: 47340, 8: 52720,
};
const FPL_EXTRA = 5380;

const MAX_BENEFIT_2025: Record<number, number> = {
  1: 292, 2: 536, 3: 768, 4: 975,
  5: 1158, 6: 1390, 7: 1536, 8: 1756,
};

const STANDARD_DEDUCTION: Record<string, number> = {
  "1": 228, "2": 228, "3": 228, "4": 234, "5": 275, "6+": 313,
};

function getFPL(size: number): number {
  if (size <= 8) return FPL_2025[size];
  return FPL_2025[8] + (size - 8) * FPL_EXTRA;
}

function getMaxBenefit(size: number): number {
  if (size <= 8) return MAX_BENEFIT_2025[size];
  return MAX_BENEFIT_2025[8] + (size - 8) * 194; // approximate per additional
}

function getStdDeduction(size: number): number {
  if (size <= 3) return STANDARD_DEDUCTION["1"];
  if (size === 4) return STANDARD_DEDUCTION["4"];
  if (size === 5) return STANDARD_DEDUCTION["5"];
  return STANDARD_DEDUCTION["6+"];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function SnapEligibilityCalculator() {
  const [householdSize, setHouseholdSize] = useState(2);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(2000);
  const [earnedIncome, setEarnedIncome] = useState(1500);
  const [elderlyDisabled, setElderlyDisabled] = useState(false);

  const [result, setResult] = useState<{
    fpl: number;
    grossLimit: number;
    netIncomeLimit: number;
    grossPct: number;
    netIncome: number;
    passesGross: boolean;
    passesNet: boolean;
    eligible: boolean;
    estimatedBenefit: number;
    maxBenefit: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["snap-eligibility", ...recent.filter((id: string) => id !== "snap-eligibility")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [householdSize, grossMonthlyIncome, earnedIncome, elderlyDisabled]);

  const calculate = () => {
    const annualFPL = getFPL(householdSize);
    const monthlyFPL = annualFPL / 12;
    const grossLimit = monthlyFPL * 1.30;
    const netIncomeLimit = monthlyFPL * 1.00;

    const passesGross = grossMonthlyIncome <= grossLimit;

    // Net income = gross - earned income deduction (20%) - standard deduction
    const earnedDeduction = earnedIncome * 0.20;
    const stdDeduction = getStdDeduction(householdSize);
    let netIncome = grossMonthlyIncome - earnedDeduction - stdDeduction;
    // Elderly/disabled: additional deductions (simplified: add $20 unearned income deduction)
    if (elderlyDisabled) netIncome -= 20;
    netIncome = Math.max(0, netIncome);

    const passesNet = netIncome <= netIncomeLimit;
    const eligible = passesGross && passesNet;

    const maxBenefit = getMaxBenefit(householdSize);
    const estimatedBenefit = eligible ? Math.min(maxBenefit, Math.max(0, maxBenefit - netIncome * 0.30)) : 0;
    const grossPct = (grossMonthlyIncome / monthlyFPL) * 100;

    setResult({ fpl: monthlyFPL, grossLimit, netIncomeLimit, grossPct, netIncome, passesGross, passesNet, eligible, estimatedBenefit, maxBenefit });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "SNAP Eligibility Calculator", href: "/calculators/finance/snap-eligibility" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SNAP Eligibility Calculator</h1>
        <p className="text-base text-gray-600">Estimate your eligibility for SNAP (food stamps) benefits based on 2025 federal guidelines</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {/* Household Size */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Household Size</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-100 flex items-center justify-center">−</button>
              <span className="text-2xl font-bold text-blue-600 w-8 text-center">{householdSize}</span>
              <button onClick={() => setHouseholdSize(Math.min(12, householdSize + 1))}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-100 flex items-center justify-center">+</button>
              <span className="text-sm text-gray-500">people in household</span>
            </div>
          </div>

          {/* Gross Monthly Income */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Gross Monthly Income</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={grossMonthlyIncome}
                  onChange={(e) => setGrossMonthlyIncome(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <p className="text-xs text-gray-400">All income before deductions (wages, SSI, SSDI, child support, etc.)</p>
            <input type="range" min={0} max={8000} step={50} value={grossMonthlyIncome}
              onChange={(e) => setGrossMonthlyIncome(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2" />
          </div>

          {/* Earned Income */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Earned Income <span className="text-xs text-gray-400">(wages/self-employment)</span></label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={earnedIncome}
                  onChange={(e) => setEarnedIncome(Math.min(Number(e.target.value) || 0, grossMonthlyIncome))}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
            <p className="text-xs text-gray-400">You get a 20% deduction on earned income</p>
          </div>

          {/* Elderly/Disabled */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="elderlyDisabled" checked={elderlyDisabled}
              onChange={(e) => setElderlyDisabled(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded" />
            <label htmlFor="elderlyDisabled" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Household includes elderly (60+) or disabled member
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Main Status */}
              <div className={`rounded-xl p-5 text-center border-2 ${result.eligible ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="text-3xl mb-1">{result.eligible ? "✓" : "✗"}</div>
                <div className={`text-2xl font-bold mb-1 ${result.eligible ? "text-green-700" : "text-red-700"}`}>
                  {result.eligible ? "Likely Eligible" : "Likely Not Eligible"}
                </div>
                <div className="text-sm text-gray-600">Based on 2025 federal SNAP guidelines</div>
              </div>

              {/* Benefit Estimate */}
              {result.eligible && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Estimated Monthly Benefit</div>
                  <div className="text-4xl font-bold text-blue-600">{fmt(result.estimatedBenefit)}</div>
                  <div className="text-xs text-gray-500 mt-1">Max benefit for household of {householdSize}: {fmt(result.maxBenefit)}/mo</div>
                </div>
              )}

              {/* Income Tests */}
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 space-y-3">
                <div className="text-sm font-semibold text-gray-700 mb-2">Income Tests</div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${result.passesGross ? "bg-green-50" : "bg-red-50"}`}>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Gross Income Test (130% FPL)</div>
                    <div className="text-xs text-gray-500">Your income: {fmt(result.fpl * 12 / 12 * 1)} FPL/mo = {fmt(result.grossLimit)} limit</div>
                  </div>
                  <div className={`text-sm font-bold px-3 py-1 rounded-full ${result.passesGross ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {result.passesGross ? "PASS" : "FAIL"}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Your gross income vs limit</span>
                    <span>{result.grossPct.toFixed(0)}% of FPL</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${result.grossPct <= 130 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(100, (result.grossPct / 200) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span><span className="text-orange-500">130% limit</span><span>200%</span>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${result.passesNet ? "bg-green-50" : "bg-red-50"}`}>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Net Income Test (100% FPL)</div>
                    <div className="text-xs text-gray-500">Net income after deductions: {fmt(result.netIncome)}/mo · Limit: {fmt(result.netIncomeLimit)}</div>
                  </div>
                  <div className={`text-sm font-bold px-3 py-1 rounded-full ${result.passesNet ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {result.passesNet ? "PASS" : "FAIL"}
                  </div>
                </div>
              </div>

              {/* Apply CTA */}
              {result.eligible && (
                <a href="https://www.benefits.gov/benefit/361" target="_blank" rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 px-4 rounded-xl transition-colors">
                  Apply at benefits.gov →
                </a>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This is an estimate based on federal guidelines. Final determination is made by your state SNAP office. Some states have additional rules, deductions, or categorical eligibility that may affect your eligibility. Contact your local benefits office for an official determination.
        </p>
      </div>

      {result && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Bar chart: max SNAP benefits by household size */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Max Monthly SNAP Benefits by Household Size</h3>
              <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[292, 535, 766, 973, 1155, 1386, 1532, 1751].map((benefit, i) => ({
                  size: `${i + 1}`,
                  "Max Benefit": benefit,
                  isUser: i + 1 === householdSize,
                }))}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" tick={{ fontSize: 11 }} label={{ value: "Household Size", position: "insideBottom", offset: -2, fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`$${value}/mo`, "Max Benefit"]} />
                <Bar dataKey="Max Benefit" radius={[4, 4, 0, 0]}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                    <Cell key={size} fill={size === householdSize ? "#22c55e" : "#cbd5e1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-1 text-center">Green bar = your household size. 2025 SNAP maximum allotments.</p>
          </div>

          {/* Income vs limit comparison */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Income vs SNAP Limits</h3>
              <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
            </div>
            <div className="space-y-6">
              {/* Gross income vs 130% FPL */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1 font-medium">
                  <span>Gross Income vs 130% FPL Limit</span>
                  <span>{fmt(grossMonthlyIncome)} / {fmt(result.grossLimit)}</span>
                </div>
                <div className="relative h-5 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all ${result.passesGross ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(100, (grossMonthlyIncome / (result.grossLimit * 1.3)) * 100)}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-blue-600"
                    style={{ left: `${Math.min(99, (result.grossLimit / (result.grossLimit * 1.3)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span className="text-blue-500">130% limit: {fmt(result.grossLimit)}</span>
                  <span>{fmt(result.grossLimit * 1.3)}</span>
                </div>
              </div>

              {/* Net income vs 100% FPL */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1 font-medium">
                  <span>Net Income vs 100% FPL Limit</span>
                  <span>{fmt(result.netIncome)} / {fmt(result.netIncomeLimit)}</span>
                </div>
                <div className="relative h-5 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all ${result.passesNet ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(100, (result.netIncome / (result.netIncomeLimit * 1.3)) * 100)}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-blue-600"
                    style={{ left: `${Math.min(99, (result.netIncomeLimit / (result.netIncomeLimit * 1.3)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span className="text-blue-500">100% limit: {fmt(result.netIncomeLimit)}</span>
                  <span>{fmt(result.netIncomeLimit * 1.3)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={
          <div className="space-y-2 text-sm text-gray-700">
            <p>SNAP eligibility is determined by two income tests: a <strong>gross income test</strong> (130% of the federal poverty level) and a <strong>net income test</strong> (100% of FPL). Most households must pass both.</p>
            <p>Net income is calculated by subtracting allowable deductions from gross income: a 20% earned income deduction on wages, a standard monthly deduction based on household size, and additional deductions for shelter costs and dependent care if applicable.</p>
            <p>Your monthly benefit is calculated as: <strong>Maximum Benefit − (Net Income × 0.30)</strong>. The 30% represents the share of net income households are expected to spend on food.</p>
          </div>
        }
        faqs={[
          { question: "What counts as income for SNAP?", answer: "Most income counts: wages, self-employment, Social Security, SSI, SSDI, pension, child support, and more. Some types like TANF, energy assistance, and student financial aid may be excluded." },
          { question: "Are assets counted for SNAP eligibility?", answer: "Most households must have assets below $2,750 (or $4,250 if a member is elderly/disabled). However, households where all members receive SSI or TANF may be categorically eligible and skip asset tests." },
          { question: "How often do SNAP benefits update?", answer: "SNAP benefits are typically loaded to an EBT card on a set day each month. Benefits must be used for eligible food items and cannot be used for alcohol, tobacco, vitamins, or hot prepared foods." },
          { question: "Can college students get SNAP?", answer: "Generally no — most students enrolled at least half-time are ineligible unless they work 20+ hours per week, have dependents, or meet other exemptions." },
        ]}
        relatedCalculators={[
          { name: "Medicaid Eligibility", href: "/calculators/finance/medicaid-eligibility" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
