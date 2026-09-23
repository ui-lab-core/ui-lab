"use client";

import { useState } from "react";
import { Color } from "ui-lab-components/color";
import { Surface } from "./shared";

export default function ColorPickerShowcase() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <Surface title="Color picker">
      <Color value={color} onChange={setColor} size="md" />
    </Surface>
  );
}

