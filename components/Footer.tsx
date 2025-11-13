import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TheTotalCalc</h3>
            <p className="text-sm">
              Your universal calculator hub for finance, math, health, and everyday calculations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/finance-calculators" className="hover:text-white">Finance</Link></li>
              <li><Link href="/math-calculators" className="hover:text-white">Math</Link></li>
              <li><Link href="/health-calculators" className="hover:text-white">Health</Link></li>
              <li><Link href="/date-calculators" className="hover:text-white">Date & Time</Link></li>
              <li><Link href="/everyday-calculators" className="hover:text-white">Everyday</Link></li>
            </ul>
          </div>

          {/* Popular Calculators */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators/finance/emi-calculator" className="hover:text-white">EMI Calculator</Link></li>
              <li><Link href="/calculators/health/bmi-calculator" className="hover:text-white">BMI Calculator</Link></li>
              <li><Link href="/calculators/date/age-calculator" className="hover:text-white">Age Calculator</Link></li>
              <li><Link href="/calculators/math/percentage-calculator" className="hover:text-white">Percentage Calculator</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/developer-calculators" className="hover:text-white">Developer Tools</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} TheTotalCalc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
