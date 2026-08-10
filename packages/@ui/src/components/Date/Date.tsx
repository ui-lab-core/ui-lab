"use client"

import * as React from "react"

import { mergeProps, } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { type StyleValue, cn } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import { useControlledState } from "@/hooks/useControlledState"
import { asElementProps } from "@/lib/react-aria"
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";

import dateModuleStyles from "./Date.module.css"

// Alias global Date to avoid shadowing by component name
const NativeDate = globalThis.Date;

interface DateStyleSlots {
  root?: StyleValue;
  header?: StyleValue;
  "day-headers"?: StyleValue;
  grid?: StyleValue;
  "day-cell"?: StyleValue; // individual date button
}

type DateStylesProp = StylesProp<DateStyleSlots>;

const dateStyleSlotKeys = ['root', 'header', 'day-headers', 'grid', 'day-cell'] as const;
const resolveDateBaseStyles = createStylesResolver(dateStyleSlotKeys);

function normalizeDateStyles(styles: DateStylesProp | undefined) {
  if (!styles) {
    return styles;
  }

  return {
    root: styles.root,
    header: styles.header,
    "day-headers": styles["day-headers"],
    grid: styles.grid,
    "day-cell": styles["day-cell"],
  };
}

/** A start/end pair describing a selected date range. Either end may be null while a range is being picked. */
export interface DateRangeValue {
  start: Date | null
  end: Date | null
}

/**
 * Context type for Calendar state management
 */
export interface DateContextValue {
  mode: "single" | "range"
  selectedDate: Date | null
  rangeValue: DateRangeValue | null
  hoverDate: Date | null
  focusedDate: Date | null
  currentMonth: Date
  today: Date | null
  selectDate: (date: Date) => void
  focusDate: (date: Date) => void
  setHoverDate: (date: Date | null) => void
  navigateMonth: (offset: number) => void
  isDateDisabled: (date: Date) => boolean
  isDateOutOfRange: (date: Date) => boolean
}

const DateContext = React.createContext<DateContextValue | null>(null)

function useDateContext() {
  const context = React.useContext(DateContext)
  if (!context) {
    throw new Error("Date component must be used within Date root")
  }
  return context
}

/**
 * Props shared by both single-date and range selection modes
 */
interface DateBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Function returning true for dates that should be unselectable */
  disabled?: (date: Date) => boolean
  /** Earliest selectable date */
  minDate?: Date
  /** Latest selectable date */
  maxDate?: Date
  /** Month shown initially when no date is selected */
  defaultMonth?: Date;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: DateStylesProp;
}

/** Single-date selection: one click selects the date. */
export interface DateSingleProps extends DateBaseProps {
  mode?: "single"
  state?: DateState
  /** Controlled selected date */
  value?: Date | null
  /** Called when the user selects a date */
  onChange?: (date: Date) => void
}

/** Range selection: first click sets the start, the next click sets the end. */
export interface DateRangeProps extends DateBaseProps {
  mode: "range"
  state?: DateRangeState
  /** Controlled selected range */
  value?: DateRangeValue | null
  /** Called whenever the start or end of the range changes */
  onChange?: (range: DateRangeValue) => void
}

/**
 * Props for Calendar component
 */
export type DateProps = DateSingleProps | DateRangeProps
export interface DateState { value?: Date | null }
export interface DateRangeState { value?: DateRangeValue | null }

/**
 * Helper functions for date calculations
 */
