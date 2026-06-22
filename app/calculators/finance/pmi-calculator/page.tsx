"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const fmtDec = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

function calcMonthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

interface PMISimResult {
  monthsWithPMI: number;
  totalPMI: number;
  dropOffDate: string;
  monthlyPayment: number;
}

function simulatePMI(
  homePrice: number,
  downPayment: number,
  termMonths: number,
  interestRate: number,
  pmiRate: number,
  extraMonthly: number
): PMISimResult {
  const loanAmount = homePrice - downPayment;
  const targetEquity = homePrice * 0.2; // 20% equity = 80% LTV
  const targetBalance = homePrice - targetEquity;

  if (loanAmount <= targetBalance) {
    return { monthsWithPMI: 0, totalPMI: 0, dropOffDate: "N/A - LTV already ≤ 80%", monthlyPayment: calcMonthlyPayment(loanAmount, interestRate, termMonths) };
  }

  const monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, termMonths);
  const r = interestRate / 100 / 12;
  let balance = loanAmount;
  let months = 0;
  let totalPMI = 0;

  while (balance > targetBalance && months < termMonths) {
    months++;
    const interest = balance * r;
    const principal = monthlyPayment + extraMonthly - interest;
    balance = Math.max(0, balance - principal);
    const monthlyPMI = loanAmount * (pmiRate / 100) / 12;
    totalPMI += monthlyPMI;
  }

  const dropOffDate = new Date();
  dropOffDate.setMonth(dropOffDate.getMonth() + months);
  const dropOffStr = dropOffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return { monthsWithPMI: months, totalPMI, dropOffDate: dropOffStr, monthlyPayment };
}

