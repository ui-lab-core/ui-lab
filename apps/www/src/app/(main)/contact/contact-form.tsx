"use client";

import { useState, type FormEvent } from "react";
import { Button } from "ui-lab-components/button";
import { Input } from "ui-lab-components/input";
import { TextArea } from "ui-lab-components/textarea";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });

    if (response.ok) {
      form.reset();
      setStatus("sent");
      return;
    }

    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setError(body?.error ?? "Your message could not be sent. Please try again.");
    setStatus("error");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground-200">
          Email address
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="block text-sm font-medium text-foreground-200">
          Message
        </label>
        <TextArea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxCharacters={5000}
          showCharacterCount
          size="lg"
          placeholder="How can we help?"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
        <div aria-live="polite" className="text-sm">
          {status === "sent" && (
            <span className="text-success-500">Thanks. Your message has been sent.</span>
          )}
          {status === "error" && <span className="text-danger-500">{error}</span>}
        </div>
      </div>
    </form>
  );
}
