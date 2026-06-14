import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Build BreadcrumbList structured data, including the implicit Home crumb,
  // so search engines can show breadcrumb rich results.
  const crumbs = [
    { name: "Home", path: "/" },
    ...items.map((i) => ({ name: i.label, path: i.href })),
  ];

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <JsonLd id="schema-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-gray-400">/</span>
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-gray-500 hover:text-gray-700">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
