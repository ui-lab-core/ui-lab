'use client';

import { useState } from 'react';
import { Button } from 'ui-lab-components/button';
import { FaCheck, FaCopy } from '@/shared/icons/fa6';

export function ExampleReference({ id, level = 3 }: { id: string; level?: 2 | 3 }) {
  const [copied, setCopied] = useState(false);
  const Heading = level === 2 ? 'strong' : 'h2';

  const copy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group flex items-center gap-1">
      <Heading className="text-md text-foreground-200">{id}</Heading>
      <Button
        aria-label={copied ? `${id} copied` : `Copy ${id}`}
        className="size-7 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        onPress={() => void copy()}
        size="icon"
        variant="ghost"
      >
        {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
      </Button>
    </div>
  );
}
