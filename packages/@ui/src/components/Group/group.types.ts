import type * as React from "react";
import type { Style } from "@/lib/cn";
import type { StylesProp } from "@/lib/styles";
import type { ButtonProps } from "../Button";
import type { ExpandProps } from "../Expand";
import type { InputProps } from "../Input";
import type { SelectProps } from "../Select";

/** Axis that Group arranges its owned items along. */
export type GroupOrientation = "horizontal" | "vertical";

/** Named gap step applied between Group's owned items. */
export type GroupSpacing = "none" | "xs" | "sm";

/**
 * Style slots for the wrapper Group renders around each owned child.
 * Every slot targets the same kind of element; the positional and role slots
 * apply only to the wrappers that currently match.
 */
export interface GroupItemStyleSlots {
  /** Every item wrapper Group renders around a child. */
  root?: Style;
  /** The first item wrapper in the group. */
  first?: Style;
  /** The last item wrapper in the group. */
  last?: Style;
  /** An item wrapper whose child is a separator. */
  divider?: Style;
  /** An item wrapper that stretches because its child requests growth. */
  grow?: Style;
}

/** Keyed class names for one Group item wrapper's anatomy. */
export type GroupItemStylesProp = StylesProp<GroupItemStyleSlots>;

/** Names of the stable Group item wrapper style slots. */
export type GroupItemStyleSlot = keyof GroupItemStyleSlots;

/**
 * Shared or keyed styles for Group item wrappers. A shared class applies to
 * every wrapper; use the keyed form to address one positional or role slot.
 */
export type GroupItemStyleValue = Style | GroupItemStyleSlots;

/** Class-based slots for the Group root and its stable compound anatomy. */
export interface GroupStyleSlots {
  /** The role="group" root element. */
  root?: Style;
  /** The shared or keyed anatomy applied to every item wrapper. */
  item?: GroupItemStyleValue;
  /** The Group.Button surface. */
  button?: Style;
  /** The Group.Input surface that wraps the nested Input. */
  input?: Style;
  /** The Group.Select surface. */
  select?: Style;
  /** The Group.Expand surface that wraps the nested Expand. */
  expand?: Style;
}

/** Keyed class names for Group anatomy. */
export type GroupStylesProp = StylesProp<GroupStyleSlots>;

/** Names of the stable Group root and compound style slots. */
export type GroupStyleSlot = keyof GroupStyleSlots;

/** Props for the Group root element. */
export interface GroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Adds a global variant class to the root, every item wrapper, and every
   * grouped part surface, and publishes it as data-variant. Group.Button uses
   * it as its Button variant unless the button sets its own.
   * @category Core
   */
  variant?: string;
  /**
   * Selects the axis items are arranged along and the arrow keys that move
   * focus between them. Nested Dividers adopt the perpendicular orientation.
   * @category Core
   * @default "horizontal"
   * @typeDoc GroupOrientation
   */
  orientation?: GroupOrientation;
  /**
   * Selects the gap between items. "none" joins the items into one connected
   * surface with only the outer corners rounded; "xs" and "sm" separate them
   * and round every item.
   * @category Core
   * @default "none"
   * @typeDoc GroupSpacing
   */
  spacing?: GroupSpacing;
  /**
   * Disables every grouped part that does not set its own disabled value, and
   * marks the root with aria-disabled and data-disabled.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the Group.Button whose value matches as selected. Supplying it turns
   * the group into a single-selection toggle group.
   * @category Core
   */
  value?: string;
  /**
   * Receives the value of a pressed Group.Button that declares one. Group holds
   * no internal selection state, so the consumer owns the value.
   * @category Events
   */
  onChange?: (value: string) => void;
  /**
   * Applies class-based styles to Group anatomy. Use className for the
   * conventional root class.
   * @category Styling
   * @typeDoc GroupStylesProp
   */
  styles?: GroupStylesProp;
}

/** Props for the Button rendered by Group.Button. */
export interface GroupButtonProps extends ButtonProps {
  /**
   * Publishes data-selected="true" for visual selection when the group is not
   * driving selection through value. It does not change the button's ARIA
   * semantics.
   * @category Core
   * @default false
   */
  active?: boolean;
  /**
   * Identifies this button within the group's toggle behavior. When the Group
   * has a value, a matching value marks the button selected; pressing it calls
   * the Group's onChange with this value.
   * @category Core
   */
  value?: string;
}

/** Props forwarded to the Input rendered by Group.Input. */
export interface GroupInputProps extends InputProps {}

/** Props forwarded to the Select rendered by Group.Select. */
export interface GroupSelectProps extends SelectProps {}

/** Props forwarded to the Expand rendered by Group.Expand. */
export interface GroupExpandProps extends ExpandProps {}
