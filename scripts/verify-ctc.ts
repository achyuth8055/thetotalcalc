// Runtime correctness check for the rules engine, run with: npx tsx scripts/verify-ctc.ts
// Validates every calculator's golden test vectors against runCalculator().
// Uses relative imports (no @/ alias) so it runs outside Next's bundler.

import { runCalculator } from "../lib/engine/evaluate";
import { ENGINE_CALCULATORS } from "../data/calculators/registry";

let failures = 0;
let checks = 0;

for (const def of ENGINE_CALCULATORS) {
  if (!def.tests || def.tests.length === 0) continue;
  console.log(`\n=== ${def.id} ===`);
  for (const tv of def.tests) {
    const result = runCalculator(def, tv.inputs, { locale: "en-US", currency: "USD" });
    const outputByName = Object.fromEntries(result.outputs.map((o) => [o.name, o.value]));
    const parts: string[] = [];
    let testFailed = false;
    for (const [key, expected] of Object.entries(tv.expect)) {
      checks++;
      const actual = outputByName[key];
      const bothNumeric = !Number.isNaN(Number(actual)) && !Number.isNaN(Number(expected));
      const ok =
        actual === expected ||
        Number(actual) === Number(expected) ||
        (bothNumeric && Math.abs(Number(actual) - Number(expected)) < 0.5); // sub-dollar rounding
      if (!ok) {
        testFailed = true;
        failures++;
      }
      parts.push(`${ok ? "✓" : "✗"} ${key}=${actual} (want ${expected})`);
    }
    const label = tv.name ?? JSON.stringify(tv.inputs);
    console.log(`  ${testFailed ? "FAIL" : "pass"}: ${label}`);
    console.log(`        ${parts.join("  ")}`);
    console.log(`        status=${result.status} confidence=${result.confidence}`);
  }
}

console.log(`\n${checks - failures}/${checks} assertions passed.`);
if (failures > 0) {
  console.error(`${failures} assertion(s) FAILED.`);
  process.exit(1);
} else {
  console.log("All golden vectors passed. ✅");
}
