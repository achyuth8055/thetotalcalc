"use client";
import { useState } from "react";
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

// Employment income deduction (給与所得控除) for withholding tax approximation
function employmentDeduction(gross: number): number {
  if (gross <= 1625000) return 550000;
  if (gross <= 1800000) return gross * 0.4 - 100000;
  if (gross <= 3600000) return gross * 0.3 + 80000;
  if (gross <= 6600000) return gross * 0.2 + 440000;
  if (gross <= 8500000) return gross * 0.1 + 1100000;
  return 1950000;
}

function calcIncomeTax(taxable: number): number {
  if (taxable <= 0) return 0;
  const brackets = [
    { limit: 1950000, rate: 0.05, ded: 0 },
    { limit: 3300000, rate: 0.1, ded: 97500 },
    { limit: 6950000, rate: 0.2, ded: 427500 },
    { limit: 9000000, rate: 0.23, ded: 636000 },
    { limit: 18000000, rate: 0.33, ded: 1536000 },
    { limit: 40000000, rate: 0.4, ded: 2796000 },
    { limit: Infinity, rate: 0.45, ded: 4796000 },
  ];
  for (const b of brackets) {
    if (taxable <= b.limit) {
      return Math.max(0, Math.floor(taxable * b.rate - b.ded));
    }
  }
  return 0;
}

