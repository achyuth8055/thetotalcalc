# Calculator Usability & Result-Visibility Audit

_Audit of all 82 calculator pages (engine-driven + classic) from a first-time user's perspective, focused on getting users to a visible, understandable result in seconds — especially on mobile._

---

## 1. Executive summary

The common failure mode for calculator sites — "type, click Calculate, then scroll to hunt for the answer" — is **largely already avoided** here, because the site computes results **live** as the user types. The audit found:

- **75 of 82 pages recompute live** (via `useEffect`/`useMemo`); only **1 page** (`add-subtract-days`) had a true manual "Calculate" button that didn't move the user to the result.
- **51 pages already use a side-by-side desktop layout** (inputs left, results right). The remaining "single-column" pages mostly keep their two-column layout inside a widget, so desktop is fine too.
- **The real, universal gap is mobile.** When the desktop grid collapses to one column, the result panel renders *below* every input with no persistent summary, no auto-scroll, and no signal that an answer appeared. A first-time mobile user often cannot tell the calculator "did anything."

The fix strategy was therefore: **make the result impossible to miss on mobile**, fix the one genuine button page, and standardize a reusable pattern so the remaining pages are a 3-line change each.

### Root cause (the one that matters)

| | |
|---|---|
| **Symptom** | On mobile, after entering data the result is off-screen below the inputs; users perceive "nothing happened." |
| **Root cause** | Responsive grids collapse to a single column; result panels sit after all inputs in DOM order with no sticky/floating affordance. |
| **Fix** | A shared **sticky bottom result bar** (`MobileResultBar`) that surfaces the headline figure the instant it's computed, is announced to screen readers, and auto-hides once the full results scroll into view. |

---

## 2. What was implemented in this pass

### New reusable primitives

| File | Purpose |
|---|---|
| `components/calculators/MobileResultBar.tsx` | Sticky bottom summary bar (mobile only, `md:hidden`). Shows label + headline value + optional sub-line, colored by tone (primary / positive / warning / neutral). `aria-live="polite"` for screen readers, safe-area padding for notched phones, and an `IntersectionObserver` that hides the bar once the real results are on screen so it's never redundant. Tapping it smooth-scrolls to the results. |
| `lib/ui/scrollToResults.ts` | `scrollToResults(id="results")` helper for button-triggered calculators; respects `prefers-reduced-motion`. |

### Shared components (propagate to many pages at once)

| File | Change |
|---|---|
| `components/engine/DynamicCalculator.tsx` | Rebuilt the engine calculator layout: **side-by-side on desktop** (`lg:grid-cols-[1fr_360px]`, inputs left, live results right with a divider), **stacked on mobile** with the results anchored at `id="results"` and a `MobileResultBar` showing the primary figure **or the eligibility outcome** (with confidence/status tone). This single change covers **every engine-driven calculator** (tax, benefits, eligibility, etc.). |
| `app/calc/[slug]/page.tsx` | Widened the engine page container to `max-w-5xl` so the two-column calculator has room; kept FAQ/explainer/links at `max-w-3xl` for readability. |

### Individual pages wired with the result bar + `#results` anchor

`health/bmi-calculator`, `finance/mortgage-calculator`, `finance/loan-calculator`, `everyday/tip-calculator`, `everyday/discount-calculator`, `date/add-subtract-days-calculator` (also gets scroll-on-calculate), plus the two widget-based pages via `components/calculators/AffordabilityWidget.tsx` and `DebtPayoffWidget.tsx`. `math/percentage-calculator` received the `#results` scroll anchor (it has three result modes, so no single headline value).

All changes pass `tsc --noEmit` and a production compile.

---

## 3. The rollout pattern for remaining pages

Adding the result bar to any remaining live calculator is a **three-line change**. Use this exact pattern:

```tsx
// 1) import at top of the page
import MobileResultBar from "@/components/calculators/MobileResultBar";

// 2) put an id + scroll-margin on the element that wraps the result
<div id="results" className="scroll-mt-24 ...existing classes">
  {/* existing result UI */}
</div>

// 3) render the bar inside the page root (after the main content)
<MobileResultBar
  label="Monthly payment"                 // what the headline figure is
  value={result ? fmt(result.monthly) : ""} // the formatted headline value
  sub={result ? `Total interest ${fmt(result.totalInterest)}` : undefined}
  tone="primary"                          // primary | positive | warning | neutral
  show={!!result}
/>
```

For a page with an explicit **Calculate** button, also wrap the click:

```tsx
import { scrollToResults } from "@/lib/ui/scrollToResults";

<button onClick={() => { calculate(); requestAnimationFrame(() => scrollToResults()); }}>
  Calculate
</button>
```

**Tone guidance:** use `positive` for good outcomes (qualifies, savings, on-track), `warning` for caution (over budget, may-qualify, not-on-track), `neutral`/`primary` for plain figures.

---

## 4. Remaining pages — prioritized checklist

Each of these is live and already has a reasonable desktop layout; they just need the 3-line bar pattern above. Listed with the headline value to surface. Prioritized by likely traffic.

### Tier 1 — highest-traffic, do first

