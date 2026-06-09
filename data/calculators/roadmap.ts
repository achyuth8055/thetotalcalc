// Previously "coming soon" calculators, now built on the rules engine.
// Figures verified for 2025 / the July 2025–June 2026 benefit year.
// Estimates only — every definition carries a disclaimer.

import type { CalculatorDefinition, Expr } from "@/lib/engine/types";

// Shared 2025 US federal bracket cut points (single / mfj) reused by salary calc.
const US_BRACKET_TABLES = {
  stdDeduction: { single: 15750, mfj: 31500 },
  cut1: { single: 11925, mfj: 23850 },
  cut2: { single: 48475, mfj: 96950 },
  cut3: { single: 103350, mfj: 206700 },
  cut4: { single: 197300, mfj: 394600 },
  cut5: { single: 250525, mfj: 501050 },
  cut6: { single: 626350, mfj: 751600 },
};

// Progressive federal income tax on a `taxable` variable using c1..c6 vars.
const federalTaxExpr: Expr = {
  op: "+",
  args: [
    { op: "*", args: [0.1, { op: "max", args: [0, { op: "min", args: [{ var: "taxable" }, { var: "c1" }] }] }] },
    { op: "*", args: [0.12, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c2" }] }, { var: "c1" }] }] }] },
    { op: "*", args: [0.22, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c3" }] }, { var: "c2" }] }] }] },
    { op: "*", args: [0.24, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c4" }] }, { var: "c3" }] }] }] },
    { op: "*", args: [0.32, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c5" }] }, { var: "c4" }] }] }] },
    { op: "*", args: [0.35, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "taxable" }, { var: "c6" }] }, { var: "c5" }] }] }] },
    { op: "*", args: [0.37, { op: "max", args: [0, { op: "-", args: [{ var: "taxable" }, { var: "c6" }] }] }] },
  ],
};

const bracketDerived = [
  { name: "stdDed", expr: { lookup: "stdDeduction", key: { var: "filingStatus" } } as Expr },
  { name: "c1", expr: { lookup: "cut1", key: { var: "filingStatus" } } as Expr },
  { name: "c2", expr: { lookup: "cut2", key: { var: "filingStatus" } } as Expr },
  { name: "c3", expr: { lookup: "cut3", key: { var: "filingStatus" } } as Expr },
  { name: "c4", expr: { lookup: "cut4", key: { var: "filingStatus" } } as Expr },
  { name: "c5", expr: { lookup: "cut5", key: { var: "filingStatus" } } as Expr },
  { name: "c6", expr: { lookup: "cut6", key: { var: "filingStatus" } } as Expr },
];

// ---------------------------------------------------------------------------
// US Property Tax Estimator
// ---------------------------------------------------------------------------
export const usPropertyTax: CalculatorDefinition = {
  id: "us-property-tax",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "state",
  category: "property-tax",
  slug: "us-property-tax",
  title: "US Property Tax Estimator",
  description:
    "Estimate your annual property tax from your home value and state, using each state's average effective property-tax rate.",
  inputs: [
    {
      name: "state", label: "State", type: "select", required: true, default: "TX",
      options: [
        { value: "CA", label: "California" }, { value: "NY", label: "New York" }, { value: "TX", label: "Texas" },
        { value: "FL", label: "Florida" }, { value: "IL", label: "Illinois" }, { value: "NJ", label: "New Jersey" },
        { value: "PA", label: "Pennsylvania" }, { value: "MI", label: "Michigan" }, { value: "MA", label: "Massachusetts" },
        { value: "WA", label: "Washington" }, { value: "other", label: "Other / not listed" },
      ],
    },
    { name: "homeValue", label: "Home market value", type: "currency", required: true, default: 350000, min: 0, max: 10000000, step: 5000 },
  ],
  tables: {
    // Average effective property-tax rate (% of market value), approximate.
    effRate: { NJ: 2.23, IL: 2.08, NY: 1.40, TX: 1.68, FL: 0.86, PA: 1.49, MI: 1.38, MA: 1.14, WA: 0.87, CA: 0.71, other: 1.10 },
  },
  derived: [
    { name: "rate", expr: { lookup: "effRate", key: { var: "state" } } },
    { name: "annualTax", expr: { op: "/", args: [{ op: "*", args: [{ var: "homeValue" }, { var: "rate" }] }, 100] } },
    { name: "monthlyTax", expr: { op: "/", args: [{ var: "annualTax" }, 12] } },
  ],
  outputs: [
    { name: "annualTax", label: "Estimated annual property tax", expr: { var: "annualTax" }, format: "currency", primary: true, note: "Based on your state's average effective rate; your county/city rate and exemptions will change this." },
    { name: "monthlyTax", label: "Estimated monthly (for escrow)", expr: { var: "monthlyTax" }, format: "currency" },
    { name: "rate", label: "Effective rate used", expr: { var: "rate" }, format: "percent" },
  ],
  sources: [{ title: "Property taxes by state", url: "https://taxfoundation.org/data/all/state/property-taxes-by-state-county/", publisher: "Tax Foundation", retrieved: "2026-06-09" }],
  disclaimer: "Estimate only, using state average effective rates. Actual property tax depends on your county/city millage, assessed value, and exemptions. Check your county assessor for exact figures.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [{ name: "TX 300k", inputs: { state: "TX", homeValue: 300000 }, expect: { annualTax: 5040 } }],
};

// ---------------------------------------------------------------------------
// Homestead Exemption Checker
// ---------------------------------------------------------------------------
export const usHomestead: CalculatorDefinition = {
  id: "us-homestead",
  type: "both",
  region: "US",
  jurisdictionLevel: "state",
  category: "property-tax",
  slug: "us-homestead-exemption",
  title: "Homestead Exemption Checker",
  description:
    "Check whether you likely qualify for a homestead property-tax exemption and estimate the annual saving in your state.",
  inputs: [
    {
      name: "state", label: "State", type: "select", required: true, default: "FL",
      options: [
        { value: "FL", label: "Florida" }, { value: "TX", label: "Texas" }, { value: "IL", label: "Illinois" },
        { value: "NY", label: "New York" }, { value: "CA", label: "California" }, { value: "other", label: "Other / not listed" },
      ],
    },
    { name: "primaryResidence", label: "This is my primary residence", type: "boolean", default: true, help: "Homestead exemptions generally require the home to be your main residence." },
  ],
  tables: {
    exemption: { FL: 50000, TX: 100000, IL: 10000, NY: 30000, CA: 7000, other: 0 },
    effRate: { FL: 0.86, TX: 1.68, IL: 2.08, NY: 1.40, CA: 0.71, other: 1.1 },
  },
  derived: [
    { name: "exemption", expr: { lookup: "exemption", key: { var: "state" } } },
    { name: "rate", expr: { lookup: "effRate", key: { var: "state" } } },
    { name: "estSaving", expr: { op: "/", args: [{ op: "*", args: [{ var: "exemption" }, { var: "rate" }] }, 100] } },
  ],
  outputs: [
    { name: "estSaving", label: "Estimated annual saving", expr: { var: "estSaving" }, format: "currency", primary: true, note: "Exemption amount × your state's average effective rate. Local amounts and extra senior/veteran exemptions vary." },
    { name: "exemption", label: "Typical homestead exemption", expr: { var: "exemption" }, format: "currency" },
  ],
  eligibility: [
    { status: "likely_not_eligible", when: { not: { var: "primaryResidence" } }, confidence: "high", reason: "Homestead exemptions require the property to be your primary residence." },
    { status: "likely_qualifies", when: { cmp: ">", left: { var: "exemption" }, right: 0 }, confidence: "medium", reason: "Your state offers a homestead exemption for primary residences — apply through your county assessor." },
    { status: "need_local_review", when: true, confidence: "low", reason: "Homestead relief in your state varies by locality — check with your county assessor." },
  ],
  documents: ["Proof the home is your primary residence", "Deed or property tax bill", "Government-issued ID with the property address"],
  sources: [{ title: "Property tax exemptions overview", url: "https://www.irs.gov/credits-deductions/individuals", publisher: "Reference", retrieved: "2026-06-09" }],
  disclaimer: "Estimate only. Homestead exemption rules, amounts, and deadlines are set by your state and county. Confirm with your local assessor before relying on these figures.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [{ name: "FL primary", inputs: { state: "FL", primaryResidence: true }, expect: { estSaving: 430, exemption: 50000 } }],
};

// ---------------------------------------------------------------------------
// US Salary After Tax (federal + FICA)
// ---------------------------------------------------------------------------
export const usSalaryAfterTax: CalculatorDefinition = {
  id: "us-salary-after-tax",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "salary",
  slug: "us-salary-after-tax",
  title: "US Salary After Tax (2025)",
  description:
    "Estimate your take-home pay after federal income tax and FICA (Social Security + Medicare) for 2025. Excludes state and local tax.",
  taxYear: 2025,
  inputs: [
    { name: "filingStatus", label: "Filing status", type: "select", required: true, default: "single", options: [{ value: "single", label: "Single" }, { value: "mfj", label: "Married filing jointly" }] },
    { name: "gross", label: "Gross annual salary", type: "currency", required: true, default: 60000, min: 0, max: 2000000, step: 1000 },
  ],
  tables: US_BRACKET_TABLES,
  derived: [
    ...bracketDerived,
    { name: "taxable", expr: { op: "max", args: [0, { op: "-", args: [{ var: "gross" }, { var: "stdDed" }] }] } },
    { name: "federalTax", expr: federalTaxExpr },
    { name: "ss", expr: { op: "*", args: [{ op: "min", args: [{ var: "gross" }, 176100] }, 0.062] } },
    { name: "medicare", expr: { op: "*", args: [{ var: "gross" }, 0.0145] } },
    { name: "addlMedThreshold", expr: { if: { cmp: "==", left: { var: "filingStatus" }, right: "mfj" }, then: 250000, else: 200000 } },
    { name: "addlMedicare", expr: { op: "*", args: [{ op: "max", args: [0, { op: "-", args: [{ var: "gross" }, { var: "addlMedThreshold" }] }] }, 0.009] } },
    { name: "fica", expr: { op: "+", args: [{ var: "ss" }, { var: "medicare" }, { var: "addlMedicare" }] } },
    { name: "totalTax", expr: { op: "+", args: [{ var: "federalTax" }, { var: "fica" }] } },
    { name: "takeHome", expr: { op: "-", args: [{ var: "gross" }, { var: "totalTax" }] } },
    { name: "monthly", expr: { op: "/", args: [{ var: "takeHome" }, 12] } },
  ],
  outputs: [
    { name: "takeHome", label: "Annual take-home pay", expr: { var: "takeHome" }, format: "currency", primary: true, note: "After federal income tax + FICA. Excludes state/local tax, 401(k), and benefits." },
    { name: "monthly", label: "Monthly take-home", expr: { var: "monthly" }, format: "currency" },
    { name: "federalTax", label: "Federal income tax", expr: { var: "federalTax" }, format: "currency" },
    { name: "fica", label: "FICA (Social Security + Medicare)", expr: { var: "fica" }, format: "currency" },
  ],
  sources: [
    { title: "Federal income tax rates and brackets", url: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets", publisher: "IRS", retrieved: "2026-06-09" },
    { title: "Social Security & Medicare withholding rates", url: "https://www.irs.gov/taxtopics/tc751", publisher: "IRS", retrieved: "2026-06-09" },
  ],
  disclaimer: "Estimate only — federal income tax (standard deduction) plus FICA. Excludes state/local income tax, pre-tax deductions, and credits. Not tax advice.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [{ name: "single 60k", inputs: { filingStatus: "single", gross: 60000 }, expect: { federalTax: 5071.5, fica: 4590, takeHome: 50338.5 } }],
};

// ---------------------------------------------------------------------------
// US Earned Income Tax Credit (2025)
// ---------------------------------------------------------------------------
export const usEitc: CalculatorDefinition = {
  id: "us-eitc",
  type: "both",
  region: "US",
  jurisdictionLevel: "federal",
  category: "tax-credits",
  slug: "us-eitc",
  title: "Earned Income Tax Credit (EITC) Estimator 2025",
  description:
    "Estimate your 2025 Earned Income Tax Credit and check whether you likely qualify, based on earned income, AGI, filing status, and qualifying children.",
  taxYear: 2025,
  inputs: [
    { name: "filingStatus", label: "Filing status", type: "select", required: true, default: "single", options: [{ value: "single", label: "Single / Head of household" }, { value: "mfj", label: "Married filing jointly" }] },
    { name: "qualifyingChildren", label: "Qualifying children", type: "integer", required: true, default: 1, min: 0, max: 6, step: 1 },
    { name: "earnedIncome", label: "Earned income (wages, self-employment)", type: "currency", required: true, default: 20000, min: 0, max: 100000, step: 500 },
    { name: "agi", label: "Adjusted gross income (AGI)", type: "currency", required: true, default: 20000, min: 0, max: 100000, step: 500 },
    { name: "investmentIncome", label: "Investment income", type: "currency", default: 0, min: 0, max: 50000, step: 100, help: "Investment income above $11,950 (2025) disqualifies you entirely." },
  ],
  tables: {
    maxCredit: { "0": 649, "1": 4328, "2": 7152, "3": 8046 },
    phaseIn: { "0": 0.0765, "1": 0.34, "2": 0.4, "3": 0.45 },
    phaseOutRate: { "0": 0.0765, "1": 0.1598, "2": 0.2106, "3": 0.2106 },
    completedSingle: { "0": 19104, "1": 50434, "2": 57310, "3": 61555 },
    completedMfj: { "0": 26214, "1": 57554, "2": 64430, "3": 68675 },
  },
  derived: [
    { name: "bucket", expr: { op: "min", args: [{ var: "qualifyingChildren" }, 3] } },
    { name: "maxCredit", expr: { lookup: "maxCredit", key: { var: "bucket" } } },
    { name: "phaseInRate", expr: { lookup: "phaseIn", key: { var: "bucket" } } },
    { name: "poRate", expr: { lookup: "phaseOutRate", key: { var: "bucket" } } },
    { name: "completed", expr: { if: { cmp: "==", left: { var: "filingStatus" }, right: "mfj" }, then: { lookup: "completedMfj", key: { var: "bucket" } }, else: { lookup: "completedSingle", key: { var: "bucket" } } } },
    { name: "poThreshold", expr: { op: "-", args: [{ var: "completed" }, { op: "/", args: [{ var: "maxCredit" }, { var: "poRate" }] }] } },
    { name: "creditBefore", expr: { op: "min", args: [{ var: "maxCredit" }, { op: "*", args: [{ var: "earnedIncome" }, { var: "phaseInRate" }] }] } },
    { name: "incomeForPO", expr: { op: "max", args: [{ var: "earnedIncome" }, { var: "agi" }] } },
    { name: "reduction", expr: { op: "max", args: [0, { op: "*", args: [{ op: "-", args: [{ var: "incomeForPO" }, { var: "poThreshold" }] }, { var: "poRate" }] }] } },
    { name: "creditAfter", expr: { op: "max", args: [0, { op: "min", args: [{ var: "creditBefore" }, { op: "-", args: [{ var: "maxCredit" }, { var: "reduction" }] }] }] } },
    { name: "credit", expr: { if: { cmp: ">", left: { var: "investmentIncome" }, right: 11950 }, then: 0, else: { var: "creditAfter" } } },
  ],
  outputs: [
    { name: "credit", label: "Estimated EITC", expr: { var: "credit" }, format: "currency", primary: true, note: "Fully refundable. Actual amount depends on your full return." },
    { name: "maxCredit", label: "Maximum for your family size", expr: { var: "maxCredit" }, format: "currency" },
  ],
  eligibility: [
    { status: "likely_not_eligible", when: { cmp: ">", left: { var: "investmentIncome" }, right: 11950 }, confidence: "high", reason: "Investment income above $11,950 (2025) disqualifies you from the EITC." },
    { status: "likely_qualifies", when: { cmp: ">", left: { var: "credit" }, right: 0 }, confidence: "high", reason: "Based on your income and family size, you likely qualify for the EITC." },
    { status: "likely_not_eligible", when: true, confidence: "high", reason: "Your income is above the EITC limit for your family size, so the credit phases out to zero." },
  ],
  sources: [{ title: "EITC tables", url: "https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/earned-income-and-earned-income-tax-credit-eitc-tables", publisher: "IRS", retrieved: "2026-06-09" }],
  disclaimer: "Estimate only. EITC eligibility also depends on residency, a valid SSN, and other rules. Confirm with the IRS or a tax professional.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [
    { name: "1 child 15k", inputs: { filingStatus: "single", qualifyingChildren: 1, earnedIncome: 15000, agi: 15000, investmentIncome: 0 }, expect: { credit: 4328 } },
    { name: "0 kids 30k", inputs: { filingStatus: "single", qualifyingChildren: 0, earnedIncome: 30000, agi: 30000, investmentIncome: 0 }, expect: { credit: 0 } },
  ],
};

// ---------------------------------------------------------------------------
// UK Universal Credit (simplified)
// ---------------------------------------------------------------------------
export const ukUniversalCredit: CalculatorDefinition = {
  id: "uk-universal-credit",
  type: "both",
  region: "UK",
  jurisdictionLevel: "federal",
  category: "benefits",
  slug: "uk-universal-credit",
  title: "Universal Credit Estimator (2025/26)",
  description:
    "A simplified estimate of your monthly Universal Credit based on the 2025/26 standard allowance, child elements, and the earnings taper.",
  benefitYear: 2025,
  inputs: [
    { name: "relationship", label: "Your situation", type: "select", required: true, default: "single", options: [{ value: "single", label: "Single" }, { value: "couple", label: "Couple" }] },
    { name: "age25plus", label: "You (or your partner) are 25 or over", type: "boolean", default: true },
    { name: "children", label: "Number of children", type: "integer", default: 1, min: 0, max: 6, step: 1, help: "The two-child limit applies to most children born after 6 April 2017." },
    { name: "monthlyEarnings", label: "Monthly take-home earnings", type: "currency", default: 0, min: 0, max: 10000, step: 50 },
    { name: "otherMonthlyIncome", label: "Other monthly income", type: "currency", default: 0, min: 0, max: 10000, step: 50 },
  ],
  derived: [
    {
      name: "standardAllowance",
      expr: {
        if: { cmp: "==", left: { var: "relationship" }, right: "couple" },
        then: { if: { var: "age25plus" }, then: 628.1, else: 497.55 },
        else: { if: { var: "age25plus" }, then: 400.14, else: 316.98 },
      },
    },
    { name: "childElement", expr: { op: "+", args: [{ if: { cmp: ">=", left: { var: "children" }, right: 1 }, then: 333.33, else: 0 }, { if: { cmp: ">=", left: { var: "children" }, right: 2 }, then: 287.92, else: 0 }] } },
    { name: "maxUC", expr: { op: "+", args: [{ var: "standardAllowance" }, { var: "childElement" }] } },
    { name: "workAllowance", expr: { if: { cmp: ">", left: { var: "children" }, right: 0 }, then: 411, else: 0 } },
    { name: "taper", expr: { op: "*", args: [{ op: "max", args: [0, { op: "-", args: [{ var: "monthlyEarnings" }, { var: "workAllowance" }] }] }, 0.55] } },
    { name: "uc", expr: { op: "max", args: [0, { op: "-", args: [{ var: "maxUC" }, { var: "taper" }, { var: "otherMonthlyIncome" }] }] } },
  ],
  outputs: [
    { name: "uc", label: "Estimated monthly Universal Credit", expr: { var: "uc" }, format: "currency", primary: true, note: "Simplified — excludes housing, childcare, disability and carer elements, and capital over £16,000." },
    { name: "maxUC", label: "Maximum (before income)", expr: { var: "maxUC" }, format: "currency" },
  ],
  eligibility: [
    { status: "likely_qualifies", when: { cmp: ">", left: { var: "uc" }, right: 0 }, confidence: "medium", reason: "Based on these figures you'd likely receive some Universal Credit. Housing and other elements could increase it." },
    { status: "likely_not_eligible", when: true, confidence: "medium", reason: "Your income may be too high for Universal Credit on these inputs — but housing and childcare costs can change this." },
  ],
  sources: [{ title: "Universal Credit", url: "https://www.gov.uk/universal-credit", publisher: "GOV.UK", retrieved: "2026-06-09" }],
  disclaimer: "Simplified estimate only. Real Universal Credit depends on housing costs, childcare, disability, savings, and your exact circumstances. Use the official GOV.UK service or a benefits calculator for an accurate figure.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [
    { name: "single 25+ 0 kids", inputs: { relationship: "single", age25plus: true, children: 0, monthlyEarnings: 0, otherMonthlyIncome: 0 }, expect: { uc: 400.14 } },
    { name: "single 1 child earn 800", inputs: { relationship: "single", age25plus: true, children: 1, monthlyEarnings: 800, otherMonthlyIncome: 0 }, expect: { uc: 519.52 } },
  ],
};

