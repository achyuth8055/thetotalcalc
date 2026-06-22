"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(5000);
  const [variableCost, setVariableCost] = useState(10);
  const [sellingPrice, setSellingPrice] = useState(25);
  const [targetProfit, setTargetProfit] = useState(0);
  const [currentSalesUnits, setCurrentSalesUnits] = useState<number | "">(500);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const calc = useMemo(() => {
    const cm = sellingPrice - variableCost;
    const cmPct = sellingPrice > 0 ? (cm / sellingPrice) * 100 : 0;
    const beUnits = cm > 0 ? Math.ceil(fixedCosts / cm) : Infinity;
    const beRevenue = beUnits === Infinity ? 0 : beUnits * sellingPrice;
    const unitsForTarget = cm > 0 ? Math.ceil((fixedCosts + targetProfit) / cm) : Infinity;
    const sales = currentSalesUnits === "" ? 0 : currentSalesUnits;
    const currentProfit = sales > 0 ? sales * cm - fixedCosts : null;
    const marginOfSafety = beUnits !== Infinity && sales > 0 && sales > beUnits
      ? ((sales - beUnits) / sales) * 100
      : null;

    // Chart data: 0 to 2x break-even units (cap at 5000 for perf)
    const maxUnits = beUnits !== Infinity ? Math.min(Math.ceil(beUnits * 2), 5000) : 500;
    const steps = 20;
    const stepSize = Math.ceil(maxUnits / steps);
    const chartData = [];
    for (let u = 0; u <= maxUnits; u += stepSize) {
      chartData.push({
        units: u,
        revenue: u * sellingPrice,
        totalCost: fixedCosts + u * variableCost,
        profit: u * cm - fixedCosts,
      });
    }

    return { cm, cmPct, beUnits, beRevenue, unitsForTarget, currentProfit, marginOfSafety, chartData, maxUnits };
  }, [fixedCosts, variableCost, sellingPrice, targetProfit, currentSalesUnits]);

  const explanation = `
<h2>Break-Even Analysis: The Foundation of Business Profitability</h2>
<p>Break-even analysis answers a fundamental business question: how many units do I need to sell before I stop losing money? Understanding this number — and what drives it — is essential for pricing decisions, launching new products, evaluating business models, and managing financial risk.</p>

<h3>Contribution Margin vs Gross Margin: A Critical Distinction</h3>
<p>Many business owners confuse contribution margin with gross margin, but they measure different things. Gross margin deducts all cost of goods sold (COGS) from revenue, including some fixed manufacturing overhead. Contribution margin subtracts only truly variable costs — those that change with each additional unit produced or sold. This distinction matters because only the contribution margin tells you how much each unit "contributes" toward covering fixed costs and generating profit. A product with a 60% gross margin might have a 75% contribution margin if fixed overhead is allocated to COGS.</p>

<h3>Fixed vs Variable Costs: Common Misclassifications</h3>
<p>Fixed costs stay constant regardless of production volume: rent, salaried staff, insurance, software subscriptions, equipment depreciation. Variable costs scale with output: raw materials, packaging, shipping, hourly labor, payment processing fees. The tricky ones are "semi-variable" costs. Commissions are variable; base salaries are fixed. Utilities have a fixed base plus variable usage. Properly classifying these is essential — misclassifying a variable cost as fixed will make your break-even analysis dangerously optimistic.</p>

<h3>Operating Leverage: The Double-Edged Sword</h3>
<p>Companies with high fixed costs and low variable costs have high operating leverage. Think software companies (near-zero marginal cost per user) or airlines (massive fixed costs per flight). Below break-even, these businesses lose money rapidly. Above break-even, profit margins expand quickly because most additional revenue flows straight through to profit. A 10% revenue increase might produce a 40% profit increase for a highly leveraged business. This amplification works in reverse during downturns — fixed costs continue even when revenue falls.</p>

<h3>Using Break-Even for Go/No-Go Decisions</h3>
<p>Before launching a product or business, compare your break-even unit volume against realistic market size estimates. If your break-even requires selling 10,000 units per month but your total addressable market is 15,000 units, the margin of safety is razor-thin — one competitor, one supply chain disruption, or one bad month could be fatal. A business with a break-even at 20% of TAM is far more resilient. This is why break-even analysis is a standard component of any business plan or investment pitch.</p>

<h3>Multi-Product Break-Even: Weighted Average Contribution Margin</h3>
<p>When you sell multiple products, you need a weighted average contribution margin based on your sales mix. If Product A has a $15 CM and represents 60% of sales, and Product B has a $5 CM at 40% of sales, your blended CM is $11. Changing your product mix — selling more high-CM items — lowers your break-even without changing prices or costs. This is why sales teams are often incentivized to push premium products: they shift the revenue mix favorably.</p>

<h3>Sensitivity Analysis: What If Costs Rise?</h3>
<p>Break-even analysis becomes more powerful when used dynamically. Run scenarios: if raw material costs rise 20%, what happens to break-even units? If you reduce price by 10% to gain market share, how many more units must you sell? If rent increases at lease renewal, what's the impact? This sensitivity analysis reveals which assumptions are most fragile and helps you build contingency plans before problems materialize.</p>

<h3>SaaS and Service Business Unit Economics</h3>
<p>For software and services, "units" might be monthly recurring revenue (MRR) customers, consulting hours, or subscriptions. SaaS break-even analysis often incorporates customer acquisition cost (CAC) and lifetime value (LTV). If CAC is $500 and monthly gross profit per customer is $50, the payback period (a form of break-even) is 10 months. Industry benchmarks suggest LTV should be at least 3× CAC for a sustainable SaaS business. For service businesses, break-even in billable hours is straightforward: fixed monthly costs divided by (hourly rate minus variable cost per billable hour).</p>

<h3>The Relevant Range Caveat</h3>
<p>Fixed costs are only fixed within a relevant range of output. If you double production, you might need to lease a second facility — "jumping" your fixed cost base to a new level. Break-even analysis assumes a static cost structure, which breaks down at significantly higher or lower volumes. Always note the volume range for which your analysis is valid and re-run it if your business scales significantly beyond those bounds.</p>
`;

  const faqs = [
    {
      question: "What is contribution margin?",
      answer:
        "Contribution margin is the selling price per unit minus the variable cost per unit. It represents how much each unit sold 'contributes' toward covering fixed costs and eventually generating profit. For example, if you sell a product for $25 and the variable cost is $10, your contribution margin is $15. Once total contribution margin equals total fixed costs, you've reached break-even.",
    },
    {
      question: "Is a lower break-even point always better?",
      answer:
        "Generally yes — a lower break-even means you reach profitability with fewer sales, reducing risk. However, the comparison depends on your business model. A high fixed cost structure (high break-even) often means much higher profits per unit once you're above break-even. The right balance depends on your market size, pricing power, and risk tolerance.",
    },
    {
      question: "How do I reduce my break-even point?",
      answer:
        "There are three main levers: (1) Lower fixed costs — negotiate rent, reduce overhead, eliminate unnecessary subscriptions; (2) Raise your selling price — even a 10% price increase dramatically improves contribution margin; (3) Lower variable costs per unit — renegotiate supplier contracts, improve processes, reduce waste. Increasing price is usually the most powerful lever because it improves contribution margin without adding volume pressure.",
    },
    {
      question: "Can break-even analysis be used for service businesses?",
      answer:
        "Absolutely. For a service business, the 'unit' is typically a billable hour, consulting engagement, or project. Fixed costs include salaries, office rent, and software. Variable costs per billable hour might include subcontractor fees or materials. If your hourly rate is $150 and variable cost per hour is $30, your CM is $120. Divide total monthly fixed costs by $120 to find how many billable hours you need each month to break even.",
    },
    {
      question: "What is the margin of safety?",
      answer:
        "The margin of safety measures how far your current sales can fall before you hit break-even — expressed as a percentage. If you're selling 600 units per month and your break-even is 400 units, your margin of safety is 33%. This means sales can drop by one-third before you start losing money. A higher margin of safety indicates a more resilient business. Most analysts prefer a margin of safety above 20% for established businesses.",
    },
  ];

  const relatedCalculators = [
    { label: "ROI Calculator", href: "/calculators/finance/roi-calculator" },
    { label: "Margin Calculator", href: "/calculators/finance/margin-calculator" },
    { label: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Break-Even Calculator", href: "/calculators/finance/break-even-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Break-Even Calculator</h1>
          <p className="text-base text-gray-600">
            Find the exact sales volume at which your business stops losing money and starts making profit.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Cost Structure</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fixed Costs (monthly): <span className="text-blue-600 font-semibold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(fixedCosts)}</span>
            </label>
            <input type="range" min={100} max={100000} step={100} value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$100</span><span>$100k</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variable Cost per Unit: <span className="text-blue-600 font-semibold">{fmt(variableCost)}</span>
            </label>
            <input type="range" min={0} max={500} step={1} value={variableCost} onChange={(e) => setVariableCost(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$0</span><span>$500</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price per Unit: <span className="text-blue-600 font-semibold">{fmt(sellingPrice)}</span>
            </label>
            <input type="range" min={1} max={1000} step={1} value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$1</span><span>$1,000</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Monthly Profit ($)</label>
            <input
              type="number"
              min={0}
              step={100}
              value={targetProfit}
              onChange={(e) => setTargetProfit(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Monthly Sales (units, optional)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={currentSalesUnits}
              onChange={(e) => setCurrentSalesUnits(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Break-Even Units</p>
            <p className="text-4xl font-bold text-blue-700">
              {calc.beUnits === Infinity ? "N/A" : calc.beUnits.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">units per month</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Break-Even Revenue</p>
              <p className="text-xl font-bold text-gray-900">{fmt(calc.beRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Contribution Margin</p>
              <p className="text-xl font-bold text-gray-900">{fmt(calc.cm)}</p>
              <p className="text-xs text-gray-500">{calc.cmPct.toFixed(1)}% of price</p>
            </div>
          </div>

          {targetProfit > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-medium text-amber-700 mb-1">Units for Target Profit ({fmt(targetProfit)}/mo)</p>
              <p className="text-xl font-bold text-amber-800">
                {calc.unitsForTarget === Infinity ? "N/A" : calc.unitsForTarget.toLocaleString()} units
              </p>
            </div>
          )}

          {calc.currentProfit !== null && (
            <div className={`rounded-xl border p-4 ${calc.currentProfit >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <p className="text-xs font-medium text-gray-600 mb-1">Monthly Profit at Current Sales</p>
              <p className={`text-xl font-bold ${calc.currentProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {fmt(calc.currentProfit)}
              </p>
              {calc.marginOfSafety !== null && (
                <p className="text-xs text-gray-600 mt-1">Margin of Safety: {calc.marginOfSafety.toFixed(1)}%</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Costs vs Profit</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calc.chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="units" tick={{ fontSize: 11 }} label={{ value: "Units Sold", position: "insideBottom", offset: -5, fontSize: 12 }} />
            <YAxis tickFormatter={(v) => "$" + (Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `${l} units`} />
            <Legend verticalAlign="top" />
            {calc.beUnits !== Infinity && (
              <ReferenceLine x={calc.beUnits} stroke="#6366f1" strokeDasharray="5 3" strokeWidth={2} label={{ value: "Break-Even", position: "insideTopRight", fill: "#4f46e5", fontSize: 11 }} />
            )}
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={false} name="Total Revenue" />
            <Line type="monotone" dataKey="totalCost" stroke="#ef4444" strokeWidth={2} dot={false} name="Total Costs" />
            <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={false} name="Profit / Loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout
        title="Break-Even Calculator"
        description="Calculate the sales volume needed to cover all costs and start generating profit."
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
