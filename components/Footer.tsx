import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-[32px] p-8 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
            <div>
              <p className="text-sm text-white/60 mb-2 tracking-[0.3em] uppercase">Need a calculator?</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Ship-ready tools for every decision</h2>
            </div>
            <Link
              href="/calculators/finance/emi-calculator"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-300 via-primary-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-900/40 hover:scale-105 transition-transform"
            >
              Launch EMI Tool
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white/80">
            {/* About */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">OnlineCalc</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Precision-first finance, health, and productivity calculators wrapped in a modern interface.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wide">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/finance-calculators" className="hover:text-white transition-colors">Finance</Link></li>
                <li><Link href="/math-calculators" className="hover:text-white transition-colors">Math</Link></li>
                <li><Link href="/health-calculators" className="hover:text-white transition-colors">Health</Link></li>
                <li><Link href="/date-calculators" className="hover:text-white transition-colors">Date & Time</Link></li>
                <li><Link href="/everyday-calculators" className="hover:text-white transition-colors">Everyday</Link></li>
              </ul>
            </div>

            {/* Popular Calculators */}
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wide">Popular Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/calculators/finance/emi-calculator" className="hover:text-white transition-colors">EMI Calculator</Link></li>
                <li><Link href="/calculators/health/bmi-calculator" className="hover:text-white transition-colors">BMI Calculator</Link></li>
                <li><Link href="/calculators/date/age-calculator" className="hover:text-white transition-colors">Age Calculator</Link></li>
                <li><Link href="/calculators/math/percentage-calculator" className="hover:text-white transition-colors">Percentage Calculator</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wide">Information</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/developer-calculators" className="hover:text-white transition-colors">Developer Tools</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-sm text-center text-white/60">
            <p>&copy; {currentYear} OnlineCalc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
