"use client";

import React from "react";
import {
  PanelProps,
  PanelSidebarProps,
  PanelToggleProps,
  PanelResizeProps,
  PanelContextValue,
  PanelSidebarRegistration,
} from "./panel.types";
import { PanelContext, usePanelContext } from "./panel.context";
import { cn } from "../../lib/utils";
import { createStylesResolver } from "../../lib/styles";
import { useMergeRefs } from "../../hooks/useMergeRefs";
import styles from "./Panel.module.css";

const resolveStyles = createStylesResolver(["root"] as const);

function toSize(value: string | number) {
  return typeof value === "number" ? `${value}px` : value;
}

const PanelRoot = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      orientation = "horizontal",
      spacing = "md",
      variant = "default",
      collapseAt,
      className,
      children,
      styles: stylesProp,
      ...props
    },
    ref,
  ) => {
    const [isStacked, setIsStacked] = React.useState(false);
    const [sidebars, setSidebars] = React.useState<Record<string, PanelSidebarRegistration>>({});
    const containerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(containerRef, ref);

    React.useEffect(() => {
      const container = containerRef.current;
      if (
        !container ||
        orientation !== "horizontal" ||
        collapseAt === undefined ||
        typeof ResizeObserver === "undefined"
      ) {
        setIsStacked(false);
        return;
      }

      const update = (width: number) => setIsStacked(width < collapseAt);
      update(container.getBoundingClientRect().width || container.clientWidth);

      const observer = new ResizeObserver(([entry]) => {
        update(entry?.contentRect.width ?? container.clientWidth);
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, [collapseAt, orientation]);

    const registerSidebar = React.useCallback((id: string, sidebar: PanelSidebarRegistration) => {
      setSidebars((current) => {
        const existing = current[id];
        if (existing?.open === sidebar.open && existing.setOpen === sidebar.setOpen) return current;
        return { ...current, [id]: sidebar };
      });
    }, []);

    const unregisterSidebar = React.useCallback((id: string) => {
      setSidebars((current) => {
        if (!(id in current)) return current;
        const next = { ...current };
        delete next[id];
        return next;
      });
    }, []);

    const effectiveOrientation = isStacked ? "vertical" : orientation;
    const contextValue = React.useMemo<PanelContextValue>(
      () => ({
        orientation: effectiveOrientation,
        isStacked,
        containerRef,
        sidebars,
        registerSidebar,
        unregisterSidebar,
      }),
      [effectiveOrientation, isStacked, sidebars, registerSidebar, unregisterSidebar],
    );
    const spacingClass = {
      none: styles.spacingNone,
      sm: styles.spacingSm,
      md: styles.spacingMd,
      lg: styles.spacingLg,
    }[spacing];
    const resolved = resolveStyles(stylesProp);

    return (
      <PanelContext.Provider value={contextValue}>
        <div
          ref={mergedRef}
          className={cn(
            styles.panel,
            spacingClass,
            variant === "compact" && styles.compact,
            className,
            resolved.root,
          )}
          data-orientation={effectiveOrientation}
          data-spacing={spacing}
          data-variant={variant}
          data-stacked={isStacked || undefined}
          {...props}
        >
          {children}
        </div>
      </PanelContext.Provider>
    );
  },
);

PanelRoot.displayName = "Panel";

const PanelSidebar = React.forwardRef<HTMLElement, PanelSidebarProps>(
  (
    {
      side = "left",
      open,
      defaultOpen = true,
      onOpenChange,
      size = 240,
      collapsedSize = 0,
      className,
      id: providedId,
      style,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const id = providedId ?? `panel-${generatedId.replace(/:/g, "")}-sidebar`;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const sidebarOpen = open ?? internalOpen;
    const { registerSidebar, unregisterSidebar } = usePanelContext();

    const setSidebarOpen = React.useCallback(
      (next: boolean) => {
        if (next === sidebarOpen) return;
        if (open === undefined) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [onOpenChange, open, sidebarOpen],
    );

    React.useEffect(() => {
      registerSidebar(id, { open: sidebarOpen, setOpen: setSidebarOpen });
      return () => unregisterSidebar(id);
    }, [id, registerSidebar, setSidebarOpen, sidebarOpen, unregisterSidebar]);

    const customStyle = {
      "--size": toSize(size),
      "--collapsed-size": toSize(collapsedSize),
      ...style,
    } as React.CSSProperties;

    return (
      <aside
        ref={ref}
        id={id}
        className={cn(styles.sidebar, className)}
        data-open={sidebarOpen}
        data-side={side}
        aria-hidden={!sidebarOpen}
        style={customStyle}
        {...props}
      />
    );
  },
);

PanelSidebar.displayName = "Panel.Sidebar";

const PanelToggle = React.forwardRef<HTMLElement, PanelToggleProps>(
  ({ children, className, onClick, onKeyDown, "aria-controls": ariaControls, ...props }, ref) => {
    const { sidebars } = usePanelContext();
    const sidebar = sidebars[ariaControls];
    const child = React.Children.only(children);
    const childProps = child.props as React.HTMLAttributes<HTMLElement> & {
      type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
    };
    const tag = typeof child.type === "string" ? child.type : undefined;
    const nativeInteractive = tag === "button" || tag === "a" || tag === "input";

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      childProps.onClick?.(event);
      if (!event.defaultPrevented) onClick?.(event);
      if (!event.defaultPrevented) sidebar?.setOpen(!sidebar.open);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event);
      if (!event.defaultPrevented) onKeyDown?.(event);
      if (
        !event.defaultPrevented &&
        !nativeInteractive &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        sidebar?.setOpen(!sidebar.open);
      }
    };

    return React.cloneElement(child, {
      ...props,
      ref,
      className: cn(childProps.className, className),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "aria-expanded": sidebar?.open ?? false,
      "aria-controls": ariaControls,
      role: nativeInteractive ? childProps.role : (childProps.role ?? "button"),
      tabIndex: nativeInteractive ? childProps.tabIndex : (childProps.tabIndex ?? 0),
      ...(tag === "button" && childProps.type === undefined ? { type: "button" } : {}),
    } as React.HTMLAttributes<HTMLElement>);
  },
);

PanelToggle.displayName = "Panel.Toggle";

function numericConstraint(value: string, referenceSize: number, fallback: number) {
  if (value === "none" || value === "auto") return fallback;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return value.trim().endsWith("%") ? (parsed / 100) * referenceSize : parsed;
}

const PanelResize = React.forwardRef<HTMLDivElement, PanelResizeProps>(
  (
    {
      className,
      onPointerDown,
      onKeyDown,
      "aria-controls": ariaControls,
      "aria-label": ariaLabel = "Resize panels",
      keyboardStep = 5,
      ...props
    },
    ref,
  ) => {
    const { orientation, containerRef } = usePanelContext();
    const [isDragging, setIsDragging] = React.useState(false);
    const [value, setValue] = React.useState(50);
    const resizeRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(resizeRef, ref);
    const pointerIdRef = React.useRef<number | null>(null);
    const grabOffsetRef = React.useRef(0);

    const getRegions = React.useCallback(() => {
      const container = containerRef.current;
      const [firstId, secondId] = ariaControls.trim().split(/\s+/);
      if (!container || !firstId || !secondId) return;
      const first = container.ownerDocument.getElementById(firstId);
      const second = container.ownerDocument.getElementById(secondId);
      if (
        !first ||
        !second ||
        first.parentElement !== container ||
        second.parentElement !== container
      )
        return;
      return [first, second] as const;
    }, [ariaControls, containerRef]);

    const resizeBy = React.useCallback(
      (delta: number, unit: "pixel" | "percent" = "pixel") => {
        const regions = getRegions();
        if (!regions) return;
        const [first, second] = regions;
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        const firstSize = orientation === "horizontal" ? firstRect.width : firstRect.height;
        const secondSize = orientation === "horizontal" ? secondRect.width : secondRect.height;
        const total = firstSize + secondSize;
        if (total <= 0) return;
        const container = containerRef.current;
        const containerRect = container?.getBoundingClientRect();
        const referenceSize =
          (orientation === "horizontal" ? containerRect?.width : containerRect?.height) || total;

        const firstStyles = getComputedStyle(first);
        const secondStyles = getComputedStyle(second);
        const minimumProperty = orientation === "horizontal" ? "minWidth" : "minHeight";
        const maximumProperty = orientation === "horizontal" ? "maxWidth" : "maxHeight";
        const minimum = Math.max(
          numericConstraint(firstStyles[minimumProperty], referenceSize, 0),
          total -
            numericConstraint(
              secondStyles[maximumProperty],
              referenceSize,
              Number.POSITIVE_INFINITY,
            ),
        );
        const maximum = Math.min(
          numericConstraint(firstStyles[maximumProperty], referenceSize, Number.POSITIVE_INFINITY),
          total - numericConstraint(secondStyles[minimumProperty], referenceSize, 0),
        );
        const pixels = unit === "percent" ? (delta / 100) * total : delta;
        const next = Math.max(minimum, Math.min(maximum, firstSize + pixels));

        first.style.flex = `0 0 ${next}px`;
        second.style.flex = `0 0 ${total - next}px`;
        setValue((next / total) * 100);
      },
      [getRegions, orientation],
    );

    React.useEffect(() => {
      if (!isDragging) return;
      const move = (event: PointerEvent) => {
        if (event.pointerId !== pointerIdRef.current) return;
        const resize = resizeRef.current;
        if (!resize) return;
        const position = orientation === "horizontal" ? event.clientX : event.clientY;
        const rect = resize.getBoundingClientRect();
        const handlePosition = orientation === "horizontal" ? rect.left : rect.top;
        resizeBy(position - handlePosition - grabOffsetRef.current);
      };
      const stop = (event: PointerEvent) => {
        if (event.pointerId !== pointerIdRef.current) return;
        pointerIdRef.current = null;
        setIsDragging(false);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
      };
    }, [isDragging, orientation, resizeBy]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented || event.button !== 0 || !getRegions()) return;
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const position = orientation === "horizontal" ? event.clientX : event.clientY;
      const handlePosition = orientation === "horizontal" ? rect.left : rect.top;
      pointerIdRef.current = event.pointerId;
      grabOffsetRef.current = position - handlePosition;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setIsDragging(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const previous = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
      const next = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
      let delta: number | undefined;
      if (event.key === previous) delta = -keyboardStep;
      if (event.key === next) delta = keyboardStep;
      if (event.key === "Home") delta = -100;
      if (event.key === "End") delta = 100;
      if (delta === undefined) return;
      event.preventDefault();
      resizeBy(delta, "percent");
    };

    return (
      <div
        ref={mergedRef}
        role="separator"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-controls={ariaControls}
        className={cn(styles.resize, className)}
        data-resizing={isDragging}
        data-orientation={orientation}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

PanelResize.displayName = "Panel.Resize";

export const Panel = Object.assign(PanelRoot, {
  Sidebar: PanelSidebar,
  Toggle: PanelToggle,
  Resize: PanelResize,
});

export { PanelContext };
