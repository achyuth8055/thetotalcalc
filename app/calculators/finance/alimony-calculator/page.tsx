"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
  "Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

type WorkHistory = "full" | "leftForKids" | "partTime" | "neverWorked";

export default function AlimonyCalculator() {
  const [state, setState] = useState("California");
  const [marriageYears, setMarriageYears] = useState(10);
  const [payorIncome, setPayorIncome] = useState(100000);
  const [recipientIncome, setRecipientIncome] = useState(35000);
  const [hasChildren, setHasChildren] = useState(false);
  const [workHistory, setWorkHistory] = useState<WorkHistory>("leftForKids");

  const result = useMemo(() => {
    const payorMonthly = payorIncome / 12;
    const recipientMonthly = recipientIncome / 12;

    // 40% rule approximation
    const midEstimate = Math.max(0, 0.40 * (payorMonthly + recipientMonthly) - 0.50 * recipientMonthly);

    // Low/high range ±20%
    const lowEstimate = midEstimate * 0.80;
    const highEstimate = midEstimate * 1.20;

    // Work history adjustment factor
    const whFactor: Record<WorkHistory, number> = {
      full: 0.7,
      leftForKids: 1.2,
      partTime: 1.0,
      neverWorked: 1.3,
    };
    const adjustedMid = midEstimate * whFactor[workHistory];
    const adjustedLow = lowEstimate * whFactor[workHistory];
    const adjustedHigh = highEstimate * whFactor[workHistory];

    // Duration estimate
    let durationLow: string;
    let durationHigh: string;
    let durationType: string;

    if (marriageYears < 5) {
      const mo = Math.round(marriageYears * 12 * 0.5);
      durationLow = `${Math.max(6, mo - 6)} months`;
      durationHigh = `${mo + 6} months`;
      durationType = "Short-term rehabilitative";
    } else if (marriageYears < 10) {
      const mo = Math.round(marriageYears * 12 * 0.6);
      durationLow = `${mo - 12} months`;
      durationHigh = `${mo + 12} months`;
      durationType = "Rehabilitative";
    } else if (marriageYears < 20) {
      durationLow = "Indefinite";
      durationHigh = "Until self-supporting";
      durationType = "Open-ended rehabilitative or indefinite";
    } else {
      durationLow = "Potentially permanent";
      durationHigh = "Until remarriage / death";
      durationType = "Long-term or permanent";
    }

    const pctOfPayor = (adjustedMid / payorMonthly) * 100;

    return { adjustedLow, adjustedMid, adjustedHigh, durationLow, durationHigh, durationType, pctOfPayor };
  }, [payorIncome, recipientIncome, marriageYears, workHistory]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const workOptions: { key: WorkHistory; label: string }[] = [
    { key: "full", label: "Worked full-time throughout" },
    { key: "leftForKids", label: "Left workforce for children" },
    { key: "partTime", label: "Part-time only" },
    { key: "neverWorked", label: "Never worked / homemaker" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Finance Calculators", href: "/finance-calculators" },
        { label: "Alimony Calculator", href: "/calculators/finance/alimony-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alimony Calculator</h1>
          <p className="text-base text-gray-600">Estimate spousal support amounts using common judicial formulas. For general guidance only.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>⚖️ Legal Disclaimer:</strong> This calculator provides estimates for general informational purposes only. Alimony laws vary significantly by state and judges have broad discretion. Consult a licensed family law attorney in your state for accurate, case-specific advice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Enter Marriage Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {US_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Judges have wide discretion — state formulas are guidelines, not guarantees</p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-gray-700">Length of Marriage</label>
              <span className="font-bold text-blue-600">{marriageYears} {marriageYears === 1 ? "year" : "years"}</span>
            </div>
            <input
              type="range" min={1} max={50} value={marriageYears}
              onChange={(e) => setMarriageYears(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400"><span>1 yr</span><span>50 yrs</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paying Spouse Annual Income</label>
            <input type="number" value={payorIncome} onChange={(e) => setPayorIncome(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receiving Spouse Annual Income</label>
            <input type="number" value={recipientIncome} onChange={(e) => setRecipientIncome(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minor Children from This Marriage?</label>
            <div className="flex gap-2">
              <button onClick={() => setHasChildren(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${hasChildren ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                Yes
              </button>
              <button onClick={() => setHasChildren(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${!hasChildren ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Receiving Spouse's Work History</label>
            <div className="space-y-2">
              {workOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setWorkHistory(opt.key)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${workHistory === opt.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-blue-600 rounded-2xl shadow-sm p-6 text-white">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wide mb-1">Estimated Monthly Alimony Range</p>
            <div className="text-4xl font-extrabold mb-1">
              {fmt(result.adjustedLow)} – {fmt(result.adjustedHigh)}
            </div>
            <div className="text-blue-200 text-sm mb-2">Mid estimate: <strong>{fmt(result.adjustedMid)}/month</strong></div>
            <div className="text-blue-100 text-sm">{result.pctOfPayor.toFixed(1)}% of paying spouse's monthly income</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estimated Duration</h3>
            <div className="p-3 bg-gray-50 rounded-xl mb-3">
              <div className="font-bold text-gray-800">{result.durationLow} – {result.durationHigh}</div>
              <div className="text-xs text-gray-500 mt-1">{result.durationType}</div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Under 5 years: ~50% of marriage length</p>
              <p>• 5–10 years: ~60% of marriage length</p>
              <p>• 10–20 years: indefinite / open-ended</p>
              <p>• 20+ years: potentially permanent</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
            <strong>TCJA 2017 Tax Note:</strong> For divorces finalized on or after January 1, 2019, alimony is <em>no longer deductible</em> by the payor and is <em>no longer taxable income</em> to the recipient. This changed dramatically under the Tax Cuts and Jobs Act. For divorces before that date, the old rules still apply.
          </div>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>⚖️ Reminder:</strong> This calculator provides estimates for general informational purposes only. Alimony laws vary significantly by state. Consult a licensed family law attorney in your state for accurate advice.
        </p>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">Understanding Alimony (Spousal Support)</h2>
            <p>
              Alimony — also called spousal support or spousal maintenance depending on the jurisdiction — is a payment made from one spouse to another following divorce or separation. Unlike child support, which has federally mandated numerical guidelines, alimony in the United States remains largely at the discretion of individual judges, guided by state statutes that enumerate factors to consider rather than formulas to follow. This makes alimony inherently less predictable and more susceptible to courtroom advocacy.
            </p>
            <p>
              American courts recognize several distinct types of alimony, each serving a different purpose. <strong>Temporary alimony</strong> (often called <em>pendente lite</em>, Latin for "while the litigation is pending") is awarded during the divorce proceedings themselves to maintain the financial status quo until a final order is entered. <strong>Rehabilitative alimony</strong> is the most common modern type: it is time-limited and intended to help the receiving spouse gain education, training, or work experience to become self-sufficient. <strong>Reimbursement alimony</strong> compensates a spouse who sacrificed career development to support the other's professional advancement — for example, working to put a spouse through medical school. <strong>Permanent alimony</strong> was historically common but has fallen out of favor; today it is typically reserved for long marriages with large income disparities where the receiving spouse is elderly or permanently disabled.
            </p>
            <p>
              The single most consequential change to alimony in decades was enacted by the Tax Cuts and Jobs Act of 2017 (TCJA), effective for divorce agreements executed on or after <strong>January 1, 2019</strong>. Before this date, alimony was deductible by the paying spouse and taxable income for the recipient — a structure that incentivized higher awards because the net cost to the payor was reduced by their marginal tax rate. After TCJA, alimony is neither deductible nor taxable. This eliminated a powerful negotiating dynamic and, many family law attorneys argue, has reduced the size of settlements because payors are no longer receiving a tax offset. For divorces finalized before January 1, 2019, the old rules still apply — the TCJA change is not retroactive unless the parties modify their agreement to explicitly opt into the new treatment.
            </p>
            <p>
              Judges consider an array of factors when setting alimony. Common statutory factors include the length of the marriage, the standard of living established during the marriage, each spouse's age and physical health, the earning capacity and employability of each party, contributions to the marriage including homemaking and child-rearing, whether one spouse interrupted career development for the benefit of the family, and the existence of other financial obligations including child support. Courts do not look favorably on trying to calculate a formula from these factors — a skilled advocate presents them as a narrative of relative need and ability to pay.
            </p>
            <p>
              Most alimony orders include provisions for modification or termination. Termination is automatic in virtually every state upon the recipient's remarriage. Many states also terminate support upon cohabitation with a romantic partner, though proving cohabitation has spawned considerable litigation. The Uniform Marriage and Divorce Act, adopted in various forms by many states, permits modification whenever there is a substantial and continuing change in circumstances for either party.
            </p>
            <p>
              Prenuptial and postnuptial agreements can dramatically alter alimony outcomes — and are increasingly common. Courts enforce prenuptial agreements that waive alimony when they meet procedural requirements (voluntary signing, full financial disclosure, independent legal counsel for each party, reasonable time before the wedding). Some states will not enforce a complete alimony waiver if it would leave a spouse in need of public assistance.
            </p>
            <p>
              The trend in family law over the past two decades has been strongly away from permanent alimony and toward shorter-term rehabilitative support, reflecting changing assumptions about gender roles and labor force participation. Massachusetts reformed its alimony statute in 2012 to impose specific durational caps based on marriage length. Tennessee enacted a similar formula-based approach. The states with the most judicial discretion — including California, New York, and Florida — continue to produce the most unpredictable outcomes, making legal counsel even more valuable in those jurisdictions.
            </p>
            <p>
              Mediation — working with a trained neutral facilitator outside of court — produces settlements in the majority of contested divorces that go through the process. Mediated agreements tend to be honored more consistently than court-imposed orders, simply because both parties had a hand in crafting them. The financial savings compared to contested litigation can be substantial, and the emotional toll on families — particularly when children are involved — is measurably lower.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Is alimony tax deductible for the paying spouse?",
            answer: "Only for divorces finalized before January 1, 2019. The Tax Cuts and Jobs Act of 2017 (TCJA) eliminated the alimony tax deduction for all divorce agreements executed on or after that date. Under the new rules, the paying spouse gets no deduction and the receiving spouse pays no income tax on alimony received. For pre-2019 divorces, the old rules still apply unless the parties explicitly opt into the new treatment through a modification."
          },
          {
            question: "How long does alimony last?",
            answer: "Duration depends heavily on the length of the marriage and the state. Common guidelines suggest short marriages (under 5 years) might result in support lasting roughly 50% of the marriage duration. Marriages of 5–10 years might yield 60% of the marriage duration. Marriages over 10–15 years often result in open-ended or indefinite support. Marriages of 20 or more years can lead to permanent alimony in some states, though this is increasingly rare. Many states have enacted durational caps."
          },
          {
            question: "Can alimony be modified after it is ordered?",
            answer: "Yes, in most cases. Either party can petition the court to modify alimony upon a substantial change in circumstances — such as a significant change in income for either spouse, the recipient becoming self-supporting, retirement, disability, or remarriage of the recipient. Most agreements also include automatic termination clauses upon the recipient's remarriage or, in many states, cohabitation with a romantic partner."
          },
          {
            question: "What is the difference between alimony and child support?",
            answer: "Alimony is paid from one spouse to the other — it is spousal support intended to address income disparity between the adults. Child support is paid for the benefit of the children, calculated separately based on parental incomes and custody time. They are independent obligations: a parent can owe both simultaneously. Child support has federal guidelines requiring states to maintain numerical formulas; alimony has no such federal mandate and varies far more by state and judge."
          },
          {
            question: "Does living with a new partner affect alimony?",
            answer: "Very often yes. Most states either automatically terminate or allow courts to reduce alimony when the recipient cohabitates with a romantic partner, on the theory that shared living expenses reduce financial need. Cohabitation clauses are standard in most settlement agreements. Proving cohabitation (as distinct from occasional overnight stays) has generated substantial litigation, and standards vary by state. The clearest termination trigger remains remarriage, which automatically ends alimony in nearly all states."
          },
        ]}
        relatedCalculators={[
          { name: "Child Support Calculator", href: "/calculators/finance/child-support-calculator" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
