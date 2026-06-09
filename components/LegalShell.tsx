import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-margin-mobile py-stack-lg md:px-margin-desktop">
      <nav className="mb-stack-md text-label-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-primary">{title}</span>
      </nav>

      <div className="premium-card rounded-xl p-stack-lg md:p-10">
        <h1 className="mb-2 text-headline-lg text-primary">{title}</h1>
        {updated && <p className="mb-stack-md text-label-sm text-on-surface-variant">Last updated: {updated}</p>}
        {intro && <p className="mb-stack-md text-body-md leading-relaxed text-on-surface-variant">{intro}</p>}
        <div className="legal-body space-y-stack-md text-body-md leading-relaxed text-on-surface-variant">
          {children}
        </div>
      </div>
    </div>
  );
}
