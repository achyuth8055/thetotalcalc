# OnlineCalc - Project Guidelines

Next.js 14 (App Router) + TypeScript + Tailwind. Region-aware benefits, tax, and
calculator hub. AdSense + SEO sensitive, so content quality and originality matter.

## Design & content rules (enforced)

These apply to every page, component, and content file. Do not violate them, and
flag any existing code that does.

1. **No gradient colors.** Use solid colors only - no `bg-gradient-*`,
   `linear-gradient`, `radial-gradient`, or gradient borders/text. Use the flat
   surface tokens from `tailwind.config.ts` (`surface`, `surface-container-*`,
   `primary`, etc.).

2. **No emoji icons.** Never use emoji (✅, 🚀, 💰, etc.) as UI icons or in
   content. Use the project's icon systems instead: `react-icons` or Material
   Symbols (`.material-symbols-outlined`).

3. **No em dashes.** Never use `—` (U+2014). Use a hyphen `-`, or rewrite the
   sentence. This applies to code, comments, copy, metadata, and Markdown.

4. **No thin content.** Every page must carry substantive, original, useful
   content - clear explanations, real guidance, sourced facts. No placeholder or
   filler pages. Calculators should include context: what it does, how it works,
   worked examples, and caveats.

5. **No duplicate or near-duplicate content.** Do not reuse the same copy,
   intros, FAQs, or descriptions across pages. Each page (especially each
   calculator and category page) must have unique titles, meta descriptions,
   headings, and body text. Avoid boilerplate that only swaps a single word.

## Notes

- Money figures must carry an "estimate only - not financial/tax/legal advice"
  disclaimer and cite official sources.
- Keep copy plain-language (aim ~8th-grade reading level).
