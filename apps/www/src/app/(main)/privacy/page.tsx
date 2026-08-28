import { Anchor } from "ui-lab-components/anchor";
import { LegalPage, type LegalSection } from "../legal-page";

export const metadata = {
  title: "Privacy Policy",
  description: "How UI Lab collects, uses, and protects personal information.",
};

const sections: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    summary: "We collect the information needed to run UI Lab, manage accounts, and provide supporter access.",
    content: (
      <>
        <p>
          We may collect account details such as your name, email address, profile image, authentication
          identifiers, and account activity. When supporter packages are available, our payment provider
          will process your payment details; UI Lab will receive transaction details such as status,
          amount, date, and a payment or customer identifier, but not your full card number.
        </p>
        <p>
          We also collect technical information such as IP address, device and browser type, pages viewed,
          referring URLs, timestamps, cookie identifiers, and diagnostic logs. If you contact us, we keep
          the message and the information you provide.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    summary: "We use personal information to provide, secure, support, and improve the service.",
    content: (
      <p>
        We use information to create and authenticate accounts, confirm supporter entitlements, process
        transactions, provide access to the library, respond to requests, prevent fraud and abuse,
        troubleshoot issues, understand service performance, comply with law, and send essential service
        messages. We will request consent before sending optional marketing where the law requires it.
      </p>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal bases",
    summary: "Where applicable, we process data because it is needed for our contract, legal duties, legitimate interests, or your consent.",
    content: (
      <p>
        For users in the EEA, United Kingdom, and similar jurisdictions, our legal bases are performance
        of a contract when providing accounts and purchases; legitimate interests in operating, securing,
        and improving UI Lab; compliance with legal obligations; and consent for optional cookies or
        communications. You may withdraw consent at any time without affecting earlier processing.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    summary: "We do not sell personal information. We share it only with providers and parties needed to operate UI Lab or comply with law.",
    content: (
      <>
        <p>
          We may share information with hosting, authentication, payment, analytics, email, customer
          support, and security providers acting on our behalf. We may also disclose it when legally
          required, to protect rights and safety, or as part of a merger, financing, acquisition, or sale
          of assets with appropriate safeguards.
        </p>
        <p>
          UI Lab does not sell or share personal information for cross-context behavioral advertising as
          those terms are defined by California law.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    summary: "Essential storage keeps the service working; optional analytics or advertising technologies require the choices the law gives you.",
    content: (
      <p>
        UI Lab may use cookies and local storage for authentication, security, preferences, and service
        operation. If optional analytics or advertising technologies are introduced, we will provide any
        required notice and consent controls. Browser settings can block cookies, but essential features
        may then stop working.
      </p>
    ),
  },
  {
    id: "retention-security",
    title: "Retention and security",
    summary: "We keep data only as long as reasonably needed and use safeguards designed to protect it.",
    content: (
      <p>
        We retain account information while your account is active and afterward as needed for legal,
        tax, accounting, fraud-prevention, and dispute-resolution purposes. Retention periods vary by
        data type and legal requirement. We use reasonable administrative, technical, and organizational
        safeguards, but no online service can guarantee absolute security.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your privacy rights",
    summary: "Depending on where you live, you may access, correct, delete, restrict, object to, or receive a copy of your information.",
    content: (
      <>
        <p>
          You may also have the right to withdraw consent, appeal a decision, opt out of certain sharing,
          and lodge a complaint with a data protection authority. California residents may request the
          categories and specific pieces of personal information collected, correction, deletion, and
          information about disclosures, without discrimination for exercising those rights.
        </p>
        <p>
          Submit a request through our <Anchor href="/contact">contact form</Anchor>. We may verify
          your identity before fulfilling it. Authorized agents may submit requests where permitted by law.
        </p>
      </>
    ),
  },
  {
    id: "international-children",
    title: "International transfers and children",
    summary: "Data may be processed in other countries, and UI Lab is not intended for children under 13.",
    content: (
      <p>
        Where personal information crosses borders, we use safeguards required by applicable law. UI Lab
        is not directed to children under 13, and we do not knowingly collect their personal information.
        Users must be at least 16 where local law requires that age for independent consent. Contact us if
        you believe a child provided information.
      </p>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    summary: "We will post updates here and provide additional notice when a change is material.",
    content: (
      <>
        <p>
          The effective date above shows when this policy last changed. Continued use after an updated
          policy takes effect is subject to the updated policy, where permitted by law.
        </p>
        <p>
          Data controller: UI Lab [VERIFY legal entity]. Privacy and data requests can be submitted through
          our <Anchor href="/contact">contact form</Anchor>.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How UI Lab handles information when you use the site, create an account, or become a supporter."
      effectiveDate="August 27, 2026"
      sections={sections}
    />
  );
}
