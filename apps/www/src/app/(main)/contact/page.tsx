import { Divider } from "ui-lab-components/divider";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact",
  description: "Contact UI Lab with support, privacy, or legal questions.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl pt-12">
      <header className="mb-12">
        <h1 className="text-2xl font-semibold text-foreground-50">Contact UI Lab</h1>
        <p className="mt-1 text-sm text-foreground-300">
          Send us a support request or a question about privacy, purchases, or the service.
        </p>
      </header>
      <section aria-labelledby="send-a-message">
        <h2 id="send-a-message" className="text-header-sm font-semibold text-foreground-200">
          Send a message
        </h2>
        <Divider variant="dashed" spacing="lg" />
        <div className="mt-8">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
