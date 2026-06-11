"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function HomeAffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(90000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1800);

  const [result, setResult] = useState<{
    maxHomePrice: number;
    loanAmount: number;
    monthlyPITI: number;
    monthlyPI: number;
    monthlyTax: number;
    monthlyInsurance: number;
    frontEndDTI: number;
    backEndDTI: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["home-affordability", ...recent.filter((id: string) => id !== "home-affordability")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, homeInsurance]);

  const calculate = () => {
    const monthlyIncome = annualIncome / 12;
    if (monthlyIncome <= 0) return;

    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;

    // 28% front-end rule: PITI <= 28% of gross monthly income
    const maxPITI = monthlyIncome * 0.28;
    // 36% back-end rule: all debts <= 36% of gross monthly income
    const maxTotalDebt = monthlyIncome * 0.36;
    const maxHousingFromBackEnd = maxTotalDebt - monthlyDebts;
    const maxHousingPayment = Math.min(maxPITI, maxHousingFromBackEnd);

    // Find max home price iteratively
    const findMaxHomePrice = (maxMonthlyHousing: number): number => {
      // monthly housing = PI + tax + insurance
      // insurance is fixed; tax scales with price
      // PI = loanAmount * r(1+r)^n / ((1+r)^n - 1)
      // loanAmount = price - downPayment
      // tax = price * taxRate / 12
      // Solve: price * taxRate/12 + (price - dp) * piPerDollar + ins/12 = maxMonthly
      const piPerDollar = r === 0 ? 1 / n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const monthlyIns = homeInsurance / 12;
      const taxPerDollar = propertyTaxRate / 100 / 12;
      // price * (taxPerDollar + piPerDollar) - downPayment * piPerDollar + monthlyIns = maxMonthlyHousing
      const price = (maxMonthlyHousing - monthlyIns + downPayment * piPerDollar) / (taxPerDollar + piPerDollar);
      return Math.max(0, price);
    };

    const maxHomePrice = findMaxHomePrice(maxHousingPayment);
    const loanAmount = Math.max(0, maxHomePrice - downPayment);
    const piPerDollar = r === 0 ? 1 / n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyPI = loanAmount * piPerDollar;
    const monthlyTax = (maxHomePrice * propertyTaxRate) / 100 / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyPITI = monthlyPI + monthlyTax + monthlyInsurance;

    const frontEndDTI = monthlyIncome > 0 ? (monthlyPITI / monthlyIncome) * 100 : 0;
    const backEndDTI = monthlyIncome > 0 ? ((monthlyPITI + monthlyDebts) / monthlyIncome) * 100 : 0;

    setResult({ maxHomePrice, loanAmount, monthlyPITI, monthlyPI, monthlyTax, monthlyInsurance, frontEndDTI, backEndDTI });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const getDTIColor = (dti: number) => {
    if (dti < 28) return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: "Excellent", dot: "bg-green-500" };
    if (dti <= 36) return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", label: "Acceptable", dot: "bg-orange-500" };
    return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "High Risk", dot: "bg-red-500" };
  };

  const dtiColor = result ? getDTIColor(result.frontEndDTI) : getDTIColor(0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Home Affordability Calculator", href: "/calculators/finance/home-affordability-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Affordability Calculator</h1>
        <p className="text-base text-gray-600">Find out how much home you can afford using the 28/36 debt-to-income rule</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {[
            { label: "Annual Income", value: annualIncome, set: setAnnualIncome, min: 20000, max: 500000, step: 1000, color: "blue", prefix: "$" },
            { label: "Monthly Debts (car, student loans, etc.)", value: monthlyDebts, set: setMonthlyDebts, min: 0, max: 5000, step: 50, color: "red", prefix: "$" },
            { label: "Down Payment", value: downPayment, set: setDownPayment, min: 0, max: 500000, step: 1000, color: "green", prefix: "$" },
            { label: "Interest Rate", value: interestRate, set: setInterestRate, min: 1, max: 15, step: 0.1, color: "orange", suffix: "%" },
            { label: "Property Tax Rate", value: propertyTaxRate, set: setPropertyTaxRate, min: 0.1, max: 4, step: 0.05, color: "purple", suffix: "%" },
            { label: "Home Insurance (per year)", value: homeInsurance, set: setHomeInsurance, min: 500, max: 10000, step: 100, color: "indigo", prefix: "$" },
          ].map(({ label, value, set, min, max, step, color, prefix, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
                  />
                  {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          ))}

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Loan Term</label>
            <div className="flex gap-2">
              {[15, 20, 30].map((y) => (
                <button key={y} onClick={() => setLoanTerm(y)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${loanTerm === y ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {y}yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Maximum Home Price</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.maxHomePrice)}</div>
                <div className="text-xs text-gray-500 mt-1">based on 28/36 DTI rule</div>
              </div>

              <div className={`${dtiColor.bg} border ${dtiColor.border} rounded-lg p-3 flex items-center gap-3`}>
                <span className={`w-3 h-3 rounded-full ${dtiColor.dot} flex-shrink-0`}></span>
                <div>
                  <div className={`text-sm font-semibold ${dtiColor.text}`}>Affordability: {dtiColor.label}</div>
                  <div className="text-xs text-gray-500">Front-end DTI: {result.frontEndDTI.toFixed(1)}% | Back-end DTI: {result.backEndDTI.toFixed(1)}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Loan Amount</div>
                  <div className="text-lg font-bold text-blue-700">{fmt(result.loanAmount)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Monthly PITI</div>
                  <div className="text-lg font-bold text-purple-700">{fmt(result.monthlyPITI)}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Monthly Payment Breakdown</div>
                {[
                  { label: "Principal & Interest", value: result.monthlyPI, color: "text-blue-600" },
                  { label: "Property Tax", value: result.monthlyTax, color: "text-orange-600" },
                  { label: "Home Insurance", value: result.monthlyInsurance, color: "text-green-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{label}</span>
                    <span className={`font-semibold ${color}`}>{fmt(value)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-800">Total PITI</span>
                  <span className="text-gray-900">{fmt(result.monthlyPITI)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Monthly Income Needed</div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">For 28% front-end DTI</span>
                  <span className="font-semibold text-gray-800">{fmt(result.monthlyPITI / 0.28)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Your monthly income</span>
                  <span className="font-semibold text-green-700">{fmt(annualIncome / 12)}</span>
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
            <p className="mb-4">The home affordability calculator uses two standard underwriting rules. The <strong>28% front-end rule</strong> says your monthly housing costs (principal, interest, taxes, insurance — PITI) should not exceed 28% of your gross monthly income. The <strong>36% back-end rule</strong> says your total monthly debt payments should not exceed 36% of gross income. Your maximum home price is determined by whichever limit is lower.</p>
            <p>A higher down payment directly increases how much home you can afford because it reduces the loan amount and monthly P&I payment. Improving your credit score can also lower your interest rate and expand your budget significantly.</p>
          </div>
        }
        faqs={[
          { question: "What is the 28/36 rule?", answer: "The 28/36 rule is a common guideline used by lenders. It states that no more than 28% of your gross monthly income should go to housing costs (front-end ratio), and no more than 36% should go to all debt payments combined (back-end ratio)." },
          { question: "What does PITI mean?", answer: "PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a typical monthly mortgage payment. This calculator includes all four in the affordability assessment." },
          { question: "Is PMI included?", answer: "Private Mortgage Insurance (PMI) is not included. If your down payment is less than 20%, you may owe an additional 0.5–1% of the loan annually, which would reduce the maximum home price you can afford." },
          { question: "How can I afford more house?", answer: "You can afford more home by increasing your income, reducing existing monthly debts, saving a larger down payment, or securing a lower interest rate by improving your credit score." },
        ]}
        relatedCalculators={[
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">How Home Affordability Is Calculated</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div>
              <div className="text-sm font-semibold text-gray-700">Front-End DTI (28% Rule)</div>
              <p className="text-sm font-mono bg-white p-2 rounded border mt-1">Max PITI = Monthly Gross Income × 0.28</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Back-End DTI (36% Rule)</div>
              <p className="text-sm font-mono bg-white p-2 rounded border mt-1">Max Housing = Monthly Income × 0.36 − Monthly Debts</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">The lower of the two limits is used to determine your maximum PITI, from which the max home price is derived by solving backwards through the mortgage payment formula.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
