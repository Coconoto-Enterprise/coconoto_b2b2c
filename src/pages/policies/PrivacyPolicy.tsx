import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '/src/components/Navbar';
import Footer from '/src/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Privacy Policy</h1>
            <p className="text-gray-600 mb-8 text-center text-sm">Effective Date: January 1, 2024 | Last Updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-green max-w-none space-y-8">
              
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Coconoto Limited ("Company," "we," "us," "our," or "Coconoto") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, and related services (collectively, the "Platform").
                </p>
                <p className="text-gray-700">
                  Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Platform. By accessing and using Coconoto, you acknowledge that you have read, understood, and agree to be bound by all the provisions of this Privacy Policy.
                </p>
              </section>

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">We collect information from you in the following ways:</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">A. Information You Provide Directly</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Account Registration:</strong> Name, email address, phone number, business name, business address, tax identification numbers</li>
                  <li><strong>Payment Information:</strong> Credit card numbers, billing address, transaction history (processed securely through third-party payment processors)</li>
                  <li><strong>Profile Information:</strong> Business description, products/services offered, company logo, business documentation</li>
                  <li><strong>Communication:</strong> Messages, inquiries, support requests, feedback, and reviews</li>
                  <li><strong>Preferences:</strong> Communication preferences, notification settings, language preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">B. Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address, unique device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, clickstream data, referring/exit pages, features used</li>
                  <li><strong>Location Data:</strong> General location information (city, country) derived from IP address (unless you provide specific location permissions)</li>
                  <li><strong>Cookies & Similar Technologies:</strong> Session cookies, persistent cookies, web beacons, pixels (see Section 10)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">C. Information from Third Parties</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Payment processors and financial institutions</li>
                  <li>Business partners and vendors</li>
                  <li>Third-party authentication providers</li>
                  <li>Publicly available sources and data aggregators</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Providing, maintaining, and improving our Platform and services</li>
                  <li>Processing and fulfilling your transactions and orders</li>
                  <li>Creating and managing your account</li>
                  <li>Sending transactional communications (order confirmations, receipts, account updates)</li>
                  <li>Sending marketing communications (with your consent), newsletters, and promotional offers</li>
                  <li>Responding to your inquiries, customer support requests, and feedback</li>
                  <li>Conducting surveys, questionnaires, and market research</li>
                  <li>Analyzing usage patterns to improve user experience and Platform functionality</li>
                  <li>Personalizing your experience and recommendations</li>
                  <li>Detecting, preventing, and addressing fraud, abuse, and security incidents</li>
                  <li>Complying with legal obligations and enforcing our Terms of Service</li>
                  <li>Running contests, promotions, and special offers</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Legal Basis for Processing (GDPR/CCPA)</h2>
                <p className="text-gray-700 mb-4">Where applicable, we process your information based on:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Contractual Necessity:</strong> To fulfill our services and agreements with you</li>
                  <li><strong>Your Consent:</strong> When you explicitly agree to our processing</li>
                  <li><strong>Legitimate Business Interests:</strong> To operate, improve, and protect our Platform</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                  <li><strong>Fraud Prevention:</strong> To detect and prevent fraud and security threats</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Share Your Information</h2>
                <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">A. Service Providers</h3>
                <p className="text-gray-700 mb-4">
                  We share information with third-party service providers who assist us in operating our Platform, including:
                  email service providers, payment processors, analytics providers, hosting providers, customer support tools, and marketing services.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">B. Business Partners</h3>
                <p className="text-gray-700 mb-4">
                  With your consent, we may share information with business partners for joint marketing initiatives, partnerships, or integrated services.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">C. Marketplace Transactions</h3>
                <p className="text-gray-700 mb-4">
                  On our B2B2C marketplace, we share necessary information (such as contact details) between buyers and sellers to facilitate transactions. Sellers may receive buyer information to process and fulfill orders.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">D. Legal Requirements</h3>
                <p className="text-gray-700 mb-4">
                  We may disclose your information when required by law, court order, government request, or when we believe in good faith that such disclosure is necessary to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                  <li>Comply with applicable laws and regulations</li>
                  <li>Protect our legal rights and prevent fraud</li>
                  <li>Ensure the safety of our users and the public</li>
                  <li>Enforce our Terms of Service</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">E. Business Transfers</h3>
                <p className="text-gray-700">
                  If Coconoto is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your information becomes subject to a different privacy policy.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
                <p className="text-gray-700">
                  We retain your personal information for as long as necessary to provide our services, fulfill the purposes for which we collected it, and comply with legal obligations. The retention period varies depending on the context of the processing and our legal requirements. When information is no longer needed, we will securely delete or anonymize it. However, we may retain certain information for backup, archival, and legal compliance purposes.
                </p>
              </section>

              {/* Section 6 - CCPA/CPRA */}
              <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. California Privacy Rights (CCPA & CPRA)</h2>
                <p className="text-gray-700 mb-4">
                  If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">A. Right to Know</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to request what personal information we have collected about you, including the categories of information, the sources, and how we use it.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">B. Right to Delete</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to request deletion of your personal information, subject to certain exceptions such as when the information is necessary to fulfill our service obligations or comply with legal requirements.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">C. Right to Correct</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to request correction of inaccurate personal information we maintain about you.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">D. Right to Opt-Out</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to opt-out of:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>The "sale" or "sharing" of personal information (targeted advertising)</li>
                  <li>Automated decision-making and profiling</li>
                  <li>Marketing communications</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">E. Right to Limit Use</h3>
                <p className="text-gray-700 mb-4">
                  You can limit how we use your sensitive personal information to what is necessary to provide services.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">F. Right to Non-Discrimination</h3>
                <p className="text-gray-700 mb-4">
                  We will not discriminate against you for exercising your privacy rights. We will not deny you goods or services, charge different prices, or provide different quality of service solely because you have exercised your CCPA/CPRA rights.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">G. How to Exercise Your Rights</h3>
                <p className="text-gray-700">
                  To exercise any of these rights, please submit a verifiable consumer request to us at privacy@coconoto.africa. We will verify your identity and respond within 45 days (extendable by 45 additional days if needed). You may also authorize an agent to submit requests on your behalf.
                </p>
              </section>

              {/* Section 7 - CalOPPA */}
              <section className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. California Online Privacy Protection Act (CalOPPA)</h2>
                <p className="text-gray-700 mb-4">
                  As required by CalOPPA, we provide information about our privacy practices and how to contact us regarding privacy concerns.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">A. Do Not Track Signals</h3>
                <p className="text-gray-700 mb-4">
                  Some browsers include a "Do Not Track" feature. Our Platform currently does not honor "Do Not Track" browser signals; however, you can opt-out of data collection by adjusting your privacy settings or contacting us directly.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">B. Third-Party Disclosure</h3>
                <p className="text-gray-700 mb-4">
                  We do not knowingly allow third parties to collect personally identifiable information from our Platform for their own marketing purposes unless you provide explicit consent.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">C. Contact Us</h3>
                <p className="text-gray-700">
                  If you have questions about our privacy practices or CalOPPA compliance, please contact us using the information in Section 14.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Privacy Choices & Opt-Out Options</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">A. Email Communications</h3>
                <p className="text-gray-700 mb-4">
                  You can opt-out of promotional emails by clicking the "Unsubscribe" link in any marketing email or by contacting us directly. Please note that transactional emails related to your account cannot be unsubscribed.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">B. Account Preferences</h3>
                <p className="text-gray-700 mb-4">
                  You can manage communication preferences within your account settings.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">C. Cookie & Tracking Controls</h3>
                <p className="text-gray-700 mb-4">
                  Most web browsers allow you to refuse cookies or alert you when cookies are being sent. You can also use browser settings to control cookies. Note that disabling cookies may affect Platform functionality.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  Coconoto implements industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Secure Socket Layer (SSL) encryption for data transmission</li>
                  <li>Firewalls and intrusion detection systems</li>
                  <li>Restricted access to personal information on a need-to-know basis</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection practices</li>
                </ul>
                <p className="text-gray-700">
                  However, no system is completely secure. While we strive to protect your information, we cannot guarantee absolute security. You acknowledge the inherent security risks of online communications and assume responsibility for maintaining confidentiality of your account credentials.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cookies and Similar Technologies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies, web beacons, pixels, and similar tracking technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Remember user preferences and login information</li>
                  <li>Understand how you use our Platform</li>
                  <li>Improve our services and user experience</li>
                  <li>Deliver targeted advertising and personalized content</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
                <p className="text-gray-700">
                  We use both session-based and persistent cookies. You can control cookie settings through your browser preferences. Third-party analytics providers (such as Google Analytics) may also use cookies to track your usage. Visit their privacy policies to learn more about their data practices.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Children's Privacy</h2>
                <p className="text-gray-700">
                  Coconoto Platform is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13 without parental consent, we will promptly delete such information and take steps to verify that all users are at least 13 years old. Parents or guardians who believe their child's information has been collected should contact us immediately at privacy@coconoto.africa.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Third-Party Links and Services</h2>
                <p className="text-gray-700">
                  Our Platform may contain links to third-party websites, applications, and services that are not operated by Coconoto. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your information or using their platforms.
                </p>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. International Data Transfers</h2>
                <p className="text-gray-700">
                  Coconoto operates internationally. If you access our Platform from outside the United States, your information may be transferred to, stored in, and processed in the United States or other countries where we operate. These countries may have data protection laws that differ from your country of residence. By using our Platform, you consent to the transfer of your information to countries outside your country of residence, which may have different data protection rules than those of your country.
                </p>
              </section>

              {/* Section 14 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-100 p-6 rounded-lg space-y-2 text-gray-700">
                  <p><strong>Coconoto Limited</strong></p>
                  <p><strong>Email:</strong> privacy@coconoto.africa</p>
                  <p><strong>Support Email:</strong> support@coconoto.africa</p>
                  <p><strong>Website:</strong> www.coconoto.africa</p>
                  <p className="text-sm pt-4">We will respond to verified requests within 30 business days.</p>
                </div>
              </section>

              {/* Section 15 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Changes to This Privacy Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated Privacy Policy on our Platform and updating the "Last Updated" date. Your continued use of our Platform following the posting of changes constitutes your acceptance of those changes. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </section>

              {/* Section 16 */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Your Acknowledgment</h2>
                <p className="text-gray-700">
                  By using Coconoto Limited Platform, you acknowledge that you have read this Privacy Policy and agree to its terms and conditions. If you do not agree with any part of this policy, please do not use our Platform.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Last Updated:</strong> January 1, 2024<br/>
                  <strong>Includes:</strong> CCPA+CPRA Compliance | CalOPPA Compliance | GDPR Considerations
                </p>
              </div>
              <div className="text-center">
                <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
