import * as React from "react";
import type { Key } from "react-aria";
import type { ItemData } from "../../utils/list-navigation";
import type { StylesProp } from "@/lib/styles";
import type { Style } from "@/lib/utils";
import type { ButtonProps } from "../Button";
import type { ListActionDef } from "../List";

/**
 * How many items a Menu may select at once.
 * @typeDoc MenuSelectionMode
 */
export type MenuSelectionMode = "none" | "single" | "multiple";

/**
 * How the Menu is opened and where its panel is anchored.
 * @typeDoc MenuType
 */
export type MenuType = "context-menu" | "pop-over";

export interface MenuItemExtras {
  onSelect?: () => void;
  isSubmenuTrigger?: boolean;
}

export interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: MenuType;
  close: () => void;
  selectionMode: MenuSelectionMode;
  selectedKeys: Set<Key>;
  toggleSelection: (key: Key) => void;
  items: ItemData[];
  registerItem: (
    key: Key,
    textValue: string,
    isDisabled?: boolean,
    onSelect?: () => void,
    isSubmenuTrigger?: boolean,
  ) => void;
  unregisterItem: (key: Key) => void;
  focusedKey: Key | null;
  setFocusedKey: React.Dispatch<React.SetStateAction<Key | null>>;
  navigateToNextItem: () => void;
  navigateToPrevItem: () => void;
  selectFocusedItem: () => void;
  isFocusedItemSubmenu: () => boolean;
  radioGroups: Map<string, Key | null>;
  setRadioGroupValue: (groupName: string, value: Key | null) => void;
  getRadioGroupValue: (groupName: string) => Key | null;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  mouseMoveDetectedRef: React.MutableRefObject<boolean>;
  clickPositionRef: React.MutableRefObject<{ x: number; y: number }>;
}

export interface MenuSubmenuContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  submenuLevel: number;
  items: ItemData[];
  focusedKey: Key | null;
  setFocusedKey: React.Dispatch<React.SetStateAction<Key | null>>;
  navigateToNextItem: () => void;
  navigateToPrevItem: () => void;
  registerItem: (
    key: Key,
    textValue: string,
    isDisabled?: boolean,
    onSelect?: () => void,
    isSubmenuTrigger?: boolean,
  ) => void;
  unregisterItem: (key: Key) => void;
  selectFocusedItem: () => void;
  isFocusedItemSubmenu: () => boolean;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  closeTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  mouseMoveDetectedRef: React.MutableRefObject<boolean>;
  triggerKey: Key | null;
  setTriggerKey: React.Dispatch<React.SetStateAction<Key | null>>;
  parentSubmenuContext: MenuSubmenuContextValue | null;
}

export interface RadioGroupContextValue {
  name: string;
  value: Key | null;
  onValueChange: (value: Key) => void;
}

export interface MenuProps extends React.PropsWithChildren {
  /**
   * Controls the open state. Supplying it makes the Menu controlled; pair it with onOpenChange to
   * keep the panel responsive to the trigger, Escape, and outside clicks.
   * @category Core
   */
  open?: boolean;

  /**
   * Sets the initial open state when the Menu is uncontrolled.
   * @category Core
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Runs whenever the Menu opens or closes, including dismissal by Escape, an outside click, or an
   * item selection.
   * @category Events
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Selects how the Menu is opened: context-menu opens at the pointer on right-click, pop-over
   * opens from the trigger on click or Enter/Space.
   * @category Core
   * @default "context-menu"
   * @typeDoc MenuType
   */
  type?: MenuType;

  /**
   * Enables item selection. With single or multiple, Menu.Item renders as a radio or checkbox menu
   * item, publishes data-selected, and reports through onSelectionChange. Multiple keeps the panel
   * open after each toggle.
   * @category Selection
   * @default "none"
   * @typeDoc MenuSelectionMode
   */
  selectionMode?: MenuSelectionMode;

  /**
   * Controls the set of selected item keys. Supplying it makes selection controlled; update it from
   * onSelectionChange.
   * @category Selection
   */
  selectedKeys?: Set<Key>;

