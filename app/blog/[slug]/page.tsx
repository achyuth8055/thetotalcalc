import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/data/blog";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const dateLabel = new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        id="schema-article"
        data={articleSchema({ headline: post.title, description: post.description, path, datePublished: post.date })}
      />
      <JsonLd
        id="schema-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path },
        ])}
      />

      <article className="mx-auto max-w-3xl px-margin-mobile py-stack-lg md:px-margin-desktop">
        <nav className="mb-stack-md text-label-sm text-on-surface-variant" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
        </nav>

        <span className="mb-stack-sm inline-block w-fit rounded-full bg-primary-fixed px-3 py-1 text-label-sm text-on-primary-fixed">
          {post.category}
        </span>
        <h1 className="mb-stack-sm text-display-lg leading-tight text-primary">{post.title}</h1>
        <div className="mb-stack-lg flex items-center gap-3 text-label-sm text-on-surface-variant">
          <span>{dateLabel}</span>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        {/* Decorative header image (inline SVG, no external asset) */}
        <div className="mb-stack-lg overflow-hidden rounded-xl border border-surface-border">
          <svg viewBox="0 0 800 240" className="h-40 w-full" role="img" aria-label="Article illustration">
            <rect width="800" height="240" fill="#f1f4f6" />
            <circle cx="660" cy="40" r="120" fill="#d6e3ff" opacity="0.6" />
            <circle cx="120" cy="220" r="90" fill="#9ff5c1" opacity="0.5" />
            <g stroke="#002045" strokeWidth="2" fill="none" opacity="0.35">
              <path d="M60 170 L160 120 L260 150 L360 90 L460 120 L560 70 L700 110" />
            </g>
            <g fill="#002045" opacity="0.85">
              <rect x="60" y="60" width="40" height="40" rx="8" />
              <text x="80" y="88" fontFamily="Public Sans, sans-serif" fontSize="26" fill="#ffffff" textAnchor="middle">%</text>
            </g>
          </svg>
        </div>

        <div className="flex flex-col gap-stack-lg">
          {post.body.map((section, i) => (
            <section key={i} className="flex flex-col gap-stack-sm">
              {section.heading && <h2 className="text-headline-md text-primary">{section.heading}</h2>}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-body-md leading-relaxed text-on-surface-variant">{p}</p>
              ))}
              {section.list && (
                <ul className="list-disc space-y-2 pl-6 text-body-md text-on-surface-variant">
                  {section.list.map((item, k) => <li key={k}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        {post.related && (
          <div className="mt-stack-lg rounded-xl border border-surface-border bg-surface-container-low p-stack-md">
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Try the calculator</p>
            <Link href={post.related.href} className="text-headline-md text-primary hover:underline">
              {post.related.name} →
            </Link>
          </div>
        )}

        <div className="mt-stack-lg rounded-xl border border-surface-border bg-surface-container-low p-stack-md text-label-sm text-on-surface-variant">
          This article is general information, not tax, legal, or financial advice. Figures reflect the
          stated tax/benefit year; confirm details with the relevant official agency or a qualified
          professional before acting.
        </div>

        {more.length > 0 && (
          <section className="mt-stack-lg">
            <h2 className="mb-stack-md text-headline-md text-primary">More from the blog</h2>
            <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-3">
              {more.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card-shadow card-hover rounded-xl border border-surface-border bg-surface-container-lowest p-stack-md">
                  <p className="text-label-md font-semibold text-primary">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-label-sm text-on-surface-variant">{p.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