function getDaysInMonth(date: Date): number {
  return new NativeDate(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getFirstDayOfMonth(date: Date): number {
  return new NativeDate(date.getFullYear(), date.getMonth(), 1).getDay()
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isToday(date: Date, today: Date | null): boolean {
  if (!today) return false;
  return isSameDay(date, today)
}

/**
 * Calendar grid computation
 */
function getCalendarGrid(currentMonth: Date): Date[][] {
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)

  const grid: Date[] = []

  // Handle previous month's days
  if (firstDay > 0) {
    const prevMonth = new NativeDate(currentMonth.getFullYear(), currentMonth.getMonth(), 0)
    const daysInPrevMonth = getDaysInMonth(prevMonth)

    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new NativeDate(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i)
      grid.push(date)
    }
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push(new NativeDate(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  // Pad with next month's days
  while (grid.length % 7 !== 0) {
    const nextDay = grid.length - firstDay - daysInMonth + 1
    const date = new NativeDate(currentMonth.getFullYear(), currentMonth.getMonth() + 1, nextDay)
    grid.push(date)
  }

  // Convert to rows
  const rows: Date[][] = []
  for (let i = 0; i < grid.length; i += 7) {
    rows.push(grid.slice(i, i + 7))
  }

  return rows
}

const Date = React.forwardRef<HTMLDivElement, DateProps>(
  (props, ref) => {
    const {
      mode = "single",
      value: controlledValue,
      state: controlledState,
      onChange,
      disabled: disabledProp = () => false,
      minDate,
      maxDate,
      defaultMonth,
      className,
      styles,
      ...rest
    } = props

    const [uncontrolledValue, setUncontrolledValue] = useControlledState<Date | DateRangeValue | null>(
      controlledState?.value,
      controlledValue,
      mode === "range" ? { start: null, end: null } : null,
    )
    const [today, setToday] = React.useState<Date | null>(null)
    // Initialized synchronously (not via effect) so the grid is present on
    // the very first render, server and client alike — gating this behind
    // an effect leaves the calendar blank until after hydration.
    const [currentMonth, setCurrentMonth] = React.useState<Date>(() => defaultMonth ?? new NativeDate())
    const [focusedDate, setFocusedDate] = React.useState<Date | null>(null)
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null)

    const selectedDate = mode === "single" ? (uncontrolledValue as Date | null) : null
    const rangeValue = mode === "range" ? (uncontrolledValue as DateRangeValue) : null

    const resolved = resolveDateBaseStyles(normalizeDateStyles(styles));

    const isDateDisabled = React.useCallback(
      (date: Date): boolean => {
        if (disabledProp(date)) return true
        if (minDate && date < minDate) return true
        if (maxDate && date > maxDate) return true
        return false
      },
      [disabledProp, minDate, maxDate]
    )

    const isDateOutOfRange = React.useCallback(
      (date: Date): boolean => {
        return (
          date.getMonth() !== currentMonth.getMonth() ||
          date.getFullYear() !== currentMonth.getFullYear()
        )
      },
      [currentMonth]
    )

    const selectDate = React.useCallback(
      (date: Date) => {
        if (isDateDisabled(date)) return

        if (mode === "range") {
          const prevRange = rangeValue ?? { start: null, end: null }
          // Start a new range whenever there's no in-progress start, the previous
          // range already completed, or the click lands before the current anchor.
          const next: DateRangeValue =
            !prevRange.start || prevRange.end || date < prevRange.start
              ? { start: date, end: null }
              : { start: prevRange.start, end: date }

          setUncontrolledValue(next)
            ; (onChange as ((range: DateRangeValue) => void) | undefined)?.(next)
        } else {
          setUncontrolledValue(date)
            ; (onChange as ((date: Date) => void) | undefined)?.(date)
        }

        setHoverDate(null)
        setFocusedDate(null)
      },
      [onChange, isDateDisabled, setUncontrolledValue, mode, rangeValue]
    )

    const focusDate = React.useCallback((date: Date) => {
      setFocusedDate(date)
    }, [])

    const navigateMonth = React.useCallback((offset: number) => {
      setCurrentMonth(prev => new NativeDate(prev.getFullYear(), prev.getMonth() + offset, 1))
    }, [])

    const calendarGrid = React.useMemo(
      () => getCalendarGrid(currentMonth),
      [currentMonth]
    )

    const contextValue: DateContextValue = React.useMemo(
      () => ({
        mode,
        selectedDate,
        rangeValue,
        hoverDate,
        focusedDate,
        currentMonth,
        today,
        selectDate,
        focusDate,
        setHoverDate,
        navigateMonth,
        isDateDisabled,
        isDateOutOfRange,
      }),
      [mode, selectedDate, rangeValue, hoverDate, focusedDate, currentMonth, today, selectDate, focusDate, navigateMonth, isDateDisabled, isDateOutOfRange]
    )

    const handlePointerLeave = React.useCallback(() => {
      if (mode === "range") setHoverDate(null)
    }, [mode])

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!focusedDate) return

        let newFocusedDate: Date | null = null

        switch (e.key) {
          case "ArrowUp":
            e.preventDefault()
            newFocusedDate = new NativeDate(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate() - 7)
            break
          case "ArrowDown":
            e.preventDefault()
            newFocusedDate = new NativeDate(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate() + 7)
            break
          case "ArrowLeft":
            e.preventDefault()
            newFocusedDate = new NativeDate(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate() - 1)
            break
          case "ArrowRight":
            e.preventDefault()
            newFocusedDate = new NativeDate(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate() + 1)
            break
          case "Home":
            e.preventDefault()
            newFocusedDate = new NativeDate(focusedDate.getFullYear(), focusedDate.getMonth(), 1)
            break
          case "End":
            e.preventDefault()
            const daysInMonth = getDaysInMonth(focusedDate)
            newFocusedDate = new NativeDate(focusedDate.getFullYear(), focusedDate.getMonth(), daysInMonth)
            break
          case "PageUp":
            e.preventDefault()
            navigateMonth(-1)
            return
          case "PageDown":
            e.preventDefault()
            navigateMonth(1)
            return
          case "Enter":
          case " ":
            e.preventDefault()
            selectDate(focusedDate)
            return
        }

        if (newFocusedDate) {
          setFocusedDate(newFocusedDate)
          // Auto-navigate month if needed
          if (newFocusedDate.getMonth() !== currentMonth.getMonth() || newFocusedDate.getFullYear() !== currentMonth.getFullYear()) {
            setCurrentMonth(new NativeDate(newFocusedDate.getFullYear(), newFocusedDate.getMonth(), 1))
          }
        }
      },
      [focusedDate, currentMonth, selectDate, navigateMonth]
    )

    // Set initial focus and today's date on client mount — these only
    // affect the focus ring and the `data-today` marker, not whether the
    // grid itself renders, so it's safe to leave them client-only.
    React.useEffect(() => {
      const now = new NativeDate()
      setToday(now)

      if (focusedDate === null) { // Only set if not yet initialized
        const anchor = mode === "range" ? (rangeValue?.end ?? rangeValue?.start ?? null) : selectedDate
        setFocusedDate(anchor ?? now)
      }
    }, [focusedDate, selectedDate, rangeValue, mode])

    return (
      <DateContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("date", dateModuleStyles.calendar, dateModuleStyles.grid, className, resolved.root)}
          role="application"
          aria-label={mode === "range" ? "Date range picker calendar" : "Date picker calendar"}
          data-mode={mode}
          onKeyDown={handleKeyDown}
          onPointerLeave={handlePointerLeave}
          {...rest}
        >
          <DateHeader className={resolved.header} />
          <DateDayHeaders className={resolved["day-headers"]} />
          <DateGrid grid={calendarGrid} dayCellClassName={resolved["day-cell"]} />
        </div>
      </DateContext.Provider>
    )
  }
)

