"use client";

import { toast } from "ui-lab-components/toast";

export function canOpenPayments(): boolean {
  toast({
    title: "Hang tight, we're still setting up shop",
    variant: "info",
  });
  return false;
}
