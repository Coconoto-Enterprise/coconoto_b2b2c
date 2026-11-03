/**
 * Legal page content — SINGLE SOURCE OF TRUTH.
 *
 * Read by BOTH:
 *   - `api/seo.js`  → server-renders the body into the SPA shell, so crawlers
 *                     (and Google's OAuth branding verifier) see real text
 *                     without executing JavaScript.
 *   - `src/pages/policies/*.tsx` → renders the designed page once React mounts.
 *
 * Plain ESM JavaScript on purpose: `api/` is bundled by the Vercel Node runtime
 * and cannot import TypeScript, and duplicating ~1,500 words of legal copy in a
 * second file is exactly how the two versions drift apart.
 *
 * ── Editing ──────────────────────────────────────────────────────────────────
 * Blocks are intentionally tiny:
 *   { p: 'paragraph' }            paragraph, supports **bold**
 *   { h3: 'subheading' }          third-level heading
 *   { ul: ['a', 'b'] }            bulleted list, supports **bold**
 *   { note: 'text' }              callout box
 *   { dl: [['Email', 'x@y.z']] }  definition rows (used for contact details)
 *
 * ── Before publishing ────────────────────────────────────────────────────────
 * ⚠️  JURISDICTION below is an ASSUMPTION (Nigeria). Confirm with counsel and
 *     change it in one place. Nothing else in the file hard-codes a country.
 */

export const LEGAL_UPDATED = '19 October 2026';

/** ⚠️ Assumed — confirm before relying on these Terms. */
export const JURISDICTION = 'the Federal Republic of Nigeria';

export const COMPANY = {
  name: 'Coconoto Limited',
  website: 'www.coconoto.africa',
  legalEmail: 'legal@coconoto.africa',
  privacyEmail: 'privacy@coconoto.africa',
  supportEmail: 'support@coconoto.africa',
};

const contactRows = [
  ['Company', COMPANY.name],
  ['Legal', COMPANY.legalEmail],
  ['Privacy', COMPANY.privacyEmail],
  ['Support', COMPANY.supportEmail],
  ['Website', COMPANY.website],
];

// ─── Privacy Policy ──────────────────────────────────────────────────────────

