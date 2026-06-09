import { SITE } from "@/lib/site";

// Reusable JSON-LD (schema.org) builders + a server-safe injector component.
// Usage: <JsonLd data={breadcrumbSchema([...])} /> inside any server component.

type Json = Record<string, unknown>;

export function JsonLd({ data, id }: { data: Json | Json[]; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Schema payloads are built from trusted, static data (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/calculator.png`,
    email: SITE.contactEmail,
    foundingLocation: SITE.location,
    sameAs: [] as string[],
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    publisher: { "@type": "Organization", name: SITE.name },
  };
}

export interface Crumb {
  name: string;
  path: string; // absolute path beginning with "/"
}

export function breadcrumbSchema(items: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function softwareAppSchema(args: {
  name: string;
  description: string;
  path: string; // absolute path beginning with "/"
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: args.name,
    description: args.description,
    url: `${SITE.url}${args.path}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE.name },
  };
}

export function articleSchema(args: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    url: `${SITE.url}${args.path}`,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/calculator.png` },
    },
  };
}
