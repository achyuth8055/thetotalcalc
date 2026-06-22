"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function FireCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [annualIncome, setAnnualIncome] = useState(80000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [swr, setSwr] = useState(4);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const fmtPct = (v: number) => v.toFixed(1) + "%";

  const calc = useMemo(() => {
    const annualSavings = Math.max(0, annualIncome - annualExpenses);
    const fiNumber = annualExpenses / (swr / 100);
    const savingsRate = annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;
    const monthlyPassiveIncome = (fiNumber * (swr / 100)) / 12;

    // Simulate year-by-year
    const data: { age: number; balance: number }[] = [];
    let balance = currentSavings;
    let yearsToFire = 0;
    let fireAge = currentAge;

    for (let year = 0; year <= 60; year++) {
      data.push({ age: currentAge + year, balance: Math.round(balance) });
      if (balance >= fiNumber && yearsToFire === 0) {
        yearsToFire = year;
        fireAge = currentAge + year;
      }
      balance = balance * (1 + expectedReturn / 100) + annualSavings;
      if (year > 55 && yearsToFire === 0) {
        yearsToFire = 999;
        fireAge = 999;
        break;
      }
    }

    // Savings rate needed to FIRE in 10 years
    // fiNumber = savings10 * (1+r)^10 + annualSavingsNeeded * ((1+r)^10 - 1) / r
    const r = expectedReturn / 100;
    const fv10Factor = Math.pow(1 + r, 10);
    const annuityFactor = (fv10Factor - 1) / r;
    const remaining = fiNumber - currentSavings * fv10Factor;
    const savingsNeededFor10yr = remaining > 0 ? remaining / annuityFactor : 0;
    const monthlySavingsNeeded10yr = savingsNeededFor10yr / 12;

    // Trim data to fireAge + 5 or 50 years max
    const trimAge = fireAge < 999 ? Math.min(fireAge + 5, currentAge + 55) : currentAge + 55;
    const chartData = data.filter((d) => d.age <= trimAge);

    return {
      annualSavings,
      fiNumber,
      savingsRate,
      yearsToFire,
      fireAge,
      monthlyPassiveIncome,
      monthlySavingsNeeded10yr,
      chartData,
    };
  }, [currentAge, currentSavings, annualIncome, annualExpenses, expectedReturn, swr]);

  const explanation = `
<h2>Understanding FIRE: Financial Independence, Retire Early</h2>
<p>FIRE is a financial movement built on a deceptively simple premise: save aggressively, invest consistently, and reach a point where your investment portfolio generates enough income to cover your living expenses — indefinitely. At that point, paid work becomes optional.</p>

<h3>The Trinity Study and the 4% Rule</h3>
<p>The foundation of FIRE math comes from the 1998 Bengen study, popularized as the "Trinity Study." Researchers analyzed historical stock and bond portfolio returns and found that a 4% annual withdrawal rate survived 30-year retirement periods in nearly every historical scenario since 1925 — including the Great Depression, 1970s stagflation, and the dot-com crash. This means a $1,000,000 portfolio could safely pay you $40,000 per year. The FI Number — often called the "magic number" — is simply 25 times your annual expenses (the inverse of 4%).</p>

<h3>The FIRE Movement's Origins</h3>
<p>While the concept has existed for decades, the FIRE movement gained mainstream attention largely through Pete Adeney's blog "Mr. Money Mustache," launched in 2011. Adeney retired at 30 after saving roughly 65% of a software engineer's income. His core insight: lifestyle inflation is the enemy of financial independence, and most people can retire far earlier than age 65 if they optimize spending rather than just chasing income.</p>

<h3>FIRE Variants: Lean, Fat, and Barista</h3>
<p>Not all FIRE is the same. LeanFIRE targets a frugal retirement on under $40,000 per year — often achieved by relocating to a low cost-of-living area or practicing extreme minimalism. FatFIRE targets $100,000 or more per year in retirement spending, requiring a $2.5M+ portfolio but allowing a comfortable lifestyle. BaristaFIRE is a middle path: semi-retire by taking part-time work (like a coffee shop job that provides health insurance) to cover basic expenses while your portfolio grows. This dramatically reduces the required FI Number and lets you leave stressful careers years earlier.</p>

<h3>The Power of Savings Rate</h3>
<p>Your savings rate — not your income — determines how quickly you reach FIRE. Someone saving 25% of income needs roughly 32 more years of work. Someone saving 50% needs about 17 years. At 75%, that drops to just 7 years. This counterintuitive math works because a high savings rate simultaneously shrinks your lifestyle cost (the target) and grows your assets (the fuel). This is why FIRE math focuses obsessively on the gap between income and expenses.</p>

<h3>Sequence of Returns Risk</h3>
<p>One of the biggest threats to early retirement is encountering a bear market in your first few years of retirement. If markets drop 40% in year one and you're withdrawing 4% of your original portfolio, you're drawing down a shrinking base — permanently impairing future growth. This "sequence of returns risk" is why some FIRE advocates use a 3–3.5% withdrawal rate for horizons longer than 30 years, or maintain a 2-year cash buffer to avoid selling during downturns.</p>

<h3>Healthcare: The Biggest FIRE Variable</h3>
<p>For Americans retiring before 65, healthcare is often the largest and most unpredictable expense. Without employer coverage and before Medicare eligibility, a family's health insurance can cost $800–$2,000 per month through the ACA marketplace. FIRE calculators should include healthcare as a line item. BaristaFIRE's appeal largely comes from gaining employer health benefits through part-time work, which can save $10,000+ per year compared to individual ACA plans.</p>

<h3>Geographic Arbitrage and Beyond</h3>
<p>Many FIRE adherents extend their runway through geographic arbitrage — retiring to countries or regions where a US dollar goes much further. Portugal, Mexico, Thailand, and parts of Eastern Europe offer high quality of life for $2,000–$3,000 per month. This can cut a $1.5M FI Number to $750,000. Others pursue "geoarbitrage" domestically by moving from San Francisco to Tucson, cutting housing costs by 60%.</p>

<h3>The Psychological Challenges of Early Retirement</h3>
<p>Many FIRE retirees report unexpected challenges: loss of identity tied to work, social isolation as friends remain in careers, and difficulty transitioning from decades of disciplined saving to actually spending money. The "one more year" syndrome — always feeling like just one more year of work will make things safer — is real and documented. Successful FIRE retirees often emphasize building rich social networks, passion projects, and purpose outside of work well before leaving careers.</p>
`;

  const faqs = [
    {
      question: "What is the 4% rule?",
      answer:
        "The 4% rule states that you can withdraw 4% of your investment portfolio in your first year of retirement, then adjust for inflation each year, and your portfolio has historically lasted at least 30 years. It's based on the 1998 Bengen/Trinity Study using US stock and bond data from 1925 onward. A $1M portfolio would generate $40,000/year under this rule.",
    },
    {
      question: "Is the 4% rule still valid today?",
      answer:
        "It remains widely used, but critics argue that the original study assumed a 30-year retirement — many FIRE retirees need 50+ years. In low-yield environments or with significant stock/bond correlation, some planners now suggest 3–3.5% as a safer withdrawal rate for early retirees. Vanguard's 2021 research suggested a 3.3% rate for 40-year horizons with 90% confidence.",
    },
    {
      question: "What is the FI Number?",
      answer:
        "Your FI Number (Financial Independence Number) is the total investment portfolio value at which you can retire. It's calculated as 25 times your annual expenses — the mathematical inverse of the 4% rule. If you spend $60,000 per year, your FI Number is $1,500,000. Reducing annual expenses has a double benefit: it lowers your FI Number AND increases how much you can save each year.",
    },
    {
      question: "Do I need to stop working completely to achieve FIRE?",
      answer:
        "No. BaristaFIRE, CoastFIRE, and other hybrid approaches let you semi-retire by combining a modest portfolio with part-time income. CoastFIRE means reaching the point where, even if you stop contributing, your existing portfolio will grow to your FI Number by traditional retirement age. This lets you take lower-paying, lower-stress work without worrying about saving for the future.",
    },
    {
      question: "What happens if markets crash right after I retire?",
      answer:
        "This is the sequence of returns risk — one of the biggest threats to early retirement. If you retire into a bear market and draw down a falling portfolio, your future recovery is impaired. Common mitigations include: maintaining 1–2 years of cash expenses to avoid selling in downturns, using a flexible withdrawal strategy (spend less during down years), building a 'bond tent' (temporarily higher bond allocation in early retirement), and having some part-time income available as a buffer.",
    },
  ];

  const relatedCalculators = [
    { name: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
    { name: "Investment Calculator", href: "/calculators/finance/investment-calculator" },
    { name: "Savings Goal Calculator", href: "/calculators/finance/savings-goal-calculator" },
  ];

  const swrOptions = [
    { value: 3, label: "3% Conservative" },
    { value: 4, label: "4% Standard" },
    { value: 5, label: "5% Aggressive" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "FIRE Calculator", href: "/calculators/finance/fire-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FIRE Calculator</h1>
          <p className="text-base text-gray-600">
            Find your Financial Independence number and how many years until you can retire early.
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
          <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Age: <span className="text-blue-600 font-semibold">{currentAge}</span>
            </label>
            <input type="range" min={20} max={60} step={1} value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>20</span><span>60</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Savings: <span className="text-blue-600 font-semibold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(currentSavings)}</span>
            </label>
            <input type="range" min={0} max={1000000} step={1000} value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$0</span><span>$1M</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Income: <span className="text-blue-600 font-semibold">{fmt(annualIncome)}</span>
            </label>
            <input type="range" min={30000} max={500000} step={1000} value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$30k</span><span>$500k</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Expenses: <span className="text-blue-600 font-semibold">{fmt(annualExpenses)}</span>
            </label>
            <input type="range" min={20000} max={200000} step={1000} value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$20k</span><span>$200k</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Annual Return: <span className="text-blue-600 font-semibold">{expectedReturn}%</span>
            </label>
            <input type="range" min={3} max={12} step={0.1} value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3%</span><span>12%</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safe Withdrawal Rate</label>
            <div className="flex gap-2">
              {swrOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSwr(opt.value)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    swr === opt.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Your FI Number</p>
            <p className="text-4xl font-bold text-amber-600">{fmt(calc.fiNumber)}</p>
            <p className="text-sm text-gray-500 mt-1">25× your annual expenses at {swr}% SWR</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Years to FIRE</p>
              <p className="text-2xl font-bold text-gray-900">
                {calc.yearsToFire === 999 ? "55+" : calc.yearsToFire}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">FIRE Age</p>
              <p className="text-2xl font-bold text-gray-900">
                {calc.fireAge === 999 ? "75+" : calc.fireAge}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Monthly Passive Income</p>
              <p className="text-xl font-bold text-green-600">{fmt(calc.monthlyPassiveIncome)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Current Savings Rate</p>
              <p className="text-xl font-bold text-blue-600">{fmtPct(calc.savingsRate)}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-medium text-blue-700 mb-1">To FIRE in 10 Years</p>
            <p className="text-lg font-bold text-blue-800">
              Save {fmt(calc.monthlySavingsNeeded10yr)}/month
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Annual savings needed: {fmt(calc.monthlySavingsNeeded10yr * 12)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Path to Financial Independence</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={calc.chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: "Age", position: "insideBottom", offset: -5, fontSize: 12 }} />
            <YAxis tickFormatter={(v) => "$" + (v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [fmt(v), "Portfolio Balance"]} labelFormatter={(l) => `Age ${l}`} />
            <ReferenceLine y={calc.fiNumber} stroke="#f59e0b" strokeDasharray="6 3" strokeWidth={2} label={{ value: "FI Number", position: "insideTopRight", fill: "#d97706", fontSize: 11 }} />
            <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} fill="url(#balanceGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout
        title="FIRE Calculator"
        description="Calculate your Financial Independence number and years to early retirement."
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
