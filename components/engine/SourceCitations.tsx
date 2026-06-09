"use client";

import type { CalculationResult } from "@/lib/engine/types";

export default function SourceCitations({ meta }: { meta: CalculationResult["meta"] }) {
  return (
    <div className="space-y-4 rounded-xl border border-surface-border bg-surface-container-low p-stack-md text-label-md">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label-sm text-on-surface-variant">
        <span className="inline-flex items-center gap-1 font-semibold text-secondary">
          <span className="material-symbols-outlined fill text-[16px]">verified</span>
          Last verified {meta.lastVerified}
        </span>
        <span>Tax/benefit year {meta.effectiveYear}</span>
        <span>Rules v{meta.version}</span>
      </div>

      <div>
        <p className="mb-1 font-semibold text-primary">Official sources</p>
        <ul className="space-y-1">
          {meta.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline decoration-secondary/40 underline-offset-2 hover:text-on-secondary-container"
              >
                {s.title}
              </a>
              <span className="text-on-surface-variant"> - {s.publisher}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-label-sm leading-relaxed text-on-surface-variant">
        <strong className="text-on-surface">Disclaimer:</strong> {meta.disclaimer}
      </p>
    </div>
  );
}