  /**
   * Sets the initially selected item keys when selection is uncontrolled.
   * @category Selection
   * @default new Set()
   */
  defaultSelectedKeys?: Set<Key>;

  /**
   * Runs with the next selected key set whenever a selectable item is activated. It is not called
   * while selectionMode is none.
   * @category Events
   */
  onSelectionChange?: (keys: Set<Key>) => void;
}

/**
 * Element rendered by Menu.Trigger.
 * @typeDoc MenuTriggerAs
 */
export type MenuTriggerAs = "button" | "span" | "child";

/** Class-based slots for the Menu.Trigger anatomy. */
export interface MenuTriggerStyleSlots {
  /** Styles the rendered trigger element. */
  root?: Style;
}

/** Keyed class names for Menu.Trigger anatomy. */
export type MenuTriggerStylesProp = StylesProp<MenuTriggerStyleSlots>;

export interface MenuTriggerProps
  extends
    Omit<ButtonProps, "children" | "className" | "disabled" | "styles">,
    React.PropsWithChildren {
  /**
   * Prevents the trigger from opening the Menu and publishes data-disabled. The button branch also
   * receives the native disabled attribute.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
   */
  disabled?: boolean;

  /**
   * Chooses the rendered element. child clones the single React element child and merges the
   * trigger props into it. Defaults to button for pop-over menus, span for context menus, and child
   * when the only child is already a Button, button, or anchor.
   * @category Core
   * @typeDoc MenuTriggerAs
   */
  as?: MenuTriggerAs;

  /**
   * Adds classes to the trigger element after its conventional and module classes and before the
   * resolved styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.Trigger anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuTriggerStyleSlots
   */
  styles?: MenuTriggerStylesProp;
}

export interface MenuPortalProps extends React.PropsWithChildren {
  /**
   * Renders Menu.Content and Menu.SubContent into this element instead of document.body. Every
   * panel below the provider uses it.
   * @category Overlay
   * @default document.body
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element
   */
  container?: HTMLElement;
}

/** Class-based slots for the option-list anatomy rendered inside Menu.Content. */
export interface MenuContentListStyles {
  /** Styles the element that groups the rendered menu items. */
  root?: Style;

  /** Styles the padding wrapper around the item list. */
  padding?: Style;
}

/** Class-based slots for the Menu.Content anatomy. */
export interface MenuContentStyleSlots {
  /** Styles the menu panel. */
  root?: Style;

  /** Styles the positioned floating overlay that holds the panel. */
  overlay?: Style;

  /** Styles every list part, or individually styles list.root and list.padding. */
  list?: Style | MenuContentListStyles;
}

/** Keyed class names for Menu.Content anatomy. */
export type MenuContentStylesProp = StylesProp<MenuContentStyleSlots>;

export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Adds classes to the menu panel after its conventional and module classes and before the
   * resolved styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Sets the preferred side of the trigger for a pop-over menu. Context menus are positioned at the
   * pointer instead and ignore it.
   * @category Overlay
   * @default "bottom"
   */
  side?: "top" | "bottom" | "left" | "right";

  /**
   * Aligns the panel against the trigger along the chosen side for a pop-over menu. Context menus
   * ignore it.
   * @category Overlay
   * @default "start"
   */
  align?: "start" | "center" | "end";

  /**
   * Runs after Escape closes the panel. The Menu has already closed when it is called.
   * @category Events
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Sets the gap in pixels between the trigger and the panel along the resolved side.
   * @category Overlay
   * @default 6
   */
  offset?: number;

  /**
   * Applies class-based styles to Menu.Content anatomy: root, overlay, list.root, and list.padding.
   * Use className for the conventional root class.
   * @category Styling
   * @typeDoc MenuContentStyleSlots
   */
  styles?: MenuContentStylesProp;
}

/** Class-based slots for the Menu.Group anatomy. */
export interface MenuGroupStyleSlots {
  /** Styles the group container. */
  root?: Style;
}

