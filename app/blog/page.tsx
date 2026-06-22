import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog - Guides to benefits, taxes, and savings",
  description:
    "In-depth guides to government benefits, tax credits, property tax, and take-home pay across the US, UK, and Canada - written to help you understand and claim what you're owed.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-stack-lg md:px-margin-desktop">
      <header className="mb-stack-lg max-w-3xl">
        <h1 className="mb-stack-sm text-display-lg text-primary">The OnlineCalc Blog</h1>
        <p className="text-body-lg text-on-surface-variant">
          Plain-language guides to benefits, tax credits, property tax, and take-home pay. We explain how
          the rules actually work - and how to make sure you claim what you&apos;re owed.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card-shadow card-hover flex flex-col rounded-xl border border-surface-border bg-surface-container-lowest p-stack-lg"
          >
            <span className="mb-stack-sm w-fit rounded-full bg-primary-fixed px-3 py-1 text-label-sm text-on-primary-fixed">
              {post.category}
            </span>
            <h2 className="mb-2 text-headline-md text-primary">{post.title}</h2>
            <p className="mb-stack-md flex-grow text-body-md text-on-surface-variant">{post.description}</p>
            <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
              <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              <span>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
