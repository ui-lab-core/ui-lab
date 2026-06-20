import type * as React from "react";

export function asElementProps<T extends keyof React.JSX.IntrinsicElements>(
  props: unknown
): React.ComponentPropsWithoutRef<T> {
  return props as React.ComponentPropsWithoutRef<T>;
}

/**
 * react-aria's useRadio/useToggle/useSwitch hooks warn with the generic,
 * un-attributed message "If you do not provide children, you must specify
 * an aria-label for accessibility" since they never receive `children` and
 * have no way to identify the calling component. Call this before invoking
 * those hooks to emit an identifiable warning instead, and fall back to
 * `fallbackLabel` so the underlying hook stays silent.
 */
export function resolveAccessibleLabel(
  componentName: string,
  ariaLabel: string | undefined,
  fallbackLabel: string
): string | undefined {
  if (ariaLabel) return ariaLabel;

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[ui-lab] ${componentName} is missing an accessible name. Pass \`label\` or \`aria-label\` to identify it for screen readers.`
    );
  }

  return fallbackLabel;
}
