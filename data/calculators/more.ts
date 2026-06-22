// Additional general-purpose calculators built on the rules engine.
// Region is set to "US" only for currency formatting (USD); the math is universal.

import type { CalculatorDefinition } from "@/lib/engine/types";

// ---------------------------------------------------------------------------
// Loan EMI
// ---------------------------------------------------------------------------
export const loanEmi: CalculatorDefinition = {
  id: "loan-emi",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "finance",
  slug: "loan-emi",
  title: "Loan EMI Calculator",
  description:
    "Calculate the monthly payment (EMI), total interest, and total amount payable for any loan amount, interest rate, and term.",
  inputs: [
    { name: "principal", label: "Loan amount", type: "currency", required: true, default: 200000, min: 0, max: 5000000, step: 1000 },
    { name: "annualRate", label: "Interest rate (% per year)", type: "number", required: true, default: 8, min: 0, max: 40, step: 0.1 },
    { name: "years", label: "Loan term (years)", type: "number", required: true, default: 5, min: 1, max: 40, step: 1 },
  ],
  derived: [
    { name: "r", expr: { op: "/", args: [{ var: "annualRate" }, 1200] } },
    { name: "n", expr: { op: "*", args: [{ var: "years" }, 12] } },
    { name: "growth", expr: { op: "pow", args: [{ op: "+", args: [1, { var: "r" }] }, { var: "n" }] } },
    {
      name: "emi",
      expr: {
        if: { cmp: ">", left: { var: "r" }, right: 0 },
        then: {
          op: "/",
          args: [
            { op: "*", args: [{ var: "principal" }, { var: "r" }, { var: "growth" }] },
            { op: "-", args: [{ var: "growth" }, 1] },
          ],
        },
        else: { op: "/", args: [{ var: "principal" }, { var: "n" }] },
      },
    },
    { name: "totalPayable", expr: { op: "*", args: [{ var: "emi" }, { var: "n" }] } },
    { name: "totalInterest", expr: { op: "-", args: [{ var: "totalPayable" }, { var: "principal" }] } },
  ],
  outputs: [
    { name: "emi", label: "Monthly payment (EMI)", expr: { var: "emi" }, format: "currency", primary: true },
    { name: "totalInterest", label: "Total interest", expr: { var: "totalInterest" }, format: "currency" },
    { name: "totalPayable", label: "Total amount payable", expr: { var: "totalPayable" }, format: "currency" },
  ],
  sources: [{ title: "Amortization formula (standard)", url: "https://en.wikipedia.org/wiki/Amortization_calculator", publisher: "Reference", retrieved: "2026-06-09" }],
  disclaimer: "Estimate only. Actual payments depend on your lender's terms, fees, and compounding method.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-09",
  faqs: [
    { question: "What is EMI?", answer: "An Equated Monthly Installment (EMI) is the fixed payment you make each month to repay a loan, covering both interest and principal." },
  ],
  tests: [
    // 200000 @ 8% for 5y -> EMI ~ 4055.99
    { name: "200k @ 8% 5y", inputs: { principal: 200000, annualRate: 8, years: 5 }, expect: { emi: 4055 } },
    { name: "0% interest", inputs: { principal: 12000, annualRate: 0, years: 1 }, expect: { emi: 1000, totalInterest: 0 } },
  ],
};

