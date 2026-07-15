import React from "react";
import LegalLayout, { LegalSection } from "./LegalLayout";

/**
 * Privacy Policy — reflects the site's ACTUAL data practices as of the last
 * update below:
 *   - Contact forms → Supabase `contact_submissions` + email notification via
 *     a Supabase Edge Function (SMTP).
 *   - No analytics, advertising cookies, or third-party tracking.
 *   - Processors: Supabase (DB/auth/functions), Vercel (hosting), the SMTP
 *     email provider, and YouTube (only where a video embed is shown).
 *
 * NOTE: This is a plain-language template, not legal advice. Placeholders in
 * [BRACKETS] must be confirmed, and the document should be reviewed by a
 * qualified lawyer before you rely on it — especially given international
 * (UK/EU/US) visitors.
 */
const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="Last updated: 15 July 2026">
      <p>
        This Privacy Policy explains how <strong>22 Signals</strong> ("22 Signals",
        "we", "us", or "our") collects, uses, and protects information when you
        visit <strong>22signals.com</strong> (the "Site") or contact us through it.
        22 Signals is a business registered in Lahore, Pakistan. By using the Site,
        you agree to the practices described here.
      </p>

      <LegalSection n={1} title="Information we collect">
        <p>
          <strong>Information you give us.</strong> When you submit an enquiry
          through a form on our Site, we collect the details you choose to provide.
          Depending on the form, this may include your name, email address, phone
          number, company or organisation, location/country, the services you are
          interested in, your budget and timeline, your website, and any details
          you include in your message.
        </p>
        <p>
          <strong>Information collected automatically.</strong> Like most websites,
          our hosting provider automatically records limited technical information
          for security and reliability — for example your IP address, browser type,
          and the date and time of requests. We use this only to operate and protect
          the Site.
        </p>
        <p>
          <strong>What we do NOT collect.</strong> We do not use advertising
          cookies, marketing pixels, or third-party analytics/tracking tools, and we
          do not build advertising profiles about you.
        </p>
      </LegalSection>

      <LegalSection n={2} title="How we use your information">
        <p>We use the information you provide to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>respond to your enquiry and communicate with you;</li>
          <li>provide, discuss, and deliver our services;</li>
          <li>maintain records of our correspondence;</li>
          <li>keep the Site secure and prevent misuse; and</li>
          <li>comply with our legal obligations.</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information, and we do not use
          it for automated decision-making or advertising.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Legal bases for processing">
        <p>
          Where data-protection law applies to you (for example if you are in the UK
          or EU), we rely on the following legal bases: your <em>consent</em> when you
          submit a form; our <em>legitimate interests</em> in responding to enquiries
          and running our business; and, where relevant, the <em>performance of a
          contract</em> with you.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Cookies and similar technologies">
        <p>
          We do not use analytics or advertising cookies, and we do not show a cookie
          consent banner because we do not set non-essential cookies. The only local
          storage we use is strictly necessary — for example, keeping authorised staff
          signed in to our private content-management area. This does not apply to
          ordinary visitors.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Service providers who process data for us">
        <p>
          We rely on a small number of trusted providers ("processors") to run the
          Site and handle enquiries. They only process data on our instructions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Supabase</strong> — stores form submissions in our database,
            powers our secure staff login, and sends us email notifications about new
            enquiries.
          </li>
          <li>
            <strong>Vercel</strong> — hosts the Site and processes standard server
            logs (such as IP addresses) for delivery and security.
          </li>
          <li>
            <strong>Our email provider</strong> — delivers notification emails about
            your enquiry to our team.
          </li>
          <li>
            <strong>YouTube (Google)</strong> — where a video is embedded, it is
            served in privacy-enhanced mode (<em>youtube-nocookie.com</em>). If you
            play an embedded video, Google may receive data in accordance with its own
            privacy policy.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={6} title="International data transfers">
        <p>
          Our providers may store and process data on servers located outside
          Pakistan (for example in the EU or the US). Where information is transferred
          internationally, we take reasonable steps to ensure it remains protected in
          line with this Policy.
        </p>
      </LegalSection>

      <LegalSection n={7} title="How long we keep it">
        <p>
          We keep enquiry information for as long as needed to respond to you and for
          our legitimate business and record-keeping purposes, after which it is
          deleted or anonymised. You can ask us to delete your information at any time
          (see "Your rights").
        </p>
      </LegalSection>

      <LegalSection n={8} title="Your rights">
        <p>
          Subject to applicable law, you may have the right to access the personal
          information we hold about you, to correct or delete it, to object to or
          restrict certain processing, and to withdraw consent. To exercise any of
          these rights, contact us using the details below and we will respond within
          a reasonable time.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Data security">
        <p>
          We use reasonable technical and organisational measures to protect your
          information against unauthorised access, loss, or misuse. However, no method
          of transmission over the internet is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Children's privacy">
        <p>
          The Site is intended for businesses and adults. It is not directed to
          children, and we do not knowingly collect personal information from anyone
          under the age of 16.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Links to other sites">
        <p>
          Our Site may link to third-party websites. We are not responsible for the
          privacy practices or content of those sites, and we encourage you to read
          their privacy policies.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will
          revise the "Last updated" date above. Significant changes will be reflected
          on this page.
        </p>
      </LegalSection>

      <LegalSection n={13} title="Contact us">
        <p>
          If you have questions about this Policy or your information, contact us at:
        </p>
        <p className="text-white/85">
          22 Signals
          <br />
          Email: <a className="text-[#6B92FF] hover:underline" href="mailto:[privacy@22signals.com]">[privacy@22signals.com]</a>
          <br />
          Address: [Registered address, Lahore, Pakistan]
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
