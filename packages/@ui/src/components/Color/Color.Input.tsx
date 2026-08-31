"use client";

import React from "react";
import { Group } from "../Group";
import { Select } from "../Select";
import { cn } from "@/lib/utils";
import css from "./Color.module.css";
import { isValidColor } from "./color-utils";
import { Divider } from "../Divider";

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
      <Group
        ref={ref}
        disabled={disabled}
        data-size={size}
        data-slot="input.group"
        className={cn("input-group", "w-full", css["input-group"], groupClassName)}
      >
        <Group.Input
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={format === "hex" ? "#000000" : "rgb(0, 0, 0)"}
          aria-label="Color input"
          className={cn("input", css.input, inputClassName)}
          data-slot="input.input"
        />
        <Divider />
        <Group.Select
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
        </Group.Select>
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
      </Group>
    );
  },
);

ColorInput.displayName = "Color.Input";
