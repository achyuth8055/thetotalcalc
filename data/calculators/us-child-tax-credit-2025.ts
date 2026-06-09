// US Child Tax Credit - tax year 2025.
// Figures reflect the FY2025 reconciliation law (One Big Beautiful Bill Act,
// P.L. 119-21): max credit $2,200/qualifying child (under 17), refundable
// portion (ACTC) up to $1,700/child = 15% of earned income over $2,500,
// phase-out begins at $200,000 (single/HoH/MFS) and $400,000 (MFJ), reduced by
// $50 per $1,000 over the threshold. $500 Credit for Other Dependents (ODC).
//
// This is an estimate only, not tax advice. The full credit is further limited
// by tax liability; the "could-be-refundable" figure here is the ACTC ceiling.

import type { CalculatorDefinition } from "@/lib/engine/types";

export const usChildTaxCredit2025: CalculatorDefinition = {
  id: "us_child_tax_credit_2025",
  type: "both",
  region: "US",
  jurisdictionLevel: "federal",
  category: "family-benefits",
  slug: "us-child-tax-credit",
  title: "US Child Tax Credit Calculator (2025)",
  description:
    "Estimate your 2025 Child Tax Credit and how much could be refundable, and check whether you likely qualify - in plain language, with official sources.",
  taxYear: 2025,

  inputs: [
    {
      name: "filingStatus",
      label: "Filing status",
      type: "select",
      required: true,
      default: "mfj",
      options: [
        { value: "single", label: "Single" },
        { value: "hoh", label: "Head of household" },
        { value: "mfj", label: "Married filing jointly" },
        { value: "mfs", label: "Married filing separately" },
      ],
      help: "How you file affects the income level where the credit starts to phase out.",
    },
    {
      name: "qualifyingChildren",
      label: "Qualifying children under 17",
      type: "integer",
      required: true,
      default: 1,
      min: 0,
      max: 12,
      step: 1,
      help: "Children who were under age 17 at the end of 2025 and meet the relationship, residency and dependency tests.",
    },
    {
      name: "otherDependents",
      label: "Other dependents (17+ or qualifying relatives)",
      type: "integer",
      default: 0,
      min: 0,
      max: 12,
      step: 1,
      help: "Each may qualify for the $500 Credit for Other Dependents (non-refundable).",
    },
    {
      name: "agi",
      label: "Adjusted gross income (AGI)",
      type: "currency",
      required: true,
      default: 80000,
      min: 0,
      max: 1000000,
      step: 1000,
      help: "Your total income after adjustments. The credit reduces above $200,000 ($400,000 if married filing jointly).",
    },
    {
      name: "earnedIncome",
      label: "Earned income (wages, self-employment)",
      type: "currency",
      required: true,
      default: 80000,
      min: 0,
      max: 1000000,
      step: 1000,
      help: "Used to estimate the refundable portion (15% of earned income over $2,500).",
    },
    {
      name: "childrenHaveValidSSN",
      label: "Children have a Social Security number valid for work",
      type: "boolean",
      default: true,
      help: "A valid SSN issued before the tax return due date is required for the Child Tax Credit.",
      showIf: { cmp: ">", left: { var: "qualifyingChildren" }, right: 0 },
    },
  ],

  tables: {
    phaseoutThreshold: {
      single: 200000,
      hoh: 200000,
      mfs: 200000,
      mfj: 400000,
    },
  },

  derived: [
    { name: "threshold", expr: { lookup: "phaseoutThreshold", key: { var: "filingStatus" } } },
    {
      name: "baseCredit",
      expr: {
        op: "+",
        args: [
          { op: "*", args: [{ var: "qualifyingChildren" }, 2200] },
          { op: "*", args: [{ var: "otherDependents" }, 500] },
        ],
      },
    },
    {
      name: "excessIncome",
      expr: { op: "max", args: [0, { op: "-", args: [{ var: "agi" }, { var: "threshold" }] }] },
    },
    {
      name: "reduction",
      expr: {
        op: "*",
        args: [{ op: "ceil", args: [{ op: "/", args: [{ var: "excessIncome" }, 1000] }] }, 50],
      },
    },
    {
      name: "creditAfterPhaseout",
      expr: { op: "max", args: [0, { op: "-", args: [{ var: "baseCredit" }, { var: "reduction" }] }] },
    },
    { name: "maxRefundable", expr: { op: "*", args: [{ var: "qualifyingChildren" }, 1700] } },
    {
      name: "earnedOver2500",
      expr: { op: "max", args: [0, { op: "-", args: [{ var: "earnedIncome" }, 2500] }] },
    },
    { name: "refundableByEarnings", expr: { op: "*", args: [{ var: "earnedOver2500" }, 0.15] } },
    {
      name: "estimatedRefundable",
      expr: {
        op: "floor",
        args: [
          {
            op: "min",
            args: [
              { var: "maxRefundable" },
              { var: "refundableByEarnings" },
              { var: "creditAfterPhaseout" },
            ],
          },
        ],
      },
    },
  ],

  outputs: [
    {
      name: "estimatedCredit",
      label: "Estimated Child Tax Credit",
      expr: { var: "creditAfterPhaseout" },
      format: "currency",
      primary: true,
      note: "Total credit after any income phase-out (before the tax-liability limit).",
    },
    {
      name: "estimatedRefundable",
      label: "Of which could be refundable (ACTC)",
      expr: { var: "estimatedRefundable" },
      format: "currency",
      note: "Up to $1,700 per qualifying child, based on 15% of earned income over $2,500.",
    },
    {
      name: "baseCredit",
      label: "Credit before phase-out",
      expr: { var: "baseCredit" },
      format: "currency",
    },
    {
      name: "reduction",
      label: "Reduction from income phase-out",
      expr: { var: "reduction" },
      format: "currency",
    },
  ],

  eligibility: [
    {
      status: "likely_not_eligible",
      when: {
        all: [
          { cmp: "==", left: { var: "qualifyingChildren" }, right: 0 },
          { cmp: "==", left: { var: "otherDependents" }, right: 0 },
        ],
      },
      confidence: "high",
      reason: "You haven't entered any qualifying children or other dependents.",
    },
    {
      status: "likely_not_eligible",
      when: {
        all: [
          { cmp: ">", left: { var: "qualifyingChildren" }, right: 0 },
          { not: { var: "childrenHaveValidSSN" } },
        ],
      },
      confidence: "high",
      reason:
        "The Child Tax Credit requires each qualifying child to have a Social Security number valid for work.",
    },
    {
      status: "likely_not_eligible",
      when: { cmp: "==", left: { var: "creditAfterPhaseout" }, right: 0 },
      confidence: "high",
      reason: "Your income is high enough that the credit fully phases out.",
    },
    {
      status: "may_qualify",
      when: { cmp: ">", left: { var: "excessIncome" }, right: 0 },
      confidence: "medium",
      reason: "Your income is in the phase-out range, so you likely qualify for a reduced credit.",
    },
    {
      status: "likely_qualifies",
      when: { cmp: ">", left: { var: "qualifyingChildren" }, right: 0 },
      confidence: "high",
      reason: "You have qualifying children and your income is below the phase-out threshold.",
    },
    {
      status: "likely_qualifies",
      when: { cmp: ">", left: { var: "otherDependents" }, right: 0 },
      confidence: "medium",
      reason: "You may qualify for the $500 Credit for Other Dependents.",
    },
  ],

  documents: [
    "Social Security numbers for you and each qualifying child",
    "Each child's date of birth and proof of relationship",
    "Proof the child lived with you for more than half of 2025",
    "Records of your earned income (W-2s, 1099s) and AGI",
  ],

  faqs: [
    {
      question: "How much is the Child Tax Credit for 2025?",
      answer:
        "Up to $2,200 per qualifying child under age 17. Up to $1,700 per child can be refundable (the Additional Child Tax Credit) if your tax liability is low.",
    },
    {
      question: "At what income does it start to phase out?",
      answer:
        "The credit is reduced by $50 for every $1,000 of adjusted gross income above $200,000 (single, head of household, married filing separately) or $400,000 (married filing jointly).",
    },
    {
      question: "Is this tax advice?",
      answer:
        "No. This is an estimate to help you understand your situation. Your actual credit depends on your full return and is limited by your tax liability. Verify with the IRS or a tax professional.",
    },
  ],

  sources: [
    {
      title: "Child Tax Credit",
      url: "https://www.irs.gov/credits-deductions/individuals/child-tax-credit",
      publisher: "Internal Revenue Service",
      retrieved: "2026-06-09",
    },
    {
      title: "Refundable tax credits",
      url: "https://www.irs.gov/credits-deductions/individuals/refundable-tax-credits",
      publisher: "Internal Revenue Service",
      retrieved: "2026-06-09",
    },
  ],
  disclaimer:
    "Estimate only - not tax, legal or financial advice. Your actual Child Tax Credit depends on your complete tax return and is limited by your tax liability. Always confirm with the IRS or a qualified tax professional.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",

  tests: [
    {
      name: "MFJ, 2 kids, well under threshold",
      inputs: { filingStatus: "mfj", qualifyingChildren: 2, otherDependents: 0, agi: 100000, earnedIncome: 100000, childrenHaveValidSSN: true },
      expect: { estimatedCredit: 4400, estimatedRefundable: 3400, reduction: 0 },
    },
    {
      name: "Single, 1 kid, in phase-out range",
      inputs: { filingStatus: "single", qualifyingChildren: 1, otherDependents: 0, agi: 210000, earnedIncome: 210000, childrenHaveValidSSN: true },
      expect: { estimatedCredit: 1700, reduction: 500 },
    },
    {
      name: "Single, 1 kid, fully phased out",
      inputs: { filingStatus: "single", qualifyingChildren: 1, otherDependents: 0, agi: 260000, earnedIncome: 260000, childrenHaveValidSSN: true },
      expect: { estimatedCredit: 0 },
    },
    {
      name: "No dependents at all",
      inputs: { filingStatus: "single", qualifyingChildren: 0, otherDependents: 0, agi: 50000, earnedIncome: 50000 },
      expect: { estimatedCredit: 0 },
    },
    {
      name: "Low income, refundable capped by earnings",
      inputs: { filingStatus: "mfj", qualifyingChildren: 2, otherDependents: 0, agi: 20000, earnedIncome: 20000, childrenHaveValidSSN: true },
      expect: { estimatedCredit: 4400, estimatedRefundable: 2625 },
    },
  ],
};
