import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorCard from "@/components/CalculatorCard";
import { Category } from "@/data/calculators";

interface CategoryPageProps {
  category: Category;
  breadcrumbLabel: string;
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-700" },
  green: { bg: "bg-green-50", text: "text-green-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700" },
  orange: { bg: "bg-orange-50", text: "text-orange-700" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700" },
};

export default function CategoryPage({ category, breadcrumbLabel }: CategoryPageProps) {
  const colors = colorClasses[category.color] || colorClasses.blue;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={[{ label: breadcrumbLabel, href: `/${category.slug}` }]}
        />

        <div className="mb-12 mt-8">
          <div className="flex items-start space-x-6 mb-6">
            <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-10 h-10 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{category.name}</h1>
              <p className="text-lg text-gray-600 max-w-3xl">{category.description}</p>
              <div className={`mt-4 inline-block px-4 py-2 ${colors.bg} ${colors.text} rounded-full text-sm font-medium`}>
                {category.calculators.length} Calculators Available
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.calculators.map((calc) => (
            <CalculatorCard key={calc.id} calculator={calc} />
          ))}
        </div>
      </div>
    </div>
  );
}
