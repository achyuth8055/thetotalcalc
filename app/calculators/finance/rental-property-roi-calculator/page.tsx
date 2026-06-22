"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function RentalPropertyROICalculator() {
  // Purchase
  const [purchasePrice, setPurchasePrice] = useState(400000);
  const [downPct, setDownPct] = useState(20);
  const [closingCosts, setClosingCosts] = useState(8000);
  const [renovation, setRenovation] = useState(0);
  // Mortgage
  const [rate, setRate] = useState(7);
  const [term, setTerm] = useState(30);
  // Income
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [vacancyPct, setVacancyPct] = useState(5);
  // Expenses
  const [annualTax, setAnnualTax] = useState(5000);
  const [annualInsurance, setAnnualInsurance] = useState(1500);
  const [maintenancePct, setMaintenancePct] = useState(8);
  const [mgmtPct, setMgmtPct] = useState(10);
  const [hoa, setHoa] = useState(0);

  const result = useMemo(() => {
    const downPayment = purchasePrice * downPct / 100;
    const loanAmount = purchasePrice - downPayment;
    const totalInvestment = downPayment + closingCosts + renovation;

    // Monthly mortgage P&I
    const r = rate / 100 / 12;
    const n = term * 12;
    const mortgage = r === 0 ? loanAmount / n : loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Income
    const effectiveRent = monthlyRent * (1 - vacancyPct / 100);

    // Monthly expenses
    const taxMonthly = annualTax / 12;
    const insuranceMonthly = annualInsurance / 12;
    const maintenanceMonthly = effectiveRent * maintenancePct / 100;
    const mgmtMonthly = effectiveRent * mgmtPct / 100;
    const hoaMonthly = hoa;
    const totalExpensesNoMortgage = taxMonthly + insuranceMonthly + maintenanceMonthly + mgmtMonthly + hoaMonthly;
    const totalExpenses = mortgage + totalExpensesNoMortgage;

    const monthlyCashFlow = effectiveRent - totalExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCash = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0;

    // NOI (pre-mortgage)
    const noi = (effectiveRent - totalExpensesNoMortgage) * 12;
    const capRate = (noi / purchasePrice) * 100;
    const grm = purchasePrice / (monthlyRent * 12);
    const onePercentRule = (monthlyRent / purchasePrice) * 100;

    return {
      downPayment, loanAmount, totalInvestment, mortgage,
      effectiveRent, totalExpensesNoMortgage, totalExpenses,
      monthlyCashFlow, annualCashFlow, cashOnCash,
      noi, capRate, grm, onePercentRule,
      taxMonthly, insuranceMonthly, maintenanceMonthly, mgmtMonthly,
    };
  }, [purchasePrice, downPct, closingCosts, renovation, rate, term, monthlyRent, vacancyPct, annualTax, annualInsurance, maintenancePct, mgmtPct, hoa]);

  const fmt = (v: number) => "$" + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const fmtPct = (v: number) => v.toFixed(2) + "%";

  const chartData = [
    { name: "Gross Rent", value: monthlyRent, fill: "#34d399" },
    { name: "Vacancy", value: -(monthlyRent - result.effectiveRent), fill: "#f87171" },
    { name: "Expenses", value: -result.totalExpensesNoMortgage, fill: "#fb923c" },
    { name: "Mortgage", value: -result.mortgage, fill: "#f43f5e" },
    { name: "Cash Flow", value: result.monthlyCashFlow, fill: result.monthlyCashFlow >= 0 ? "#22c55e" : "#ef4444" },
  ];

  const SliderInput = ({ label, value, setValue, min, max, step = 1, prefix = "", suffix = "" }: any) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
          <input type="number" value={value} onChange={e => setValue(Number(e.target.value) || 0)}
            className="w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
          {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Finance Calculators", href: "/finance-calculators" },
        { label: "Rental Property ROI", href: "/calculators/finance/rental-property-roi-calculator" },
      ]} />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Property ROI Calculator</h1>
          <p className="text-base text-gray-600">Calculate monthly cash flow, cash-on-cash return, cap rate, and GRM for any rental property investment</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">↓ PDF</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Purchase & Financing</h2>
          <SliderInput label="Purchase Price" value={purchasePrice} setValue={setPurchasePrice} min={50000} max={2000000} step={5000} prefix="$" />
          <SliderInput label="Down Payment %" value={downPct} setValue={setDownPct} min={3.5} max={40} step={0.5} suffix="%" />
          <div className="text-xs text-gray-500 -mt-3">Loan: <strong>${result.loanAmount.toLocaleString()}</strong> | Down: <strong>${result.downPayment.toLocaleString()}</strong></div>
          <SliderInput label="Closing Costs" value={closingCosts} setValue={setClosingCosts} min={0} max={30000} step={500} prefix="$" />
          <SliderInput label="Renovation Budget" value={renovation} setValue={setRenovation} min={0} max={100000} step={1000} prefix="$" />
          <SliderInput label="Mortgage Rate" value={rate} setValue={setRate} min={3} max={12} step={0.1} suffix="%" />
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Loan Term</label>
            <div className="grid grid-cols-2 gap-2">
              {[15, 30].map(y => (
                <button key={y} onClick={() => setTerm(y)}
                  className={`py-2 rounded-lg text-sm font-medium border ${term === y ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}>
                  {y} years
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 pt-2 border-t">Income & Expenses</h2>
          <SliderInput label="Monthly Rent" value={monthlyRent} setValue={setMonthlyRent} min={300} max={10000} step={50} prefix="$" />
          <SliderInput label="Vacancy Rate" value={vacancyPct} setValue={setVacancyPct} min={0} max={25} step={0.5} suffix="%" />
          <SliderInput label="Annual Property Tax" value={annualTax} setValue={setAnnualTax} min={0} max={30000} step={100} prefix="$" />
          <SliderInput label="Annual Insurance" value={annualInsurance} setValue={setAnnualInsurance} min={0} max={10000} step={100} prefix="$" />
          <SliderInput label="Maintenance (% of rent)" value={maintenancePct} setValue={setMaintenancePct} min={0} max={20} step={0.5} suffix="%" />
          <SliderInput label="Property Management" value={mgmtPct} setValue={setMgmtPct} min={0} max={15} step={0.5} suffix="%" />
          <SliderInput label="HOA (monthly)" value={hoa} setValue={setHoa} min={0} max={1000} step={25} prefix="$" />
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          <div className="space-y-3">
            <div className={`rounded-lg p-4 ${result.monthlyCashFlow >= 0 ? "bg-green-50" : "bg-red-50"}`}>
              <div className="text-xs text-gray-500 mb-1">Monthly Cash Flow</div>
              <div className={`text-3xl font-bold ${result.monthlyCashFlow >= 0 ? "text-green-700" : "text-red-600"}`}>
                {result.monthlyCashFlow >= 0 ? "+" : "-"}{fmt(result.monthlyCashFlow)}/mo
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Annual Cash Flow</div>
                <div className="text-lg font-bold text-blue-700">{result.annualCashFlow >= 0 ? "+" : ""}{fmt(result.annualCashFlow)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Cash-on-Cash Return</div>
                <div className="text-lg font-bold text-purple-700">{fmtPct(result.cashOnCash)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Cap Rate</div>
                <div className="text-lg font-bold text-gray-800">{fmtPct(result.capRate)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Gross Rent Multiplier</div>
                <div className="text-lg font-bold text-gray-800">{result.grm.toFixed(1)}×</div>
              </div>
            </div>
            <div className={`rounded-lg p-3 flex items-center gap-2 ${result.onePercentRule >= 1 ? "bg-green-50" : "bg-amber-50"}`}>
              <span className="text-xl">{result.onePercentRule >= 1 ? "✅" : "⚠️"}</span>
              <div>
                <div className="text-xs text-gray-500">1% Rule</div>
                <div className="text-sm font-semibold">{fmtPct(result.onePercentRule)} of purchase price</div>
                <div className="text-xs text-gray-400">{result.onePercentRule >= 1 ? "Meets the 1% rule" : "Below the 1% rule threshold"}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Total Investment Required</div>
              <div className="text-lg font-bold text-gray-800">{fmt(result.totalInvestment)}</div>
              <div className="text-xs text-gray-400">Down payment + closing costs + renovation</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1 text-gray-600">
              <div className="flex justify-between"><span>Monthly Mortgage (P&I)</span><span className="font-medium">{fmt(result.mortgage)}</span></div>
              <div className="flex justify-between"><span>Property Tax</span><span className="font-medium">{fmt(result.taxMonthly)}/mo</span></div>
              <div className="flex justify-between"><span>Insurance</span><span className="font-medium">{fmt(result.insuranceMonthly)}/mo</span></div>
              <div className="flex justify-between"><span>Maintenance</span><span className="font-medium">{fmt(result.maintenanceMonthly)}/mo</span></div>
              <div className="flex justify-between"><span>Property Management</span><span className="font-medium">{fmt(result.mgmtMonthly)}/mo</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Monthly Cash Flow Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => "$" + Math.abs(v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => (v >= 0 ? "+" : "") + "$" + Math.abs(v).toFixed(0)} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout title="" description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>Rental property investing offers four simultaneous returns: monthly cash flow, mortgage principal paydown (equity buildup), property appreciation, and tax benefits through depreciation. Understanding each component — and how to calculate them — is essential before purchasing any income-producing property.</p>
            <p>The <strong>1% Rule</strong> is the quick mental math of rental investing: monthly rent should equal at least 1% of the purchase price. A $400,000 property needs $4,000/month in rent to pass. Properties meeting this threshold typically generate positive cash flow after all expenses. In expensive coastal markets (San Francisco, Manhattan, Seattle), almost no properties meet the 1% rule — investors there bet on appreciation rather than cash flow. In the Midwest and South, many properties exceed 1%, providing income-generating cash cows.</p>
            <p>The <strong>50% Rule</strong> offers another quick estimate: operating expenses (excluding mortgage) typically consume about 50% of gross rent. If a property rents for $2,000/month, expect roughly $1,000/month in taxes, insurance, maintenance, management, vacancy, and capital expenditures. While crude, this rule prevents underestimating expenses — the most common mistake new landlords make.</p>
            <p>Cash-on-cash return measures the annual cash flow as a percentage of total cash invested (down payment + closing costs + renovation). Unlike cap rate, it accounts for the cost of debt. A property with a 6% cap rate may show 12%+ cash-on-cash with favorable financing, or negative cash-on-cash with high interest rates — which is exactly the dynamic that made 2022-2024 particularly challenging for real estate investors as rates rose from 3% to 7%+.</p>
            <p>The <strong>BRRRR strategy</strong> (Buy, Rehab, Rent, Refinance, Repeat) allows investors to recycle capital. By purchasing distressed properties below market, renovating to force appreciation, refinancing based on the new appraised value, and pulling out most of the initial investment, investors can theoretically scale a portfolio with limited capital. The 2024 high-rate environment has made the "Refinance" step challenging, as refinancing at 7%+ often destroys the cash flow the renovation created.</p>
            <p>Tax benefits significantly enhance real rental returns. Residential rental property is depreciated over 27.5 years — a $400,000 building (excluding land) generates $14,545/year in non-cash depreciation deductions, reducing taxable income without reducing cash flow. This "phantom loss" can offset rental income entirely and, for active real estate professionals, even offset ordinary income. Upon sale, depreciation recapture is taxed at 25%, but a 1031 exchange allows indefinite deferral by rolling proceeds into a like-kind property within 180 days.</p>
            <p>Landlord responsibilities extend beyond the financial model. Federal Fair Housing Law prohibits discrimination based on race, color, national origin, religion, sex, familial status, or disability. Landlords must maintain habitable conditions (heating, plumbing, structural integrity) and follow specific eviction procedures — self-help evictions (changing locks, removing belongings) are illegal in all 50 states and expose landlords to significant damages. Professional property management at 8-12% of rent handles these responsibilities but requires factoring the cost into your underwriting from day one.</p>
          </div>
        }
        faqs={[
          { question: "What is the 1% rule in rental investing?", answer: "The 1% rule states that monthly rent should be at least 1% of the purchase price. A $300,000 property needs $3,000/month rent to pass. It's a quick filter, not a guarantee of profitability." },
          { question: "What is cash-on-cash return?", answer: "Cash-on-cash return = annual cash flow ÷ total cash invested (down payment + closing costs + renovation). A property generating $6,000/year on a $60,000 investment has a 10% cash-on-cash return." },
          { question: "Is negative cash flow ever acceptable in rental property?", answer: "Sometimes, if strong appreciation is expected. California and NYC investors often accept negative cash flow betting on long-term appreciation. But it requires significant cash reserves to weather vacancies and repairs." },
          { question: "How much should I budget for maintenance?", answer: "Common rules: 1% of property value annually ($4,000 on a $400,000 home), or 8-12% of monthly rent. Budget separately for capital expenditures (roof, HVAC, appliances) on top of routine maintenance." },
          { question: "Should I use a property manager?", answer: "Property managers typically charge 8-12% of monthly rent. Worth it if you value your time, live far from the property, or own multiple units. Factor the cost into your analysis before purchasing." },
        ]}
        relatedCalculators={[
          { name: "Cap Rate Calculator", href: "/calculators/finance/cap-rate-calculator" },
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
          { name: "Home Sale Proceeds Calculator", href: "/calculators/finance/home-sale-proceeds-calculator" },
        ]}
      ><div /></CalculatorLayout>
    </div>
  );
}
