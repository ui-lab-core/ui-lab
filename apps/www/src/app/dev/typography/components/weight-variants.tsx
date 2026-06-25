"use client";

import { useTypographyPlayground } from "../context";

const WEIGHT_VARIANTS = [
  ["font-bold", "Bold - 700"],
  ["font-semibold", "Semibold - 600"],
  ["font-medium", "Medium - 500"],
  ["font-normal", "Regular - 400"],
] as const;

export function WeightVariants() {
  const { activeBodyPreviewStyle } = useTypographyPlayground();

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-foreground-400">Weight Variants</div>
      <div className="space-y-3" style={activeBodyPreviewStyle}>
        {WEIGHT_VARIANTS.map(([className, label]) => (
          <div key={className}>
            <div className={`${className} text-foreground-200`}>{label}</div>
            <p className="text-foreground-300">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
