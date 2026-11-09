"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { toastAnimation } from "./utils/animation";
import { toastMotion } from "./utils/motion";
import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Toast.module.css";
import { ToastProps as ToastData, dispatch } from "./Toast.Store";

import { Info, CircleCheck, TriangleAlert, CircleAlert, type LucideIcon } from "lucide-react";

import { X } from "lucide-react";

const DRAG_DISMISS_THRESHOLD = 100;
const DRAG_LEFT_RESISTANCE = 20;
const SPAWN_OFFSET = 24;

function getSpawnY(element: HTMLElement, direction: "top" | "bottom", boundary?: HTMLElement, scale = 1) {
  if (typeof window === "undefined") return direction === "top" ? -80 : 80;

  const rect = element.getBoundingClientRect();
  const boundaryRect = boundary?.getBoundingClientRect();
  const topBoundary = boundaryRect?.top ?? 0;
  const bottomBoundary = boundaryRect?.bottom ?? window.innerHeight;

  if (direction === "top") {
    return (topBoundary - rect.bottom - SPAWN_OFFSET) / scale;
  }

  return (bottomBoundary - rect.top + SPAWN_OFFSET) / scale;
}

/** Called by the stack after its wrapper coordinates have been established. */
export function animateToastEntrance(
  element: HTMLElement,
  direction: "top" | "bottom",
  boundary?: HTMLElement,
  scale = 1,
) {
  // Clear an interrupted entrance before measuring (including Strict Mode replay).
  toastAnimation.set(element, { y: 0 });
  const fromY = getSpawnY(element, direction, boundary, scale);
  toastAnimation.fromTo(
    element,
    { opacity: 0, y: fromY },
    { opacity: 1, y: 0, ...toastMotion(element, "layout") },
  );
}

interface ToastStyleSlots {
  root?: Style;
  iconWrap?: Style;
  icon?: Style;
  content?: Style;
  title?: Style;
  description?: Style;
  close?: Style;
  closeIcon?: Style;
}

type ToastStylesProp = StylesProp<ToastStyleSlots>;

const resolveToastBaseStyles = createStylesResolver([
  "root",
  "iconWrap",
  "icon",
  "content",
  "title",
  "description",
  "close",
  "closeIcon",
] as const);

function resolveToastStyles(styles: ToastStylesProp | undefined) {
  if (!styles) return resolveToastBaseStyles(styles);

  const { root, iconWrap, icon, content, title, description, close, closeIcon } = styles;

  return resolveToastBaseStyles({
    root,
    iconWrap,
    icon,
    content,
    title,
    description,
    close,
    closeIcon,
  });
}

const toastIcons: Record<string, LucideIcon | null> = {
  danger: TriangleAlert,
  success: CircleCheck,
  info: Info,
  warning: CircleAlert,
  default: null,
};

interface ToastComponentProps {
  /** Toast data object containing content and display options */
  toast: ToastData;
  /** Whether the auto-dismiss timer pauses on mouse hover */
  pauseOnHover?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDismissStart?: () => void;
  /** Lets the stack coordinate close motion and invoke completion. */
  onDismissAnimation?: (complete: () => void) => void;
  onDismissEnd?: () => void;
}

