// Canada capital gains tax (2025). 50% of a capital gain is taxable and added
// to income, then taxed at the marginal federal + provincial rate. The tax is
// the increase in total income tax from adding the taxable gain. Supports
// Ontario (with surtax), British Columbia, and Alberta.
import type { CalculatorDefinition, Expr } from "@/lib/engine/types";
import { progressive, NO_CAP, type Band } from "@/lib/engine/bands";

const FED: Band[] = [
  [0.15, 0, 57375], [0.205, 57375, 114750], [0.26, 114750, 177882], [0.29, 177882, 253414], [0.33, 253414, NO_CAP],
];
const ON: Band[] = [
  [0.0505, 0, 52886], [0.0915, 52886, 105775], [0.1116, 105775, 150000], [0.1216, 150000, 220000], [0.1316, 220000, NO_CAP],
];
const BC: Band[] = [
  [0.0506, 0, 49279], [0.077, 49279, 98560], [0.105, 98560, 113158], [0.1229, 113158, 137407], [0.147, 137407, 186306], [0.168, 186306, 259829], [0.205, 259829, NO_CAP],
];
const AB: Band[] = [
  [0.08, 0, 60000], [0.1, 60000, 151234], [0.12, 151234, 181481], [0.13, 181481, 241974], [0.14, 241974, 362961], [0.15, 362961, NO_CAP],
];
const FED_BPA = 0.15 * 16129;
const ON_BPA = 0.0505 * 12747;
const BC_BPA = 0.0506 * 12932;
const AB_BPA = 0.08 * 22323;

const add = (...args: Expr[]): Expr => ({ op: "+", args });
const sub = (a: Expr, b: Expr): Expr => ({ op: "-", args: [a, b] });
const mul = (a: Expr, b: Expr): Expr => ({ op: "*", args: [a, b] });
const mx = (...args: Expr[]): Expr => ({ op: "max", args });

const fedTax = (v: string): Expr => mx(0, sub(progressive(v, FED), FED_BPA));
const onBase = (v: string): Expr => mx(0, sub(progressive(v, ON), ON_BPA));
const onTax = (v: string): Expr =>
  add(onBase(v), mul(0.2, mx(0, sub(onBase(v), 5710))), mul(0.36, mx(0, sub(onBase(v), 7307))));
const bcTax = (v: string): Expr => mx(0, sub(progressive(v, BC), BC_BPA));
const abTax = (v: string): Expr => mx(0, sub(progressive(v, AB), AB_BPA));

const provTax = (v: string): Expr => ({
  if: { cmp: "==", left: { var: "province" }, right: "ON" },
  then: onTax(v),
  else: {
    if: { cmp: "==", left: { var: "province" }, right: "BC" },
    then: bcTax(v),
    else: { if: { cmp: "==", left: { var: "province" }, right: "AB" }, then: abTax(v), else: 0 },
  },
});

const totalTax = (v: string): Expr => add(fedTax(v), provTax(v));

