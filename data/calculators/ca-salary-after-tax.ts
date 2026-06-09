// Canada salary after tax (2025). Federal income tax + provincial income tax
// (Ontario, British Columbia, Alberta) + CPP (incl. CPP2) + EI. Applies the
// basic personal amount as a non-refundable credit. Ontario surtax included.
// Excludes other credits, the Ontario Health Premium, and Quebec's system.
import type { CalculatorDefinition, Expr } from "@/lib/engine/types";
import { progressive, NO_CAP } from "@/lib/engine/bands";

// Federal 2025
const fedGross = progressive("gross", [
  [0.15, 0, 57375],
  [0.205, 57375, 114750],
  [0.26, 114750, 177882],
  [0.29, 177882, 253414],
  [0.33, 253414, NO_CAP],
]);
const FED_BPA_CREDIT = 0.15 * 16129; // 2419.35

// Ontario 2025 (plus surtax)
const onGross = progressive("gross", [
  [0.0505, 0, 52886],
  [0.0915, 52886, 105775],
  [0.1116, 105775, 150000],
  [0.1216, 150000, 220000],
  [0.1316, 220000, NO_CAP],
]);
const ON_BPA_CREDIT = 0.0505 * 12747; // 643.7235

// British Columbia 2025
const bcGross = progressive("gross", [
  [0.0506, 0, 49279],
  [0.077, 49279, 98560],
  [0.105, 98560, 113158],
  [0.1229, 113158, 137407],
  [0.147, 137407, 186306],
  [0.168, 186306, 259829],
  [0.205, 259829, NO_CAP],
]);
const BC_BPA_CREDIT = 0.0506 * 12932; // 654.3592

// Alberta 2025 (new 8% bracket on the first 60,000)
const abGross = progressive("gross", [
  [0.08, 0, 60000],
  [0.1, 60000, 151234],
  [0.12, 151234, 181481],
  [0.13, 181481, 241974],
  [0.14, 241974, 362961],
  [0.15, 362961, NO_CAP],
]);
const AB_BPA_CREDIT = 0.08 * 22323; // 1785.84

const provTaxExpr: Expr = {
  if: { cmp: "==", left: { var: "province" }, right: "ON" },
  then: { var: "onTax" },
  else: {
    if: { cmp: "==", left: { var: "province" }, right: "BC" },
    then: { var: "bcTax" },
    else: {
      if: { cmp: "==", left: { var: "province" }, right: "AB" },
      then: { var: "abTax" },
      else: 0,
    },
  },
};

