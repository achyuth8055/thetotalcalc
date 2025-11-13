"use client";

import SearchBar from "@/components/SearchBar";
import CalculatorCard from "@/components/CalculatorCard";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import { categories, popularCalculators, calculators } from "@/data/calculators";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [recentCalculators, setRecentCalculators] = useState<typeof calculators>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load recently used calculators from localStorage
    const recent = localStorage.getItem("recentCalculators");
    if (recent) {
      const recentIds = JSON.parse(recent);
      const recentCalcs = recentIds
        .map((id: string) => calculators.find((c) => c.id === id))
        .filter(Boolean)
        .slice(0, 4);
      setRecentCalculators(recentCalcs);
    }

    // Mouse move handler for 3D effect
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section with 3D Effects */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-blue-500">
          {/* Floating Geometric Shapes */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute top-20 left-[10%] w-64 h-64 bg-white/15 rounded-3xl rotate-12 animate-float-slow"
              style={{
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) rotate(12deg)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
            <div 
              className="absolute top-40 right-[15%] w-48 h-48 bg-blue-100/25 rounded-full animate-float-medium"
              style={{
                transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
            <div 
              className="absolute bottom-32 left-[20%] w-56 h-56 bg-blue-300/20 rounded-2xl -rotate-6 animate-float-fast"
              style={{
                transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px) rotate(-6deg)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
            <div 
              className="absolute bottom-20 right-[25%] w-40 h-40 bg-white/20 rounded-full animate-pulse-slow"
              style={{
                transform: `translate(${-mousePosition.x * 0.6}px, ${-mousePosition.y * 0.6}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}/>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          {/* 3D Floating Calculator Display */}
          <div className="mb-8 flex justify-center perspective-1000">
            <div 
              className="transform-gpu transition-transform duration-300 hover:scale-110"
              style={{
                transform: `rotateX(${mousePosition.y * 0.5}deg) rotateY(${-mousePosition.x * 0.5}deg)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-40 animate-pulse-slow"/>
                <CalculatorDisplay color="primary" size="large" />
              </div>
            </div>
          </div>

          {/* Animated Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white relative">
            <span className="inline-block animate-fade-in-up">OnlineCalc</span>
            <div className="absolute -inset-1 bg-blue-400 blur-2xl opacity-30 animate-pulse-slow -z-10"/>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-blue-100 max-w-4xl mx-auto font-light animate-fade-in-up animation-delay-200">
            Your Complete Calculator Suite
          </p>
          
          <p className="text-lg md:text-xl mb-12 text-blue-200 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Professional tools for Finance • Health • Math • Dates • Developers
          </p>

          {/* Search Bar with 3D Effect */}
          <div className="animate-fade-in-up animation-delay-600 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"/>
              <div className="relative">
                <SearchBar />
              </div>
            </div>
          </div>
          
          {/* Stats Cards with 3D Effect */}
          <div className="mt-16 flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-800">
            <div className="group px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="text-3xl font-bold text-white mb-1">{calculators.length}+</div>
              <div className="text-sm text-blue-200">Calculators</div>
            </div>
            <div className="group px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="text-3xl font-bold text-white mb-1">{categories.length}</div>
              <div className="text-sm text-blue-200">Categories</div>
            </div>
            <div className="group px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-blue-200">Free Forever</div>
            </div>
            <div className="group px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="text-3xl font-bold text-white mb-1">10+</div>
              <div className="text-sm text-blue-200">Currencies</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Popular Calculators */}
        <section className="mb-24">
          <div className="text-center mb-14">
            <div className="inline-block mb-4">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-blue-100 rounded-full">Most Popular</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Start Here</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">Jump into our most frequently used calculators</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCalculators.map((calc, index) => (
              <div 
                key={calc.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CalculatorCard calculator={calc} />
              </div>
            ))}
          </div>
        </section>

        {/* Category Grid with 3D Cards */}
        <section className="mb-24">
          <div className="text-center mb-14">
            <div className="inline-block mb-4">
              <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-purple-100 rounded-full">All Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">Find the perfect calculator for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
                blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
                purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
                green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
                indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
                orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
                cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
              };
              const colors = colorClasses[category.color] || colorClasses.blue;

              return (
                <div
                  key={category.id}
                  className={`group relative bg-white rounded-3xl border-2 ${colors.border} p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up perspective-1000`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* 3D Glow Effect */}
                  <div className={`absolute -inset-0.5 ${colors.bg} rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl`}/>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <svg className={`w-10 h-10 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-all duration-300">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                    
                    <ul className="space-y-3 mb-6">
                      {category.calculators.slice(0, 3).map((calc) => (
                        <li key={calc.id}>
                          <Link
                            href={`/calculators/${calc.category}/${calc.slug}`}
                            className="text-gray-700 hover:text-blue-600 text-sm font-medium flex items-center group/item transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover/item:text-blue-600 group-hover/item:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {calc.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      href={`/${category.slug}`}
                      className={`inline-flex items-center ${colors.text} hover:gap-3 font-semibold group/link transition-all duration-300`}
                    >
                      View all {category.calculators.length} calculators
                      <svg className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recently Used */}
        {recentCalculators.length > 0 && (
          <section className="mb-24">
            <div className="text-center mb-14">
              <div className="inline-block mb-4">
                <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-emerald-50 rounded-full">Recently Used</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Pick Up Where You Left Off</h2>
              <p className="text-gray-600 text-xl max-w-2xl mx-auto">Continue with your recent calculations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentCalculators.map((calc, index) => (
                <div 
                  key={calc.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CalculatorCard calculator={calc} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Access */}
        <section className="bg-slate-50 rounded-3xl p-12 border border-slate-200 shadow-sm mb-24">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Access to All Calculators</h2>
            <p className="text-gray-600 text-lg">Browse our complete collection</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {calculators.map((calc) => (
              <Link
                key={calc.id}
                href={`/calculators/${calc.category}/${calc.slug}`}
                className="text-gray-700 hover:text-blue-600 hover:bg-white px-4 py-3 rounded-xl transition-all font-medium text-sm hover:shadow-md"
              >
                {calc.name}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-24">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg">Get answers to common questions about our calculators</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">What types of calculators does OnlineCalc offer?</h3>
              <p className="text-gray-700">OnlineCalc provides comprehensive calculators across multiple categories including Finance (EMI, SIP, loan calculators), Health (BMI, BMR, calorie calculators), Math (percentage, GPA, scientific calculator), Date & Time (age, countdown calculators), Everyday (tip, discount, unit converter), and Developer Tools (binary, hex, base64 converters).</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Are OnlineCalc calculators free to use?</h3>
              <p className="text-gray-700">Yes! All calculators on OnlineCalc are completely free to use with no registration required. We believe in providing accessible calculation tools for everyone without any hidden costs or subscriptions.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How accurate are the EMI and loan calculators?</h3>
              <p className="text-gray-700">Our EMI and loan calculators use industry-standard formulas to provide highly accurate results. They calculate monthly installments based on principal amount, interest rate, and loan tenure using compound interest formulas. Results match bank calculations for home loans, car loans, and personal loans.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Can I use OnlineCalc calculators on mobile devices?</h3>
              <p className="text-gray-700">Absolutely! All our calculators are fully responsive and optimized for mobile phones, tablets, and desktop computers. The interface adapts seamlessly to your screen size, providing an excellent user experience on any device.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">What makes OnlineCalc different from other calculator websites?</h3>
              <p className="text-gray-700">OnlineCalc stands out with its clean, modern interface, comprehensive calculator collection, automatic currency detection for finance tools, interactive visualizations, and educational explanations for each calculation. We also offer unique features like the Math Quiz for Kids and real-time visual feedback on all calculators.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Do I need to create an account to use OnlineCalc?</h3>
              <p className="text-gray-700">No account is needed! All calculators are instantly accessible without any sign-up process. Your recently used calculators are saved locally in your browser for quick access, but no personal data is collected or stored on our servers.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How does the currency detection work in finance calculators?</h3>
              <p className="text-gray-700">Our finance calculators automatically detect your location using your IP address and display amounts in your local currency (INR, USD, EUR, GBP, AUD, CAD, SGD, AED, SAR, or JPY). You can also manually switch between supported currencies at any time.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Is the BMI calculator accurate for all age groups?</h3>
              <p className="text-gray-700">Our BMI calculator provides accurate results for adults (18+ years). However, BMI interpretations may vary for children, teenagers, athletes, and elderly individuals. We recommend consulting healthcare professionals for personalized health assessments.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Can I bookmark specific calculators?</h3>
              <p className="text-gray-700">Yes! Each calculator has its own unique URL that you can bookmark in your browser. Additionally, OnlineCalc automatically tracks your recently used calculators for quick access from the homepage.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Are the math quiz questions suitable for kids?</h3>
              <p className="text-gray-700">Yes! Our Math Quiz for Kids offers three difficulty levels (Easy, Medium, Hard) covering topics like addition, subtraction, multiplication, division, fractions, and decimals. Each question includes explanations to help children learn from their answers.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