/** Keyed class names for Menu.Group anatomy. */
export type MenuGroupStylesProp = StylesProp<MenuGroupStyleSlots>;

export interface MenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Applies class-based styles to Menu.Group anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuGroupStyleSlots
   */
  styles?: MenuGroupStylesProp;
}

/** Class-based slots for the Menu.Item anatomy. */
export interface MenuItemStyleSlots {
  /** Styles the item row. */
  root?: Style;

  /** Styles the leading selection indicator rendered while selectionMode is not none. */
  indicator?: Style;
}

/** Keyed class names for Menu.Item anatomy. */
export type MenuItemStylesProp = StylesProp<MenuItemStyleSlots>;

export interface MenuItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "onSelect"> {
  /**
   * Sets the stable key used for focus, typeahead, and selection tracking. A generated id is used
   * when it is omitted, so supply it whenever selection must survive re-renders.
   * @category Core
   */
  id?: Key;

  /**
   * Removes the item from keyboard navigation and activation, and publishes data-disabled and
   * aria-disabled.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled
   */
  disabled?: boolean;

  /**
   * Runs when the item is activated by click or Enter. It is not called while the item is disabled.
   * @category Events
   */
  onSelect?: () => void;

  /**
   * Closes the Menu after the item is activated. Defaults to true, or false while the root
   * selectionMode is multiple. With false, the item keeps focus and the Menu stays open until
   * Escape, an outside click, or the trigger closes it.
   * @category Selection
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Supplies the text used for typeahead matching when the rendered children are not plain text.
   * @category Accessibility
   */
  textValue?: string;

  /**
   * Adds leading padding so the label aligns with items that render an indicator, and publishes
   * data-inset.
   * @category Styling
   * @default false
   */
  inset?: boolean;

  /**
   * Adds classes to the item row after its conventional and module classes and before the resolved
   * styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.Item anatomy. Use className for the conventional root class.
   * @category Styling
   * @typeDoc MenuItemStyleSlots
   */
  styles?: MenuItemStylesProp;

  /**
   * Declarative trailing actions rendered by an omitted List.Actions child, or a real
   * interactive control (e.g. List.Switch) that should not trigger row selection.
   * @category Content
   * @typeDoc ListActionDef
   */
  actions?: Array<ListActionDef | React.ReactNode>;
}

/** Class-based slots for the Menu.CheckboxItem anatomy. */
export interface MenuCheckboxItemStyleSlots {
  /** Styles the item row. */
  root?: Style;

  /** Styles the leading checkmark indicator. */
  indicator?: Style;
}

/** Keyed class names for Menu.CheckboxItem anatomy. */
export type MenuCheckboxItemStylesProp = StylesProp<MenuCheckboxItemStyleSlots>;

export interface MenuCheckboxItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "onSelect"> {
  /**
   * Sets the stable key used for focus and typeahead tracking. A generated id is used when it is
   * omitted.
   * @category Core
   */
  id?: Key;

  /**
   * Controls the checked state, published through aria-checked and data-state. The item is always
   * controlled; update this value from onCheckedChange.
   * @category Core
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-checked
   */
  checked?: boolean;

  /**
   * Runs with the negated checked value when the item is activated, before onSelect. The Menu
   * stays open unless closeOnSelect is true.
   * @category Events
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Removes the item from keyboard navigation and activation, and publishes data-disabled and
   * aria-disabled.
   * @category Core
   * @default false
   */
  disabled?: boolean;

  /**
   * Runs when the item is activated by click or Enter, after onCheckedChange. It is not called
   * while the item is disabled.
   * @category Events
   */
  onSelect?: () => void;

  /**
   * Closes the Menu after the item is toggled. Defaults to false so several checkboxes can be
   * toggled in one pass; the item keeps focus and the Menu stays open until Escape, an outside
   * click, or the trigger closes it.
   * @category Selection
   * @default false
   */
  closeOnSelect?: boolean;

  /**
   * Supplies the text used for typeahead matching when the rendered children are not plain text.
   * @category Accessibility
   */
  textValue?: string;