export default function JapanSalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState(6000000);
  const [age40Plus, setAge40Plus] = useState(false);
  const [healthInsuranceRate, setHealthInsuranceRate] = useState<
    "large" | "sme"
  >("sme");

  const monthlySalary = annualSalary / 12;

  // Social insurance (monthly)
  // Health insurance: Tokyo Kyokai Kenpo rate = 10.0% total (employee 5.0%)
  const healthRate = 0.05; // employee share
  const pensionRate = 0.0915; // employee share of 18.3%
  const unemploymentRate = 0.003; // employee share (0.3% of 0.6%)
  const nursingRate = age40Plus ? 0.0091 : 0; // 介護保険料 40+

  const monthlyHealth = Math.floor(monthlySalary * healthRate);
  const monthlyPension = Math.floor(monthlySalary * pensionRate);
  const monthlyUnemployment = Math.floor(monthlySalary * unemploymentRate);
  const monthlyNursing = Math.floor(monthlySalary * nursingRate);
  const monthlySocialInsurance =
    monthlyHealth + monthlyPension + monthlyUnemployment + monthlyNursing;

  // Annual social insurance
  const annualSocialInsurance = monthlySocialInsurance * 12;

  // Income tax estimate
  const empDed = employmentDeduction(annualSalary);
  const employmentIncome = Math.max(0, annualSalary - empDed);
  const basicDed = 480000;
  const taxable = Math.max(0, employmentIncome - basicDed - annualSocialInsurance);
  const annualIncomeTax = calcIncomeTax(taxable);
  const annualSurtax = Math.floor(annualIncomeTax * 0.021);
  const annualResidenceTax = Math.floor(taxable * 0.1);
  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12);
  const monthlyResidenceTax = Math.floor(annualResidenceTax / 12);

  // Take-home
  const monthlyTakeHome =
    monthlySalary -
    monthlySocialInsurance -
    monthlyIncomeTax -
    monthlyResidenceTax;
  const annualTakeHome = monthlyTakeHome * 12;

  const fmt = (v: number) =>
    "¥" + new Intl.NumberFormat("ja-JP").format(Math.round(v));

  const monthlyChartData = [
    {
      name: "Monthly",
      "Take-Home": Math.round(monthlyTakeHome),
      "Health Ins.": Math.round(monthlyHealth),
      Pension: Math.round(monthlyPension),
      "Unemp. Ins.": Math.round(monthlyUnemployment),
      ...(age40Plus ? { "Nursing Care": Math.round(monthlyNursing) } : {}),
      "Income Tax": Math.round(monthlyIncomeTax),
      "Residence Tax": Math.round(monthlyResidenceTax),
    },
  ];

  const totalDeducted =
    monthlySocialInsurance + monthlyIncomeTax + monthlyResidenceTax;
  const deductionPercent =
    monthlySalary > 0
      ? ((totalDeducted / monthlySalary) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Japan Calculators", href: "/calculators/japan" },
          {
            label: "Salary Calculator",
            href: "/calculators/japan/salary-calculator",
          },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Japan Take-Home Pay Calculator (手取り計算)
          </h1>
          <p className="text-base text-gray-600">
            Calculate your Japanese 手取り (take-home pay) after health
            insurance, pension, unemployment insurance, and income tax
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          &#8595; PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

          {/* Annual salary */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Annual Salary 額面 (¥)
              </label>
              <input
                type="number"
                value={annualSalary}
                onChange={(e) =>
                  setAnnualSalary(Number(e.target.value) || 0)
                }
                className="w-36 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range"
              min={2000000}
              max={20000000}
              step={100000}
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>¥2M</span>
              <span>¥20M</span>
            </div>
          </div>

          {/* Health insurance type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Health Insurance Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "sme", label: "協会けんぽ (SME / General)" },
                { v: "large", label: "組合健保 (Large Company)" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() =>
                    setHealthInsuranceRate(opt.v as "large" | "sme")
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    healthInsuranceRate === opt.v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Using Tokyo 協会けんぽ rate (10.0% total, 5.0% employee share)
            </p>
          </div>

          {/* Age 40+ nursing care */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="nursing"
              checked={age40Plus}
              onChange={(e) => setAge40Plus(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="nursing" className="text-sm text-gray-700">
              Age 40+ (add nursing care insurance 介護保険料 +0.91%)
            </label>
          </div>

          {/* Summary of rates */}
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
            <div className="font-semibold text-gray-700 mb-2">
              Deduction Rates Applied (Employee Share)
            </div>
            <div className="flex justify-between">
              <span>Health Insurance (健康保険)</span>
              <span className="font-medium">5.00%</span>
            </div>
            <div className="flex justify-between">
              <span>Pension (厚生年金)</span>
              <span className="font-medium">9.15%</span>
            </div>
            <div className="flex justify-between">
              <span>Unemployment Ins. (雇用保険)</span>
              <span className="font-medium">0.30%</span>
            </div>
            {age40Plus && (
              <div className="flex justify-between">
                <span>Nursing Care (介護保険)</span>
                <span className="font-medium">0.91%</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-1 font-semibold">
              <span>Total Social Insurance</span>
              <span>
                {(
                  healthRate * 100 +
                  pensionRate * 100 +
                  unemploymentRate * 100 +
                  nursingRate * 100
                ).toFixed(2)}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Monthly Payslip (給与明細)
          </h2>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">
              Monthly Gross (額面)
            </div>
            <div className="text-xl font-bold text-gray-800">
              {fmt(monthlySalary)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Deductions
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-purple-50 rounded p-2">
                <div className="text-xs text-gray-500">Health Ins.</div>
                <div className="font-bold text-purple-700">
                  {fmt(monthlyHealth)}
                </div>
              </div>
              <div className="bg-indigo-50 rounded p-2">
                <div className="text-xs text-gray-500">Pension</div>
                <div className="font-bold text-indigo-700">
                  {fmt(monthlyPension)}
                </div>
              </div>
              <div className="bg-sky-50 rounded p-2">
                <div className="text-xs text-gray-500">Unemploy. Ins.</div>
                <div className="font-bold text-sky-700">
                  {fmt(monthlyUnemployment)}
                </div>
              </div>
              {age40Plus && (
                <div className="bg-teal-50 rounded p-2">
                  <div className="text-xs text-gray-500">Nursing Care</div>
                  <div className="font-bold text-teal-700">
                    {fmt(monthlyNursing)}
                  </div>
                </div>
              )}
              <div className="bg-orange-50 rounded p-2">
                <div className="text-xs text-gray-500">Income Tax</div>
                <div className="font-bold text-orange-700">
                  {fmt(monthlyIncomeTax)}
                </div>
              </div>
              <div className="bg-pink-50 rounded p-2">
                <div className="text-xs text-gray-500">Residence Tax</div>
                <div className="font-bold text-pink-700">
                  {fmt(monthlyResidenceTax)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">
              Monthly Take-Home (手取り)
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {fmt(monthlyTakeHome)}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">
              Annual Take-Home
            </div>
            <div className="text-xl font-bold text-green-700">
              {fmt(annualTakeHome)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <div>
              Total deducted:{" "}
              <strong>{deductionPercent}%</strong> of gross
            </div>
            <div>
              Take-home ratio:{" "}
              <strong>
                {(100 - parseFloat(deductionPercent)).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Monthly Salary Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyChartData} layout="vertical">
            <XAxis
              type="number"
              tickFormatter={(v) =>
                "¥" + (v / 10000).toFixed(0) + "万"
              }
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={70}
            />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <Bar dataKey="Take-Home" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Health Ins." stackId="a" fill="#8b5cf6" />
            <Bar dataKey="Pension" stackId="a" fill="#6366f1" />
            <Bar dataKey="Unemp. Ins." stackId="a" fill="#0ea5e9" />
            {age40Plus && (
              <Bar dataKey="Nursing Care" stackId="a" fill="#14b8a6" />
            )}
            <Bar dataKey="Income Tax" stackId="a" fill="#f97316" />
            <Bar
              dataKey="Residence Tax"
              stackId="a"
              fill="#ec4899"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Understanding your Japanese payslip (給与明細, kyuyo meisai) is
              essential for anyone working in Japan. The gap between your
              advertised salary (額面, gakumen) and what actually lands in your
              bank account (手取り, tedori) can be surprisingly large — often
              25–30% for middle-income earners. Knowing what each deduction is
              and why it exists helps you plan your finances and understand the
              social contract behind Japan&apos;s comprehensive welfare system.
            </p>
            <p>
              Japan&apos;s social insurance system is designed as a package
              deal for regular employees (正社員, seishain). Health insurance
              (健康保険) covers 70–80% of medical costs at point of care, with
              the government rate varying by prefecture and employer type.
              Large-company employees join company-specific health societies
              (組合健保), while employees at smaller companies join the
              Association-Managed Health Insurance (協会けんぽ). The Tokyo
              協会けんぽ rate for 2024 is 10.0% of standard monthly
              compensation — split equally between employee and employer.
            </p>
            <p>
              Employees&apos; pension (厚生年金, kosei nenkin) is the most
              significant social insurance deduction at 18.3% of standard
              monthly compensation (標準報酬月額), with the employee and
              employer each paying 9.15%. Crucially, the pension system uses a
              standardized salary table with fixed brackets rather than the
              exact monthly salary. If your monthly salary is ¥310,000,
              contributions are calculated on the ¥320,000 bracket amount — a
              system that simplifies administration but means contributions can
              differ slightly from the exact percentage. Kosei nenkin is
              significantly more generous than the basic national pension
              (国民年金) used by self-employed workers, making regular
              employment with social insurance enrollment highly valuable for
              retirement planning.
            </p>
            <p>
              Bonuses (賞与/ボーナス) are a major feature of Japanese
              compensation, typically paid twice a year in June and December.
              They are taxed differently from regular monthly salary — social
              insurance is calculated on the actual bonus amount (with a cap),
              and income tax uses a simplified withholding rate based on the
              previous month&apos;s withholding. Large companies often pay
              bonuses equivalent to 3–6 months&apos; salary, making the
              official monthly salary a potentially misleading indicator of
              total annual compensation. The spring labor offensive (春闘,
              shunto) negotiations between major unions and employers set wage
              and bonus increase benchmarks each year for the broader economy.
            </p>
            <p>
              The <strong>Year 2 shock (2年目の税金ショック)</strong> is a
              common experience for new graduates. In the first year of work,
              no residence tax is owed because it&apos;s based on the previous
              year&apos;s income (which was zero as a student). Starting in
              June of the second year, residence tax kicks in at approximately
              10% of the previous year&apos;s taxable income — and for someone
              earning ¥4–6 million their first year, this can mean an
              additional ¥30,000–60,000 per month suddenly being deducted from
              their paycheck, often without prior warning. For those who quit
              their job, residence tax bills continue to arrive the following
              year, often as quarterly lump-sum payments rather than monthly
              payroll deductions.
            </p>
            <p>
              Part-time workers (アルバイト, arubaito) and those working fewer
              than a certain number of hours are typically not enrolled in
              company social insurance, which means they must pay into the
              national health insurance (国民健康保険) and national pension
              (国民年金) separately — at higher rates relative to income, with
              no employer contribution. The distinction between covered and
              uncovered employment status has significant long-term
              consequences for retirement income and healthcare costs, making
              the seemingly simple question of employment type one of the most
              financially important decisions a worker in Japan can make.
            </p>
            <p>
              Japan&apos;s work culture includes extensive laws around overtime
              (残業代, zangyodai). Regular overtime must be paid at 125% of
              the hourly rate; work over 60 hours per month at 150%; holiday
              work at 135%. Despite this, the phenomenon of karoshi (過労死 —
              death from overwork) and extensive unpaid overtime remain
              persistent issues, with the government&apos;s Work Style Reform
              (働き方改革) legislation of 2018 attempting to cap maximum
              overtime hours and increase enforcement.
            </p>
          </div>
        }
        faqs={[
          {
            question:
              "What percentage of my salary goes to social insurance in Japan?",
            answer:
              "Approximately 14.45% for employees under 40 (health insurance 5% + pension 9.15% + unemployment 0.3%), rising to about 15.36% for those 40+ who also pay nursing care insurance of 0.91%. Your employer pays an equal or greater share on top of this.",
          },
          {
            question: "What is the standard monthly compensation (標準報酬月額)?",
            answer:
              "A standardized salary figure used to calculate pension and health insurance contributions. Rather than using your exact salary, contributions are based on a bracket system. If your monthly salary is ¥310,000, contributions are calculated on the ¥320,000 bracket. This makes calculations consistent and predictable.",
          },
          {
            question: "How is bonus tax (賞与税) calculated in Japan?",
            answer:
              "Social insurance on bonuses is calculated using the actual bonus amount (with an annual cap for pension). Income tax uses a simplified rate based on the previous month's withholding tax divided by the previous month's salary minus social insurance. Bonuses are taxed favorably in some ways as they don't use the progressive bracket calculation for withholding.",
          },
          {
            question: "What happens to my social insurance if I quit my job?",
            answer:
              "You must either switch to national health insurance (国民健康保険) through your local municipality within 14 days, or continue your company's health insurance voluntarily (任意継続) for up to 2 years — paying both the employee and employer shares yourself. Your pension switches from employees' pension (厚生年金) to national pension (国民年金) at ¥16,980/month flat in 2024.",
          },
          {
            question: "How much do Japanese workers typically take home?",
            answer:
              "At ¥6 million annual salary, take-home is roughly ¥4.0–4.3 million (67–72% of gross) depending on deductions and prefecture. At ¥4 million, take-home is approximately ¥2.8–3.0 million (70–75%). Higher earners see lower take-home ratios due to progressive income tax.",
          },
        ]}
        relatedCalculators={[
          {
            name: "Japan Income Tax Calculator",
            href: "/calculators/japan/income-tax-calculator",
          },
          {
            name: "Japan Furusato Nozei Calculator",
            href: "/calculators/japan/furusato-nozei-calculator",
          },
          {
            name: "Japan Consumption Tax Calculator",
            href: "/calculators/japan/consumption-tax-calculator",
          },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