// ---------------------------------------------------------------------------
// UK Council Tax Reduction (eligibility pre-check + rough estimate)
// ---------------------------------------------------------------------------
export const ukCouncilTaxReduction: CalculatorDefinition = {
  id: "uk-council-tax",
  type: "both",
  region: "UK",
  jurisdictionLevel: "city",
  category: "property-tax",
  slug: "uk-council-tax-reduction",
  title: "Council Tax Reduction Checker",
  description:
    "Check whether you likely qualify for Council Tax Reduction and get a rough estimate of the discount. Each council sets its own scheme, so treat the amount as indicative.",
  inputs: [
    { name: "liable", label: "I am liable for Council Tax at my home", type: "boolean", default: true },
    { name: "savingsOver16k", label: "Savings/capital over £16,000", type: "boolean", default: false, help: "Working-age people with over £16,000 are usually excluded (pensioners on Guarantee Credit are an exception)." },
    { name: "pensioner", label: "Pension age", type: "boolean", default: false },
    { name: "monthlyIncome", label: "Monthly household income", type: "currency", default: 1200, min: 0, max: 8000, step: 50 },
    { name: "annualCouncilTax", label: "Annual Council Tax bill", type: "currency", default: 1800, min: 0, max: 6000, step: 50 },
  ],
  derived: [
    { name: "maxPct", expr: { if: { var: "pensioner" }, then: 100, else: 80 } },
    { name: "excluded", expr: { any: [{ not: { var: "liable" } }, { all: [{ var: "savingsOver16k" }, { not: { var: "pensioner" } }] }] } },
    { name: "rawPct", expr: { op: "*", args: [{ var: "maxPct" }, { op: "/", args: [{ op: "-", args: [2600, { var: "monthlyIncome" }] }, 1500] }] } },
    { name: "pct", expr: { if: { var: "excluded" }, then: 0, else: { op: "clamp", args: [{ var: "rawPct" }, 0, { var: "maxPct" }] } } },
    { name: "estReduction", expr: { op: "/", args: [{ op: "*", args: [{ var: "annualCouncilTax" }, { var: "pct" }] }, 100] } },
  ],
  outputs: [
    { name: "estReduction", label: "Estimated annual reduction", expr: { var: "estReduction" }, format: "currency", primary: true, note: "Rough estimate only — your council sets the actual scheme and may differ significantly." },
    { name: "pct", label: "Estimated reduction", expr: { var: "pct" }, format: "percent" },
  ],
  eligibility: [
    { status: "likely_not_eligible", when: { var: "excluded" }, confidence: "high", reason: "On these inputs you're likely excluded (not liable, or working-age with savings over £16,000)." },
    { status: "likely_qualifies", when: { cmp: ">=", left: { var: "pct" }, right: 50 }, confidence: "low", reason: "Your income suggests a substantial reduction may be available — apply through your local council." },
    { status: "may_qualify", when: { cmp: ">", left: { var: "pct" }, right: 0 }, confidence: "low", reason: "You may qualify for a partial reduction; the exact amount is set by your council." },
    { status: "likely_not_eligible", when: true, confidence: "low", reason: "Your income looks too high for a reduction under a typical scheme, but local schemes vary." },
  ],
  sources: [{ title: "Apply for Council Tax Reduction", url: "https://www.gov.uk/apply-council-tax-reduction", publisher: "GOV.UK", retrieved: "2026-06-09" }],
  disclaimer: "Indicative only. Council Tax Reduction schemes are set by each local council and vary widely. Apply through your council and use their calculator for an accurate figure.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [{ name: "pensioner low income", inputs: { liable: true, savingsOver16k: false, pensioner: true, monthlyIncome: 800, annualCouncilTax: 1800 }, expect: { pct: 100, estReduction: 1800 } }],
};