  /**
   * Adds classes to the item row after its conventional and module classes and before the resolved
   * styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.CheckboxItem anatomy. Use className for the conventional
   * root class.
   * @category Styling
   * @typeDoc MenuCheckboxItemStyleSlots
   */
  styles?: MenuCheckboxItemStylesProp;
}

/** Class-based slots for the Menu.RadioGroup anatomy. */
export interface MenuRadioGroupStyleSlots {
  /** Styles the radio group container. */
  root?: Style;
}

/** Keyed class names for Menu.RadioGroup anatomy. */
export type MenuRadioGroupStylesProp = StylesProp<MenuRadioGroupStyleSlots>;

export interface MenuRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls which nested Menu.RadioItem is checked. Omit it to let the group track its own value.
   * @category Core
   */
  value?: string;

  /**
   * Runs with the newly checked radio value when a nested Menu.RadioItem is activated.
   * @category Events
   */
  onValueChange?: (value: string) => void;

  /**
   * Applies class-based styles to Menu.RadioGroup anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuRadioGroupStyleSlots
   */
  styles?: MenuRadioGroupStylesProp;
}

/** Class-based slots for the Menu.RadioItem anatomy. */
export interface MenuRadioItemStyleSlots {
  /** Styles the item row. */
  root?: Style;

  /** Styles the leading radio indicator. */
  indicator?: Style;
}

/** Keyed class names for Menu.RadioItem anatomy. */
export type MenuRadioItemStylesProp = StylesProp<MenuRadioItemStyleSlots>;

export interface MenuRadioItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "onSelect"> {
  /**
   * Sets the stable key used for focus and typeahead tracking. A generated id is used when it is
   * omitted.
   * @category Core
   */
  id?: Key;

  /**
   * Sets the value this item contributes to the surrounding Menu.RadioGroup. The item is checked
   * while it matches the group's current value.
   * @category Core
   */
  value: string;

  /**
   * Removes the item from keyboard navigation and activation, and publishes data-disabled and
   * aria-disabled.
   * @category Core
   * @default false
   */
  disabled?: boolean;

  /**
   * Runs when the item is activated by click or Enter, after the radio group value changes. It is
   * not called while the item is disabled.
   * @category Events
   */
  onSelect?: () => void;

  /**
   * Closes the Menu after the item is chosen. Defaults to false so the group can be changed
   * without dismissing the Menu; the item keeps focus and the Menu stays open until Escape, an
   * outside click, or the trigger closes it.
   * @category Selection
   * @default false
   */
  closeOnSelect?: boolean;

  /**
   * Supplies the text used for typeahead matching when the rendered children are not plain text.
   * @category Accessibility
   */
  textValue?: string;

  /**
   * Adds classes to the item row after its conventional and module classes and before the resolved
   * styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.RadioItem anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuRadioItemStyleSlots
   */
  styles?: MenuRadioItemStylesProp;
}

/** Class-based slots for the Menu.Label anatomy. */
export interface MenuLabelStyleSlots {
  /** Styles the label element. */
  root?: Style;
}

/** Keyed class names for Menu.Label anatomy. */
export type MenuLabelStylesProp = StylesProp<MenuLabelStyleSlots>;

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Adds leading padding so the label aligns with items that render an indicator, and publishes
   * data-inset.
   * @category Styling
   * @default false
   */
  inset?: boolean;

  /**
   * Adds classes to the label after its conventional and module classes and before the resolved
   * styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.Label anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuLabelStyleSlots
   */
  styles?: MenuLabelStylesProp;
}

/** Class-based slots for the Menu.Separator anatomy. */
export interface MenuSeparatorStyleSlots {
  /** Styles the separator rule. */
  root?: Style;
}

/** Keyed class names for Menu.Separator anatomy. */
export type MenuSeparatorStylesProp = StylesProp<MenuSeparatorStyleSlots>;

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Adds classes to the separator after its conventional and module classes and before the resolved
   * styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.Separator anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuSeparatorStyleSlots
   */
  styles?: MenuSeparatorStylesProp;
}