Date.displayName = "Date"

/**
 * Calendar Header component
 */
export interface DateHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS class for the header */
  className?: string;
}

/** Navigation header with month/year display and prev/next controls */
const DateHeader = React.forwardRef<HTMLDivElement, DateHeaderProps>(
  ({ className, ...props }, ref) => {
    const { currentMonth, navigateMonth } = useDateContext()
    const { focusProps: prevFocusProps, isFocused: isPrevFocused, isFocusVisible: isPrevFocusVisible } = useFocusRing()
    const { focusProps: nextFocusProps, isFocused: isNextFocused, isFocusVisible: isNextFocusVisible } = useFocusRing()
    const { targetProps: prevTargetProps } = useFocus({ mode: "target" })
    const { targetProps: nextTargetProps } = useFocus({ mode: "target" })

    const monthYear = currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })

    return (
      <div
        ref={ref}
        className={cn("row", dateModuleStyles.header, className)}
        {...props}
      >
        <div className={cn("title", dateModuleStyles["month-year"])}>
          {monthYear}
        </div>
        <button
          {...asElementProps<"button">(mergeProps(prevFocusProps, prevTargetProps))}
          onClick={() => navigateMonth(-1)}
          className={cn("button", "prev-button", dateModuleStyles["nav-button"])}
          aria-label="Previous month"
          data-focused={isPrevFocused ? "true" : undefined}
          data-focus-visible={isPrevFocusVisible ? "true" : undefined}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          {...asElementProps<"button">(mergeProps(nextFocusProps, nextTargetProps))}
          onClick={() => navigateMonth(1)}
          className={cn("button", "next-button", dateModuleStyles["nav-button"])}
          aria-label="Next month"
          data-focused={isNextFocused ? "true" : undefined}
          data-focus-visible={isNextFocusVisible ? "true" : undefined}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    )
  }
)

DateHeader.displayName = "Date.Header"

/**
 * Calendar Day Headers component
 */
interface DateDayHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS class for the day headers row */
  className?: string;
}

/** Row of weekday abbreviation labels above the calendar grid */
const DateDayHeaders = React.forwardRef<HTMLDivElement, DateDayHeadersProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("row", dateModuleStyles["day-headers"], className)}
        {...props}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className={cn("label", dateModuleStyles["day-header"])}
          >
            {day}
          </div>
        ))}
      </div>
    )
  }
)

DateDayHeaders.displayName = "Date.DayHeaders"

/**
 * Calendar Grid component
 */
export interface DateGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Calendar grid rows, each containing 7 Date objects */
  grid: Date[][]
  /** Classes applied to each individual date cell (DateDay component) */
  dayCellClassName?: string;
}

/** The 7-column calendar grid containing date cells */
const DateGrid = React.forwardRef<HTMLDivElement, DateGridProps>(
  ({ grid, dayCellClassName }, _ref) => {
    return grid.flatMap((week: Date[], weekIndex: number) =>
      week.map((date: Date, dayIndex: number) => (
        <DateDay key={`${weekIndex}-${dayIndex}`} date={date} className={dayCellClassName} />
      ))
    )
  }
)

