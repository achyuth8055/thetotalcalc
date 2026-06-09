// US self-employment tax (2025). Social Security (12.4% up to the wage base)
// plus Medicare (2.9%) on 92.35% of net profit, with the deductible half.
// Excludes the 0.9% Additional Medicare Tax (computed separately on Form 8959).
import type { CalculatorDefinition, Expr } from "@/lib/engine/types";

const seTaxExpr: Expr = {
  if: { cmp: "<", left: { var: "netSE" }, right: 400 },
  then: 0,
  else: { op: "+", args: [{ var: "ssTax" }, { var: "medicareTax" }] },
};

export const usSelfEmploymentTax: CalculatorDefinition = {
  id: "us-self-employment-tax",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "tax",
  slug: "us-self-employment-tax",
  title: "US Self-Employment Tax Calculator (2025)",
  description:
    "Estimate the self-employment tax (Social Security + Medicare) on your net profit for 2025, plus the deductible half you can claim against income tax.",
  taxYear: 2025,
  inputs: [
    { name: "netProfit", label: "Net self-employment profit", type: "currency", required: true, default: 50000, min: 0, max: 5000000, step: 500, help: "Your business income minus business expenses (Schedule C net profit)." },
  ],
  derived: [
    { name: "netSE", expr: { op: "*", args: [{ var: "netProfit" }, 0.9235] } },
    { name: "ssBase", expr: { op: "min", args: [{ var: "netSE" }, 176100] } },
    { name: "ssTax", expr: { op: "*", args: [{ var: "ssBase" }, 0.124] } },
    { name: "medicareTax", expr: { op: "*", args: [{ var: "netSE" }, 0.029] } },
    { name: "seTax", expr: seTaxExpr },
    { name: "deduction", expr: { op: "*", args: [{ var: "seTax" }, 0.5] } },
  ],
  outputs: [
    { name: "seTax", label: "Self-employment tax", expr: { var: "seTax" }, format: "currency", primary: true, note: "12.4% Social Security (up to the wage base) + 2.9% Medicare on 92.35% of net profit." },
    { name: "deduction", label: "Deductible half (income-tax deduction)", expr: { var: "deduction" }, format: "currency" },
    { name: "ssTax", label: "Social Security portion", expr: { var: "ssTax" }, format: "currency" },
    { name: "medicareTax", label: "Medicare portion", expr: { var: "medicareTax" }, format: "currency" },
    { name: "netSE", label: "Net earnings subject to SE tax", expr: { var: "netSE" }, format: "currency" },
  ],
  faqs: [
    { question: "What is the self-employment tax rate?", answer: "15.3% total: 12.4% for Social Security (up to the annual wage base of 176,100 in 2025) and 2.9% for Medicare with no cap. It is charged on 92.35% of your net profit." },
    { question: "Do I owe self-employment tax on a small profit?", answer: "If your net earnings from self-employment are less than 400, you generally do not owe self-employment tax." },
    { question: "Can I deduct any of it?", answer: "Yes. You can deduct half of your self-employment tax when calculating your federal income tax. This calculator shows that deductible amount." },
  ],
  whoFor:
    "Freelancers, gig workers, sole proprietors, and single-member LLC owners who report business profit on Schedule C and need to estimate self-employment tax.",
  howItWorks:
    "Net profit is multiplied by 92.35% to get net earnings from self-employment. Social Security tax is 12.4% of those earnings up to the wage base, Medicare tax is 2.9% with no cap, and the two added together are your self-employment tax. Half of it is deductible against income tax.",
  workedExample:
    "On 50,000 of net profit: net earnings are 50,000 x 0.9235 = 46,175. Social Security is 12.4% of 46,175 = 5,725.70, Medicare is 2.9% = 1,339.08, so self-employment tax is about 7,064.78. The deductible half is about 3,532.39.",
  commonMistakes: [
    "Forgetting that self-employment tax is separate from and in addition to federal income tax.",
    "Calculating the tax on full net profit instead of 92.35% of it.",
    "Overlooking the 0.9% Additional Medicare Tax that applies to higher earners (computed separately).",
  ],
  regionalVariations:
    "Self-employment tax is federal and the same in every state. States may separately tax your business income, which is not included here.",
  documents: [
    "Schedule C (or your profit-and-loss summary) showing net profit",
    "Records of business income and deductible expenses",
    "Form 1040-ES if you make quarterly estimated payments",
  ],
  deadlines:
    "Self-employment tax is paid through quarterly estimated payments (generally April, June, September, and January) and reconciled on your annual return, typically due April 15.",
  sources: [
    { title: "Self-Employment Tax (Social Security and Medicare Taxes)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes", publisher: "IRS", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only. Excludes the 0.9% Additional Medicare Tax, state taxes, and income tax. Your actual liability depends on your full return. Not tax advice.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "50k profit", inputs: { netProfit: 50000 }, expect: { netSE: 46175, seTax: 7064.78, deduction: 3532.39 } },
    { name: "200k profit (SS capped)", inputs: { netProfit: 200000 }, expect: { ssTax: 21836.4, seTax: 27192.7 } },
    { name: "Below 400 threshold", inputs: { netProfit: 300 }, expect: { seTax: 0 } },
  ],
};
