"use client";

import React from "react";
import { createPortal } from "react-dom";
import { FocusScope } from "@react-aria/focus";
import { useOverlayTrigger, useOverlay, useDialog, mergeProps } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { useFloating } from "../../floating/react/useFloating";
import { flip } from "../../floating/core/middleware/flip";
import { offset } from "../../floating/core/middleware/offset";
import { shift } from "../../floating/core/middleware/shift";
import { arrow } from "../../floating/core/middleware/arrow";
import { autoUpdate } from "../../floating/dom/autoUpdate";
import { cn } from "@/lib/cn";
import { type Style } from "@/lib/cn";
import { asElementProps } from "@/lib/react-aria";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Frame } from "../Frame";
import css from "./Popover.module.css";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useControlledState } from "@/hooks/useControlledState";
import { usePresence } from "@/hooks/usePresence";
import { getArrowShapeOffset, getFrameSideFromPlacement } from "@/floating/arrow-positioning";

const ARROW_PATH = "M 0 0 Q 2.5 -1 4 -5.5 Q 6 -9 8 -5.5 Q 9.5 -1 12 0";
const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 8;
const ARROW_PADDING = 8;
const POPOVER_GAP = 2;
const ARROW_POSITIONING_SIZE = 6;

type PopoverPosition = "top" | "right" | "bottom" | "left";
type PopoverAlign = "start" | "center" | "end";

/**
 * Maps placement to initial transform for directional entrance animation.
 * When animating in, the component slides from its placement direction toward the center.
 * For example, "top" placement slides up (-Y) and fades in.
 */
const getInitialTransform = (placement: string): string => {
  switch (placement) {
    case "top":
      return "translateY(3px)";
    case "bottom":
      return "translateY(-3px)";
    case "left":
      return "translateX(3px)";
    case "right":
      return "translateX(-3px)";
    default:
      return "translate(0, 0)";
  }
};

interface PopoverStyleSlots {
  root?: Style;
  content?: Style;
  trigger?: Style;
  frame?: Style;
}

type PopoverStylesProp = StylesProp<PopoverStyleSlots>;

