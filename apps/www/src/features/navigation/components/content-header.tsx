"use client";

import { Button } from "ui-lab-components/button";
import { PricingBadge } from "@/features/landing/components/pricing-badge";
import type { PricingInfo } from "@ui-lab-core/library/catalog";
import { FaShop } from "@/shared/icons/fa6";

interface ContentHeaderProps {
  title: string;
  description: string;
  pricing?: PricingInfo;
  preview?: React.ReactNode;
  tags?: string[];
  actions?: React.ReactNode;
  purchaseUrl?: string;
}

export function ContentHeader({
  title,
  description,
  pricing,
  preview,
  tags,
  actions,
  purchaseUrl,
}: ContentHeaderProps) {
  const purchaseAction = purchaseUrl ? (
    <Button icon={{ left: <FaShop /> }} size="md">
      <a href={purchaseUrl} target="_blank" rel="noopener noreferrer">
        Purchase
      </a>
    </Button>
  ) : null;

  return (
    <div className="pt-8">
      <div className="flex items-center gap-4 md:gap-6">
        {preview ? (
          <div className="w-fit shrink-0">
            <div className="flex min-w-90 *:w-full *:min-h-35 items-center justify-center">
              {preview}
            </div>
          </div>
        ) : null}
        <div className="flex relative flex-col gap-3">
          <div className="absolute right-0 top-0 ml-auto">
            {pricing && pricing.price !== null && <PricingBadge price={pricing.price} />}
          </div>
          <div className="flex flex-col pr-8 sm:flex-row items-start justify-start gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-xl font-medium text-foreground-200 flex-1">
                {title}
              </h1>
              <p className="text-foreground-400 max-w-[75ch] text-balance text-base flex-1">
                {description}
              </p>
            </div>
          </div>
          {tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded border border-background-700 bg-background-900 px-2.5 py-1 text-sm text-foreground-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            {purchaseAction || actions ? (
              <div className="flex flex-wrap items-center gap-3">
                {purchaseAction}
                {actions}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
