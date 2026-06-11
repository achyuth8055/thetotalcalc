import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DynamicCalculator from "@/components/engine/DynamicCalculator";
import CalculatorExplainer from "@/components/engine/CalculatorExplainer";
import { CalculatorLinks } from "@/components/links/InternalLinks";
import { JsonLd, breadcrumbSchema, faqSchema, softwareAppSchema } from "@/components/seo/JsonLd";
import { getCalculatorBySlug, ENGINE_CALCULATORS } from "@/data/calculators/registry";
import type { DirectoryCategory, DirectoryRegion } from "@/data/directory";

// Slugs that have their own dedicated static route under /app/calc/<slug>/page.tsx
const BESPOKE_SLUGS = new Set([
  "us-child-tax-credit",
  "compound-interest",
  "us-homestead-exemption",
]);

export function generateStaticParams() {
  // Bespoke pages have their own route; exclude them here to avoid duplicate static builds.
  return ENGINE_CALCULATORS.filter((c) => !BESPOKE_SLUGS.has(c.slug)).map((c) => ({
    slug: c.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const def = getCalculatorBySlug(params.slug);
  if (!def) return { title: "Calculator" };
  return {
    title: def.title,
    description: def.description,
    alternates: { canonical: `/calc/${def.slug}` },
  };
}

export default function GenericCalculatorPage({ params }: { params: { slug: string } }) {
  const def = getCalculatorBySlug(params.slug);
  if (!def) notFound();

  const path = `/calc/${def.slug}`;

  return (
    <>
      <JsonLd
        id="schema-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: def.title, path },
        ])}
      />
      <JsonLd
        id="schema-softwareapp"
        data={softwareAppSchema({ name: def.title, description: def.description, path })}
      />
      {def.faqs && def.faqs.length > 0 && <JsonLd id="schema-faq" data={faqSchema(def.faqs)} />}

      <header className="border-b border-surface-border bg-surface-container-low pb-stack-lg pt-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <nav className="mb-stack-md" aria-label="Breadcrumb">
            <ol className="flex items-center gap-stack-sm text-label-sm text-on-surface-variant">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li><Link href="/calculators" className="hover:text-primary">Calculators</Link></li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li className="font-bold text-primary">{def.title}</li>
            </ol>
          </nav>
          <h1 className="mb-unit text-headline-lg text-primary">{def.title}</h1>
          <p className="max-w-3xl text-body-md text-on-surface-variant">{def.description}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-margin-mobile py-stack-lg md:px-margin-desktop">
        <DynamicCalculator def={def} />

        {def.faqs && def.faqs.length > 0 && (
          <section className="mt-stack-lg flex flex-col gap-stack-md">
            <h2 className="text-headline-md text-primary">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-stack-sm">
              {def.faqs.map((faq) => (
                <details key={faq.question} className="premium-card group cursor-pointer rounded-lg p-stack-md">
                  <summary className="flex list-none items-center justify-between text-label-md text-primary">
                    <span>{faq.question}</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <p className="mt-stack-sm text-body-md text-on-surface-variant">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <CalculatorExplainer def={def} />

        <CalculatorLinks
          category={def.category as DirectoryCategory}
          region={def.region as DirectoryRegion}
          currentHref={path}
        />
      </main>
    </>
  );
}
