// US paycheck calculator (2025). Estimates take-home pay per pay period using
// federal income tax (standard deduction + brackets), FICA, pay frequency, and
// pre-tax deductions. Excludes state/local tax. A per-period companion to the
// annual US Salary After Tax calculator.
import type { CalculatorDefinition, Expr } from "@/lib/engine/types";
import { progressive, NO_CAP } from "@/lib/engine/bands";

const fedSingle = progressive("fedTaxable", [
  [0.1, 0, 11925],
  [0.12, 11925, 48475],
  [0.22, 48475, 103350],
  [0.24, 103350, 197300],
  [0.32, 197300, 250525],
  [0.35, 250525, 626350],
  [0.37, 626350, NO_CAP],
]);

const fedMfj = progressive("fedTaxable", [
  [0.1, 0, 23850],
  [0.12, 23850, 96950],
  [0.22, 96950, 206700],
  [0.24, 206700, 394600],
  [0.32, 394600, 501050],
  [0.35, 501050, 751600],
  [0.37, 751600, NO_CAP],
]);

const federalTaxExpr: Expr = {
  if: { cmp: "==", left: { var: "filingStatus" }, right: "mfj" },
  then: fedMfj,
  else: fedSingle,
};

export const usPaycheck: CalculatorDefinition = {
  id: "us-paycheck",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "salary",
  slug: "us-paycheck-calculator",
  title: "US Paycheck Calculator (2025)",
  description:
    "Estimate your take-home pay per paycheck after federal income tax, Social Security, and Medicare, accounting for pay frequency and pre-tax deductions. Excludes state and local tax.",
  taxYear: 2025,
  inputs: [
    { name: "gross", label: "Gross annual salary", type: "currency", required: true, default: 60000, min: 0, max: 2000000, step: 1000 },
    { name: "filingStatus", label: "Filing status", type: "select", required: true, default: "single", options: [{ value: "single", label: "Single" }, { value: "mfj", label: "Married filing jointly" }] },
    {
      name: "payFrequency", label: "Pay frequency", type: "select", required: true, default: "biweekly",
      options: [
        { value: "weekly", label: "Weekly (52/yr)" },
        { value: "biweekly", label: "Bi-weekly (26/yr)" },
        { value: "semimonthly", label: "Semi-monthly (24/yr)" },
        { value: "monthly", label: "Monthly (12/yr)" },
      ],
    },
    { name: "pretax", label: "Annual pre-tax deductions", type: "currency", default: 0, min: 0, max: 200000, step: 500, help: "401(k) contributions and pre-tax health premiums. These reduce taxable income for income tax." },
  ],
  tables: {
    stdDeduction: { single: 15750, mfj: 31500 },
    payPeriods: { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 },
  },
  derived: [
    { name: "stdDed", expr: { lookup: "stdDeduction", key: { var: "filingStatus" } } },
    { name: "periods", expr: { lookup: "payPeriods", key: { var: "payFrequency" } } },
    { name: "fedTaxable", expr: { op: "max", args: [0, { op: "-", args: [{ var: "gross" }, { var: "pretax" }, { var: "stdDed" }] }] } },
    { name: "federalTax", expr: federalTaxExpr },
    { name: "ss", expr: { op: "*", args: [{ op: "min", args: [{ var: "gross" }, 176100] }, 0.062] } },
    { name: "medicare", expr: { op: "*", args: [{ var: "gross" }, 0.0145] } },
    { name: "addlThreshold", expr: { if: { cmp: "==", left: { var: "filingStatus" }, right: "mfj" }, then: 250000, else: 200000 } },
    { name: "addlMedicare", expr: { op: "*", args: [{ op: "max", args: [0, { op: "-", args: [{ var: "gross" }, { var: "addlThreshold" }] }] }, 0.009] } },
    { name: "fica", expr: { op: "+", args: [{ var: "ss" }, { var: "medicare" }, { var: "addlMedicare" }] } },
    { name: "annualNet", expr: { op: "-", args: [{ var: "gross" }, { var: "pretax" }, { var: "federalTax" }, { var: "fica" }] } },
    { name: "perPaycheck", expr: { op: "/", args: [{ var: "annualNet" }, { var: "periods" }] } },
    { name: "grossPerPaycheck", expr: { op: "/", args: [{ var: "gross" }, { var: "periods" }] } },
  ],
  outputs: [
    { name: "perPaycheck", label: "Take-home per paycheck", expr: { var: "perPaycheck" }, format: "currency", primary: true, note: "After federal income tax, FICA, and pre-tax deductions. Excludes state/local tax." },
    { name: "grossPerPaycheck", label: "Gross per paycheck", expr: { var: "grossPerPaycheck" }, format: "currency" },
    { name: "annualNet", label: "Annual take-home", expr: { var: "annualNet" }, format: "currency" },
    { name: "federalTax", label: "Federal income tax (annual)", expr: { var: "federalTax" }, format: "currency" },
    { name: "fica", label: "FICA (annual)", expr: { var: "fica" }, format: "currency" },
  ],
  faqs: [
    { question: "How many paychecks are in a year?", answer: "Weekly is 52, bi-weekly is 26, semi-monthly is 24, and monthly is 12. This calculator divides your annual take-home by the number you choose." },
    { question: "Do pre-tax deductions lower my taxes?", answer: "Pre-tax deductions like 401(k) contributions reduce your taxable income for federal income tax. Note that 401(k) contributions are still subject to Social Security and Medicare (FICA)." },
    { question: "Does this include state income tax?", answer: "No. It covers federal income tax and FICA only. State and local income taxes vary widely and are not included." },
  ],
  whoFor:
    "Employees who want to see roughly how much lands in each paycheck, and people comparing pay frequencies or the effect of increasing 401(k) contributions.",
  howItWorks:
    "Pre-tax deductions and the standard deduction are subtracted from your salary to find taxable income, which is taxed using the federal brackets for your filing status. Social Security (6.2% up to the wage base) and Medicare (1.45%, plus 0.9% above a threshold) are charged on gross pay. Take-home is gross minus pre-tax deductions, income tax, and FICA, divided by the number of pay periods.",
  workedExample:
    "A single filer earning 52,000 paid bi-weekly with no pre-tax deductions: taxable income is 36,250, federal income tax is about 4,111.50, and FICA is 3,978. Annual take-home is about 43,910.50, or roughly 1,688.87 per bi-weekly paycheck.",
  commonMistakes: [
    "Expecting this to match your pay stub exactly - employers use IRS withholding tables and your W-4, which differ from a full-year tax calculation.",
    "Assuming 401(k) contributions avoid Social Security and Medicare tax - they do not.",
    "Forgetting that state and local income taxes will further reduce take-home pay.",
  ],
  regionalVariations:
    "Federal income tax and FICA are the same nationwide, but state and local income taxes (not included here) vary from zero to over 13% depending on where you live and work.",
  sources: [
    { title: "Federal income tax rates and brackets", url: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets", publisher: "IRS", retrieved: "2026-06-09" },
    { title: "Topic no. 751, Social Security and Medicare withholding rates", url: "https://www.irs.gov/taxtopics/tc751", publisher: "IRS", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only. Uses a full-year federal calculation with the standard deduction plus FICA; it excludes state/local tax, credits, and employer-specific withholding. Not tax advice.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "single 52k biweekly", inputs: { gross: 52000, filingStatus: "single", payFrequency: "biweekly", pretax: 0 }, expect: { federalTax: 4111.5, fica: 3978, annualNet: 43910.5, grossPerPaycheck: 2000 } },
    { name: "single 80k monthly 5k 401k", inputs: { gross: 80000, filingStatus: "single", payFrequency: "monthly", pretax: 5000 }, expect: { federalTax: 7949, fica: 6120, annualNet: 60931 } },
    { name: "mfj 120k biweekly", inputs: { gross: 120000, filingStatus: "mfj", payFrequency: "biweekly", pretax: 0 }, expect: { federalTax: 10143, fica: 9180, annualNet: 100677 } },
  ],
};