// ---------------------------------------------------------------------------
// Credit Card Payoff & APR
// ---------------------------------------------------------------------------
export const creditCardPayoff: CalculatorDefinition = {
  id: "credit-card-payoff",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "finance",
  slug: "credit-card-payoff",
  title: "Credit Card Payoff & APR Calculator",
  description:
    "See how many months it takes to clear a credit card balance at your APR, the total interest you'll pay, and your monthly interest charge.",
  inputs: [
    { name: "balance", label: "Current balance", type: "currency", required: true, default: 5000, min: 0, max: 100000, step: 100 },
    { name: "apr", label: "APR (% per year)", type: "number", required: true, default: 22, min: 0, max: 40, step: 0.1 },
    { name: "monthlyPayment", label: "Monthly payment", type: "currency", required: true, default: 200, min: 0, max: 20000, step: 10 },
  ],
  derived: [
    { name: "r", expr: { op: "/", args: [{ var: "apr" }, 1200] } },
    { name: "monthlyInterest", expr: { op: "*", args: [{ var: "balance" }, { var: "r" }] } },
    { name: "ratio", expr: { op: "-", args: [1, { op: "/", args: [{ op: "*", args: [{ var: "balance" }, { var: "r" }] }, { var: "monthlyPayment" }] }] } },
    {
      name: "months",
      expr: {
        if: { cmp: "==", left: { var: "r" }, right: 0 },
        then: { op: "ceil", args: [{ op: "/", args: [{ var: "balance" }, { var: "monthlyPayment" }] }] },
        else: {
          if: { cmp: ">", left: { var: "ratio" }, right: 0 },
          then: {
            op: "ceil",
            args: [
              {
                op: "/",
                args: [
                  { op: "*", args: [-1, { op: "ln", args: [{ var: "ratio" }] }] },
                  { op: "ln", args: [{ op: "+", args: [1, { var: "r" }] }] },
                ],
              },
            ],
          },
          else: 0,
        },
      },
    },
    { name: "totalInterest", expr: { op: "max", args: [0, { op: "-", args: [{ op: "*", args: [{ var: "months" }, { var: "monthlyPayment" }] }, { var: "balance" }] }] } },
  ],
  outputs: [
    { name: "months", label: "Months to pay off", expr: { var: "months" }, format: "number", primary: true, note: "If 0, your monthly payment doesn't cover the interest - increase it to make progress." },
    { name: "totalInterest", label: "Estimated total interest", expr: { var: "totalInterest" }, format: "currency" },
    { name: "monthlyInterest", label: "This month's interest charge", expr: { var: "monthlyInterest" }, format: "currency" },
  ],
  sources: [{ title: "Credit card interest (CFPB)", url: "https://www.consumerfinance.gov/ask-cfpb/how-is-credit-card-interest-calculated-en-44/", publisher: "Consumer Financial Protection Bureau", retrieved: "2026-06-09" }],
  disclaimer: "Estimate only. Assumes a fixed APR and payment, and that no new purchases are added. Actual issuer calculations may vary.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-09",
  tests: [
    { name: "0% APR", inputs: { balance: 1200, apr: 0, monthlyPayment: 100 }, expect: { months: 12, totalInterest: 0 } },
    { name: "payment below interest", inputs: { balance: 5000, apr: 24, monthlyPayment: 50 }, expect: { months: 0 } },
  ],
};

