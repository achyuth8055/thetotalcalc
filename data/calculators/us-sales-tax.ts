// US sales tax calculator. Uses each state's base (statutory) sales-tax rate
// and lets the user add a local city/county rate on top. Local rates vary
// widely, so the state rate is a floor, not the full combined rate.
import type { CalculatorDefinition } from "@/lib/engine/types";

export const usSalesTax: CalculatorDefinition = {
  id: "us-sales-tax",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "state",
  category: "tax",
  slug: "us-sales-tax-calculator",
  title: "US Sales Tax Calculator",
  description:
    "Work out sales tax and the total price from a pre-tax amount, using your state's base sales-tax rate plus any local city or county rate.",
  inputs: [
    { name: "amount", label: "Pre-tax amount", type: "currency", required: true, default: 100, min: 0, max: 10000000, step: 1 },
    {
      name: "state", label: "State", type: "select", required: true, default: "CA",
      options: [
        { value: "AK", label: "Alaska (no state tax)" }, { value: "AZ", label: "Arizona" }, { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" }, { value: "DE", label: "Delaware (no state tax)" }, { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" }, { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
        { value: "MA", label: "Massachusetts" }, { value: "MD", label: "Maryland" }, { value: "MI", label: "Michigan" },
        { value: "MN", label: "Minnesota" }, { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana (no state tax)" },
        { value: "NC", label: "North Carolina" }, { value: "NH", label: "New Hampshire (no state tax)" }, { value: "NJ", label: "New Jersey" },
        { value: "NV", label: "Nevada" }, { value: "NY", label: "New York" }, { value: "OH", label: "Ohio" },
        { value: "OR", label: "Oregon (no state tax)" }, { value: "PA", label: "Pennsylvania" }, { value: "TN", label: "Tennessee" },
        { value: "TX", label: "Texas" }, { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" },
        { value: "WI", label: "Wisconsin" }, { value: "other", label: "Other / not listed" },
      ],
    },
    { name: "localRate", label: "Local rate (city/county) %", type: "number", default: 0, min: 0, max: 10, step: 0.1, help: "Add your local sales-tax rate on top of the state rate. Leave at 0 if unsure." },
  ],
  tables: {
    // State base (statutory) sales-tax rate, percent. Local rates are added separately.
    stateRate: {
      AK: 0, AZ: 5.6, CA: 7.25, CO: 2.9, DE: 0, FL: 6, GA: 4, IL: 6.25, IN: 7, MA: 6.25,
      MD: 6, MI: 6, MN: 6.875, MO: 4.225, MT: 0, NC: 4.75, NH: 0, NJ: 6.625, NV: 6.85,
      NY: 4, OH: 5.75, OR: 0, PA: 6, TN: 7, TX: 6.25, VA: 5.3, WA: 6.5, WI: 5, other: 0,
    },
  },
  derived: [
    { name: "stateR", expr: { lookup: "stateRate", key: { var: "state" } } },
    { name: "totalRate", expr: { op: "+", args: [{ var: "stateR" }, { var: "localRate" }] } },
    { name: "tax", expr: { op: "/", args: [{ op: "*", args: [{ var: "amount" }, { var: "totalRate" }] }, 100] } },
    { name: "total", expr: { op: "+", args: [{ var: "amount" }, { var: "tax" }] } },
  ],
  outputs: [
    { name: "total", label: "Total with sales tax", expr: { var: "total" }, format: "currency", primary: true, note: "Pre-tax amount plus sales tax at the combined rate." },
    { name: "tax", label: "Sales tax", expr: { var: "tax" }, format: "currency" },
    { name: "totalRate", label: "Combined rate", expr: { var: "totalRate" }, format: "percent" },
    { name: "stateR", label: "State base rate", expr: { var: "stateR" }, format: "percent" },
  ],
  faqs: [
    { question: "Does this include local sales tax?", answer: "It uses the state's base (statutory) rate and lets you add your local city or county rate. Combined rates vary by address, so check your local rate for an exact figure." },
    { question: "Which states have no sales tax?", answer: "Alaska, Delaware, Montana, New Hampshire, and Oregon have no statewide sales tax. Alaska and Montana can still have local sales taxes in some areas." },
    { question: "Is sales tax based on where I live or where I buy?", answer: "US sales tax is generally based on the location where the sale takes place or where the item is delivered (destination-based in most states)." },
  ],
  whoFor:
    "Shoppers, freelancers, and small businesses who need to estimate sales tax on a purchase or invoice in a US state.",
  howItWorks:
    "The combined rate is your state's base rate plus any local rate you enter. Sales tax is the pre-tax amount multiplied by that combined rate, and the total is the amount plus the tax.",
  workedExample:
    "On a 100 purchase in California (7.25% state rate) with no local rate, sales tax is 7.25 and the total is 107.25. Add a 2% local rate in Texas (6.25% state) and the combined rate is 8.25%, so a 200 purchase has 16.50 tax and a 216.50 total.",
  commonMistakes: [
    "Assuming the state rate is the full rate - many cities and counties add their own local sales tax.",
    "Applying sales tax to items that are exempt in your state, such as some groceries or clothing.",
    "Using your home rate for an online order delivered to a different state.",
  ],
  regionalVariations:
    "Five states have no statewide sales tax. Elsewhere, local rates can add several percentage points, and some categories (groceries, clothing, prescriptions) are taxed differently or exempt.",
  sources: [
    { title: "State and Local Sales Tax Rates", url: "https://taxfoundation.org/data/all/state/sales-tax-rates/", publisher: "Tax Foundation", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only, using state base rates. Actual sales tax depends on your exact location, local rates, and product exemptions. Check your state's department of revenue for precise figures.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "CA 100 no local", inputs: { amount: 100, state: "CA", localRate: 0 }, expect: { totalRate: 7.25, tax: 7.25, total: 107.25 } },
    { name: "TX 200 + 2% local", inputs: { amount: 200, state: "TX", localRate: 2 }, expect: { totalRate: 8.25, tax: 16.5, total: 216.5 } },
    { name: "OR 50 (no tax)", inputs: { amount: 50, state: "OR", localRate: 0 }, expect: { tax: 0, total: 50 } },
  ],
};
