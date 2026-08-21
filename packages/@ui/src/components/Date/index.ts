import { Date as DateRoot, DateHeader, DateGrid, DateDay } from "./Date";
import { DateInput } from "./Date.Input";

/**
 * `Date.Input` is the recommended way to compose a full date field: typed
 * segments in an Input shell with a calendar in a popover. The `Date` root
 * itself stays available on its own for embedded, always-visible calendars.
 */
const Date = Object.assign(DateRoot, {
  Header: DateHeader,
  Grid: DateGrid,
  Day: DateDay,
  Input: DateInput,
});

export { Date, DateHeader, DateGrid, DateDay, DateInput };

export type {
  DateProps,
  DateSingleProps,
  DateRangeProps,
  DateContextValue,
  DateState,
  DateRangeState,
  DateRangeValue,
  DateStyleSlots,
  DateStylesProp,
  DateHeaderStyleSlots,
  DateDayHeadersStyleSlots,
  DateHeaderProps,
  DateGridProps,
  DateDayProps,
} from "./Date";

export type { DateInputProps, DateInputSingleProps, DateInputRangeProps } from "./Date.Input";