| Page | File | Bar label → value |
|---|---|---|
| Percentage (value already anchored) | `math/percentage-calculator` | (multi-mode — optional: show active mode) |
| EMI | `finance/emi-calculator` | "Monthly EMI" → formatted EMI |
| Home loan EMI | `finance/home-loan-emi-calculator` | "Monthly EMI" |
| Car loan EMI | `finance/car-loan-emi-calculator` | "Monthly payment" |
| SIP | `finance/sip-calculator` | "Future value" |
| Compound interest | `finance/compound-interest-calculator` | "Future value" |
| Income tax | `finance/income-tax-calculator` | "Estimated tax" / "Take-home" |
| Paycheck | `finance/paycheck-calculator` | "Take-home pay" |
| Age | `date/age-calculator` | "Your age" → "32 yrs 4 mo" |
| Calorie | `health/calorie-calculator` | "Daily calories" |
| BMR | `health/bmr-calculator` | "BMR" |

### Tier 2 — finance depth

`investment`, `retirement`, `401k`, `fd`, `swp`, `net-worth`, `debt-to-income`, `pmi`, `refinance`, `inflation`, `trade`, `roth-vs-traditional-ira`, `social-security`, `rmd`, `hsa`, `freelance-tax`, `student-loan`, `college-cost`, `home-affordability`, `emergency-fund`, `car-lease-vs-buy`, `brokerage`, `margin`, `flat-vs-reducing-rate` — all in `app/calculators/finance/`.

### Tier 3 — math / date / everyday / converters / developer

Math: `average`, `gpa`, `grade`, `ratio`, `fraction`, `scientific`, `math-solver`, `graphing`, `math-quiz`.
Date: `date-difference`, `countdown`, `time`.
Everyday: `split-bill`, `unit-converter`, `unit-price`, `fuel-cost`, `electricity-cost`, `work-hours`.
Converters: `weight`, `length`, `temperature`, `currency`.
Developer: `binary`, `hex`, `ascii`, `base64-encoder`, `color-converter` (these are instant text transforms; the bar is optional — their output is already adjacent to input).

---

## 5. Broader usability recommendations

Beyond result visibility, these raise the overall polish and reduce abandonment. Ordered by impact-to-effort.

### 5.1 Visual hierarchy of the headline result
The engine `ResultPanel` does this well (one big primary figure, secondary rows muted). Several classic pages give equal visual weight to every number. **Recommendation:** ensure every calculator has exactly one dominant figure (largest, colored, top of the result card), with supporting numbers smaller and muted — mirror the `bg-primary text-on-primary` primary block used in `ResultPanel`.

### 5.2 Field grouping & form length
Long finance forms (mortgage, paycheck, retirement) show all fields flat. **Recommendation:** group advanced/optional inputs under a collapsible "Advanced options" `<details>` so the first screen shows only the 3–4 inputs needed for a first answer. Fewer visible fields = faster first result = lower abandonment.

### 5.3 Input affordances
Number inputs paired with sliders (as in BMI) are excellent — they invite interaction and make the live-update behavior obvious. **Recommendation:** extend the slider+number pattern to the high-traffic finance inputs (loan amount, rate, term) where ranges are bounded. Add unit prefixes/suffixes ($/%/yrs) inside the field for clarity.

### 5.4 Call-to-action prominence
For the few button pages and for "Print/PDF" and "Reset" actions, ensure the primary action is visually dominant (filled, full-width on mobile) and secondary actions are outlined/ghost. Avoid two same-weight buttons competing.

### 5.5 Accessibility (also helps SEO & Lighthouse)
- The new result bar uses `role="status"` + `aria-live="polite"` so results are announced. Apply the same `aria-live` to in-page result containers that update live, so screen-reader users hear the new value without the bar.
- Ensure every input has an associated `<label htmlFor>` (some use adjacent text only).
- Verify color is never the sole signal for eligibility/health status — pair with an icon or text label (the engine `ResultPanel` already does this).
- Sliders need `aria-label` and visible focus rings.

### 5.6 Speed / perceived performance
- Charts (`recharts`) are the heaviest dependency. They're already tree-shaken via `optimizePackageImports`. **Recommendation:** lazy-load chart blocks (`next/dynamic`, `ssr:false`) so the calculator and its primary result paint before the chart hydrates — the number is what users want first.
- Keep the result card above the fold on mobile by minimizing hero/description height on calculator pages (the engine header is concise; some classic pages have a tall intro that pushes inputs down).

### 5.7 Trust & next steps
- The engine `ResultPanel` surfaces sources, document checklists, and "add X for a firmer answer" — excellent. **Recommendation:** bring a compact "Sources" line and a "What to do next / related calculators" block to classic pages too (most have related-calculator chips already; add a one-line methodology/source note for YMYL finance/health pages — good for both users and E-E-A-T).

---

## 6. Suggested sequencing

1. **Done:** primitives, engine layout (all engine calcs), 8 flagship/high-risk pages + 2 widgets.
2. **Next (1 short pass):** Tier-1 pages in §4 — 11 highest-traffic calculators, ~3 lines each.
3. **Then:** Tier-2 finance, Tier-3 utilities.
4. **Polish pass:** §5.2 (collapsible advanced fields) and §5.6 (lazy charts) on the heaviest finance pages.

Every step is independently shippable and low-risk; the shared `MobileResultBar` means visual consistency is automatic.
