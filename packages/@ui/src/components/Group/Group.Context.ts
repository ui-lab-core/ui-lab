import { createContext, type RefObject } from "react";
import type { GroupResolvedStyles } from "./group.styles";
import type { GroupOrientation, GroupSpacing } from "./group.types";

export type { GroupOrientation, GroupSpacing };

export interface GroupContextValue {
  isInGroup: boolean;
  groupOrientation: GroupOrientation;
  groupSpacing: GroupSpacing;
  groupIsDisabled: boolean;
  groupValue?: string;
  groupOnChange?: (value: string) => void;
  groupVariant?: string;
  groupStyles: GroupResolvedStyles;
  registerInput?: (
    containerRef: RefObject<HTMLDivElement | null>,
    inputRef: RefObject<HTMLInputElement | null>,
  ) => void;
  unregisterInput?: (containerRef: RefObject<HTMLDivElement | null>) => void;
  activateInput?: () => boolean;
  registerFocusableSurface?: (ref: RefObject<HTMLElement | null>) => void;
  unregisterFocusableSurface?: (ref: RefObject<HTMLElement | null>) => void;
}

export const GroupContext = createContext<GroupContextValue | null>(null);
