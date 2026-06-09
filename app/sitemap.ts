import { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { ENGINE_CALCULATORS } from "@/data/calculators/registry";
import { POSTS } from "@/data/blog";
import { SITE } from "@/lib/site";

// Engine calculators serve at /calc/<slug>, except the bespoke CTC page.
function engineHref(slug: string): string {
  return slug === "us-child-tax-credit"
    ? "/calculators/benefits/us-child-tax-credit"
    : `/calc/${slug}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/calculators`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/advertising-disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/report`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    // Legal / trust
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/editorial-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/corrections`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/ai-use`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = [
    "finance-calculators",
    "math-calculators",
    "health-calculators",
    "date-calculators",
    "everyday-calculators",
    "developer-calculators",
    "converters",
  ].map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Classic (utility) calculators
  const classicPages: MetadataRoute.Sitemap = calculators.map((calc) => ({
    url: `${baseUrl}/calculators/${calc.category}/${calc.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Engine-driven calculators (use lastVerified as lastmod)
  const enginePages: MetadataRoute.Sitemap = ENGINE_CALCULATORS.map((def) => ({
    url: `${baseUrl}${engineHref(def.slug)}`,
    lastModified: def.lastVerified ? new Date(def.lastVerified) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...classicPages, ...enginePages, ...blogPages];
}
