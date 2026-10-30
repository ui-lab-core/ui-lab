"use client";

import { Group } from "ui-lab-components/group";
import { Select } from "ui-lab-components/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ControlValue, PlaygroundControl } from "./controls";

/** Prev/next bar with an indexed select, overlaid at the bottom of a preview. */
export function VariantSwitcher({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl;
  value: ControlValue | undefined;
  onChange: (value: ControlValue) => void;
}) {
  const options = control.options ?? [];
  const index = options.findIndex((option) => String(option.value) === String(value));

  const step = (delta: number) => {
    if (options.length === 0) return;
    const next = (index + delta + options.length) % options.length;
    onChange(options[next].value);
  };

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
      <Group spacing="none" className="w-max">
        <Group.Button
          aria-label={`Previous ${control.label.toLowerCase()}`}
          onClick={() => step(-1)}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft size={14} />
        </Group.Button>
        <Group.Select
          aria-label={control.label}
          className="w-44"
          onSelectionChange={(key) => {
            const option = options.find((entry) => String(entry.value) === String(key));
            if (option) onChange(option.value);
          }}
          selectedKey={String(value ?? "")}
        >
          <Select.Trigger>
            <span className="flex items-center gap-2">
              <span className="text-foreground-400">
                {index + 1}/{options.length}
              </span>
              <Select.Value />
            </span>
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              {options.map((option) => (
                <Select.Item key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.List>
          </Select.Content>
        </Group.Select>
        <Group.Button
          aria-label={`Next ${control.label.toLowerCase()}`}
          onClick={() => step(1)}
          size="icon"
          variant="ghost"
        >
          <ChevronRight size={14} />
        </Group.Button>
      </Group>
    </div>
  );
}
