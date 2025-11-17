import Link from "next/link";
import { Calculator } from "@/data/calculators";

interface CalculatorCardProps {
  calculator: Calculator;
}

const colorMap: Record<string, { iconBg: string; accent: string; glow: string }> = {
  blue: {
    iconBg: "from-blue-500/20 via-blue-500/10 to-blue-400/5",
    accent: "text-blue-600",
    glow: "from-blue-100/40 via-transparent to-transparent",
  },
  purple: {
    iconBg: "from-purple-500/20 via-purple-500/10 to-purple-400/5",
    accent: "text-purple-600",
    glow: "from-purple-100/40 via-transparent to-transparent",
  },
  green: {
    iconBg: "from-emerald-500/20 via-emerald-500/10 to-emerald-400/5",
    accent: "text-emerald-600",
    glow: "from-emerald-100/40 via-transparent to-transparent",
  },
  indigo: {
    iconBg: "from-indigo-500/20 via-indigo-500/10 to-indigo-400/5",
    accent: "text-indigo-600",
    glow: "from-indigo-100/40 via-transparent to-transparent",
  },
  orange: {
    iconBg: "from-orange-500/20 via-orange-500/10 to-orange-400/5",
    accent: "text-orange-600",
    glow: "from-orange-100/40 via-transparent to-transparent",
  },
  cyan: {
    iconBg: "from-cyan-500/20 via-cyan-500/10 to-cyan-400/5",
    accent: "text-cyan-600",
    glow: "from-cyan-100/40 via-transparent to-transparent",
  },
};

export default function CalculatorCard({ calculator }: CalculatorCardProps) {
  const colors = colorMap[calculator.color] || colorMap.blue;

  return (
    <Link
      href={`/calculators/${calculator.category}/${calculator.slug}`}
      className="group relative block rounded-3xl border border-slate-100/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/80"
    >
      <div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative flex flex-col h-full">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105`}>
          <svg className={`w-7 h-7 ${colors.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {calculator.name}
        </h3>
        <p className="text-sm text-slate-500 flex-1 leading-relaxed">
          {calculator.description}
        </p>
        <div className={`mt-4 inline-flex items-center text-sm font-semibold ${colors.accent} group-hover:gap-2 transition-all`}>
          <span>Calculate now</span>
          <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
