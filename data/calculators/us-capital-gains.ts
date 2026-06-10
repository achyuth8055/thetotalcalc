// US capital gains tax (2025). Long-term gains use the 0/15/20% brackets,
// stacked on top of ordinary taxable income. Short-term gains are taxed as
// ordinary income (the marginal increase in federal income tax). Excludes the
// 3.8% Net Investment Income Tax and state tax.
import type { CalculatorDefinition, Expr } from "@/lib/engine/types";
import { progressive, NO_CAP } from "@/lib/engine/bands";

const singleBands = progressive("ordinaryTaxable", [
  [0.1, 0, 11925], [0.12, 11925, 48475], [0.22, 48475, 103350], [0.24, 103350, 197300],
  [0.32, 197300, 250525], [0.35, 250525, 626350], [0.37, 626350, NO_CAP],
]);
const singleBandsHigh = progressive("gainEnd", [
  [0.1, 0, 11925], [0.12, 11925, 48475], [0.22, 48475, 103350], [0.24, 103350, 197300],
  [0.32, 197300, 250525], [0.35, 250525, 626350], [0.37, 626350, NO_CAP],
]);
const mfjBands = progressive("ordinaryTaxable", [
  [0.1, 0, 23850], [0.12, 23850, 96950], [0.22, 96950, 206700], [0.24, 206700, 394600],
  [0.32, 394600, 501050], [0.35, 501050, 751600], [0.37, 751600, NO_CAP],
]);
const mfjBandsHigh = progressive("gainEnd", [
  [0.1, 0, 23850], [0.12, 23850, 96950], [0.22, 96950, 206700], [0.24, 206700, 394600],
  [0.32, 394600, 501050], [0.35, 501050, 751600], [0.37, 751600, NO_CAP],
]);

const shortTaxExpr: Expr = {
  if: { cmp: "==", left: { var: "filingStatus" }, right: "mfj" },
  then: { op: "-", args: [mfjBandsHigh, mfjBands] },
  else: { op: "-", args: [singleBandsHigh, singleBands] },
};

