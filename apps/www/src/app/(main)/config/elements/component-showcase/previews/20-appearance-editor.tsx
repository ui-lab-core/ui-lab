"use client";

import { useState } from "react";
import { Button } from "ui-lab-components/button";
import { Chart } from "ui-lab-components/chart";
import { Color } from "ui-lab-components/color";
import { Flex } from "ui-lab-components/flex";
import { Progress } from "ui-lab-components/progress";
import { Surface, Note } from "./shared";

const initialPreviewPalette = {
  Requests: "rgb(110, 150, 220)",
  Storage: "rgb(157, 135, 207)",
  Automations: "rgb(100, 171, 145)",
};

export default function AppearanceEditor() {
  const [palette, setPalette] = useState(initialPreviewPalette);
  return (
    <Surface
      title="Usage dashboard / Chart colors"
      action={
        <Button
          size="sm"
          variant="ghost"
          disabled={Object.keys(palette).every(
            (key) =>
              palette[key as keyof typeof palette] ===
              initialPreviewPalette[key as keyof typeof palette],
          )}
          onPress={() => setPalette(initialPreviewPalette)}
        >
          Reset
        </Button>
      }
    >
      <Flex direction="column" gap="sm" className="min-w-0">
        {(Object.keys(palette) as (keyof typeof palette)[]).map((name) => (
          <Flex key={name} layout="bar" gap="sm">
            <span>{name}</span>
            <Color
              value={palette[name]}
              onChange={(value) => setPalette((current) => ({ ...current, [name]: value }))}
              format="rgb"
              size="sm"
            >
              <Color.Trigger aria-label={`Edit ${name.toLowerCase()} chart color`} />
            </Color>
          </Flex>
        ))}
      </Flex>
      <Flex
        direction="column"
        gap="md"
        className="min-w-0 rounded-md border border-background-700 p-4"
        aria-label="Live workspace usage preview"
      >
        <Flex layout="bar" gap="sm">
          <strong>Monthly usage</strong>
          <Note small>Resets Oct 1</Note>
        </Flex>
        {(
          [
            { name: "Requests", value: 68, label: "680k / 1M" },
            { name: "Storage", value: 42, label: "42 / 100 GB" },
            { name: "Automations", value: 85, label: "8,500 / 10,000 runs" },
          ] as const
        ).map((metric) => (
          <Flex key={metric.name} direction="column" gap="xs" className="min-w-0">
            <Flex layout="bar" gap="sm" className="text-sm">
              <span>{metric.name}</span>
              <span>{metric.label}</span>
            </Flex>
            <Progress
              value={metric.value}
              aria-label={metric.name}
              aria-valuetext={metric.label}
              styles={{ range: { backgroundColor: palette[metric.name] } }}
            />
          </Flex>
        ))}
      </Flex>
      <Note small>Colors apply to this preview only, not the page theme.</Note>
    </Surface>
  );
}

