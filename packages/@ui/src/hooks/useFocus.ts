import * as React from "react";
import css from "./useFocus.module.css";

interface FocusState {
  visible: boolean;
  focused: boolean;
  transitionRadius: boolean;
  radius: string;
}

interface UseFocusOptions {
  /** Container for absolute positioning context. Required for overlay modes. */
  scopeRef?: React.RefObject<HTMLElement | null>;
  /** Element containing focusable surfaces. Required for overlay modes. */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** CSS selector for focusable surfaces */
  surfaceSelector?: string;
  /** Which element's borderRadius to inherit: the surface itself or closest item wrapper */
  radiusSource?: "surface" | "item";
  /** Positioning mode:
   *  - "track" (default): anchors the indicator to the focused surface with CSS anchor positioning
   *  - "ring": like track but applies inset box-shadow for inner edge focus styling
   *  - "self": indicator covers the scope itself using pure CSS (no JS measurement), immune to subpixel drift at fractional zoom levels. Use when scope === surface.
   *  - "target": applies data-ring directly to the focusable target with no wrapper or indicator element. */
  mode?: "track" | "ring" | "self" | "target";
  /** Additional dependencies to trigger recalculation */
  dependencies?: React.DependencyList;
}

interface UseFocusReturn {
  /** Props to spread on the scope wrapper element */
  scopeProps: {
    className: string;
  };
  /** Props to spread on the indicator element */
  indicatorProps: {
    className: string;
    "data-ring": "true";
    "data-self-target"?: "true";
    "data-ring-inset"?: "true";
    "data-transition-radius"?: "true";
    "data-visible": "true" | undefined;
    "data-focused": "true" | undefined;
    "aria-hidden": "true";
    style: React.CSSProperties;
  };
  /** Props to spread on a focusable element when using target mode */
  targetProps: {
    "data-ring": "true";
    "data-focus-indicator": "target";
    "data-ring-inset"?: "true";
  };
}

const HIDDEN_FOCUS: FocusState = {
  visible: false,
  focused: false,
  transitionRadius: false,
  radius: "0px",
};

