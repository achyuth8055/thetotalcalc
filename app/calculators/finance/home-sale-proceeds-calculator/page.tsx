"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function HomeSaleProceedsCalculator() {
  const [salePrice, setSalePrice] = useState(500000);
  const [mortgageBalance, setMortgageBalance] = useState(300000);
  const [agentCommission, setAgentCommission] = useState(5.5);
  const [sellerClosingPct, setSellerClosingPct] = useState(2);
  const [transferTaxPct, setTransferTaxPct] = useState(0.5);
  const [repairs, setRepairs] = useState(3000);
  const [purchasePrice, setPurchasePrice] = useState(350000);
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const calc = useMemo(() => {
    const commission = salePrice * (agentCommission / 100);
    const closingCosts = salePrice * (sellerClosingPct / 100);
    const transferTax = salePrice * (transferTaxPct / 100);
    const totalDeductions = commission + closingCosts + transferTax + repairs + mortgageBalance;
    const netProceeds = salePrice - totalDeductions;
    const capitalGain = salePrice - purchasePrice;
    const exclusion = filingStatus === "married" ? 500000 : 250000;
    const taxableGain = Math.max(0, capitalGain - exclusion);
    const keepPct = netProceeds > 0 ? (netProceeds / salePrice) * 100 : 0;
    const estimatedTax = taxableGain * 0.15;

    const waterfallData = [
      { name: "Sale Price", value: salePrice, fill: "#3b82f6" },
      { name: "−Mortgage", value: -mortgageBalance, fill: "#f87171" },
      { name: "−Commission", value: -commission, fill: "#fb923c" },
      { name: "−Closing Costs", value: -closingCosts, fill: "#fbbf24" },
      { name: "−Transfer Tax", value: -transferTax, fill: "#a78bfa" },
      { name: "−Repairs/Staging", value: -repairs, fill: "#6b7280" },
      { name: "Net Proceeds", value: netProceeds, fill: netProceeds >= 0 ? "#22c55e" : "#ef4444" },
    ];

    return {
      commission,
      closingCosts,
      transferTax,
      totalDeductions,
      netProceeds,
      capitalGain,
      exclusion,
      taxableGain,
      keepPct,
      estimatedTax,
      waterfallData,
    };
  }, [salePrice, mortgageBalance, agentCommission, sellerClosingPct, transferTaxPct, repairs, purchasePrice, filingStatus]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Home Sale Proceeds", href: "/calculators/finance/home-sale-proceeds-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Sale Proceeds Calculator</h1>
          <p className="text-base text-gray-600">
            Estimate your net proceeds after selling your home — accounting for agent fees, closing costs, mortgage payoff, repairs, and capital gains tax.
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Sale Details</h2>

          {/* Home Sale Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Home Sale Price</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
                className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range" min={100000} max={2000000} step={5000} value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$100k</span><span>$2M</span></div>
          </div>

          {/* Mortgage Balance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Mortgage Balance Remaining</label>
              <input
                type="number"
                value={mortgageBalance}
                onChange={(e) => setMortgageBalance(Number(e.target.value) || 0)}
                className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range" min={0} max={1500000} step={5000} value={mortgageBalance}
              onChange={(e) => setMortgageBalance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$0</span><span>$1.5M</span></div>
          </div>

          {/* Agent Commission */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Agent Commission %</label>
              <input
                type="number"
                value={agentCommission}
                step={0.1}
                onChange={(e) => setAgentCommission(Number(e.target.value) || 0)}
                className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range" min={0} max={7} step={0.1} value={agentCommission}
              onChange={(e) => setAgentCommission(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>7%</span></div>
          </div>

          {/* Closing Costs % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Closing Costs % (seller)</label>
              <input
                type="number"
                value={sellerClosingPct}
                step={0.1}
                onChange={(e) => setSellerClosingPct(Number(e.target.value) || 0)}
                className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range" min={0} max={4} step={0.1} value={sellerClosingPct}
              onChange={(e) => setSellerClosingPct(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>4%</span></div>
          </div>

          {/* Transfer Tax % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Transfer Tax %</label>
              <input
                type="number"
                value={transferTaxPct}
                step={0.05}
                onChange={(e) => setTransferTaxPct(Number(e.target.value) || 0)}
                className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="range" min={0} max={3} step={0.05} value={transferTaxPct}
              onChange={(e) => setTransferTaxPct(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>3%</span></div>
          </div>

          {/* Pre-sale Repairs/Staging */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pre-sale Repairs / Staging ($)</label>
            <input
              type="number"
              value={repairs}
              onChange={(e) => setRepairs(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Capital Gains Section */}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Capital Gains</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Original Purchase Price ($)</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filing Status</label>
              <div className="flex gap-2">
                {(["single", "married"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilingStatus(s)}
                    className={`flex-1 py-2 px-3 text-xs rounded-lg font-medium transition-colors ${
                      filingStatus === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {s === "single" ? "Single ($250k)" : "Married ($500k)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Your Net Proceeds</h2>

          {/* Big Green Number */}
          <div className={`text-center p-5 rounded-xl border ${calc.netProceeds >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
            <p className="text-sm text-gray-500 mb-1">Estimated Net Proceeds</p>
            <p className={`text-5xl font-bold ${calc.netProceeds >= 0 ? "text-green-700" : "text-red-600"}`}>
              {fmt(calc.netProceeds)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You keep <strong>{calc.keepPct.toFixed(1)}%</strong> of your home&apos;s sale price
            </p>
          </div>

          {/* Itemized Deductions Table */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between font-semibold text-gray-800 pb-1 border-b border-gray-100">
              <span>Gross Sale Price</span>
              <span className="text-blue-700">{fmt(salePrice)}</span>
            </div>
            {[
              { label: "Mortgage Payoff", value: mortgageBalance },
              { label: `Agent Commission (${agentCommission}%)`, value: calc.commission },
              { label: `Closing Costs (${sellerClosingPct}%)`, value: calc.closingCosts },
              { label: `Transfer Tax (${transferTaxPct}%)`, value: calc.transferTax },
              { label: "Repairs / Staging", value: repairs },
            ]
              .filter(({ value }) => value > 0)
              .map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-600">
                  <span>{label}</span>
                  <span className="text-red-500">−{fmt(value)}</span>
                </div>
              ))}
            <div className="flex justify-between font-bold border-t border-gray-200 pt-2 text-base mt-2">
              <span>Total Deductions</span>
              <span className="text-red-600">−{fmt(calc.totalDeductions)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Net Proceeds</span>
              <span className={calc.netProceeds >= 0 ? "text-green-700" : "text-red-600"}>
                {fmt(calc.netProceeds)}
              </span>
            </div>
          </div>

          {/* Capital Gains Box */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-sm font-semibold text-amber-900 mb-2">Capital Gains Estimate</p>
            <div className="space-y-1 text-sm text-amber-800">
              <div className="flex justify-between">
                <span>Capital Gain (Sale − Purchase)</span>
                <span>{fmt(calc.capitalGain)}</span>
              </div>
              <div className="flex justify-between">
                <span>Exclusion ({filingStatus === "married" ? "$500k married" : "$250k single"})</span>
                <span>−{fmt(Math.min(Math.max(0, calc.capitalGain), calc.exclusion))}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-amber-200 pt-1 mt-1">
                <span>Taxable Gain</span>
                <span>{fmt(calc.taxableGain)}</span>
              </div>
              {calc.taxableGain > 0 ? (
                <div className="flex justify-between font-bold text-red-700 mt-1">
                  <span>Est. Tax (15% long-term rate)</span>
                  <span>{fmt(calc.estimatedTax)}</span>
                </div>
              ) : (
                <p className="text-green-700 font-medium mt-1 text-xs">
                  No capital gains tax owed — gain is within the exclusion limit.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Proceeds Waterfall</h2>
        <p className="text-sm text-gray-500 mb-4">How your sale price breaks down into net proceeds</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={calc.waterfallData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} />
            <YAxis
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(v: number) => [fmt(Math.abs(v)), v < 0 ? "Deduction" : "Amount"]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {calc.waterfallData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
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
              Selling a home involves more moving parts than most people realize. The headline sale price looks great on paper, but once you subtract the mortgage payoff, agent commissions, closing costs, transfer taxes, and pre-sale expenses — you may be surprised at how much actually ends up in your pocket. This calculator builds your personal net sheet so you can plan with clarity.
            </p>
            <p>
              <strong>The NAR Commission Settlement (August 2024)</strong> changed how buyer&apos;s agent fees are handled. Prior to the settlement, sellers typically paid both agents — listing agent and buyer&apos;s agent — totaling 5–6% of the sale price. Under the new rules effective August 2024, buyers must negotiate compensation directly with their own agents in a written buyer representation agreement. Sellers are no longer required to offer buyer&apos;s agent compensation through the MLS. This creates more flexibility for sellers and is expected to put gradual downward pressure on total commission costs over time, though market practices vary by region.
            </p>
            <p>
              <strong>Staging and pre-sale improvements</strong> are among the highest-ROI activities a seller can undertake. According to NAR research, professionally staged homes sell faster and for more — with staging returning $2 to $4 for every $1 invested. That said, not all improvements deliver equal returns. Kitchen remodels recover roughly 75% of costs, bathroom renovations around 70%, and a new roof approximately 68%. In contrast, luxury additions like swimming pools, sunrooms, or high-end master suite expansions often recover less than half their cost. The sweet spot: functional, fresh, and neutral — not custom or lavish.
            </p>
            <p>
              <strong>Capital gains tax exclusion</strong> is one of the most valuable tax benefits available to homeowners. Under IRC Section 121, you can exclude up to $250,000 of capital gain (single filer) or $500,000 (married filing jointly) from federal income tax — provided the home was your primary residence for at least 2 of the last 5 years. This exclusion is available once every two years. If you&apos;ve owned and lived there for fewer than 2 years, a partial exclusion may apply for qualifying circumstances like job relocation or divorce. Investment properties do not qualify; for those, a <strong>1031 exchange</strong> allows you to defer capital gains by reinvesting proceeds into a like-kind replacement property within strict IRS timelines.
            </p>
            <p>
              <strong>Bridge loans</strong> help solve the timing problem of buying a new home before your current one sells. These are short-term loans secured against your existing home&apos;s equity, providing down payment funds without requiring you to sell first. They&apos;re more expensive than conventional financing but can help you avoid making a contingent offer — which sellers in competitive markets tend to reject.
            </p>
            <p>
              <strong>Title insurance</strong> is typically split between buyer and seller, though customs vary by state. The seller usually pays for the owner&apos;s title policy (protecting the buyer) in many states, while the buyer pays for the lender&apos;s policy. Title insurance covers defects in ownership history — unknown liens, forged deeds, missing heirs, or prior recording errors — that could emerge after closing. On a $500,000 sale, owner&apos;s title insurance typically costs $1,000–$2,000 as a one-time premium.
            </p>
            <p>
              <strong>Closing timeline and remote closings</strong>: a traditional closing takes 30–45 days after offer acceptance. The process involves appraisal, inspection, title search, underwriting, and document preparation. Remote Online Notarization (RON) is now legal in most states, allowing buyers and sellers to sign closing documents via video with a digital notary — eliminating the need for everyone to gather at a title company. This is especially valuable for relocating sellers or out-of-state investors.
            </p>
            <p>
              <strong>Seller concessions</strong> — where the seller agrees to cover part of the buyer&apos;s closing costs — are a common negotiating lever, especially in buyer&apos;s markets. Concessions of 2–3% reduce your net proceeds but can help close deals with buyers who are cash-constrained. Factor potential concessions into your minimum acceptable net price before listing.
            </p>
          </div>
        }
        faqs={[
          {
            question: "How has the NAR commission lawsuit changed real estate fees?",
            answer: "The 2024 NAR settlement, which became effective in August 2024, fundamentally changed how buyer's agent compensation works. Sellers are no longer required to offer buyer's agent compensation through the MLS. Instead, buyers must negotiate and agree to their agent's compensation in a written buyer representation agreement before touring homes. This means sellers may pay lower total commissions — potentially just the listing agent's fee — though many sellers still offer to cover buyer's agent fees as a negotiating incentive in competitive markets. Shop listing agents and compare: flat-fee MLS services can list your home for $300–$500, while traditional listing agents typically charge 2.5–3%.",
          },
          {
            question: "Do I have to pay capital gains tax when I sell my home?",
            answer: "Most homeowners owe no capital gains tax on their primary residence sale. Under IRS Section 121, you can exclude up to $250,000 of gain (single) or $500,000 (married filing jointly) from taxable income if you've owned AND lived in the home as your primary residence for at least 2 of the last 5 years. Only gains above these thresholds are taxed, at long-term capital gains rates of 0%, 15%, or 20% depending on your income. If you've owned the home less than a year, gains are taxed as ordinary income. Investment properties don't qualify — consider a 1031 exchange for those.",
          },
          {
            question: "What closing costs does the seller pay?",
            answer: "Seller closing costs (excluding agent commissions) typically run 1–3% of the sale price and include: real estate transfer taxes or documentary stamp taxes (varies by state — zero in Texas, up to 2.65% in New York), title insurance for the buyer's owner's policy (customary in many states), escrow/settlement fees, prorated property taxes owed through closing, HOA transfer fees and any outstanding dues, deed preparation, and recording fees. Your agent or title company will provide a detailed Seller's Net Sheet estimating all costs before you list.",
          },
          {
            question: "How can I maximize my home sale proceeds?",
            answer: "Several strategies boost net proceeds: (1) Price strategically — overpricing leads to longer days on market and eventual price cuts that signal distress; (2) Invest in high-ROI pre-sale improvements — staging ($2–$4 return per $1), curb appeal, fresh neutral paint, and deferred maintenance fixes; (3) Get a pre-listing inspection to eliminate surprises and negotiate from strength; (4) Shop agent commissions — even saving 0.5% on a $500k home saves $2,500; (5) Time the market — spring (March–May) is historically the strongest selling season in most markets; (6) Avoid concessions where possible by pricing competitively from day one.",
          },
          {
            question: "What is a net sheet and how do I get one?",
            answer: "A seller's net sheet (also called a seller's estimated net proceeds statement) is a document your listing agent or title company prepares that estimates your proceeds after all costs. It includes the projected sale price, mortgage payoff amount, agent commissions, closing costs, transfer taxes, and any other expected expenses — arriving at your estimated check at closing. Ask your listing agent for a net sheet before signing a listing agreement, and ask for an updated one once you have an accepted offer with the final sale price, so you know exactly what you'll net. Some title companies and real estate portals also offer online net sheet calculators.",
          },
        ]}
        relatedCalculators={[
          { name: "Closing Cost Calculator", href: "/calculators/finance/closing-cost-calculator" },
          { name: "Cap Rate Calculator", href: "/calculators/finance/cap-rate-calculator" },
          { name: "Rental Property ROI Calculator", href: "/calculators/finance/rental-property-roi-calculator" },
          { name: "Mortgage Calculator", href: "/calculators/finance/mortgage-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
