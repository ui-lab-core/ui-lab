"use client";

import { useId } from "react";
import { Group } from "ui-lab-components/group";
import { Input } from "ui-lab-components/input";
import { Scroll } from "ui-lab-components/scroll";
import { Select } from "ui-lab-components/select";
import { Slider } from "ui-lab-components/slider";
import { Switch } from "ui-lab-components/switch";
import type { ControlValue, ControlValues, PlaygroundControl } from "./controls";

/**
 * The controls panel beside a playground preview. Beside the preview it scrolls
 * within the preview's height instead of stretching the card; stacked under it,
 * it grows to fit.
 */
export function PlaygroundForm({
  controls,
  values,
  onChange,
}: {
  controls: readonly PlaygroundControl[];
  values: ControlValues;
  onChange: (name: string, value: ControlValue) => void;
}) {
  return (
    <div className="relative min-h-0 w-full border-t border-background-700 md:w-auto md:border-l md:border-t-0">
      <Scroll className="md:absolute md:inset-0" padding-y={0}>
        <div className="space-y-3 py-3 pl-3 pr-4">
          {controls.map((control) =>
            control.type === "slider" ? (
              <SliderControl
                control={control}
                key={control.name}
                onChange={(value) => onChange(control.name, value)}
                value={values[control.name]}
              />
            ) : (
              <label
                className="flex flex-col gap-2 text-xs font-medium text-foreground-400"
                key={control.name}
              >
                <span>{control.label}</span>
                {control.type === "select" ? (
                  <Select
                    className="w-full"
                    label={
                      control.options?.find((option) => option.value === values[control.name])
                        ?.label
                    }
                    onSelectionChange={(key) => {
                      const option = control.options?.find(
                        (entry) => String(entry.value) === String(key),
                      );
                      onChange(control.name, option?.value ?? String(key));
                    }}
                    selectedKey={String(values[control.name] ?? "")}
                  >
                    <Select.Trigger className="w-full">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.List>
                        {control.options?.map((option) => (
                          <Select.Item key={String(option.value)} value={String(option.value)}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Content>
                  </Select>
                ) : control.type === "toggle" ? (
                  <span className="flex min-h-9 items-center">
                    <Switch
                      aria-label={control.label}
                      onChange={(checked) => onChange(control.name, checked)}
                      size="sm"
                      selected={Boolean(values[control.name])}
                    />
                  </span>
                ) : control.type === "stepper" ? (
                  <Input
                    className="w-full"
                    max={control.max}
                    min={control.min}
                    onChange={(event) => onChange(control.name, Number(event.target.value))}
                    step={control.step}
                    type="number"
                    value={Number(values[control.name] ?? 0)}
                    variant="default"
                  />
                ) : (
                  <Input
                    className="w-full"
                    onChange={(event) => onChange(control.name, event.target.value)}
                    value={String(values[control.name] ?? "")}
                    variant="default"
                  />
                )}
              </label>
            ),
          )}
        </div>
      </Scroll>
    </div>
  );
}

/**
 * A range or token-scale slider. With `options` the track snaps between the
 * stops; otherwise it spans min..max and any `presets` sit below it as a
 * segmented Group.
 * An active preset parks the thumb (dimmed) until the track is dragged again.
 */
function SliderControl({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl;
  value: ControlValue | undefined;
  onChange: (value: ControlValue) => void;
}) {
  const labelId = useId();
  const { options, presets } = control;
  const preset = presets?.find((option) => String(option.value) === String(value));
  const index = options
    ? Math.max(
        0,
        options.findIndex((option) => String(option.value) === String(value)),
      )
    : 0;
  const fallback =
    typeof control.defaultValue === "number" ? control.defaultValue : (control.min ?? 0);
  const position = options ? index : typeof value === "number" ? value : fallback;
  const display = options ? options[index]?.label : preset ? preset.label : String(position);

  return (
    <div className="flex flex-col gap-2 text-xs font-medium text-foreground-400">
      <span className="flex items-center justify-between gap-3">
        <span id={labelId}>{control.label}</span>
        <span className="tabular-nums text-foreground-300">{display}</span>
      </span>
      <span className="flex min-h-9 items-center">
        <Slider
          aria-labelledby={labelId}
          className={preset ? "w-full opacity-50" : "w-full"}
          max={options ? options.length - 1 : control.max}
          min={options ? 0 : control.min}
          onValueChange={([next]) => onChange(options ? (options[next]?.value ?? "") : next)}
          step={options ? 1 : control.step}
          value={position}
        />
      </span>
      {presets?.length ? (
        <Group
          aria-label={`${control.label} presets`}
          className="w-full"
          onChange={(next) => {
            const option = presets.find((entry) => String(entry.value) === next);
            if (option) onChange(option === preset ? fallback : option.value);
          }}
          spacing="sm"
          value={preset ? String(preset.value) : ""}
        >
          {presets.map((option) => (
            <Group.Button
              className="flex-1"
              key={String(option.value)}
              size="sm"
              value={String(option.value)}
              variant="ghost"
            >
              {option.label}
            </Group.Button>
          ))}
        </Group>
      ) : null}
    </div>
  );
}
