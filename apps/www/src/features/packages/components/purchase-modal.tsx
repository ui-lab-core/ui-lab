'use client';

import React from 'react';
import { Button, Input, Modal } from 'ui-lab-components';
import { CheckCircle2, Mail, Sparkles } from 'lucide-react';
import type { PricingInfo } from '@ui-lab-core/library/catalog';

type PurchaseItem = {
  id: string;
  name: string;
  description: string;
  pricing?: PricingInfo;
  gumroadProductId?: string;
  elements?: string[];
  bundledElements?: string[];
};

// PurchaseModal

interface PurchaseModalProps {
  isOpen: boolean;
  item: PurchaseItem | null;
  type: 'element' | 'starter' | 'section';
  onClose: () => void;
  gumroadBaseUrl?: string;
}

function getGumroadUrl(item: PurchaseItem | null, gumroadBaseUrl: string = 'https://uilabshop.gumroad.com/l'): string {
  if (!item) return '';
  const gumroadId = 'gumroadProductId' in item ? item.gumroadProductId : undefined;
  if (!gumroadId) return '';
  return `${gumroadBaseUrl}/${gumroadId}`;
}

function getElementNames(item: PurchaseItem | null, type: 'element' | 'starter' | 'section'): string[] {
  if (!item) return [];
  if (type === 'element' && 'elements' in item) {
    return item.elements || [];
  }
  if (type === 'starter' && 'bundledElements' in item) {
    return item.bundledElements || [];
  }
  return [];
}

