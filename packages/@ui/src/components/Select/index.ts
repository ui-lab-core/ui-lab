import { Select as SelectRoot } from "./Select";
import { SelectTrigger, SearchableTrigger } from "./Select.Trigger";
import { SelectContent, SearchableContent } from "./Select.Content";
import { SelectGroup, SelectValue, SelectItem, SelectList } from "./Select.Items";
import { SelectSeparator } from "./Select.Decorative";
import { SelectSub, SelectSubTrigger, SelectSubContent } from "./Select.Sub";

const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  SearchableTrigger,
  Content: SelectContent,
  SearchableContent,
  List: SelectList,
  Item: SelectItem,
  Group: SelectGroup,
  Value: SelectValue,
  Separator: SelectSeparator,
  Sub: SelectSub,
  SubTrigger: SelectSubTrigger,
  SubContent: SelectSubContent,
});

/**
 * Searchable Select composition. Its parts are aliases of Select.SearchableTrigger and
 * Select.SearchableContent.
 */
const Searchable = {
  Input: SearchableTrigger,
  Content: SearchableContent,
};

/**
 * Multi-select composition. Its parts are aliases of the equivalent Select parts; set
 * mode="multiple" on the Select root to enable multiple selection.
 */
const Multi = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  List: SelectList,
  Item: SelectItem,
});

export type {
  SelectItemData,
  SelectMode,
  SelectProps,
  SelectState,
  SelectStyleSlots,
  SelectStylesProp,
  SelectTriggerMode,
} from "./Select";
export type {
  SelectContentAlign,
  SelectContentPosition,
  SelectContentListStyles,
  SelectContentProps,
  SelectContentSearchStyles,
  SelectContentStyleSlots,
  SelectContentStylesProp,
  SearchableContentProps,
} from "./Select.Content";
export type {
  SelectTriggerProps,
  SelectTriggerIconSlots,
  SelectTriggerIconStyles,
  SelectTriggerStyleSlots,
  SelectTriggerStylesProp,
  SelectTriggerVariant,
  SearchableTriggerProps,
  SearchableTriggerIconStyles,
  SearchableTriggerStyleSlots,
  SearchableTriggerStylesProp,
} from "./Select.Trigger";
export type {
  SelectSeparatorProps,
  SelectSeparatorStyleSlots,
  SelectSeparatorStylesProp,
} from "./Select.Decorative";
export type {
  SelectSubProps,
  SelectSubTriggerProps,
  SelectSubContentProps,
  SelectSubContentListStyles,
  SelectSubTriggerIconStyles,
  SelectSubTriggerStyleSlots,
  SelectSubTriggerStylesProp,
  SelectSubContentStyleSlots,
  SelectSubContentStylesProp,
} from "./Select.Sub";
export type {
  SelectGroupProps,
  SelectValueProps,
  SelectValueChildren,
  SelectItemProps,
  SelectListProps,
  SelectGroupStyleSlots,
  SelectGroupStylesProp,
  SelectValueStyleSlots,
  SelectValueStylesProp,
  SelectItemStyleSlots,
  SelectItemStylesProp,
  SelectListStyleSlots,
  SelectListStylesProp,
} from "./Select.Items";

export { useCompletion } from "@/hooks/useCompletion";
export type {
  CompletionController,
  CompletionMatch,
  CompletionNavigator,
  CompletionOrigin,
  UseCompletionOptions,
} from "@/hooks/useCompletion";
export {
  Select,
  Searchable,
  Multi,
  SelectContent,
  SearchableContent,
  SelectTrigger,
  SearchableTrigger,
  SelectList,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectSeparator,
  SelectSub,
  SelectSubTrigger,
  SelectSubContent,
};
