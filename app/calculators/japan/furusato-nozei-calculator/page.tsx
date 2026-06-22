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
  Cell,
} from "recharts";

// Pre-calculated maximum deduction table by income bracket
// (approximate upper limits based on NTA guidelines for single person, no dependents)
const LIMIT_TABLE: { income: number; limit: number }[] = [
  { income: 3000000, limit: 27000 },
  { income: 3500000, limit: 34000 },
  { income: 4000000, limit: 42000 },
  { income: 4500000, limit: 52000 },
  { income: 5000000, limit: 60000 },
  { income: 5500000, limit: 68000 },
  { income: 6000000, limit: 77000 },
  { income: 6500000, limit: 97000 },
  { income: 7000000, limit: 108000 },
  { income: 7500000, limit: 118000 },
  { income: 8000000, limit: 129000 },
  { income: 9000000, limit: 151000 },
  { income: 10000000, limit: 176000 },
  { income: 12000000, limit: 242000 },
  { income: 15000000, limit: 387000 },
  { income: 20000000, limit: 560000 },
  { income: 25000000, limit: 751000 },
  { income: 30000000, limit: 1002000 },
];

// Adjustment factor for dependents / spouse
// Having dependents reduces the deduction limit slightly
function dependentAdjustment(
  dependents: number,
  hasSpouse: boolean
): number {
  // Rough percentage reduction per dependent
  const count = dependents + (hasSpouse ? 1 : 0);
  if (count === 0) return 1.0;
  if (count === 1) return 0.88;
  if (count === 2) return 0.81;
  if (count === 3) return 0.74;
  return 0.67;
}

function getMaxDeduction(income: number, depAdj: number): number {
  let lower = LIMIT_TABLE[0];
  let upper = LIMIT_TABLE[LIMIT_TABLE.length - 1];

  for (let i = 0; i < LIMIT_TABLE.length - 1; i++) {
    if (income >= LIMIT_TABLE[i].income && income < LIMIT_TABLE[i + 1].income) {
      lower = LIMIT_TABLE[i];
      upper = LIMIT_TABLE[i + 1];
      break;
    }
    if (income >= LIMIT_TABLE[LIMIT_TABLE.length - 1].income) {
      lower = upper = LIMIT_TABLE[LIMIT_TABLE.length - 1];
    }
  }

  // Interpolate
  let limit: number;
  if (lower === upper) {
    limit = lower.limit;
  } else {
    const ratio =
      (income - lower.income) / (upper.income - lower.income);
    limit = lower.limit + ratio * (upper.limit - lower.limit);
  }

  return Math.floor(limit * depAdj / 1000) * 1000;
}

