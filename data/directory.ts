// Unified catalog for the calculator directory page.
// Combines the new rules-engine calculators, the flagship roadmap (coming soon),
// and the existing 38 calculators - all mapped to a single card shape.

import { calculators as legacyCalculators } from "./calculators";

export type DirectoryCategory =
  | "benefits"
  | "property-tax"
  | "tax-credits"
  | "tax"
  | "salary"
  | "finance"
  | "engineering"
  | "health"
  | "math"
  | "date"
  | "developer"
  | "everyday"
  | "converters";

export type DirectoryRegion = "US" | "UK" | "CA" | "Global";

export interface DirectoryEntry {
  id: string;
  name: string;
  description: string;
  href: string;
  category: DirectoryCategory;
  region: DirectoryRegion;
  minutes: number;
  badge: "official" | "institutional";
  icon: string; // Material Symbols name
  live: boolean;
  cta?: string;
}

export const CATEGORY_LABELS: Record<DirectoryCategory, string> = {
  benefits: "Benefits & Eligibility",
  "property-tax": "Property Tax",
  "tax-credits": "Tax Credits",
  tax: "Taxes",
  salary: "Salary & Wages",
  finance: "Finance & Loans",
  engineering: "Engineering",
  health: "Health",
  math: "Math",
  date: "Date & Time",
  developer: "Developer",
  everyday: "Everyday",
  converters: "Conversion",
};

const CATEGORY_ICON: Record<string, string> = {
  benefits: "family_restroom",
  "property-tax": "home_work",
  "tax-credits": "payments",
  tax: "receipt_long",
  salary: "account_balance_wallet",
  finance: "account_balance",
  engineering: "engineering",
  health: "monitor_heart",
  math: "functions",
  date: "calendar_today",
  developer: "code",
  everyday: "receipt_long",
  converters: "swap_horiz",
};

// 1. Live rules-engine calculators
const engineEntries: DirectoryEntry[] = [
  {
    id: "us_child_tax_credit_2025",
    name: "US Child Tax Credit (2025)",
    description:
      "Estimate your 2025 Child Tax Credit, see how much could be refundable, and check whether you likely qualify.",
    href: "/calculators/benefits/us-child-tax-credit",
    category: "benefits",
    region: "US",
    minutes: 4,
    badge: "official",
    icon: "family_restroom",
    live: true,
    cta: "Check Eligibility",
  },
  {
    id: "credit-card-payoff",
    name: "Credit Card Payoff & APR",
    description:
      "See how long it takes to clear a credit card balance, the total interest at your APR, and the payoff date.",
    href: "/calc/credit-card-payoff",
    category: "finance",
    region: "Global",
    minutes: 2,
    badge: "institutional",
    icon: "credit_card",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "loan-emi",
    name: "Loan EMI Calculator",
    description:
      "Calculate the monthly EMI, total interest, and total payable for any loan amount, rate, and term.",
    href: "/calc/loan-emi",
    category: "finance",
    region: "Global",
    minutes: 2,
    badge: "institutional",
    icon: "payments",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "compound-interest",
    name: "Compound Interest Calculator",
    description:
      "Project how savings grow with compound interest and optional monthly contributions over time.",
    href: "/calc/compound-interest",
    category: "finance",
    region: "Global",
    minutes: 2,
    badge: "institutional",
    icon: "trending_up",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "us-income-tax",
    name: "US Federal Income Tax (2025)",
    description:
      "Estimate your 2025 federal income tax and take-home pay using the standard deduction and tax brackets.",
    href: "/calc/us-income-tax",
    category: "tax-credits",
    region: "US",
    minutes: 3,
    badge: "official",
    icon: "receipt_long",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "ohms-law",
    name: "Ohm's Law Calculator",
    description:
      "Solve voltage, current, resistance, and power from any two known values (V = I × R, P = V × I).",
    href: "/calc/ohms-law",
    category: "engineering",
    region: "Global",
    minutes: 1,
    badge: "institutional",
    icon: "bolt",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "uk-vat",
    name: "UK VAT Calculator",
    description:
      "Add or remove VAT at 20%, 5%, or 0%. See the net price, the VAT amount, and the gross total instantly.",
    href: "/calc/uk-vat-calculator",
    category: "tax",
    region: "UK",
    minutes: 1,
    badge: "official",
    icon: "receipt_long",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "us-sales-tax",
    name: "US Sales Tax Calculator",
    description:
      "Work out sales tax and the total price using your state's base rate plus any local city or county rate.",
    href: "/calc/us-sales-tax-calculator",
    category: "tax",
    region: "US",
    minutes: 1,
    badge: "official",
    icon: "receipt_long",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "uk-salary-after-tax",
    name: "UK Salary After Tax (2025/26)",
    description:
      "Estimate your UK take-home pay after Income Tax and National Insurance for the 2025/26 tax year.",
    href: "/calc/uk-salary-after-tax",
    category: "salary",
    region: "UK",
    minutes: 2,
    badge: "official",
    icon: "account_balance_wallet",
    live: true,
    cta: "Open Calculator",
  },
  {
    id: "us-self-employment-tax",
    name: "US Self-Employment Tax (2025)",
    description:
      "Estimate the Social Security and Medicare tax on your self-employment net profit, plus the deductible half.",
    href: "/calc/us-self-employment-tax",
    category: "tax",
    region: "US",
    minutes: 2,
    badge: "official",
    icon: "work",
    live: true,
    cta: "Open Calculator",
  },
];

