import { createStylesResolver } from "@/lib/styles";

const MENU_TRIGGER_STYLE_SLOTS = ["root"] as const;
const MENU_CONTENT_STYLE_SLOTS = ["root", "overlay", "list.root", "list.padding"] as const;
const MENU_GROUP_STYLE_SLOTS = ["root"] as const;
const MENU_ITEM_STYLE_SLOTS = ["root", "indicator"] as const;
const MENU_CHECKBOX_ITEM_STYLE_SLOTS = ["root", "indicator"] as const;
const MENU_RADIO_GROUP_STYLE_SLOTS = ["root"] as const;
const MENU_RADIO_ITEM_STYLE_SLOTS = ["root", "indicator"] as const;
const MENU_LABEL_STYLE_SLOTS = ["root"] as const;
const MENU_SEPARATOR_STYLE_SLOTS = ["root"] as const;
const MENU_SHORTCUT_STYLE_SLOTS = ["root"] as const;
const MENU_SUB_TRIGGER_STYLE_SLOTS = ["root", "chevron"] as const;
const MENU_SUB_CONTENT_STYLE_SLOTS = ["root", "overlay", "list.root", "list.padding"] as const;

export const resolveMenuTriggerStyles = createStylesResolver(MENU_TRIGGER_STYLE_SLOTS);
export const resolveMenuContentStyles = createStylesResolver(MENU_CONTENT_STYLE_SLOTS);
export const resolveMenuGroupStyles = createStylesResolver(MENU_GROUP_STYLE_SLOTS);
export const resolveMenuItemStyles = createStylesResolver(MENU_ITEM_STYLE_SLOTS);
export const resolveMenuCheckboxItemStyles = createStylesResolver(MENU_CHECKBOX_ITEM_STYLE_SLOTS);
export const resolveMenuRadioGroupStyles = createStylesResolver(MENU_RADIO_GROUP_STYLE_SLOTS);
export const resolveMenuRadioItemStyles = createStylesResolver(MENU_RADIO_ITEM_STYLE_SLOTS);
export const resolveMenuLabelStyles = createStylesResolver(MENU_LABEL_STYLE_SLOTS);
export const resolveMenuSeparatorStyles = createStylesResolver(MENU_SEPARATOR_STYLE_SLOTS);
export const resolveMenuShortcutStyles = createStylesResolver(MENU_SHORTCUT_STYLE_SLOTS);
export const resolveMenuSubTriggerStyles = createStylesResolver(MENU_SUB_TRIGGER_STYLE_SLOTS);
export const resolveMenuSubContentStyles = createStylesResolver(MENU_SUB_CONTENT_STYLE_SLOTS);