export const usCapitalGains: CalculatorDefinition = {
  id: "us-capital-gains",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "tax",
  slug: "us-capital-gains-tax",
  title: "US Capital Gains Tax Calculator (2025)",
  description:
    "Estimate federal tax on a capital gain for 2025. Long-term gains use the 0/15/20% rates based on your income; short-term gains are taxed as ordinary income.",
  taxYear: 2025,
  inputs: [
    { name: "gain", label: "Capital gain", type: "currency", required: true, default: 20000, min: 0, max: 10000000, step: 500, help: "Profit from the sale (sale price minus cost basis)." },
    { name: "term", label: "Holding period", type: "select", required: true, default: "long", options: [{ value: "long", label: "Long-term (held over 1 year)" }, { value: "short", label: "Short-term (held 1 year or less)" }] },
    { name: "filingStatus", label: "Filing status", type: "select", required: true, default: "single", options: [{ value: "single", label: "Single" }, { value: "mfj", label: "Married filing jointly" }] },
    { name: "ordinaryTaxable", label: "Other taxable income", type: "currency", required: true, default: 50000, min: 0, max: 5000000, step: 1000, help: "Your taxable income before this gain (after deductions). Long-term gains stack on top of this." },
  ],
  tables: {
    ltcg0: { single: 48350, mfj: 96700 },
    ltcg15: { single: 533400, mfj: 600050 },
  },
  derived: [
    { name: "t0", expr: { lookup: "ltcg0", key: { var: "filingStatus" } } },
    { name: "t15", expr: { lookup: "ltcg15", key: { var: "filingStatus" } } },
    { name: "gainEnd", expr: { op: "+", args: [{ var: "ordinaryTaxable" }, { var: "gain" }] } },
    { name: "amt15", expr: { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "gainEnd" }, { var: "t15" }] }, { op: "max", args: [{ var: "ordinaryTaxable" }, { var: "t0" }] }] }] } },
    { name: "amt20", expr: { op: "max", args: [0, { op: "-", args: [{ var: "gainEnd" }, { op: "max", args: [{ var: "ordinaryTaxable" }, { var: "t15" }] }] }] } },
    { name: "ltcgTax", expr: { op: "+", args: [{ op: "*", args: [0.15, { var: "amt15" }] }, { op: "*", args: [0.2, { var: "amt20" }] }] } },
    { name: "shortTax", expr: shortTaxExpr },
    { name: "tax", expr: { if: { cmp: "==", left: { var: "term" }, right: "short" }, then: { var: "shortTax" }, else: { var: "ltcgTax" } } },
    { name: "net", expr: { op: "-", args: [{ var: "gain" }, { var: "tax" }] } },
    { name: "effectiveRate", expr: { if: { cmp: ">", left: { var: "gain" }, right: 0 }, then: { op: "/", args: [{ op: "*", args: [{ var: "tax" }, 100] }, { var: "gain" }] }, else: 0 } },
  ],
  outputs: [
    { name: "tax", label: "Estimated capital gains tax", expr: { var: "tax" }, format: "currency", primary: true, note: "Federal only. Excludes the 3.8% Net Investment Income Tax and state tax." },
    { name: "net", label: "Net gain after tax", expr: { var: "net" }, format: "currency" },
    { name: "effectiveRate", label: "Effective rate on the gain", expr: { var: "effectiveRate" }, format: "percent" },
  ],
  faqs: [
    { question: "What are the long-term capital gains rates?", answer: "For 2025, long-term gains are taxed at 0%, 15%, or 20% depending on your total taxable income and filing status. The gain stacks on top of your other income to decide which rates apply." },
    { question: "How are short-term gains taxed?", answer: "Assets held one year or less are short-term and taxed as ordinary income at your marginal federal rate, which this calculator estimates as the increase in your income tax." },
    { question: "Does this include the 3.8% NIIT?", answer: "No. The Net Investment Income Tax of 3.8% can apply to higher earners and is not included here, nor is state capital gains tax." },
  ],
  whoFor:
    "Investors and home sellers estimating federal tax on a profit from selling stocks, funds, crypto, or property.",
  howItWorks:
    "For long-term gains, your gain is stacked on top of your other taxable income; the portion that falls in each 0/15/20% band is taxed at that rate. For short-term gains, the calculator adds the gain to your income and measures the increase in ordinary federal income tax.",
  workedExample:
    "Single filer with 50,000 of other taxable income and a 20,000 long-term gain: the gain stacks from 50,000 to 70,000, which is within the 15% band (above the 48,350 zero-rate threshold), so the tax is 15% of 20,000 = 3,000.",
  commonMistakes: [
    "Assuming all gains are taxed at 15% - the rate depends on your total income and can be 0% or 20%.",
    "Treating a short-term gain as long-term; holding period is measured from the day after purchase to the sale date.",
    "Forgetting state capital gains tax and the 3.8% NIIT, which can apply on top of these figures.",
  ],
  regionalVariations:
    "Most states tax capital gains as ordinary income at their own rates; a few have no income tax. State tax is not included here.",
  sources: [
    { title: "Topic no. 409, Capital gains and losses", url: "https://www.irs.gov/taxtopics/tc409", publisher: "IRS", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only. Federal capital gains tax based on the 2025 brackets. Excludes the 3.8% NIIT, state tax, the qualified-dividend interaction, and loss carryovers. Not tax advice.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "long single 50k income 20k gain", inputs: { gain: 20000, term: "long", filingStatus: "single", ordinaryTaxable: 50000 }, expect: { tax: 3000 } },
    { name: "long single 30k income 10k gain (0% band)", inputs: { gain: 10000, term: "long", filingStatus: "single", ordinaryTaxable: 30000 }, expect: { tax: 0 } },
    { name: "long mfj 90k income 40k gain", inputs: { gain: 40000, term: "long", filingStatus: "mfj", ordinaryTaxable: 90000 }, expect: { tax: 4995 } },
    { name: "short single 50k income 20k gain", inputs: { gain: 20000, term: "short", filingStatus: "single", ordinaryTaxable: 50000 }, expect: { tax: 4400 } },
  ],
};
