"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Tab = "simple" | "annualized" | "marketing";

export default function RoiCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("simple");

  // Simple ROI
  const [simpleInvestment, setSimpleInvestment] = useState(10000);
  const [simpleFinalValue, setSimpleFinalValue] = useState(13500);

  // Annualized ROI
  const [annInvestment, setAnnInvestment] = useState(10000);
  const [annFinalValue, setAnnFinalValue] = useState(20000);
  const [annYears, setAnnYears] = useState(5);

  // Marketing ROI
  const [mktRevenue, setMktRevenue] = useState(50000);
  const [mktCost, setMktCost] = useState(10000);
  const [mktMargin, setMktMargin] = useState(40);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const fmtPct = (v: number) => v.toFixed(2) + "%";

  const simpleCalc = useMemo(() => {
    const netProfit = simpleFinalValue - simpleInvestment;
    const roi = simpleInvestment > 0 ? (netProfit / simpleInvestment) * 100 : 0;
    const multiplier = simpleInvestment > 0 ? simpleFinalValue / simpleInvestment : 0;
    return { netProfit, roi, multiplier };
  }, [simpleInvestment, simpleFinalValue]);

  const annCalc = useMemo(() => {
    const netProfit = annFinalValue - annInvestment;
    const simpleRoi = annInvestment > 0 ? (netProfit / annInvestment) * 100 : 0;
    const annRoi = annYears > 0 && annInvestment > 0 ? (Math.pow(annFinalValue / annInvestment, 1 / annYears) - 1) * 100 : 0;
    const multiplier = annInvestment > 0 ? annFinalValue / annInvestment : 0;
    const sp500Comparison = annRoi >= 10 ? "Beating" : "Below";
    return { netProfit, simpleRoi, annRoi, multiplier, sp500Comparison };
  }, [annInvestment, annFinalValue, annYears]);

  const mktCalc = useMemo(() => {
    const grossProfit = mktRevenue * (mktMargin / 100);
    const roas = mktCost > 0 ? mktRevenue / mktCost : 0;
    const mktRoi = mktCost > 0 ? ((grossProfit - mktCost) / mktCost) * 100 : 0;
    const netProfit = grossProfit - mktCost;
    return { grossProfit, roas, mktRoi, netProfit };
  }, [mktRevenue, mktCost, mktMargin]);

  const chartData = useMemo(() => {
    if (activeTab === "simple") {
      return [
        { name: "Investment", value: simpleInvestment, fill: "#3b82f6" },
        { name: "Final Value", value: simpleFinalValue, fill: simpleFinalValue >= simpleInvestment ? "#22c55e" : "#ef4444" },
        { name: "Net Gain", value: Math.abs(simpleCalc.netProfit), fill: "#f59e0b" },
      ];
    } else if (activeTab === "annualized") {
      return [
        { name: "Investment", value: annInvestment, fill: "#3b82f6" },
        { name: "Final Value", value: annFinalValue, fill: annFinalValue >= annInvestment ? "#22c55e" : "#ef4444" },
        { name: "Net Gain", value: Math.abs(annCalc.netProfit), fill: "#f59e0b" },
      ];
    } else {
      return [
        { name: "Campaign Cost", value: mktCost, fill: "#ef4444" },
        { name: "Revenue", value: mktRevenue, fill: "#3b82f6" },
        { name: "Net Profit", value: Math.max(0, mktCalc.netProfit), fill: "#22c55e" },
      ];
    }
  }, [activeTab, simpleInvestment, simpleFinalValue, simpleCalc, annInvestment, annFinalValue, annCalc, mktCost, mktRevenue, mktCalc]);

  const explanation = `
<h2>Understanding Return on Investment (ROI)</h2>
<p>ROI is one of the most widely used performance metrics in business and investing — and one of the most misunderstood. At its core, ROI measures how much return you generated relative to what you invested. But the simple formula hides important nuances that change how you should interpret and use this number.</p>

<h3>ROI vs IRR: When Time Matters</h3>
<p>Simple ROI ignores time. A 100% ROI sounds the same whether achieved in 2 years or 10 years — but those are vastly different outcomes. Annualized ROI (also called CAGR, Compound Annual Growth Rate) fixes this by expressing your return as a consistent annual rate. A 100% ROI in 2 years equals a 41.4% annualized rate; in 10 years it's only 7.2%. For multi-period investments with interim cash flows — rental property, private equity, bonds — Internal Rate of Return (IRR) is more appropriate than either, because it accounts for the timing and size of every cash inflow and outflow, not just the start and end.</p>

<h3>Marketing ROI vs ROAS: Two Different Questions</h3>
<p>ROAS (Return on Ad Spend) measures revenue generated per dollar spent on advertising: $50,000 revenue / $10,000 spend = 5× ROAS. This tells you about revenue efficiency. Marketing ROI goes further by incorporating gross margin: if your margin is 40%, $50,000 in revenue generates $20,000 in gross profit. Subtract the $10,000 ad cost for a $10,000 net profit, giving a 100% marketing ROI. A campaign can have excellent ROAS but terrible ROI if margins are thin. This is why direct-to-consumer companies with 30% margins need much higher ROAS thresholds than software companies with 80% margins.</p>

<h3>Attribution Modeling: The Social Media ROI Problem</h3>
<p>Calculating ROI for digital marketing is complicated by attribution — which ad or touchpoint gets credit for a conversion? Last-click attribution gives 100% credit to the final ad before purchase, ignoring awareness campaigns that started the journey. First-click attribution does the opposite. Multi-touch models spread credit across all touchpoints. View-through attribution credits ads the user saw but didn't click. Each model produces different ROI numbers for the same campaign. Companies using multi-touch attribution typically see 20–40% shifts in measured ROI across channels versus last-click.</p>

<h3>Real Estate ROI: The Multi-Component Return</h3>
<p>Real estate ROI is more complex than most investments because returns come from four simultaneous sources: (1) Appreciation — the increase in property value; (2) Cash flow — rental income minus all expenses (mortgage, taxes, insurance, maintenance, vacancy); (3) Tax benefits — depreciation deductions, mortgage interest, 1031 exchanges; (4) Equity paydown — your tenant is paying down your mortgage. A property with flat appreciation and break-even cash flow might still generate 8–12% ROI when equity paydown and tax benefits are included. Most ROI calculators that only compare purchase price to sale price dramatically understate real estate returns.</p>

<h3>Opportunity Cost and Benchmarking</h3>
<p>ROI is only meaningful in comparison. Compare your investment's return to the risk-free rate (US Treasury bonds, ~4–5% in 2024/25), the S&P 500 average (roughly 10% annualized over long periods), or appropriate risk-adjusted benchmarks. A 7% ROI on a high-risk startup investment is disappointing; a 7% annualized return from a diversified index fund over 30 years is excellent. Always ask: "What would my money have returned in the next-best alternative?" That difference is your true excess return.</p>

<h3>Venture Capital's MOIC Framework</h3>
<p>Venture capital uses MOIC (Multiple on Invested Capital) rather than IRR or percentage ROI for individual investments. A 5× MOIC means $1M invested returned $5M. VCs target portfolio-level returns of 3× MOIC over a 10-year fund, knowing most investments will fail and a few will return 10–100×. This "power law" return distribution is why a 2× ROI is considered poor in VC even though it would be exceptional in public markets — the risk profile demands much higher returns to justify the illiquidity and binary outcomes.</p>

<h3>Payback Period: A Simpler Alternative</h3>
<p>When ROI calculations become complicated, payback period offers a clear alternative: how many months until I recover my initial investment? A marketing campaign that costs $10,000 and generates $2,000/month in net profit has a 5-month payback period. For capital equipment purchases, hiring decisions, or SaaS investments, payback period is often more actionable than ROI percentage because it directly answers the cash flow question. Most B2B SaaS companies target sales payback periods under 12 months for new customer acquisition.</p>

<h3>ROI Pitfalls: What the Formula Misses</h3>
<p>Standard ROI ignores fees, taxes, and inflation. A 12% gross ROI might be 9% after advisor fees, 7% after taxes, and 4% after inflation. It also ignores risk — two investments with identical 10% ROI might have vastly different volatility profiles. And it ignores qualitative returns: employee training with modest measurable ROI might produce cultural benefits worth multiples of the calculated return. Use ROI as one input in a broader decision framework, not as the sole metric.</p>
`;

  const faqs = [
    {
      question: "What is a good ROI?",
      answer:
        "It depends entirely on asset class and risk. For safe investments: savings accounts offer 4–5% in 2024/25; investment-grade bonds 4–6%. For equity investments: the S&P 500 averages ~10%/year long-term; real estate 8–12% total return. For business investments: most analysts consider 15–30% ROI strong for established businesses. Startups target much higher returns to compensate for failure risk. Always compare ROI to a risk-appropriate benchmark.",
    },
    {
      question: "How is ROI different from profit?",
      answer:
        "Profit is an absolute dollar figure — the dollar amount remaining after subtracting costs from revenue. ROI is a relative percentage — it expresses profit as a fraction of the amount invested. A $10,000 profit means very different things depending on whether you invested $20,000 (50% ROI) or $200,000 (5% ROI). Both metrics matter: ROI helps you compare investments of different sizes; profit tells you the actual dollars in your pocket.",
    },
    {
      question: "How do I calculate marketing ROI?",
      answer:
        "Marketing ROI = ((Revenue Generated × Gross Margin %) - Campaign Cost) / Campaign Cost × 100. For example: $50,000 revenue at 40% margin = $20,000 gross profit. Minus $10,000 campaign cost = $10,000 net profit. Divided by $10,000 cost = 100% marketing ROI. Note: many marketers mistakenly calculate ROI using revenue instead of gross profit, which dramatically overstates true returns.",
    },
    {
      question: "What is ROAS vs ROI?",
      answer:
        "ROAS (Return on Ad Spend) = Revenue / Ad Spend. It measures revenue efficiency but ignores profit margins and other costs. A 5× ROAS means you generated $5 in revenue for every $1 spent. ROI accounts for all costs and only counts gross profit, not revenue. A campaign can have a 4× ROAS but negative ROI if gross margins are below 25%. Use ROAS for quick campaign comparisons; use ROI for true profitability assessment.",
    },
    {
      question: "Should I use ROI or IRR for investments?",
      answer:
        "Use simple or annualized ROI for straightforward investments with one entry point and one exit: buying stocks, a lump-sum investment, or a one-time business expenditure. Use IRR (Internal Rate of Return) for investments with multiple cash flows over time: rental property (monthly rent over years), private equity (staged capital calls and distributions), or business projects with irregular cash flows. IRR accounts for the time value of each cash flow, making it more accurate for complex, multi-period investments.",
    },
  ];

  const relatedCalculators = [
    { label: "Break-Even Calculator", href: "/calculators/finance/break-even-calculator" },
    { label: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
    { label: "Trade Calculator", href: "/calculators/finance/trade-calculator" },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "simple", label: "Simple ROI" },
    { id: "annualized", label: "Annualized ROI" },
    { id: "marketing", label: "Marketing ROI" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "ROI Calculator", href: "/calculators/finance/roi-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ROI Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate return on investment for simple, annualized, or marketing scenarios.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          {activeTab === "simple" && (
            <>
              <h2 className="text-lg font-semibold text-gray-900">Simple ROI</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment ($)</label>
                <input type="number" min={1} step={100} value={simpleInvestment} onChange={(e) => setSimpleInvestment(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Value ($)</label>
                <input type="number" min={0} step={100} value={simpleFinalValue} onChange={(e) => setSimpleFinalValue(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {activeTab === "annualized" && (
            <>
              <h2 className="text-lg font-semibold text-gray-900">Annualized ROI (CAGR)</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment ($)</label>
                <input type="number" min={1} step={100} value={annInvestment} onChange={(e) => setAnnInvestment(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Value ($)</label>
                <input type="number" min={0} step={100} value={annFinalValue} onChange={(e) => setAnnFinalValue(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period: <span className="text-blue-600 font-semibold">{annYears} years</span>
                </label>
                <input type="range" min={1} max={30} step={1} value={annYears} onChange={(e) => setAnnYears(Number(e.target.value))} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>30 yrs</span></div>
              </div>
            </>
          )}

          {activeTab === "marketing" && (
            <>
              <h2 className="text-lg font-semibold text-gray-900">Marketing ROI</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Generated ($)</label>
                <input type="number" min={0} step={100} value={mktRevenue} onChange={(e) => setMktRevenue(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Cost ($)</label>
                <input type="number" min={1} step={100} value={mktCost} onChange={(e) => setMktCost(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Margin: <span className="text-blue-600 font-semibold">{mktMargin}%</span>
                </label>
                <input type="range" min={1} max={100} step={1} value={mktMargin} onChange={(e) => setMktMargin(Number(e.target.value))} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>100%</span></div>
              </div>
            </>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {activeTab === "simple" && (
            <>
              <div className={`rounded-2xl border p-6 ${simpleCalc.roi >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <p className="text-sm font-medium text-gray-600 mb-1">ROI</p>
                <p className={`text-4xl font-bold ${simpleCalc.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {simpleCalc.roi >= 0 ? "+" : ""}{fmtPct(simpleCalc.roi)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                  <p className={`text-xl font-bold ${simpleCalc.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>{fmt(simpleCalc.netProfit)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Multiplier</p>
                  <p className="text-xl font-bold text-gray-900">{simpleCalc.multiplier.toFixed(2)}×</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "annualized" && (
            <>
              <div className={`rounded-2xl border p-6 ${annCalc.annRoi >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <p className="text-sm font-medium text-gray-600 mb-1">Annualized ROI (CAGR)</p>
                <p className={`text-4xl font-bold ${annCalc.annRoi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {fmtPct(annCalc.annRoi)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Simple ROI: {fmtPct(annCalc.simpleRoi)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                  <p className={`text-xl font-bold ${annCalc.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>{fmt(annCalc.netProfit)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Multiplier</p>
                  <p className="text-xl font-bold text-gray-900">{annCalc.multiplier.toFixed(2)}×</p>
                </div>
              </div>
              <div className={`rounded-xl border p-4 ${annCalc.annRoi >= 10 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
                <p className="text-xs font-medium text-gray-600">vs S&P 500 Average (10%/yr)</p>
                <p className={`text-lg font-bold mt-1 ${annCalc.annRoi >= 10 ? "text-green-700" : "text-amber-700"}`}>
                  {annCalc.sp500Comparison} the market by {Math.abs(annCalc.annRoi - 10).toFixed(2)}%/yr
                </p>
              </div>
            </>
          )}

          {activeTab === "marketing" && (
            <>
              <div className={`rounded-2xl border p-6 ${mktCalc.mktRoi >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <p className="text-sm font-medium text-gray-600 mb-1">Marketing ROI</p>
                <p className={`text-4xl font-bold ${mktCalc.mktRoi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {mktCalc.mktRoi >= 0 ? "+" : ""}{fmtPct(mktCalc.mktRoi)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">ROAS</p>
                  <p className="text-xl font-bold text-gray-900">{mktCalc.roas.toFixed(2)}×</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                  <p className={`text-xl font-bold ${mktCalc.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>{fmt(mktCalc.netProfit)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Gross Profit Generated</p>
                  <p className="text-xl font-bold text-gray-900">{fmt(mktCalc.grossProfit)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Breakdown</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => "$" + (v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <rect key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout
        title="ROI Calculator"
        description="Calculate return on investment for any scenario — simple, annualized, or marketing ROI."
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
