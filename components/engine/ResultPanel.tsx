"use client";

import type {
  CalculatorDefinition,
  CalculationResult,
  EligibilityStatus,
  Confidence,
} from "@/lib/engine/types";
import SourceCitations from "./SourceCitations";

const STATUS_META: Record<
  EligibilityStatus,
  { label: string; badge: string }
> = {
  likely_qualifies: { label: "Likely qualifies", badge: "status-badge-positive" },
  may_qualify: { label: "May qualify", badge: "status-badge-warning" },
  likely_not_eligible: { label: "Likely not eligible", badge: "status-badge-neutral" },
  need_local_review: { label: "Needs local review", badge: "status-badge-warning" },
};

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export default function ResultPanel({
  def,
  result,
}: {
  def: CalculatorDefinition;
  result: CalculationResult;
}) {
  const primary = result.outputs.find((o) => o.primary) ?? result.outputs[0];
  const secondary = result.outputs.filter((o) => o !== primary);
  const status = result.status ? STATUS_META[result.status] : null;

  return (
    <div className="space-y-5">
      {/* Eligibility status */}
      {status && (
        <div className={`rounded-xl px-4 py-3 ${status.badge}`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-[20px]">
              {result.status === "likely_qualifies" ? "verified" : result.status === "likely_not_eligible" ? "info" : "help"}
            </span>
            <span className="text-base font-bold">{status.label}</span>
            {result.confidence && (
              <span className="ml-auto text-label-sm font-medium opacity-80">
                {CONFIDENCE_LABEL[result.confidence]}
              </span>
            )}
          </div>
          {result.reasons.length > 0 && (
            <p className="mt-2 text-label-sm leading-relaxed opacity-90">{result.reasons.join(" ")}</p>
          )}
        </div>
      )}

      {/* Primary figure */}
      {primary && (
        <div className="rounded-xl bg-primary p-stack-md text-on-primary">
          <div className="text-label-sm opacity-90">{primary.label}</div>
          <div className="text-display-lg leading-tight">{primary.formatted}</div>
          {primary.note && <p className="mt-1 text-label-sm opacity-80">{primary.note}</p>}
        </div>
      )}

      {/* Secondary figures */}
      {secondary.length > 0 && (
        <div className="space-y-2.5 rounded-xl border border-surface-border bg-surface-container-lowest p-stack-md">
          {secondary.map((o) => (
            <div key={o.name} className="flex items-baseline justify-between gap-3 text-body-md">
              <span className="text-on-surface-variant">{o.label}</span>
              <span className="font-semibold text-primary">{o.formatted}</span>
            </div>
          ))}
        </div>
      )}

      {/* Missing info */}
      {result.missing.length > 0 && (
        <div className="status-badge-warning rounded-xl p-stack-md text-label-md">
          Add the following for a firmer answer:{" "}
          <span className="font-semibold">
            {result.missing.map((m) => def.inputs.find((i) => i.name === m)?.label ?? m).join(", ")}
          </span>
          .
        </div>
      )}

      {/* Document checklist */}
      {def.documents && def.documents.length > 0 && (
        <details className="group rounded-xl border border-surface-border p-stack-md">
          <summary className="flex cursor-pointer list-none items-center justify-between text-label-md text-primary">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">checklist</span>
              Documents you may need
            </span>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
          </summary>
          <ul className="mt-3 list-inside list-disc space-y-1 text-body-md text-on-surface-variant">
            {def.documents.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
      )}

      <SourceCitations meta={result.meta} />
    </div>
  );
}
