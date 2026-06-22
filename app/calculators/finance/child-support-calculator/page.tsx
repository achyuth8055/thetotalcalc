"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

// Income Shares percentages by number of children
const incomeSharesPct: Record<number, number> = {
  1: 0.17, 2: 0.25, 3: 0.29, 4: 0.31, 5: 0.33, 6: 0.35,
};

type Custody = "sole" | "joint" | "primary60" | "custom";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
  "Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export default function ChildSupportCalculator() {
  const [state, setState] = useState("California");
  const [custody, setCustody] = useState<Custody>("sole");
  const [customPct, setCustomPct] = useState(70);
  const [nonCustodialIncome, setNonCustodialIncome] = useState(60000);
  const [custodialIncome, setCustodialIncome] = useState(45000);
  const [numChildren, setNumChildren] = useState(1);
  const [healthInsurance, setHealthInsurance] = useState(200);
  const [childcare, setChildcare] = useState(500);
  const [specialNeeds, setSpecialNeeds] = useState(0);

  const result = useMemo(() => {
    const combinedAnnual = nonCustodialIncome + custodialIncome;
    const combinedMonthly = combinedAnnual / 12;
    const n = Math.min(6, Math.max(1, numChildren));
    const pct = incomeSharesPct[n] ?? 0.35;

    // Basic support obligation (monthly)
    const basicObligation = combinedMonthly * pct;

    // Non-custodial parent's income share
    const nonCustodialShare = nonCustodialIncome / combinedAnnual;

    // Non-custodial's portion of basic + add-ons
    let baseSupport = basicObligation * nonCustodialShare;

    // Custody time adjustment
    let custodyFactor = 1.0;
    if (custody === "joint") custodyFactor = 0.5;
    else if (custody === "primary60") custodyFactor = 0.7;
    else if (custody === "custom") custodyFactor = customPct / 100;

    baseSupport = baseSupport * custodyFactor;

    // Add-ons: non-custodial's share of health ins & childcare
    const addOns = (healthInsurance + childcare + specialNeeds) * nonCustodialShare;

    const totalMonthly = Math.max(0, baseSupport + addOns);
    const totalAnnual = totalMonthly * 12;
    const pctOfIncome = (totalMonthly / (nonCustodialIncome / 12)) * 100;

    return {
      baseSupport,
      addOns,
      totalMonthly,
      totalAnnual,
      pctOfIncome,
      nonCustodialShare,
      basicObligation,
    };
  }, [state, custody, customPct, nonCustodialIncome, custodialIncome, numChildren, healthInsurance, childcare, specialNeeds]);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Finance Calculators", href: "/finance-calculators" },
        { label: "Child Support Calculator", href: "/calculators/finance/child-support-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Child Support Calculator</h1>
          <p className="text-base text-gray-600">Estimate monthly child support payments using the Income Shares Model. For general guidance only.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>⚖️ Legal Disclaimer:</strong> This calculator provides estimates for general informational purposes only. Child support laws vary significantly by state, and actual awards depend on many factors not captured here. Consult a licensed family law attorney in your state for accurate, case-specific advice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Enter Case Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {US_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Formulas vary significantly by state — this estimate uses the Income Shares Model (~41 states)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custody Arrangement</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["sole", "Sole Custody"],
                ["joint", "Joint 50/50"],
                ["primary60", "Primary (60/40)"],
                ["custom", "Custom %"],
              ] as [Custody, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setCustody(key)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${custody === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {custody === "custom" && (
              <div className="mt-2">
                <label className="text-xs text-gray-600">Non-custodial parent has child <strong>{customPct}%</strong> of time</label>
                <input type="range" min={10} max={90} value={customPct} onChange={(e) => setCustomPct(Number(e.target.value))} className="w-full accent-blue-600 mt-1" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Non-Custodial Parent Annual Income</label>
            <input type="number" value={nonCustodialIncome} onChange={(e) => setNonCustodialIncome(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custodial Parent Annual Income</label>
            <input type="number" value={custodialIncome} onChange={(e) => setCustodialIncome(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumChildren(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${numChildren === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Health Insurance Premium (children)</label>
            <input type="number" value={healthInsurance} onChange={(e) => setHealthInsurance(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Childcare Costs</label>
            <input type="number" value={childcare} onChange={(e) => setChildcare(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Special Needs Expenses</label>
            <input type="number" value={specialNeeds} onChange={(e) => setSpecialNeeds(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-blue-600 rounded-2xl shadow-sm p-6 text-white">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wide mb-1">Estimated Monthly Payment</p>
            <div className="text-5xl font-extrabold mb-1">{fmt(result.totalMonthly)}</div>
            <div className="text-blue-200 text-sm">per month / {fmt(result.totalAnnual)} per year</div>
            <div className="mt-3 text-blue-100 text-sm">{result.pctOfIncome.toFixed(1)}% of non-custodial parent's monthly income</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-600">Base child support</span>
                <span className="font-semibold">{fmt(result.baseSupport)}/mo</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-600">Health insurance share</span>
                <span className="font-semibold">{fmt(healthInsurance * result.nonCustodialShare)}/mo</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-600">Childcare share</span>
                <span className="font-semibold">{fmt(childcare * result.nonCustodialShare)}/mo</span>
              </div>
              {specialNeeds > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-600">Special needs share</span>
                  <span className="font-semibold">{fmt(specialNeeds * result.nonCustodialShare)}/mo</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-bold text-blue-700">
                <span>Total estimated</span>
                <span>{fmt(result.totalMonthly)}/mo</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-xs text-gray-500">
            Combined income share percentage used: {(incomeSharesPct[Math.min(6,numChildren)] * 100).toFixed(0)}% for {numChildren} child{numChildren > 1 ? "ren" : ""}. Non-custodial parent's income is {(result.nonCustodialShare * 100).toFixed(1)}% of combined income.
          </div>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>⚖️ Reminder:</strong> This calculator provides estimates for general informational purposes only. Child support laws vary significantly by state. Consult a licensed family law attorney in your state for accurate advice.
        </p>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">Understanding Child Support in the United States</h2>
            <p>
              Child support in the United States is determined at the state level, and the variation between states is substantial. However, since a 1988 federal mandate required all states to adopt numerical guidelines, the calculations have become more predictable — if not simpler. Today, two primary models dominate American family courts.
            </p>
            <p>
              The <strong>Income Shares Model</strong>, used by approximately 41 states, is based on the principle that a child should receive the same proportion of parental income they would have received if the parents had remained together. Both parents' incomes are combined, a base obligation is determined from that combined amount (using tables that increase proportionally with income), and each parent's share of that obligation is then set proportional to their individual income contribution. This calculator uses the Income Shares Model.
            </p>
            <p>
              The <strong>Percentage of Income Model</strong>, used by about nine states including Texas, Illinois, and Alaska, applies a flat percentage directly to the non-custodial parent's income. In Texas, for example, guidelines call for 20% of net monthly income for one child, 25% for two, rising to 40% for five or more. This model is simpler but criticizes for not considering the custodial parent's income at all.
            </p>
            <p>
              Both models treat certain expenses as "add-ons" rather than including them in the base calculation. Health insurance premiums specifically attributable to the children, work-related childcare costs, and extraordinary medical or educational expenses are typically divided between parents in proportion to their respective incomes, on top of the base support order.
            </p>
            <p>
              Child support is not permanent in the way alimony sometimes is. The most common termination trigger is emancipation — typically when the child turns 18 or graduates from high school, whichever occurs later. Some states (including New York and Massachusetts) extend support obligations through college. Marriage or military enlistment typically emancipates a child regardless of age.
            </p>
            <p>
              Modification of existing orders is available when circumstances change substantially. Most states use a threshold of roughly 15% or more change in either parent's income as the trigger for a modification hearing. Job loss, disability, significant raises, or a substantial change in the child's needs all qualify. Modification is not automatic — either party must petition the court.
            </p>
            <p>
              Tax treatment of child support is straightforward and often misunderstood: child support is <strong>not deductible</strong> for the paying parent, and it is <strong>not taxable income</strong> for the receiving parent. This is different from alimony for pre-2019 divorces, where deductibility was a significant planning consideration. Child support is considered a transfer that simply fulfills a parenting obligation, not a payment that shifts tax liability.
            </p>
            <p>
              Enforcement of child support orders is backed by powerful mechanisms. Wage garnishment is the most common tool — employers are ordered to withhold support directly from paychecks before any money reaches the parent. Non-compliant parents may face driver's license suspension, professional license revocation, passport denial, interception of federal tax refunds, and even contempt of court proceedings leading to incarceration. The federal Office of Child Support Services (OCSS) coordinates enforcement across state lines under the Uniform Interstate Family Support Act (UIFSA), so moving to another state does not extinguish obligations.
            </p>
            <p>
              The emotional complexity of child support negotiations is considerable. Studies consistently show that children fare best when financial conflict between parents is minimized and when both parents remain actively involved. Mediation — working with a trained neutral third party — frequently produces more durable and less adversarial outcomes than litigation, and costs far less in both money and emotional toll. Whatever the financial outcome, the child's wellbeing is the underlying purpose of the entire system.
            </p>
          </div>
        }
        faqs={[
          {
            question: "How is child support calculated?",
            answer: "Most states (approximately 41) use the Income Shares Model: both parents' incomes are combined, a basic obligation is derived as a percentage of that combined income, and each parent pays their proportional share. States like Texas and Illinois use the Percentage of Income Model, which applies a set percentage directly to the non-custodial parent's income only. Health insurance, childcare, and special expenses are typically added on proportionally."
          },
          {
            question: "Can child support be modified after it is set?",
            answer: "Yes. Either parent can petition the court to modify a child support order when there has been a substantial change in circumstances. Most states use a threshold of a 15% or more change in income, but significant changes in the child's needs, custody arrangements, or health costs also qualify. Modification is not automatic — a formal court process is required."
          },
          {
            question: "Is child support tax deductible for the paying parent?",
            answer: "No. Child support payments are not deductible by the paying parent and are not taxable income for the receiving parent. This is different from alimony for divorces finalized before January 1, 2019. Congress made this distinction because child support is viewed as fulfilling a parenting obligation, not as a tax-shifting transfer between adults."
          },
          {
            question: "What happens if a parent does not pay court-ordered child support?",
            answer: "Non-payment can trigger a range of enforcement mechanisms: wage garnishment (withholding directly from paychecks), interception of federal and state tax refunds, suspension of driver's and professional licenses, denial or revocation of a U.S. passport, reporting to credit bureaus, and contempt of court proceedings that can result in fines or incarceration. Interstate enforcement is coordinated through the Uniform Interstate Family Support Act."
          },
          {
            question: "When does child support end?",
            answer: "In most states, child support ends when the child turns 18 or graduates from high school, whichever is later. Some states extend obligations through college age. Emancipation events — marriage, military service, or legal emancipation — typically end support regardless of age. Parents can also agree voluntarily to extend support beyond statutory requirements."
          },
        ]}
        relatedCalculators={[
          { name: "Alimony Calculator", href: "/calculators/finance/alimony-calculator" },
          { name: "Income Tax Calculator", href: "/calculators/finance/income-tax-calculator" },
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
