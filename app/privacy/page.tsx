import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300 mb-6">
            <strong className="text-white">Effective Date:</strong> October 27, 2025
          </p>
          
          <div className="text-slate-300 space-y-6">
            <p>
              This Privacy Policy explains how we collect, use, disclose, and protect the personal information you provide or that we collect when you access or use our services when you use our website or mobile application (the "Platform"). It explains your privacy rights and choices, and how to contact us about our privacy practices. Please read this Policy carefully. By using our Platform, you consent to the data practices described in this Policy.
              <a href="" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
              </a>.
            </p>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Entity and Contact Information</h2>
              <p>
                This Privacy Policy is published on behalf of an individual operator located in Penumantra, India. Business names and registered addresses are not applicable in this case. All references to "I", "me", or "my" refer to the individual operator.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">How to Contact Us</h3>
              <p>
                If you have questions, requests, or concerns about this Privacy Policy, please contact us at:{' '}
                <strong className="text-white">ksrlearner@gmail.com</strong>.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
              <p>We collect multiple types of information to operate effectively and provide you the best experience. The categories of information we collect include:</p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.1. Information You Provide Directly</h3>
              <p>
                When you register, create an account, fill forms, contact us, or otherwise communicate with us, you may provide personal information such as your name, email address, phone number, billing and payment information, profile information, and other identifiers. For businesses, this may include the business contact person, company name, and business address — only when you entered that information and only if entity_type is 'business'. For individual operators, business name and address are intentionally omitted from this Policy output and will not appear in rendered policy text.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.2. Automatically Collected Information</h3>
              <p>
                We automatically collect technical and usage data when you interact with the Platform, which may include IP address, device identifiers, device model and operating system, browser type, language preferences, access times, pages visited, search queries, referring/exit pages, crash logs, and performance metrics.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.3. Location Data</h3>
              <p>
                We may collect approximate or precise location data from your device if you grant location permissions. Location data may be used to provide location-sensitive functionality, improve service relevance, or for fraud prevention. You can control location access in your device settings.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.4. Payment and Transaction Data</h3>
              <p>
                When you make purchases or use paid features, we collect payment data (such as billing name, billing address, and payment card details) which is processed by secure third-party payment processors. We do not store full payment card numbers on our servers unless explicitly required and disclosed.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.5. Communications and Support Data</h3>
              <p>
                We maintain records of communications and support interactions to provide assistance, detect abuse, and improve service quality. These records may include email content, chat transcripts, telephone logs, and attachments you send.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.6. Derived and Aggregated Data</h3>
              <p>
                We may derive non-identifying, aggregated, or de-identified data from the information we collect. Aggregated data is used for analytics, performance measurement, and research; it cannot reasonably be used to identify you.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Information</h2>
              <p>We use collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>To provide, operate, maintain, and improve the Platform and related services.</li>
                <li>To authenticate users, manage accounts, provide customer support, and communicate important updates.</li>
                <li>To process payments, prevent fraud, and enforce our Terms of Service.</li>
                <li>To personalize content, recommendations, and advertising where allowed.</li>
                <li>To perform analytics, monitor service health, and produce aggregated statistics for internal use.</li>
                <li>To comply with legal obligations, respond to lawful requests from government or law enforcement, and protect rights and safety.</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Legal Bases for Processing (If Applicable)</h2>
              <p>To the extent applicable, our lawful bases for processing personal data may include:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong className="text-white">Consent:</strong> You have given consent for specific processing activities (e.g., marketing emails, cookies) where required.</li>
                <li><strong className="text-white">Contractual Necessity:</strong> Processing required to perform our agreement with you (e.g., account provisioning, payment processing).</li>
                <li><strong className="text-white">Legal Obligation:</strong> Processing required to comply with law or regulatory requests.</li>
                <li><strong className="text-white">Legitimate Interests:</strong> Processing necessary for our legitimate interests, balanced against your rights (e.g., fraud prevention, network security, direct communications).</li>
                <li><strong className="text-white">Website:</strong> refers to ksrlearner, accessible from{' '}
                  <a href="https://listwr.com/live-privacy-policy?site=ksrlearner" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                    ksrlearner
                  </a>.
                </li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
              <p>We do not use cookies for tracking beyond essential technical cookies required to operate the service.</p>
              <p>
                We classify cookies into categories including essential cookies, preference cookies, analytics cookies, and advertising cookies. Essential cookies enable core functionality. Preference and analytics cookies support personalization and performance. Advertising cookies enable targeted ads (only used if we operate ads or use ad networks).
              </p>
              <p>
                To manage cookies, you may use your browser settings or device controls. For mobile apps, permission prompts and in-app settings may allow you to opt out of certain tracking.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Advertising and Analytics</h2>
              <p>We do not display advertisements from third-party networks that use tracking for ad targeting. We do not use third-party analytics platforms to collect usage metrics beyond server-side logs and essential diagnostics.</p>
              <p>
                Where third-party advertising or analytics vendors operate, their own privacy policies govern their data practices. We recommend reviewing such policies for more details and opt-out tools.
              </p>
              <p>
                To learn about Google Analytics privacy, see:{' '}
                <a rel="external nofollow noopener" href="https://policies.google.com/technologies/partner-sites" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                  Google Partner Sites Policy
                </a>.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We disclose personal information only as described below or with your consent:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>To service providers and contractors providing hosting, infrastructure, payment, and other services to operate the Platform.</li>
                <li>To affiliates and partners for joint operations, where you have consented or where permitted by law.</li>
                <li>To comply with legal processes, such as court orders, subpoenas, or government investigations.</li>
                <li>To protect our rights, property, or safety, or the rights, property, or safety of others.</li>
              </ul>
              <p>
                We may share data with the following categories of third parties: ["Other"]. These service providers assist with hosting, payment processing, customer support, analytics, communication, and other necessary operations.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. International Data Transfers</h2>
              <p>
                Our operations may involve transferring personal information to countries outside your country of residence. When we transfer data internationally, we implement appropriate safeguards, such as standard contractual clauses or other mechanisms permitted by law, to protect the data.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Data Retention and Deletion</h2>
              <p>
                We retain personal information for as long as necessary to provide services, comply with legal obligations, resolve disputes, enforce agreements, and for legitimate business purposes. Retention periods vary by data type and legal requirements. Where possible, we will honor deletion requests, subject to verification and legal exceptions. At present, deletion requests will be evaluated and handled on a case-by-case basis. We will respond to deletion inquiries and provide guidance; some data may need to be retained for legal, tax, accounting, or legitimate business reasons.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Security Measures</h2>
              <p>
                We use administrative, technical, and physical controls designed to protect personal information from unauthorized access, disclosure, alteration, and destruction. Controls include access controls, encryption in transit and at rest (where applicable), secure data centers, vulnerability scanning, and internal security policies. While we strive to use reasonable safeguards, no system can be guaranteed to be 100% secure.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Children's Privacy</h2>
              <p>
                Our Platform is not directed to children under the age of 13 (or the minimum age in your jurisdiction). We do not knowingly collect personal information from children without parental consent. If a parent or guardian believes we have collected information from a child under the applicable age without consent, please contact us and we will take steps to delete such data.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Your Privacy Rights</h2>
              <p>
                Depending on where you reside, you may have rights including the right to access, correct, or delete your personal data, the right to portability, the right to restrict or object to processing, and the right to withdraw consent. You may also have the right to opt-out of certain data uses or profiling, and to opt-out of the sale or sharing of personal information where applicable. To exercise these rights, contact us at the email address listed above. We will verify requests consistent with applicable law and respond within applicable timeframes.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. Rights for European Residents (GDPR)</h2>
              <p>
                Where applicable law provides additional rights (for example, under regional or local privacy laws), we will comply with those rights. This policy aims to respect globally recognized privacy principles. Under GDPR, you may request access to your personal data, rectification, erasure, restriction of processing, data portability, and to object to processing. In some cases, you can lodge a complaint with a supervisory authority where you believe your rights have been violated.
              </p>
              <p>
                To learn about Google Analytics privacy, see:{' '}
                <a rel="external nofollow noopener" href="https://policies.google.com/technologies/partner-sites" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                  Google Partner Sites Policy
                </a>.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">13. Rights for California Residents (CCPA/CPRA)</h2>
              <p>
                If you are a California resident, you may have rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). This policy contains sections describing how to exercise those rights, including access, deletion, and opt-out of sale/sharing (if applicable). If you are a California resident, you can request details about the categories of personal data we collect, the categories of sources, the categories of recipients, and the business purposes for collection. You may request deletion and opt-out of sale or sharing where applicable. We do not knowingly sell the personal information of minors under 16 without affirmative authorization.
              </p>
              <p>
                For more about your rights under CCPA, visit:{' '}
                <a href="https://oag.ca.gov/privacy/ccpa" rel="external nofollow noopener" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                  California CCPA Information
                </a>.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">14. Third-Party Links and Integrations</h2>
              <p>
                The Platform may contain links to third-party websites or integrate with third-party services. We are not responsible for their privacy practices. Review their privacy policies before providing personal information to third parties.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">15. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we make material changes, we will provide notice on the Platform or by other means as required by law. The updated Policy will indicate the Effective Date. Continued use of the Platform after changes constitutes your acceptance of the revised Policy.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">16. Data Breach Response</h2>
              <p>
                In the event of a security breach that affects personal information, we will follow our incident response plan, take reasonable steps to mitigate harm, and notify affected individuals and regulators as required by applicable law. We maintain processes for evaluating and responding to security incidents.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">17. Automated Decision-Making and Profiling</h2>
              <p>
                We may use automated systems, including algorithms and machine learning, to analyze data for product improvements, fraud detection, personalization, and other operational purposes. Where applicable, you have rights regarding automated decisions about you; contact us to learn whether automated processing applies to your data and how to exercise any rights.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">18. International Users</h2>
              <p>
                If you are accessing the Platform from outside our primary operating country, your data will be processed under the laws of the country where our servers or subprocessors operate, while respecting the protections described in this Policy. Transfers are made in compliance with applicable safeguards and legal mechanisms for cross-border data flows.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">19. Retention, Anonymization and Archiving</h2>
              <p>
                When data is no longer necessary for the purposes for which it was collected, we delete or anonymize it. In some cases we may retain information for historical, statistical, or legal compliance reasons. Anonymized or aggregated data may be retained indefinitely and used for analytics and research.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">20. How to Exercise Your Rights</h2>
              <p>
                To exercise your rights, or to inquire about our privacy practices, please contact us via the email address provided above. We will attempt to respond within applicable statutory timelines and may require verification of identity to protect your information and the rights of others.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">21. Complaint Mechanisms and Supervisory Authorities</h2>
              <p>
                If you are in the EU/EEA, you may lodge a complaint with a data protection authority. If you are in another jurisdiction and wish to file a complaint, contact your local supervisory body or our designated contact for privacy matters.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">22. Additional Disclosures</h2>
              <p>
                We may provide additional privacy disclosures in context (for example, within the App privacy settings, account pages, or terms for specific features). Those supplemental notices are incorporated into this Policy where applicable.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">23. Data Security and Third-Party Subprocessors</h2>
              <p>
                We vet our subprocessors and require them to adhere to contractual obligations to protect personal data. We may update our list of subprocessors and will provide notice of material changes where required by law.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">24. Miscellaneous</h2>
              <p>
                Where any provision of this Policy conflicts with applicable law, such provision will be interpreted to the extent necessary to comply with the law. Headings are for convenience only and do not affect interpretation. This Policy does not create contractual rights for third parties.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">25. Final Notes</h2>
              <p>
                We strive to maintain transparent and robust privacy practices. Thank you for trusting ksrlearner.netlify.com with your information. Please review this Policy periodically for updates.
              </p>
              <p className="mt-6">
                <strong className="text-white">Publisher:</strong> ksrlearner.netlify.com (Penumantra, India).
              </p>
              <p>
                <strong className="text-white">Last updated:</strong> October 27, 2025.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

