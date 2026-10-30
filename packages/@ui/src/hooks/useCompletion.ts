"use client";

import * as React from "react";
import type { VirtualElement } from "./useFloat/dom";

type CompletionField = HTMLInputElement | HTMLTextAreaElement;

/**
 * Where the completion menu is anchored inside the text field.
 * `trigger` pins it to the trigger character so it stays put while the query is typed,
 * `caret` follows the caret, and `field` uses the whole field's box.
 * @typeDoc CompletionOrigin
 */
export type CompletionOrigin = "trigger" | "caret" | "field";

/**
 * The trigger token currently being typed before the caret.
 * @typeDoc CompletionMatch
 */
export interface CompletionMatch {
  /** Trigger character that started the token, such as "/" or "@". */
  trigger: string;
  /** Text typed after the trigger, up to the caret. */
  query: string;
  /** Index of the trigger character in the field value. */
  start: number;
  /** Index just past the end of the token, including non-space text after the caret. */
  end: number;
}

/**
 * Keyboard handlers a menu registers so the text field can drive it without moving focus.
 * @typeDoc CompletionNavigator
 */
export interface CompletionNavigator {
  /** Moves the active option down (1) or up (-1). */
  move: (direction: 1 | -1) => void;
  /** Commits the active option. Returns false when nothing was committed. */
  confirm: () => boolean;
}

/**
 * Options for useCompletion.
 * @typeDoc UseCompletionOptions
 */
export interface UseCompletionOptions {
  /** Current field value. */
  value: string;
  /** Receives the next field value after an option is completed. */
  onValueChange: (value: string) => void;
  /** Characters that open the menu when typed at the start of a word.
   * @default ["/"]
   */
  triggers?: string[];
  /** Where the menu is anchored.
   * @default "trigger"
   */
  origin?: CompletionOrigin;
  /** Only match triggers typed at the very start of the value.
   * @default false
   */
  atStart?: boolean;
}

/**
 * Completion state shared between a text field and a Select.Content or Command.Root menu.
 * @typeDoc CompletionController
 */
export interface CompletionController {
  /** The active trigger token, or null when no menu should show. */
  match: CompletionMatch | null;
  /** Whether a token is active and has not been dismissed. */
  open: boolean;
  /** Text typed after the trigger, or an empty string when closed. */
  query: string;
  /** Positioning reference for the menu, derived from origin. Null when closed. */
  anchor: VirtualElement | null;
  /** Spread onto the input or textarea. Compose onKeyDown with your own handler and skip it when event.defaultPrevented. */
  fieldProps: {
    ref: React.RefCallback<CompletionField>;
    onKeyDown: (event: React.KeyboardEvent<CompletionField>) => void;
    onSelect: (event: React.SyntheticEvent<CompletionField>) => void;
  };
  /** Replaces the active token with text and places the caret after it. */
  complete: (text: string) => void;
  /** Hides the menu until a new token is started. */
  dismiss: () => void;
  /** Connects a menu's keyboard handlers. Returns an unregister function. */
  register: (navigator: CompletionNavigator) => () => void;
}

const MIRRORED_STYLES = [
  "boxSizing",
  "width",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "tabSize",
  "textIndent",
  "textTransform",
  "wordSpacing",
] as const;

/** Viewport rect of the character position `index` inside an input or textarea. */
function getCharacterRect(field: CompletionField, index: number) {
  const style = getComputedStyle(field);
  const mirror = document.createElement("div");
  for (const property of MIRRORED_STYLES) mirror.style[property] = style[property];
  const isInput = field.tagName === "INPUT";
  Object.assign(mirror.style, {
    position: "absolute",
    visibility: "hidden",
    top: "0",
    left: "-9999px",
    overflow: "hidden",
    whiteSpace: isInput ? "pre" : "pre-wrap",
    overflowWrap: isInput ? "normal" : "break-word",
  });
  mirror.textContent = field.value.slice(0, index);
  const marker = document.createElement("span");
  marker.textContent = field.value.slice(index) || ".";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);
  const top = marker.offsetTop;
  const left = marker.offsetLeft;
  const height = Number.parseFloat(style.lineHeight) || marker.offsetHeight;
  mirror.remove();

  const fieldRect = field.getBoundingClientRect();
  const x = fieldRect.left + left - field.scrollLeft;
  const y = fieldRect.top + top - field.scrollTop;
  return { x, y, left: x, top: y, right: x, bottom: y + height, width: 0, height };
}

