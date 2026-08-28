import { Anchor } from "ui-lab-components/anchor";
import { LegalPage, type LegalSection } from "../legal-page";

export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern access to and use of UI Lab.",
};

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance and eligibility",
    summary: "By using UI Lab, you agree to these terms. If you do not agree, do not use the service.",
    content: (
      <p>
        You must be at least 13 years old, and at least 16 where local law requires, to use UI Lab. If
        you use UI Lab for an organization, you represent that you can bind it to these terms. Additional
        purchase terms shown at checkout are part of these terms.
      </p>
    ),
  },
  {
    id: "service",
    title: "The service",
    summary: "UI Lab provides components, patterns, documentation, and related resources for building interfaces.",
    content: (
      <p>
        Some resources are public and others may require an account or supporter entitlement. We may add,
        change, suspend, or discontinue features. We aim to keep UI Lab available, but do not promise
        uninterrupted service or that beta and preview features will remain unchanged.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "Accounts",
    summary: "Keep your account accurate and secure, and do not share access outside the permissions of your package.",
    content: (
      <p>
        You are responsible for activity under your account and must promptly report unauthorized use.
        Account credentials and individual supporter access may not be shared, transferred, or resold.
        We may suspend access when reasonably necessary to protect UI Lab, investigate abuse, or enforce
        these terms.
      </p>
    ),
  },
  {
    id: "supporter-purchases",
    title: "Supporter purchases",
    summary: "A supporter package unlocks the library under the license displayed at checkout; price, taxes, and renewal terms are shown before purchase.",
    content: (
      <>
        <p>
          Supporter packages are one-time purchases and do not automatically renew [VERIFY]. Prices may
          change for future purchases. You authorize our payment provider [VERIFY provider] to charge the
          displayed amount and applicable taxes. Access begins after successful payment and may be delayed
          while fraud or payment checks are completed.
        </p>
        <p>
          Refund requests made within 14 days of purchase will be honored unless you have downloaded or
          materially accessed supporter-only resources, or applicable law requires otherwise [VERIFY final
          refund policy]. Statutory cancellation, refund, and warranty rights remain unaffected. Refund
          requests can be submitted through our <Anchor href="/contact">contact form</Anchor>.
        </p>
      </>
    ),
  },
  {
    id: "license-ownership",
    title: "License and ownership",
    summary: "You may use UI Lab resources under their stated license, but UI Lab and its licensors keep ownership of the service and materials.",
    content: (
      <>
        <p>
          Subject to these terms and the license accompanying a resource, UI Lab grants you a limited,
          non-exclusive, non-transferable, revocable right to access and use the service. Open-source
          resources remain governed by their applicable open-source licenses. If a resource-specific
          license conflicts with these terms, that license controls for that resource.
        </p>
        <p>
          You may not redistribute, sublicense, resell, scrape, mirror, or make supporter-only source files
          available as a competing library or standalone product unless the applicable license expressly
          permits it. UI Lab names, logos, site design, and proprietary materials remain protected by
          intellectual property law.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    summary: "Use UI Lab lawfully and do not harm the service, its users, or other people’s rights.",
    content: (
      <p>
        You may not break the law; infringe intellectual property or privacy rights; harass or impersonate
        others; distribute malware or spam; probe or bypass security or access controls; interfere with
        service operation; use automated access in a way that burdens the service; obtain supporter
        materials without authorization; or use UI Lab to build or train a substantially competing
        component library from supporter-only materials.
      </p>
    ),
  },
  {
    id: "privacy-third-parties",
    title: "Privacy and third parties",
    summary: "Our Privacy Policy explains our data practices, and third-party services have their own terms.",
    content: (
      <p>
        The Privacy Policy is incorporated into these terms. Authentication, payment, hosting, and other
        providers may process information under their own terms and policies. UI Lab is not responsible
        for third-party sites or services that it does not control.
      </p>
    ),
  },
  {
    id: "disclaimers-liability",
    title: "Disclaimers and liability",
    summary: "UI Lab is provided as available, and our liability is limited to the extent the law permits.",
    content: (
      <>
        <p>
          UI Lab and its materials are provided “as is” and “as available,” without warranties of
          merchantability, fitness for a particular purpose, non-infringement, or uninterrupted or
          error-free operation. You are responsible for reviewing, testing, securing, and ensuring the
          suitability of code used in your projects.
        </p>
        <p>
          To the maximum extent permitted by law, UI Lab and its operators will not be liable for indirect,
          incidental, special, consequential, exemplary, or punitive damages, or lost profits, data, or
          goodwill. Our total liability arising from the service will not exceed the greater of US $100 or
          the amount you paid UI Lab during the 12 months before the claim. These limits do not apply where
          prohibited by law. Neither party is liable for delay caused by events reasonably beyond its control.
        </p>
      </>
    ),
  },
  {
    id: "indemnity-termination",
    title: "Indemnity and termination",
    summary: "You are responsible for claims caused by your misuse, and either side may end the relationship.",
    content: (
      <p>
        To the extent permitted by law, you will indemnify UI Lab against third-party claims arising from
        your unlawful use, violation of these terms, or infringement of another person’s rights. You may
        stop using UI Lab and request account deletion at any time. We may suspend or terminate access for
        material or repeated violations, legal risk, nonpayment, or threats to the service, with notice
        where reasonable. Provisions that by nature should survive termination will survive.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "Disputes and governing law",
    summary: "Please contact us first so we can try to resolve a dispute informally.",
    content: (
      <p>
        Before filing a claim, each party will give the other written notice and 30 days to seek an
        informal resolution. These terms are governed by the laws of [VERIFY jurisdiction], without regard
        to conflict-of-law rules. Courts located in [VERIFY venue] will have exclusive jurisdiction, except
        that either party may bring an eligible claim in small claims court and consumers retain any
        mandatory protections and forums provided by their local law.
      </p>
    ),
  },
  {
    id: "changes-general-contact",
    title: "Changes, general terms, and contact",
    summary: "We may update these terms with notice, and the usual contract rules apply.",
    content: (
      <>
        <p>
          We may update these terms and will post the revised version here. We will provide at least 30
          days’ notice before material changes take effect when reasonably possible. Continued use after
          the effective date means you accept the updated terms.
        </p>
        <p>
          These terms and incorporated policies are the entire agreement about the service. If a provision
          is unenforceable, the rest remains effective. A failure to enforce is not a waiver. You may not
          assign these terms without consent; UI Lab may assign them in connection with a reorganization,
          merger, acquisition, or asset transfer. No partnership, agency, or employment relationship is created.
        </p>
        <p>
          Operator: UI Lab [VERIFY legal entity]. Legal notices and support requests can be submitted
          through our <Anchor href="/contact">contact form</Anchor>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The agreement that applies when you browse UI Lab, create an account, or purchase supporter access."
      effectiveDate="August 27, 2026"
      sections={sections}
    />
  );
}