export const Toast = forwardRef<HTMLDivElement, ToastComponentProps>(function Toast(
  {
    toast,
    pauseOnHover = false,
    onDragStart,
    onDragEnd,
    onDismissStart,
    onDismissAnimation,
    onDismissEnd,
  },
  ref,
) {
  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);

  const {
    id,
    title,
    description,
    jsx,
    variant = "default",
    duration = 5000,
    onDismiss,
    position = "bottom-right",
    styles,
  } = toast;

  const resolved = resolveToastStyles(styles);
  const isTop = position.startsWith("top");
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({});
  const closeInteractionProps = mergeProps(
    focusProps,
    hoverProps,
  ) as React.ButtonHTMLAttributes<HTMLButtonElement>;

  // Time tracking refs
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  // Use a ref for paused state to avoid restarting the effect on every hover change
  const isPausedRef = useRef(pauseOnHover);
  useEffect(() => {
    isPausedRef.current = pauseOnHover;
  }, [pauseOnHover]);

  // Drag state refs
  const dragStartXRef = useRef(0);
  const currentDeltaRef = useRef(0);
  const dragPausedRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (innerRef.current) {
      innerRef.current.dataset.dismissing = "true";
      onDismissStart?.();
      const completeDismissal = () => {
        onDismissEnd?.();
        onDismiss?.();
        dispatch({ type: "DISMISS_TOAST", toastId: id });
      };
      toastAnimation.stop(innerRef.current);

      if (onDismissAnimation) {
        onDismissAnimation(completeDismissal);
        dispatch({ type: "CLOSE_TOAST", toastId: id });
        return;
      }

      dispatch({ type: "CLOSE_TOAST", toastId: id });
      toastAnimation.to(innerRef.current, {
        opacity: 0,
        ...toastMotion(innerRef.current, "exit"),
        onComplete: () => {
          completeDismissal();
        },
      });
    } else {
      onDismiss?.();
      dispatch({ type: "DISMISS_TOAST", toastId: id });
    }
  }, [id, onDismiss, onDismissAnimation, onDismissEnd, onDismissStart]);

  useLayoutEffect(
    () => {
      const element = innerRef.current;
      if (!element) return;

      return () => toastAnimation.stop(element);
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (innerRef.current?.dataset.dismissing) return;
      dragStartXRef.current = e.clientX;
      currentDeltaRef.current = 0;
      dragPausedRef.current = true;
      onDragStart?.();
      toastAnimation.stop(innerRef.current);

      const onMove = (ev: PointerEvent) => {
        if (!innerRef.current) return;
        const delta = ev.clientX - dragStartXRef.current;
        currentDeltaRef.current = delta;

        if (delta >= 0) {
          const progress = Math.min(delta / DRAG_DISMISS_THRESHOLD, 1);
          toastAnimation.set(innerRef.current, { x: delta, opacity: 1 - progress * 0.5 });
        } else {
          const x = -DRAG_LEFT_RESISTANCE * (1 - Math.exp(delta / DRAG_LEFT_RESISTANCE));
          toastAnimation.set(innerRef.current, { x, opacity: 1 });
        }
      };

      const onUp = () => {
        dragPausedRef.current = false;
        onDragEnd?.();
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointercancel", onUp);

        const delta = currentDeltaRef.current;
        currentDeltaRef.current = 0;

        if (delta >= DRAG_DISMISS_THRESHOLD) {
          if (innerRef.current) {
            innerRef.current.dataset.dismissing = "true";
            onDismissStart?.();
            // Dispatch CLOSE_TOAST immediately to signal stack adjustment
            dispatch({ type: "CLOSE_TOAST", toastId: id });
            toastAnimation.stop(innerRef.current);
            toastAnimation.to(innerRef.current, {
              x: "+=200",
              opacity: 0,
              ...toastMotion(innerRef.current, "exit"),
              onComplete: () => {
                onDismissEnd?.();
                onDismiss?.();
                // Dispatch DISMISS_TOAST after animation completes
                dispatch({ type: "DISMISS_TOAST", toastId: id });
              },
            });
          } else {
            // If innerRef.current is null, just dismiss immediately
            onDismiss?.();
            dispatch({ type: "DISMISS_TOAST", toastId: id });
          }
        } else if (innerRef.current) {
          toastAnimation.to(innerRef.current, {
            x: 0,
            opacity: 1,
            ...toastMotion(innerRef.current, "layout"),
          });
        }
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    },
    [id, isTop, onDismiss, onDragStart, onDragEnd, onDismissStart, onDismissEnd],
  );

  // Animation Frame Timer Logic
  useEffect(() => {
    if (duration === Infinity || duration <= 0) return;
    lastTimeRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!isPausedRef.current && !dragPausedRef.current) {
        elapsedRef.current += delta;

        if (elapsedRef.current >= duration) {
          handleDismiss();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, handleDismiss]);

  const Icon = toastIcons[variant as keyof typeof toastIcons];

  return (
    <div
      ref={innerRef}
      className={cn("toast", css.root, variant, resolved.root)}
      data-variant={variant}
      role="alert"
      onPointerDown={handlePointerDown}
    >
      {Icon && (
        <div className={cn("icon", css["icon-wrap"], resolved.iconWrap)}>
          <Icon className={cn("glyph", css.icon, resolved.icon)} />
        </div>
      )}
      <div className={cn("content", css.content, resolved.content)}>
        {jsx || (
          <>
            {title && <h4 className={cn("title", css.title, resolved.title)}>{title}</h4>}
            {description && (
              <p className={cn("description", css.description, resolved.description)}>
                {description}
              </p>
            )}
          </>
        )}
        {toast.action}
      </div>
      <button
        {...closeInteractionProps}
        onClick={handleDismiss}
        className={cn("close", css.close, resolved.close)}
        aria-label="Close"
        data-hovered={isHovered ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-focus-visible={isFocusVisible ? "true" : "false"}
      >
        <X className={cn("close-icon", css["close-icon"], resolved.closeIcon)} />
      </button>
    </div>
  );
});