// ---------------------------------------------------------------------------
// Compound Interest
// ---------------------------------------------------------------------------
export const compoundInterest: CalculatorDefinition = {
  id: "compound-interest",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "finance",
  slug: "compound-interest",
  title: "Compound Interest Calculator",
  description:
    "Project how your savings grow with compound interest and optional monthly contributions over time.",
  inputs: [
    { name: "principal", label: "Initial amount", type: "currency", required: true, default: 10000, min: 0, max: 10000000, step: 500 },
    { name: "annualRate", label: "Annual return (%)", type: "number", required: true, default: 7, min: 0, max: 30, step: 0.1 },
    { name: "years", label: "Years", type: "number", required: true, default: 10, min: 1, max: 60, step: 1 },
    { name: "monthlyContribution", label: "Monthly contribution", type: "currency", default: 0, min: 0, max: 100000, step: 50 },
  ],
  derived: [
    { name: "i", expr: { op: "/", args: [{ var: "annualRate" }, 1200] } },
    { name: "n", expr: { op: "*", args: [{ var: "years" }, 12] } },
    { name: "growth", expr: { op: "pow", args: [{ op: "+", args: [1, { var: "i" }] }, { var: "n" }] } },
    { name: "fvPrincipal", expr: { op: "*", args: [{ var: "principal" }, { var: "growth" }] } },
    {
      name: "fvContrib",
      expr: {
        if: { cmp: ">", left: { var: "i" }, right: 0 },
        then: { op: "*", args: [{ var: "monthlyContribution" }, { op: "/", args: [{ op: "-", args: [{ var: "growth" }, 1] }, { var: "i" }] }] },
        else: { op: "*", args: [{ var: "monthlyContribution" }, { var: "n" }] },
      },
    },
    { name: "futureValue", expr: { op: "+", args: [{ var: "fvPrincipal" }, { var: "fvContrib" }] } },
    { name: "totalContributions", expr: { op: "+", args: [{ var: "principal" }, { op: "*", args: [{ var: "monthlyContribution" }, { var: "n" }] }] } },
    { name: "totalInterest", expr: { op: "-", args: [{ var: "futureValue" }, { var: "totalContributions" }] } },
  ],
  outputs: [
    { name: "futureValue", label: "Future value", expr: { var: "futureValue" }, format: "currency", primary: true },
    { name: "totalContributions", label: "Total contributions", expr: { var: "totalContributions" }, format: "currency" },
    { name: "totalInterest", label: "Interest earned", expr: { var: "totalInterest" }, format: "currency" },
  ],
  sources: [{ title: "Compound interest (Investor.gov)", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator", publisher: "U.S. SEC", retrieved: "2026-06-09" }],
  disclaimer: "Estimate only. Investment returns are not guaranteed and may be higher or lower than assumed.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-09",
  tests: [
    // 10000 @ 0% 10y, no contrib -> 10000
    { name: "0% no contrib", inputs: { principal: 10000, annualRate: 0, years: 10, monthlyContribution: 0 }, expect: { futureValue: 10000, totalInterest: 0 } },
  ],
};

// ---------------------------------------------------------------------------
// US Federal Income Tax (2025)
// ---------------------------------------------------------------------------
export const usIncomeTax2025: CalculatorDefinition = {
  id: "us-income-tax",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "tax-credits",
  slug: "us-income-tax",
  title: "US Federal Income Tax Calculator (2025)",
  description:
    "Estimate your 2025 federal income tax and take-home pay using the standard deduction and the 2025 tax brackets. Federal income tax only - excludes FICA, state tax, and credits.",
  taxYear: 2025,
  inputs: [
    {
      name: "filingStatus", label: "Filing status", type: "select", required: true, default: "single",
      options: [
        { value: "single", label: "Single" },
        { value: "mfj", label: "Married filing jointly" },
      ],
    },
    { name: "gross", label: "Gross annual income", type: "currency", required: true, default: 60000, min: 0, max: 2000000, step: 1000 },
  ],
  tables: {
    stdDeduction: { single: 15750, mfj: 31500 },
    cut1: { single: 11925, mfj: 23850 },
    cut2: { single: 48475, mfj: 96950 },
    cut3: { single: 103350, mfj: 206700 },
    cut4: { single: 197300, mfj: 394600 },
    cut5: { single: 250525, mfj: 501050 },
    cut6: { single: 626350, mfj: 751600 },
  },
  derived: [
    { name: "stdDed", expr: { lookup: "stdDeduction", key: { var: "filingStatus" } } },
    { name: "c1", expr: { lookup: "cut1", key: { var: "filingStatus" } } },
    { name: "c2", expr: { lookup: "cut2", key: { var: "filingStatus" } } },
    { name: "c3", expr: { lookup: "cut3", key: { var: "filingStatus" } } },
    { name: "c4", expr: { lookup: "cut4", key: { var: "filingStatus" } } },
    { name: "c5", expr: { lookup: "cut5", key: { var: "filingStatus" } } },
    { name: "c6", expr: { lookup: "cut6", key: { var: "filingStatus" } } },
    { name: "taxable", expr: { op: "max", args: [0, { op: "-", args: [{ var: "gross" }, { var: "stdDed" }] }] } },
    {
      name: "tax",
      expr: {
        op: "+",
        args: [
          { op: "*", args: [0.1, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c1" }] }, 0] }] }] },
          { op: "*", args: [0.12, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c2" }] }, { var: "c1" }] }] }] },
          { op: "*", args: [0.22, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c3" }] }, { var: "c2" }] }] }] },
          { op: "*", args: [0.24, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c4" }] }, { var: "c3" }] }] }] },
          { op: "*", args: [0.32, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c5" }] }, { var: "c4" }] }] }] },
          { op: "*", args: [0.35, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c6" }] }, { var: "c5" }] }] }] },
          { op: "*", args: [0.37, { op: "max", args: [0, { op: "-", args: [{ var: "taxable" }, { var: "c6" }] }] }] },
        ],
      },
    },
    { name: "takeHome", expr: { op: "-", args: [{ var: "gross" }, { var: "tax" }] } },
    { name: "effectiveRate", expr: { if: { cmp: ">", left: { var: "gross" }, right: 0 }, then: { op: "*", args: [{ op: "/", args: [{ var: "tax" }, { var: "gross" }] }, 100] }, else: 0 } },
  ],
  outputs: [
    { name: "tax", label: "Estimated federal income tax", expr: { var: "tax" }, format: "currency", primary: true, note: "Federal income tax only - excludes FICA (Social Security/Medicare), state tax, and any credits." },
    { name: "takeHome", label: "After federal income tax", expr: { var: "takeHome" }, format: "currency" },
    { name: "taxable", label: "Taxable income (after standard deduction)", expr: { var: "taxable" }, format: "currency" },
    { name: "effectiveRate", label: "Effective federal rate", expr: { var: "effectiveRate" }, format: "percent" },
  ],
  sources: [
    { title: "Federal income tax rates and brackets", url: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets", publisher: "Internal Revenue Service", retrieved: "2026-06-09" },
  ],
  disclaimer: "Estimate only - federal income tax with the standard deduction. Excludes FICA, state/local tax, itemized deductions, and credits. Not tax advice.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  faqs: [
    { question: "What's included?", answer: "This estimates federal income tax using the 2025 standard deduction and tax brackets. It does not include Social Security/Medicare (FICA) taxes, state or local income tax, itemized deductions, or tax credits." },
  ],
  tests: [
    // single 60000: taxable 44250; tax = .10*11925 + .12*(44250-11925) = 1192.5 + 3879 = 5071.5
    { name: "single 60k", inputs: { filingStatus: "single", gross: 60000 }, expect: { taxable: 44250, tax: 5071.5 } },
    // mfj 100000: taxable 68500; tax = .10*23850 + .12*(68500-23850) = 2385 + 5358 = 7743
    { name: "mfj 100k", inputs: { filingStatus: "mfj", gross: 100000 }, expect: { taxable: 68500, tax: 7743 } },
  ],
};

// ---------------------------------------------------------------------------
// Ohm's Law (engineering)
// ---------------------------------------------------------------------------
export const ohmsLaw: CalculatorDefinition = {
  id: "ohms-law",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "engineering",
  slug: "ohms-law",
  title: "Ohm's Law Calculator",
  description:
    "Solve for voltage, current, resistance, or power from any two known values using V = I × R and P = V × I.",
  inputs: [
    {
      name: "solveFor", label: "Solve for", type: "select", required: true, default: "V",
      options: [
        { value: "V", label: "Voltage (V)" },
        { value: "I", label: "Current (A)" },
        { value: "R", label: "Resistance (Ω)" },
      ],
    },
    { name: "current", label: "Current (Amps)", type: "number", default: 2, min: 0, max: 100000, step: 0.1, showIf: { cmp: "!=", left: { var: "solveFor" }, right: "I" } },
    { name: "resistance", label: "Resistance (Ohms)", type: "number", default: 10, min: 0, max: 1000000, step: 0.1, showIf: { cmp: "!=", left: { var: "solveFor" }, right: "R" } },
    { name: "voltage", label: "Voltage (Volts)", type: "number", default: 12, min: 0, max: 1000000, step: 0.1, showIf: { cmp: "!=", left: { var: "solveFor" }, right: "V" } },
  ],
  derived: [
    { name: "V", expr: { if: { cmp: "==", left: { var: "solveFor" }, right: "V" }, then: { op: "*", args: [{ var: "current" }, { var: "resistance" }] }, else: { var: "voltage" } } },
    { name: "I", expr: { if: { cmp: "==", left: { var: "solveFor" }, right: "I" }, then: { op: "/", args: [{ var: "voltage" }, { var: "resistance" }] }, else: { var: "current" } } },
    { name: "R", expr: { if: { cmp: "==", left: { var: "solveFor" }, right: "R" }, then: { op: "/", args: [{ var: "voltage" }, { var: "current" }] }, else: { var: "resistance" } } },
    { name: "P", expr: { op: "*", args: [{ var: "V" }, { var: "I" }] } },
  ],
  outputs: [
    { name: "V", label: "Voltage (V)", expr: { var: "V" }, format: "number", primary: true },
    { name: "I", label: "Current (A)", expr: { var: "I" }, format: "number" },
    { name: "R", label: "Resistance (Ω)", expr: { var: "R" }, format: "number" },
    { name: "P", label: "Power (W)", expr: { var: "P" }, format: "number" },
  ],
  sources: [{ title: "Ohm's law", url: "https://en.wikipedia.org/wiki/Ohm%27s_law", publisher: "Reference", retrieved: "2026-06-09" }],
  disclaimer: "For educational use. Real circuits involve tolerances, temperature effects, and AC considerations not modeled here.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-09",
  tests: [
    { name: "V from I,R", inputs: { solveFor: "V", current: 2, resistance: 10 }, expect: { V: 20, P: 40 } },
    { name: "I from V,R", inputs: { solveFor: "I", voltage: 12, resistance: 4 }, expect: { I: 3, P: 36 } },
  ],
};

export const MORE_CALCULATORS: CalculatorDefinition[] = [
  loanEmi,
  creditCardPayoff,
  compoundInterest,
  usIncomeTax2025,
  ohmsLaw,
];
