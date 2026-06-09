import type { CalculatorDefinition } from "@/lib/engine/types";
import CalculatorIllustration from "./CalculatorIllustration";

// Server-rendered, people-first content for engine calculators. Renders only the
// sections present on the definition, so every calculator gets richer static
// content for users and search engines without per-page boilerplate.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-stack-sm">
      <h2 className="text-headline-md text-primary">{title}</h2>
      <div className="text-body-md leading-relaxed text-on-surface-variant">{children}</div>
    </section>
  );
}

export default function CalculatorExplainer({ def }: { def: CalculatorDefinition }) {
  const verified = def.lastVerified
    ? new Date(def.lastVerified).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="mt-stack-lg flex flex-col gap-stack-lg">
      <CalculatorIllustration category={def.category} />

      <Section title="What this calculator does">
        <p>{def.description}</p>
      </Section>

      {def.whoFor && (
        <Section title="Who it is for">
          <p>{def.whoFor}</p>
        </Section>
      )}

      {def.howItWorks && (
        <Section title="How it works">
          <p>{def.howItWorks}</p>
        </Section>
      )}

      {def.workedExample && (
        <Section title="Example calculation">
          <p>{def.workedExample}</p>
        </Section>
      )}

      {def.regionalVariations && (
        <Section title="Regional variations">
          <p>{def.regionalVariations}</p>
        </Section>
      )}

      {def.commonMistakes && def.commonMistakes.length > 0 && (
        <Section title="Common mistakes to avoid">
          <ul className="list-disc space-y-2 pl-6">
            {def.commonMistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Section>
      )}

      {def.documents && def.documents.length > 0 && (
        <Section title="What you will need">
          <ul className="list-disc space-y-2 pl-6">
            {def.documents.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Section>
      )}

      {def.deadlines && (
        <Section title="Deadlines">
          <p>{def.deadlines}</p>
        </Section>
      )}

      {def.sources && def.sources.length > 0 && (
        <Section title="Sources">
          <ul className="list-disc space-y-2 pl-6">
            {def.sources.map((s) => (
              <li key={s.url}>
                <a className="text-secondary underline" href={s.url} rel="nofollow noopener" target="_blank">
                  {s.title}
                </a>{" "}
                - {s.publisher}
                {s.retrieved ? ` (retrieved ${s.retrieved})` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="rounded-xl border border-surface-border bg-surface-container-low p-stack-md text-label-sm text-on-surface-variant">
        {verified && (
          <p className="mb-2">
            <strong className="text-primary">Last verified:</strong> {verified}
            {def.effectiveYear ? ` · Effective year ${def.effectiveYear}` : ""}
            {def.version ? ` · Rules v${def.version}` : ""}
          </p>
        )}
        <p>
          <strong className="text-primary">Disclaimer:</strong> {def.disclaimer}
        </p>
      </div>
    </div>
  );
}
