"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TUITION_PRESETS = [
  { label: "Community College", value: 5000 },
  { label: "Public In-State", value: 11000 },
  { label: "Public Out-of-State", value: 29000 },
  { label: "Private 4-Year", value: 38000 },
  { label: "Custom", value: -1 },
];

export default function CollegeCostCalculator() {
  const [childAge, setChildAge] = useState(5);
  const [collegeStartAge, setCollegeStartAge] = useState(18);
  const [yearsInCollege, setYearsInCollege] = useState(4);
  const [tuitionPreset, setTuitionPreset] = useState(38000);
  const [customTuition, setCustomTuition] = useState(38000);
  const [useCustomTuition, setUseCustomTuition] = useState(false);
  const [roomBoard, setRoomBoard] = useState(12000);
  const [inflationRate, setInflationRate] = useState(5);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(300);
  const [investmentReturn, setInvestmentReturn] = useState(7);

  const [result, setResult] = useState<{
    yearsUntilCollege: number;
    annualCostFirstYear: number;
    totalProjectedCost: number;
    totalSavingsAtStart: number;
    fundingGap: number;
    monthlyNeeded: number;
    alreadyFunded: boolean;
    annualCostBreakdown: { year: number; tuition: number; roomBoard: number; total: number }[];
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["college-cost", ...recent.filter((id: string) => id !== "college-cost")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [childAge, collegeStartAge, yearsInCollege, tuitionPreset, customTuition, useCustomTuition, roomBoard, inflationRate, currentSavings, monthlyContribution, investmentReturn]);

  const calculate = () => {
    const yearsUntilCollege = Math.max(0, collegeStartAge - childAge);
    const annualTuition = useCustomTuition ? customTuition : tuitionPreset;
    const annualTotal = annualTuition + roomBoard;

    // Inflate annual cost to first year of college
    const annualCostFirstYear = annualTotal * Math.pow(1 + inflationRate / 100, yearsUntilCollege);

    // Calculate total college cost across all years (each year inflated further)
    let totalProjectedCost = 0;
    const annualCostBreakdown: { year: number; tuition: number; roomBoard: number; total: number }[] = [];
    for (let i = 0; i < yearsInCollege; i++) {
      const yearsFromNow = yearsUntilCollege + i;
      const inflatedTuition = annualTuition * Math.pow(1 + inflationRate / 100, yearsFromNow);
      const inflatedRoomBoard = roomBoard * Math.pow(1 + inflationRate / 100, yearsFromNow);
      const yearTotal = inflatedTuition + inflatedRoomBoard;
      totalProjectedCost += yearTotal;
      annualCostBreakdown.push({
        year: i + 1,
        tuition: inflatedTuition,
        roomBoard: inflatedRoomBoard,
        total: yearTotal,
      });
    }

    // Calculate savings at college start with compound growth
    const monthlyRate = investmentReturn / 100 / 12;
    const months = yearsUntilCollege * 12;
    let savingsAtStart: number;
    if (monthlyRate === 0) {
      savingsAtStart = currentSavings + monthlyContribution * months;
    } else {
      const futureCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, months);
      const futureContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      savingsAtStart = futureCurrentSavings + futureContributions;
    }

    const fundingGap = Math.max(0, totalProjectedCost - savingsAtStart);
    const alreadyFunded = fundingGap <= 0;

    // Monthly needed to close gap
    let monthlyNeeded = 0;
    if (!alreadyFunded && months > 0) {
      if (monthlyRate === 0) {
        monthlyNeeded = fundingGap / months;
      } else {
        monthlyNeeded = fundingGap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
      }
    }

    setResult({
      yearsUntilCollege,
      annualCostFirstYear,
      totalProjectedCost,
      totalSavingsAtStart: savingsAtStart,
      fundingGap,
      monthlyNeeded,
      alreadyFunded,
      annualCostBreakdown,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const fmtDec = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "College Cost Calculator", href: "/calculators/finance/college-cost-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">College Cost Calculator</h1>
        <p className="text-base text-gray-600">Project the total cost of college with inflation and see how much you need to save</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          {/* Child's age slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Child's Current Age</label>
              <span className="text-lg font-bold text-blue-600">{childAge} yrs</span>
            </div>
            <input type="range" min={0} max={17} step={1} value={childAge} onChange={(e) => setChildAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>17</span></div>
          </div>

          {/* College start age */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Expected College Start Age</label>
              <span className="text-lg font-bold text-blue-600">{collegeStartAge} yrs</span>
            </div>
            <input type="range" min={16} max={22} step={1} value={collegeStartAge} onChange={(e) => setCollegeStartAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          {/* Years in college */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Years in College</label>
            <div className="flex gap-2">
              {[2, 4, 6].map((y) => (
                <button key={y} onClick={() => setYearsInCollege(y)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${yearsInCollege === y ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {y} years
                </button>
              ))}
            </div>
          </div>

          {/* Tuition preset */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">College Type (Annual Tuition)</label>
            <div className="grid grid-cols-2 gap-2">
              {TUITION_PRESETS.map((preset) => (
                <button key={preset.label}
                  onClick={() => {
                    if (preset.value === -1) {
                      setUseCustomTuition(true);
                    } else {
                      setUseCustomTuition(false);
                      setTuitionPreset(preset.value);
                      setCustomTuition(preset.value);
                    }
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors text-left ${(useCustomTuition && preset.value === -1) || (!useCustomTuition && preset.value === tuitionPreset) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {preset.label}
                  {preset.value !== -1 && <span className="block text-xs opacity-75">{fmt(preset.value)}/yr</span>}
                </button>
              ))}
            </div>
          </div>

          {useCustomTuition && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">Custom Annual Tuition</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">$</span>
                  <input type="number" value={customTuition} onChange={(e) => setCustomTuition(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>
          )}

          {[
            { label: "Room & Board (Annual)", value: roomBoard, set: setRoomBoard, min: 0, max: 30000, step: 500, prefix: "$", accentColor: "blue" },
          ].map(({ label, value, set, min, max, step, prefix, accentColor }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${accentColor}-600 focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`} />
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${accentColor}-600`} />
            </div>
          ))}

          {/* Inflation rate slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Annual College Inflation Rate</label>
              <span className="text-lg font-bold text-orange-600">{inflationRate}%</span>
            </div>
            <input type="range" min={1} max={10} step={0.5} value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>10%</span></div>
          </div>

          <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Savings Plan</h2>

          {[
            { label: "Current 529 / College Savings", value: currentSavings, set: setCurrentSavings, min: 0, max: 200000, step: 1000, prefix: "$", color: "green" },
            { label: "Monthly Contribution", value: monthlyContribution, set: setMonthlyContribution, min: 0, max: 3000, step: 25, prefix: "$", color: "green" },
          ].map(({ label, value, set, min, max, step, prefix, color }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                  {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value) || 0)}
                    className={`w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:border-transparent`} />
                </div>
              </div>
              <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${color}-600`} />
            </div>
          ))}

          {/* Investment return slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Expected Investment Return</label>
              <span className="text-lg font-bold text-purple-600">{investmentReturn}%</span>
            </div>
            <input type="range" min={0} max={12} step={0.5} value={investmentReturn} onChange={(e) => setInvestmentReturn(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>12%</span></div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Total Projected College Cost</div>
                <div className="text-4xl font-bold text-green-600">{fmt(result.totalProjectedCost)}</div>
                <div className="text-xs text-gray-500 mt-1">{yearsInCollege} years at {fmt(result.annualCostFirstYear)}/yr (first year)</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-sm font-semibold text-blue-800">
                  {result.yearsUntilCollege > 0
                    ? `${result.yearsUntilCollege} years until college`
                    : "College starting now!"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Projected Savings at Start</div>
                  <div className="text-lg font-bold text-green-700">{fmt(result.totalSavingsAtStart)}</div>
                </div>
                <div className={`rounded-lg p-3 ${result.alreadyFunded ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="text-xs text-gray-500 mb-1">Funding Gap</div>
                  <div className={`text-lg font-bold ${result.alreadyFunded ? "text-green-700" : "text-red-600"}`}>
                    {result.alreadyFunded ? "Fully Funded!" : fmt(result.fundingGap)}
                  </div>
                </div>
              </div>

              {!result.alreadyFunded && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">Additional Monthly Savings Needed</div>
                  <div className="text-2xl font-bold text-purple-700">{fmt(result.monthlyNeeded)}/mo</div>
                  <div className="text-xs text-gray-500 mt-1">on top of current {fmt(monthlyContribution)}/mo</div>
                </div>
              )}

              {/* Annual cost breakdown */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Year-by-Year Cost (Inflation-Adjusted)</h3>
                <div className="space-y-1">
                  {result.annualCostBreakdown.map(({ year, tuition, roomBoard: rb, total }) => (
                    <div key={year} className="flex items-center justify-between text-sm py-1 border-b border-gray-100">
                      <span className="text-gray-600">Year {year}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-800">{fmt(total)}</span>
                        <span className="text-xs text-gray-500 ml-2">({fmt(tuition)} + {fmt(rb)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (() => {
        const totalYears = result.yearsUntilCollege + yearsInCollege;
        const chartData: { year: number; "Projected Cost": number; "Savings Goal": number }[] = [];
        const annualTuition = useCustomTuition ? customTuition : tuitionPreset;
        const annualTotal = annualTuition + roomBoard;
        const monthlyRate = investmentReturn / 100 / 12;
        for (let y = 1; y <= totalYears; y++) {
          const inflatedCost = annualTotal * Math.pow(1 + inflationRate / 100, y);
          const months = y * 12;
          let savings: number;
          if (monthlyRate === 0) {
            savings = currentSavings + monthlyContribution * months;
          } else {
            savings = currentSavings * Math.pow(1 + monthlyRate, months) + monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
          }
          chartData.push({ year: y, "Projected Cost": Math.round(inflatedCost), "Savings Goal": Math.round(savings) });
        }
        return (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Projected Cost vs Savings Over Time</h3>
              <button onClick={() => window.print()} className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">↓ PDF</button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Years from now", position: "insideBottom", offset: -2, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Projected Cost" stroke="#ef4444" fill="#fecaca" fillOpacity={0.5} />
                <Area type="monotone" dataKey="Savings Goal" stroke="#22c55e" fill="#bbf7d0" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      })()}

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">College costs have historically risen at 5–6% per year - significantly faster than general inflation. This means a school that costs $50,000/year today will cost over $81,000/year in 10 years at 5% inflation.</p>
            <p className="mb-3">This calculator projects total cost using compound inflation, then shows how your current savings and monthly contributions (growing at your expected investment return) compare to the projected need.</p>
            <p>A 529 plan is the most tax-efficient way to save for college - contributions grow tax-free and withdrawals for qualified education expenses are federal tax-free.</p>
          </div>
        }
        faqs={[
          { question: "What is a 529 plan and should I use one?", answer: "A 529 is a tax-advantaged savings plan designed for education expenses. Your contributions grow tax-free and qualified withdrawals (tuition, room & board, books) are federal tax-free. Most states offer an additional state income tax deduction for contributions. This makes 529 plans the most efficient vehicle for college savings for most families." },
          { question: "How much should I save monthly for college?", answer: "A common rule of thumb is to save 1/3 through savings (529 contributions), expect 1/3 from future income (scholarships, part-time work, parent income at time of college), and finance 1/3 through student loans. This calculator can help you determine the savings piece based on your specific situation." },
          { question: "What if my child doesn't go to college?", answer: "529 funds can be transferred to another family member without penalty, used for vocational schools, used for K-12 tuition (up to $10,000/year), or withdrawn for non-education purposes (subject to taxes and a 10% penalty on earnings). The SECURE 2.0 Act also allows rolling unused 529 funds into a Roth IRA for the beneficiary (subject to limits and rules)." },
          { question: "Should I include financial aid in this estimate?", answer: "This calculator shows the gross cost before financial aid, scholarships, or grants. Financial aid depends heavily on your family's income, assets, and the specific school. Use this figure as a conservative upper bound - many students receive significant aid that can reduce the actual out-of-pocket cost substantially." },
        ]}
        relatedCalculators={[
          { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
          { name: "Savings Goal Calculator", href: "/calculators/finance/compound-interest-calculator" },
          { name: "Loan Calculator", href: "/calculators/finance/loan-calculator" },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Planning Ahead for College Costs</h2>
          <p className="text-sm text-gray-700">Starting early is the single biggest advantage in college savings. The power of compounding means money saved when a child is young grows substantially by college age.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