export default function FurusatoNozeiCalculator() {
  const [income, setIncome] = useState(6000000);
  const [maritalStatus, setMaritalStatus] = useState<"single" | "married">(
    "single"
  );
  const [dependents, setDependents] = useState(0);
  const [municipalities, setMunicipalities] = useState(3);

  const hasSpouse = maritalStatus === "married";
  const depAdj = dependentAdjustment(dependents, hasSpouse);
  const maxDeduction = getMaxDeduction(income, depAdj);
  const selfBurden = 2000;
  const netSavings = Math.max(0, maxDeduction - selfBurden);
  const estimatedGifts = Math.floor(maxDeduction * 0.3);
  const oneStopEligible = municipalities <= 5;

  const fmt = (v: number) =>
    "¥" + new Intl.NumberFormat("ja-JP").format(Math.round(v));

  const chartData = [
    { name: "Your Cost", value: selfBurden, fill: "#f97316" },
    { name: "Tax Savings", value: netSavings, fill: "#3b82f6" },
    { name: "Gift Value (30%)", value: estimatedGifts, fill: "#22c55e" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Japan Calculators", href: "/calculators/japan" },
          {
            label: "Furusato Nozei Calculator",
            href: "/calculators/japan/furusato-nozei-calculator",
          },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Furusato Nozei Limit Calculator (ふるさと納税)
          </h1>
          <p className="text-base text-gray-600">
            Calculate your maximum tax-deductible hometown tax donation and
            estimate the value of gifts you can receive for just ¥2,000
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

          {/* Income */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Annual Income (¥)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) =>
                  setIncome(Number(e.target.value) || 0)
                }
                className="w-36 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range"
              min={3000000}
              max={30000000}
              step={100000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>¥3M</span>
              <span>¥30M</span>
            </div>
          </div>

          {/* Marital status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Marital Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "single", label: "Single / Independent" },
                { v: "married", label: "Married (dependent spouse)" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() =>
                    setMaritalStatus(opt.v as "single" | "married")
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    maritalStatus === opt.v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dependents */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Number of Dependents (children/parents): {dependents}
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

          {/* Number of municipalities */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Number of municipalities you plan to donate to: {municipalities}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={municipalities}
              onChange={(e) => setMunicipalities(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>10+</span>
            </div>
            <div
              className={`mt-2 text-xs font-medium rounded px-2 py-1 inline-block ${
                oneStopEligible
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {oneStopEligible
                ? "One-Stop eligible (5 or fewer municipalities — no tax return needed)"
                : "Tax return required (more than 5 municipalities)"}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Results</h2>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">
              Maximum Deductible Donation
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {fmt(maxDeduction)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Approximate — based on NTA bracket table
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                Your Personal Burden
              </div>
              <div className="text-xl font-bold text-orange-700">
                {fmt(selfBurden)}
              </div>
              <div className="text-xs text-orange-500">Always ¥2,000</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Net Tax Savings</div>
              <div className="text-xl font-bold text-green-700">
                {fmt(netSavings)}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-xs text-gray-500 mb-1">
              Estimated Gift Value (30% of donation)
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {fmt(estimatedGifts)}
            </div>
          </div>

          <div className="bg-green-600 rounded-lg p-4 text-white text-center">
            <div className="text-sm font-medium opacity-90 mb-1">
              Effective cost for {fmt(estimatedGifts)} in gifts:
            </div>
            <div className="text-3xl font-bold">{fmt(selfBurden)}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
            <div>
              Filing method:{" "}
              <strong>
                {oneStopEligible
                  ? "One-Stop Exception (no tax return)"
                  : "Self-assessment tax return required"}
              </strong>
            </div>
            <div>
              Deduction type:{" "}
              <strong>
                Residence tax credit + income tax deduction
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Furusato Nozei Value Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) =>
                "¥" + new Intl.NumberFormat("ja-JP").format(v)
              }
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(v: number) => fmt(v)}
            />
            <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Furusato Nozei (ふるさと納税, literally &quot;hometown tax
              donation&quot;) is one of the most uniquely Japanese financial
              systems — and one of the most lucrative for savvy taxpayers. The
              scheme allows any Japanese resident to donate to any municipality
              in Japan (not just their hometown) and receive two benefits: a
              near-total tax deduction/credit equal to the donation amount minus
              ¥2,000, and local specialty gifts (返礼品, henreihin) worth up to
              30% of the donation value. In practice, this means a person
              earning ¥6 million can donate ¥77,000 to various municipalities,
              receive approximately ¥23,000 worth of premium wagyu beef, fresh
              seafood, or Kyushu sake, and pay only ¥2,000 out of pocket. It is
              one of the most accessible tax efficiency tools available to
              ordinary Japanese workers.
            </p>
            <p>
              The system was introduced in 2008 by then-Minister of Internal
              Affairs Yoshihiro Katayama as a way to address Japan&apos;s
              regional inequality. Rural municipalities were losing tax revenue
              as young residents moved to cities, while their infrastructure
              costs remained constant. Furusato Nozei allows donors to redirect
              a portion of their local taxes to any municipality they choose,
              supporting regions they feel connected to or simply want to
              support. The system grew slowly at first but exploded in
              popularity from around 2015, driven by the convenience of online
              platforms and the appeal of gift rewards.
            </p>
            <p>
              The political controversy is significant. Major cities — especially
              Tokyo, Osaka, and Yokohama — lose enormous amounts of tax revenue.
              Tokyo estimates it loses over ¥100 billion annually to Furusato
              Nozei, funds that would otherwise support city services. The Tokyo
              Metropolitan Government has repeatedly called for reform or
              abolition of the scheme. In contrast, rural municipalities that
              offer attractive gift packages (premium Miyazaki wagyu, Hokkaido
              dairy, Toyama seafood) have seen their revenues surge, allowing
              them to fund local projects and even attract new businesses. The
              political tension between urban and rural interests makes
              significant reform unlikely in the near term.
            </p>
            <p>
              The main platforms for making Furusato Nozei donations are{" "}
              <strong>Furusato Choice (ふるさとチョイス)</strong>, the largest
              platform with the most municipalities; <strong>Rakuten Furusato Nozei</strong>, which
              offers Rakuten points on donations (making it even more
              cost-effective for Rakuten users); and{" "}
              <strong>Satofull (さとふる)</strong>, which is particularly
              user-friendly for first-time donors. All platforms display the
              available gifts, current stock status, and allow filtering by
              gift category, region, and donation amount.
            </p>
            <p>
              The{" "}
              <strong>
                One-Stop Special Exception (ワンストップ特例制度)
              </strong>{" "}
              dramatically simplified Furusato Nozei for most salaried workers.
              Prior to this system (introduced in 2015), all donors had to file
              a self-assessment tax return to claim their deduction — a
              significant barrier for the majority of Japanese employees who
              never file returns. Under the One-Stop system, if you donate to 5
              or fewer municipalities and don&apos;t otherwise need to file a
              return, you simply submit a One-Stop application form to each
              municipality. The municipality then notifies your local
              government, which applies the credit directly to your residence
              tax bill. No tax return needed. For many donors, this means the
              entire process is handled online in under 30 minutes.
            </p>
            <p>
              Gift quality and value has been a subject of reform. In 2019, the
              Ministry of Internal Affairs and Communications (MIC) imposed a
              30% maximum gift return ratio and required all gifts to be local
              products from the donating municipality. Before this, some
              municipalities offered extravagant gifts — electronics, travel
              vouchers with no geographic restriction, and even gold coins —
              creating a race to offer the most attractive rewards regardless of
              local relevance. The reforms were controversial, with several
              municipalities initially refusing compliance, but most eventually
              fell in line. Popular legitimate categories now include premium
              wagyu beef (especially from Miyakonojo in Miyazaki Prefecture,
              historically the largest recipient municipality), fresh seafood
              from Hokkaido, fruit from Yamagata, and sake from various
              traditional brewing regions.
            </p>
            <p>
              Calculating the exact maximum deductible donation is complex
              because it depends on your income, filing status, dependents, and
              which income deductions apply to you. The NTA provides an official
              simulation tool, and all major donation platforms offer their own
              calculators. The ¥2,000 self-burden remains constant regardless
              of income level — a deliberate design choice to ensure that even
              high-income earners have some personal cost, preventing the system
              from becoming a pure tax arbitrage tool.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Is Furusato Nozei available to all Japan residents?",
            answer:
              "Yes, all residents of Japan who pay income tax and/or residence tax are eligible. This includes permanent residents, long-term visa holders, and Japanese nationals. You must have taxable income — if you pay no income tax or residence tax, there is nothing to deduct against.",
          },
          {
            question: "What is the ¥2,000 self-burden?",
            answer:
              "A mandatory minimum out-of-pocket cost of ¥2,000 that applies regardless of how many municipalities you donate to. All donations above this are fully deducted from your taxes. It's designed to ensure donors have some personal stake in the system rather than making it completely cost-free.",
          },
          {
            question: "How does the One-Stop Exception work?",
            answer:
              "If you donate to 5 or fewer municipalities and don't need to file a tax return for other reasons, you can submit a One-Stop application form to each municipality instead of filing a return. The municipality reports your donation to your local government, which automatically reduces your next year's residence tax. The form must be submitted by January 10th of the following year.",
          },
          {
            question: "Can I donate more than the maximum deductible amount?",
            answer:
              "Yes, but any amount above the deductible limit will simply be an uncompensated donation. There's no penalty, but you won't get the tax benefit on excess donations. Most donors stick to the calculated maximum to optimize the value.",
          },
          {
            question: "What are the most popular Furusato Nozei gifts?",
            answer:
              "Wagyu beef (especially from Miyakonojo, Miyazaki), fresh seafood and crab from Hokkaido, high-quality rice from Niigata and Akita, fruit (peaches, apples, grapes) from Yamagata and Nagano, and sake from traditional brewing regions. Electronics and travel vouchers are still available from some municipalities under the 30% limit.",
          },
        ]}
        relatedCalculators={[
          {
            name: "Japan Income Tax Calculator",
            href: "/calculators/japan/income-tax-calculator",
          },
          {
            name: "Japan Salary Calculator",
            href: "/calculators/japan/salary-calculator",
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