function findMatch(value: string, caret: number, triggers: string[], atStart: boolean) {
  const before = value.slice(0, caret);
  const escaped = triggers.map((trigger) => trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`${atStart ? "^" : "(?:^|\\s)"}(${escaped.join("|")})(\\S*)$`);
  const result = pattern.exec(before);
  if (!result) return null;
  const [, trigger, query] = result;
  const start = caret - query.length - trigger.length;
  const after = /^\S*/.exec(value.slice(caret))?.[0].length ?? 0;
  return { trigger, query, start, end: caret + after };
}

/**
 * Headless trigger-character completion for an input or textarea. Detects tokens like "/cmd"
 * or "@name" before the caret, anchors a menu to them, routes arrow/Enter/Tab/Escape to the
 * connected menu, and swaps the token for the chosen text. Pass the result to
 * Select.Content or Command.Root through their completion prop.
 */
export function useCompletion({
  value,
  onValueChange,
  triggers = ["/"],
  origin = "trigger",
  atStart = false,
}: UseCompletionOptions): CompletionController {
  const fieldRef = React.useRef<CompletionField | null>(null);
  const navigatorRef = React.useRef<CompletionNavigator | null>(null);
  const [caret, setCaret] = React.useState<number | null>(null);
  const [dismissedAt, setDismissedAt] = React.useState<number | null>(null);
  const triggerKey = triggers.join("\u0000");

  const match = React.useMemo(
    () => (caret === null ? null : findMatch(value, Math.min(caret, value.length), triggers, atStart)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, caret, triggerKey, atStart],
  );
  const open = match !== null && match.start !== dismissedAt;

  React.useEffect(() => {
    if (dismissedAt !== null && match?.start !== dismissedAt) setDismissedAt(null);
  }, [dismissedAt, match?.start]);

  const anchorIndex = match ? (origin === "caret" ? (caret ?? match.end) : match.start) : null;
  const anchor = React.useMemo<VirtualElement | null>(() => {
    const field = fieldRef.current;
    if (!open || anchorIndex === null || !field) return null;
    return {
      contextElement: field,
      getBoundingClientRect: () =>
        origin === "field" ? field.getBoundingClientRect() : getCharacterRect(field, anchorIndex),
    };
    // value is a dependency so the anchor re-measures as text reflows.
  }, [open, anchorIndex, origin, value]);

  const syncCaret = React.useCallback((field: CompletionField) => {
    setCaret(field.selectionStart === field.selectionEnd ? field.selectionStart : null);
  }, []);

  const dismiss = React.useCallback(() => {
    if (match) setDismissedAt(match.start);
  }, [match]);

  const complete = React.useCallback(
    (text: string) => {
      if (!match) return;
      const next = value.slice(0, match.start) + text + value.slice(match.end);
      const nextCaret = match.start + text.length;
      onValueChange(next);
      setCaret(nextCaret);
      requestAnimationFrame(() => {
        const field = fieldRef.current;
        if (!field) return;
        field.focus({ preventScroll: true });
        field.setSelectionRange(nextCaret, nextCaret);
      });
    },
    [match, onValueChange, value],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<CompletionField>) => {
      const navigator = navigatorRef.current;
      if (!open || !navigator || event.nativeEvent.isComposing) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        navigator.move(event.key === "ArrowDown" ? 1 : -1);
      } else if ((event.key === "Enter" && !event.shiftKey) || event.key === "Tab") {
        if (navigator.confirm()) event.preventDefault();
      } else if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
    },
    [dismiss, open],
  );

  const ref = React.useCallback((field: CompletionField | null) => {
    fieldRef.current = field;
  }, []);

  const register = React.useCallback((navigator: CompletionNavigator) => {
    navigatorRef.current = navigator;
    return () => {
      if (navigatorRef.current === navigator) navigatorRef.current = null;
    };
  }, []);

  return {
    match,
    open,
    query: open ? (match?.query ?? "") : "",
    anchor,
    fieldProps: {
      ref,
      onKeyDown,
      onSelect: (event) => syncCaret(event.currentTarget),
    },
    complete,
    dismiss,
    register,
  };
}