const PRIVACY = {
  heading: 'Privacy Policy',
  description: 'How Coconoto Africa collects, uses, stores and protects your personal data.',
  sections: [
    {
      heading: 'Introduction',
      blocks: [
        {
          p: `Coconoto Limited ("Company", "we", "us", "our", or "Coconoto") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, and related services (collectively, the "Platform").`,
        },
        {
          p: `Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Platform. By accessing and using Coconoto, you acknowledge that you have read, understood, and agree to be bound by all the provisions of this Privacy Policy.`,
        },
      ],
    },
    {
      heading: '1. Information We Collect',
      blocks: [
        { p: `We collect information from you in the following ways:` },
        { h3: `A. Information You Provide Directly` },
        {
          ul: [
            `**Account Registration:** Name, email address, phone number, business name, business address, tax identification numbers`,
            `**Payment Information:** Credit card numbers, billing address, transaction history (processed securely through third-party payment processors)`,
            `**Profile Information:** Business description, products/services offered, company logo, business documentation`,
            `**Communication:** Messages, inquiries, support requests, feedback, and reviews`,
            `**Preferences:** Communication preferences, notification settings, language preferences`,
          ],
        },
        { h3: `B. Information Collected Automatically` },
        {
          ul: [
            `**Device Information:** Device type, operating system, browser type, IP address, unique device identifiers`,
            `**Usage Data:** Pages visited, time spent on pages, clickstream data, referring/exit pages, features used`,
            `**Location Data:** General location information (city, country) derived from IP address (unless you provide specific location permissions)`,
            `**Cookies & Similar Technologies:** Session cookies, persistent cookies, web beacons, pixels (see Section 10)`,
          ],
        },
        { h3: `C. Information from Third Parties` },
        {
          ul: [
            `Payment processors and financial institutions`,
            `Business partners and vendors`,
            `Third-party authentication providers`,
            `Publicly available sources and data aggregators`,
          ],
        },
      ],
    },
    {
      heading: '2. How We Use Your Information',
      blocks: [
        { p: `We use the information we collect for the following purposes:` },
        {
          ul: [
            `Providing, maintaining, and improving our Platform and services`,
            `Processing and fulfilling your transactions and orders`,
            `Creating and managing your account`,
            `Sending transactional communications (order confirmations, receipts, account updates)`,
            `Sending marketing communications (with your consent), newsletters, and promotional offers`,
            `Responding to your inquiries, customer support requests, and feedback`,
            `Conducting surveys, questionnaires, and market research`,
            `Analyzing usage patterns to improve user experience and Platform functionality`,
            `Personalizing your experience and recommendations`,
            `Detecting, preventing, and addressing fraud, abuse, and security incidents`,
            `Complying with legal obligations and enforcing our Terms of Service`,
            `Running contests, promotions, and special offers`,
          ],
        },
      ],
    },
    {
      heading: '3. Legal Basis for Processing',
      blocks: [
        { p: `Where applicable, we process your information based on:` },
        {
          ul: [
            `**Contractual Necessity:** To fulfill our services and agreements with you`,
            `**Your Consent:** When you explicitly agree to our processing`,
            `**Legitimate Business Interests:** To operate, improve, and protect our Platform`,
            `**Legal Compliance:** To comply with applicable laws and regulations`,
            `**Fraud Prevention:** To detect and prevent fraud and security threats`,
          ],
        },
      ],
    },
    {
      heading: '4. How We Share Your Information',
      blocks: [
        { p: `We may share your information in the following circumstances:` },
        { h3: `A. Service Providers` },
        {
          p: `We share information with third-party service providers who assist us in operating our Platform, including: email service providers, payment processors, analytics providers, hosting providers, customer support tools, and marketing services.`,
        },
        { h3: `B. Business Partners` },
        {
          p: `With your consent, we may share information with business partners for joint marketing initiatives, partnerships, or integrated services.`,
        },
        { h3: `C. Marketplace Transactions` },
        {
          p: `On our B2B2C marketplace, we share necessary information (such as contact details) between buyers and sellers to facilitate transactions. Sellers may receive buyer information to process and fulfill orders.`,
        },
        { h3: `D. Legal Requirements` },
        {
          p: `We may disclose your information when required by law, court order, government request, or when we believe in good faith that such disclosure is necessary to:`,
        },
        {
          ul: [
            `Comply with applicable laws and regulations`,
            `Protect our legal rights and prevent fraud`,
            `Ensure the safety of our users and the public`,
            `Enforce our Terms of Service`,
          ],
        },
        { h3: `E. Business Transfers` },
        {
          p: `If Coconoto is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your information becomes subject to a different privacy policy.`,
        },
      ],
    },
    {
      heading: '5. Data Retention',
      blocks: [
        {
          p: `We retain your personal information for as long as necessary to provide our services, fulfill the purposes for which we collected it, and comply with legal obligations. The retention period varies depending on the context of the processing and our legal requirements. When information is no longer needed, we will securely delete or anonymize it. However, we may retain certain information for backup, archival, and legal compliance purposes.`,
        },
      ],
    },
    {
      heading: '6. Your Privacy Rights',
      blocks: [
        {
          p: `Subject to applicable law, you have the right to:`,
        },
        {
          ul: [
            `**Know** what personal information we hold about you, where it came from, and how we use it`,
            `**Access** a copy of the personal information we hold about you`,
            `**Correct** inaccurate or incomplete personal information`,
            `**Delete** your personal information, subject to exceptions such as records we must keep to fulfil a contract or comply with the law`,
            `**Object** to processing carried out on the basis of legitimate interests, and to direct marketing at any time`,
            `**Restrict** processing while a complaint or correction is being resolved`,
            `**Port** the information you gave us in a structured, machine-readable format`,
            `**Withdraw consent** at any time where processing is based on consent, without affecting processing already carried out`,
          ],
        },
        {
          p: `We will not discriminate against you for exercising any of these rights. We will not deny you goods or services, charge different prices, or provide a different quality of service solely because you exercised a privacy right.`,
        },
        {
          p: `To exercise any of these rights, submit a verifiable request to ${COMPANY.privacyEmail}. We will verify your identity and respond within 30 days, extendable once where a request is complex. You may authorise an agent to submit requests on your behalf.`,
        },
      ],
    },
    {
      heading: '7. Do Not Track and Third-Party Disclosure',
      blocks: [
        {
          p: `Some browsers include a "Do Not Track" feature. Our Platform currently does not honour "Do Not Track" browser signals; however, you can limit data collection by adjusting your privacy settings or contacting us directly.`,
        },
        {
          p: `We do not knowingly allow third parties to collect personally identifiable information from our Platform for their own marketing purposes unless you provide explicit consent.`,
        },
      ],
    },
    {
      heading: '8. Your Privacy Choices & Opt-Out Options',
      blocks: [
        { h3: `A. Email Communications` },
        {
          p: `You can opt out of promotional emails by clicking the "Unsubscribe" link in any marketing email or by contacting us directly. Transactional emails related to your account cannot be unsubscribed while your account is active.`,
        },
        { h3: `B. Account Preferences` },
        { p: `You can manage communication preferences within your account settings.` },
        { h3: `C. Cookie & Tracking Controls` },
        {
          p: `Most web browsers allow you to refuse cookies or alert you when cookies are being sent. You can also use browser settings to control cookies. Note that disabling cookies may affect Platform functionality, including staying signed in.`,
        },
      ],
    },
    {
      heading: '9. Data Security',
      blocks: [
        {
          p: `Coconoto implements industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:`,
        },
        {
          ul: [
            `Transport Layer Security (TLS) encryption for data in transit`,
            `Firewalls and intrusion detection systems`,
            `Restricted access to personal information on a need-to-know basis`,
            `Regular security audits and vulnerability assessments`,
            `Employee training on data protection practices`,
          ],
        },
        {
          p: `However, no system is completely secure. While we strive to protect your information, we cannot guarantee absolute security. You acknowledge the inherent security risks of online communications and assume responsibility for maintaining the confidentiality of your account credentials.`,
        },
      ],
    },
    {
      heading: '10. Cookies and Similar Technologies',
      blocks: [
        { p: `We use cookies, web beacons, pixels, and similar tracking technologies to:` },
        {
          ul: [
            `Remember user preferences and login information`,
            `Understand how you use our Platform`,
            `Improve our services and user experience`,
            `Deliver targeted advertising and personalized content`,
            `Prevent fraud and enhance security`,
          ],
        },
        {
          p: `We use both session-based and persistent cookies. You can control cookie settings through your browser preferences. Third-party analytics providers may also use cookies to track your usage; visit their privacy policies to learn more about their data practices. See our Cookie Policy for the specific categories we use.`,
        },
      ],
    },
    {
      heading: `11. Children's Privacy`,
      blocks: [
        {
          p: `The Coconoto Platform is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13 without parental consent, we will promptly delete such information. Parents or guardians who believe their child's information has been collected should contact us immediately at ${COMPANY.privacyEmail}.`,
        },
      ],
    },
    {
      heading: '12. Third-Party Links and Services',
      blocks: [
        {
          p: `Our Platform may contain links to third-party websites, applications, and services that are not operated by Coconoto. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party service before providing your information or using their platform.`,
        },
      ],
    },
    {
      heading: '13. International Data Transfers',
      blocks: [
        {
          p: `Coconoto operates internationally. If you access our Platform from outside the country where our servers are located, your information may be transferred to, stored in, and processed in another country. Those countries may have data protection laws that differ from your country of residence. Where we transfer personal data internationally, we take steps to ensure a comparable level of protection, including contractual safeguards with our processors.`,
        },
      ],
    },
    {
      heading: '14. Contact Us',
      blocks: [
        {
          p: `If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:`,
        },
        { dl: contactRows },
        { p: `We will respond to verified requests within 30 business days.` },
      ],
    },
    {
      heading: '15. Changes to This Privacy Policy',
      blocks: [
        {
          p: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated Privacy Policy on our Platform and updating the "Last Updated" date above. Your continued use of our Platform following the posting of changes constitutes your acceptance of those changes.`,
        },
      ],
    },
    {
      heading: '16. Your Acknowledgment',
      blocks: [
        {
          p: `By using the Coconoto Limited Platform, you acknowledge that you have read this Privacy Policy and agree to its terms. If you do not agree with any part of this policy, please do not use our Platform.`,
        },
      ],
    },
  ],
};

// ─── Terms of Service ────────────────────────────────────────────────────────

const TERMS = {
  heading: 'Terms of Service',
  description:
    'The terms governing your use of the Coconoto Africa platform, marketplace and coconut processing services.',
  intro: `These Terms of Service ("Terms") are a legal agreement between you and ${COMPANY.name} ("Coconoto", "we", "us") governing your access to and use of ${COMPANY.website} and any related applications, marketplace, and services (together, the "Platform"). By creating an account, placing an order, listing a product, or otherwise using the Platform, you agree to these Terms. If you do not agree, do not use the Platform.`,
  sections: [
    {
      heading: '1. Definitions',
      blocks: [
        {
          dl: [
            ['Platform', 'The Coconoto website, applications, marketplace, and any services offered through them.'],
            ['Buyer', 'A person or business that places an order through the Platform.'],
            ['Vendor', 'A person or business that lists products or services for sale through the Platform.'],
            ['Product', 'Any goods, equipment, or materials listed on the Platform.'],
            ['Services', 'Processing, installation, training, maintenance, or consultancy offered through the Platform.'],
            ['Order', 'A request by a Buyer to purchase a Product or Service from a Vendor.'],
          ],
        },
      ],
    },
    {
      heading: '2. Eligibility and Accounts',
      blocks: [
        {
          p: `You must be at least 18 years old and legally able to enter into binding contracts to use the Platform. If you use the Platform on behalf of a business, you confirm that you are authorised to bind that business to these Terms.`,
        },
        {
          p: `You agree to provide accurate, current, and complete information when registering, and to keep it up to date. You are responsible for all activity that occurs under your account and for keeping your credentials confidential. Notify us immediately at ${COMPANY.supportEmail} if you suspect unauthorised access.`,
        },
        {
          p: `We may refuse, suspend, or close an account where we reasonably believe the information provided is false, the account is being used for fraud, or these Terms have been breached.`,
        },
      ],
    },
    {
      heading: '3. Our Role as a Marketplace',
      blocks: [
        {
          p: `Coconoto operates a marketplace that connects Buyers and Vendors. Unless we expressly state otherwise on a product page, we are not the seller of Products listed by Vendors, and we are not a party to the contract of sale between a Buyer and a Vendor.`,
        },
        {
          p: `The contract of sale is formed directly between the Buyer and the Vendor when the Vendor accepts an Order. The Vendor is solely responsible for the Products it lists, including their description, quality, legality, price, availability, and delivery.`,
        },
        {
          p: `We may facilitate payment, communication, dispute handling, and logistics, but we do not guarantee that any Vendor will complete a transaction, and we do not warrant any Product except as expressly stated in these Terms.`,
        },
      ],
    },
    {
      heading: '4. Vendor Obligations',
      blocks: [
        { p: `If you list Products or Services on the Platform, you agree to:` },
        {
          ul: [
            `List only Products you own or are authorised to sell`,
            `Provide accurate descriptions, specifications, quantities, prices, and photographs`,
            `Comply with all applicable laws, including product safety, labelling, export, and phytosanitary requirements`,
            `Hold any licences, permits, or registrations your Products or Services require`,
            `Honour the price, quantity, and delivery terms shown on an accepted Order`,
            `Ship within the stated handling time and provide tracking where available`,
            `Respond to Buyer enquiries and dispute notices within a reasonable time`,
            `Pay all applicable fees, commissions, and taxes arising from your sales`,
            `Maintain adequate records to substantiate the origin and quality of your Products`,
          ],
        },
        {
          p: `You may not list counterfeit, stolen, adulterated, mislabelled, or prohibited goods, or goods whose sale would infringe the rights of a third party. We may remove any listing that we reasonably believe breaches these Terms.`,
        },
      ],
    },
    {
      heading: '5. Buyer Obligations',
      blocks: [
        {
          p: `If you place an Order, you agree to pay the stated price and any applicable delivery charges, provide accurate delivery details, and be available to receive the Order. You are responsible for inspecting goods on delivery and notifying us or the Vendor of any shortage, damage, or non-conformity within the period stated in Section 8.`,
        },
        {
          p: `You may not place Orders with no intention of completing payment, or use the Platform to obtain goods by deception.`,
        },
      ],
    },
    {
      heading: '6. Orders, Prices, and Payment',
      blocks: [
        {
          p: `Prices are set by Vendors and are shown on the product page. Prices may change at any time before an Order is accepted, but a change will not affect an Order already accepted. Prices are stated exclusive of applicable taxes and delivery charges unless expressly stated otherwise.`,
        },
        {
          p: `An Order is an offer to buy. It is accepted when the Vendor confirms it, and only then does a contract arise between Buyer and Vendor. We may cancel an Order where the Product is unavailable, the price was clearly misstated, or we suspect fraud.`,
        },
        {
          p: `Payment must be made through the payment methods offered on the Platform. Where we process payment, we act as a payment facilitator and may hold funds until the conditions in our payment terms are met. We do not store full card details; card data is handled by our payment processor.`,
        },
        {
          p: `Currency conversion, bank charges, and any taxes or duties levied on import are the responsibility of the party on whom they are lawfully imposed.`,
        },
      ],
    },
    {
      heading: '7. Delivery, Title, and Risk',
      blocks: [
        {
          p: `Delivery times quoted on the Platform are estimates unless expressly stated as guaranteed. Vendors are responsible for packaging goods adequately for transit.`,
        },
        {
          p: `Unless otherwise agreed in writing, risk in the goods passes to the Buyer on delivery to the address given in the Order. Title passes to the Buyer on the later of delivery and full payment.`,
        },
        {
          p: `Where delivery is delayed by an event outside a party's reasonable control, that party will notify the other and the delivery date will be extended by a period reasonable in the circumstances.`,
        },
      ],
    },
    {
      heading: '8. Returns, Refunds, and Disputes',
      blocks: [
        {
          p: `If goods arrive damaged, short, or materially different from their description, notify us through the Platform within 7 days of delivery, with photographs and any delivery documentation. We will open a dispute and work with the Buyer and Vendor to reach a resolution.`,
        },
        {
          p: `Where a dispute is upheld, the remedy will ordinarily be replacement, repair, or refund of the affected goods. Refunds are made to the original payment method.`,
        },
        {
          p: `Perishable goods and custom-made or custom-configured equipment may not be returnable except where defective or not as described. Any such restriction will be stated on the product page.`,
        },
        {
          p: `Our dispute process is a facilitation service. It does not replace any statutory rights you have, and it does not make us a party to the contract of sale.`,
        },
      ],
    },
    {
      heading: '9. Prohibited Conduct',
      blocks: [
        { p: `You agree not to:` },
        {
          ul: [
            `Breach any applicable law, regulation, or third-party right`,
            `Post false, misleading, or defamatory content`,
            `Infringe intellectual property rights of any person`,
            `Transmit malware, or attempt to gain unauthorised access to the Platform or another user's account`,
            `Scrape, harvest, or systematically extract data from the Platform without our written consent`,
            `Circumvent fees by transacting off-platform with a counterparty introduced through the Platform`,
            `Manipulate prices, reviews, or ratings`,
            `Use the Platform to launder money, finance terrorism, or evade sanctions`,
            `Interfere with the operation or security of the Platform`,
          ],
        },
      ],
    },
    {
      heading: '10. Intellectual Property',
      blocks: [
        {
          p: `The Platform, including its software, design, text, graphics, logos, and trade marks, is owned by or licensed to Coconoto and is protected by intellectual property laws. You may not copy, modify, distribute, sell, or create derivative works from any part of it without our prior written consent.`,
        },
        {
          p: `You retain ownership of content you upload. By uploading it, you grant Coconoto a non-exclusive, worldwide, royalty-free licence to host, reproduce, and display that content for the purpose of operating and promoting the Platform. You confirm you have the rights necessary to grant this licence.`,
        },
      ],
    },
    {
      heading: '11. Equipment, Installation, and Processing Services',
      blocks: [
        {
          p: `Where Coconoto supplies equipment, installation, training, or processing services, the scope, specification, and any performance figures are those set out in the applicable quotation or statement of work, which forms part of these Terms.`,
        },
        {
          p: `Equipment warranties are those offered by the manufacturer or expressly stated in the quotation. Warranty does not cover damage arising from misuse, unauthorised modification, incorrect installation by a third party, or failure to follow operating instructions.`,
        },
        {
          p: `Site access, utilities, and safe working conditions are the customer's responsibility. Where installation is delayed by site conditions, additional costs may apply and will be notified in advance.`,
        },
      ],
    },
    {
      heading: '12. Disclaimer of Warranties',
      blocks: [
        {
          p: `Except as expressly stated in these Terms, the Platform is provided "as is" and "as available". To the fullest extent permitted by law, Coconoto disclaims all implied warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.`,
        },
        {
          p: `We do not warrant that the Platform will be uninterrupted, error-free, or free of harmful components, or that any content on it is accurate or complete. Product information is supplied by Vendors, and while we take reasonable steps to moderate listings, we do not verify every claim.`,
        },
        {
          p: `Nothing in these Terms excludes or limits liability for fraud, death or personal injury caused by negligence, or any other liability that cannot lawfully be excluded.`,
        },
      ],
    },
    {
      heading: '13. Limitation of Liability',
      blocks: [
        {
          p: `To the fullest extent permitted by law, Coconoto is not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profit, revenue, goodwill, business opportunity, or data, arising out of or in connection with your use of the Platform.`,
        },
        {
          p: `Our total aggregate liability arising out of or in connection with these Terms, whether in contract, tort (including negligence), or otherwise, is limited to the greater of (a) the total fees you paid to Coconoto in the 12 months preceding the event giving rise to the claim, and (b) the amount paid for the specific Order giving rise to the claim.`,
        },
        {
          p: `Coconoto is not liable for the acts or omissions of Vendors or Buyers. Any claim in respect of goods supplied by a Vendor lies against that Vendor, subject to the Vendor's own terms.`,
        },
      ],
    },
    {
      heading: '14. Indemnification',
      blocks: [
        {
          p: `You agree to indemnify and hold harmless Coconoto, its directors, employees, and agents from any claim, liability, loss, or expense (including reasonable legal fees) arising from your breach of these Terms, your misuse of the Platform, the content you upload, or the Products or Services you list or purchase.`,
        },
      ],
    },
    {
      heading: '15. Suspension and Termination',
      blocks: [
        {
          p: `You may stop using the Platform at any time and may request closure of your account. Closure does not affect Orders already accepted, fees already incurred, or rights that accrued before closure.`,
        },
        {
          p: `We may suspend or terminate your access immediately if you materially breach these Terms, if we are required to do so by law, or if continuing to provide access would expose us or other users to harm. Where the breach can be remedied, we will ordinarily give you notice and a reasonable opportunity to remedy it first.`,
        },
        {
          p: `Provisions that by their nature should survive termination — including Sections 10, 12, 13, 14, and 16 — survive.`,
        },
      ],
    },
    {
      heading: '16. Governing Law and Dispute Resolution',
      blocks: [
        {
          p: `These Terms and any dispute arising out of or in connection with them are governed by the laws of ${JURISDICTION}, without regard to conflict of law rules.`,
        },
        {
          p: `Before starting formal proceedings, the parties will attempt in good faith to resolve any dispute by negotiation for 30 days from written notice. If negotiation fails, the dispute will be referred to the courts of competent jurisdiction in ${JURISDICTION}, unless a mandatory provision of the law of your country of residence gives you the right to bring proceedings locally.`,
        },
        {
          p: `Nothing in this section prevents either party from seeking urgent injunctive relief from a court of competent jurisdiction.`,
        },
      ],
    },
    {
      heading: '17. Changes to These Terms',
      blocks: [
        {
          p: `We may amend these Terms from time to time. Material changes will be notified on the Platform or by email at least 14 days before they take effect, and the "Last Updated" date above will be revised. If you continue to use the Platform after the effective date, you accept the amended Terms. If you do not accept them, you may close your account.`,
        },
      ],
    },
    {
      heading: '18. General',
      blocks: [
        {
          ul: [
            `**Entire agreement:** These Terms, together with our Privacy Policy, Cookie Policy, and any quotation or statement of work, constitute the entire agreement between you and Coconoto on their subject matter.`,
            `**Severability:** If any provision is found invalid or unenforceable, it will be limited to the minimum extent necessary and the remaining provisions will continue in full force.`,
            `**No waiver:** A failure to enforce a provision is not a waiver of the right to enforce it later.`,
            `**Assignment:** You may not assign your rights under these Terms without our written consent. We may assign ours to an affiliate or to a successor in a merger or sale of assets.`,
            `**Force majeure:** Neither party is liable for delay or failure caused by events beyond its reasonable control, provided it notifies the other promptly and mitigates the effect.`,
            `**Notices:** Notices to Coconoto must be sent to ${COMPANY.legalEmail}. Notices to you may be sent to the email address on your account or posted on the Platform.`,
            `**Third-party rights:** No person who is not a party to these Terms may enforce any of its provisions.`,
          ],
        },
      ],
    },
    {
      heading: '19. Contact',
      blocks: [
        { p: `Questions about these Terms should be sent to:` },
        { dl: contactRows },
      ],
    },
  ],
};

