// UK Stamp Duty Land Tax (SDLT) for England & Northern Ireland, standard rates
// from 1 April 2025. Covers standard purchases, first-time-buyer relief, and the
// additional-property surcharge (+5%). Scotland (LBTT) and Wales (LTT) differ.
import type { CalculatorDefinition, Expr } from "@/lib/engine/types";
import { progressive, NO_CAP } from "@/lib/engine/bands";

const standardTax = progressive("price", [
  [0, 0, 125000],
  [0.02, 125000, 250000],
  [0.05, 250000, 925000],
  [0.1, 925000, 1500000],
  [0.12, 1500000, NO_CAP],
]);

// Additional property (second home / buy-to-let): standard + 5% on every band.
const additionalTax = progressive("price", [
  [0.05, 0, 125000],
  [0.07, 125000, 250000],
  [0.1, 250000, 925000],
  [0.15, 925000, 1500000],
  [0.17, 1500000, NO_CAP],
]);

// First-time buyer relief applies only when price <= 500,000.
const ftbReliefTax = progressive("price", [
  [0, 0, 300000],
  [0.05, 300000, 500000],
]);

const ftbTax: Expr = {
  if: { cmp: "<=", left: { var: "price" }, right: 500000 },
  then: ftbReliefTax,
  else: standardTax,
};

const taxExpr: Expr = {
  if: { cmp: "==", left: { var: "buyerType" }, right: "additional" },
  then: additionalTax,
  else: {
    if: { cmp: "==", left: { var: "buyerType" }, right: "firstTime" },
    then: ftbTax,
    else: standardTax,
  },
};

export const ukStampDuty: CalculatorDefinition = {
  id: "uk-stamp-duty",
  type: "estimate",
  region: "UK",
  jurisdictionLevel: "federal",
  category: "property-tax",
  slug: "uk-stamp-duty-calculator",
  title: "UK Stamp Duty Calculator (SDLT 2025)",
  description:
    "Estimate Stamp Duty Land Tax (SDLT) on a residential property purchase in England or Northern Ireland, including first-time-buyer relief and the additional-property surcharge.",
  effectiveYear: 2025,
  inputs: [
    { name: "price", label: "Purchase price", type: "currency", required: true, default: 350000, min: 0, max: 20000000, step: 1000 },
    {
      name: "buyerType", label: "Buyer type", type: "select", required: true, default: "standard",
      options: [
        { value: "standard", label: "Next home (replacing main residence)" },
        { value: "firstTime", label: "First-time buyer" },
        { value: "additional", label: "Additional property (second home / buy-to-let)" },
      ],
    },
  ],
  derived: [
    { name: "tax", expr: taxExpr },
    { name: "effectiveRate", expr: { if: { cmp: ">", left: { var: "price" }, right: 0 }, then: { op: "/", args: [{ op: "*", args: [{ var: "tax" }, 100] }, { var: "price" }] }, else: 0 } },
  ],
  outputs: [
    { name: "tax", label: "Stamp Duty (SDLT)", expr: { var: "tax" }, format: "currency", primary: true, note: "Standard SDLT rates for England and Northern Ireland from 1 April 2025." },
    { name: "effectiveRate", label: "Effective rate", expr: { var: "effectiveRate" }, format: "percent" },
  ],
  faqs: [
    { question: "What are the 2025 SDLT thresholds?", answer: "From 1 April 2025: 0% up to 125,000, 2% from 125,001 to 250,000, 5% from 250,001 to 925,000, 10% from 925,001 to 1.5m, and 12% above 1.5m." },
    { question: "What relief do first-time buyers get?", answer: "First-time buyers pay no SDLT on the first 300,000 and 5% on the portion from 300,001 to 500,000, but only if the price is 500,000 or less. Above that, standard rates apply." },
    { question: "What is the additional-property surcharge?", answer: "Buying a second home or buy-to-let adds 5 percentage points to each band (so 5%, 7%, 10%, 15%, 17%) on top of the standard rates." },
  ],
  whoFor:
    "Home buyers in England and Northern Ireland working out the tax on a purchase, including first-time buyers and people buying a second home or buy-to-let.",
  howItWorks:
    "SDLT is charged in slices: each portion of the price within a band is taxed at that band's rate, then the slices are added together. First-time-buyer relief uses higher 0% and 5% thresholds, and additional properties add a 5-point surcharge to every band.",
  workedExample:
    "On a 300,000 next home: 0% on the first 125,000, 2% on the next 125,000 (2,500), and 5% on the final 50,000 (2,500), giving 5,000 of SDLT. A first-time buyer at the same price pays 0.",
  commonMistakes: [
    "Applying a single rate to the whole price - SDLT is banded, not a flat percentage.",
    "Claiming first-time-buyer relief above 500,000, where it no longer applies.",
    "Forgetting the 5% additional-property surcharge on second homes and buy-to-lets.",
  ],
  regionalVariations:
    "These rates apply to England and Northern Ireland. Scotland charges Land and Buildings Transaction Tax (LBTT) and Wales charges Land Transaction Tax (LTT), both with different bands.",
  sources: [
    { title: "Stamp Duty Land Tax: residential property rates", url: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates", publisher: "GOV.UK", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only, for residential property in England and Northern Ireland from April 2025. Does not cover mixed-use property, non-resident surcharges, leasehold premiums, or reliefs beyond first-time-buyer relief. Confirm with GOV.UK or a conveyancer.",
  version: "1.0.0",
  lastVerified: "2026-06-09",
  tests: [
    { name: "standard 300k", inputs: { price: 300000, buyerType: "standard" }, expect: { tax: 5000 } },
    { name: "first-time 300k", inputs: { price: 300000, buyerType: "firstTime" }, expect: { tax: 0 } },
    { name: "first-time 450k", inputs: { price: 450000, buyerType: "firstTime" }, expect: { tax: 7500 } },
    { name: "additional 300k", inputs: { price: 300000, buyerType: "additional" }, expect: { tax: 20000 } },
    { name: "standard 600k", inputs: { price: 600000, buyerType: "standard" }, expect: { tax: 20000 } },
  ],
};
