// Safe expression interpreter.
// Walks the Expr AST defined in types.ts. No `eval`, no Function constructor.
// Unknown variables throw so authoring mistakes surface in tests rather than
// silently producing wrong numbers.

import type { Expr } from "./types";

export type EvalValue = number | boolean | string;
export type EvalContext = Record<string, EvalValue>;
export type Tables = Record<string, Record<string, number>>;

function asNumber(v: EvalValue, where: string): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  const n = Number(v);
  if (Number.isNaN(n)) {
    throw new Error(`Expected a number in ${where} but got "${v}"`);
  }
  return n;
}

export function evaluate(
  expr: Expr,
  ctx: EvalContext,
  tables: Tables = {}
): EvalValue {
  // Literals
  if (typeof expr === "number" || typeof expr === "boolean" || typeof expr === "string") {
    return expr;
  }

  // Variable reference
  if ("var" in expr) {
    if (!(expr.var in ctx)) {
      throw new Error(`Unknown variable: ${expr.var}`);
    }
    return ctx[expr.var];
  }

  // Arithmetic
  if ("op" in expr) {
    const a = expr.args.map((e) => asNumber(evaluate(e, ctx, tables), `op "${expr.op}"`));
    switch (expr.op) {
      case "+":
        return a.reduce((x, y) => x + y, 0);
      case "-":
        return a.length === 1 ? -a[0] : a.reduce((x, y) => x - y);
      case "*":
        return a.reduce((x, y) => x * y, 1);
      case "/":
        return a.reduce((x, y) => x / y);
      case "min":
        return Math.min(...a);
      case "max":
        return Math.max(...a);
      case "clamp": {
        const [value, lo, hi] = a;
        return Math.min(Math.max(value, lo), hi);
      }
      case "floor":
        return Math.floor(a[0]);
      case "ceil":
        return Math.ceil(a[0]);
      case "round":
        return Math.round(a[0]);
      case "pow":
        return Math.pow(a[0], a[1]);
      case "ln":
        return Math.log(a[0]);
      case "exp":
        return Math.exp(a[0]);
      case "abs":
        return Math.abs(a[0]);
      case "sqrt":
        return Math.sqrt(a[0]);
      default: {
        const _exhaustive: never = expr.op;
        throw new Error(`Unsupported op: ${_exhaustive as string}`);
      }
    }
  }

  // Comparison
  if ("cmp" in expr) {
    const l = evaluate(expr.left, ctx, tables);
    const r = evaluate(expr.right, ctx, tables);
    switch (expr.cmp) {
      case "==":
        return l === r;
      case "!=":
        return l !== r;
      case "<":
        return asNumber(l, "cmp") < asNumber(r, "cmp");
      case "<=":
        return asNumber(l, "cmp") <= asNumber(r, "cmp");
      case ">":
        return asNumber(l, "cmp") > asNumber(r, "cmp");
      case ">=":
        return asNumber(l, "cmp") >= asNumber(r, "cmp");
      default: {
        const _exhaustive: never = expr.cmp;
        throw new Error(`Unsupported cmp: ${_exhaustive as string}`);
      }
    }
  }

  // Logical
  if ("all" in expr) {
    return expr.all.every((e) => truthy(evaluate(e, ctx, tables)));
  }
  if ("any" in expr) {
    return expr.any.some((e) => truthy(evaluate(e, ctx, tables)));
  }
  if ("not" in expr) {
    return !truthy(evaluate(expr.not, ctx, tables));
  }

  // Conditional
  if ("if" in expr) {
    return truthy(evaluate(expr.if, ctx, tables))
      ? evaluate(expr.then, ctx, tables)
      : evaluate(expr.else, ctx, tables);
  }

  // Table lookup
  if ("lookup" in expr) {
    const table = tables[expr.lookup];
    if (!table) throw new Error(`Unknown table: ${expr.lookup}`);
    const key = String(evaluate(expr.key, ctx, tables));
    if (!(key in table)) {
      throw new Error(`Key "${key}" not found in table "${expr.lookup}"`);
    }
    return table[key];
  }

  throw new Error(`Unrecognized expression: ${JSON.stringify(expr)}`);
}

export function truthy(v: EvalValue): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  return v !== "" && v !== "false";
}

export function evalNumber(expr: Expr, ctx: EvalContext, tables: Tables = {}): number {
  return asNumber(evaluate(expr, ctx, tables), "evalNumber");
}
