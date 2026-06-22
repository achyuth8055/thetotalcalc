"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Mode = "price" | "markup" | "cost";

const PRESETS = [
  { label: "Retail (50%)", markup: 50 },
  { label: "Restaurant (300%)", markup: 300 },
  { label: "Wholesale (25%)", markup: 25 },
  { label: "Software (80%)", markup: 80 },
];

export default function MarkupCalculator() {
  const [mode, setMode] = useState<Mode>("price");
  const [cost, setCost] = useState(100);
  const [markupPct, setMarkupPct] = useState(50);
  const [price, setPrice] = useState(150);
  const [marginPct, setMarginPct] = useState(33.33);

  const result = useMemo(() => {
    let c: number, p: number, mu: number, mg: number;
    if (mode === "price") {
      c = cost; mu = markupPct;
      p = c * (1 + mu / 100);
      mg = ((p - c) / p) * 100;
    } else if (mode === "markup") {
      c = cost; p = price;
      mu = ((p - c) / c) * 100;
      mg = ((p - c) / p) * 100;
    } else {
      p = price; mg = marginPct;
      c = p * (1 - mg / 100);
      mu = ((p - c) / c) * 100;
    }
    const profit = p - c;
    return { cost: c, price: p, markup: mu, margin: mg, profit };
  }, [mode, cost, markupPct, price, marginPct]);

  const fmt = (v: number) => "$" + v.toFixed(2);
  const fmtPct = (v: number) => v.toFixed(2) + "%";

  const chartData = PRESETS.map(preset => ({
    name: preset.label,
    cost: 100,
    profit: +(100 * (preset.markup / 100)).toFixed(2),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Finance Calculators", href: "/finance-calculators" },
        { label: "Markup Calculator", href: "/calculators/finance/markup-calculator" },
      ]} />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Markup Calculator</h1>
          <p className="text-base text-gray-600">Calculate markup percentage, gross margin, and selling price — and understand the crucial difference between the two</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
          ↓ PDF
        </button>
      </div>

      {/* Mode tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {([
          { v: "price", label: "Find Selling Price" },
          { v: "markup", label: "Find Markup %" },
          { v: "cost", label: "Find Cost" },
        ] as {v: Mode; label: string}[]).map(tab => (
          <button key={tab.v} onClick={() => setMode(tab.v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === tab.v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Presets */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <span className="text-sm text-gray-500 self-center">Quick presets:</span>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => { setMarkupPct(p.markup); setMode("price"); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors">
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Inputs</h2>

          {(mode === "price" || mode === "markup") && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Cost ($)</label>
                <input type="number" value={cost} onChange={e => setCost(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
              </div>
              <input type="range" min={1} max={10000} step={1} value={cost} onChange={e => setCost(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          )}

          {mode === "price" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Markup %</label>
                <input type="number" value={markupPct} onChange={e => setMarkupPct(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
              </div>
              <input type="range" min={0} max={500} step={1} value={markupPct} onChange={e => setMarkupPct(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>500%</span></div>
            </div>
          )}

          {(mode === "markup" || mode === "cost") && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Selling Price ($)</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
              </div>
              <input type="range" min={1} max={20000} step={1} value={price} onChange={e => setPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          )}

          {mode === "cost" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Gross Margin %</label>
                <input type="number" value={marginPct} onChange={e => setMarginPct(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
              </div>
              <input type="range" min={1} max={99} step={0.5} value={marginPct} onChange={e => setMarginPct(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            ⚠️ <strong>Common confusion:</strong> A 50% markup ≠ 50% margin. A 50% markup gives only a 33.3% gross margin.
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Selling Price</div>
              <div className="text-2xl font-bold text-blue-700">{fmt(result.price)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Gross Profit</div>
              <div className="text-xl font-bold text-green-700">{fmt(result.profit)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Markup %</div>
                <div className="text-lg font-bold text-gray-800">{fmtPct(result.markup)}</div>
                <div className="text-xs text-gray-400">on cost</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Gross Margin %</div>
                <div className="text-lg font-bold text-gray-800">{fmtPct(result.margin)}</div>
                <div className="text-xs text-gray-400">on price</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Cost</div>
              <div className="text-lg font-bold text-gray-700">{fmt(result.cost)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Industry Preset Comparison (on $100 cost)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => "$" + v} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => "$" + v.toFixed(2)} />
            <Bar dataKey="cost" name="Cost" stackId="a" fill="#93c5fd" />
            <Bar dataKey="profit" name="Profit" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout title="" description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>Markup and gross margin are two of the most commonly confused concepts in business finance — and the confusion is costly. A business owner who thinks they're charging a 50% margin but is actually calculating a 50% markup is underselling by more than 16 percentage points. Understanding the precise difference between these two metrics is fundamental to setting prices that ensure profitability.</p>
            <p><strong>Markup</strong> is calculated as a percentage of cost: Markup % = (Selling Price − Cost) / Cost × 100. If you buy a product for $100 and sell it for $150, your markup is 50%. This is the traditional "cost-plus" approach — you know your cost and add a fixed percentage on top.</p>
            <p><strong>Gross Margin</strong> is calculated as a percentage of the selling price: Margin % = (Selling Price − Cost) / Selling Price × 100. That same $150 selling price on a $100 cost gives you a 33.3% gross margin. Retailers and CFOs typically discuss profitability in margin terms, not markup — which is why conflating them creates major accounting errors.</p>
            <p>The mathematical relationship between them: Margin = Markup / (1 + Markup/100), and Markup = Margin / (1 − Margin/100). So a 50% markup equals a 33.3% margin, and a 50% margin requires a 100% markup. This is why the retail "keystone markup" (100% markup = doubling the cost) produces exactly a 50% gross margin.</p>
            <p>Industry markup standards vary widely. Grocery stores operate on razor-thin 25-30% markups to drive volume. Traditional brick-and-mortar retail uses 50-100% (keystone). Restaurants famously charge 300-500% on beverages and 200-300% on food — necessary to cover high labor, rent, waste, and food spoilage. Pharmaceutical companies command 200-5000% markups on branded drugs, though this remains controversial. Software and SaaS businesses operate at 60-90%+ margins once the initial development cost is sunk.</p>
            <p>Beyond simple cost-plus pricing, businesses increasingly adopt <strong>value-based pricing</strong> — setting price based on what customers are willing to pay rather than what it costs to produce. A luxury handbag may cost $300 to make but sells for $3,000 because customers pay for the brand prestige. A SaaS tool that saves a business $50,000/year can charge $10,000/year even if it costs $500/year to serve — the markup is irrelevant; the value delivered justifies the price.</p>
            <p>Dynamic pricing has become standard in e-commerce. Amazon is estimated to change prices on millions of products millions of times per day, adjusting based on competitor prices, demand patterns, inventory levels, and time of day. Airlines pioneered yield management (charging different prices to different customers for the same seat based on purchase timing and demand). Understanding your target margin allows you to set floor prices below which you won't go, while dynamic strategies maximize revenue above that floor.</p>
            <p>For businesses evaluating pricing strategies, two key frameworks apply: <strong>penetration pricing</strong> (set low initial prices to gain market share, then raise once established — used by Netflix, Spotify, and most SaaS startups) versus <strong>price skimming</strong> (start high to capture early adopters' willingness to pay, then lower gradually — used by Apple for new iPhone launches). Both strategies involve deliberate choices about the markup-to-value relationship at each stage of the product lifecycle.</p>
          </div>
        }
        faqs={[
          { question: "What is the difference between markup and margin?", answer: "Markup is calculated on cost (profit/cost × 100%), while margin is calculated on price (profit/price × 100%). A 50% markup equals only 33.3% margin. Retailers discuss margins; manufacturers often use markup." },
          { question: "What markup should a retail store use?", answer: "Traditional retail uses 50% (keystone markup), which doubles the wholesale cost and produces a 50% gross margin. High-end boutiques may use 100-200%. Discounters may use 25-35%." },
          { question: "How do I find the selling price if I want a 40% margin?", answer: "Divide your cost by (1 − 0.40) = 0.60. So if cost is $60: $60/0.60 = $100 selling price, giving a 40% gross margin. Alternatively, markup% = margin/(1-margin) = 40/60 = 66.7%." },
          { question: "Is a high markup always profitable?", answer: "Not necessarily. High markups can reduce unit sales due to price elasticity. Total profit = units sold × margin per unit. Sometimes a lower markup with higher volume produces more profit." },
          { question: "What is cost-plus pricing vs value-based pricing?", answer: "Cost-plus adds a fixed markup to cost (simple but ignores customer value). Value-based prices based on what customers will pay (higher potential revenue but requires market research). Most successful businesses combine both." },
        ]}
        relatedCalculators={[
          { name: "Break-Even Calculator", href: "/calculators/finance/break-even-calculator" },
          { name: "ROI Calculator", href: "/calculators/finance/roi-calculator" },
          { name: "Hourly to Salary Calculator", href: "/calculators/finance/hourly-to-salary-calculator" },
        ]}
      ><div /></CalculatorLayout>
    </div>
  );
}