export const caCapitalGains: CalculatorDefinition = {
  id: "ca-capital-gains",
  type: "estimate",
  region: "CA",
  jurisdictionLevel: "federal",
  category: "tax",
  slug: "ca-capital-gains-tax",
  title: "Canada Capital Gains Tax Calculator (2025)",
  description:
    "Estimate the tax on a Canadian capital gain for 2025. Half of the gain is taxable and taxed at your marginal federal and provincial rate (Ontario, BC, Alberta).",
  taxYear: 2025,
  inputs: [
    { name: "gain", label: "Capital gain", type: "currency", required: true, default: 20000, min: 0, max: 10000000, step: 500, help: "Profit from the sale (proceeds minus adjusted cost base and expenses)." },
    { name: "otherIncome", label: "Other taxable income", type: "currency", required: true, default: 60000, min: 0, max: 5000000, step: 1000, help: "Your taxable income before this gain. The taxable half of the gain stacks on top of it." },
    {
      name: "province", label: "Province", type: "select", required: true, default: "ON",
      options: [
        { value: "ON", label: "Ontario" }, { value: "BC", label: "British Columbia" },
        { value: "AB", label: "Alberta" }, { value: "other", label: "Other (federal only estimate)" },
      ],
    },
  ],
  derived: [
    { name: "taxableGain", expr: { op: "*", args: [{ var: "gain" }, 0.5] } },
    { name: "incLow", expr: { var: "otherIncome" } },
    { name: "incHigh", expr: { op: "+", args: [{ var: "otherIncome" }, { var: "taxableGain" }] } },
    { name: "tax", expr: sub(totalTax("incHigh"), totalTax("incLow")) },
    { name: "net", expr: { op: "-", args: [{ var: "gain" }, { var: "tax" }] } },
    { name: "effectiveRate", expr: { if: { cmp: ">", left: { var: "gain" }, right: 0 }, then: { op: "/", args: [{ op: "*", args: [{ var: "tax" }, 100] }, { var: "gain" }] }, else: 0 } },
  ],
  outputs: [
    { name: "tax", label: "Estimated capital gains tax", expr: { var: "tax" }, format: "currency", primary: true, note: "Half the gain taxed at your marginal federal + provincial rate. Excludes other credits." },
    { name: "taxableGain", label: "Taxable capital gain (50%)", expr: { var: "taxableGain" }, format: "currency" },
    { name: "net", label: "Net gain after tax", expr: { var: "net" }, format: "currency" },
    { name: "effectiveRate", label: "Effective rate on the gain", expr: { var: "effectiveRate" }, format: "percent" },
  ],
  faqs: [
    { question: "How much of a capital gain is taxable in Canada?", answer: "For 2025, 50% of a capital gain is included in income and taxed at your marginal rate. The proposed increase to 66.67% on gains above 250,000 was deferred and is not applied here." },
    { question: "What rate is applied?", answer: "There is no separate capital gains rate. The taxable half is added to your income and taxed at your combined federal and provincial marginal rate, which depends on your province and income." },
    { question: "Are gains in a TFSA or principal residence taxed?", answer: "Gains inside a TFSA are generally tax-free, and the sale of your principal residence is usually exempt. This calculator assumes a taxable (non-registered) gain." },
  ],
  whoFor:
    "Canadian investors and property sellers estimating tax on a taxable capital gain from stocks, funds, or a secondary property.",
  howItWorks:
    "Half of your gain is the taxable capital gain. It is stacked on top of your other income, and the tax is the difference between your total income tax with and without it, using 2025 federal and provincial brackets (with the basic personal amount and Ontario surtax).",
  workedExample:
    "In Ontario with 80,000 of other income and a 20,000 gain: the taxable gain is 10,000, which is taxed at the roughly 29.65% marginal rate at that income (20.5% federal + 9.15% Ontario), giving about 2,965 of tax.",
  commonMistakes: [
    "Taxing the full gain - only 50% is included in income.",
    "Applying a flat rate; the marginal rate rises with income and varies by province.",
    "Forgetting that a principal residence sale and gains inside a TFSA or RRSP are treated differently.",
  ],
  regionalVariations:
    "Every province sets its own brackets, so the same gain is taxed differently across provinces. Quebec runs a separate system and is not covered. Ontario's surtax is included for Ontario residents.",
  sources: [
    { title: "Capital gains - Line 12700", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html", publisher: "Canada Revenue Agency", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only for 2025 using a 50% inclusion rate. Applies the basic personal amount only and excludes other credits, the capital gains reserve, and Quebec. Not tax advice.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "ON 80k income 20k gain", inputs: { gain: 20000, otherIncome: 80000, province: "ON" }, expect: { taxableGain: 10000, tax: 2965 } },
    { name: "BC 60k income 40k gain", inputs: { gain: 40000, otherIncome: 60000, province: "BC" }, expect: { tax: 5640 } },
    { name: "AB 50k income 10k gain", inputs: { gain: 10000, otherIncome: 50000, province: "AB" }, expect: { tax: 1150 } },
  ],
};