export interface PopoverProps {
  state?: PopoverState;
  children: React.ReactNode;
  /** Content to display inside the popover panel */
  content: React.ReactNode;
  /** Preferred side of the trigger where the popover appears */
  position?: PopoverPosition;
  /** Cross-axis alignment relative to the trigger. "start" and "end" follow reading direction along the trigger's edge; "center" (default) centers the panel over the trigger. */
  align?: PopoverAlign;
  /** Renders and closes the panel with no opacity/translation transition. */
  "disable-animations"?: boolean;
  /** Keyed styles for named component parts. The frame slot controls panel layout such as padding. */
  styles?: PopoverStylesProp;
  /** Additional CSS class for the trigger element. */
  className?: string;
  /** Initial open state. For controlled usage, pass `state={{ open }}`. */
  open?: boolean;
  /** Controlled state. */
  /** @deprecated Use `open`. */
  isOpen?: boolean;
  /** Called when the popover opens or closes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Whether to render a directional arrow pointing at the trigger */
  "show-arrow"?: boolean;
}
export interface PopoverState {
  open?: boolean;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      content,
      position = "bottom",
      align = "center",
      "disable-animations": disableAnimations = false,
      styles,
      className: externalClassName,
      open,
      state: controlledState,
      isOpen: legacyIsOpen,
      onOpenChange,
      "show-arrow": showArrow = false,
    },
    ref,
  ) => {
    const resolvePopoverBaseStyles = createStylesResolver([
      "root",
      "content",
      "trigger",
      "frame",
    ] as const);

    const resolved = resolvePopoverBaseStyles(styles);

    const triggerRef = React.useRef<HTMLDivElement>(null);
    const popoverContentRef = React.useRef<HTMLDivElement>(null);
    const animationRef = React.useRef<HTMLDivElement>(null);
    const [arrowElement, setArrowElement] = React.useState<HTMLDivElement | null>(null);

    const [isOpen, setOpen] = useControlledState(
      controlledState?.open,
      open ?? legacyIsOpen,
      false,
    );
    const state = useOverlayTriggerState({
      isOpen,
      onOpenChange: (next) => {
        setOpen(next);
        onOpenChange?.(next);
      },
    });

    const { triggerProps, overlayProps: triggerOverlayProps } = useOverlayTrigger(
      { type: "dialog" },
      state,
      triggerRef,
    );
    const { overlayProps: dismissOverlayProps } = useOverlay(
      {
        isOpen: state.isOpen,
        onClose: state.close,
        isDismissable: true,
        shouldCloseOnBlur: true,
        shouldCloseOnInteractOutside: (element) => !triggerRef.current?.contains(element),
      },
      popoverContentRef,
    );
    const { dialogProps } = useDialog({}, popoverContentRef);

    const placementMap: Record<PopoverPosition, "top" | "bottom" | "left" | "right"> = {
      top: "top",
      bottom: "bottom",
      left: "left",
      right: "right",
    };

    const requestedPlacement =
      align === "center" ? placementMap[position] : (`${placementMap[position]}-${align}` as const);

    const { refs, floatingStyles, placement, middlewareData, isPositioned } = useFloating({
      placement: requestedPlacement,
      strategy: "fixed",
      transform: false,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(POPOVER_GAP + ARROW_POSITIONING_SIZE),
        flip(),
        shift({ padding: 8 }),
        showArrow ? arrow({ element: arrowElement, padding: ARROW_PADDING }) : null,
      ],
    });

    const frameSide = getFrameSideFromPlacement(placement);
    const shapeOffset = showArrow
      ? getArrowShapeOffset(placement, middlewareData.arrow, {
          width: ARROW_WIDTH,
          height: ARROW_HEIGHT,
        })
      : undefined;

    const { present, state: presenceState, finishExit } = usePresence(
      state.isOpen && isPositioned,
      disableAnimations ? 0 : 150,
      { settleExit: true, elementRef: animationRef },
    );
    const isVisible = presenceState === "entered";

    React.useLayoutEffect(() => {
      refs.setReference(triggerRef.current);
    }, [refs]);

    const mergedRef = useMergeRefs(triggerRef, refs.setReference, ref);

    const mergedContentRef = useMergeRefs(popoverContentRef, refs.setFloating);

    // Convert React Aria's onPress to onClick for native HTML elements
    const nativeProps = React.useMemo(() => {
      const props: any = { ...triggerProps };
      if (props.onPress && typeof props.onPress === "function") {
        const onPress = props.onPress;
        props.onClick = (e: React.MouseEvent) => {
          onPress({
            target: e.currentTarget,
            type: "press",
            pointerType: "mouse",
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
          });
        };
        delete props.onPress;
      }
      return props;
    }, [triggerProps]);

    const triggerElement = React.isValidElement(children) ? (
      React.cloneElement(
        children as React.ReactElement<{
          className?: string;
          ref?: React.Ref<HTMLButtonElement | HTMLDivElement>;
        }>,
        {
          ...nativeProps,
          className: cn(
            (children as React.ReactElement<{ className?: string }>).props.className,
            externalClassName,
            css.trigger,
            resolved.trigger,
          ),
          ref: mergedRef,
        },
      )
    ) : (
      <span
        ref={mergedRef}
        {...nativeProps}
        className={cn(css.trigger, externalClassName, resolved.trigger)}
      >
        {children}
      </span>
    );

    return (
      <>
        {triggerElement}
        {(state.isOpen || present) &&
          createPortal(
            <FocusScope>
            <div
              ref={mergedContentRef}
              {...asElementProps<"div">(
                mergeProps(triggerOverlayProps, dismissOverlayProps, dialogProps)
              )}
              className={cn("popover", css.root, resolved.root)}
              data-state={presenceState}
              style={{
                ...floatingStyles,
              }}
            >
              <div
                ref={animationRef}
                className={cn("content", css.content, resolved.content)}
                data-visible={isVisible ? "true" : "false"}
                data-instant={disableAnimations ? "true" : undefined}
                onTransitionEnd={(event) => {
                  if (event.target === event.currentTarget && event.propertyName === "opacity") {
                    finishExit();
                  }
                }}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translate(0, 0)"
                    : getInitialTransform(placement.split("-")[0]),
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <Frame
                  role="dialog"
                  side={showArrow ? (frameSide ?? position) : position}
                  shapeMode={showArrow ? "extend" : undefined}
                  path={showArrow ? ARROW_PATH : undefined}
                  pathWidth={showArrow ? ARROW_WIDTH : undefined}
                  {...(showArrow && shapeOffset !== undefined ? { shapeOffset } : {})}
                >
                  <div className={cn("frame", css.frame, resolved.frame)}>{content}</div>
                </Frame>
                {showArrow && (
                  <div
                    ref={setArrowElement}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      width: ARROW_WIDTH,
                      height: ARROW_HEIGHT,
                      visibility: "hidden",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            </div>
            </FocusScope>,
            document.body,
          )}
      </>
    );
  },
);

Popover.displayName = "Popover";

export { Popover };
