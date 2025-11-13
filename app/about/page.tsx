import Breadcrumbs from "@/components/Breadcrumbs";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "About", href: "/about" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About TheTotalCalc</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Welcome to TheTotalCalc</h2>
            <p className="leading-relaxed">
              TheTotalCalc is your comprehensive online calculator hub, providing a wide range of free calculators 
              to help you solve everyday mathematical problems quickly and accurately. Whether you're calculating 
              your BMI, planning your finances, or working on academic projects, we've got you covered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Mission</h2>
            <p className="leading-relaxed">
              Our mission is to make complex calculations simple and accessible to everyone. We believe that 
              everyone should have access to powerful calculation tools without the need for expensive software 
              or complicated interfaces. All our calculators are free, user-friendly, and designed with a 
              clean, modern interface.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💰 Finance Calculators</h3>
                <p className="text-sm text-gray-700">
                  EMI, SIP, Home Loan, Car Loan, FD calculators with multi-currency support
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">🏥 Health Calculators</h3>
                <p className="text-sm text-gray-700">
                  BMI, BMR, Calorie, and Ideal Weight calculators with visual feedback
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">🔢 Math Calculators</h3>
                <p className="text-sm text-gray-700">
                  Percentage, Ratio, Grade, GPA, and Average calculators
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">📅 Everyday Calculators</h3>
                <p className="text-sm text-gray-700">
                  Age, Date, Discount, and Tip calculators for daily use
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>✅ <strong>100% Free:</strong> All calculators are completely free to use, no sign-up required</li>
              <li>✅ <strong>Privacy First:</strong> We don't store your personal data or calculation history on our servers</li>
              <li>✅ <strong>Mobile Friendly:</strong> Responsive design works seamlessly on all devices</li>
              <li>✅ <strong>Interactive UI:</strong> Modern sliders and real-time calculations</li>
              <li>✅ <strong>Multi-Currency:</strong> Automatic currency detection for finance calculators</li>
              <li>✅ <strong>Educational:</strong> Each calculator includes explanations and helpful tips</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Commitment</h2>
            <p className="leading-relaxed">
              We are committed to maintaining accurate, reliable, and user-friendly calculators. Our team 
              continuously updates and improves our tools based on user feedback. While we strive for accuracy, 
              we recommend consulting with professionals for critical financial, health, or legal decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p className="leading-relaxed">
              Have suggestions or found a bug? We'd love to hear from you! Your feedback helps us improve 
              TheTotalCalc for everyone. While we're constantly working on new features, your input guides our 
              development priorities.
            </p>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
            <p className="text-center text-gray-700">
              Thank you for choosing <span className="font-bold text-gray-900">TheTotalCalc</span> as your 
              calculation companion. We hope our tools make your life easier!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
