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

// Employment income deduction (給与所得控除)
function employmentIncomeDeduction(gross: number): number {
  if (gross <= 1625000) return 550000;
  if (gross <= 1800000) return gross * 0.4 - 100000;
  if (gross <= 3600000) return gross * 0.3 + 80000;
  if (gross <= 6600000) return gross * 0.2 + 440000;
  if (gross <= 8500000) return gross * 0.1 + 1100000;
  return 1950000;
}

// Japan income tax from taxable income
function calcIncomeTax(taxable: number): number {
  if (taxable <= 0) return 0;
  const brackets = [
    { limit: 1950000, rate: 0.05, deduction: 0 },
    { limit: 3300000, rate: 0.1, deduction: 97500 },
    { limit: 6950000, rate: 0.2, deduction: 427500 },
    { limit: 9000000, rate: 0.23, deduction: 636000 },
    { limit: 18000000, rate: 0.33, deduction: 1536000 },
    { limit: 40000000, rate: 0.4, deduction: 2796000 },
    { limit: Infinity, rate: 0.45, deduction: 4796000 },
  ];
  for (const b of brackets) {
    if (taxable <= b.limit) {
      return Math.floor(taxable * b.rate - b.deduction);
    }
  }
  return 0;
}

export default function JapanIncomeTaxCalculator() {
  const [gross, setGross] = useState(5000000);
  const [employmentType, setEmploymentType] = useState<
    "employee" | "self-employed"
  >("employee");
  const [dependents, setDependents] = useState(0);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [socialInsurance, setSocialInsurance] = useState(
    Math.round(5000000 * 0.145)
  );

  // 1. Employment income
  const empDeduction =
    employmentType === "employee" ? employmentIncomeDeduction(gross) : 0;
  const employmentIncome = Math.max(0, gross - empDeduction);

  // 2. Deductions
  const basicDeduction = gross <= 24000000 ? 480000 : 0;
  const dependentDeduction = dependents * 380000;
  const spouseDeduction = hasSpouse ? 380000 : 0;
  const totalDeductions =
    basicDeduction + socialInsurance + dependentDeduction + spouseDeduction;

  // 3. Taxable income
  const taxableIncome = Math.max(0, employmentIncome - totalDeductions);

  // 4. Income tax
  const incomeTax = calcIncomeTax(taxableIncome);

  // 5. Surtax (復興特別所得税)
  const surtax = Math.floor(incomeTax * 0.021);

  // 6. Residence tax (approx 10%)
  const residenceTax = Math.floor(taxableIncome * 0.1);

  // 7. Totals
  const totalTax = incomeTax + surtax + residenceTax;
  const netIncome = gross - totalTax - socialInsurance;
  const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  const fmt = (v: number) =>
    "¥" + new Intl.NumberFormat("ja-JP").format(Math.round(v));

  const chartData = [
    {
      name: "Income Breakdown",
      "Take-Home": Math.round(netIncome),
      "Social Insurance": Math.round(socialInsurance),
      "Income Tax": Math.round(incomeTax),
      Surtax: Math.round(surtax),
      "Residence Tax": Math.round(residenceTax),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Japan Calculators", href: "/calculators/japan" },
          {
            label: "Income Tax Calculator",
            href: "/calculators/japan/income-tax-calculator",
          },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Japan Income Tax Calculator (所得税)
          </h1>
          <p className="text-base text-gray-600">
            Estimate Japan income tax, residence tax, and reconstruction surtax
            based on your annual salary
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

          {/* Gross salary */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Annual Gross Salary (¥)
              </label>
              <input
                type="number"
                value={gross}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setGross(val);
                  setSocialInsurance(Math.round(val * 0.145));
                }}
                className="w-36 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range"
              min={1000000}
              max={30000000}
              step={100000}
              value={gross}
              onChange={(e) => {
                const val = Number(e.target.value);
                setGross(val);
                setSocialInsurance(Math.round(val * 0.145));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>¥1M</span>
              <span>¥30M</span>
            </div>
          </div>

          {/* Employment type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Employment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "employee", label: "Employee (給与所得者)" },
                { v: "self-employed", label: "Self-Employed (個人事業主)" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() =>
                    setEmploymentType(
                      opt.v as "employee" | "self-employed"
                    )
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    employmentType === opt.v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spouse */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="spouse"
              checked={hasSpouse}
              onChange={(e) => setHasSpouse(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="spouse" className="text-sm text-gray-700">
              Dependent spouse (income &lt; ¥1.03M) — ¥380,000 deduction
            </label>
          </div>

          {/* Dependents */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Number of Dependents (扶養親族): {dependents}
            </label>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={dependents}
              onChange={(e) => setDependents(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>4</span>
            </div>
          </div>

          {/* Social insurance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Annual Social Insurance Paid (¥)
              </label>
              <input
                type="number"
                value={socialInsurance}
                onChange={(e) =>
                  setSocialInsurance(Number(e.target.value) || 0)
                }
                className="w-36 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range"
              min={0}
              max={2000000}
              step={10000}
              value={socialInsurance}
              onChange={(e) => setSocialInsurance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-gray-400 mt-1">
              Auto-estimated at 14.5% of salary. Adjust if known.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Results</h2>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Gross Annual Salary</div>
            <div className="text-xl font-bold text-gray-800">{fmt(gross)}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">
              Employment Income Deduction (給与所得控除)
            </div>
            <div className="text-lg font-bold text-purple-700">
              {fmt(empDeduction)}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Taxable Income</div>
            <div className="text-lg font-bold text-yellow-700">
              {fmt(taxableIncome)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Income Tax (所得税)</div>
              <div className="text-lg font-bold text-orange-700">
                {fmt(incomeTax)}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Surtax (復興税)</div>
              <div className="text-lg font-bold text-red-700">
                {fmt(surtax)}
              </div>
            </div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">
              Residence Tax est. (住民税)
            </div>
            <div className="text-lg font-bold text-pink-700">
              {fmt(residenceTax)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">
              Net Annual Take-Home (手取り)
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {fmt(netIncome)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <div>
              Effective total tax rate:{" "}
              <strong>{effectiveRate.toFixed(1)}%</strong>
            </div>
            <div>
              Monthly take-home:{" "}
              <strong>{fmt(netIncome / 12)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Income Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical">
            <XAxis
              type="number"
              tickFormatter={(v) => "¥" + (v / 1000000).toFixed(1) + "M"}
              tick={{ fontSize: 11 }}
            />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <Bar dataKey="Take-Home" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Social Insurance" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="Income Tax" stackId="a" fill="#f97316" />
            <Bar dataKey="Surtax" stackId="a" fill="#ef4444" />
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
              Japan operates a progressive income tax system with seven tax
              brackets ranging from 5% to 45%. The national income tax (所得税,
              shotoku-zei) is administered by the National Tax Agency (NTA /
              国税庁) and applies to earned income, business income, and other
              income sources after deductions. On top of the standard income
              tax, a 2.1% reconstruction surtax (復興特別所得税) has been
              applied since 2013 to help fund recovery from the 2011 Tohoku
              earthquake and tsunami — this continues through 2037.
            </p>
            <p>
              Japan&apos;s corporate culture is built around the{" "}
              <strong>salary-man (サラリーマン)</strong> — a salaried employee
              of a large company — and the tax system is designed around this
              model. For most employees, taxes are handled entirely by their
              employer through the year-end adjustment (年末調整, nenmatsu
              chosei). Each December, the employer calculates the employee&apos;s
              exact tax liability for the year and adjusts the final paycheck
              accordingly, issuing a refund or collecting a small additional
              amount. The result: most Japanese employees never file their own
              tax return. The tax return was essentially outsourced to
              corporations.
            </p>
            <p>
              This changes for certain situations. The self-assessment system
              (確定申告, kakutei shinkoku) requires you to file your own tax
              return if you&apos;re self-employed, have business income, earn
              more than ¥20 million in salary, have side income exceeding
              ¥200,000, sold real estate or stocks, or have certain deductions
              (medical expenses, housing loan deduction for the first year).
              Filing season runs from February 16 to March 15, and the NTA
              provides an online filing system (e-Tax) that has significantly
              increased adoption.
            </p>
            <p>
              One of the most significant and often misunderstood taxes in Japan
              is the <strong>residence tax (住民税, jumin-zei)</strong>, charged
              by both the prefecture (都道府県民税) and municipality (市町村民税)
              for a combined rate of approximately 10%. Critically, residence
              tax is paid <em>in arrears</em> — you pay the prior year&apos;s
              tax in the current year. New graduates and people who quit their
              jobs often receive an unexpected residence tax bill months after
              their income has changed. A common shock for people who leave
              their company: residence tax bills arrive directly, and the amount
              can be substantial.
            </p>
            <p>
              Japan&apos;s social insurance system covers four areas:{" "}
              <strong>health insurance (健康保険)</strong> covering medical
              costs; <strong>pension (厚生年金, kosei nenkin)</strong> at 18.3%
              of monthly standard compensation split equally between employer
              and employee (employee pays 9.15%);{" "}
              <strong>unemployment insurance (雇用保険)</strong> at approximately
              0.6% (0.3% employee share); and workers&apos; accident insurance
              (労働者災害補償保険) paid entirely by the employer. Social
              insurance premiums are fully deductible from income for tax
              purposes.
            </p>
            <p>
              The <strong>¥1.03 million wall (103万円の壁)</strong> refers to
              the spousal income limit below which a dependent spouse can remain
              on their employed partner&apos;s health insurance and the employed
              partner claims a ¥380,000 spousal deduction. Many part-time
              workers deliberately limit earnings to stay under this threshold,
              creating a significant disincentive to work more hours — a
              policy challenge the government has been trying to address through
              gradual reform.
            </p>
            <p>
              Japan&apos;s My Number system (マイナンバー制度), introduced in
              2015, assigns a 12-digit individual identification number to all
              residents. This number tracks tax obligations, social insurance
              enrollment, and increasingly other government services. Employers
              collect My Number from employees, and financial institutions
              report interest and dividend income to the NTA using it — an
              increasing area of tax enforcement focus.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Do I need to file a tax return in Japan?",
            answer:
              "Most salaried employees do not — their company handles year-end adjustment (年末調整). You must file if you are self-employed, have side income over ¥200,000, have salary over ¥20 million, or want to claim certain deductions like medical expenses or a first-year housing loan deduction.",
          },
          {
            question: "What is the reconstruction surtax (復興特別所得税)?",
            answer:
              "A 2.1% surcharge on income tax introduced in 2013 to fund recovery from the 2011 Tohoku earthquake. It applies to all taxpayers and continues through 2037.",
          },
          {
            question: "Why is residence tax paid the following year?",
            answer:
              "Residence tax is assessed on the previous year's income and billed starting in June of the following year. Employees have it withheld monthly; self-employed individuals pay in four installments. This lag means people who quit their jobs face unexpected bills the year after.",
          },
          {
            question: "What is the basic deduction in Japan?",
            answer:
              "The basic deduction (基礎控除) is ¥480,000 for taxpayers with total income of ¥24 million or less. It phases out and disappears entirely above ¥25 million. This is separate from the employment income deduction which reduces salary income before other deductions.",
          },
          {
            question: "How does the spousal deduction work?",
            answer:
              "If your spouse earns under ¥1.03 million in salary income (¥480,000 net income after deduction), you can claim a ¥380,000 spousal deduction. This creates the famous '103万円の壁' (¥1.03M wall) that affects many part-time workers in Japan.",
          },
        ]}
        relatedCalculators={[
          {
            name: "Japan Salary Calculator",
            href: "/calculators/japan/salary-calculator",
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