export function useFocus({
  scopeRef,
  containerRef,
  surfaceSelector = '[data-focus-surface="true"]',
  radiusSource = "item",
  mode = "track",
  dependencies = [],
}: UseFocusOptions): UseFocusReturn {
  const anchorElementRef = React.useRef<HTMLElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const [focus, setFocus] = React.useState<FocusState>(HIDDEN_FOCUS);
  const usesOverlay = mode !== "target";
  const anchorName = `--focus-${React.useId().replace(/[^\w-]/g, "")}`;

  // Geometry is never measured: the browser positions the indicator against the
  // anchored element during layout, so both snap to device pixels identically
  // and the ring follows the element through resizes, reflows and scrolling.
  const setAnchorElement = React.useCallback(
    (element: HTMLElement | null) => {
      const previous = anchorElementRef.current;
      if (previous === element) return;
      previous?.style.removeProperty("anchor-name");
      element?.style.setProperty("anchor-name", anchorName);
      anchorElementRef.current = element;
    },
    [anchorName],
  );

  const updateFocus = React.useCallback(() => {
    if (!usesOverlay) {
      return;
    }

    const scope = scopeRef?.current;
    const container = containerRef?.current;
    const activeElement = document.activeElement;
    const surface =
      scope &&
      container &&
      activeElement instanceof HTMLElement &&
      container.contains(activeElement)
        ? activeElement.closest(surfaceSelector)
        : null;

    // A descendant that draws its own ring (target mode) owns focus indication,
    // so the surrounding surface stays quiet instead of ringing alongside it.
    const ownsIndicator =
      activeElement instanceof HTMLElement &&
      activeElement !== surface &&
      activeElement.matches('[data-focus-indicator="target"]');

    if (!(surface instanceof HTMLElement) || !container?.contains(surface) || ownsIndicator) {
      // The anchor stays on the last element so the ring fades out in place
      // instead of collapsing to its fallback position mid-transition.
      setFocus((prev) =>
        prev.focused || prev.visible
          ? { ...prev, visible: false, focused: false, transitionRadius: false }
          : prev,
      );
      return;
    }

    // The indicator is shown for any focus so themes can opt into showing it
    // on pointer focus via data-focused; data-visible stays keyboard-only.
    const visible =
      surface.matches('[data-focus-visible="true"]') ||
      surface.querySelector('[data-focus-visible="true"]') !== null;

    if (mode === "self") {
      // Self mode covers the scope via CSS and takes its radius from inherit.
      setFocus((prev) =>
        prev.focused && prev.visible === visible
          ? prev
          : { ...HIDDEN_FOCUS, visible, focused: true },
      );
      return;
    }

    let anchorElement = surface;
    if (radiusSource === "item") {
      const itemWrapper = surface.closest(".item");
      if (itemWrapper instanceof HTMLElement && container.contains(itemWrapper)) {
        anchorElement = itemWrapper;
      }
    }

    const isSameElement = anchorElementRef.current === anchorElement;
    setAnchorElement(anchorElement);

    setFocus({
      visible,
      focused: true,
      transitionRadius: isSameElement,
      radius: window.getComputedStyle(anchorElement).borderRadius,
    });
  }, [scopeRef, containerRef, surfaceSelector, radiusSource, mode, usesOverlay, setAnchorElement]);

  const scheduleFocusUpdate = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updateFocus();
    });
  }, [updateFocus]);

  React.useEffect(() => {
    if (!usesOverlay) return;
    scheduleFocusUpdate();
  }, [usesOverlay, scheduleFocusUpdate, ...dependencies]);

  React.useEffect(() => {
    if (!usesOverlay) return;

    const container = containerRef?.current;
    if (!container) return;

    const handleFocusChange = () => {
      // Self mode updates in the same tick as the focus change. A deferred
      // frame would let a same-tick state change (e.g. a Select closing) paint
      // with the ring briefly missing.
      if (mode === "self") {
        updateFocus();
        return;
      }
      scheduleFocusUpdate();
    };

    // data-focus-visible is committed by React after the focus event, so a
    // focus change alone can read it stale; re-evaluate when it actually lands.
    const focusVisibleObserver = new MutationObserver(handleFocusChange);
    focusVisibleObserver.observe(container, {
      attributes: true,
      attributeFilter: ["data-focus-visible"],
      subtree: true,
    });

    container.addEventListener("focusin", handleFocusChange);
    container.addEventListener("focusout", handleFocusChange);

    return () => {
      focusVisibleObserver.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      container.removeEventListener("focusin", handleFocusChange);
      container.removeEventListener("focusout", handleFocusChange);
      setAnchorElement(null);
    };
  }, [containerRef, scheduleFocusUpdate, updateFocus, mode, usesOverlay, setAnchorElement]);

  const isSelf = mode === "self";
  const isRing = mode === "ring";

  return {
    scopeProps: {
      className: css["focus-scope"],
    },
    indicatorProps: {
      className: css["focus-indicator"],
      "data-ring": "true",
      "data-self-target": isSelf ? "true" : undefined,
      "data-ring-inset": isRing ? "true" : undefined,
      "data-transition-radius": focus.transitionRadius ? "true" : undefined,
      "data-visible": focus.visible ? "true" : undefined,
      "data-focused": focus.focused ? "true" : undefined,
      "aria-hidden": "true",
      style: isSelf
        ? {}
        : ({
            "--focus-anchor": anchorName,
            borderRadius: focus.radius,
          } as React.CSSProperties),
    },
    targetProps: {
      "data-ring": "true",
      "data-focus-indicator": "target",
      "data-ring-inset": isRing ? "true" : undefined,
    },
  };
}
