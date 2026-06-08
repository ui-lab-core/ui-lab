"use client";

import { useState } from "react";
import { Button } from "ui-lab-components";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onPress={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      variant="outline"
      size="sm"
    >
      {copied ? "Copied!" : label}
    </Button>
  );
}
