export type ControlValue = string | number | boolean;

export type ControlValues = Record<string, ControlValue>;

/** A playground control as authored in a library `interactive/config.ts`. */
export type PlaygroundControl = {
  readonly name: string;
  readonly label: string;
  readonly type: "select" | "toggle" | "text" | "stepper" | "slider";
  readonly options?: readonly { readonly label: string; readonly value: ControlValue }[];
  /** Named slider values outside the numeric range, e.g. Auto Fit. */
  readonly presets?: readonly { readonly label: string; readonly value: ControlValue }[];
  readonly defaultValue?: ControlValue;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  /** Marks the select that picks between an example's variants. */
  readonly switcher?: boolean;
};

/** Finds the select control marked `switcher`, which picks between an example's variants. */
export function findSwitcher<T extends PlaygroundControl>(controls: readonly T[]) {
  return controls.find((control) => control.type === "select" && control.switcher);
}

export function initialControlValues(controls: readonly PlaygroundControl[]): ControlValues {
  return Object.fromEntries(
    controls.map((control) => [
      control.name,
      control.defaultValue ?? control.options?.[0]?.value ?? "",
    ]),
  );
}
