"use client"

import * as React from "react"

import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useControlledState } from "@/hooks/useControlledState"
import {
  useRegionCoordinator,
  useRegion,
  type RegionConfig,
  type RegionCoordinator,
  type RegionValues,
} from "@/hooks/useRegionCoordinator"
import { Input, type InputActionDef, type InputProps } from "@/components/Input"
import { Popover } from "@/components/Popover"

import { Date as DateCalendar, type DateRangeValue } from "./Date"
import css from "./Date.Input.module.css"

// Alias global Date to avoid shadowing by the component name.
const NativeDate = globalThis.Date

type DatePart = "month" | "day" | "year"

/** Range fields hold two independent sets of segments. */
type Bound = "start" | "end"

const PART_PLACEHOLDER: Record<DatePart, string> = {
  month: "MM",
  day: "DD",
  year: "YYYY",
}

const PART_LENGTH: Record<DatePart, number> = {
  month: 2,
  day: 2,
  year: 4,
}

const DEFAULT_LAYOUT: { parts: DatePart[]; separator: string } = {
  parts: ["month", "day", "year"],
  separator: "/",
}

/**
 * Derives segment order and separator from the locale.
 *
 * The locale is an explicit prop (defaulting to "en-US") rather than the
 * ambient system locale, so server and client resolve the same layout and
 * hydration can't mismatch.
 */
function getSegmentLayout(locale: string): { parts: DatePart[]; separator: string } {
  try {
    // A fixed reference date — this only inspects part order, never the clock.
    const parts = new Intl.DateTimeFormat(locale).formatToParts(new NativeDate(2024, 0, 2))

    const order = parts
      .filter((part): part is Intl.DateTimeFormatPart & { type: DatePart } =>
        part.type === "month" || part.type === "day" || part.type === "year"
      )
      .map((part) => part.type)

    if (order.length !== 3) return DEFAULT_LAYOUT

    const literal = parts.find((part) => part.type === "literal")
    return { parts: order, separator: literal?.value?.trim() || DEFAULT_LAYOUT.separator }
  } catch {
    return DEFAULT_LAYOUT
  }
}

function daysInMonth(year: number, month: number): number {
  return new NativeDate(year, month + 1, 0).getDate()
}

function pad(value: string, length: number): string {
  return value.padStart(length, "0")
}

function regionId(part: DatePart, bound?: Bound): string {
  return bound ? `${bound}-${part}` : part
}

function buildRegions(parts: DatePart[], bound?: Bound): RegionConfig[] {
  return parts.map((part) => {
    const length = PART_LENGTH[part]

    return {
      id: regionId(part, bound),
      length,
      placeholder: PART_PLACEHOLDER[part],
      label: bound ? `${bound} ${part}` : part,
      format: (value) => pad(value, length),
      validate: (value) => {
        const numeric = Number(value)
        if (!Number.isFinite(numeric)) return false
        if (part === "month") return numeric >= 1 && numeric <= 12
        if (part === "day") return numeric >= 1 && numeric <= 31
        return numeric >= 1
      },
      // Advance early when no longer value can start with what's typed:
      // month "2" can only be February, day "4" can only be the 4th.
      shouldAdvance: (value) => {
        if (value.length === 0) return false
        if (part === "month") return Number(value) > 1
        if (part === "day") return Number(value) > 3
        return false
      },
    } satisfies RegionConfig
  })
}

/** Reads one date out of the region values, or null if it isn't complete and valid. */
function parseSegments(values: RegionValues, bound?: Bound): Date | null {
  const month = values[regionId("month", bound)] ?? ""
  const day = values[regionId("day", bound)] ?? ""
  const year = values[regionId("year", bound)] ?? ""

  if (month.length === 0 || day.length === 0 || year.length !== 4) return null

  const monthNumber = Number(month)
  const dayNumber = Number(day)
  const yearNumber = Number(year)

  if (!Number.isFinite(monthNumber) || !Number.isFinite(dayNumber) || !Number.isFinite(yearNumber)) return null
  if (monthNumber < 1 || monthNumber > 12) return null
  if (yearNumber < 1) return null
  if (dayNumber < 1 || dayNumber > daysInMonth(yearNumber, monthNumber - 1)) return null

  return new NativeDate(yearNumber, monthNumber - 1, dayNumber)
}

/** Writes a date into the region values, leaving other bounds untouched. */
function writeSegments(values: RegionValues, date: Date | null, bound?: Bound): RegionValues {
  if (!date) return values

  return {
    ...values,
    [regionId("month", bound)]: pad(String(date.getMonth() + 1), 2),
    [regionId("day", bound)]: pad(String(date.getDate()), 2),
    [regionId("year", bound)]: pad(String(date.getFullYear()), 4),
  }
}

