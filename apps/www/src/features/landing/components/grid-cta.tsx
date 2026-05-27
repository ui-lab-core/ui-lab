'use client';
import React, { useState, useEffect } from 'react';
import { Divider, Group } from 'ui-lab-components';
import { Bell, CheckCircle2, Mail } from 'lucide-react';

type ContentType = 'packages' | 'starters' | 'sections' | 'patterns' | 'elements';

interface GridCTAProps {
  contentType: ContentType;
  onSubmit?: (email: string) => void;
}

interface StoredSubmission {
  email: string;
  timestamp: number;
  source: ContentType;
}

export function GridCTA({ contentType, onSubmit }: GridCTAProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const storageKey = `ui-lab-newsletter-${contentType}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const submission: StoredSubmission = JSON.parse(stored);
        setIsSubmitted(true);
        setEmail(submission.email);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [contentType, storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    const input = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
    if (!input?.validity.valid) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission: StoredSubmission = {
        email,
        timestamp: Date.now(),
        source: contentType,
      };

      localStorage.setItem(storageKey, JSON.stringify(submission));
      setIsSubmitted(true);

      onSubmit?.(email);
    } catch (err) {
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        setError('Unable to save subscription. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentTypeLabel = contentType.charAt(0).toUpperCase() + contentType.slice(1);

  return (
    <div className="flex min-h-[140px] w-full items-center justify-between gap-6 rounded border border-background-700 bg-background-900 px-5 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-background-700 bg-background-800 text-accent-400">
          <Bell className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground-50">
            More {contentTypeLabel.toLowerCase()} are in development
          </h3>
          <p className="mt-1 text-sm text-foreground-400">
            Be notified when we add new content.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-success-500">
          <CheckCircle2 className="h-4 w-4" />
          <span>Thanks. We'll keep you updated.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md shrink-0">
          <Group orientation="horizontal" className="w-full">
            <Group.Input
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                setError('');
              }}
              disabled={isSubmitting}
              aria-label="Email address"
            />
            <Divider orientation='vertical' />
            <Group.Button type="submit" disabled={isSubmitting} isDisabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Group.Button>
          </Group>
          {error && <div className="mt-2 text-sm text-danger-500">{error}</div>}
        </form>
      )}
    </div>
  );
}