export default function PMICalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(40000);
  const [loanTerm, setLoanTerm] = useState<15 | 20 | 30>(30);
  const [pmiRate, setPmiRate] = useState(0.8);
  const [interestRate, setInterestRate] = useState(6.8);
  const [extraPayment, setExtraPayment] = useState(0);

  const [result, setResult] = useState<{
    ltv: number;
    loanAmount: number;
    monthlyPMI: number;
    monthlyPayment: number;
    base: PMISimResult;
    withExtra: PMISimResult | null;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["pmi", ...recent.filter((id: string) => id !== "pmi")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [homePrice, downPayment, loanTerm, pmiRate, interestRate, extraPayment]);

  const calculate = () => {
    const loanAmount = Math.max(0, homePrice - downPayment);
    const ltv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;
    const termMonths = loanTerm * 12;

    const monthlyPMI = ltv > 80 ? loanAmount * (pmiRate / 100) / 12 : 0;
    const monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, termMonths);

    const base = simulatePMI(homePrice, downPayment, termMonths, interestRate, pmiRate, 0);
    const withExtra = extraPayment > 0
      ? simulatePMI(homePrice, downPayment, termMonths, interestRate, pmiRate, extraPayment)
      : null;

    setResult({ ltv, loanAmount, monthlyPMI, monthlyPayment, base, withExtra });
  };

  const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "PMI Calculator", href: "/calculators/finance/pmi-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PMI Calculator</h1>
        <p className="text-base text-gray-600">Calculate monthly PMI costs, when it drops off, and how extra payments help</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {/* Home Price */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Home Price</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={homePrice} min={50000} max={2000000} step={5000}
                  onChange={(e) => setHomePrice(Number(e.target.value) || 50000)}
                  className="w-28 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-blue-600 focus:ring-1 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={50000} max={2000000} step={5000} value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Down Payment</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{downPaymentPct.toFixed(1)}%</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">$</span>
                  <input type="number" value={downPayment} min={0} max={homePrice} step={1000}
                    onChange={(e) => setDownPayment(Math.min(Number(e.target.value) || 0, homePrice))}
                    className="w-28 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-green-600 focus:ring-1 focus:ring-green-500 focus:border-transparent" />
                </div>
              </div>
            </div>
            <input type="range" min={0} max={homePrice} step={1000} value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            <div className="flex gap-2 mt-2">
              {[3, 5, 10, 15, 20].map((pct) => (
                <button key={pct} onClick={() => setDownPayment(Math.round(homePrice * pct / 100))}
                  className={`flex-1 py-1 text-xs font-semibold rounded transition-colors ${
                    Math.abs(downPaymentPct - pct) < 0.5
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Loan Term</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {([15, 20, 30] as const).map((term) => (
                <button key={term} onClick={() => setLoanTerm(term)}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                    loanTerm === term ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}>
                  {term} yr
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Interest Rate</label>
              <div className="flex items-center gap-1">
                <input type="number" value={interestRate} min={1} max={20} step={0.1}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 1)}
                  className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-orange-600 focus:ring-1 focus:ring-orange-500 focus:border-transparent" />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <input type="range" min={1} max={15} step={0.1} value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>

          {/* PMI Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">PMI Rate</label>
              <div className="flex items-center gap-1">
                <input type="number" value={pmiRate} min={0.2} max={2.0} step={0.05}
                  onChange={(e) => setPmiRate(Number(e.target.value) || 0.2)}
                  className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-red-600 focus:ring-1 focus:ring-red-500 focus:border-transparent" />
                <span className="text-xs text-gray-500">%/yr</span>
              </div>
            </div>
            <input type="range" min={0.2} max={2.0} step={0.05} value={pmiRate}
              onChange={(e) => setPmiRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
            <p className="text-xs text-gray-400 mt-1">Typical range: 0.5%–1.5%. Lower with better credit.</p>
          </div>

          {/* Extra Monthly Payment */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Extra Monthly Payment (optional)</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">$</span>
                <input type="number" value={extraPayment} min={0} max={5000} step={25}
                  onChange={(e) => setExtraPayment(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-right border border-gray-300 rounded text-xs font-semibold text-purple-600 focus:ring-1 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={0} max={2000} step={25} value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              {/* Monthly PMI primary result */}
              <div className={`border-2 rounded-lg p-4 text-center ${result.ltv > 80 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                <div className="text-sm text-gray-600 mb-1">Monthly PMI Cost</div>
                <div className={`text-4xl font-bold ${result.ltv > 80 ? "text-red-600" : "text-green-600"}`}>
                  {result.ltv > 80 ? fmtDec(result.monthlyPMI) : "$0"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.ltv > 80 ? `PMI required - LTV is ${result.ltv.toFixed(1)}%` : "No PMI - LTV is " + result.ltv.toFixed(1) + "%"}
                </div>
              </div>

              {/* LTV Gauge */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Loan-to-Value (LTV)</span>
                  <span className={`font-bold ${result.ltv > 80 ? "text-red-600" : "text-green-600"}`}>{result.ltv.toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all ${result.ltv > 80 ? "bg-red-400" : "bg-green-500"}`}
                    style={{ width: `${Math.min(100, result.ltv)}%` }}
                  />
                  {/* 80% marker */}
                  <div className="absolute top-0 bottom-0 border-l-2 border-gray-600 opacity-60" style={{ left: "80%" }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span className="text-gray-600 font-medium">80% PMI threshold</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Loan Amount</div>
                  <div className="font-bold text-blue-700 text-sm">{fmt(result.loanAmount)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Monthly P&I</div>
                  <div className="font-bold text-orange-600 text-sm">{fmtDec(result.monthlyPayment)}</div>
                </div>
              </div>

              {result.ltv > 80 && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Total PMI Cost</div>
                      <div className="font-bold text-red-600 text-sm">{fmt(result.base.totalPMI)}</div>
                      <div className="text-xs text-gray-400">until 20% equity</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">PMI Drops Off</div>
                      <div className="font-bold text-purple-600 text-sm">{result.base.dropOffDate}</div>
                      <div className="text-xs text-gray-400">in {result.base.monthsWithPMI} months</div>
                    </div>
                  </div>

                  {result.withExtra && extraPayment > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-green-800 mb-1">With +{fmt(extraPayment)}/mo extra payment</div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>PMI drops off: <span className="font-bold text-green-700">{result.withExtra.dropOffDate}</span></div>
                        <div>Months saved: <span className="font-bold text-green-700">{result.base.monthsWithPMI - result.withExtra.monthsWithPMI}</span></div>
                        <div>PMI saved: <span className="font-bold text-green-700">{fmt(result.base.totalPMI - result.withExtra.totalPMI)}</span></div>
                        <div>New PMI period: <span className="font-bold">{result.withExtra.monthsWithPMI} months</span></div>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                    <p className="font-semibold mb-1">How to remove PMI</p>
                    <p>By law (Homeowners Protection Act), PMI automatically cancels at 78% LTV based on the original amortization schedule. You can request cancellation at 80% LTV. Contact your lender and request a new appraisal if home values have risen.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {result && result.ltv > 0 && (() => {
        const loanAmount = homePrice - downPayment;
        const termMonths = loanTerm * 12;
        const r = interestRate / 100 / 12;
        const monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, termMonths);
        const chartData: { year: number; LTV: number }[] = [];
        let balance = loanAmount;
        for (let m = 0; m <= termMonths; m += 12) {
          const ltv = homePrice > 0 ? Math.round((balance / homePrice) * 100 * 10) / 10 : 0;
          chartData.push({ year: m / 12, LTV: ltv });
          for (let i = 0; i < 12 && m + i < termMonths; i++) {
            const interest = balance * r;
            const principal = monthlyPayment - interest;
            balance = Math.max(0, balance - principal);
          }
        }
        return (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">LTV Ratio Over Time</h3>
              <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, "LTV"]} />
                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "80% PMI threshold", position: "insideTopRight", fontSize: 11, fill: "#ef4444" }} />
                <Area type="monotone" dataKey="LTV" stroke="#3b82f6" fill="#bfdbfe" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      })()}

      <CalculatorLayout title="" description=""
        explanation={
          <div>
            <p className="mb-2">Private Mortgage Insurance (PMI) is required by most lenders when your down payment is less than 20% of the home's purchase price. PMI protects the lender - not you - if you default. It typically costs 0.5%–1.5% of the loan amount per year.</p>
            <p className="mb-2">Under the Homeowners Protection Act, lenders must automatically cancel PMI when your loan balance reaches 78% of the original home value (based on the original amortization schedule). You can request cancellation at 80% LTV, which may require a new appraisal.</p>
            <p className="text-xs text-gray-500 mt-2">This calculator assumes 0% home appreciation for conservative estimates. Your actual PMI cancellation date may be sooner if your home appreciates.</p>
          </div>
        }
        faqs={[
          { question: "Is PMI tax deductible?", answer: "PMI deductibility has varied by year and income level. As of recent tax years, the deduction has not been permanently extended. Check with a tax professional for the current tax year rules." },
          { question: "Can I avoid PMI without 20% down?", answer: "Yes. Options include: lender-paid PMI (higher interest rate instead), piggyback loans (80-10-10 structure), VA loans (no PMI for veterans), and some conventional loans with lender-paid PMI. Each has trade-offs." },
          { question: "How does home appreciation affect PMI?", answer: "If your home's value rises, your LTV may drop below 80% sooner. You can request PMI cancellation and a new appraisal from your lender. This calculator assumes 0% appreciation for conservative estimates." },
          { question: "What's the difference between PMI and MIP?", answer: "PMI is for conventional loans and can be removed. MIP (Mortgage Insurance Premium) is for FHA loans and often cannot be removed for the life of the loan for borrowers with less than 10% down payment." },
        ]}
        relatedCalculators={[
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Home Affordability Calculator", href: "/calculators/finance/mortgage-affordability-calculator" },
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Understanding PMI and How to Get Rid of It</h2>
          <p className="text-sm text-gray-700">PMI adds real cost to your monthly payment. Extra payments toward principal can eliminate it months or years early, saving thousands.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
