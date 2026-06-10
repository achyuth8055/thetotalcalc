// UK Capital Gains Tax (2025/26). Annual exempt amount 3,000. Since 30 Oct 2024
// the main rates are 18% (within the basic-rate band) and 24% (above it) for all
// asset types, including residential property. Gains stack on top of income.
// England/Wales/NI bands; Scotland's income-tax bands differ but CGT is UK-wide.
import type { CalculatorDefinition } from "@/lib/engine/types";

export const ukCapitalGains: CalculatorDefinition = {
  id: "uk-capital-gains",
  type: "estimate",
  region: "UK",
  jurisdictionLevel: "federal",
  category: "tax",
  slug: "uk-capital-gains-tax",
  title: "UK Capital Gains Tax Calculator (2025/26)",
  description:
    "Estimate UK Capital Gains Tax on a gain for 2025/26, after the 3,000 annual exempt amount, at the 18% and 24% rates based on your income.",
  taxYear: 2025,
  inputs: [
    { name: "gain", label: "Total capital gain", type: "currency", required: true, default: 20000, min: 0, max: 10000000, step: 500, help: "Profit on the disposal (proceeds minus cost and allowable expenses)." },
    { name: "income", label: "Annual taxable income", type: "currency", required: true, default: 35000, min: 0, max: 5000000, step: 500, help: "Your income before this gain. Used to decide how much of the gain is taxed at 18% vs 24%." },
  ],
  derived: [
    { name: "taxableIncome", expr: { op: "max", args: [0, { op: "-", args: [{ var: "income" }, 12570] }] } },
    { name: "taxableGain", expr: { op: "max", args: [0, { op: "-", args: [{ var: "gain" }, 3000] }] } },
    { name: "remainingBasic", expr: { op: "max", args: [0, { op: "-", args: [37700, { var: "taxableIncome" }] }] } },
    { name: "amtBasic", expr: { op: "min", args: [{ var: "taxableGain" }, { var: "remainingBasic" }] } },
    { name: "amtHigher", expr: { op: "-", args: [{ var: "taxableGain" }, { var: "amtBasic" }] } },
    { name: "tax", expr: { op: "+", args: [{ op: "*", args: [0.18, { var: "amtBasic" }] }, { op: "*", args: [0.24, { var: "amtHigher" }] }] } },
    { name: "net", expr: { op: "-", args: [{ var: "gain" }, { var: "tax" }] } },
    { name: "effectiveRate", expr: { if: { cmp: ">", left: { var: "gain" }, right: 0 }, then: { op: "/", args: [{ op: "*", args: [{ var: "tax" }, 100] }, { var: "gain" }] }, else: 0 } },
  ],
  outputs: [
    { name: "tax", label: "Estimated Capital Gains Tax", expr: { var: "tax" }, format: "currency", primary: true, note: "After the 3,000 annual exempt amount, at 18% within the basic-rate band and 24% above it." },
    { name: "net", label: "Net gain after tax", expr: { var: "net" }, format: "currency" },
    { name: "effectiveRate", label: "Effective rate on the gain", expr: { var: "effectiveRate" }, format: "percent" },
  ],
  faqs: [
    { question: "What is the CGT allowance for 2025/26?", answer: "The annual exempt amount is 3,000. You only pay Capital Gains Tax on total gains above this amount in the tax year." },
    { question: "What are the CGT rates?", answer: "Since 30 October 2024 the rates are 18% for gains that fall within your remaining basic-rate band and 24% for gains above it. These rates now apply to all assets, including residential property." },
    { question: "How does my income affect the rate?", answer: "Gains are treated as the top slice of your income. If your income already uses up the basic-rate band, the whole gain is taxed at 24%; otherwise the part that fits in the remaining band is taxed at 18%." },
  ],
  whoFor:
    "UK taxpayers estimating Capital Gains Tax on selling shares, funds, a second property, or other chargeable assets.",
  howItWorks:
    "The 3,000 annual exempt amount is subtracted from your gain. The remaining taxable gain is added on top of your income: the portion that fits in your remaining basic-rate band (up to 37,700 of taxable income) is taxed at 18%, and anything above is taxed at 24%.",
  workedExample:
    "Income of 30,000 and a 20,000 gain: taxable income is 17,430, so 20,270 of the basic-rate band remains. The taxable gain is 17,000 (after the 3,000 allowance), which all fits in the basic band, so the tax is 18% of 17,000 = 3,060.",
  commonMistakes: [
    "Forgetting to deduct the 3,000 annual exempt amount before applying the rate.",
    "Using the old 10%/20% rates - they rose to 18%/24% from 30 October 2024.",
    "Ignoring that the gain stacks on income, so a large gain can be split across the 18% and 24% rates.",
  ],
  regionalVariations:
    "Capital Gains Tax is UK-wide, so the same rates and allowance apply in Scotland even though Scottish income-tax bands differ. Different rules apply to business-asset disposal relief and to non-residents.",
  documents: [
    "Records of the purchase price and date (cost basis)",
    "Sale proceeds and allowable costs (fees, improvements)",
    "Details of any other gains or losses in the same tax year",
  ],
  deadlines:
    "Most gains are reported on your Self Assessment return by 31 January after the tax year. UK residential property disposals must be reported and the tax paid within 60 days of completion.",
  sources: [
    { title: "Capital Gains Tax rates and allowances", url: "https://www.gov.uk/capital-gains-tax/rates", publisher: "GOV.UK", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only for 2025/26. Excludes reliefs (such as Private Residence Relief and Business Asset Disposal Relief), losses brought forward, and special rules for some assets. Confirm with GOV.UK or an accountant.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "income 30k gain 20k (basic)", inputs: { income: 30000, gain: 20000 }, expect: { tax: 3060 } },
    { name: "income 60k gain 20k (higher)", inputs: { income: 60000, gain: 20000 }, expect: { tax: 4080 } },
    { name: "gain below allowance", inputs: { income: 30000, gain: 2000 }, expect: { tax: 0 } },
    { name: "income 40k gain 30k (split)", inputs: { income: 40000, gain: 30000 }, expect: { tax: 5863.8 } },
  ],
};
