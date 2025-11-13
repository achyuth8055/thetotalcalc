import Breadcrumbs from "@/components/Breadcrumbs";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Terms of Service", href: "/terms" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: November 13, 2025</p>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using OnlineCalc, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="leading-relaxed mb-3">
              OnlineCalc provides free online calculators for various purposes including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Financial calculations (EMI, SIP, Loans, Fixed Deposits)</li>
              <li>Health metrics (BMI, BMR, Calorie, Ideal Weight)</li>
              <li>Mathematical operations (Percentage, Ratio, Grade, GPA, Average)</li>
              <li>Everyday utilities (Age, Date, Discount, Tip calculators)</li>
            </ul>
            <p className="leading-relaxed mt-3">
              All calculations are performed in your browser and are provided "as is" for general informational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
            <p className="leading-relaxed mb-3">When using OnlineCalc, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the calculators for lawful purposes only</li>
              <li>Not attempt to disrupt or interfere with the website's operation</li>
              <li>Not use automated tools to access the website excessively</li>
              <li>Not misrepresent calculator results as professional advice</li>
              <li>Verify critical calculations with appropriate professionals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Accuracy and Limitations</h2>
            <p className="leading-relaxed mb-3">
              <strong>Important Disclaimer:</strong> While we strive for accuracy in all our calculators, 
              OnlineCalc does not guarantee the accuracy, completeness, or reliability of any calculation results.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Calculations are based on standard formulas and may not account for all variables</li>
              <li>Results should be used as estimates and guidelines only</li>
              <li>For critical decisions (financial, medical, legal), consult qualified professionals</li>
              <li>We are not responsible for decisions made based on calculator results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. No Professional Advice</h2>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
              <p className="font-semibold text-yellow-900 mb-2">⚠️ Important Notice</p>
              <p className="text-sm text-gray-700">
                OnlineCalc calculators do <strong>not</strong> constitute professional advice. Our tools are for 
                informational and educational purposes only.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Financial:</strong> Not a substitute for advice from certified financial advisors or planners</li>
              <li><strong>Health:</strong> Not a substitute for medical advice from healthcare professionals</li>
              <li><strong>Legal:</strong> Not a substitute for advice from qualified legal counsel</li>
              <li><strong>Tax:</strong> Not a substitute for advice from tax professionals or accountants</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, design, code, and functionality of OnlineCalc are owned by us and protected by 
              copyright and other intellectual property laws. You may not copy, reproduce, distribute, or 
              create derivative works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
            <p className="leading-relaxed mb-3">
              OnlineCalc may integrate third-party services (such as currency detection APIs). We are not 
              responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Availability or functionality of third-party services</li>
              <li>Accuracy of data provided by third-party services</li>
              <li>Privacy practices of third-party services (refer to their policies)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p className="leading-relaxed mb-3">
              To the fullest extent permitted by law, OnlineCalc and its operators shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any direct, indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or opportunities</li>
              <li>Damages resulting from use or inability to use our calculators</li>
              <li>Decisions made based on calculator results</li>
              <li>Errors, inaccuracies, or omissions in calculation results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Service Availability</h2>
            <p className="leading-relaxed">
              OnlineCalc is provided free of charge on an "as available" basis. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Continuous, uninterrupted, or error-free service</li>
              <li>That defects will be corrected</li>
              <li>That the website will be free from viruses or harmful components</li>
            </ul>
            <p className="leading-relaxed mt-3">
              We reserve the right to modify, suspend, or discontinue any part of the service at any time 
              without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Currency and Exchange Rates</h2>
            <p className="leading-relaxed">
              For finance calculators with multi-currency support:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Currency detection is based on IP geolocation and may not always be accurate</li>
              <li>We do not provide real-time exchange rates or currency conversion</li>
              <li>Currency symbols are for display purposes only</li>
              <li>Calculations are performed in the numerical values you input</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Privacy</h2>
            <p className="leading-relaxed">
              Your use of OnlineCalc is also governed by our Privacy Policy. Please review it to understand 
              how we handle your information. By using our service, you consent to our privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting. Your continued use of OnlineCalc after changes constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to terminate or restrict your access to OnlineCalc at our discretion, 
              without notice, for any reason, including violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with applicable laws. 
              Any disputes shall be resolved in the appropriate jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">15. Contact Information</h2>
            <p className="leading-relaxed">
              If you have questions about these Terms of Service, please contact us. We will make reasonable 
              efforts to respond to all legitimate inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">16. Severability</h2>
            <p className="leading-relaxed">
              If any provision of these terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain 
              in full force and effect.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
            <p className="text-sm text-gray-700 mb-2">
              OnlineCalc provides free calculators for general informational purposes. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
              <li>Results are estimates and should not replace professional advice</li>
              <li>Use at your own risk - we're not liable for decisions based on results</li>
              <li>Service is provided "as is" without guarantees</li>
              <li>Always verify critical calculations with appropriate professionals</li>
            </ul>
            <p className="text-sm text-gray-700 mt-3">
              <strong>By using OnlineCalc, you acknowledge and accept these terms.</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
