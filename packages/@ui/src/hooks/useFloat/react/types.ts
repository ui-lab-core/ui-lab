import type { ComputePositionConfig, ComputePositionReturn, VirtualElement } from "../dom";
import type * as React from "react";

// Re-export for use in react hook files
export type { ComputePositionConfig };

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type UseFloatingData = Prettify<ComputePositionReturn & { isPositioned: boolean }>;

export type ReferenceType = Element | VirtualElement;

export type UseFloatingReturn<RT extends ReferenceType = ReferenceType> = Prettify<
  UseFloatingData & {
    /**
     * Update the position of the floating element, re-rendering the component
     * if required.
     */
    update: () => void;
    /**
     * Pre-configured positioning styles to apply to the floating element.
     */
    floatingStyles: React.CSSProperties;
    /**
     * Object containing the reference and floating refs and reactive setters.
     */
    refs: {
      /**
       * A React ref to the reference element.
       */
      reference: React.MutableRefObject<RT | null>;
      /**
       * A React ref to the floating element.
       */
      floating: React.MutableRefObject<HTMLElement | null>;
      /**
       * A callback to set the reference element (reactive).
       */
      setReference: (node: RT | null) => void;
      /**
       * A callback to set the floating element (reactive).
       */
      setFloating: (node: HTMLElement | null) => void;
    };
    /**
     * Object containing the reference and floating elements.
     */
    elements: {
      reference: RT | null;
      floating: HTMLElement | null;
    };
  }
>;

export type UseFloatingOptions<RT extends ReferenceType = ReferenceType> = Prettify<
  Partial<ComputePositionConfig> & {
    /**
     * A callback invoked when both the reference and floating elements are
     * mounted, and cleaned up when either is unmounted. This is useful for
     * setting up event listeners (e.g. pass `autoUpdate`).
     */
    whileElementsMounted?: (reference: RT, floating: HTMLElement, update: () => void) => () => void;
    /**
     * Object containing the reference and floating elements.
     */
    elements?: {
      reference?: RT | null;
      floating?: HTMLElement | null;
    };
    /**
     * The `open` state of the floating element to synchronize with the
     * `isPositioned` value.
     *
     * It also gates `whileElementsMounted`: while `open` is explicitly `false`,
     * position tracking is not subscribed at all. Pass it from any consumer
     * that keeps its floating element mounted while closed, or that element
     * will keep recomputing its position on every scroll event for nothing.
     * @default false
     */
    open?: boolean;
    /**
     * Computes position once when the reference and floating elements become
     * available, then leaves it alone: `whileElementsMounted` is not
     * subscribed, so scroll, resize, and layout-shift tracking (and any
     * repositioning they trigger while the floating element's own entrance
     * transition is running) never re-run `update()`. The floating element
     * stays at its original spawn coordinates for the life of that open state.
     * @default false
     */
    pin?: boolean;
    /**
     * Whether to use `transform` for positioning instead of `top` and `left`
     * (layout) in the `floatingStyles` object.
     * @default true
     */
    transform?: boolean;
  }
>;
