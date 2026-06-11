import Link from "next/link";
import { JsonLd, breadcrumbSchema, faqSchema, softwareAppSchema } from "@/components/seo/JsonLd";
import { CalculatorLinks } from "@/components/links/InternalLinks";
import type { DirectoryCategory, DirectoryRegion } from "@/data/directory";

// Server shell for new classic (non-engine) calculators. Gives each page
// server-rendered metadata-adjacent content: H1, breadcrumbs, JSON-LD
// (Breadcrumb + FAQ + SoftwareApplication), people-first content sections,
// FAQs, and internal links. The interactive widget is passed as children.

export interface ContentSection {
  title: string;
  body: React.ReactNode;
}

export default function ClassicCalculatorShell({
  title,
  description,
  path,
  category,
  region = "Global",
  parentLabel,
  parentHref,
  children,
  sections,
  faqs,
}: {
  title: string;
  description: string;
  path: string;
  category: DirectoryCategory;
  region?: DirectoryRegion;
  parentLabel: string;
  parentHref: string;
  children: React.ReactNode;
  sections: ContentSection[];
  faqs?: { question: string; answer: string }[];
}) {
  return (
    <>
      <JsonLd
        id="schema-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: parentLabel, path: parentHref },
          { name: title, path },
        ])}
      />
      <JsonLd id="schema-softwareapp" data={softwareAppSchema({ name: title, description, path })} />
      {faqs && faqs.length > 0 && <JsonLd id="schema-faq" data={faqSchema(faqs)} />}

      <header className="border-b border-surface-border bg-surface-container-low pb-stack-lg pt-stack-lg">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <nav className="mb-stack-md" aria-label="Breadcrumb">
            <ol className="flex items-center gap-stack-sm text-label-sm text-on-surface-variant">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li><Link href={parentHref} className="hover:text-primary">{parentLabel}</Link></li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li className="font-bold text-primary">{title}</li>
            </ol>
          </nav>
          <h1 className="mb-unit text-headline-lg text-primary">{title}</h1>
          <p className="max-w-3xl text-body-md text-on-surface-variant">{description}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-margin-mobile py-stack-lg md:px-margin-desktop">
        {children}

        <div className="mt-stack-lg flex flex-col gap-stack-lg">
          {sections.map((s) => (
            <section key={s.title} className="flex flex-col gap-stack-sm">
              <h2 className="text-headline-md text-primary">{s.title}</h2>
              <div className="text-body-md leading-relaxed text-on-surface-variant">{s.body}</div>
            </section>
          ))}
        </div>

        {faqs && faqs.length > 0 && (
          <section className="mt-stack-lg flex flex-col gap-stack-md">
            <h2 className="text-headline-md text-primary">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-stack-sm">
              {faqs.map((faq) => (
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

        <CalculatorLinks category={category} region={region} currentHref={path} />
      </main>
    </>
  );
}
