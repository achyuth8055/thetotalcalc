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

function getAnnualFPL(size: number): number {
  if (size <= 8) return FPL_2025[size];
  return FPL_2025[8] + (size - 8) * FPL_EXTRA;
}

type Category = "adult" | "child" | "pregnant" | "elderly" | "disability";

// States that have NOT expanded Medicaid as of 2025
const NON_EXPANSION_STATES = new Set(["FL", "TX", "GA", "SC", "WI", "WY", "KS", "MS", "AL", "TN", "SD"]);

const US_STATES: { name: string; code: string }[] = [
  { name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" }, { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" }, { name: "California", code: "CA" }, { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" }, { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" }, { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" }, { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" }, { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" }, { name: "Maryland", code: "MD" }, { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" }, { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" }, { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" }, { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" }, { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" }, { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" }, { name: "Pennsylvania", code: "PA" }, { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" }, { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" }, { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" }, { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" }, { name: "District of Columbia", code: "DC" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function getIncomeLimit(category: Category, stateCode: string, age: number): { pct: number; program: string; notes: string } {
  const isExpansion = !NON_EXPANSION_STATES.has(stateCode);

  if (category === "adult") {
    if (isExpansion) {
      return { pct: 138, program: "Medicaid (ACA Expansion)", notes: "Adults 19–64 in expansion states qualify at 138% FPL." };
    } else {
      return { pct: 100, program: "Limited Medicaid / Marketplace", notes: "Your state has not fully expanded Medicaid. Adults may have limited options. Check healthcare.gov for marketplace subsidies." };
    }
  }
  if (category === "child") {
    if (age < 6) return { pct: 200, program: "Medicaid / CHIP", notes: "Children under 6 qualify at 200% FPL in most states." };
    return { pct: 200, program: "CHIP", notes: "Children 6–18 typically qualify at 200% FPL via CHIP. Some states cover up to 300%." };
  }
  if (category === "pregnant") {
    return { pct: 200, program: "Pregnancy Medicaid", notes: "Pregnancy Medicaid typically covers at 200% FPL in most states. Some states extend to 215% or higher." };
  }
  if (category === "elderly") {
    return { pct: 100, program: "Medicaid (Elderly)", notes: "Income and asset limits apply for elderly/nursing home Medicaid. SSI recipients typically qualify automatically. Spousal protection rules may apply." };
  }
  if (category === "disability") {
    return { pct: 100, program: "Medicaid (Disability/SSI)", notes: "SSI recipients are automatically enrolled in Medicaid in most states. Working individuals with disabilities may qualify under Medicaid Buy-In programs at higher income levels." };
  }
  return { pct: 138, program: "Medicaid", notes: "" };
}

export default function MedicaidEligibilityCalculator() {
  const [stateCode, setStateCode] = useState("CA");
  const [householdSize, setHouseholdSize] = useState(2);
  const [monthlyIncome, setMonthlyIncome] = useState(2500);
  const [category, setCategory] = useState<Category>("adult");
  const [age, setAge] = useState(35);

  const [result, setResult] = useState<{
    annualIncome: number;
    fpl: number;
    incomePct: number;
    limit: { pct: number; program: string; notes: string };
    eligible: "likely" | "may" | "unlikely";
    limitIncome: number;
    marketplaceSubsidy: boolean;
    isExpansion: boolean;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["medicaid", ...recent.filter((id: string) => id !== "medicaid")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [stateCode, householdSize, monthlyIncome, category, age]);

  const calculate = () => {
    const annualIncome = monthlyIncome * 12;
    const fpl = getAnnualFPL(householdSize);
    const incomePct = (annualIncome / fpl) * 100;
    const limit = getIncomeLimit(category, stateCode, age);
    const limitIncome = fpl * (limit.pct / 100);
    const isExpansion = !NON_EXPANSION_STATES.has(stateCode);

    let eligible: "likely" | "may" | "unlikely";
    if (incomePct <= limit.pct) {
      eligible = "likely";
    } else if (incomePct <= limit.pct * 1.10) {
      eligible = "may"; // within 10% - state rules may vary
    } else {
      eligible = "unlikely";
    }

    // Marketplace subsidy eligibility: 100%–400% FPL
    const marketplaceSubsidy = incomePct >= 100 && incomePct <= 400 && category === "adult";

    setResult({ annualIncome, fpl, incomePct, limit, eligible, limitIncome, marketplaceSubsidy, isExpansion });
  };

  const CATEGORIES: { key: Category; label: string }[] = [
    { key: "adult", label: "Adult (19–64)" },
    { key: "child", label: "Child (under 19)" },
    { key: "pregnant", label: "Pregnant" },
    { key: "elderly", label: "Elderly (65+)" },
    { key: "disability", label: "Disability/SSI" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Medicaid Eligibility", href: "/calculators/finance/medicaid-eligibility" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicaid Eligibility Checker</h1>
        <p className="text-base text-gray-600">Check if you may qualify for Medicaid or CHIP coverage based on 2025 federal income guidelines</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {/* State */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">State</label>
            <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
            {NON_EXPANSION_STATES.has(stateCode) && (
              <p className="text-xs text-orange-600 mt-1">⚠ This state has not fully expanded Medicaid under the ACA. Coverage limits may differ from expansion states.</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Coverage Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(({ key, label }) => (
                <button key={key} onClick={() => setCategory(key)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors text-left ${category === key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Age</label>
              <input type="number" value={age} min={0} max={100}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>

          {/* Household Size */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Household Size</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-100 flex items-center justify-center">−</button>
              <span className="text-2xl font-bold text-blue-600 w-8 text-center">{householdSize}</span>
              <button onClick={() => setHouseholdSize(Math.min(12, householdSize + 1))}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-100 flex items-center justify-center">+</button>
            </div>
          </div>

          {/* Monthly Income */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Monthly Household Income</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={10000} step={100} value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Status Card */}
              <div className={`rounded-xl p-5 text-center border-2 ${
                result.eligible === "likely" ? "bg-green-50 border-green-200" :
                result.eligible === "may" ? "bg-yellow-50 border-yellow-200" :
                "bg-red-50 border-red-200"
              }`}>
                <div className="text-3xl mb-1">
                  {result.eligible === "likely" ? "✓" : result.eligible === "may" ? "~" : "✗"}
                </div>
                <div className={`text-2xl font-bold mb-1 ${
                  result.eligible === "likely" ? "text-green-700" :
                  result.eligible === "may" ? "text-yellow-700" :
                  "text-red-700"
                }`}>
                  {result.eligible === "likely" ? "Likely Eligible" :
                   result.eligible === "may" ? "May Qualify" :
                   "Likely Not Eligible"}
                </div>
                <div className="text-sm font-semibold text-gray-700">{result.limit.program}</div>
              </div>

              {/* Income vs Limit */}
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 space-y-3">
                <div className="text-sm font-semibold text-gray-700">Income Analysis</div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Annual Income</span>
                    <span className="font-semibold text-gray-800">{fmt(result.annualIncome)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Federal Poverty Level ({householdSize} person)</span>
                    <span className="font-semibold text-gray-800">{fmt(result.fpl)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Income as % of FPL</span>
                    <span className={`font-bold ${result.incomePct <= result.limit.pct ? "text-green-600" : "text-red-600"}`}>
                      {result.incomePct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2 mt-2">
                    <span className="text-gray-600">Medicaid Income Limit</span>
                    <span className="font-semibold text-blue-600">{result.limit.pct}% FPL ({fmt(result.limitIncome)}/yr)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${result.incomePct <= result.limit.pct ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(100, (result.incomePct / (result.limit.pct * 1.5)) * 100)}%` }}
                    />
                    {/* Limit marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-blue-600"
                      style={{ left: `${Math.min(99, (result.limit.pct / (result.limit.pct * 1.5)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span className="text-blue-500">{result.limit.pct}% limit</span>
                    <span>{(result.limit.pct * 1.5).toFixed(0)}%</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 bg-gray-50 rounded p-2">{result.limit.notes}</p>
              </div>

              {/* Marketplace Subsidies */}
              {result.marketplaceSubsidy && result.eligible !== "likely" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Marketplace Subsidies Available</p>
                  <p className="text-xs text-blue-700">Your income ({result.incomePct.toFixed(0)}% FPL) falls in the range for ACA marketplace premium tax credits (100–400% FPL). Visit <span className="font-semibold">healthcare.gov</span> to explore subsidized plans.</p>
                </div>
              )}

              {/* CTA */}
              <a href="https://www.healthcare.gov" target="_blank" rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-4 rounded-xl transition-colors">
                Check coverage at healthcare.gov →
              </a>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This tool provides estimates based on federal income guidelines. Actual eligibility depends on state-specific rules, asset tests, immigration status, and other factors. Contact your state Medicaid office or visit medicaid.gov for an official determination.
        </p>
      </div>

      {result && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Income vs threshold horizontal bars */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Income vs Eligibility Threshold</h3>
              <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1 font-medium">
                  <span>Your Annual Income</span>
                  <span>{fmt(result.annualIncome)}</span>
                </div>
                <div className="h-5 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all ${result.annualIncome <= result.limitIncome ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(100, (result.annualIncome / (result.limitIncome * 1.5)) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1 font-medium">
                  <span>Medicaid Limit ({result.limit.pct}% FPL)</span>
                  <span>{fmt(result.limitIncome)}</span>
                </div>
                <div className="h-5 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(100, (result.limitIncome / (result.limitIncome * 1.5)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$0</span>
                <span className={result.annualIncome <= result.limitIncome ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {result.annualIncome <= result.limitIncome ? "Within limit" : "Exceeds limit"}
                </span>
                <span>{fmt(result.limitIncome * 1.5)}</span>
              </div>
            </div>
          </div>

          {/* Bar chart: income limits by household size (138% FPL) */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Medicaid Income Limits by Household Size</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[1, 2, 3, 4, 5, 6].map((size) => {
                  const fplVal = size <= 8 ? FPL_2025[size] : FPL_2025[8] + (size - 8) * FPL_EXTRA;
                  return {
                    size: `${size} person`,
                    "138% FPL Limit": Math.round(fplVal * 1.38),
                    isUser: size === householdSize,
                  };
                })}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Income Limit"]} />
                <Bar dataKey="138% FPL Limit" radius={[4, 4, 0, 0]}>
                  {[1, 2, 3, 4, 5, 6].map((size) => (
                    <Cell key={size} fill={size === householdSize ? "#3b82f6" : "#cbd5e1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-1 text-center">Blue bar = your household size. Based on 138% FPL (Medicaid expansion standard).</p>
          </div>
        </div>
      )}

      <CalculatorLayout title="" description=""
        explanation={
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Medicaid expansion:</strong> Under the ACA, states that expanded Medicaid cover adults up to 138% of the Federal Poverty Level (FPL). As of 2025, some states still have not expanded, limiting coverage for adults.</p>
            <p><strong>CHIP (Children Health Insurance Program):</strong> Covers children in families with income too high for Medicaid but who can't afford private insurance - generally up to 200% FPL, with some states going higher.</p>
            <p><strong>Marketplace subsidies:</strong> If you earn 100–400% FPL and aren't eligible for Medicaid, you likely qualify for premium tax credits on healthcare.gov marketplace plans.</p>
          </div>
        }
        faqs={[
          { question: "What is the difference between Medicaid and Medicare?", answer: "Medicaid is a state/federal program for low-income individuals of any age. Medicare is a federal program primarily for people 65+ or with certain disabilities, regardless of income." },
          { question: "Can I have both Medicaid and Medicare?", answer: "Yes - 'dual eligible' individuals qualify for both programs. Medicaid can help cover Medicare premiums, deductibles, and copays." },
          { question: "Does immigration status affect Medicaid eligibility?", answer: "Yes. US citizens and many qualified immigrants are eligible. Undocumented individuals generally are not eligible for full Medicaid, though emergency services are covered. DACA recipients are not eligible for full Medicaid in most states." },
          { question: "What is the Medicaid asset test?", answer: "Some Medicaid categories (like long-term care) have asset limits in addition to income limits. ACA expansion Medicaid for adults generally does not have an asset test." },
        ]}
        relatedCalculators={[
          { name: "SNAP Eligibility", href: "/calculators/finance/snap-eligibility" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
