import type { Metadata } from "next";
import ClassicCalculatorShell from "@/components/ClassicCalculatorShell";
import DebtPayoffWidget from "@/components/calculators/DebtPayoffWidget";

const PATH = "/calculators/finance/debt-payoff-calculator";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator - Snowball vs Avalanche Plan",
  description:
    "Plan how to pay off multiple debts faster. Compare the avalanche (highest APR first) and snowball (smallest balance first) methods and see your debt-free date and total interest.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { question: "What is the difference between avalanche and snowball?", answer: "The avalanche method targets the debt with the highest interest rate first, which minimizes total interest. The snowball method targets the smallest balance first, which clears individual debts faster for motivation. Both pay minimums on the rest." },
  { question: "How does extra payment help?", answer: "Any amount above the minimums is applied to your target debt. As each debt is cleared, its payment rolls onto the next one, so the payoff accelerates over time." },
  { question: "Why might my debts never be paid off?", answer: "If the total of your minimum and extra payments is less than the monthly interest, the balances grow instead of shrinking. The calculator flags this so you can raise your payment." },
];

export default function DebtPayoffPage() {
  return (
    <ClassicCalculatorShell
      title="Debt Payoff Calculator"
      description="Plan how to clear multiple debts faster. Compare the avalanche and snowball methods, add an extra monthly payment, and see your debt-free date and total interest."
      path={PATH}
      category="finance"
      parentLabel="Finance Calculators"
      parentHref="/finance-calculators"
      faqs={FAQS}
      sections={[
        {
          title: "What this calculator does",
          body: (
            <p>
              Enter your debts with their balances, interest rates, and minimum payments, choose a payoff strategy, and
              add any extra you can pay each month. The calculator simulates month by month to show how long until you
              are debt-free, the total interest, and the order your debts are cleared.
            </p>
          ),
        },
        {
          title: "Avalanche vs snowball",
          body: (
            <p>
              The avalanche method pays the highest-interest debt first and usually costs the least in total interest.
              The snowball method pays the smallest balance first, giving quick wins that can help you stay motivated.
              This tool lets you compare both instantly.
            </p>
          ),
        },
        {
          title: "How it works",
          body: (
            <p>
              Each month, interest is added to every balance, minimum payments are made on all debts, and any remaining
              budget is thrown at your target debt. When a debt is cleared, its payment rolls into the budget for the
              next debt, which is what makes the payoff speed up.
            </p>
          ),
        },
        {
          title: "Common mistakes to avoid",
          body: (
            <ul className="list-disc space-y-2 pl-6">
              <li>Paying only minimums - on high-APR debt, most of each payment goes to interest.</li>
              <li>Spreading extra payments across every debt instead of concentrating on one target.</li>
              <li>Taking on new debt while paying down the old, which resets your progress.</li>
            </ul>
          ),
        },
      ]}
    >
      <DebtPayoffWidget />
    </ClassicCalculatorShell>
  );
}
