"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function RothVsTraditionalIRA() {
  const [annualContribution, setAnnualContribution] = useState(6000);
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentTaxRate, setCurrentTaxRate] = useState(22);
  const [retirementTaxRate, setRetirementTaxRate] = useState(22);
  const [annualReturn, setAnnualReturn] = useState(7);

  const [result, setResult] = useState<{
    rothFinalBalance: number;
    traditionalFinalBalance: number;
    traditionalAfterTaxBalance: number;
    rothTaxSavingsAtRetirement: number;
    traditionalTaxSavingsNow: number;
    breakEvenTaxRate: number;
    yearsToRetire: number;
    totalContributions: number;
    rothBetter: boolean;
    difference: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["roth-ira", ...recent.filter((id: string) => id !== "roth-ira")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [annualContribution, currentAge, retirementAge, currentTaxRate, retirementTaxRate, annualReturn]);

  const calculate = () => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const r = annualReturn / 100;
    const totalContributions = annualContribution * yearsToRetire;

    // Roth: contribute after-tax, grows tax-free
    // Future value of annuity (end of year)
    const fv = r > 0
      ? annualContribution * ((Math.pow(1 + r, yearsToRetire) - 1) / r) * (1 + r)
      : annualContribution * yearsToRetire;
    const rothFinalBalance = fv; // No tax at withdrawal

    // Traditional: contribute pre-tax (save currentTaxRate% now), grows tax-deferred, taxed at retirementTaxRate at withdrawal
    // The pre-tax contribution grows to the same nominal FV as Roth
    // But the traditional contribution is effectively larger (you contributed pre-tax dollars worth annualContribution / (1-currentTaxRate))
    // However, to compare apples-to-apples on the same nominal contribution amount:
    const traditionalFinalBalance = fv; // Same growth on same nominal contribution
    const traditionalAfterTaxBalance = traditionalFinalBalance * (1 - retirementTaxRate / 100);

    // Tax savings now (traditional): each year you save currentTaxRate% of contribution
    const traditionalTaxSavingsNow = totalContributions * (currentTaxRate / 100);

    // Roth tax savings at retirement: taxes you avoid vs traditional
    const rothTaxSavingsAtRetirement = traditionalFinalBalance * (retirementTaxRate / 100);

    // Break-even tax rate: what retirement tax rate would make them equal?
    // RothBalance = TraditionalAfterTax
    // fv = fv * (1 - breakEvenRate)
    // 1 = 1 - breakEvenRate → only with same contribution basis
    // Actually: Roth after-tax contribution = annualContrib * (1 - currentTaxRate/100) if we think in pre-tax terms
    // Roth balance = annualContrib * FVfactor (already after-tax)
    // Traditional balance after tax = annualContrib * FVfactor * (1 - retirementTaxRate/100)
    // They're equal when retirementTaxRate = currentTaxRate
    // Break-even: when Roth (after-tax basis) = Traditional (after-tax withdrawal)
    // Roth: (annualContrib) * FVfactor   (no further tax)
    // Trad: (annualContrib) * FVfactor * (1 - t_r/100) + (annualContrib * t_c/100) * growth_on_tax_savings
    // Simplified break-even (ignoring tax savings reinvestment): t_r = t_c → breakEvenTaxRate = currentTaxRate
    const breakEvenTaxRate = currentTaxRate;

    const rothBetter = retirementTaxRate > currentTaxRate;
    const difference = Math.abs(rothFinalBalance - traditionalAfterTaxBalance);

    setResult({
      rothFinalBalance,
      traditionalFinalBalance,
      traditionalAfterTaxBalance,
      rothTaxSavingsAtRetirement,
      traditionalTaxSavingsNow,
      breakEvenTaxRate,
      yearsToRetire,
      totalContributions,
      rothBetter,
      difference,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const contributionLimit = currentAge >= 50 ? 8000 : 7000;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Roth vs Traditional IRA", href: "/calculators/finance/roth-vs-traditional-ira" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Roth vs Traditional IRA Calculator</h1>
        <p className="text-base text-gray-600">Compare after-tax wealth between Roth and Traditional IRA strategies</p>
      </div>

      {/* Inputs — centered single column */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Annual Contribution
                {annualContribution > contributionLimit && (
                  <span className="ml-2 text-xs text-red-500 font-normal">(2025 limit: {fmt(contributionLimit)})</span>
                )}
              </label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input type="number" value={annualContribution}
                  onChange={(e) => setAnnualContribution(Math.min(Number(e.target.value) || 0, contributionLimit))}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={500} max={contributionLimit} step={500} value={Math.min(annualContribution, contributionLimit)}
              onChange={(e) => setAnnualContribution(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="text-xs text-gray-400 mt-1">Max: {fmt(contributionLimit)}/yr {currentAge >= 50 ? "(age 50+ catch-up included)" : "(age 50+ can contribute $8,000)"}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Current Age", value: currentAge, set: setCurrentAge, min: 18, max: 70, color: "blue" },
              { label: "Retirement Age", value: retirementAge, set: setRetirementAge, min: 30, max: 80, color: "purple" },
            ].map(({ label, value, set, min, max, color }) => (
              <div key={label}>
                <label className="text-xs font-semibold text-gray-700 block mb-1">{label}</label>
                <input type="number" value={value} min={min} max={max}
                  onChange={(e) => set(Number(e.target.value) || min)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
              </div>
            ))}
          </div>

          {[
            { label: "Current Marginal Tax Rate", value: currentTaxRate, set: setCurrentTaxRate, min: 0, max: 50, step: 1, color: "orange" },
            { label: "Expected Retirement Tax Rate", value: retirementTaxRate, set: setRetirementTaxRate, min: 0, max: 50, step: 1, color: "red" },
            { label: "Expected Annual Return", value: annualReturn, set: setAnnualReturn, min: 1, max: 15, step: 0.5, color: "green" },
          ].map(({ label, value, set, min, max, step, color }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <span className={`text-sm font-bold text-${color}-600`}>{value}%</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      {result && (
        <div className="space-y-6">
          {/* Side-by-side comparison card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              {/* Roth */}
              <div className={`p-6 ${result.rothBetter ? "bg-green-50" : "bg-gray-50"}`}>
                <div className="text-center mb-4">
                  <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${result.rothBetter ? "text-green-700" : "text-gray-500"}`}>Roth IRA</div>
                  <div className={`text-3xl font-bold ${result.rothBetter ? "text-green-600" : "text-gray-700"}`}>{fmt(result.rothFinalBalance)}</div>
                  <div className="text-xs text-gray-500 mt-1">tax-free at retirement</div>
                  {result.rothBetter && (
                    <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Recommended</div>
                  )}
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between"><span>Tax now</span><span className="font-medium text-red-600">Pay {currentTaxRate}%</span></div>
                  <div className="flex justify-between"><span>Growth</span><span className="font-medium">Tax-free</span></div>
                  <div className="flex justify-between"><span>Withdrawal</span><span className="font-medium text-green-600">Tax-free</span></div>
                </div>
              </div>

              {/* VS divider */}
              <div className="flex flex-col items-center justify-center p-4 bg-white">
                <div className="text-2xl font-black text-gray-300">vs</div>
                {result.difference > 0 && (
                  <div className="text-center mt-3">
                    <div className="text-xs text-gray-500">Difference</div>
                    <div className={`text-sm font-bold ${result.rothBetter ? "text-green-600" : "text-blue-600"}`}>{fmt(result.difference)}</div>
                    <div className="text-xs text-gray-500">more with</div>
                    <div className={`text-xs font-semibold ${result.rothBetter ? "text-green-600" : "text-blue-600"}`}>{result.rothBetter ? "Roth" : "Traditional"}</div>
                  </div>
                )}
              </div>

              {/* Traditional */}
              <div className={`p-6 ${!result.rothBetter ? "bg-blue-50" : "bg-gray-50"}`}>
                <div className="text-center mb-4">
                  <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${!result.rothBetter ? "text-blue-700" : "text-gray-500"}`}>Traditional IRA</div>
                  <div className={`text-3xl font-bold ${!result.rothBetter ? "text-blue-600" : "text-gray-700"}`}>{fmt(result.traditionalAfterTaxBalance)}</div>
                  <div className="text-xs text-gray-500 mt-1">after tax at retirement</div>
                  {!result.rothBetter && (
                    <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Recommended</div>
                  )}
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between"><span>Tax now</span><span className="font-medium text-green-600">Deductible</span></div>
                  <div className="flex justify-between"><span>Growth</span><span className="font-medium">Tax-deferred</span></div>
                  <div className="flex justify-between"><span>Withdrawal</span><span className="font-medium text-red-600">Taxed {retirementTaxRate}%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation banner */}
          <div className={`rounded-xl p-4 border-2 ${result.rothBetter ? "bg-green-50 border-green-200" : retirementTaxRate === currentTaxRate ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}`}>
            <div className="text-sm font-semibold text-gray-900">
              {retirementTaxRate > currentTaxRate
                ? "Roth IRA is better — you expect to be in a higher tax bracket in retirement. Pay taxes now at the lower rate."
                : retirementTaxRate < currentTaxRate
                ? "Traditional IRA is better — you expect to be in a lower tax bracket in retirement. Defer taxes until then."
                : "It's a tie — your current and retirement tax rates are equal. Either account gives the same after-tax result. Consider Roth for the added flexibility of tax-free withdrawals."}
            </div>
            <div className="text-xs text-gray-500 mt-1">Break-even tax rate: {result.breakEvenTaxRate}% — if your retirement rate equals your current rate, both accounts yield the same wealth.</div>
          </div>

          {/* Additional metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Years Invested</div>
              <div className="text-lg font-bold text-gray-800">{result.yearsToRetire}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Total Contributions</div>
              <div className="text-lg font-bold text-gray-800">{fmt(result.totalContributions)}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Trad. Tax Savings Now</div>
              <div className="text-lg font-bold text-blue-700">{fmt(result.traditionalTaxSavingsNow)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Roth Tax-Free Growth</div>
              <div className="text-lg font-bold text-green-700">{fmt(result.rothFinalBalance - result.totalContributions)}</div>
            </div>
          </div>
        </div>
      )}

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">Both Roth and Traditional IRAs let your investments grow inside a tax-advantaged account — the key difference is <em>when</em> you pay taxes. With a <strong>Traditional IRA</strong>, contributions may be tax-deductible now, reducing your taxable income today, but withdrawals in retirement are taxed as ordinary income. With a <strong>Roth IRA</strong>, you contribute after-tax dollars and owe nothing on qualified withdrawals — including all the growth.</p>
            <p className="mb-2">The winning strategy depends entirely on your tax rates. If you're in a low bracket now and expect to be in a higher one in retirement (common early in a career), Roth wins. If you're at your peak earning years and expect lower income in retirement, Traditional is usually better.</p>
            <p className="text-xs text-gray-500">Note: This calculator uses end-of-year contributions and assumes the same nominal contribution for both accounts. In practice, a Traditional IRA lets you invest more (the tax savings), but the comparison shown is on equal nominal contributions.</p>
          </div>
        }
        faqs={[
          { question: "What is the 2025 IRA contribution limit?", answer: "For 2025, you can contribute up to $7,000 per year to a Roth or Traditional IRA (or a combination). If you are 50 or older, the limit rises to $8,000 with the catch-up contribution." },
          { question: "Can I contribute to both a Roth and Traditional IRA?", answer: "Yes, but the combined total across all your IRAs cannot exceed the annual limit ($7,000 or $8,000 if 50+). You can split contributions between them in any proportion." },
          { question: "Are there income limits for Roth IRA contributions?", answer: "Yes. For 2025, Roth IRA contributions phase out at $150,000–$165,000 for single filers and $236,000–$246,000 for married filing jointly. Traditional IRA deductibility has separate income limits if you have a workplace plan." },
          { question: "When does the Roth IRA beat Traditional?", answer: "Roth wins when your retirement tax rate is higher than your current rate, when you want to leave tax-free money to heirs, or when you need flexibility (Roth contributions can be withdrawn penalty-free at any time)." },
          { question: "What is a backdoor Roth IRA?", answer: "If your income exceeds the Roth IRA limit, you can contribute to a non-deductible Traditional IRA and then convert it to a Roth. This strategy lets high earners access Roth benefits. Consult a tax advisor for your situation." },
        ]}
        relatedCalculators={[
          { name: "401k Calculator", href: "/calculators/finance/401k-calculator" },
          { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Roth vs Traditional IRA: The Math</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm font-semibold text-green-800 mb-1">Roth IRA</div>
              <p className="text-xs font-mono bg-white p-2 rounded border">After-tax contrib → FV → No tax</p>
              <p className="text-xs text-gray-600 mt-1">Final = Contribution × FV_factor</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-semibold text-blue-800 mb-1">Traditional IRA</div>
              <p className="text-xs font-mono bg-white p-2 rounded border">Pre-tax contrib → FV → Tax at withdrawal</p>
              <p className="text-xs text-gray-600 mt-1">After-tax = Contribution × FV_factor × (1 − t_retirement)</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">They break even when your retirement tax rate equals your current rate. Any higher retirement rate favors Roth; any lower rate favors Traditional.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