// ─── Cookie Policy ───────────────────────────────────────────────────────────

const COOKIES = {
  heading: 'Cookie Policy',
  description: 'How Coconoto Africa uses cookies and similar technologies on its websites.',
  sections: [
    {
      heading: '1. What Are Cookies',
      blocks: [
        {
          p: `Cookies are small text files placed on your device when you visit a website. They allow a site to recognise your device across pages and visits. We also use similar technologies such as local storage, pixels, and web beacons; this policy refers to all of them as "cookies".`,
        },
        {
          p: `Cookies help us keep you signed in, remember your preferences, understand how the Platform is used, and keep it secure.`,
        },
      ],
    },
    {
      heading: '2. Types of Cookies We Use',
      blocks: [
        { h3: `Strictly necessary` },
        {
          p: `Required for the Platform to function. These keep you signed in, maintain your session and cart, balance traffic across servers, and protect against cross-site request forgery. They cannot be switched off through our consent tool because the Platform cannot work without them.`,
        },
        { h3: `Performance and analytics` },
        {
          p: `Help us understand how visitors use the Platform — which pages are visited, how long people stay, and where they encounter errors — so we can improve it. Data is aggregated wherever possible.`,
        },
        { h3: `Functionality` },
        {
          p: `Remember choices you make, such as language, region, and display preferences, so you do not have to set them again on each visit.`,
        },
        { h3: `Marketing` },
        {
          p: `Used to measure the effectiveness of our campaigns and, where you have consented, to show you relevant content on other sites. These are set only with your consent.`,
        },
      ],
    },
    {
      heading: '3. Third-Party Cookies',
      blocks: [
        {
          p: `Some cookies are set by third parties whose services we use — for example our payment processor, our email provider, and analytics tools. These providers have their own privacy and cookie policies, and we encourage you to review them. We do not control the cookies those third parties set.`,
        },
      ],
    },
    {
      heading: '4. Managing Cookies',
      blocks: [
        { p: `You can control cookies in several ways:` },
        {
          ul: [
            `**Browser settings** — block, delete, or receive alerts about cookies. Every major browser provides this in its privacy or security settings.`,
            `**Our consent tool** — accept or reject non-essential categories when the banner is shown, and change your choice at any time.`,
            `**Third-party opt-outs** — analytics and advertising providers usually offer their own opt-out mechanisms.`,
          ],
        },
        {
          p: `Blocking all cookies will affect your experience: you may not be able to stay signed in, complete checkout, or retain preferences.`,
        },
      ],
    },
    {
      heading: '5. Retention',
      blocks: [
        {
          p: `Session cookies are deleted when you close your browser. Persistent cookies remain for a set period — typically between 30 days and 24 months — or until you delete them. Authentication cookies expire when your session ends or after the period stated in your account settings.`,
        },
      ],
    },
    {
      heading: '6. Changes and Contact',
      blocks: [
        {
          p: `We may update this Cookie Policy to reflect changes in the technologies we use or in applicable law. The "Last Updated" date above will be revised. Questions can be sent to ${COMPANY.privacyEmail}.`,
        },
      ],
    },
  ],
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const LEGAL_PAGES = {
  '/privacy-policy': PRIVACY,
  '/terms-of-service': TERMS,
  '/cookie-policy': COOKIES,
};

/** Paths that have server-rendered legal content. */
export const LEGAL_PATHS = Object.keys(LEGAL_PAGES);
