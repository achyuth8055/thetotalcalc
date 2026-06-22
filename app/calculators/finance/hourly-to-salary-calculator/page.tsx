"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function HourlyToSalaryCalculator() {
  const [mode, setMode] = useState<"hourlyToAnnual" | "annualToHourly">("hourlyToAnnual");

  // Hourly → Annual inputs
  const [hourlyRate, setHourlyRate] = useState(25);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [overtimeHrs, setOvertimeHrs] = useState(0);

  // Annual → Hourly inputs
  const [annualSalary, setAnnualSalary] = useState(52000);
  const [annualHoursPerWeek, setAnnualHoursPerWeek] = useState(40);
  const [annualWeeksPerYear, setAnnualWeeksPerYear] = useState(52);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const fmtDec = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v);

  const calc = useMemo(() => {
    if (mode === "hourlyToAnnual") {
      const overtimePay = overtimeHrs * hourlyRate * 1.5;
      const weekly = hourlyRate * hoursPerWeek + overtimePay;
      const annual = weekly * weeksPerYear;
      const monthly = annual / 12;
      const biWeekly = annual / 26;
      const semiMonthly = annual / 24;
      const daily = annual / (weeksPerYear * 5);
      const afterTax = annual * 0.72;
      const effectiveHourly = hourlyRate;

      return { weekly, annual, monthly, biWeekly, semiMonthly, daily, afterTax, effectiveHourly, overtimePay };
    } else {
      const totalHoursPerYear = annualHoursPerWeek * annualWeeksPerYear;
      const derivedHourly = totalHoursPerYear > 0 ? annualSalary / totalHoursPerYear : 0;
      const weekly = annualSalary / annualWeeksPerYear;
      const monthly = annualSalary / 12;
      const biWeekly = annualSalary / 26;
      const semiMonthly = annualSalary / 24;
      const daily = annualSalary / (annualWeeksPerYear * 5);
      const afterTax = annualSalary * 0.72;
      const annual = annualSalary;

      return { weekly, annual, monthly, biWeekly, semiMonthly, daily, afterTax, effectiveHourly: derivedHourly, overtimePay: 0 };
    }
  }, [mode, hourlyRate, hoursPerWeek, weeksPerYear, overtimeHrs, annualSalary, annualHoursPerWeek, annualWeeksPerYear]);

  const chartData = useMemo(() => {
    const grossMonthly = calc.annual / 12;
    const netMonthly = calc.afterTax / 12;
    return MONTHS.map((month) => ({
      month,
      Gross: Math.round(grossMonthly),
      "After-Tax": Math.round(netMonthly),
    }));
  }, [calc.annual, calc.afterTax]);

  const handlePrint = () => window.print();

  const SliderInput = ({
    label,
    value,
    setValue,
    min,
    max,
    step = 1,
    prefix = "",
    suffix = "",
  }: {
    label: string;
    value: number;
    setValue: (v: number) => void;
    min: number;
    max: number;
    step?: number;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!isNaN(v)) setValue(Math.min(max, Math.max(min, v)));
            }}
            className="w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
    </div>
  );

  const explanation = (
    <>
      <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-5">W-2 Employees vs. 1099 Contractors: The True Tax Difference</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Whether you receive a W-2 or a 1099-NEC determines who pays the employer half of FICA taxes. W-2 employees split FICA with their employer — each pays 7.65% (6.2% Social Security + 1.45% Medicare) on wages up to the annual cap. Self-employed 1099 workers pay the full 15.3% self-employment tax themselves, though they can deduct half of it from gross income. This single difference means a $50/hr freelance rate is not equivalent to $50/hr as an employee. A freelancer earning $104,000 pays roughly $14,700 in self-employment tax before federal income tax even begins. If you are comparing a salaried offer to freelance income, always calculate the after-SE-tax equivalent to make a fair comparison.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">The True Hourly Rate: Accounting for Unpaid Time</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Your nominal hourly rate does not reflect what you actually earn per hour of life spent on work. Add commute time, preparation, professional development, and after-hours email to your paid hours. A worker with a 40-hour paid week who spends 10 hours commuting and preparing actually works 50 hours to earn 40 hours of pay — an effective rate reduction of 20%. A $25/hr job with a 90-minute round-trip commute is functionally a $20/hr job if you value your commute time. Remote work can add thousands to your effective annual compensation simply by eliminating that unpaid time. When comparing offers across different locations or work arrangements, always calculate cost-adjusted, time-adjusted hourly equivalents.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">Negotiating Salary: Data-Driven Tactics</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Walking into a salary negotiation without market data is negotiating blind. Tools like Glassdoor, Levels.fyi (especially for tech roles), LinkedIn Salary, and the Bureau of Labor Statistics Occupational Outlook Handbook give you percentile benchmarks by role, location, experience, and company size. Always negotiate from a range anchored at your target — anchoring high shifts the entire conversation upward. State your research explicitly: "Based on Levels.fyi data for this role in this market, the 75th percentile is X." Recruiters negotiate salaries daily; you negotiate yours once every few years. Preparation is your only equalizer. Even a $3,000 raise in year one compounded over a career represents tens of thousands of dollars in cumulative earnings and future salary negotiations that build on that baseline.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">The Hidden Value of Benefits: Beyond the Base Salary</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Total compensation extends well beyond base pay. Employer-sponsored health insurance carries an average employer contribution of over $7,000 per year for single coverage and $20,000+ for family plans (Kaiser Family Foundation, 2023). A 401(k) match of 4% on a $60,000 salary adds $2,400 in free compensation annually. Paid time off — typically 10–15 days plus federal holidays — represents 4–6% of annual wages paid without work. Add dental, vision, life insurance, disability coverage, HSA contributions, commuter benefits, tuition reimbursement, and stock options, and the true value of an employment package often exceeds the base salary by 30–40%. When evaluating a salary offer versus freelance income, always tally the full benefits replacement cost before concluding the freelance rate is higher.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">Salary Compression: When Tenure Pays Less Than Market</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Salary compression occurs when long-tenured employees earn similar wages to newly hired employees at the same level — or when the pay gap between managers and their direct reports narrows to the point of absurdity. This happens because organizations often give annual raises of 2–3%, while new hires must be attracted at current market rates that may have risen 10–20% over several years. If you have been at the same company for three or more years without a significant market adjustment, there is a high probability you are underpaid relative to your market value. The fastest way to correct compression is often to change employers — external moves statistically yield higher salary increases than internal promotions.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">The Freelance Rate Multiplier: How Much to Charge</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Freelancers who price their services at their equivalent employee hourly rate will consistently underearn. The standard industry rule of thumb is to multiply your target employee-equivalent hourly rate by 1.3 to 1.5 to account for: self-employment taxes (add ~7.65% employer share), health insurance premiums, retirement savings without match, unpaid vacation and sick time, client acquisition overhead, periods of non-billable work, and business expenses. A $40/hr employee equivalent should price freelance work at $52–$60/hr minimum to maintain the same financial position. Specialized skills, tight deadlines, or niche expertise justify rates well above 1.5×.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">The Gender Pay Gap: What the Data Shows</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Bureau of Labor Statistics (BLS) data consistently shows that women earn approximately 84 cents for every dollar earned by men when comparing median weekly earnings across all full-time workers. The gap varies substantially by occupation, industry, age, and education level. Some of the gap is explained by occupational segregation, hours worked, and career interruptions — but research controlling for these factors still finds an unexplained gap of 5–8%. Knowing the market rate for your role using tools like Glassdoor and the BLS Occupational Employment Statistics is particularly important for women and underrepresented groups, who are statistically more likely to be underpaid relative to peers with equivalent qualifications.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">Living Wage Context: What Does Your Salary Actually Buy?</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        MIT's Living Wage Calculator estimates the income required to cover basic needs — food, housing, transportation, childcare, healthcare — without relying on subsidies. In 2024, the living wage for a single adult ranges from roughly $20/hr in lower-cost states to over $30/hr in cities like San Francisco or New York. For a family of four with two working adults and two children, the required wage per adult often exceeds $25–$35/hr. The federal minimum wage of $7.25/hr has not been increased since 2009. Many states and municipalities have adopted higher minimums, but even $15/hr falls short of a living wage in many metro areas. This calculator can help you benchmark your current hourly or salary earnings against these living wage thresholds for your specific location and family situation.
      </p>
    </>
  );

  const faqs = [
    {
      question: "Is it better to be paid hourly or salary?",
      answer:
        "Neither is universally better — it depends on your priorities and situation. Hourly workers earn overtime pay (1.5× for hours over 40/week under FLSA), which can substantially boost earnings during busy periods. Salaried workers often receive more comprehensive benefits, greater job stability, and more schedule flexibility, but may work more than 40 hours without additional pay if classified as exempt. Hourly pay gives you clarity: you know exactly what you earn per hour worked. Salary provides predictable cash flow regardless of hours. If you consistently work overtime in a demanding role, hourly pay may net you more total income. If you value benefits, career development, and a stable paycheck, salary employment often delivers greater total compensation.",
    },
    {
      question: "How do overtime rules differ for salaried vs hourly employees?",
      answer:
        "Under the federal Fair Labor Standards Act (FLSA), hourly non-exempt employees must receive overtime pay at 1.5× their regular rate for all hours worked over 40 in a workweek. Salaried employees can be classified as 'exempt' from overtime if they meet both a salary threshold (currently $684/week as of 2020, though the DOL has proposed increases) and a duties test — meaning their primary duties must fall into executive, administrative, professional, outside sales, or computer-related categories. Salaried non-exempt employees are relatively rare but do exist: they earn a fixed salary but are still entitled to overtime. Always verify your classification — misclassification as exempt when you should be non-exempt is one of the most common wage violations.",
    },
    {
      question: "What is the true cost of an employee beyond their salary?",
      answer:
        "Employers typically spend 1.25 to 1.4 times an employee's base salary in total employment costs. Beyond the salary itself: FICA taxes (7.65% employer share), federal and state unemployment taxes (FUTA/SUTA, typically 0.6–6%), workers' compensation insurance (0.5–5% depending on industry), health insurance (average $7,000+/year for single coverage), 401(k) or pension contributions, paid time off (effectively 4–8% of salary), training and onboarding costs, and equipment or workspace. A $60,000/year employee may cost an employer $78,000–$85,000 fully loaded. This is why freelancers and consultants can charge $80–$100/hr while earning the equivalent of a $60,000 salary — the markup covers the employer costs the client no longer has to bear.",
    },
    {
      question: "How should freelancers set their hourly rates?",
      answer:
        "Start with your target annual income, add back all the employer-side costs you now must cover yourself: self-employment taxes (7.65%), health insurance, retirement savings, paid time off, and business expenses. Then divide by your actual billable hours — not 2,080 (40hrs × 52 weeks), but realistically 1,200–1,600 hours for most freelancers once you subtract non-billable time for client acquisition, administration, professional development, and marketing. For example, targeting $70,000 net with 1,400 billable hours and $20,000 in overhead and taxes suggests a rate of around $64/hr. Research market rates on platforms like Upwork, Toptal, or industry-specific salary surveys. Specialized skills, fast turnaround, and proven track records all justify premium pricing above market baseline.",
    },
    {
      question: "How does the salary threshold for overtime exemption work?",
      answer:
        "The FLSA's 'white-collar exemptions' require employees to meet both a salary basis test and a duties test to be exempt from overtime. The salary basis test requires the employee to receive a predetermined, fixed salary of at least $684 per week ($35,568/year) — this threshold has not changed since 2020. Employees earning below this amount cannot be classified as exempt, regardless of job duties, and must receive overtime. The DOL has periodically proposed raising this threshold (to as high as $55,000+), but legal challenges have slowed implementation. Even employees above the threshold must meet the duties test: their primary job must involve executive, administrative, or professional duties as defined by DOL regulations. Paying someone a salary does not automatically exempt them from overtime — both tests must be satisfied.",
    },
  ];

  const relatedCalculators = [
    { name: "Markup Calculator", href: "/calculators/finance/markup-calculator" },
    { name: "Cap Rate Calculator", href: "/calculators/finance/cap-rate-calculator" },
    { name: "ROI Calculator", href: "/calculators/finance/roi-calculator" },
    { name: "Break-Even Calculator", href: "/calculators/finance/break-even-calculator" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Hourly to Salary", href: "/calculators/finance/hourly-to-salary-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Hourly to Salary Calculator"
        description="Convert between hourly wages and annual salary. See your full pay breakdown — monthly, bi-weekly, semi-monthly, weekly, and daily — plus an after-tax estimate."
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex items-center justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1">
              <button
                onClick={() => setMode("hourlyToAnnual")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  mode === "hourlyToAnnual"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Hourly → Annual
              </button>
              <button
                onClick={() => setMode("annualToHourly")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  mode === "annualToHourly"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Annual → Hourly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs Panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-5">
                {mode === "hourlyToAnnual" ? "Hourly Pay Details" : "Annual Salary Details"}
              </h2>

              {mode === "hourlyToAnnual" ? (
                <>
                  <SliderInput
                    label="Hourly Rate"
                    value={hourlyRate}
                    setValue={setHourlyRate}
                    min={8}
                    max={200}
                    step={1}
                    prefix="$"
                  />
                  <SliderInput
                    label="Hours per Week"
                    value={hoursPerWeek}
                    setValue={setHoursPerWeek}
                    min={20}
                    max={60}
                    step={1}
                    suffix=" hrs"
                  />
                  <SliderInput
                    label="Weeks per Year"
                    value={weeksPerYear}
                    setValue={setWeeksPerYear}
                    min={40}
                    max={52}
                    step={1}
                    suffix=" wks"
                  />
                  <SliderInput
                    label="Overtime Hours/Week"
                    value={overtimeHrs}
                    setValue={setOvertimeHrs}
                    min={0}
                    max={20}
                    step={1}
                    suffix=" hrs"
                  />
                  {overtimeHrs > 0 && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      Weekly overtime bonus: <span className="font-semibold">{fmtDec(overtimeHrs * hourlyRate * 1.5)}</span> ({overtimeHrs} hrs × {fmt(hourlyRate)} × 1.5)
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">Annual Salary</label>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">$</span>
                        <input
                          type="number"
                          value={annualSalary}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (!isNaN(v) && v >= 0) setAnnualSalary(v);
                          }}
                          className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={20000}
                      max={500000}
                      step={1000}
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>$20,000</span>
                      <span>$500,000</span>
                    </div>
                  </div>
                  <SliderInput
                    label="Hours per Week"
                    value={annualHoursPerWeek}
                    setValue={setAnnualHoursPerWeek}
                    min={20}
                    max={60}
                    step={1}
                    suffix=" hrs"
                  />
                  <SliderInput
                    label="Weeks per Year"
                    value={annualWeeksPerYear}
                    setValue={setAnnualWeeksPerYear}
                    min={40}
                    max={52}
                    step={1}
                    suffix=" wks"
                  />
                </>
              )}
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {/* After-Tax Highlight Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-md">
                <p className="text-blue-100 text-sm font-medium mb-1">Estimated After-Tax Annual Income</p>
                <p className="text-3xl font-bold">{fmt(calc.afterTax)}</p>
                <p className="text-blue-200 text-xs mt-1">Assumes ~28% effective tax rate (federal + state average)</p>
                <div className="mt-3 pt-3 border-t border-blue-500 flex justify-between text-sm">
                  <span className="text-blue-100">Gross Annual</span>
                  <span className="font-semibold">{fmt(calc.annual)}</span>
                </div>
                {mode === "annualToHourly" && (
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-blue-100">Effective Hourly Rate</span>
                    <span className="font-semibold">{fmtDec(calc.effectiveHourly)}/hr</span>
                  </div>
                )}
              </div>

              {/* Breakdown Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Pay Breakdown</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "Annual", value: calc.annual, highlight: true },
                      { label: "Monthly", value: calc.monthly },
                      { label: "Bi-Weekly", value: calc.biWeekly },
                      { label: "Semi-Monthly", value: calc.semiMonthly },
                      { label: "Weekly", value: calc.weekly },
                      { label: "Daily", value: calc.daily },
                      { label: "Hourly", value: calc.effectiveHourly, isHourly: true },
                    ].map((row) => (
                      <tr
                        key={row.label}
                        className={`border-b border-gray-100 last:border-0 ${row.highlight ? "bg-blue-50" : "hover:bg-gray-50"}`}
                      >
                        <td className={`px-5 py-3 font-medium ${row.highlight ? "text-blue-700" : "text-gray-600"}`}>
                          {row.label}
                        </td>
                        <td className={`px-5 py-3 text-right font-bold ${row.highlight ? "text-blue-700" : "text-gray-800"}`}>
                          {row.isHourly ? fmtDec(row.value) + "/hr" : fmt(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save as PDF
              </button>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-1">Monthly Gross vs. After-Tax Pay</h3>
            <p className="text-xs text-gray-500 mb-4">12-month comparison assuming equal pay each month</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 0,
                    }).format(v)
                  }
                  tick={{ fontSize: 11 }}
                  width={55}
                />
                <Tooltip
                  formatter={(value: number) => fmt(value)}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Gross" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="After-Tax" fill="#22c55e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Assumptions Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">Calculation Assumptions</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Overtime calculated at 1.5× regular rate per FLSA standards</li>
              <li>After-tax estimate uses a flat 28% effective rate (federal + average state) — actual taxes vary by filing status, deductions, and state</li>
              <li>Daily rate based on 5 working days per week</li>
              <li>Bi-weekly = 26 pay periods/year; semi-monthly = 24 pay periods/year</li>
            </ul>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