// ---------------------------------------------------------------------------
// Canada Child Benefit (July 2025 – June 2026)
// ---------------------------------------------------------------------------
export const caChildBenefit: CalculatorDefinition = {
  id: "ca-child-benefit",
  type: "estimate",
  region: "CA",
  jurisdictionLevel: "federal",
  category: "benefits",
  slug: "ca-child-benefit",
  title: "Canada Child Benefit Calculator (2025–26)",
  description:
    "Estimate your monthly Canada Child Benefit for July 2025–June 2026 based on your adjusted family net income and number of children.",
  benefitYear: 2025,
  inputs: [
    { name: "childrenUnder6", label: "Children under 6", type: "integer", default: 1, min: 0, max: 8, step: 1 },
    { name: "children6to17", label: "Children aged 6 to 17", type: "integer", default: 1, min: 0, max: 8, step: 1 },
    { name: "afni", label: "Adjusted family net income (AFNI)", type: "currency", required: true, default: 50000, min: 0, max: 300000, step: 1000 },
  ],
  tables: {
    rate1: { "1": 0.07, "2": 0.135, "3": 0.19, "4": 0.23 },
    rate2: { "1": 0.032, "2": 0.057, "3": 0.08, "4": 0.095 },
  },
  derived: [
    { name: "maxBenefit", expr: { op: "+", args: [{ op: "*", args: [{ var: "childrenUnder6" }, 7997] }, { op: "*", args: [{ var: "children6to17" }, 6748] }] } },
    { name: "totalChildren", expr: { op: "+", args: [{ var: "childrenUnder6" }, { var: "children6to17" }] } },
    { name: "bucket", expr: { op: "min", args: [{ var: "totalChildren" }, 4] } },
    {
      name: "reduction",
      expr: {
        if: { cmp: "==", left: { var: "totalChildren" }, right: 0 },
        then: 0,
        else: {
          if: { cmp: "<=", left: { var: "afni" }, right: 37487 },
          then: 0,
          else: {
            if: { cmp: "<=", left: { var: "afni" }, right: 81222 },
            then: { op: "*", args: [{ op: "-", args: [{ var: "afni" }, 37487] }, { lookup: "rate1", key: { var: "bucket" } }] },
            else: {
              op: "+",
              args: [
                { op: "*", args: [43735, { lookup: "rate1", key: { var: "bucket" } }] },
                { op: "*", args: [{ op: "-", args: [{ var: "afni" }, 81222] }, { lookup: "rate2", key: { var: "bucket" } }] },
              ],
            },
          },
        },
      },
    },
    { name: "annual", expr: { op: "max", args: [0, { op: "-", args: [{ var: "maxBenefit" }, { var: "reduction" }] }] } },
    { name: "monthly", expr: { op: "/", args: [{ var: "annual" }, 12] } },
  ],
  outputs: [
    { name: "annual", label: "Estimated annual CCB", expr: { var: "annual" }, format: "currency", primary: true },
    { name: "monthly", label: "Estimated monthly CCB", expr: { var: "monthly" }, format: "currency" },
    { name: "maxBenefit", label: "Maximum (before income reduction)", expr: { var: "maxBenefit" }, format: "currency" },
  ],
  sources: [{ title: "Canada Child Benefit — how much you can get", url: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit/how-much.html", publisher: "Canada Revenue Agency", retrieved: "2026-06-09" }],
  disclaimer: "Estimate only for the July 2025–June 2026 benefit year. Excludes the Child Disability Benefit and provincial top-ups. Confirm with the CRA.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [
    { name: "2 under6 afni 30k", inputs: { childrenUnder6: 2, children6to17: 0, afni: 30000 }, expect: { annual: 15994 } },
    { name: "1+1 afni 50k", inputs: { childrenUnder6: 1, children6to17: 1, afni: 50000 }, expect: { annual: 13055.74 } },
  ],
};

// ---------------------------------------------------------------------------
// Canada GST/HST Credit (simplified, 2025–26)
// ---------------------------------------------------------------------------
export const caGstHst: CalculatorDefinition = {
  id: "ca-gst-hst",
  type: "estimate",
  region: "CA",
  jurisdictionLevel: "federal",
  category: "tax-credits",
  slug: "ca-gst-hst-credit",
  title: "GST/HST Credit Estimator (2025–26)",
  description:
    "Estimate your annual GST/HST credit for July 2025–June 2026 based on your family situation and adjusted family net income.",
  benefitYear: 2025,
  inputs: [
    { name: "married", label: "Married or common-law", type: "boolean", default: false },
    { name: "children", label: "Children under 19", type: "integer", default: 0, min: 0, max: 8, step: 1 },
    { name: "afni", label: "Adjusted family net income (AFNI)", type: "currency", required: true, default: 30000, min: 0, max: 100000, step: 1000 },
  ],
  derived: [
    { name: "base", expr: { op: "+", args: [{ if: { var: "married" }, then: 698, else: 533 }, { op: "*", args: [{ var: "children" }, 184] }] } },
    { name: "reduction", expr: { op: "max", args: [0, { op: "*", args: [{ op: "-", args: [{ var: "afni" }, 45521] }, 0.05] }] } },
    { name: "annual", expr: { op: "max", args: [0, { op: "-", args: [{ var: "base" }, { var: "reduction" }] }] } },
    { name: "quarterly", expr: { op: "/", args: [{ var: "annual" }, 4] } },
  ],
  outputs: [
    { name: "annual", label: "Estimated annual GST/HST credit", expr: { var: "annual" }, format: "currency", primary: true },
    { name: "quarterly", label: "Per quarterly payment", expr: { var: "quarterly" }, format: "currency" },
  ],
  sources: [{ title: "GST/HST credit — how much you can get", url: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/gst-hst-credit/how-much.html", publisher: "Canada Revenue Agency", retrieved: "2026-06-09" }],
  disclaimer: "Simplified estimate for the July 2025–June 2026 period. The single-supplement phase-in and provincial credits are approximated. Confirm with the CRA.",
  version: "1.0.0", effectiveYear: 2025, lastVerified: "2026-06-09",
  tests: [
    { name: "single afni 20k", inputs: { married: false, children: 0, afni: 20000 }, expect: { annual: 533 } },
    { name: "couple 2 kids 50k", inputs: { married: true, children: 2, afni: 50000 }, expect: { annual: 842.05 } },
  ],
};

export const ROADMAP_CALCULATORS: CalculatorDefinition[] = [
  usPropertyTax,
  usHomestead,
  usSalaryAfterTax,
  usEitc,
  ukUniversalCredit,
  ukCouncilTaxReduction,
  caChildBenefit,
  caGstHst,
];
