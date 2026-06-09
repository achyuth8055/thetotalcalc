// Render smoke test: mounts the DynamicCalculator to static HTML to confirm the
// component tree (engine + result panel + sources) renders without runtime
// errors. Run: npx tsx scripts/render-smoke.tsx
import React from "react";
import { renderToString } from "react-dom/server";
import DynamicCalculator from "../components/engine/DynamicCalculator";
import { usChildTaxCredit2025 } from "../data/calculators/us-child-tax-credit-2025";

const html = renderToString(React.createElement(DynamicCalculator, { def: usChildTaxCredit2025 }));

const checks: [string, boolean][] = [
  ["renders a heading/label", html.includes("Filing status")],
  ["shows primary credit figure", html.includes("Estimated Child Tax Credit")],
  ["shows an eligibility badge", /Likely qualifies|May qualify|Likely not eligible/.test(html)],
  ["shows a formatted currency value", html.includes("$")],
  ["shows source citation", html.includes("Last verified")],
  ["shows disclaimer", html.toLowerCase().includes("not tax")],
];

let ok = true;
for (const [name, pass] of checks) {
  console.log(`${pass ? "✓" : "✗"} ${name}`);
  if (!pass) ok = false;
}
console.log(`\nHTML length: ${html.length} chars`);
process.exit(ok ? 0 : 1);