function areValuesEqual(a: RegionValues, b: RegionValues): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    if ((a[key] ?? "") !== (b[key] ?? "")) return false
  }
  return true
}

interface DateInputBaseProps {
  /** BCP 47 locale that determines segment order and separator. */
  locale?: string
  /** Function returning true for dates that should be unselectable. */
  isDateDisabled?: (date: Date) => boolean
  /** Earliest selectable date. */
  minDate?: Date
  /** Latest selectable date. */
  maxDate?: Date
  /** Disables the whole field. */
  disabled?: boolean
  /** Whether the field is in an error state. */
  error?: boolean
  /** Visual style forwarded to the underlying Input. */
  variant?: InputProps["variant"]
  /** Accessible name for the segment group. */
  label?: string
  /** Additional CSS class for the field wrapper. */
  className?: string
}

export interface DateInputSingleProps extends DateInputBaseProps {
  mode?: "single"
  state?: { value?: Date | null }
  /** Initial selected date. Pass `state={{ value }}` for controlled usage. */
  value?: Date | null
  /** Called when a complete date is typed or picked, or when the field is cleared. */
  onChange?: (date: Date | null) => void
}

export interface DateInputRangeProps extends DateInputBaseProps {
  mode: "range"
  state?: { value?: DateRangeValue | null }
  /** Initial selected range. Pass `state={{ value }}` for controlled usage. */
  value?: DateRangeValue | null
  /** Called whenever the start or end of the range changes. */
  onChange?: (range: DateRangeValue) => void
}

export type DateInputProps = DateInputSingleProps | DateInputRangeProps

interface DateSegmentProps {
  coordinator: RegionCoordinator
  index: number
}

/**
 * One typed segment. Regions each need their own `useFocusRing`, which can't
 * be called in a loop, so every segment is its own component.
 */
function DateSegment({ coordinator, index }: DateSegmentProps) {
  const region = useRegion(coordinator, index)

  return (
    <input
      ref={region.ref}
      type="text"
      className={cn("segment", css.segment)}
      style={{ "--segment-length": region.config.length } as React.CSSProperties}
      data-filled={region.isFilled ? "true" : "false"}
      data-focused={region.isFocused ? "true" : undefined}
      data-focus-visible={region.isFocusVisible ? "true" : undefined}
      data-disabled={coordinator.disabled ? "true" : undefined}
      {...region.props}
    />
  )
}

interface DateSegmentGroupProps {
  coordinator: RegionCoordinator
  /** Index of this group's first region within the coordinator. */
  offset: number
  parts: DatePart[]
  separator: string
  label: string
}

function DateSegmentGroup({ coordinator, offset, parts, separator, label }: DateSegmentGroupProps) {
  return (
    <div className={cn("segments", css.segments)} role="group" aria-label={label}>
      {parts.map((part, index) => (
        <React.Fragment key={part}>
          {index > 0 && (
            <span className={cn("separator", css.separator)} aria-hidden="true">
              {separator}
            </span>
          )}
          <DateSegment coordinator={coordinator} index={offset + index} />
        </React.Fragment>
      ))}
    </div>
  )
}

/**
 * A full date field: typed month/day/year segments inside an Input shell, with
 * a calendar action that opens the Date calendar in a Popover. This is the
 * recommended way to compose a date field — the bare Date root stays available
 * for embedded, always-visible calendars.
 */
