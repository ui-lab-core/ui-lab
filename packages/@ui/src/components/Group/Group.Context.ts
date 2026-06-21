import { createContext, type RefObject } from "react"

export type GroupOrientation = "horizontal" | "vertical"
export type GroupSpacing = "none" | "xs" | "sm"

export interface GroupContextValue {
  isInGroup: boolean
  groupOrientation: GroupOrientation
  groupSpacing: GroupSpacing
  groupIsDisabled: boolean
  groupValue?: string
  groupOnChange?: (value: string) => void
  groupVariant?: string
  groupStyles: Record<string, string>
  registerInput?: (containerRef: RefObject<HTMLDivElement | null>, inputRef: RefObject<HTMLInputElement | null>) => void
  unregisterInput?: (containerRef: RefObject<HTMLDivElement | null>) => void
  activateInput?: () => boolean
  registerFocusableSurface?: (ref: RefObject<HTMLElement | null>) => void
  unregisterFocusableSurface?: (ref: RefObject<HTMLElement | null>) => void
}

export const GroupContext = createContext<GroupContextValue | null>(null)
