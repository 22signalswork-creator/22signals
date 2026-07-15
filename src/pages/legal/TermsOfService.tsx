import React from "react";
import LegalLayout, { LegalSection } from "./LegalLayout";

/**
 * Terms of Service for the 22 Signals marketing website.
 *
 * Scope: this governs use of the PUBLIC WEBSITE (visitors), not paid client
 * engagements — those are covered by separate service agreements/contracts.
 *
 * NOTE: Plain-language template, not legal advice. Confirm the [BRACKET]
 * placeholders and have a qualified lawyer review before relying on it.
 * Governing law is set to Pakistan (Lahore) per the registered entity.
 */
const TermsOfService: React.FC = () => {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="Last updated: 15 July 2026">
      <p>
        These Terms of Service ("Terms") govern your access to and use of
        <strong> 22signals.com</strong> (the "Site"), operated by
        <strong> 22 Signals</strong> ("22 Signals", "we", "us", or "our"), a business
        registered in Lahore, Pakistan. By accessing or using the Site, you agree to
        these Terms. If you do not agree, please do not use the Site.
      </p>

      <LegalSection n={1} title="Use of the Site">
        <p>
          We grant you a limited, non-exclusive, non-transferable, revocable licence
          to access and use the Site for lawful, personal, and business-evaluation
          purposes. You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>use the Site in any way that breaches applicable laws or regulations;</li>
          <li>
            attempt to gain unauthorised access to the Site, its servers, or its
            administrative areas;
          </li>
          <li>
            introduce malware, or interfere with or disrupt the Site's operation;
          </li>
          <li>
            scrape, copy, or republish substantial parts of the Site without our
            written permission; or
          </li>
          <li>submit false, misleading, or unlawful information through our forms.</li>
        </ul>
      </LegalSection>

      <LegalSection n={2} title="Intellectual property">
        <p>
          Unless otherwise stated, all content on the Site — including text, graphics,
          logos, the "22 Signals" name and marks, designs, animations, and code — is
          owned by or licensed to 22 Signals and is protected by intellectual-property
          laws. You may not reproduce, distribute, or create derivative works from our
          content without our prior written consent.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Submissions and communications">
        <p>
          When you submit an enquiry or other information through the Site, you confirm
          that it is accurate and that you are entitled to provide it. We handle
          personal information in accordance with our{" "}
          <a className="text-[#6B92FF] hover:underline" href="/privacy-policy">
            Privacy Policy
          </a>
          . Please do not send confidential or sensitive information through the Site's
          forms unless we have agreed a secure method with you.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Informational content only">
        <p>
          Content on the Site — including blog posts, R&amp;D insights, case studies,
          and service descriptions — is provided for general information. It does not
          constitute professional, legal, financial, or technical advice, and any
          reliance you place on it is at your own risk. Engagements are governed by a
          separate written agreement.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Third-party links and content">
        <p>
          The Site may contain links to, or embeds from, third-party services (for
          example embedded video). We do not control and are not responsible for the
          content, policies, or availability of those third parties, and their
          inclusion does not imply endorsement.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Disclaimer of warranties">
        <p>
          The Site is provided on an "as is" and "as available" basis. To the fullest
          extent permitted by law, we disclaim all warranties, express or implied,
          including as to availability, accuracy, fitness for a particular purpose, and
          non-infringement. We do not warrant that the Site will be uninterrupted,
          error-free, or free of harmful components.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, 22 Signals will not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or for any
          loss of profits, data, goodwill, or business, arising out of or relating to
          your use of (or inability to use) the Site.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Indemnification">
        <p>
          You agree to indemnify and hold harmless 22 Signals and its team from any
          claims, losses, or expenses arising out of your misuse of the Site or your
          breach of these Terms.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Changes and availability">
        <p>
          We may modify, suspend, or discontinue any part of the Site at any time, and
          we may update these Terms from time to time. Changes take effect when posted,
          and the "Last updated" date above will reflect the most recent version. Your
          continued use of the Site means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Governing law">
        <p>
          These Terms are governed by the laws of the Islamic Republic of Pakistan.
          Any disputes arising from these Terms or your use of the Site will be subject
          to the exclusive jurisdiction of the courts of Lahore, Pakistan.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Contact us">
        <p>Questions about these Terms? Contact us at:</p>
        <p className="text-white/85">
          22 Signals
          <br />
          Email: <a className="text-[#6B92FF] hover:underline" href="mailto:contact@22signals.com">contact@22signals.com</a>
          <br />
          Address: 120 G, 8 G Block, DHA Phase 8 Ex Park View, Lahore, Pakistan
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export default TermsOfService;
