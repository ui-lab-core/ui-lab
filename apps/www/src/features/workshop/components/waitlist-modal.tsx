'use client';

import React from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button, Input, Modal } from 'ui-lab-components';

const waitlistKey = 'ui-lab-premium-waitlist';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const stored = localStorage.getItem(waitlistKey);
    if (!stored) return;

    try {
      const submission = JSON.parse(stored) as { email?: string };
      setEmail(submission.email ?? '');
      setIsSubmitted(true);
    } catch {
      localStorage.removeItem(waitlistKey);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const input = event.currentTarget.querySelector('input[type="email"]') as HTMLInputElement | null;
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!input?.validity.valid) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      localStorage.setItem(waitlistKey, JSON.stringify({
        email,
        source: 'ui-lab-waitlist',
        timestamp: Date.now(),
      }));
      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(nextIsOpen) => {
        if (!nextIsOpen) onClose();
      }}
      className="max-w-lg"
    >
      <Modal.Header>
        <div>
          <h2 className="text-xl font-bold text-foreground-50">What&apos;s coming to UI Lab</h2>
          <p className="text-sm text-foreground-400">Be the first to know when premium content launches.</p>
        </div>
      </Modal.Header>

      <Modal.Body className="space-y-5 px-6 py-6">
        <p className="text-sm leading-relaxed text-foreground-300">
          We&apos;re building new elements, sections, and starters to help you ship polished interfaces faster.
          Join the waitlist for launch updates and early access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            id="waitlist-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
              setError('');
            }}
            placeholder="you@example.com"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
            disabled={isSubmitting || isSubmitted}
            actions={isSubmitted
              ? []
              : [
                <Button key="join" type="submit" variant="primary" size="sm" disabled={isSubmitting} isDisabled={isSubmitting}>
                  {isSubmitting ? 'Joining...' : 'Join waitlist'}
                </Button>,
              ]}
          />
          {error && <p className="text-sm text-danger-500">{error}</p>}
          {isSubmitted && (
            <div className="flex items-center gap-2 rounded border border-success-600/30 bg-success-600/10 px-3 py-2 text-sm text-success-500">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              You&apos;re on the list. We&apos;ll email you when it&apos;s ready.
            </div>
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
}

interface WaitlistModalClientProps {
  children: React.ReactNode;
}

const ModalContext = React.createContext<{
  openModal: () => void;
  closeModal: () => void;
} | null>(null);

export function useWaitlistModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useWaitlistModal must be used within WaitlistModalClient');
  }
  return context;
}

export function WaitlistModalClient({ children }: WaitlistModalClientProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={closeModal} />
    </ModalContext.Provider>
  );
}
