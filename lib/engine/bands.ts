// Helper for building progressive (marginal-band) tax expressions as a safe
// Expr AST. Each band is [rate, lowerBound, upperBound]; the amount taxed in a
// band is rate * max(0, min(income, upper) - lower). Use a large number (not
// Infinity, which is not JSON-serializable) for the top band's upper bound.
import type { Expr } from "./types";

export const NO_CAP = 1e12;

export type Band = [rate: number, lower: number, upper: number];

export function progressive(varName: string, bands: Band[]): Expr {
  return {
    op: "+",
    args: bands.map(([rate, lower, upper]) => ({
      op: "*" as const,
      args: [
        rate,
        {
          op: "max" as const,
          args: [
            0,
            {
              op: "-" as const,
              args: [{ op: "min" as const, args: [{ var: varName }, upper] }, lower],
            },
          ],
        },
      ],
    })),
  };
}
