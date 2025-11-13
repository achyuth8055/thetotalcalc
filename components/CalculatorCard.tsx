import Link from "next/link";
import { Calculator } from "@/data/calculators";

interface CalculatorCardProps {
  calculator: Calculator;
}

const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    hover: "hover:border-blue-400 hover:shadow-blue-100",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    hover: "hover:border-purple-400 hover:shadow-purple-100",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    hover: "hover:border-green-400 hover:shadow-green-100",
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    hover: "hover:border-indigo-400 hover:shadow-indigo-100",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    hover: "hover:border-orange-400 hover:shadow-orange-100",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    hover: "hover:border-cyan-400 hover:shadow-cyan-100",
  },
};

export default function CalculatorCard({ calculator }: CalculatorCardProps) {
  const colors = colorMap[calculator.color] || colorMap.blue;

  return (
    <Link
      href={`/calculators/${calculator.category}/${calculator.slug}`}
      className={`group block bg-white rounded-xl border-2 ${colors.border} ${colors.hover} transition-all duration-200 p-6 hover:shadow-lg`}
    >
      <div className="flex flex-col h-full">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {calculator.name}
        </h3>
        <p className="text-sm text-gray-600 flex-1">
          {calculator.description}
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
          <span>Calculate now</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
