// UK salary after tax (2025/26). Income Tax (England/Wales/NI bands) plus
// employee Class 1 National Insurance. Scotland has different income-tax bands
// (noted in regionalVariations). Excludes pension salary sacrifice, student
// loans, and other deductions.
import type { CalculatorDefinition, Expr } from "@/lib/engine/types";

// Personal allowance with the taper above 100,000 (reduced by 1 for every 2 over).
const personalAllowance: Expr = {
  op: "max",
  args: [0, { op: "-", args: [12570, { op: "max", args: [0, { op: "/", args: [{ op: "-", args: [{ var: "gross" }, 100000] }, 2] }] }] }],
};

// Income tax: 20% to 37,700 taxable, 40% to 125,140, 45% above.
const incomeTaxExpr: Expr = {
  op: "+",
  args: [
    { op: "*", args: [0.2, { op: "min", args: [{ var: "taxable" }, 37700] }] },
    { op: "*", args: [0.4, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, 125140] }, 37700] }] }] },
    { op: "*", args: [0.45, { op: "max", args: [0, { op: "-", args: [{ var: "taxable" }, 125140] }] }] },
  ],
};

// Employee Class 1 NI: 8% between 12,570 and 50,270, 2% above.
const niExpr: Expr = {
  op: "+",
  args: [
    { op: "*", args: [0.08, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "gross" }, 50270] }, 12570] }] }] },
    { op: "*", args: [0.02, { op: "max", args: [0, { op: "-", args: [{ var: "gross" }, 50270] }] }] },
  ],
};

export const ukSalaryAfterTax: CalculatorDefinition = {
  id: "uk-salary-after-tax",
  type: "estimate",
  region: "UK",
  jurisdictionLevel: "federal",
  category: "salary",
  slug: "uk-salary-after-tax",
  title: "UK Salary After Tax Calculator (2025/26)",
  description:
    "Estimate your UK take-home pay after Income Tax and National Insurance for the 2025/26 tax year (England, Wales, and Northern Ireland).",
  taxYear: 2025,
  inputs: [
    { name: "gross", label: "Gross annual salary", type: "currency", required: true, default: 35000, min: 0, max: 2000000, step: 500 },
  ],
  derived: [
    { name: "pa", expr: personalAllowance },
    { name: "taxable", expr: { op: "max", args: [0, { op: "-", args: [{ var: "gross" }, { var: "pa" }] }] } },
    { name: "incomeTax", expr: incomeTaxExpr },
    { name: "ni", expr: niExpr },
    { name: "totalDeductions", expr: { op: "+", args: [{ var: "incomeTax" }, { var: "ni" }] } },
    { name: "takeHome", expr: { op: "-", args: [{ var: "gross" }, { var: "totalDeductions" }] } },
    { name: "monthly", expr: { op: "/", args: [{ var: "takeHome" }, 12] } },
  ],
  outputs: [
    { name: "takeHome", label: "Annual take-home pay", expr: { var: "takeHome" }, format: "currency", primary: true, note: "After Income Tax and National Insurance. Excludes pension, student loan, and other deductions." },
    { name: "monthly", label: "Monthly take-home", expr: { var: "monthly" }, format: "currency" },
    { name: "incomeTax", label: "Income Tax", expr: { var: "incomeTax" }, format: "currency" },
    { name: "ni", label: "National Insurance", expr: { var: "ni" }, format: "currency" },
  ],
  faqs: [
    { question: "What is the personal allowance for 2025/26?", answer: "The standard tax-free personal allowance is 12,570. It is reduced by 1 for every 2 of income above 100,000, and is fully withdrawn at 125,140." },
    { question: "What National Insurance rate is used?", answer: "Employee Class 1 NI is 8% on earnings between 12,570 and 50,270, and 2% on earnings above 50,270, for 2025/26." },
    { question: "Does this work for Scotland?", answer: "Income Tax bands differ in Scotland, so this calculator applies to England, Wales, and Northern Ireland. A Scottish version uses the Scottish bands and rates." },
  ],
  whoFor:
    "Employees and job seekers in England, Wales, or Northern Ireland who want to estimate their take-home pay from a gross salary.",
  howItWorks:
    "Your tax-free personal allowance is subtracted from your gross salary to find taxable income. Income Tax is charged in bands (20%, 40%, 45%), and employee National Insurance is charged at 8% and 2% above the relevant thresholds. Take-home pay is your gross salary minus both.",
  workedExample:
    "On a 60,000 salary: the personal allowance is 12,570, so taxable income is 47,430. Income Tax is 20% of 37,700 (7,540) plus 40% of the remaining 9,730 (3,892), totaling 11,432. National Insurance is 8% of 37,700 (3,016) plus 2% of 9,730 (194.60), totaling 3,210.60. Take-home pay is about 45,357.",
  commonMistakes: [
    "Forgetting that pension contributions, student loan repayments, and salary sacrifice reduce take-home pay and are not included here.",
    "Using Scottish income-tax bands - they differ from the rest of the UK.",
    "Assuming the personal allowance still applies above 125,140, where it is fully withdrawn.",
  ],
  regionalVariations:
    "Scotland sets its own Income Tax bands and rates, so Scottish taxpayers will see different figures. National Insurance is UK-wide.",
  sources: [
    { title: "Income Tax rates and Personal Allowances", url: "https://www.gov.uk/income-tax-rates", publisher: "GOV.UK", retrieved: "2026-06-09" },
    { title: "National Insurance rates and categories", url: "https://www.gov.uk/national-insurance-rates-letters", publisher: "GOV.UK", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only for 2025/26 (England, Wales, Northern Ireland). Excludes pension contributions, student loan repayments, the marriage allowance, and other adjustments. Not financial advice.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "30k", inputs: { gross: 30000 }, expect: { incomeTax: 3486, ni: 1394.4, takeHome: 25119.6 } },
    { name: "60k", inputs: { gross: 60000 }, expect: { incomeTax: 11432, ni: 3210.6, takeHome: 45357.4 } },
    { name: "120k (PA tapered)", inputs: { gross: 120000 }, expect: { incomeTax: 39432, ni: 4410.6, takeHome: 76157.4 } },
  ],
};
