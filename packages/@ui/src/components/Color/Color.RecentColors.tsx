"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getRecentColors } from "./color-utils";
import css from "./Color.module.css";

interface ColorRecentColorsProps {
  /** Called when the user clicks a recent color swatch */
  onSelect?: (color: string) => void;
  /** Disables all swatch buttons */
  disabled?: boolean;
  /** Size of the recent color swatches */
  size?: "sm" | "md" | "lg";
  /** Additional CSS class names */
  className?: string;
  swatchClassName?: string;
}

/** Palette of recently used colors for quick re-selection */
export const ColorRecentColors = React.forwardRef<HTMLDivElement, ColorRecentColorsProps>(
  ({ onSelect, disabled, size = "md", className, swatchClassName }, ref) => {
    const [recentColors, setRecentColors] = useState<string[]>([]);

    useEffect(() => {
      // Load recent colors on mount
      setRecentColors(getRecentColors());
    }, []);

    if (recentColors.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("recent-colors", css["recent-colors"], className)}
        data-slot="recentColors.root"
        data-size={size}
        role="group"
        aria-label="Recent colors"
      >
        {recentColors.map((color, index) => (
          <button
            type="button"
            key={`${color}-${index}`}
            className={cn("item", "recent-color-swatch", css["recent-color-swatch"], swatchClassName)}
            data-slot="recentColors.swatch"
            style={{ backgroundColor: color }}
            onClick={() => onSelect?.(color)}
            disabled={disabled}
            data-disabled={disabled || undefined}
            aria-label={`Recent color ${color}`}
            title={color}
          />
        ))}
      </div>
    );
  },
);

ColorRecentColors.displayName = "Color.RecentColors";
