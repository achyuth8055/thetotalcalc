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

export default function CryptoProfitCalculator() {
  const [investment, setInvestment] = useState(1000);
  const [buyPrice, setBuyPrice] = useState(30000);
  const [sellPrice, setSellPrice] = useState(50000);
  const [buyFee, setBuyFee] = useState(0.1);
  const [sellFee, setSellFee] = useState(0.1);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const fmtPct = (v: number) => v.toFixed(2) + "%";
  const fmtCoin = (v: number) => v.toFixed(6);

  const calc = useMemo(() => {
    const coins = investment / buyPrice;
    const buyFeeAmt = investment * (buyFee / 100);
    const totalCost = investment + buyFeeAmt;
    const grossProceeds = coins * sellPrice;
    const sellFeeAmt = grossProceeds * (sellFee / 100);
    const netProceeds = grossProceeds - sellFeeAmt;
    const netProfit = netProceeds - totalCost;
    const roi = (netProfit / totalCost) * 100;
    const breakEven = totalCost / coins;

    const whatIfPrices = [-20, -10, 0, 10, 20].map((pct) => {
      const sp = sellPrice * (1 + pct / 100);
      const gp = coins * sp;
      const sfAmt = gp * (sellFee / 100);
      const np = gp - sfAmt;
      const profit = np - totalCost;
      const r = (profit / totalCost) * 100;
      return { label: `${pct >= 0 ? "+" : ""}${pct}%`, roi: r, profit };
    });

    return { coins, buyFeeAmt, totalCost, grossProceeds, sellFeeAmt, netProceeds, netProfit, roi, breakEven, whatIfPrices };
  }, [investment, buyPrice, sellPrice, buyFee, sellFee]);

  const chartData = [
    { name: "Investment", value: investment, fill: "#3b82f6" },
    { name: "Gross Value", value: calc.grossProceeds, fill: calc.grossProceeds >= investment ? "#22c55e" : "#ef4444" },
    { name: "Net Profit", value: Math.abs(calc.netProfit), fill: "#f59e0b" },
  ];

  const isProfit = calc.netProfit >= 0;

  const explanation = `
<h2>Understanding Crypto Profit & Loss</h2>
<p>Calculating your real profit from a cryptocurrency trade requires more than subtracting buy price from sell price. Exchange fees, tax treatment, and cost basis methods all shape your actual return — and ignoring them can lead to costly surprises.</p>

<h3>How Exchange Fees Eat Into Returns</h3>
<p>Every major exchange charges trading fees. Coinbase Pro charges 0.4–0.6% per trade for most users, Binance charges 0.1% (or 0.075% with BNB), and Kraken charges 0.16–0.26% maker/taker. On a $10,000 trade, a 1% combined round-trip fee costs $100 — before any gain. On smaller amounts this matters less, but for high-frequency traders, fees can wipe out most profits.</p>

<h3>Short-Term vs Long-Term Capital Gains</h3>
<p>The IRS taxes cryptocurrency as property, not currency. If you hold for fewer than 12 months, your gains are taxed as ordinary income — potentially up to 37% for high earners. Hold longer than 12 months and you qualify for long-term capital gains rates: 0%, 15%, or 20% depending on your income bracket. On a $5,000 gain, that difference could mean $850 vs $1,850 in federal tax. Timing your sell can be as important as the sell price itself.</p>

<h3>Cost Basis Methods: FIFO, HIFO, and Specific ID</h3>
<p>If you've made multiple purchases at different prices, the order in which you "sell" those lots matters enormously. FIFO (First In, First Out) uses your oldest purchases first — often your lowest-cost lots, maximizing taxable gain. HIFO (Highest In, First Out) uses your most expensive lots first, minimizing current-year gain and deferring taxes. Specific ID lets you cherry-pick exactly which coins you're selling. Most tax software (Koinly, CoinTracker, TaxBit) supports all three. The IRS allows any method as long as you're consistent within a year.</p>

<h3>The Wash Sale Rule — Does It Apply to Crypto?</h3>
<p>As of 2024, the wash sale rule does NOT apply to cryptocurrency. This means you can sell Bitcoin at a loss, immediately repurchase it, and still claim the tax loss — a strategy known as tax loss harvesting. This loophole has been the subject of proposed legislation, and some analysts expect Congress to close it. If it does pass, crypto wash sales would work like stocks: you'd need to wait 30 days before rebuying the same asset to claim the loss.</p>

<h3>Dollar-Cost Averaging vs Lump-Sum Investing</h3>
<p>Historical analysis of Bitcoin shows that lump-sum investing (putting all cash in at once) outperforms DCA about 65% of the time in rising markets — because you're exposed to gains earlier. However, DCA dramatically reduces the psychological pain of buying near a top. Given Bitcoin's history of 80%+ drawdowns (2018, 2022), many investors find DCA more sustainable. A common strategy is to DCA during bear markets and consider larger positions only after significant corrections.</p>

<h3>Slippage and Liquidity for Large Orders</h3>
<p>On major exchanges, small orders (under $10,000) typically execute at or near the quoted price. Large orders — $100,000 or more — can experience slippage as your order moves through the order book, buying increasingly expensive coins. For large positions, breaking trades into smaller chunks or using OTC desks can reduce this impact. Altcoins with thin order books can see 1–5% slippage even on modest orders.</p>

<h3>Portfolio Allocation and Risk Context</h3>
<p>Financial advisors typically suggest limiting speculative assets like crypto to 1–5% of a total portfolio. Bitcoin is often considered less speculative than altcoins, given its liquidity and market cap. Its compound annual return since 2015 has exceeded 100%/yr in bull cycles — but its maximum drawdown periods have lasted 2+ years. Allocating a small percentage lets you participate in upside while limiting downside damage to your overall financial plan.</p>

<h3>Security: Hardware Wallets and Self-Custody</h3>
<p>If you're holding significant crypto, keeping coins on an exchange exposes you to platform risk (see: FTX collapse in 2022, $8B in customer funds lost). Hardware wallets (Ledger, Trezor) store private keys offline. They cost $50–$200 and protect against exchange hacks and insolvency. Self-custody requires keeping your seed phrase secure — losing it means losing access permanently. For amounts above $1,000, most security experts recommend moving at least a portion to self-custody.</p>
`;

  const faqs = [
    {
      question: "Do I pay tax on crypto gains?",
      answer:
        "Yes. The IRS classifies cryptocurrency as property. Every time you sell, trade, or spend crypto at a gain, it's a taxable event. Short-term gains (held under 1 year) are taxed as ordinary income (10–37%). Long-term gains (held over 1 year) are taxed at 0%, 15%, or 20% depending on your income. You must report all gains even if the exchange doesn't send a 1099.",
    },
    {
      question: "What is dollar-cost averaging in crypto?",
      answer:
        "Dollar-cost averaging (DCA) means buying a fixed dollar amount of crypto at regular intervals — say, $100 of Bitcoin every week — regardless of price. When prices are high, you buy fewer coins; when prices are low, you buy more. Over time this averages out your cost basis and removes the pressure of trying to time the market perfectly.",
    },
    {
      question: "What is a break-even price?",
      answer:
        "Your break-even price is the sell price at which your net proceeds exactly equal your total cost (investment plus buy fees). Selling above the break-even price generates a profit; selling below results in a loss. This calculator accounts for both buy and sell fees in the break-even calculation, giving you a more accurate figure than simply using your purchase price.",
    },
    {
      question: "How do exchange fees affect profit?",
      answer:
        "Exchange fees can significantly reduce profit on smaller trades. For example: a 1% buy fee plus 1% sell fee on a $10,000 investment means you pay $100 to enter and roughly $100 to exit — $200 in fees total, before any gain. If you only made a 2% gain, fees consume half your profit. This is why comparing fee structures across exchanges (Coinbase vs Binance vs Kraken) matters, especially for active traders.",
    },
    {
      question: "Should I sell all at once or take profits gradually?",
      answer:
        "Partial profit-taking is a popular strategy that reduces regret in either direction. A common approach is to sell 25–33% of a position at predetermined price targets (e.g., +50%, +100%, +200%) while letting the remainder run. This locks in real gains without fully exiting a position that might continue rising. It also forces discipline and avoids the emotional trap of holding through a full reversal.",
    },
  ];

  const relatedCalculators = [
    { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
    { name: "ROI Calculator", href: "/calculators/finance/roi-calculator" },
    { name: "Tax Calculator", href: "/calculators/finance/tax-calculator" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Crypto Profit Calculator", href: "/calculators/finance/crypto-profit-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crypto Profit Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate your real profit or loss from a cryptocurrency trade after fees.
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
          <h2 className="text-lg font-semibold text-gray-900">Trade Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount: <span className="text-blue-600 font-semibold">{fmt(investment)}</span>
            </label>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$100</span><span>$100,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buy Price per Coin ($)</label>
            <input
              type="number"
              min={0.01}
              step={100}
              value={buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sell Price per Coin ($)</label>
            <input
              type="number"
              min={0.01}
              step={100}
              value={sellPrice}
              onChange={(e) => setSellPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buy Fee: <span className="text-blue-600 font-semibold">{fmtPct(buyFee)}</span>
            </label>
            <input
              type="range"
              min={0}
              max={3}
              step={0.01}
              value={buyFee}
              onChange={(e) => setBuyFee(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span><span>3%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sell Fee: <span className="text-blue-600 font-semibold">{fmtPct(sellFee)}</span>
            </label>
            <input
              type="range"
              min={0}
              max={3}
              step={0.01}
              value={sellFee}
              onChange={(e) => setSellFee(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span><span>3%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className={`rounded-2xl border p-6 ${isProfit ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <p className="text-sm font-medium text-gray-600 mb-1">Net Profit / Loss</p>
            <p className={`text-4xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
              {isProfit ? "+" : ""}{fmt(calc.netProfit)}
            </p>
            <p className={`text-lg font-semibold mt-1 ${isProfit ? "text-green-500" : "text-red-500"}`}>
              ROI: {fmtPct(calc.roi)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Coins Purchased</p>
              <p className="text-xl font-bold text-gray-900">{fmtCoin(calc.coins)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Break-Even Price</p>
              <p className="text-xl font-bold text-gray-900">{fmt(calc.breakEven)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Cost</p>
              <p className="text-xl font-bold text-gray-900">{fmt(calc.totalCost)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Net Proceeds</p>
              <p className="text-xl font-bold text-gray-900">{fmt(calc.netProceeds)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trade Breakdown</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <rect key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">What-If Sell Price Scenarios</h2>
        <div className="grid grid-cols-5 gap-3">
          {calc.whatIfPrices.map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border p-3 text-center ${
                s.roi >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }`}
            >
              <p className="text-xs text-gray-500 font-medium mb-1">{s.label} price</p>
              <p className={`text-sm font-bold ${s.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                {s.roi >= 0 ? "+" : ""}{fmtPct(s.roi)}
              </p>
              <p className="text-xs text-gray-600">{fmt(s.profit)}</p>
            </div>
          ))}
        </div>
      </div>

      <CalculatorLayout
        title="Crypto Profit Calculator"
        description="Calculate your real cryptocurrency profit or loss after exchange fees."
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
