"use client";

import React from "react";
import { Copy } from "../internal/icons/copy";
import { Check } from "../internal/icons/check";
import { Input } from "../Input";
import { Select } from "../Select";
import { cn } from "@/lib/cn";
import css from "./Color.module.css";
import { isValidColor } from "./color-utils";

interface ColorInputProps {
  value: string;
  format: "hex" | "rgb";
  onFormatChange?: (format: "hex" | "rgb") => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showPreview?: boolean;
  previewColor?: string;
  groupClassName?: string;
  inputClassName?: string;
  formatClassName?: string;
  previewClassName?: string;
}

export const ColorInput = React.forwardRef<HTMLDivElement, ColorInputProps>(
  (
    {
      value,
      format,
      onFormatChange,
      onValueChange,
      disabled,
      size = "md",
      showPreview = false,
      previewColor,
      groupClassName,
      inputClassName,
      formatClassName,
      previewClassName,
    },
    ref,
  ) => {
    const inputValue = value;
    const copyIconSize = 14 * (size === "lg" ? 1 : size === "sm" ? 0.8 : 0.9);
    const [copyStatus, setCopyStatus] = React.useState<"idle" | "copied" | "error">("idle");

    React.useEffect(() => {
      setCopyStatus("idle");
    }, [value, format]);

    React.useEffect(() => {
      if (copyStatus !== "copied") return;
      const timeout = setTimeout(() => setCopyStatus("idle"), 2000);
      return () => clearTimeout(timeout);
    }, [copyStatus]);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(inputValue);
        setCopyStatus("copied");
      } catch {
        setCopyStatus("error");
      }
    };

    const copyLabel = copyStatus === "copied"
      ? "Copied to clipboard"
      : copyStatus === "error"
        ? "Copy failed. Try again"
        : "Copy color value";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (isValidColor(newValue)) {
        onValueChange?.(newValue);
      }
    };

    const handleFormatChange = (newFormat: "hex" | "rgb") => {
      onFormatChange?.(newFormat);
    };

    return (
      <div
        ref={ref}
        data-disabled={disabled || undefined}
        data-size={size}
        data-slot="input.group"
        className={cn("input-group", "w-full", css["input-group"], groupClassName)}
      >
        <Select
          selectedKey={format}
          defaultValue={format === "hex" ? "Hex" : "RGB"}
          onSelectionChange={(key: React.Key) => {
            if (key) {
              handleFormatChange(key as "hex" | "rgb");
            }
          }}
          disabled={disabled}
          className={cn("format", css.format, formatClassName)}
          data-slot="input.format"
        >
          <Select.Trigger aria-label="Color format">
            <Select.Value placeholder="Format" />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="hex" textValue="Hex">
                Hex
              </Select.Item>
              <Select.Item value="rgb" textValue="RGB">
                RGB
              </Select.Item>
            </Select.List>
          </Select.Content>
        </Select>
        {showPreview && (
          <div
            className={cn("swatch", css["preview-swatch"], previewClassName)}
            data-slot="input.previewSwatch"
            data-size={size}
            data-disabled={disabled || undefined}
            style={
              {
                "--preview-color": previewColor || "transparent",
              } as React.CSSProperties
            }
            aria-label={`Color preview: ${value}`}
          />
        )}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={format === "hex" ? "#000000" : "rgb(0, 0, 0)"}
          aria-label="Color input"
          className={cn("input", css.input, inputClassName)}
          data-slot="input.input"
          actions={[{
            icon: copyStatus === "copied" ? <Check size={copyIconSize} /> : <Copy size={copyIconSize} />,
            title: copyLabel,
            onClick: handleCopy,
          }]}
        />
      </div>
    );
  },
);

ColorInput.displayName = "Color.Input";