const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>((props, ref) => {
  const {
    mode = "single",
    value: initialValue,
    state: controlledState,
    onChange,
    locale = "en-US",
    isDateDisabled,
    minDate,
    maxDate,
    disabled = false,
    error = false,
    variant,
    label,
    className,
  } = props

  const isRange = mode === "range"
  const [open, setOpen] = React.useState(false)

  const [value, setValue] = useControlledState<Date | DateRangeValue | null>(
    controlledState?.value,
    initialValue,
    isRange ? { start: null, end: null } : null,
  )

  const singleValue = isRange ? null : (value as Date | null)
  const rangeValue = isRange ? ((value as DateRangeValue) ?? { start: null, end: null }) : null

  const layout = React.useMemo(() => getSegmentLayout(locale), [locale])

  const regions = React.useMemo(
    () =>
      isRange
        ? [...buildRegions(layout.parts, "start"), ...buildRegions(layout.parts, "end")]
        : buildRegions(layout.parts),
    [isRange, layout.parts],
  )

  const isDateUnavailable = React.useCallback(
    (date: Date) => {
      if (isDateDisabled?.(date)) return true
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return false
    },
    [isDateDisabled, minDate, maxDate],
  )

  // Typed segments flow back out as a date only once a bound is complete and
  // selectable; partial input just sits in the field.
  const handleRegionChange = React.useCallback(
    (_id: string, _regionValue: string, values: RegionValues) => {
      if (isRange) {
        const start = parseSegments(values, "start")
        const end = parseSegments(values, "end")
        const next: DateRangeValue = {
          start: start && !isDateUnavailable(start) ? start : null,
          end: end && !isDateUnavailable(end) ? end : null,
        }

        setValue(next)
        ;(onChange as ((range: DateRangeValue) => void) | undefined)?.(next)
        return
      }

      const parsed = parseSegments(values)
      const next = parsed && !isDateUnavailable(parsed) ? parsed : null

      setValue(next)
      ;(onChange as ((date: Date | null) => void) | undefined)?.(next)
    },
    [isRange, isDateUnavailable, setValue, onChange],
  )

  const coordinator = useRegionCoordinator({
    regions,
    onRegionChange: handleRegionChange,
    disabled,
  })

  const { setValues, values } = coordinator

  // Mirror externally-driven value changes (calendar picks, controlled props)
  // back into the segments. Only non-null dates write, so a partially typed
  // field is never wiped by its own in-progress state.
  React.useEffect(() => {
    let next = values
    if (isRange) {
      next = writeSegments(next, rangeValue?.start ?? null, "start")
      next = writeSegments(next, rangeValue?.end ?? null, "end")
    } else {
      next = writeSegments(next, singleValue)
    }

    if (!areValuesEqual(next, values)) setValues(next)
  }, [isRange, singleValue, rangeValue?.start, rangeValue?.end, values, setValues])

  const handleCalendarSingleChange = React.useCallback(
    (date: Date) => {
      setValue(date)
      ;(onChange as ((date: Date | null) => void) | undefined)?.(date)
      // Single mode has nothing left to pick, so the popover closes.
      setOpen(false)
    },
    [setValue, onChange],
  )

  const handleCalendarRangeChange = React.useCallback(
    (range: DateRangeValue) => {
      setValue(range)
      ;(onChange as ((range: DateRangeValue) => void) | undefined)?.(range)
      // Stay open across the start pick so the end can be chosen in the same
      // session; only a completed range closes the popover.
      if (range.start && range.end) setOpen(false)
    },
    [setValue, onChange],
  )

  const calendarAnchor = isRange ? (rangeValue?.end ?? rangeValue?.start ?? null) : singleValue

  const calendar = isRange ? (
    <DateCalendar
      mode="range"
      state={{ value: rangeValue }}
      onChange={handleCalendarRangeChange}
      disabled={disabledProp}
      minDate={minDate}
      maxDate={maxDate}
      defaultMonth={calendarAnchor ?? undefined}
    />
  ) : (
    <DateCalendar
      state={{ value: singleValue }}
      onChange={handleCalendarSingleChange}
      disabled={disabledProp}
      minDate={minDate}
      maxDate={maxDate}
      defaultMonth={calendarAnchor ?? undefined}
    />
  )

  const calendarAction: InputActionDef = {
    icon: <CalendarIcon size={16} />,
    title: isRange ? "Open range calendar" : "Open calendar",
    onClick: () => {
      if (disabled) return
      setOpen((previous) => !previous)
    },
  }

  // Clicking anywhere in the empty part of the field lands on the first
  // segment, the way a plain text input would place a caret.
  const handleFieldMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    if (event.target !== event.currentTarget) return
    event.preventDefault()
    coordinator.focusRegion(0)
  }

  return (
    <Popover
      position="bottom"
      state={{ open }}
      onOpenChange={setOpen}
      content={calendar}
    >
      <div ref={ref} className={cn("date-input", css.anchor, className)}>
        {/*
          Popover turns its child into the trigger by injecting an onClick that
          toggles the panel. That anchors the panel to the whole field, which is
          what we want, but a field you type in must not toggle on every click —
          so clicks are stopped here, below the trigger, and the calendar action
          drives `open` directly instead.
        */}
        <div
          className={cn("field", css.field)}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={handleFieldMouseDown}
        >
          <Input
            variant={variant}
            error={error}
            disabled={disabled}
            actions={{ right: [calendarAction] }}
          >
            {isRange ? (
              <>
                <DateSegmentGroup
                  coordinator={coordinator}
                  offset={0}
                  parts={layout.parts}
                  separator={layout.separator}
                  label={label ? `${label} start date` : "Start date"}
                />
                <span className={cn("range-separator", css["range-separator"])} aria-hidden="true">
                  –
                </span>
                <DateSegmentGroup
                  coordinator={coordinator}
                  offset={layout.parts.length}
                  parts={layout.parts}
                  separator={layout.separator}
                  label={label ? `${label} end date` : "End date"}
                />
              </>
            ) : (
              <DateSegmentGroup
                coordinator={coordinator}
                offset={0}
                parts={layout.parts}
                separator={layout.separator}
                label={label ?? "Date"}
              />
            )}
          </Input>
        </div>
      </div>
    </Popover>
  )
})

DateInput.displayName = "Date.Input"

export { DateInput }