function PurchaseModal({ isOpen, item, type, onClose, gumroadBaseUrl }: PurchaseModalProps) {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const waitlistKey = item ? `ui-lab-premium-waitlist-${type}-${item.id}` : '';

  React.useEffect(() => {
    if (!waitlistKey) return;

    const stored = localStorage.getItem(waitlistKey);
    if (!stored) {
      setEmail('');
      setIsSubmitted(false);
      setError('');
      return;
    }

    try {
      const submission = JSON.parse(stored) as { email?: string };
      setEmail(submission.email ?? '');
      setIsSubmitted(true);
      setError('');
    } catch {
      localStorage.removeItem(waitlistKey);
      setEmail('');
      setIsSubmitted(false);
    }
  }, [waitlistKey]);

  if (!item) return null;

  const gumroadUrl = getGumroadUrl(item, gumroadBaseUrl);
  const elementNames = getElementNames(item, type);
  const isPremium = item.pricing && item.pricing.price !== null;
  const showWaitlist = isPremium;

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        source: `${type}:${item.id}`,
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
      className='max-w-400'
    >
      <Modal.Header>
        <div>
          <h2 className="text-xl font-bold text-foreground-50">{item.name}</h2>
          {showWaitlist && (
            <p className="text-sm text-foreground-400">Premium elements are almost ready.</p>
          )}
        </div>
      </Modal.Header>

      {showWaitlist ? (
        <Modal.Body className='grid gap-0 lg:grid-cols-[1.05fr_0.95fr]'>
          <div className="min-h-80 border-b border-background-700 bg-background-950 p-6 lg:border-b-0 lg:border-r">
            <div className="flex h-full min-h-72 flex-col justify-between rounded border border-background-700 bg-background-900 p-4">
              <div className="flex items-center justify-between border-b border-background-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success-500" />
                </div>
                <span className="rounded border border-background-700 px-2 py-1 text-xs text-foreground-400">
                  Premium preview
                </span>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-3 py-5">
                <div className="col-span-2 rounded border border-background-700 bg-background-800 p-3">
                  <div className="mb-3 h-3 w-24 rounded bg-background-600" />
                  <div className="space-y-2">
                    <div className="h-2 rounded bg-background-700" />
                    <div className="h-2 w-4/5 rounded bg-background-700" />
                    <div className="h-2 w-2/3 rounded bg-background-700" />
                  </div>
                </div>
                <div className="rounded border border-background-700 bg-background-800 p-3">
                  <div className="mb-3 h-8 w-8 rounded bg-accent-500/20" />
                  <div className="space-y-2">
                    <div className="h-2 rounded bg-background-700" />
                    <div className="h-2 w-3/4 rounded bg-background-700" />
                  </div>
                </div>
                <div className="rounded border border-background-700 bg-background-800 p-3">
                  <div className="h-full min-h-16 rounded bg-background-700" />
                </div>
                <div className="col-span-2 rounded border border-background-700 bg-background-800 p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 rounded bg-background-700" />
                    <div className="h-12 rounded bg-background-700" />
                    <div className="h-12 rounded bg-background-700" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-background-700 pt-3 text-xs text-foreground-500">
                <span>Content placeholder</span>
                <span>Waitlist access</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-sm font-medium text-accent-300">
              <Sparkles className="h-4 w-4" />
              Premium waitlist
            </div>
            <p className="text-foreground-300">{item.description}</p>

            {item.pricing?.features && item.pricing.features.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground-100">What is coming</h3>
                <ul className="space-y-2">
                  {item.pricing.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
                      <span className="text-sm text-foreground-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleWaitlistSubmit} className="mt-7 space-y-3">
              <label htmlFor={`waitlist-${item.id}`} className="text-sm font-medium text-foreground-100">
                Email address
              </label>
              <Input
                id={`waitlist-${item.id}`}
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
              />
              {error && <p className="text-sm text-danger-500">{error}</p>}
              {isSubmitted ? (
                <div className="flex items-center gap-2 rounded border border-success-600/30 bg-success-600/10 px-3 py-2 text-sm text-success-500">
                  <CheckCircle2 className="h-4 w-4" />
                  You're on the list. We'll email you when these elements are ready.
                </div>
              ) : (
                <Button type="submit" variant="primary" size="md" icon={<Mail className="h-4 w-4" />} disabled={isSubmitting} isDisabled={isSubmitting}>
                  {isSubmitting ? 'Joining...' : 'Join waitlist'}
                </Button>
              )}
            </form>
          </div>
        </Modal.Body>
      ) : (
        <Modal.Body className='grid h-200 lg:grid-cols-2'>
          <div className='h-full min-h-80 bg-background-600 w-full' />
          <div className="px-6 py-6 space-y-6">
            <p className="text-foreground-300">{item.description}</p>

            {item.pricing?.features && item.pricing.features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground-100 mb-3">Features</h3>
                <ul className="space-y-2">
                  {item.pricing.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-accent-400 mt-1">✓</span>
                      <span className="text-foreground-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {elementNames.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground-100 mb-3">
                  {type === 'element' ? 'Elements' : 'Included Components'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {elementNames.map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1 bg-background-800 text-foreground-300 text-sm rounded-full border border-background-700"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      )}

      <Modal.Footer>
        {showWaitlist && (
          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-sm text-foreground-400">
              No checkout yet. We are collecting early interest before releasing paid content.
            </p>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>
        )}
        {isPremium && !showWaitlist && (
          <>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                window.open(gumroadUrl, '_blank');
              }}
            >
              Purchase on Gumroad
            </Button>
          </>
        )}
        {!isPremium && (
          <div className="flex items-center gap-4 w-full">
            <span className="px-3 py-1.5 bg-background-800 text-foreground-300 text-sm rounded font-medium">
              Free
            </span>
            <p className="text-foreground-400 text-sm flex-1">Copy the installation command to get started</p>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}

// PurchaseModalClient

interface PurchaseModalClientProps {
  children: React.ReactNode;
  type: 'element' | 'starter' | 'section';
}

const ModalContext = React.createContext<{
  selectedItem: PurchaseItem | null;
  openModal: (item: PurchaseItem) => void;
  closeModal: () => void;
} | null>(null);

export function usePurchaseModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('usePurchaseModal must be used within PurchaseModalClient');
  }
  return context;
}

export function PurchaseModalClient({ children, type }: PurchaseModalClientProps) {
  const [selectedItem, setSelectedItem] = React.useState<PurchaseItem | null>(null);

  const openModal = React.useCallback((item: PurchaseItem) => {
    setSelectedItem(item);
  }, []);

  const closeModal = React.useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <ModalContext.Provider value={{ selectedItem, openModal, closeModal }}>
      {children}
      <PurchaseModal
        isOpen={selectedItem !== null}
        item={selectedItem}
        type={type}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  );
}
