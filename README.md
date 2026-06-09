# OnlineCalc — Benefits, Tax & Savings Calculator Hub

> **"Am I missing money?"** — OnlineCalc is a free, region-aware platform of calculators and guided
> eligibility checks for **benefits, taxes, property tax, exemptions, and take-home pay**, plus a large
> library of everyday/finance/math/health/developer calculators.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Calculations run through a
**deterministic rules engine** (no AI guesses), every tool cites official sources and a "last verified"
date, and the whole site is multilingual and region-aware.

- **51 calculators total** — 14 engine-driven (benefits/tax/property/finance/engineering) + 37 classic utility calculators.
- **3 primary regions:** United States, United Kingdom, Canada (region selector also lists Germany, Switzerland, Norway, New Zealand, Australia, Russia, Europe).
- **9 UI languages:** English, Spanish, French, German, Italian, Norwegian, Russian, Chinese, Arabic (RTL).
- **AdSense-ready:** consent banner (Google Consent Mode v2), `ads.txt`, privacy/terms/contact/advertising-disclosure/methodology pages.

---

## Table of Contents

1. [What this is](#what-this-is)
2. [Quick start](#quick-start)
3. [The calculators](#the-calculators)
   - [Engine-driven calculators (14)](#a-engine-driven-calculators-14--live)
   - [Classic utility calculators (37)](#b-classic-utility-calculators-37--live)
4. [How the rules engine works](#how-the-rules-engine-works)
5. [Adding a new calculator](#adding-a-new-calculator)
6. [Regions & internationalization](#regions--internationalization)
7. [Project structure](#project-structure)
8. [Testing & verification](#testing--verification)
9. [AdSense / monetization readiness](#adsense--monetization-readiness)
10. [Accuracy, sources & disclaimers](#accuracy-sources--disclaimers)
11. [Deployment](#deployment)
12. [Roadmap & known limitations](#roadmap--known-limitations)

---

## What this is

Government rules about money are scattered, jargon-heavy, and hard to act on. OnlineCalc turns them into
fast, plain-language tools that answer concrete questions — *how much is this credit worth, do I qualify
for this benefit, what will this tax or exemption cost or save me, what's my take-home pay* — in seconds,
with no account required.

**Core principles**

- **Deterministic, not AI.** Every eligibility result and amount is computed by a rules engine from
  official formulas. AI is reserved for explaining/translating results, never for deciding them.
- **Sourced & dated.** Each engine calculator carries official source links, a tax/benefit year, a
  "last verified" date, a confidence level, and a clear "not advice" disclaimer.
- **Region-aware.** Currency, date format, tax year, and eligibility rules follow the selected region.
- **Private by default.** No login; inputs are processed in the browser and not stored as an identity.

---

## Quick start

```bash
# Node 18+ recommended
npm install

npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint

# Verify all calculator math against golden test vectors:
npx tsx scripts/verify-ctc.ts
```

**Stack:** Next.js `^14.2`, React `^18.3`, TypeScript `^5.4`, Tailwind `^3.4`. Analytics via GA4;
ads via Google AdSense; icons via Material Symbols; font Public Sans.

---

## The calculators

There are two families:

- **Engine-driven calculators** — defined as data and evaluated by the rules engine. These are the
  benefits/tax/property/finance/engineering tools with sources, eligibility, and confidence.
- **Classic utility calculators** — the original hand-built calculators (finance, math, health, date,
  everyday, developer, converters).

### A. Engine-driven calculators (14) — **LIVE**

All are fully functional. Figures verified **2026-06-09**. Currency follows the region (US `$`, UK `£`,
CA `CA$`). Estimates only — see each tool's disclaimer.

| # | Calculator | Region | Route | What it computes | Key figures / sources |
|---|------------|--------|-------|------------------|------------------------|
| 1 | **US Child Tax Credit (2025)** | US | `/calculators/benefits/us-child-tax-credit` | Estimated CTC + refundable portion (ACTC) + eligibility | $2,200/child (under 17); ACTC up to $1,700 = 15% of earned income over $2,500; phase-out $200k single / $400k MFJ, −$50 per $1,000. Source: IRS |
| 2 | **Loan EMI Calculator** | Global¹ | `/calc/loan-emi` | Monthly payment, total interest, total payable | Standard amortization `P·r·(1+r)ⁿ / ((1+r)ⁿ−1)` |
| 3 | **Credit Card Payoff & APR** | Global¹ | `/calc/credit-card-payoff` | Months to clear balance, total interest, monthly interest charge | Payoff formula via logarithms; flags when payment < interest |
| 4 | **Compound Interest** | Global¹ | `/calc/compound-interest` | Future value + interest with monthly contributions | FV of principal + annuity of contributions |
| 5 | **US Federal Income Tax (2025)** | US | `/calc/us-income-tax` | Federal income tax, taxable income, effective rate, after-tax | 2025 brackets; std deduction $15,750 single / $31,500 MFJ. Source: IRS |
| 6 | **Ohm's Law** | Global¹ | `/calc/ohms-law` | Solve V / I / R + power from any two values | `V = I·R`, `P = V·I` |
| 7 | **US Property Tax Estimator** | US | `/calc/us-property-tax` | Annual + monthly property tax by state | State avg effective rates (e.g. NJ 2.23%, TX 1.68%, CA 0.71%). Source: Tax Foundation |
| 8 | **Homestead Exemption Checker** | US | `/calc/us-homestead-exemption` | Eligibility + estimated annual saving | Per-state exemption (FL $50k, TX $100k, IL $10k, NY $30k, CA $7k) × effective rate |
| 9 | **US Salary After Tax (2025)** | US | `/calc/us-salary-after-tax` | Take-home after federal income tax + FICA | FICA: SS 6.2% to $176,100 wage base, Medicare 1.45% + 0.9% over $200k/$250k. Source: IRS |
| 10 | **Earned Income Tax Credit (2025)** | US | `/calc/us-eitc` | EITC estimate + eligibility | Max $649/$4,328/$7,152/$8,046 (0/1/2/3+ kids); phase-in 7.65/34/40/45%; investment-income cutoff $11,950. Source: IRS |
| 11 | **Universal Credit Estimator** | UK | `/calc/uk-universal-credit` | Monthly UC estimate (simplified) | 2025/26 standard allowances £316.98–£628.10; child elements £333.33 / £287.92; 55% taper. Source: GOV.UK |
| 12 | **Council Tax Reduction Checker** | UK | `/calc/uk-council-tax-reduction` | Eligibility pre-check + rough reduction estimate | Income/savings test; council-specific (indicative). Source: GOV.UK |
| 13 | **Canada Child Benefit (2025–26)** | CA | `/calc/ca-child-benefit` | Annual + monthly CCB | Max $7,997 (<6) / $6,748 (6–17); reduction thresholds $37,487 & $81,222. Source: CRA |
| 14 | **GST/HST Credit Estimator (2025–26)** | CA | `/calc/ca-gst-hst-credit` | Annual + quarterly credit (simplified) | Base $533 single / $698 couple + $184/child; 5% phase-out over $45,521. Source: CRA |

¹ *"Global" math calculators use USD formatting by default; the formula is currency-independent.*

> **Calculator #1 (Child Tax Credit)** has a bespoke, fully designed detail page. **Calculators #2–14**
> render through the generic `/calc/[slug]` route — adding more requires only a data file (no new page code).

### B. Classic utility calculators (37) — **LIVE**

Hand-built calculators under `/calculators/{category}/{slug}`. All functional.

**Finance (9):** EMI · Home Loan EMI · Car Loan EMI · SIP · FD · SWP · Margin · Brokerage · Flat vs Reducing Rate
`/calculators/finance/...`

**Converters / Conversion (4):** Weight · Length · Temperature · Currency
`/calculators/converters/...`

**Math (7):** Scientific Calculator · Math Quiz & Practice · Percentage · Average · GPA · Grade · Ratio
`/calculators/math/...`

**Health (4):** BMI · BMR · Calorie · Ideal Weight
`/calculators/health/...`

**Date & Time (4):** Age · Date Difference · Add/Subtract Days · Countdown
`/calculators/date/...`

**Everyday (4):** Discount · Tip · Split Bill · Unit Converter
`/calculators/everyday/...`

**Developer (5):** Binary · Hex · ASCII · Base64 Encoder/Decoder · Color Converter
`/calculators/developer/...`

> **Discovery:** the calculator directory at **`/calculators`** lists everything with filters for
> **Country/Region**, **Category** (Benefits, Property Tax, Tax Credits, Salary & Wages, Finance & Loans,
> Engineering, Health, Math, Conversion, Date & Time, Everyday, Developer), **Tax Year**, and a search box,
> with pagination. Selecting a region shows that region's tools plus region-agnostic tools.

---

## How the rules engine works

The engine lives in `lib/engine/` and is the heart of the platform.

### 1. Expression AST (`lib/engine/types.ts`, `lib/engine/expr.ts`)

Formulas and conditions are **JSON-serializable expression trees**, not code strings — so there is no
`eval`, rules are safe and diff-able, and they can move to a database later unchanged.

```ts
type Expr =
  | number | boolean | string                       // literal
  | { var: string }                                  // read an input / derived value
  | { op: ArithOp; args: Expr[] }                    // + - * / min max clamp floor ceil round pow ln exp abs sqrt
  | { cmp: CmpOp; left: Expr; right: Expr }          // < <= > >= == !=
  | { all: Expr[] } | { any: Expr[] } | { not: Expr } // logical
  | { if: Expr; then: Expr; else: Expr }             // conditional (lazy)
  | { lookup: string; key: Expr };                   // named table lookup (e.g. threshold by filing status)
```

The interpreter in `expr.ts` walks this tree against a context of input + derived values. Unknown
variables throw, so authoring mistakes surface in tests rather than producing silent wrong numbers.

### 2. Calculator definition

A calculator is **data** (`CalculatorDefinition`): `inputs`, optional `tables` (lookup tables),
`derived` (intermediate values computed in order), `outputs`, optional `eligibility` rules, plus
`sources`, `disclaimer`, `version`, `effectiveYear`, `lastVerified`, optional `faqs`/`documents`, and
**`tests`** (golden input→output vectors).

### 3. `runCalculator()` (`lib/engine/evaluate.ts`)

Pure function: coerces/defaults inputs (tracking missing required ones), computes derived vars, resolves
outputs (with locale/currency formatting), then evaluates eligibility (first matching rule wins) into a
**status** (`likely_qualifies` / `may_qualify` / `likely_not_eligible` / `need_local_review`) and a
**confidence** (`high`/`medium`/`low`). Missing required info never produces a hard "not eligible".

### 4. UI (`components/engine/`)

`DynamicCalculator` renders the form from the input schema and runs the engine live on every change;
`ResultPanel` shows the eligibility badge, primary figure, secondary figures, missing-info prompt,
document checklist, and `SourceCitations` (sources + last-verified + disclaimer). **One component set
renders any calculator** — no per-calculator UI code.

---

## Adding a new calculator

1. Create a definition file in `data/calculators/` (or add to `more.ts` / `roadmap.ts`).
2. Define `inputs`, `tables`, `derived`, `outputs`, optional `eligibility`, `sources`, `disclaimer`,
   `version`, `effectiveYear`, `lastVerified`, and **`tests`** (golden vectors).
3. Register it in `data/calculators/registry.ts` (`ENGINE_CALCULATORS`).
4. Add a card to `data/directory.ts` linking to `/calc/<slug>` (it appears in the directory + filters).
5. Run `npx tsx scripts/verify-ctc.ts` — your golden vectors must pass.

That's it — the generic `/calc/[slug]` route renders the detail page automatically. (Use a bespoke page,
like the Child Tax Credit, only when you want a custom layout.)

---

## Regions & internationalization

### Region detection (`lib/region-detection.ts`, `components/RegionContext.tsx`)
- Resolves region: stored choice → IP geolocation (ipapi.co) → timezone → `Global`.
- Supported region codes: **US, CA, UK, DE, CH, NO, NZ, AU, RU, EU, Global**.
- A site-wide banner ("We detected you're in … — Proceed to … calculators") appears after auto-detection;
  the nav + directory selectors let users change it, and the choice persists.
- Flags render as inline SVG via `components/RegionFlag.tsx`.

### Languages (`lib/i18n.ts`, `lib/languages.ts`, `components/LanguageContext.tsx`)
- **9 UI languages:** `en, es, fr, de, it, no, ru, zh, ar` (Arabic switches the page to RTL).
- A `t(key)` function (via `useT()` / language context) translates the **UI chrome**: navigation, hero,
  buttons, section titles, directory filters/labels, region banner, cookie consent, and footer headings,
  with English fallback for any missing key.
- **Scope note:** UI chrome is translated; **calculator rule content and legal pages remain in English**
  by design, to avoid mistranslating financial/legal terms (official terminology is preserved). Full
  message-catalog translation (next-intl) of long-form content is the planned next step.

### Locale formatting
Currency and dates use `Intl.NumberFormat` / `Intl.DateTimeFormat` keyed off the region (`lib/regions.ts`,
`lib/currency.ts`): US `$`/MM-DD-YYYY, UK `£`/DD-MM-YYYY, CA `CA$`/YYYY-MM-DD; tax-year handling per region.

---

## Project structure

```
thetotalcalc/
├─ app/
│  ├─ layout.tsx                  # root layout: providers, GA, consent-mode v2, AdSense, fonts
│  ├─ page.tsx                    # homepage (thin server wrapper -> HomeContent)
│  ├─ calculators/
│  │  ├─ page.tsx                 # calculator directory (filters + search + pagination)
│  │  ├─ benefits/us-child-tax-credit/page.tsx   # bespoke CTC detail page
│  │  └─ {finance,math,health,date,everyday,developer,converters}/<slug>/page.tsx  # 37 classic calcs
│  ├─ calc/[slug]/page.tsx        # generic engine calculator route (renders any registered def)
│  ├─ report/page.tsx             # sample personalized benefits report
│  ├─ about | contact | privacy | terms | advertising-disclosure | methodology  # trust/legal pages
│  ├─ sitemap.ts | robots.ts | globals.css
├─ components/
│  ├─ Navigation.tsx | Footer.tsx | Breadcrumbs.tsx | CalculatorLayout.tsx
│  ├─ RegionContext.tsx | RegionBanner.tsx | RegionFlag.tsx | LanguageContext.tsx
│  ├─ CookieConsent.tsx | LegalShell.tsx
│  ├─ home/HomeContent.tsx | home/RegionCards.tsx
│  ├─ directory/DirectoryClient.tsx
│  └─ engine/{DynamicCalculator,ResultPanel,SourceCitations}.tsx
├─ lib/
│  ├─ engine/{types,expr,evaluate}.ts   # the rules engine
│  ├─ regions.ts | region-detection.ts | languages.ts | i18n.ts | currency.ts | site.ts
├─ data/
│  ├─ calculators.ts              # 37 classic calculators (registry + categories)
│  ├─ calculators/{us-child-tax-credit-2025,more,roadmap,registry}.ts  # engine definitions
│  └─ directory.ts                # unified directory catalog
├─ public/ads.txt                 # AdSense ads.txt
├─ scripts/verify-ctc.ts          # golden-vector test runner for all engine calculators
└─ docs/{IMPLEMENTATION_PLAN.md, ADSENSE_CHECKLIST.md}
```

---

## Testing & verification

- **Golden vectors:** every engine calculator ships a `tests` array of `{inputs, expect}` cases.
  `scripts/verify-ctc.ts` runs them all (sub-dollar tolerance for floats). Current status: **41/41
  assertions pass across all 14 engine calculators.**
  ```bash
  npx tsx scripts/verify-ctc.ts
  ```
- **Type safety:** `npx tsc --noEmit` (clean).
- **Render check:** `npm run dev` then load `/`, `/calculators`, and any `/calc/<slug>`.
- Recommended next: migrate golden vectors to Vitest and add Playwright E2E for the top flows.

---

## AdSense / monetization readiness

Implemented (see `docs/ADSENSE_CHECKLIST.md` for the full analysis vs. a fast-approved reference site):

- **`public/ads.txt`** with the publisher ID.
- **Cookie consent banner** with **Google Consent Mode v2** (ad/analytics storage default *denied* until accepted).
- **Substantial original content** on the homepage (value prop, "How we calculate" + sourced methodology, FAQ).
- **Trust/legal pages:** Privacy Policy (AdSense + GDPR + CCPA), Terms, Contact, Advertising Disclosure, Methodology, About.
- **E-E-A-T signals:** sources, last-verified dates, confidence levels, disclaimers on every engine calculator.

**Before submitting to AdSense (action items):**
1. Set a real contact email + owner name in `lib/site.ts` (currently placeholders).
2. Confirm the publisher ID in `lib/site.ts`, `public/ads.txt`, and `app/layout.tsx`.
3. Deploy on the live HTTPS domain.
4. For EEA/UK personalized ads, add a Google-certified CMP (the included banner is a baseline).

---

## Accuracy, sources & disclaimers

- Engine figures are taken from official publications (IRS, SSA, GOV.UK/HMRC, Canada.ca/CRA, Tax
  Foundation) and verified **2026-06-09**; each tool links its sources and shows a "last verified" date.
- All tools are **estimates and general information — not tax, legal, or financial advice.** Confirm with
  the relevant agency or a qualified professional before acting.
- **Simplified by design:** *Universal Credit* and *Council Tax Reduction* are simplified/indicative
  (these vary by circumstance/council — both say so and link to GOV.UK); *Salary After Tax* covers
  federal income tax + FICA only (no state/local tax yet); *GST/HST credit* approximates the single
  supplement.

---

## Deployment

Optimized for **Vercel**. Calculator/landing pages are statically generated where possible; the engine
runs identically client-side (instant feedback) and could run server-side via API routes if a non-JS
consumer needs it. Set environment/IDs before deploying:

- Update `lib/site.ts` (domain, contact, owner, publisher ID).
- Replace the Google verification placeholder in `app/layout.tsx` metadata.
- Ensure GA4 ID and AdSense client ID are correct.

---

## Roadmap & known limitations

- **Translate long-form content** (calculator text + legal pages) via next-intl message catalogs.
- **State/provincial layers:** US state income tax in Salary After Tax; UK/Canada salary calculators.
- **More calculators per region** (SNAP/Medicaid pre-checks, Pension Credit, OAS/GIS, RRSP, capital gains).
- **Restyle the 37 classic calculators** to the new Material-3 theme (their detail pages still use older inline styling).
- **Persistence/admin:** move rules from in-repo files to Postgres with an audit log + admin UI (engine contract unchanged).
- **Premium features:** PDF reports, professional referrals, embeddable widgets, B2B API.

---

*OnlineCalc is an informational tool and does not constitute tax, legal, or financial advice. See the
in-app Privacy Policy, Terms, and Advertising Disclosure for full details.*
