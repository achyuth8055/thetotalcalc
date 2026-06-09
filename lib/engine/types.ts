// Core types for the deterministic rules engine.
// Everything here is JSON-serializable so calculator definitions can live in
// the repo today and be moved into a database (Supabase/Postgres) later without
// changing the engine contract.

export type RegionCode = "US" | "UK" | "CA";

// ---------------------------------------------------------------------------
// Expression AST
// Rules, formulas and conditions are represented as nested objects (an AST),
// NOT as code strings. The interpreter in `expr.ts` walks this tree. There is
// no `eval`, so rules are safe, diff-able and portable.
// ---------------------------------------------------------------------------
export type Expr =
  | number
  | boolean
  | string
  | { var: string } // read an input or a derived value by name
  | { op: ArithOp; args: Expr[] }
  | { cmp: CmpOp; left: Expr; right: Expr }
  | { all: Expr[] } // logical AND
  | { any: Expr[] } // logical OR
  | { not: Expr }
  | { if: Expr; then: Expr; else: Expr }
  | { lookup: string; key: Expr }; // named table lookup, e.g. threshold by filing status

export type ArithOp =
  | "+"
  | "-"
  | "*"
  | "/"
  | "min"
  | "max"
  | "clamp" // clamp(value, lo, hi)
  | "floor"
  | "ceil"
  | "round"
  | "pow" // pow(base, exponent)
  | "ln" // natural log
  | "exp"
  | "abs"
  | "sqrt";

export type CmpOp = "<" | "<=" | ">" | ">=" | "==" | "!=";

// ---------------------------------------------------------------------------
// Calculator definition
// ---------------------------------------------------------------------------
export type CalculatorType = "eligibility" | "estimate" | "both";

export interface InputOption {
  value: string;
  label: string; // i18n key (or literal until i18n is wired)
}

export interface InputField {
  name: string;
  label: string; // i18n key
  type: "number" | "currency" | "integer" | "select" | "boolean" | "date";
  required?: boolean;
  default?: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: InputOption[];
  help?: string; // plain-language hint (i18n key)
  showIf?: Expr; // conditional visibility
}

export interface OutputDef {
  name: string;
  label: string; // i18n key
  expr: Expr;
  format: "currency" | "number" | "percent" | "text" | "boolean";
  primary?: boolean; // headline figure
  note?: string; // i18n key
}

export type EligibilityStatus =
  | "likely_qualifies"
  | "may_qualify"
  | "likely_not_eligible"
  | "need_local_review";

export type Confidence = "high" | "medium" | "low";

export interface EligibilityRule {
  status: EligibilityStatus;
  when: Expr; // first matching rule wins
  confidence: Confidence;
  reason: string; // the "why" (i18n key or literal)
}

export interface SourceCitation {
  title: string;
  url: string;
  publisher: string;
  retrieved: string; // ISO date
}

export interface DerivedVar {
  name: string;
  expr: Expr;
}

export interface TestVector {
  name?: string;
  inputs: Record<string, number | string | boolean>;
  expect: Record<string, number | string | boolean>;
}

export interface CalculatorDefinition {
  id: string;
  type: CalculatorType;
  region: RegionCode;
  jurisdictionLevel: "federal" | "state" | "county" | "city";
  jurisdiction?: string;
  category: string;
  slug: string;
  title: string;
  description: string;
  taxYear?: number;
  benefitYear?: number;

  inputs: InputField[];
  tables?: Record<string, Record<string, number>>; // named lookup tables
  derived?: DerivedVar[]; // intermediate values computed in order
  outputs: OutputDef[];
  eligibility?: EligibilityRule[];

  sources: SourceCitation[];
  disclaimer: string;
  version: string;
  effectiveYear: number;
  lastVerified: string; // ISO date

  // Optional UI/SEO content
  documents?: string[]; // document checklist items
  faqs?: { question: string; answer: string }[];

  // Optional long-form, people-first content rendered generically by
  // components/engine/CalculatorExplainer.tsx (no per-page boilerplate).
  whoFor?: string; // who this calculator is for
  howItWorks?: string; // the method / formula in plain language
  workedExample?: string; // a concrete example calculation
  commonMistakes?: string[]; // pitfalls to avoid
  regionalVariations?: string; // how rules differ by state/province/nation
  deadlines?: string; // relevant filing/claim deadlines

  // Golden test vectors validated by scripts/verify and (later) CI
  tests?: TestVector[];
}

// ---------------------------------------------------------------------------
// Engine result
// ---------------------------------------------------------------------------
export interface ResolvedOutput {
  name: string;
  label: string;
  value: number | string | boolean;
  formatted: string;
  primary?: boolean;
  note?: string;
}

export interface CalculationResult {
  status: EligibilityStatus | null;
  confidence: Confidence | null;
  outputs: ResolvedOutput[];
  reasons: string[]; // resolved "why" strings
  missing: string[]; // input names needed for a firmer answer
  meta: {
    version: string;
    lastVerified: string;
    effectiveYear: number;
    sources: SourceCitation[];
    disclaimer: string;
  };
}
