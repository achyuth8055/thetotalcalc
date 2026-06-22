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

export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(10000);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(5);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const calc = useMemo(() => {
    const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
    const gap = goalAmount - currentSavings;

    // Simulate month by month
    let balance = currentSavings;
    let months = 0;
    const chartData: { month: number; balance: number }[] = [{ month: 0, balance: Math.round(balance) }];

    if (balance < goalAmount) {
      if (monthlyContribution <= 0 && annualReturn <= 0) {
        months = Infinity;
      } else {
        while (balance < goalAmount && months < 600) {
          balance = balance * (1 + monthlyRate) + monthlyContribution;
          months++;
          if (months % 3 === 0 || balance >= goalAmount) {
            chartData.push({ month: months, balance: Math.round(Math.min(balance, goalAmount * 1.1)) });
          }
        }
        if (months >= 600) months = Infinity;
      }
    }

    const totalContributed = months === Infinity ? 0 : currentSavings + monthlyContribution * months;
    const interestEarned = months === Infinity ? 0 : Math.max(0, goalAmount - totalContributed);

    // Target date
    const now = new Date();
    const targetDate =
      months === Infinity
        ? "Never at current rate"
        : months === 0
        ? "Already reached"
        : new Date(now.getFullYear(), now.getMonth() + months, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const yearsMonths = months === Infinity
      ? "Never"
      : months === 0
      ? "Now"
      : `${Math.floor(months / 12)}y ${months % 12}m`;

    // Solve for monthly contribution needed for 1yr, 2yr, 5yr
    const solveMonthly = (targetMonths: number): number => {
      if (targetMonths <= 0) return 0;
      const fvFactor = Math.pow(1 + monthlyRate, targetMonths);
      const remaining = goalAmount - currentSavings * fvFactor;
      if (remaining <= 0) return 0;
      const annuityFactor = monthlyRate > 0 ? (fvFactor - 1) / monthlyRate : targetMonths;
      return remaining / annuityFactor;
    };

    const needed1yr = solveMonthly(12);
    const needed2yr = solveMonthly(24);
    const needed5yr = solveMonthly(60);

    return {
      months,
      yearsMonths,
      targetDate,
      totalContributed,
      interestEarned,
      gap,
      chartData,
      needed1yr,
      needed2yr,
      needed5yr,
    };
  }, [goalAmount, currentSavings, monthlyContribution, annualReturn]);

  const explanation = `
<h2>Saving with Purpose: How to Reach Any Financial Goal</h2>
<p>A savings goal calculator transforms abstract wishes into concrete plans. Whether you're saving for a vacation, a down payment, an emergency fund, or a once-in-a-lifetime experience, understanding the math behind your goal turns "I hope to save that someday" into a specific monthly number with a real deadline.</p>

<h3>SMART Goals Applied to Saving</h3>
<p>The SMART framework — Specific, Measurable, Achievable, Relevant, Time-bound — is as useful for financial goals as for career goals. "Save more money" is not a goal; "save $10,000 for a car down payment by December 2026 by setting aside $400/month" is a SMART goal. Specificity transforms intention into action. When you name your goal (literally labeling your savings account "Europe Trip 2026" rather than "Savings"), research shows you're significantly more likely to reach it — this "goal-tagging" effect has been documented in behavioral economics studies at multiple banks and fintech companies.</p>

<h3>High-Yield Savings Accounts vs CDs vs Money Market</h3>
<p>For short-term savings goals (under 3 years), the choice of account matters more than investment strategy. In 2024–25, high-yield savings accounts (HYSAs) at online banks (Marcus, Ally, SoFi, Discover) offer 4.5–5.25% APY — dramatically more than the 0.01–0.5% at traditional brick-and-mortar banks. Certificates of Deposit (CDs) lock your money for a fixed term (3 months to 5 years) but may offer slightly higher rates and protect against rate decreases. Money market accounts combine check-writing flexibility with competitive rates. For any goal with a timeline under 5 years, keeping funds in these safe, liquid vehicles is far more appropriate than investing in stocks — you cannot afford a 30% market drawdown the month before you need the money.</p>

<h3>Sinking Funds: The Budgeting Superpower</h3>
<p>A sinking fund is a dedicated savings bucket for a specific future expense — the opposite of being surprised by a large bill. Car maintenance, holiday gifts, annual insurance premiums, home repairs: these expenses are not emergencies, they're predictable, but they feel like emergencies because most people don't plan for them. Dividing each anticipated annual expense by 12 and transferring that amount monthly smooths your cash flow dramatically. Someone with $6,000 in annual irregular expenses who uses sinking funds effectively eliminates 12+ "financial emergencies" per year, each one that would otherwise trigger debt or stress.</p>

<h3>Pay Yourself First: The Automation Principle</h3>
<p>The most reliable savings strategy is to automate contributions before you have a chance to spend the money. Set up an automatic transfer to your savings account for the day after payday. This "pay yourself first" principle removes willpower from the equation entirely. Research by the Consumer Financial Protection Bureau shows that people who automate savings contribute 2–3× more consistently than those who manually transfer money at month-end from whatever is left. Many employers offer payroll direct deposit splitting — automatically sending a percentage of each paycheck to a separate savings account before you see it.</p>

<h3>Emergency Fund vs Opportunity Fund vs Goal Fund</h3>
<p>Not all savings serve the same purpose, and mixing them creates problems. An emergency fund (3–6 months of expenses) should be completely separate, liquid, and untouchable except for genuine emergencies — job loss, medical crisis, urgent home repair. An opportunity fund is discretionary cash for seizing unplanned but attractive opportunities — a business investment, a distressed property sale, or unexpected travel. Goal-specific funds target known future expenses on a defined timeline. Keeping these separate — ideally in different named accounts — prevents emergencies from derailing goals and goals from being raided for spending impulses.</p>

<h3>How Inflation Erodes Savings Goals</h3>
<p>If your goal is $20,000 for a down payment and you plan to reach it in 3 years, inflation of 3–4% means you actually need $21,800–$22,500 in today's purchasing power by the time you get there. For short-term goals this matters modestly; for 5–10 year goals, adjust your target upward by the expected inflation rate annually. Home prices and education costs have historically inflated faster than general CPI — if your goal is tied to one of these, use a higher inflation adjustment or plan to save more aggressively than the headline number suggests.</p>

<h3>The Psychology of Saving: Save More Tomorrow</h3>
<p>Behavioral economist Shlomo Benartzi's "Save More Tomorrow" (SMarT) program, implemented at hundreds of companies, found that pre-committing to increase savings rates with each future pay raise dramatically boosted retirement savings without requiring people to reduce current spending. Applied to personal goals: rather than cutting spending today, commit to saving 50% of your next raise or bonus. This exploits loss aversion and present bias in your favor — you never feel the pinch because the increase never hits your spending account. This approach has been shown to quadruple savings rates over 4 years compared to standard financial education alone.</p>

<h3>Zero-Based Budgeting and Purposeful Allocation</h3>
<p>Zero-based budgeting assigns every dollar of income a job — including savings. At the start of each month, allocate income to categories (housing, food, transport, entertainment, and crucially, each savings goal) until every dollar is "spent" on paper. This approach forces you to prioritize savings goals against discretionary spending rather than treating savings as an afterthought. Apps like YNAB (You Need A Budget) have built strong communities around this method and report that new users find an average of $600 in previously unnoticed spending in their first month — money that could be redirected to goals.</p>
`;

  const faqs = [
    {
      question: "How much should I save each month?",
      answer:
        "The classic guideline is the 50/30/20 rule: 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. For aggressive savers or those with high-priority goals (home down payment, emergency fund), 30–40% is more appropriate. The most important factor isn't the percentage — it's consistency. Saving 15% every month reliably outperforms sporadic saving at higher rates.",
    },
    {
      question: "What is the best account for a short-term savings goal?",
      answer:
        "For goals under 3–5 years, a high-yield savings account (HYSA) at an online bank is typically best. In 2024–25, these offer 4.5–5.25% APY with full FDIC insurance and no lock-up period. For goals with a fixed date more than 6 months away, a CD ladder (multiple CDs maturing at intervals) can slightly improve returns. Avoid investing in stocks for short-term goals — market volatility could force you to sell at a loss when you need the funds.",
    },
    {
      question: "Does compound interest really help short-term savings?",
      answer:
        "For very short timeframes (under 1–2 years), compound interest contributes minimally. On $5,000 earning 5% annually, one year earns $250 — meaningful, but your contributions drive the result far more than interest. Compound interest becomes transformative over 5+ years. This is why the main focus for short-term goals should be maximizing contribution amount and consistency, while for long-term goals (retirement, FIRE), maximizing investment return matters significantly more.",
    },
    {
      question: "Should I save toward my goal or pay off debt first?",
      answer:
        "Compare interest rates. If your debt charges 20% (credit card) and your savings earn 5%, every dollar put toward debt earns a guaranteed 15% net 'return' — far better than any savings vehicle. Prioritize high-interest debt (above ~7%) before aggressive goal saving. An exception: always maintain a small emergency fund (at least $1,000) even while paying debt, to avoid new debt when unexpected expenses arise. Low-interest debt (mortgage, subsidized student loans) can often be paid off at minimum while saving simultaneously.",
    },
    {
      question: "How do I stay motivated to save for a long-term goal?",
      answer:
        "Visual progress tracking is the most effective motivator — use a savings thermometer, a progress bar app, or a named account where you can watch the number grow. Automate contributions so the habit doesn't depend on willpower. Break large goals into milestones ($10k → $25k → $50k) and celebrate each checkpoint. Naming accounts specifically ('Europe 2026' vs 'Savings') has been shown to increase goal completion rates. Some people find sharing goals publicly or with an accountability partner increases follow-through.",
    },
  ];

  const relatedCalculators = [
    { label: "FIRE Calculator", href: "/calculators/finance/fire-calculator" },
    { label: "Retirement Calculator", href: "/calculators/finance/retirement-calculator" },
    { label: "Emergency Fund Calculator", href: "/calculators/finance/emergency-fund-calculator" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Savings Goal Calculator", href: "/calculators/finance/savings-goal-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Goal Calculator</h1>
          <p className="text-base text-gray-600">
            Find out when you'll reach your savings goal and how much you need to save monthly.
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
          <h2 className="text-lg font-semibold text-gray-900">Goal Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Amount: <span className="text-blue-600 font-semibold">{fmt(goalAmount)}</span>
            </label>
            <input type="range" min={1000} max={1000000} step={1000} value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$1k</span><span>$1M</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Savings: <span className="text-blue-600 font-semibold">{fmt(currentSavings)}</span>
            </label>
            <input type="range" min={0} max={500000} step={500} value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$0</span><span>$500k</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Contribution: <span className="text-blue-600 font-semibold">{fmt(monthlyContribution)}</span>
            </label>
            <input type="range" min={50} max={10000} step={50} value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$50</span><span>$10k</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Return: <span className="text-blue-600 font-semibold">{annualReturn}%</span>
            </label>
            <input type="range" min={0} max={15} step={0.1} value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>15%</span></div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Time to Reach Goal</p>
            <p className="text-4xl font-bold text-blue-700">
              {calc.months === Infinity ? "Never" : calc.months === 0 ? "Done!" : calc.yearsMonths}
            </p>
            <p className="text-sm text-gray-500 mt-1">Target: {calc.targetDate}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Contributed</p>
              <p className="text-xl font-bold text-gray-900">
                {calc.months === Infinity ? "—" : fmt(calc.totalContributed)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Interest Earned</p>
              <p className="text-xl font-bold text-green-600">
                {calc.months === Infinity ? "—" : fmt(calc.interestEarned)}
              </p>
            </div>
          </div>

          {/* Monthly needed comparison cards */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Monthly Savings Needed to Hit Goal In...</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "1 Year", value: calc.needed1yr },
                { label: "2 Years", value: calc.needed2yr },
                { label: "5 Years", value: calc.needed5yr },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border p-3 text-center ${
                    item.value <= monthlyContribution
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-sm font-bold ${item.value <= monthlyContribution ? "text-green-700" : "text-gray-800"}`}>
                    {fmt(item.value)}<span className="text-xs font-normal">/mo</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Savings Growth Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={calc.chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v >= 12 ? `${Math.floor(v / 12)}yr` : `${v}mo`} label={{ value: "Time", position: "insideBottom", offset: -5, fontSize: 12 }} />
            <YAxis tickFormatter={(v) => "$" + (v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [fmt(v), "Balance"]} labelFormatter={(l) => `Month ${l}`} />
            <ReferenceLine y={goalAmount} stroke="#22c55e" strokeDasharray="6 3" strokeWidth={2} label={{ value: "Goal", position: "insideTopRight", fill: "#16a34a", fontSize: 11 }} />
            <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} fill="url(#savingsGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <CalculatorLayout
        title="Savings Goal Calculator"
        description="Calculate how long it takes to reach any savings goal and how much you need to save monthly."
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
