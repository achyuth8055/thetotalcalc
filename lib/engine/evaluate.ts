// runCalculator(): the deterministic core. Given a calculator definition and a
// set of raw input values, it builds an evaluation context, computes derived
// variables, resolves outputs, determines eligibility status + confidence, and
// reports any missing required inputs. Pure and side-effect free, so it runs
// identically on the client (instant feedback) and the server (reproducible).

import { evaluate, evalNumber, type EvalContext, type EvalValue } from "./expr";
import type {
  CalculatorDefinition,
  CalculationResult,
  ResolvedOutput,
} from "./types";

export interface FormatLocale {
  locale: string; // e.g. "en-US"
  currency: string; // e.g. "USD"
}

const DEFAULT_LOCALE: FormatLocale = { locale: "en-US", currency: "USD" };

function coerceInput(raw: unknown, type: string): EvalValue | undefined {
  if (raw === undefined || raw === null || raw === "") return undefined;
  switch (type) {
    case "number":
    case "currency":
    case "integer": {
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    }
    case "boolean":
      return raw === true || raw === "true" || raw === 1 || raw === "1";
    default:
      return String(raw);
  }
}

function formatValue(
  value: EvalValue,
  format: string,
  loc: FormatLocale
): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat(loc.locale, {
        style: "currency",
        currency: loc.currency,
        maximumFractionDigits: 0,
      }).format(Number(value));
    case "number":
      return new Intl.NumberFormat(loc.locale).format(Number(value));
    case "percent":
      return new Intl.NumberFormat(loc.locale, {
        style: "percent",
        maximumFractionDigits: 1,
      }).format(Number(value) / 100);
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return String(value);
  }
}

export function runCalculator(
  def: CalculatorDefinition,
  rawInputs: Record<string, unknown>,
  loc: FormatLocale = DEFAULT_LOCALE
): CalculationResult {
  const tables = def.tables ?? {};
  const ctx: EvalContext = {};
  const missing: string[] = [];

  // 1. Coerce + load inputs (apply defaults), track missing required inputs.
  for (const field of def.inputs) {
    const provided = coerceInput(rawInputs[field.name], field.type);
    if (provided !== undefined) {
      ctx[field.name] = provided;
    } else if (field.default !== undefined) {
      ctx[field.name] = field.default as EvalValue;
    } else if (field.required) {
      missing.push(field.name);
      // Provide a neutral zero/empty so downstream expressions don't throw.
      ctx[field.name] = field.type === "boolean" ? false : field.type === "select" || field.type === "date" ? "" : 0;
    } else {
      ctx[field.name] = field.type === "boolean" ? false : 0;
    }
  }

  // 2. Compute derived variables in order (each may reference earlier ones).
  for (const d of def.derived ?? []) {
    ctx[d.name] = evaluate(d.expr, ctx, tables);
  }

  // 3. Resolve outputs.
  const outputs: ResolvedOutput[] = def.outputs.map((o) => {
    const value =
      o.format === "text" || o.format === "boolean"
        ? evaluate(o.expr, ctx, tables)
        : evalNumber(o.expr, ctx, tables);
    return {
      name: o.name,
      label: o.label,
      value,
      formatted: formatValue(value, o.format, loc),
      primary: o.primary,
      note: o.note,
    };
  });

  // 4. Eligibility: first matching rule wins.
  let status: CalculationResult["status"] = null;
  let confidence: CalculationResult["confidence"] = null;
  const reasons: string[] = [];
  if (def.eligibility && def.eligibility.length > 0) {
    const match = def.eligibility.find((rule) => evaluate(rule.when, ctx, tables) === true);
    if (match) {
      status = match.status;
      confidence = match.confidence;
      reasons.push(match.reason);
    }
    // If required info is missing, never assert a hard "not eligible".
    if (missing.length > 0 && status === "likely_not_eligible") {
      status = "may_qualify";
      confidence = "low";
    }
  }

  return {
    status,
    confidence,
    outputs,
    reasons,
    missing,
    meta: {
      version: def.version,
      lastVerified: def.lastVerified,
      effectiveYear: def.effectiveYear,
      sources: def.sources,
      disclaimer: def.disclaimer,
    },
  };
}
