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
} from "recharts";

export default function JapanConsumptionTaxCalculator() {
  const [amount, setAmount] = useState(10000);
  const [mode, setMode] = useState<"add" | "extract">("add");
  const [category, setCategory] = useState<"standard" | "reduced">("standard");

  const rate = category === "standard" ? 0.1 : 0.08;

  let pretax: number, tax: number, total: number;
  if (mode === "add") {
    pretax = amount;
    tax = amount * rate;
    total = amount + tax;
  } else {
    pretax = amount / (1 + rate);
    tax = amount - pretax;
    total = amount;
  }

  const fmt = (v: number) =>
    "¥" + new Intl.NumberFormat("ja-JP").format(Math.round(v));

  const chartData = [
    {
      name: "Standard (10%)",
      tax: Math.round(pretax * 0.1),
      pretax: Math.round(pretax),
    },
    {
      name: "Reduced (8%)",
      tax: Math.round(pretax * 0.08),
      pretax: Math.round(pretax),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          {
            label: "Japan Calculators",
            href: "/calculators/japan",
          },
          {
            label: "Consumption Tax Calculator",
            href: "/calculators/japan/consumption-tax-calculator",
          },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Japan Consumption Tax Calculator (消費税)
          </h1>
          <p className="text-base text-gray-600">
            Calculate Japanese consumption tax at 10% standard or 8% reduced
            rate
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
          <h2 className="text-lg font-semibold text-gray-800">Input</h2>

          {/* Mode toggle */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Calculation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "add", label: "Add Tax to Price" },
                { v: "extract", label: "Extract Tax from Total" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setMode(opt.v as "add" | "extract")}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    mode === opt.v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Tax Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCategory("standard")}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  category === "standard"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Standard (10%)
              </button>
              <button
                onClick={() => setCategory("reduced")}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  category === "reduced"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Reduced (8%) 🍎
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Reduced rate: food &amp; non-alcoholic beverages (takeout),
              newspapers
            </p>
          </div>

          {/* Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                {mode === "add"
                  ? "Pre-tax Amount (¥)"
                  : "Total Amount incl. Tax (¥)"}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-32 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range"
              min={100}
              max={1000000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>¥100</span>
              <span>¥1,000,000</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Pre-tax Amount</div>
              <div className="text-xl font-bold text-gray-800">
                {fmt(pretax)}
              </div>
            </div>
            <div
              className={`rounded-lg p-3 ${
                category === "standard" ? "bg-orange-50" : "bg-green-50"
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                Consumption Tax (
                {category === "standard" ? "10%" : "8%"})
              </div>
              <div
                className={`text-xl font-bold ${
                  category === "standard"
                    ? "text-orange-700"
                    : "text-green-700"
                }`}
              >
                {fmt(tax)}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Total Amount</div>
              <div className="text-2xl font-bold text-blue-700">
                {fmt(total)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <div>
                Tax rate:{" "}
                <strong>{(rate * 100).toFixed(0)}%</strong>
              </div>
              <div>
                Effective tax share:{" "}
                <strong>{((tax / total) * 100).toFixed(2)}%</strong> of total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Standard vs Reduced Rate Comparison
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={4}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) =>
                "¥" + v.toLocaleString()
              }
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(v: number) => fmt(v)}
            />
            <Bar
              dataKey="pretax"
              name="Pre-tax"
              stackId="a"
              fill="#93c5fd"
            />
            <Bar
              dataKey="tax"
              name="Tax"
              stackId="a"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
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
              Japan&apos;s consumption tax (消費税, Shōhizei) is a value-added
              tax applied to the sale of goods and services throughout Japan.
              Introduced in 1989 at 3%, it was raised to 5% in 1997, 8% in
              2014, and finally 10% in October 2019. The 2019 increase also
              introduced a dual-rate system — the first time Japan has had
              differentiated consumption tax rates — creating the 8% reduced
              rate for certain everyday necessities.
            </p>
            <p>
              The standard 10% rate applies to most goods and services:
              electronics, clothing, cosmetics, household goods, restaurant
              dining, alcohol, tobacco, and services like haircuts and hotel
              stays. The reduced 8% rate applies to food and non-alcoholic
              beverages purchased for takeout or retail (not dining in at a
              restaurant), as well as subscription newspapers published more
              than twice per week.
            </p>
            <p>
              One practical complexity is the{" "}
              <strong>uchizei (内税) vs. sotodzei (外税)</strong> distinction.
              Uchizei means the displayed price already includes tax — common in
              supermarkets and convenience stores. Sotodzei means the displayed
              price excludes tax, which you&apos;ll see at many electronics
              stores and B2B suppliers. Since October 2021, all retail
              businesses must display tax-inclusive prices (総額表示義務),
              making uchizei the standard for consumer-facing pricing.
            </p>
            <p>
              For businesses registered to collect consumption tax, the system
              works as a credit/offset mechanism. A business pays consumption
              tax on its purchases (input tax) and collects it on its sales
              (output tax). The difference is remitted to the National Tax
              Agency. Businesses with annual taxable sales below ¥10 million
              are exempt from consumption tax collection — a threshold that
              matters enormously for small businesses, freelancers, and
              individual contractors in Japan.
            </p>
            <p>
              The 2023 introduction of the{" "}
              <strong>Invoice System (インボイス制度)</strong> fundamentally
              changed this landscape. Under the old system, tax-exempt
              businesses didn&apos;t need to issue proper invoices and their
              clients could still claim input tax credits. Under the new Invoice
              System (effective October 2023), only registered businesses with a
              Qualified Invoice Issuer number can issue invoices that allow the
              recipient to claim input tax credits. This has significant
              implications for freelancers and small businesses dealing with
              corporate clients.
            </p>
            <p>
              Tourists visiting Japan can claim a refund on consumption tax paid
              on eligible purchases over ¥5,000 (pre-tax) at registered
              Tax-Free (免税) shops. You&apos;ll need your passport, and
              purchases must be taken out of Japan within 30 days. The
              duty-free shopping counter at department stores and electronics
              retailers handles this. Note that consumables (food, beverages,
              pharmaceuticals, cosmetics) must be purchased in specific
              quantities and sealed until departure.
            </p>
            <p>
              Looking forward, there has been government discussion about
              potentially raising the consumption tax rate again — possibly to
              15–20% — to fund social security costs as Japan&apos;s aging
              population expands. The Japan Center for Economic Research
              estimated Japan would need rates of 15–20% to maintain fiscal
              stability long-term. However, past rate increases proved
              politically sensitive, so any future change would require
              significant public debate.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is Japan's consumption tax rate?",
            answer:
              "Japan has two rates: 10% standard rate and 8% reduced rate. The reduced rate applies to food/non-alcoholic beverages (takeout only) and newspapers.",
          },
          {
            question:
              "Does restaurant food use the 10% or 8% rate?",
            answer:
              "Dining in at a restaurant uses the 10% standard rate. Takeout food and delivery uses the 8% reduced rate. This means buying a sandwich to eat in a cafe costs more tax than the same sandwich to go.",
          },
          {
            question: "Can tourists get a consumption tax refund?",
            answer:
              "Yes, at Tax-Free registered shops for purchases over ¥5,000 (pre-tax). Show your passport at the tax-free counter and the tax is either deducted at the register or refunded.",
          },
          {
            question:
              "What is the Invoice System (インボイス制度)?",
            answer:
              "A system introduced in October 2023 requiring businesses to register and issue qualified invoices for clients to claim input tax credits. A major change affecting freelancers and small businesses.",
          },
          {
            question:
              "Is Japan's consumption tax the same as VAT?",
            answer:
              "Yes, functionally. Both are value-added taxes collected at each stage of the supply chain, with businesses remitting the net amount (output tax minus input tax) to the government.",
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
            name: "Markup Calculator",
            href: "/calculators/finance/markup-calculator",
          },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