// 2. Regional calculators (now live, built on the engine).
const roadmap: Omit<DirectoryEntry, "icon" | "live">[] = [
  { id: "us-property-tax", name: "US Property Tax Estimator", description: "Estimate annual property tax by state and home value using average effective rates.", href: "/calc/us-property-tax", category: "property-tax", region: "US", minutes: 3, badge: "official", cta: "Open Calculator" },
  { id: "us-homestead", name: "Homestead Exemption Checker", description: "See if you qualify for a homestead exemption and the potential annual saving in your state.", href: "/calc/us-homestead-exemption", category: "property-tax", region: "US", minutes: 3, badge: "official", cta: "Check Eligibility" },
  { id: "us-salary-after-tax", name: "US Salary After Tax (2025)", description: "Estimate take-home pay after federal income tax and FICA (Social Security + Medicare).", href: "/calc/us-salary-after-tax", category: "salary", region: "US", minutes: 2, badge: "official", cta: "Open Calculator" },
  { id: "us-eitc", name: "Earned Income Tax Credit (2025)", description: "Check eligibility and estimate your EITC based on income and qualifying children.", href: "/calc/us-eitc", category: "tax-credits", region: "US", minutes: 4, badge: "official", cta: "Check Eligibility" },
  { id: "uk-universal-credit", name: "Universal Credit Estimator", description: "Estimate your monthly Universal Credit from the 2025/26 allowances and earnings taper.", href: "/calc/uk-universal-credit", category: "benefits", region: "UK", minutes: 4, badge: "official", cta: "Open Calculator" },
  { id: "uk-council-tax", name: "Council Tax Reduction Checker", description: "Check whether you likely qualify for a Council Tax Reduction and a rough estimate.", href: "/calc/uk-council-tax-reduction", category: "property-tax", region: "UK", minutes: 3, badge: "official", cta: "Check Eligibility" },
  { id: "ca-child-benefit", name: "Canada Child Benefit (2025-26)", description: "Estimate your monthly CCB from adjusted family net income and number of children.", href: "/calc/ca-child-benefit", category: "benefits", region: "CA", minutes: 3, badge: "official", cta: "Open Calculator" },
  { id: "ca-gst-hst", name: "GST/HST Credit Estimator", description: "Estimate your GST/HST credit from your family situation and income.", href: "/calc/ca-gst-hst-credit", category: "tax-credits", region: "CA", minutes: 2, badge: "official", cta: "Open Calculator" },
];

const roadmapEntries: DirectoryEntry[] = roadmap.map((r) => ({
  ...r,
  icon: CATEGORY_ICON[r.category] ?? "calculate",
  live: true,
}));

// 3. Existing calculators
const legacyEntries: DirectoryEntry[] = legacyCalculators.map((c) => ({
  id: c.id,
  name: c.name,
  description: c.description,
  href: `/calculators/${c.category}/${c.slug}`,
  category: c.category as DirectoryCategory,
  region: "Global",
  minutes: 2,
  badge: "institutional",
  icon: CATEGORY_ICON[c.category] ?? "calculate",
  live: true,
  cta: "Open Calculator",
}));

export const DIRECTORY: DirectoryEntry[] = [...engineEntries, ...roadmapEntries, ...legacyEntries];

export const DIRECTORY_CATEGORIES: DirectoryCategory[] = Array.from(
  new Set(DIRECTORY.map((d) => d.category))
) as DirectoryCategory[];