/** Class-based slots for the Menu.Shortcut anatomy. */
export interface MenuShortcutStyleSlots {
  /** Styles the shortcut hint. */
  root?: Style;
}

/** Keyed class names for Menu.Shortcut anatomy. */
export type MenuShortcutStylesProp = StylesProp<MenuShortcutStyleSlots>;

export interface MenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Adds classes to the shortcut hint after its conventional and module classes and before the
   * resolved styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.Shortcut anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuShortcutStyleSlots
   */
  styles?: MenuShortcutStylesProp;
}

export interface MenuSubProps extends React.PropsWithChildren {
  /**
   * Controls the submenu open state. Supplying it makes the submenu controlled; pair it with
   * onOpenChange so hover and ArrowLeft/ArrowRight still work.
   * @category Core
   */
  open?: boolean;

  /**
   * Sets the initial submenu open state when the submenu is uncontrolled.
   * @category Core
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Runs whenever the submenu opens or closes, including when the parent menu closes it.
   * @category Events
   */
  onOpenChange?: (open: boolean) => void;
}

/** Class-based slots for the Menu.SubTrigger anatomy. */
export interface MenuSubTriggerStyleSlots {
  /** Styles the submenu trigger row. */
  root?: Style;

  /** Styles the trailing chevron that indicates the submenu. */
  chevron?: Style;
}

/** Keyed class names for Menu.SubTrigger anatomy. */
export type MenuSubTriggerStylesProp = StylesProp<MenuSubTriggerStyleSlots>;

export interface MenuSubTriggerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  /**
   * Sets the stable key used for focus and typeahead tracking. A generated id is used when it is
   * omitted.
   * @category Core
   */
  id?: Key;

  /**
   * Prevents the row from opening its submenu on hover or ArrowRight, and publishes data-disabled
   * and aria-disabled.
   * @category Core
   * @default false
   */
  disabled?: boolean;

  /**
   * Adds leading padding so the label aligns with items that render an indicator, and publishes
   * data-inset.
   * @category Styling
   * @default false
   */
  inset?: boolean;

  /**
   * Supplies the text used for typeahead matching when the rendered children are not plain text.
   * @category Accessibility
   */
  textValue?: string;

  /**
   * Adds classes to the submenu trigger row after its conventional and module classes and before
   * the resolved styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Applies class-based styles to Menu.SubTrigger anatomy. Use className for the conventional root
   * class.
   * @category Styling
   * @typeDoc MenuSubTriggerStyleSlots
   */
  styles?: MenuSubTriggerStylesProp;
}

/** Class-based slots for the option-list anatomy rendered inside Menu.SubContent. */
export interface MenuSubContentListStyles {
  /** Styles the element that groups the rendered submenu items. */
  root?: Style;

  /** Styles the padding wrapper around the submenu item list. */
  padding?: Style;
}

/** Class-based slots for the Menu.SubContent anatomy. */
export interface MenuSubContentStyleSlots {
  /** Styles the submenu panel. */
  root?: Style;

  /** Styles the positioned floating overlay that holds the submenu panel. */
  overlay?: Style;

  /** Styles every list part, or individually styles list.root and list.padding. */
  list?: Style | MenuSubContentListStyles;
}

/** Keyed class names for Menu.SubContent anatomy. */
export type MenuSubContentStylesProp = StylesProp<MenuSubContentStyleSlots>;

export interface MenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Adds classes to the submenu panel after its conventional and module classes and before the
   * resolved styles.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Sets the gap in pixels between the submenu trigger row and the submenu panel.
   * @category Overlay
   * @default 8
   */
  offset?: number;

  /**
   * Applies class-based styles to Menu.SubContent anatomy: root, overlay, list.root, and
   * list.padding. Use className for the conventional root class.
   * @category Styling
   * @typeDoc MenuSubContentStyleSlots
   */
  styles?: MenuSubContentStylesProp;
}
