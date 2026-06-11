"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function FourOhOneKCalculator() {
  const [annualSalary, setAnnualSalary] = useState(85000);
  const [contributionPct, setContributionPct] = useState(6);
  const [employerMatchPct, setEmployerMatchPct] = useState(50);
  const [employerMatchUpTo, setEmployerMatchUpTo] = useState(6);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(15000);
  const [expectedReturn, setExpectedReturn] = useState(7);

  const [result, setResult] = useState<{
    yourAnnualContribution: number;
    employerAnnualContribution: number;
    totalAnnualContribution: number;
    projectedBalance: number;
    takeHomeWithout: number;
    takeHomeWith: number;
    takeHomeDiff: number;
    moneyLeftOnTable: number;
    isOverLimit: boolean;
    limit: number;
    yearsToRetire: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["401k", ...recent.filter((id: string) => id !== "401k")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [annualSalary, contributionPct, employerMatchPct, employerMatchUpTo, currentAge, retirementAge, currentBalance, expectedReturn]);

  const calculate = () => {
    const limit = currentAge >= 50 ? 31000 : 23500;
    const yourAnnualContribution = Math.min(annualSalary * (contributionPct / 100), limit);

    // Employer match: employer matches employerMatchPct% of your contribution, up to employerMatchUpTo% of salary
    const maxEmployerMatch = annualSalary * (employerMatchUpTo / 100) * (employerMatchPct / 100);
    const yourContribForMatch = annualSalary * (contributionPct / 100);
    const matchBasis = Math.min(yourContribForMatch, annualSalary * (employerMatchUpTo / 100));
    const employerAnnualContribution = matchBasis * (employerMatchPct / 100);

    // Money left on table: if not contributing enough to max employer match
    const maxEmployerMatchable = annualSalary * (employerMatchUpTo / 100);
    const moneyLeftOnTable = Math.max(0, maxEmployerMatch - employerAnnualContribution);

    const totalAnnualContribution = yourAnnualContribution + employerAnnualContribution;
    const yearsToRetire = Math.max(0, retirementAge - currentAge);

    // Project balance using monthly compounding
    const monthlyReturn = expectedReturn / 100 / 12;
    const months = yearsToRetire * 12;
    const monthlyContribution = totalAnnualContribution / 12;

    let projectedBalance = currentBalance;
    if (monthlyReturn > 0) {
      projectedBalance = currentBalance * Math.pow(1 + monthlyReturn, months) +
        monthlyContribution * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
    } else {
      projectedBalance = currentBalance + monthlyContribution * months;
    }

    // Take-home pay impact (estimated 22% marginal tax bracket)
    const taxRate = 0.22;
    const takeHomeWithout = annualSalary * (1 - taxRate);
    const takeHomeWith = (annualSalary - yourAnnualContribution) * (1 - taxRate);
    const takeHomeDiff = takeHomeWithout - takeHomeWith; // actual reduction in take-home

    setResult({
      yourAnnualContribution,
      employerAnnualContribution,
      totalAnnualContribution,
      projectedBalance,
      takeHomeWithout,
      takeHomeWith,
      takeHomeDiff,
      moneyLeftOnTable,
      isOverLimit: annualSalary * (contributionPct / 100) > limit,
      limit,
      yearsToRetire,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "401k Calculator", href: "/calculators/finance/401k-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">401(k) Contribution Calculator</h1>
        <p className="text-base text-gray-600">See your projected 401(k) balance, employer match, and take-home pay impact</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Annual Salary</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={annualSalary}
                  onChange={(e) => setAnnualSalary(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={20000} max={500000} step={1000} value={annualSalary}
              onChange={(e) => setAnnualSalary(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Your Contribution</label>
              <span className="text-sm font-bold text-blue-600">{contributionPct}% = {fmt(annualSalary * contributionPct / 100)}/yr</span>
            </div>
            <input type="range" min={1} max={30} step={0.5} value={contributionPct}
              onChange={(e) => setContributionPct(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-700">Employer Match</label>
                <span className="text-xs font-bold text-green-600">{employerMatchPct}%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={employerMatchPct}
                onChange={(e) => setEmployerMatchPct(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-700">Match Up To</label>
                <span className="text-xs font-bold text-green-600">{employerMatchUpTo}% of salary</span>
              </div>
              <input type="range" min={0} max={10} step={0.5} value={employerMatchUpTo}
                onChange={(e) => setEmployerMatchUpTo(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Current Age", value: currentAge, set: setCurrentAge, min: 18, max: 75, color: "blue" },
              { label: "Retirement Age", value: retirementAge, set: setRetirementAge, min: 40, max: 80, color: "purple" },
            ].map(({ label, value, set, min, max, color }) => (
              <div key={label}>
                <label className="text-xs font-semibold text-gray-700 block mb-1">{label}</label>
                <input type="number" value={value} min={min} max={max}
                  onChange={(e) => set(Number(e.target.value) || min)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Current 401(k) Balance</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={currentBalance}
                  onChange={(e) => setCurrentBalance(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={500000} step={1000} value={currentBalance}
              onChange={(e) => setCurrentBalance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Expected Annual Return</label>
              <span className="text-sm font-bold text-orange-600">{expectedReturn}%</span>
            </div>
            <input type="range" min={1} max={15} step={0.5} value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Projected Balance at Retirement</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.projectedBalance)}</div>
                <div className="text-xs text-gray-500 mt-1">in {result.yearsToRetire} years at age {retirementAge}</div>
              </div>

              {result.isOverLimit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                  Warning: Your contribution of {fmt(Math.round(annualSalary * contributionPct / 100))} exceeds the 2025 IRS limit of {fmt(result.limit)}. Contribution has been capped.
                </div>
              )}

              {result.moneyLeftOnTable > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-700">
                  You are leaving <strong>{fmt(result.moneyLeftOnTable)}/year</strong> in employer match on the table. Contribute at least {employerMatchUpTo}% to capture the full match.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Your Contribution/yr</div>
                  <div className="text-lg font-bold text-blue-700">{fmt(result.yourAnnualContribution)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Employer Match/yr</div>
                  <div className="text-lg font-bold text-green-700">{fmt(result.employerAnnualContribution)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Total Annual Contribution</div>
                  <div className="text-lg font-bold text-purple-700">{fmt(result.totalAnnualContribution)}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Take-Home Pay Impact (est. 22% tax bracket)</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Without 401(k)</span>
                    <span className="font-semibold text-gray-800">{fmt(result.takeHomeWithout / 12)}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">With 401(k)</span>
                    <span className="font-semibold text-blue-700">{fmt(result.takeHomeWith / 12)}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-1 mt-1">
                    <span className="text-gray-600">Reduction in take-home</span>
                    <span className="font-semibold text-orange-600">−{fmt(result.takeHomeDiff / 12)}/mo</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Contributing {fmt(result.yourAnnualContribution / 12)}/mo only costs {fmt(result.takeHomeDiff / 12)}/mo after tax savings
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">A 401(k) is an employer-sponsored retirement savings plan that lets you contribute pre-tax dollars, reducing your taxable income today. Your investments grow tax-deferred until withdrawal in retirement. Many employers offer a matching contribution — free money that dramatically accelerates your balance.</p>
            <p className="mb-2">The <strong>2025 IRS contribution limit</strong> is $23,500 (under 50) or $31,000 (50 and older, including $7,500 catch-up). The tax savings shown assume a 22% federal marginal rate — your actual savings depend on your specific tax situation.</p>
          </div>
        }
        faqs={[
          { question: "How much should I contribute to my 401(k)?", answer: "At minimum, contribute enough to capture your full employer match — that's an immediate 50–100% return. Beyond that, aim for 10–15% of your salary including the match. Max out if you can." },
          { question: "What is an employer match?", answer: "An employer match means your employer contributes to your 401(k) based on what you contribute, up to a limit. A common structure is '50% match on up to 6% of salary' — meaning if you put in 6%, your employer adds another 3%." },
          { question: "What is the 2025 contribution limit?", answer: "For 2025, you can contribute up to $23,500 to a 401(k). If you are 50 or older, the catch-up contribution limit brings the total to $31,000." },
          { question: "Traditional vs Roth 401(k)?", answer: "A traditional 401(k) reduces your taxes now (pre-tax contributions). A Roth 401(k) uses after-tax dollars but grows and withdraws tax-free. The better option depends on whether you expect to be in a higher or lower tax bracket in retirement." },
        ]}
        relatedCalculators={[
          { name: "Roth vs Traditional IRA", href: "/calculators/finance/roth-vs-traditional-ira" },
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">How 401(k) Growth Is Projected</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-mono bg-white p-2 rounded border">FV = Balance × (1+r)ⁿ + MonthlyContrib × ((1+r)ⁿ − 1) / r</p>
            <p className="text-xs text-gray-600 mt-2">Where r = monthly return rate, n = months until retirement, contributions are compounded monthly</p>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
