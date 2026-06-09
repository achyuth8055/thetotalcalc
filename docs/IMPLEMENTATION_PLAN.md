# Benefits & Tax Eligibility Platform - Architecture & Implementation Plan

**Working title:** Know My Benefits + Tax & Savings Hub
**Built on:** the existing `thetotalcalc` Next.js 14 app (extended in place)
**Regions (phased):** United States → United Kingdom → Canada → (later AU, IE, DE, UAE, SG)
**Last updated:** 2026-06-09

> This document is the plan. The companion code shipped alongside it implements the **foundation**: a deterministic JSON rules engine, a region/locale layer, and one fully-working real calculator (US Child Tax Credit 2025) that proves the architecture end to end.

---

## A. Product Strategy

### Positioning
Not "another calculator site." The product answers one emotionally-charged question: **"Am I missing money?"** - benefits I could claim, exemptions I qualify for, refunds I'm owed, tax I'm overpaying. Every calculator is framed as a *discovery* tool, not arithmetic. The defensible moat is a **maintained, sourced, multi-region rules database** plus a **plain-language, multilingual UX** that government tools and generic calculators don't offer together.

Tagline candidates: "Find money you're missing." / "Check what you're owed."

### Personas
1. **The Anxious Claimant** - lower-income, possibly immigrant or ESL, wants to know "do I qualify for SNAP / Universal Credit / CCB?" without fear or jargon. Needs plain language + their language + no account.
2. **The Homeowner / Senior** - cares about property tax, homestead/senior exemptions, appeals. High monetization (lawyers, appeal firms, realtors).
3. **The Filer** - wants refund/credit estimates before filing (CTC, EITC, deductions). Affiliate-rich (tax software).
4. **The Freelancer / Small Business Owner** - self-employment tax, quarterly estimates, VAT/GST thresholds. Higher willingness to pay (premium reports, B2B).
5. **The Caregiver** - checking benefits on behalf of a parent/child (Pension Credit, DTC, Carer's Allowance, disability).

### Highest-value use cases
"Find all benefits I may qualify for" wizard · property-tax savings + appeal opportunity · refund/credit estimate · salary-after-tax · senior/retirement benefit checks. These combine high search intent with high monetization.

### Region priority
Phase 1 **US** (CA, NY, TX, FL, IL, NJ, PA, MI, MA, WA) → Phase 2 **UK** → Phase 3 **Canada**. Rationale: ad RPM, English-first, large benefit-search volume, and clear official sources.

### Calculator categories (priority order)
1. Benefits & eligibility ("do I qualify") - core differentiator, recurring intent.
2. Property tax & exemptions - high $ at stake, strong lead-gen.
3. Tax refund / credit / deduction estimators - affiliate-rich.
4. Cost-of-living & income (salary-after-tax) - high-volume SEO top-of-funnel.
5. Business & freelancer - premium / B2B tier.

### Monetization
Display ads on high-volume calculators (AdSense already wired) → affiliate (tax software, mortgage, insurance, payroll) → lead-gen (property-tax appeal firms, accountants, lawyers - highest value) → premium PDF report → B2B licensing / embeddable widgets / API. Highest-value verticals: property-tax appeals, tax filing software, mortgage/refi, Medicaid navigation, senior planning, disability assistance.

### SEO strategy
Programmatic, region-aware pages off the rules DB: calculator pages ("California Property Tax Calculator"), eligibility questions ("Do I qualify for the Senior Property Tax Exemption in Illinois?"), comparisons, regional guides, multilingual variants ("SNAP Eligibility Calculator in Spanish"), deadline pages, document-checklist pages. One canonical engine → thousands of long-tail pages. JSON-LD `FAQPage` + `WebApplication` + `BreadcrumbList` on every calculator (the base app already emits some of this).

### Competitive analysis (benchmark, don't clone)
- **US:** IRS Interactive Tax Assistant (authoritative but clunky, English-heavy, no estimates), Benefits.gov, state assessor estimators (e.g. Michigan), SmartAsset/NerdWallet (good UX, weak on benefits eligibility). Gap: *guided plain-language eligibility + estimate + multilingual + cross-program discovery.*
- **UK:** Turn2us, entitledto, Policy in Practice (GOV.UK-recommended). Mature; license rather than copy. Gap: multilingual + property/council-tax + freelancer.
- **Canada:** official Benefits Finder (discovery only, no estimates). Gap: estimates + provincial depth + multilingual beyond EN/FR.

### Risks & compliance
- **Accuracy/liability:** never present results as legal/tax advice. Every calculator carries a disclaimer, "last updated" date, confidence level, and official source links. Deterministic rules (not AI) produce numbers.
- **Rule drift:** thresholds change yearly; need an audit log + scheduled re-verification.
- **Privacy:** income/disability/benefit inputs are sensitive - process client-side or stateless server-side, store nothing by default, no account required, clear privacy mode.
- **Scams adjacency:** the IRS warns about misleading credit claims - strong "estimate only, verify with official sources" messaging.
- **Translation risk:** mistranslated legal terms create harm - translate explanations, link official terms to source definitions, English fallback.

---

## B. Calculator Roadmap

### United States
- **Benefits eligibility:** SNAP, Medicaid, CHIP, TANF, WIC, LIHEAP (housing/energy), unemployment estimator, ACA premium subsidy.
- **Property tax:** estimator (state/county/millage), homestead exemption, senior exemption, disabled-veteran exemption, assessment-appeal savings, late-penalty, escrow estimator, commercial appeal ROI.
- **Federal/state credits:** Child Tax Credit (**shipped**), EITC, Child & Dependent Care Credit, Saver's Credit, education credits (AOTC/LLC), standard-vs-itemized.
- **Salary & payroll:** salary-after-tax (federal + FICA + state), hourly↔annual, paycheck/payroll, take-home.
- **Self-employment:** SE tax, quarterly estimated tax, 1099-vs-W2, business-expense deduction.
- **Senior:** Social Security estimator, senior property-tax/benefit finder, Medicare cost.
- **Family:** CTC, EITC, childcare affordability, dependent care.
- **Disability/veteran:** SSDI/SSI pre-check, VA benefit pre-check, disabled-veteran property-tax exemption.

### United Kingdom
Universal Credit · Council Tax Reduction · Housing Benefit · Child Benefit (+ High Income Child Benefit Charge) · Pension Credit · Carer's Allowance · PIP pre-check · "better off working" · salary-after-tax (Income Tax + NI) · VAT · Stamp Duty Land Tax · self-employed (Self Assessment) tax.

### Canada
Canada Child Benefit · GST/HST credit · Canada Workers Benefit · EI estimator · OAS/GIS · Disability Tax Credit pre-check · provincial benefit finder · property tax by province/city · salary-after-tax (federal + provincial) · RRSP tax savings · capital gains.

### MVP (20 calculators)
US: property-tax estimator, homestead checker, senior-exemption checker, **CTC (done)**, EITC, SNAP pre-check, Medicaid pre-check, salary-after-tax, SE tax, capital gains.
UK: Universal Credit pre-check, Council Tax Reduction, Pension Credit, Child Benefit, salary-after-tax.
CA: Canada Child Benefit, GST/HST credit, Canada Workers Benefit, OAS/GIS, salary-after-tax.

---

## C. Technical Architecture

### Recommended stack (lightweight-first)
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 App Router** (already in repo) | SSG for calculator/landing pages (fast, SEO), server routes for compute. |
| Styling | **Tailwind** (already in repo) | No change. |
| Forms | **React Hook Form + Zod** | Add. Zod schemas are *generated from the calculator input schema* so validation and the rules engine share one source of truth. |
| Compute | **In-repo JSON rules + custom deterministic evaluator** (no DB at MVP) | Lightest; rules are versioned in git, type-checked, unit-tested. |
| Server | **Next.js API routes / server actions** | Same deploy, no separate service. Move to FastAPI only if a non-JS consumer needs the engine. |
| i18n | **next-intl** | App-Router native, good SSG support. |
| PDF | **@react-pdf/renderer** (server route) | Premium report. |
| Analytics | GA4 (already) → add **PostHog** for funnels/flags. |
| Errors | **Sentry**. |
| Search | Client fuzzy (Fuse.js) at MVP → Typesense when catalog is large. |
| DB (Phase 2+) | **Supabase Postgres** | Only when an admin UI / audit log / lead capture needs persistence. JSON rules can be *seeded into* and *exported from* Postgres later without changing the engine contract. |
| Hosting | **Vercel** (+ Supabase later). |

### Why JSON-in-repo before a database
The engine consumes a `CalculatorDefinition` object. Where that object comes from (a `.ts`/`.json` file in git, or a Postgres row) is an implementation detail behind one loader function. Start with files: zero infra, instant rollback via git, easy review of rule changes in PRs. Introduce Postgres in Phase 2 when non-engineers must edit rules - the engine doesn't change.

### Folder structure (added to `thetotalcalc`)
```
lib/
  engine/
    types.ts          # CalculatorDefinition, InputField, Rule, Expr, Result types
    expr.ts           # safe AST expression interpreter (NO eval)
    evaluate.ts       # runCalculator(): derives vars, eligibility, outputs, confidence
    zod-from-inputs.ts# build a Zod schema from a calculator's input list (Phase 2)
  regions.ts          # region + locale config (currency, date, tax year, languages)
data/
  calculators/
    us-child-tax-credit-2025.ts   # one calculator definition (shipped)
    registry.ts                   # id -> definition map + lookup helpers
components/
  engine/
    DynamicCalculator.tsx   # renders inputs from schema, calls engine, shows result
    ResultPanel.tsx         # amount, eligibility badge, confidence, breakdown
    SourceCitations.tsx     # sources + last-updated + disclaimer
app/
  calculators/benefits/us-child-tax-credit/page.tsx
docs/IMPLEMENTATION_PLAN.md  # this file
scripts/verify-ctc.ts        # runtime correctness test for the engine
```

### API design (Phase 2)
`POST /api/calc/:id` → body = validated inputs → returns the `CalculationResult` (below). At MVP the same `runCalculator()` runs client-side for instant feedback and is identical on the server, so results are reproducible and the engine is the single source of truth.

### Caching
Calculator/landing pages are statically generated (`generateStaticParams`) and revalidated on rule changes. Compute is pure and cheap → cache by `(calculatorId, inputsHash)` at the edge in Phase 2. Currency/locale resolved at request time from path segment, not IP, for cacheability.

### Testing
- **Unit:** Vitest over `expr.ts` (operators, edge cases) and `evaluate.ts` (golden test vectors per calculator - known inputs → known outputs).
- **Rule fixtures:** each calculator ships a `tests` array of `{inputs, expect}` vectors validated in CI; this doubles as living documentation and guards against rule-edit regressions.
- **E2E:** Playwright on the top flows.
- The shipped foundation includes `scripts/verify-ctc.ts` with hand-computed CTC vectors.

---

## D. Rules Engine Design

### Principles
1. **Deterministic, not AI.** Eligibility and amounts come from data + a pure evaluator. AI only explains/translates the result.
2. **Declarative & serializable.** A calculator is data (JSON-compatible TS objects). Formulas and conditions are **expression trees (AST)**, not code strings - so there is no `eval`, the rules are safe, diff-able, and portable to a DB.
3. **One source of truth.** Inputs drive the form, the validation, and the evaluator.
4. **Auditable.** Every definition carries `version`, `effectiveYear`, `lastVerified`, `sources`, `disclaimer`.

### The expression AST (the heart of the evaluator)
Instead of parsing formula strings, rules are nested objects the interpreter walks:
```ts
type Expr =
  | number | boolean | string                 // literal
  | { var: string }                           // read an input or derived value
  | { op: "+"|"-"|"*"|"/"|"min"|"max"|"clamp"|"floor"|"ceil"|"round"; args: Expr[] }
  | { cmp: "<"|"<="|">"|">="|"=="|"!="; left: Expr; right: Expr }
  | { all: Expr[] } | { any: Expr[] } | { not: Expr }
  | { if: Expr; then: Expr; else: Expr }
  | { lookup: string; key: Expr };            // table lookup (e.g. threshold by filing status)
```
This is enough for tax bands, phaseouts, thresholds-by-status, and benefit formulas, and it ports 1:1 to a JSON column in Postgres later.

### Example schemas (TypeScript, JSON-serializable)

**Calculator**
```ts
interface CalculatorDefinition {
  id: string;                       // "us_child_tax_credit_2025"
  type: "eligibility" | "estimate" | "both";
  region: RegionCode;               // "US"
  jurisdictionLevel: "federal"|"state"|"county"|"city";
  jurisdiction?: string;            // "CA", "Cook County"
  category: string;                 // "family-benefits"
  title: string; description: string;
  taxYear?: number; benefitYear?: number;
  inputs: InputField[];
  tables?: Record<string, Record<string, number>>;  // named lookup tables
  derived?: { name: string; expr: Expr }[];          // intermediate values
  outputs: OutputDef[];                              // what to show
  eligibility?: EligibilityRule[];                   // status + confidence
  sources: SourceCitation[];
  disclaimer: string;
  version: string; effectiveYear: number; lastVerified: string; // ISO date
  i18nKey: string;                                   // root translation key
  tests?: { inputs: Record<string, any>; expect: Record<string, any> }[];
}
```

**Region**
```ts
interface Region {
  code: "US"|"UK"|"CA"; name: string; currency: string; locale: string;
  dateFormat: "MM/DD/YYYY"|"DD/MM/YYYY"|"YYYY-MM-DD";
  taxYear: { type: "calendar"|"uk_april"|"calendar"; label: string };
  languages: string[];               // ["en","es","zh","hi","ar","vi"]
  subdivisions?: { code: string; name: string }[]; // states/provinces
}
```

**Input field**
```ts
interface InputField {
  name: string; label: string;        // label is an i18n key
  type: "number"|"currency"|"integer"|"select"|"boolean"|"date";
  required?: boolean; default?: any;
  min?: number; max?: number; step?: number;
  options?: { value: string; label: string }[]; // label = i18n key
  help?: string;                       // i18n key, plain-language hint
  showIf?: Expr;                        // conditional visibility
}
```

**Formula / Eligibility condition** - both are `Expr`. Eligibility maps a boolean/score to a status + confidence:
```ts
interface EligibilityRule {
  status: "likely_qualifies"|"may_qualify"|"likely_not_eligible"|"need_local_review";
  when: Expr;                          // first matching rule wins
  confidence: "high"|"medium"|"low";
  reason: string;                      // i18n key - "why"
}
```

**Output**
```ts
interface OutputDef {
  name: string; label: string;         // i18n key
  expr: Expr;
  format: "currency"|"number"|"percent"|"text"|"boolean";
  primary?: boolean;                   // headline figure
  note?: string;                       // i18n key
}
```

**Source citation**
```ts
interface SourceCitation { title: string; url: string; publisher: string; retrieved: string; }
```

**Result output (engine return)**
```ts
interface CalculationResult {
  status: EligibilityRule["status"] | null;
  confidence: "high"|"medium"|"low" | null;
  outputs: { name: string; label: string; value: number|string|boolean; formatted: string; primary?: boolean; note?: string }[];
  reasons: string[];                   // resolved "why" strings
  missing: string[];                   // inputs needed for a firmer answer
  meta: { version: string; lastVerified: string; sources: SourceCitation[]; disclaimer: string };
}
```

**Translation key** - flat dot-namespaced: `us_child_tax_credit_2025.inputs.qualifyingChildren.label`. **Audit log** (Phase 2 / Postgres): `{ id, calculatorId, field, oldValue, newValue, changedBy, changedAt, sourceUrl, note }`.

### Missing-information handling
If a required input driving eligibility is absent, the engine returns `status: "may_qualify"`, lists the field in `missing[]`, and the UI prompts for it - never a false "not eligible."

---

## E. Multilingual & Regional Support

Languages by region: **US** en/es/zh/hi/ar/vi · **UK** en/pl/ur/ar/pa · **CA** en/fr/pa/zh/ar/tl. Implement with **next-intl**, message catalogs per locale keyed by the flat translation keys above.

- **Routing:** `/{region}/{lang}/...` (e.g. `/us/es/calculators/...`) - explicit selection beats IP, and is cache-friendly. Region/lang selectors always visible.
- **Currency/date:** from `Region` config via `Intl.NumberFormat` / `Intl.DateTimeFormat` (the existing `lib/currency.ts` already does locale-aware formatting and is reused).
- **Tax year:** US/CA calendar, UK 6 Apr–5 Apr - handled in `Region.taxYear`.
- **Fallback:** missing translation → English; never blank.
- **Plain-language mode:** translate labels/help/explanations/results; **preserve official legal/tax terms** and link them to the source definition rather than translating them away.
- **RTL:** `dir="rtl"` for Arabic/Urdu, logical Tailwind utilities.
- **SEO:** one localized static page per (calculator × region × language) with `hreflang` alternates.

---

## F. UX & User Flows

Shared shell for every flow: visible region + language selector, progress, trust strip (last-updated, "estimate, not advice", official source links).

1. **"What benefits do I qualify for?" wizard** - Screens: country → goal → 5–10 plain questions (age, household size, income, dependents, disability, housing) → results grid (per-program: status badge + estimated amount + why + documents + source + "next calculators"). Validation: Zod, friendly inline. Conversion: PDF report, pro referral.
2. **Property-tax exemption check** - location (ZIP/state/county) → age/income/disability/veteran/residence/home value → status + estimated annual saving + appeal opportunity → CTA to appeal firm (lead-gen).
3. **Property-tax estimate** - location + assessed/market value → estimated bill (millage) + comparison + "could you appeal?".
4. **Salary-after-tax** - region + gross + filing status + (state/province) → net pay, effective rate, breakdown chart, take-home by period.
5. **PDF report** - any result → branded PDF (inputs, result, confidence, sources, disclaimer, checklist) - premium.
6. **Compare scenarios** - duplicate inputs, tweak one ("what if income changes / I retire?"), side-by-side.
7. **Document checklist** - generated from the calculator's program → printable list.
8. **Refer to a professional** - matched by category + region → lead form (highest-value monetization).

Result taxonomy shown everywhere: **Likely qualifies / May qualify / Likely not eligible / Need local review**, each with a confidence dot and a one-line "why."

---

## G. Implementation Plan (phased)

**Phase 1 - Core MVP (this is what the shipped foundation starts):** engine (`expr` + `evaluate`), region/locale config, calculator-definition format, dynamic form + result + source/disclaimer UI, first calculators, programmatic SEO pages, GA already wired. *Done this session: engine + region layer + CTC end-to-end + verification harness.*

**Phase 2 - Expansion:** remaining MVP-20 calculators, UK + CA regions, next-intl with es/fr first, PDF reports, AI explanation layer (explain result / suggest next / translate), PostHog funnels, lead-capture forms, Supabase + admin (Payload/Retool) seeded from the JSON rules, audit log.

**Phase 3 - Monetization:** premium PDF, professional-referral marketplace, ad placements on high-traffic pages, affiliate offers, embeddable widgets, email capture, deadline reminders.

**Phase 4 - Scale:** more states/provinces/counties, more languages, automated rule-update workflows + scheduled re-verification, calculator golden-test CI gate, admin QA, public B2B API, white-label widgets.

---

## H. How We Implement (working method)

For each new calculator we repeat a tight loop, *driven by data not new pages*:
1. Research official figures → cite sources, record `lastVerified`.
2. Write the `CalculatorDefinition` (inputs, tables, derived, outputs, eligibility, tests).
3. Add golden test vectors; run `verify` - must pass before UI.
4. Register it; the existing `DynamicCalculator` renders it with **no new page code** (or a thin SEO page wrapper).
5. Add translations for its keys.
6. Verify build + manual check, then ship.

**Conventions:** folder structure above · Zod generated from inputs · expression-AST rules (no `eval`) · validation inline + Zod · flat dot-namespaced translation keys · static SEO pages via `generateStaticParams` · admin/audit deferred to Phase 2 Postgres · Vitest golden vectors in CI · deploy on Vercel.

**Definition of done per calculator:** real sourced figures, passing golden vectors, disclaimer + last-updated + confidence + sources rendered, English + at least one target language, builds clean.
