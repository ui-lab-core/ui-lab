"use client";
import { Skeleton } from "ui-lab-components";

/**
 * The placeholder a preview box shows while its demo loads.
 *
 * Deliberately one plain block: the box's height is already the entry's real
 * height, so all the placeholder has to do is fill it. Anything more detailed
 * would be a guess at the demo's own layout and would read as a second, wrong
 * layout in the moment before the real one arrives.
 */
export function PreviewSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      role="status"
      data-skeleton-animate
      // Absolute so it fills the height the entry reserved rather than pushing
      // a height of its own.
      className="absolute inset-0 p-4"
    >
      <Skeleton w="100%" h="100%" color="background-900" className="rounded-md" />
      <span className="sr-only">Loading interactive preview</span>
    </div>
  );
}
