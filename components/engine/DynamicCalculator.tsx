"use client";

import { useMemo, useState } from "react";
import type { CalculatorDefinition, InputField } from "@/lib/engine/types";
import { runCalculator, type FormatLocale } from "@/lib/engine/evaluate";
import { evaluate, type EvalContext, type EvalValue } from "@/lib/engine/expr";
import { localeForRegion } from "@/lib/regions";
import ResultPanel from "./ResultPanel";

type InputState = Record<string, number | string | boolean>;

function initialState(def: CalculatorDefinition): InputState {
  const s: InputState = {};
  for (const f of def.inputs) {
    if (f.default !== undefined) s[f.name] = f.default;
    else if (f.type === "boolean") s[f.name] = false;
    else if (f.type === "select") s[f.name] = f.options?.[0]?.value ?? "";
    else if (f.type === "date") s[f.name] = "";
    else s[f.name] = 0;
  }
  return s;
}

function showIfContext(state: InputState): EvalContext {
  const ctx: EvalContext = {};
  for (const [k, v] of Object.entries(state)) ctx[k] = v as EvalValue;
  return ctx;
}

export default function DynamicCalculator({ def }: { def: CalculatorDefinition }) {
  const [state, setState] = useState<InputState>(() => initialState(def));
  const loc: FormatLocale = localeForRegion(def.region);

  const visibleInputs = useMemo(() => {
    const ctx = showIfContext(state);
    return def.inputs.filter((f) => {
      if (!f.showIf) return true;
      try {
        return evaluate(f.showIf, ctx) === true;
      } catch {
        return true;
      }
    });
  }, [def, state]);

  const result = useMemo(() => runCalculator(def, state, loc), [def, state, loc]);

  const update = (name: string, value: number | string | boolean) =>
    setState((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="premium-card relative overflow-hidden rounded-xl bg-white p-stack-lg">
      <div className="summary-accent absolute left-0 right-0 top-0" />

      <div className="mb-stack-lg flex items-center justify-between">
        <h2 className="text-headline-md text-primary">Eligibility &amp; Estimate Tool</h2>
        {def.taxYear && (
          <span className="rounded-full bg-secondary-container px-stack-sm py-unit text-label-sm font-bold text-on-secondary-container">
            {def.taxYear} Rules
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-5">
        {visibleInputs.map((f) => (
          <Field key={f.name} field={f} value={state[f.name]} onChange={update} />
        ))}
      </div>

      {/* Results (live) */}
      <div className="mt-stack-lg border-t border-surface-border pt-stack-lg">
        <ResultPanel def={def} result={result} />
      </div>
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: InputField;
  value: number | string | boolean;
  onChange: (name: string, value: number | string | boolean) => void;
}) {
  const label = <label className="block text-label-md text-primary">{field.label}</label>;

  if (field.type === "select") {
    return (
      <div className="flex flex-col gap-unit">
        {label}
        <select
          value={String(value)}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="w-full rounded-lg border border-surface-border bg-white p-stack-md text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.help && <p className="text-label-sm text-on-surface-variant">{field.help}</p>}
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-surface-border p-stack-md">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-surface-border text-primary focus:ring-primary"
        />
        <span>
          <span className="text-label-md text-primary">{field.label}</span>
          {field.help && <span className="mt-0.5 block text-label-sm text-on-surface-variant">{field.help}</span>}
        </span>
      </label>
    );
  }

  const isCurrency = field.type === "currency";
  return (
    <div className="flex flex-col gap-unit">
      <div className="flex items-center justify-between gap-3">
        {label}
        <input
          type="number"
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step ?? (field.type === "integer" ? 1 : isCurrency ? 100 : 1)}
          onChange={(e) => onChange(field.name, Number(e.target.value) || 0)}
          className="w-36 rounded-lg border border-surface-border bg-white px-3 py-1.5 text-right text-label-md font-semibold text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      {typeof field.min === "number" && typeof field.max === "number" && (
        <input
          type="range"
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step ?? (field.type === "integer" ? 1 : isCurrency ? 1000 : 1)}
          onChange={(e) => onChange(field.name, Number(e.target.value))}
          className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high accent-primary"
        />
      )}
      {field.help && <p className="text-label-sm text-on-surface-variant">{field.help}</p>}
    </div>
  );
}
