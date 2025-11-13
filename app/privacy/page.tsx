import Breadcrumbs from "@/components/Breadcrumbs";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Privacy Policy", href: "/privacy" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: November 13, 2025</p>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to TheTotalCalc. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle your information when you use our website and calculators.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.1 Information You Provide</h3>
            <p className="leading-relaxed mb-3">
              TheTotalCalc does <strong>not</strong> require you to create an account or provide personal information 
              to use our calculators. All calculations are performed locally in your browser.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Browser Information:</strong> Browser type, version, and operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, and navigation patterns</li>
              <li><strong>IP Address:</strong> For currency detection in finance calculators (via ipapi.co)</li>
              <li><strong>Local Storage:</strong> Recent calculator history stored locally on your device</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our calculator services</li>
              <li>To improve user experience and functionality</li>
              <li>To detect currency based on your location (finance calculators only)</li>
              <li>To analyze usage patterns and improve our services</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Local Storage</h2>
            <p className="leading-relaxed">
              TheTotalCalc uses browser local storage to save your recent calculator history and preferred currency 
              settings. This data is stored <strong>only on your device</strong> and is not transmitted to our 
              servers. You can clear this data at any time through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Third-Party Services</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">5.1 Currency Detection</h3>
            <p className="leading-relaxed mb-3">
              We use ipapi.co for automatic currency detection based on your IP address. Please refer to their 
              privacy policy for more information about how they handle your data.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">5.2 Analytics</h3>
            <p className="leading-relaxed">
              We may use analytics services to understand how our website is used. These services may collect 
              information about your visits, but we do not link this data to any personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate security measures to protect your data. However, no method of transmission 
              over the internet is 100% secure. All calculations are performed client-side in your browser, 
              ensuring that sensitive information never leaves your device.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p className="leading-relaxed">
              TheTotalCalc uses minimal cookies and browser storage for essential functionality such as saving your 
              preferred currency and recent calculator history. We do not use cookies for advertising or tracking 
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
            <p className="leading-relaxed">
              TheTotalCalc is suitable for all ages. We do not knowingly collect personal information from children 
              under 13. Our calculators can be used without providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Your Rights</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access any information we have collected</li>
              <li>Clear your local storage data through browser settings</li>
              <li>Opt-out of analytics tracking (via browser settings or extensions)</li>
              <li>Request information about our data practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify users of any significant changes 
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Data Retention</h2>
            <p className="leading-relaxed">
              Since we do not collect or store personal information on our servers, there is no data retention 
              policy. All data stored in your browser's local storage remains until you clear it manually.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy or our data practices, please contact us. 
              We take privacy concerns seriously and will respond to all legitimate requests.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Key Takeaway:</strong> TheTotalCalc is designed with privacy in mind. We don't require accounts, 
              don't store your calculations on our servers, and only collect minimal data necessary to provide our 
              services.
            </p>
            <p className="text-sm text-gray-700">
              All calculations happen in your browser, ensuring your sensitive data never leaves your device.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