export const caSalaryAfterTax: CalculatorDefinition = {
  id: "ca-salary-after-tax",
  type: "estimate",
  region: "CA",
  jurisdictionLevel: "federal",
  category: "salary",
  slug: "ca-salary-after-tax",
  title: "Canada Salary After Tax Calculator (2025)",
  description:
    "Estimate your Canadian take-home pay after federal and provincial income tax, CPP, and EI for 2025. Supports Ontario, British Columbia, and Alberta.",
  taxYear: 2025,
  inputs: [
    { name: "gross", label: "Gross annual salary", type: "currency", required: true, default: 60000, min: 0, max: 2000000, step: 1000 },
    {
      name: "province", label: "Province", type: "select", required: true, default: "ON",
      options: [
        { value: "ON", label: "Ontario" },
        { value: "BC", label: "British Columbia" },
        { value: "AB", label: "Alberta" },
        { value: "other", label: "Other (federal only estimate)" },
      ],
    },
  ],
  derived: [
    { name: "fedTax", expr: { op: "max", args: [0, { op: "-", args: [fedGross, FED_BPA_CREDIT] }] } },
    // Ontario tax with surtax
    { name: "onBase", expr: { op: "max", args: [0, { op: "-", args: [onGross, ON_BPA_CREDIT] }] } },
    { name: "onSurtax", expr: { op: "+", args: [{ op: "*", args: [0.2, { op: "max", args: [0, { op: "-", args: [{ var: "onBase" }, 5710] }] }] }, { op: "*", args: [0.36, { op: "max", args: [0, { op: "-", args: [{ var: "onBase" }, 7307] }] }] }] } },
    { name: "onTax", expr: { op: "+", args: [{ var: "onBase" }, { var: "onSurtax" }] } },
    { name: "bcTax", expr: { op: "max", args: [0, { op: "-", args: [bcGross, BC_BPA_CREDIT] }] } },
    { name: "abTax", expr: { op: "max", args: [0, { op: "-", args: [abGross, AB_BPA_CREDIT] }] } },
    { name: "provTax", expr: provTaxExpr },
    // CPP (base + CPP2) and EI
    { name: "cpp", expr: { op: "+", args: [{ op: "*", args: [0.0595, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "gross" }, 71300] }, 3500] }] }] }, { op: "*", args: [0.04, { op: "max", args: [0, { op: "-", args: [{ op: "min", args: [{ var: "gross" }, 81200] }, 71300] }] }] }] } },
    { name: "ei", expr: { op: "*", args: [{ op: "min", args: [{ var: "gross" }, 65700] }, 0.0164] } },
    { name: "totalTax", expr: { op: "+", args: [{ var: "fedTax" }, { var: "provTax" }] } },
    { name: "totalDeductions", expr: { op: "+", args: [{ var: "totalTax" }, { var: "cpp" }, { var: "ei" }] } },
    { name: "takeHome", expr: { op: "-", args: [{ var: "gross" }, { var: "totalDeductions" }] } },
    { name: "monthly", expr: { op: "/", args: [{ var: "takeHome" }, 12] } },
  ],
  outputs: [
    { name: "takeHome", label: "Annual take-home pay", expr: { var: "takeHome" }, format: "currency", primary: true, note: "After federal and provincial income tax, CPP, and EI. Excludes other credits and deductions." },
    { name: "monthly", label: "Monthly take-home", expr: { var: "monthly" }, format: "currency" },
    { name: "fedTax", label: "Federal income tax", expr: { var: "fedTax" }, format: "currency" },
    { name: "provTax", label: "Provincial income tax", expr: { var: "provTax" }, format: "currency" },
    { name: "cpp", label: "CPP contributions", expr: { var: "cpp" }, format: "currency" },
    { name: "ei", label: "EI premiums", expr: { var: "ei" }, format: "currency" },
  ],
  faqs: [
    { question: "Which provinces are supported?", answer: "Ontario, British Columbia, and Alberta have full provincial calculations. Choosing 'Other' gives a federal-only estimate (no provincial tax), which understates your real deductions." },
    { question: "Does this include CPP and EI?", answer: "Yes. It includes base CPP (5.95% between 3,500 and 71,300), the additional CPP2 (4% between 71,300 and 81,200), and EI (1.64% up to 65,700) for 2025." },
    { question: "Why might my pay stub differ?", answer: "Employers withhold using payroll tables, and your situation may include other credits, RRSP contributions, or benefits. This is a full-year estimate using the basic personal amount only." },
  ],
  whoFor:
    "Employees and job seekers in Ontario, British Columbia, or Alberta who want to estimate take-home pay from a gross salary.",
  howItWorks:
    "Federal and provincial income tax are each calculated on your salary using marginal brackets, then reduced by the basic personal amount credit. Ontario adds a surtax on higher provincial tax. CPP and EI are added as separate payroll deductions. Take-home pay is your salary minus all of these.",
  workedExample:
    "In Ontario on a 60,000 salary: federal tax is about 6,725, Ontario tax about 2,678, CPP 3,361.75, and EI 984. Total deductions are about 13,749, leaving roughly 46,251 of take-home pay.",
  commonMistakes: [
    "Selecting 'Other' and treating the federal-only figure as your real take-home - provincial tax still applies where you live.",
    "Forgetting that RRSP contributions and other credits can reduce your tax below this estimate.",
    "Assuming CPP and EI continue all year - they stop once you hit the annual maximums.",
  ],
  regionalVariations:
    "Every province and territory sets its own income-tax brackets and credits. Quebec runs a separate system (with its own pension plan, QPP, and a federal abatement) and is not covered here. Ontario also has a Health Premium not included in this estimate.",
  documents: [
    "Your T4 slip (employment income and deductions)",
    "Records of RRSP contributions and other credits",
    "Notice of Assessment from a prior year for reference",
  ],
  deadlines:
    "Most individuals must file their Canadian tax return by April 30 for the previous calendar year; self-employed individuals have until June 15, with any balance owing still due April 30.",
  sources: [
    { title: "Canada's federal income tax rates", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html", publisher: "Canada Revenue Agency", retrieved: "2026-06-09" },
    { title: "CPP contribution rates, maximums and exemptions", url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums-exemptions.html", publisher: "Canada Revenue Agency", retrieved: "2026-06-09" },
    { title: "EI premium rates and maximums", url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html", publisher: "Canada Revenue Agency", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "Estimate only for 2025. Applies the basic personal amount only and excludes other credits, RRSP deductions, the Ontario Health Premium, and Quebec's system. Not tax advice.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "ON 60k", inputs: { gross: 60000, province: "ON" }, expect: { fedTax: 6725.03, cpp: 3361.75, ei: 984, takeHome: 46251.27 } },
    { name: "BC 90k", inputs: { gross: 90000, province: "BC" }, expect: { fedTax: 12875.03, cpp: 4430.1, ei: 1077.48, takeHome: 66642.72 } },
    { name: "AB 50k", inputs: { gross: 50000, province: "AB" }, expect: { fedTax: 5080.65, provTax: 2214.16, cpp: 2766.75, takeHome: 39118.44 } },
  ],
};
