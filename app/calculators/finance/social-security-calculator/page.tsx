"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function SocialSecurityCalculator() {
  const [currentAge, setCurrentAge] = useState(45);
  const [annualEarnings, setAnnualEarnings] = useState(65000);
  const [yearsWorked, setYearsWorked] = useState(20);
  const [retirementAge, setRetirementAge] = useState<62 | 67 | 70>(67);

  const [result, setResult] = useState<{
    aime: number;
    pia: number;
    monthlyBenefit: number;
    annualBenefit: number;
    benefit62: number;
    benefit67: number;
    benefit70: number;
    breakEven6267: number;
    breakEven6770: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["social-security", ...recent.filter((id: string) => id !== "social-security")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [currentAge, annualEarnings, yearsWorked, retirementAge]);

  const calculate = () => {
    if (yearsWorked === 0 || annualEarnings === 0) {
      setResult(null);
      return;
    }

    // AIME: Average Indexed Monthly Earnings
    const aime = annualEarnings / 12;

    // PIA using bend points (2024 values)
    const bp1 = 1174;
    const bp2 = 7078;
    let pia = 0;
    if (aime <= bp1) {
      pia = aime * 0.9;
    } else if (aime <= bp2) {
      pia = bp1 * 0.9 + (aime - bp1) * 0.32;
    } else {
      pia = bp1 * 0.9 + (bp2 - bp1) * 0.32 + (aime - bp2) * 0.15;
    }

    // Scale by years worked vs 35-year full career
    const workFactor = Math.min(yearsWorked, 35) / 35;
    pia = pia * workFactor;

    // Age adjustments
    // At 62: -30% (36 months early at 5/9 of 1% per month for first 36, then 5/12% after)
    // At 67: 0% (Full Retirement Age assumed 67)
    // At 70: +24% (8% per year for 3 years of delayed credits)
    const benefit62 = pia * 0.70;
    const benefit67 = pia;
    const benefit70 = pia * 1.24;

    // Determine selected benefit
    const monthlyBenefit =
      retirementAge === 62 ? benefit62 :
      retirementAge === 70 ? benefit70 :
      benefit67;

    // Break-even analysis: total cumulative benefits
    // breakEven6267: age at which claiming at 67 gives more total than 62
    // At 62 you get 5 more years of benefit62 before reaching 67
    // Total62(n years after 62) = benefit62 * (n + 5) * 12
    // Total67(n years after 67) = benefit67 * n * 12
    // benefit67 * n * 12 = benefit62 * (n + 5) * 12
    // n * (benefit67 - benefit62) = benefit62 * 5
    // n = benefit62 * 5 / (benefit67 - benefit62)
    let breakEven6267 = 0;
    if (benefit67 > benefit62) {
      const yearsAfter67 = (benefit62 * 5) / (benefit67 - benefit62);
      breakEven6267 = 67 + yearsAfter67;
    }

    // Break-even 67 vs 70: 3 extra years from 67
    // Total67(n years after 70) = benefit67 * (n + 3) * 12
    // Total70(n years after 70) = benefit70 * n * 12
    // n * (benefit70 - benefit67) = benefit67 * 3
    // n = benefit67 * 3 / (benefit70 - benefit67)
    let breakEven6770 = 0;
    if (benefit70 > benefit67) {
      const yearsAfter70 = (benefit67 * 3) / (benefit70 - benefit67);
      breakEven6770 = 70 + yearsAfter70;
    }

    setResult({
      aime,
      pia,
      monthlyBenefit,
      annualBenefit: monthlyBenefit * 12,
      benefit62,
      benefit67,
      benefit70,
      breakEven6267,
      breakEven6770,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Social Security Calculator", href: "/calculators/finance/social-security-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Security Benefits Estimator</h1>
        <p className="text-base text-gray-600">Estimate your monthly Social Security benefit and compare claiming ages</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Age</label>
              <span className="text-sm font-bold text-blue-600">{currentAge} years</span>
            </div>
            <input type="range" min={18} max={70} step={1} value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>18</span><span>70</span></div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Annual Earnings</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={annualEarnings}
                  onChange={(e) => setAnnualEarnings(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={250000} step={1000} value={annualEarnings}
              onChange={(e) => setAnnualEarnings(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Years Worked</label>
              <span className="text-sm font-bold text-green-600">{yearsWorked} years</span>
            </div>
            <input type="range" min={0} max={40} step={1} value={yearsWorked}
              onChange={(e) => setYearsWorked(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>40</span></div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Retirement Age</label>
            <div className="flex gap-2">
              {([62, 67, 70] as const).map((age) => (
                <button key={age} onClick={() => setRetirementAge(age)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${retirementAge === age ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {age}
                  {age === 62 && <span className="block text-xs opacity-80">Early</span>}
                  {age === 67 && <span className="block text-xs opacity-80">Full</span>}
                  {age === 70 && <span className="block text-xs opacity-80">Delayed</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result ? (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Monthly Benefit at Age {retirementAge}</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.monthlyBenefit)}</div>
                <div className="text-sm text-gray-500 mt-1">Annual: {fmt(result.annualBenefit)}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Benefit Comparison by Claiming Age</div>
                <div className="space-y-2">
                  {[
                    { age: 62, benefit: result.benefit62, label: "Early (−30%)", color: "text-red-600", bg: "bg-red-50" },
                    { age: 67, benefit: result.benefit67, label: "Full Retirement Age", color: "text-blue-600", bg: "bg-blue-50" },
                    { age: 70, benefit: result.benefit70, label: "Delayed (+24%)", color: "text-green-600", bg: "bg-green-50" },
                  ].map(({ age, benefit, label, color, bg }) => (
                    <div key={age} className={`${bg} rounded-lg p-2 flex justify-between items-center ${retirementAge === age ? "ring-2 ring-blue-300" : ""}`}>
                      <div>
                        <span className="text-sm font-semibold text-gray-800">Age {age}</span>
                        <span className="text-xs text-gray-500 ml-2">{label}</span>
                      </div>
                      <span className={`text-sm font-bold ${color}`}>{fmt(benefit)}/mo</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
                <div className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Break-Even Analysis</div>
                <div className="text-sm text-gray-700">
                  Waiting until 67 vs 62 pays off at age <strong>{result.breakEven6267 > 0 ? result.breakEven6267.toFixed(0) : "N/A"}</strong>
                </div>
                <div className="text-sm text-gray-700">
                  Waiting until 70 vs 67 pays off at age <strong>{result.breakEven6770 > 0 ? result.breakEven6770.toFixed(0) : "N/A"}</strong>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                <strong>AIME:</strong> {fmt(result.aime)}/mo &nbsp;|&nbsp; <strong>PIA:</strong> {fmt(result.pia)}/mo
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400">
              Enter your earnings and years worked to see your estimate.
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">Social Security benefits are based on your <strong>Average Indexed Monthly Earnings (AIME)</strong> — essentially your average lifetime monthly earnings. The AIME is then run through a <strong>bend-point formula</strong> to calculate your Primary Insurance Amount (PIA), which is what you receive at your Full Retirement Age (FRA, assumed 67).</p>
            <p className="mb-2">Claiming early at 62 permanently reduces your benefit by up to 30%. Delaying past FRA earns you 8% more per year, up to age 70, for a 24% bonus. The break-even age tells you at what point the higher monthly amount catches up with the years of missed payments.</p>
            <p className="text-xs text-gray-500 mt-2">Disclaimer: This is a simplified estimate. Your actual benefit depends on your full 35-year earnings history indexed for inflation. Use the SSA's My Social Security portal for an official estimate.</p>
          </div>
        }
        faqs={[
          { question: "What is the best age to claim Social Security?", answer: "It depends on your health, financial need, and life expectancy. If you expect to live past ~78-80, delaying to 70 is typically advantageous. If you need income immediately or have health concerns, claiming at 62 may be better." },
          { question: "What is a PIA?", answer: "PIA stands for Primary Insurance Amount — the monthly benefit you receive if you claim at your Full Retirement Age (FRA). Early claiming reduces this; delayed claiming increases it." },
          { question: "What are bend points?", answer: "Bend points are thresholds in the Social Security formula where the replacement rate changes. The first dollars of AIME are replaced at 90%, the next portion at 32%, and anything above the upper bend point at 15%. This makes Social Security more generous to lower earners." },
          { question: "Does working more years help?", answer: "Yes. Social Security is calculated on your highest 35 years of earnings. If you have fewer than 35 years, zeros are averaged in, reducing your benefit. Working more years replaces those zeros with actual earnings." },
        ]}
        relatedCalculators={[
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">How Social Security Benefits Are Calculated</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-mono bg-white p-2 rounded border">AIME = Annual Earnings ÷ 12</p>
            <p className="text-sm font-mono bg-white p-2 rounded border">PIA = 90% × min(AIME, $1,174) + 32% × min(max(AIME−$1,174, 0), $5,904) + 15% × max(AIME−$7,078, 0)</p>
            <p className="text-sm font-mono bg-white p-2 rounded border">Benefit = PIA × age_factor × (years_worked ÷ 35)</p>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