DateGrid.displayName = "Date.Grid"

/**
 * Calendar Day component
 */
export interface DateDayProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** The date this cell represents */
  date: Date
}
/**
 * Individual date cell in the calendar grid
 */
const DateDay = React.forwardRef<HTMLButtonElement, DateDayProps>(
  ({ date, className, onClick, ...props }, ref) => {
    const {
      mode,
      selectedDate,
      rangeValue,
      hoverDate,
      focusedDate,
      today,
      selectDate,
      focusDate,
      setHoverDate,
      isDateDisabled,
      isDateOutOfRange,
    } = useDateContext()

    const isDisabled = isDateDisabled(date)

    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const mergedRef = useMergeRefs(ref, buttonRef)
    const { focusProps, isFocused: isFocusRingFocused, isFocusVisible } = useFocusRing()
    const { hoverProps, isHovered } = useHover({
      isDisabled,
      onHoverStart: () => {
        if (mode === "range") setHoverDate(date)
      },
    })
    const { targetProps } = useFocus({ mode: "target" })

    const isFocused = focusedDate ? isSameDay(date, focusedDate) : false
    const isCurrentToday = isToday(date, today)
    const isOutOfRange = isDateOutOfRange(date)

    let isSelected = selectedDate ? isSameDay(date, selectedDate) : false
    let isRangeStart = false
    let isRangeEnd = false
    let isInRange = false
    // Whether this cell's range band continues into the day immediately to its
    // left/right within the same week row. These drive which corners stay
    // square (Date.module.css) so consecutive days fuse into one connected
    // strip instead of a row of separate rounded pills.
    let connectsLeft = false
    let connectsRight = false

    if (mode === "range" && rangeValue?.start) {
      // While the end hasn't been picked yet, preview the range using the
      // hovered date, but only looking forward — a backward click restarts
      // the anchor instead of completing the range, so the preview shouldn't
      // promise a range that clicking wouldn't actually produce.
      const previewEnd = rangeValue.end ?? (hoverDate && hoverDate >= rangeValue.start ? hoverDate : null)

      isRangeStart = isSameDay(date, rangeValue.start)
      if (previewEnd) {
        isRangeEnd = isSameDay(date, previewEnd) && !isSameDay(rangeValue.start, previewEnd)
        isInRange = date > rangeValue.start && date < previewEnd

        // date.getDay() is this cell's grid column (0 = Sun ... 6 = Sat, the
        // grid is Sunday-first). The band continues into a neighbour only when
        // the range spans past this day in that direction and the neighbour
        // isn't across a week boundary — so the range's outer ends and each
        // wrapped row's caps keep their rounding.
        const isInBand = isRangeStart || isRangeEnd || isInRange
        const column = date.getDay()
        connectsLeft = isInBand && column !== 0 && date > rangeValue.start
        connectsRight = isInBand && column !== 6 && date < previewEnd
      }
      isSelected = isRangeStart || isRangeEnd
    }

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        selectDate(date)
        focusDate(date)
        onClick?.(e)
      },
      [date, selectDate, focusDate, onClick]
    )

    const handleFocus = React.useCallback(() => {
      focusDate(date)
    }, [date, focusDate])

    React.useEffect(() => {
      if (isFocused && buttonRef.current) {
        buttonRef.current.focus({ preventScroll: true })
      }
    }, [isFocused])

    const rangeLabel = mode === "range" ? (isRangeStart ? ", range start" : isRangeEnd ? ", range end" : "") : ""

    return (
      <button
        ref={mergedRef}
        onClick={handleClick}
        className={cn("day", dateModuleStyles["day-cell"], className)}
        data-ring={targetProps["data-ring"]}
        data-focus-indicator={targetProps["data-focus-indicator"]}
        data-ring-inset={targetProps["data-ring-inset"]}
        data-focused={isFocusRingFocused ? "true" : undefined}
        data-hovered={isHovered ? "true" : undefined}
        data-selected={isSelected ? "true" : undefined}
        data-range-start={isRangeStart ? "true" : undefined}
        data-range-end={isRangeEnd ? "true" : undefined}
        data-in-range={isInRange ? "true" : undefined}
        data-connect-left={connectsLeft ? "true" : undefined}
        data-connect-right={connectsRight ? "true" : undefined}
        data-today={isCurrentToday ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        data-out-of-range={isOutOfRange ? "true" : undefined}
        data-focus-visible={isFocusVisible && isFocused ? "true" : undefined}
        disabled={isDisabled}
        aria-selected={isSelected}
        aria-label={`${date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}${rangeLabel}`}
        {...mergeProps(focusProps, hoverProps, { onFocus: handleFocus }, props)}
      >
        {date.getDate()}
      </button>
    )
  }
)

DateDay.displayName = "Date.Day"

export { Date, DateHeader, DateGrid, DateDay }
