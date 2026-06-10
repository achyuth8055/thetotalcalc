// Registry of engine-driven calculator definitions.
// Adding a calculator = importing its definition and listing it here. The
// DynamicCalculator component renders any of these with no per-calculator UI.

import type { CalculatorDefinition } from "@/lib/engine/types";
import { usChildTaxCredit2025 } from "./us-child-tax-credit-2025";
import { MORE_CALCULATORS } from "./more";
import { ROADMAP_CALCULATORS } from "./roadmap";
import { ukVat } from "./uk-vat";
import { usSalesTax } from "./us-sales-tax";
import { ukSalaryAfterTax } from "./uk-salary-after-tax";
import { usSelfEmploymentTax } from "./us-self-employment-tax";
import { ukStampDuty } from "./uk-stamp-duty";
import { usPaycheck } from "./us-paycheck";
import { caSalaryAfterTax } from "./ca-salary-after-tax";
import { usCapitalGains } from "./us-capital-gains";
import { ukCapitalGains } from "./uk-capital-gains";
import { caCapitalGains } from "./ca-capital-gains";
import { CONTENT } from "../content/calculator-content";

const RAW_CALCULATORS: CalculatorDefinition[] = [
  usChildTaxCredit2025,
  ...MORE_CALCULATORS,
  ...ROADMAP_CALCULATORS,
  ukVat,
  usSalesTax,
  ukSalaryAfterTax,
  usSelfEmploymentTax,
  ukStampDuty,
  usPaycheck,
  caSalaryAfterTax,
  usCapitalGains,
  ukCapitalGains,
  caCapitalGains,
];

// Merge long-form people-first content (whoFor, howItWorks, workedExample,
// regionalVariations, commonMistakes, deadlines, expanded faqs) onto each
// definition. Content lives separately so the rule logic stays lean.
export const ENGINE_CALCULATORS: CalculatorDefinition[] = RAW_CALCULATORS.map((c) => ({
  ...c,
  ...(CONTENT[c.id] ?? {}),
}));

const byId = new Map(ENGINE_CALCULATORS.map((c) => [c.id, c]));
const bySlug = new Map(ENGINE_CALCULATORS.map((c) => [c.slug, c]));

export function getCalculatorById(id: string): CalculatorDefinition | undefined {
  return byId.get(id);
}

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return bySlug.get(slug);
}
