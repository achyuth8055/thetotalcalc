import type { Metadata } from "next";
import ClassicCalculatorShell from "@/components/ClassicCalculatorShell";
import AffordabilityWidget from "@/components/calculators/AffordabilityWidget";

const PATH = "/calculators/finance/mortgage-affordability-calculator";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator - How Much House Can I Afford?",
  description:
    "Estimate the home price you can afford from your income, debts, down payment, and interest rate, using a debt-to-income limit lenders commonly apply.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { question: "How much house can I afford?", answer: "A common rule is that your total monthly debts, including the new mortgage, should stay within about 36% of your gross monthly income (the back-end debt-to-income ratio). This calculator works backwards from that limit to an affordable price." },
  { question: "What is debt-to-income (DTI)?", answer: "DTI is the share of your gross monthly income that goes to debt payments. Lenders often cap the back-end ratio around 36%, though some allow 43-45% depending on the loan and your profile." },
  { question: "Does a bigger down payment let me afford more?", answer: "Yes. The payment-based limit caps your loan amount, and your down payment is added on top, so more cash down raises the price you can buy." },
];

export default function AffordabilityPage() {
  return (
    <ClassicCalculatorShell
      title="Mortgage Affordability Calculator"
      description="See how much house you can afford based on your income, existing debts, down payment, and interest rate, using a debt-to-income limit lenders commonly apply."
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
              This tool estimates the home price you can afford. It starts from a debt-to-income limit, subtracts your
              existing debts and estimated tax and insurance, and converts the remaining budget into a maximum loan and
              purchase price.
            </p>
          ),
        },
        {
          title: "Who it is for",
          body: <p>Anyone planning to buy a home who wants a realistic target price before shopping or getting pre-approved.</p>,
        },
        {
          title: "How it works",
          body: (
            <p>
              Your maximum total monthly debt is your gross monthly income times the debt-to-income limit (36% by
              default). Subtracting your current debts and monthly tax and insurance leaves the budget for principal and
              interest, which is converted to a loan amount using the rate and term. Adding your down payment gives the
              affordable price.
            </p>
          ),
        },
        {
          title: "Common mistakes to avoid",
          body: (
            <ul className="list-disc space-y-2 pl-6">
              <li>Borrowing to the maximum the calculator allows, leaving no room for savings or emergencies.</li>
              <li>Forgetting property tax, insurance, HOA fees, and maintenance, which all reduce what you can comfortably spend.</li>
              <li>Ignoring closing costs, which are separate from the down payment.</li>
            </ul>
          ),
        },
      ]}
    >
      <AffordabilityWidget />
    </ClassicCalculatorShell>
  );
}
