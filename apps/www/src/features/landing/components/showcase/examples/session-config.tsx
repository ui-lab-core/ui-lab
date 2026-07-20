"use client";

import { useState } from "react";
import { Button, Group, Divider, Select, Searchable } from "ui-lab-components";
import {
  FaClock,
  FaMicrochip,
  FaMemory,
  FaMinus,
  FaPlus,
  FaBoltLightning,
  FaLayerGroup,
} from "@/shared/icons/fa6";
import { SiGnubash } from "@/shared/icons/si";
import type { ShowcasePanelProps } from "./types";

const gpus = [
  { value: "b300", label: "NVIDIA B300", memory: "288 GB HBM3E", rate: 4.25 },
  { value: "b200", label: "NVIDIA B200", memory: "180 GB HBM3E", rate: 3.85 },
  { value: "h200", label: "NVIDIA H200", memory: "141 GB HBM3E", rate: 2.95 },
  { value: "h100", label: "NVIDIA H100", memory: "80 GB HBM3", rate: 2.45 },
  {
    value: "rtx-pro-6000",
    label: "NVIDIA RTX PRO 6000",
    memory: "96 GB GDDR7",
    rate: 1.55,
  },
  { value: "l40s", label: "NVIDIA L40S", memory: "48 GB GDDR6", rate: 1.15 },
  { value: "l4", label: "NVIDIA L4", memory: "24 GB GDDR6", rate: 0.65 },
  { value: "a100", label: "NVIDIA A100", memory: "80 GB HBM2e", rate: 1.85 },
  {
    value: "mi355x",
    label: "AMD Instinct MI355X",
    memory: "288 GB HBM3E",
    rate: 3.55,
  },
  {
    value: "mi350x",
    label: "AMD Instinct MI350X",
    memory: "288 GB HBM3E",
    rate: 3.25,
  },
  {
    value: "mi325x",
    label: "AMD Instinct MI325X",
    memory: "256 GB HBM3E",
    rate: 2.65,
  },
  {
    value: "mi300x",
    label: "AMD Instinct MI300X",
    memory: "192 GB HBM3",
    rate: 2.15,
  },
];

function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <Group spacing="none" className="h-9">
      <Group.Button
        variant="secondary"
        size="sm"
        isDisabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <FaMinus size={10} />
      </Group.Button>
      <Divider />
      <Group.Input
        type="number"
        hide-controls
        value={value}
        variant="default"
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className="w-12"
      />
      <Divider />
      <Group.Button
        variant="secondary"
        size="sm"
        isDisabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <FaPlus size={10} />
      </Group.Button>
    </Group>
  );
}

export function SessionConfigPanel({ height }: ShowcasePanelProps) {
  const [duration, setDuration] = useState(1);
  const [cores, setCores] = useState(2);
  const [memory, setMemory] = useState(4);
  const [gpu, setGpu] = useState("l4");
  const [image, setImage] = useState("pytorch");

  const selectedGpu = gpus.find((item) => item.value === gpu) ?? gpus[0];
  const cost = (
    duration *
    (cores * 0.014 + memory * 0.007 + selectedGpu.rate)
  ).toFixed(2);

  const rows = [
    {
      icon: <FaClock className="text-foreground-300" size={20} />,
      label: "Duration",
      desc: "hrs",
      value: duration,
      onChange: setDuration,
      min: 1,
      max: 8,
      step: 1,
    },
    {
      icon: <FaMicrochip className="text-foreground-300" size={20} />,
      label: "CPU Cores",
      desc: "Virtual processors",
      value: cores,
      onChange: setCores,
      min: 1,
      max: 16,
      step: 1,
    },
    {
      icon: <FaMemory className="text-foreground-300" size={20} />,
      label: "Memory",
      desc: "GB RAM",
      value: memory,
      onChange: setMemory,
      min: 2,
      max: 64,
      step: 2,
    },
  ];

  return (
    <div
      className="flex w-full flex-col overflow-hidden bg-background-200"
      style={{ height }}
    >
      <div className="flex items-center gap-3 border-b border-background-700 px-4 py-3">
        <div className="flex size-9 items-center justify-center rounded-sm bg-background-300">
          <SiGnubash size={19} />
        </div>
        <Select selectedKey={image} onSelectionChange={(value) => setImage(String(value))}>
          <Select.Trigger variant="ghost" aria-label="Environment image">
            {image === "pytorch" ? "PyTorch 2.8" : image === "cuda" ? "CUDA 13.0" : "Ubuntu 24.04"}
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="pytorch" textValue="PyTorch 2.8">PyTorch 2.8</Select.Item>
              <Select.Item value="cuda" textValue="CUDA 13.0">CUDA 13.0</Select.Item>
              <Select.Item value="ubuntu" textValue="Ubuntu 24.04">Ubuntu 24.04</Select.Item>
            </Select.List>
          </Select.Content>
        </Select>
        <span className="ml-auto text-sm text-foreground-500">us-east-1</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((row, i) => (
          <div key={row.label}>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-sm bg-background-300 flex items-center justify-center shrink-0">
                  {row.icon}
                </div>
                <div>
                  <div className="text-sm text-foreground-100">{row.label}</div>
                  <div className="text-sm text-foreground-500">{row.desc}</div>
                </div>
              </div>
              <Stepper
                value={row.value}
                onChange={row.onChange}
                min={row.min}
                max={row.max}
                step={row.step}
              />
            </div>
            {i < rows.length - 1 && <Divider spacing="none" size="sm" />}
          </div>
        ))}
        <Divider spacing="none" size="sm" />
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-sm bg-background-300 flex items-center justify-center shrink-0">
              <FaLayerGroup className="text-foreground-300" size={20} />
            </div>
            <div>
              <div className="text-sm text-foreground-100">GPU</div>
              <div className="text-sm text-foreground-500">Accelerator</div>
            </div>
          </div>
          <Select
            selectedKey={gpu}
            label={`${selectedGpu.label} · ${selectedGpu.memory}`}
            onSelectionChange={(value) => setGpu(String(value))}
            maxItems={5}
          >
            <Select.Trigger aria-label="GPU" className="w-full">
              <Select.Value />
            </Select.Trigger>
            <Searchable.Content
              searchPlaceholder="Search by model or memory..."
              emptyContent="No GPUs found."
            >
              {gpus.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  textValue={`${item.label} · ${item.memory}`}
                  description={item.memory}
                >
                  {item.label}
                </Select.Item>
              ))}
            </Searchable.Content>
          </Select>
        </div>
      </div>

      <div className="px-4 py-3.5 border-t border-background-700 flex items-center justify-between">
        <div>
          <div className="text-sm text-foreground-500">{duration}h session</div>
          <div className="font-semibold text-foreground-100">${cost}</div>
        </div>
        <Button variant="primary" icon={{ left: <FaBoltLightning /> }}>Start</Button>
      </div>
    </div>
  );
}
