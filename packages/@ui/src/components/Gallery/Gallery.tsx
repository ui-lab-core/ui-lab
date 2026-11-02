"use client";

import * as React from "react";
import { mergeProps, useFocusRing, useHover, usePress } from "react-aria";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Grid } from "../Grid";
import css from "./Gallery.module.css";

/** Fixed column count accepted by `columns`, or a per-breakpoint override via {@link GalleryResponsiveColumns}. */
export type GalleryColumns = number;
/** Gap size accepted by `gap`, `gap-x`, and `gap-y`: a design-system gap step, a Tailwind spacing-scale number, or a raw CSS gap value. */
export type GalleryGap = "xs" | "sm" | "md" | "lg" | "xl";
/** Layout direction of a Gallery.Item's view and body, accepted by `orientation`. */
export type GalleryItemOrientation = "vertical" | "horizontal";
/** Fixed row count or `auto`, accepted by `rows`. */
export type GalleryRows = "1" | "2" | "3" | "4" | "5" | "6" | "auto";
/** Per-breakpoint column override accepted by `columns`, applied at the `sm`, `md`, `lg`, and `xl` container-query breakpoints. */
export type GalleryResponsiveColumns = {
  sm?: GalleryColumns;
  md?: GalleryColumns;
  lg?: GalleryColumns;
  xl?: GalleryColumns;
};

/** Style overrides for the Gallery root and named component parts. */
export interface GalleryStyleSlots {
  /** Styles applied to the root grid element. */
  root?: Style;
  /** Styles applied to every Gallery.Item, in addition to each item's own styles. */
  item?: Style;
  /** Styles applied to every Gallery.View, in addition to each view's own styles. */
  view?: Style;
  /** Styles applied to every Gallery.Body, in addition to each body's own styles. */
  body?: Style;
}

export type GalleryStylesProp = StylesProp<GalleryStyleSlots>;

/** Style overrides for the Gallery.Item root. */
export interface GalleryItemStyleSlots {
  /** Styles applied to the rendered anchor, button, or div element. */
  root?: Style;
}

export type GalleryItemStylesProp = StylesProp<GalleryItemStyleSlots>;

/** Style overrides for the Gallery.View root. */
export interface GalleryViewStyleSlots {
  /** Styles applied to the view root element. */
  root?: Style;
}

export type GalleryViewStylesProp = StylesProp<GalleryViewStyleSlots>;

/** Style overrides for the Gallery.Body root. */
export interface GalleryBodyStyleSlots {
  /** Styles applied to the body root element. */
  root?: Style;
}

export type GalleryBodyStylesProp = StylesProp<GalleryBodyStyleSlots>;

export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns in the gallery grid, or a responsive object that changes the column count at the sm, md, lg, and xl container-query breakpoints.
   * @category Core
   * @default 3
   * @typeDoc GalleryResponsiveColumns
   */
  columns?: GalleryColumns | GalleryResponsiveColumns;
  /** Gap between gallery items. A design-system gap step, a Tailwind spacing-scale number, or a raw CSS gap value.
   * @category Core
   * @default "md"
   * @typeDoc GalleryGap
   */
  gap?: GalleryGap | number | string;
  /** Overrides horizontal (column) gap between gallery items, independent of gap.
   * @category Core
   * @typeDoc GalleryGap
   */
  "gap-x"?: GalleryGap | number | string;
  /** Overrides vertical (row) gap between gallery items, independent of gap.
   * @category Core
   * @typeDoc GalleryGap
   */
  "gap-y"?: GalleryGap | number | string;
  /** Number of rows in the gallery grid.
   * @category Core
   * @typeDoc GalleryRows
   */
  rows?: GalleryRows;
  /** Wraps the root in a container-query parent so a responsive columns object changes with the container's width instead of the viewport.
   * @category Core
   * @default false
   */
  responsive?: boolean;
  /** Keyed styles for the root and for every Gallery.Item, Gallery.View, and Gallery.Body rendered inside it. Use className for conventional root classes; use each compound part's own styles prop for a one-off override.
   * @category Styling
   * @typeDoc GalleryStyleSlots
   */
  styles?: GalleryStylesProp;
}

export interface GalleryItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
  /** URL the item links to. Renders the item as an anchor when the item is interactive; has no effect when disabled.
   * @category Link behavior
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href
   */
  href?: string;
  /** Called when the item is activated by press, click, or keyboard selection. Takes precedence over native anchor navigation when href is also set.
   * @category Events
   */
  onPress?: (href?: string) => void;
  /** Disables interaction. A disabled item renders without a role, tab stop, or press/hover behavior, and does not call onPress.
   * @category Core
   * @default false
   */
  disabled?: boolean;
  /** Marks the item as selected. Sets data-selected, and aria-pressed on an interactive, non-link item.
   * @category Core
   * @default false
   */
  selected?: boolean;
  /** Number of grid columns this item spans.
   * @category Core
   */
  columnSpan?: number;
  /** Number of grid rows this item spans.
   * @category Core
   */
  rowSpan?: number;
  /** Controls the item's layout: view and body stack vertically, or sit side by side.
   * @category Core
   * @default "vertical"
   * @typeDoc GalleryItemOrientation
   */
  orientation?: GalleryItemOrientation;
  /** Keyed styles for the rendered anchor, button, or div element. Use className for conventional root classes.
   * @category Styling
   * @typeDoc GalleryItemStyleSlots
   */
  styles?: GalleryItemStylesProp;
}

export interface GalleryViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio of the view area, such as "16/9" or "1/1".
   * @category Core
   * @default "16/9"
   */
  aspectRatio?: string;
  /** Keyed styles for the view root element. Use className for conventional root classes.
   * @category Styling
   * @typeDoc GalleryViewStyleSlots
   */
  styles?: GalleryViewStylesProp;
}

export interface GalleryBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Keyed styles for the body root element. Use className for conventional root classes.
   * @category Styling
   * @typeDoc GalleryBodyStyleSlots
   */
  styles?: GalleryBodyStylesProp;
}

const resolveGalleryBaseStyles = createStylesResolver(["root", "item", "view", "body"] as const);

const resolveGalleryItemBaseStyles = createStylesResolver(["root"] as const);
const resolveGalleryViewBaseStyles = createStylesResolver(["root"] as const);
const resolveGalleryBodyBaseStyles = createStylesResolver(["root"] as const);

function resolveGalleryStyles(
  styles: GalleryStylesProp | undefined,
): ReturnType<typeof resolveGalleryBaseStyles> {
  if (!styles) {
    return resolveGalleryBaseStyles(styles);
  }

  const { root, item, view, body } = styles;
  return resolveGalleryBaseStyles({ root, item, view, body });
}

function resolveGalleryItemStyles(
  styles: GalleryItemStylesProp | undefined,
): ReturnType<typeof resolveGalleryItemBaseStyles> {
  if (!styles) {
    return resolveGalleryItemBaseStyles(styles);
  }

  const { root } = styles;
  return resolveGalleryItemBaseStyles({ root });
}

function resolveGalleryViewStyles(
  styles: GalleryViewStylesProp | undefined,
): ReturnType<typeof resolveGalleryViewBaseStyles> {
  if (!styles) {
    return resolveGalleryViewBaseStyles(styles);
  }

  const { root } = styles;
  return resolveGalleryViewBaseStyles({ root });
}

function resolveGalleryBodyStyles(
  styles: GalleryBodyStylesProp | undefined,
): ReturnType<typeof resolveGalleryBodyBaseStyles> {
  if (!styles) {
    return resolveGalleryBodyBaseStyles(styles);
  }

  const { root } = styles;
  return resolveGalleryBodyBaseStyles({ root });
}

type GalleryResolvedStyles = ReturnType<typeof resolveGalleryStyles>;

const GalleryStylesContext = React.createContext<GalleryResolvedStyles | undefined>(undefined);

const mapColumnsToGrid = (
  columns?: GalleryColumns | GalleryResponsiveColumns,
): GalleryColumns | GalleryResponsiveColumns => {
  if (!columns) return 3;
  if (typeof columns === "object") return columns;
  return columns;
};

const mapGapToGrid = (gap?: GalleryGap | number | string): GalleryGap => {
  if (!gap) return "md";

  if (typeof gap === "string" && ["xs", "sm", "md", "lg", "xl"].includes(gap)) {
    return gap as GalleryGap;
  }

  if (typeof gap === "number") {
    if (gap <= 4) return "xs";
    if (gap <= 8) return "sm";
    if (gap <= 16) return "md";
    if (gap <= 24) return "lg";
    return "xl";
  }

  return "md";
};

const GalleryRoot = React.forwardRef<HTMLDivElement, GalleryProps>(
  (
    {
      columns = 3,
      gap = "md",
      "gap-x": gapX,
      "gap-y": gapY,
      rows,
      responsive,
      className,
      styles: stylesProp,
      children,
      ...props
    },
    ref,
  ) => {
    const resolved = resolveGalleryStyles(stylesProp);

    return (
      <GalleryStylesContext.Provider value={resolved}>
        <Grid
          ref={ref}
          columns={mapColumnsToGrid(columns)}
          gap={mapGapToGrid(gap)}
          gap-x={gapX !== undefined ? mapGapToGrid(gapX) : undefined}
          gap-y={gapY !== undefined ? mapGapToGrid(gapY) : undefined}
          rows={rows}
          containerQueryResponsive={responsive}
          className={cn("gallery", className, resolved.root)}
          {...props}
        >
          {children}
        </Grid>
      </GalleryStylesContext.Provider>
    );
  },
);
GalleryRoot.displayName = "Gallery";

const GalleryItem = React.forwardRef<HTMLElement, GalleryItemProps>(
  (
    {
      href,
      onPress,
      disabled = false,
      selected = false,
      columnSpan,
      rowSpan,
      orientation = "vertical",
      className,
      style,
      styles: stylesProp,
      children,
      tabIndex,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...rest
    },
    ref,
  ) => {
    const inherited = React.useContext(GalleryStylesContext);
    const resolved = resolveGalleryItemStyles(stylesProp);
    const itemRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs(itemRef, ref);
    const isInteractive = !disabled && (href !== undefined || onPress !== undefined);
    const isAnchor = isInteractive && href !== undefined;
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({ isDisabled: !isInteractive });
    const { pressProps, isPressed } = usePress({
      isDisabled: !isInteractive,
      onPress: () => onPress?.(href),
    });
    const { targetProps } = useFocus({ mode: "target" });

    const spanStyles: React.CSSProperties = {
      ...(columnSpan ? { gridColumn: `span ${columnSpan}` } : {}),
      ...(rowSpan ? { gridRow: `span ${rowSpan}` } : {}),
      ...style,
    };

    const hasAccessibleName =
      Boolean(ariaLabel) || Boolean(ariaLabelledby) || React.Children.count(children) > 0;

    const stateProps = {
      "data-selected": selected ? "true" : undefined,
      "data-disabled": disabled ? "true" : undefined,
      "data-focused": isFocused ? "true" : undefined,
      "data-focus-visible": isFocusVisible ? "true" : undefined,
      "data-hovered": isHovered ? "true" : undefined,
      "data-pressed": isPressed ? "true" : undefined,
      "data-orientation": orientation,
    } as const;

    const itemClassName = cn("item", css.item, inherited?.item, resolved.root, className);

    if (isAnchor) {
      return (
        <a
          {...mergeProps(focusProps, hoverProps, pressProps, rest)}
          {...targetProps}
          ref={mergedRef as React.Ref<HTMLAnchorElement>}
          href={href}
          className={itemClassName}
          style={spanStyles}
          tabIndex={tabIndex ?? 0}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          {...stateProps}
          onClick={(event) => {
            if (onPress) {
              event.preventDefault();
              onPress(href);
            }
          }}
        >
          {children}
        </a>
      );
    }

    if (isInteractive) {
      return (
        <div
          {...mergeProps(focusProps, hoverProps, pressProps, rest)}
          {...targetProps}
          ref={mergedRef as React.Ref<HTMLDivElement>}
          role="button"
          tabIndex={tabIndex ?? 0}
          className={itemClassName}
          style={spanStyles}
          aria-label={hasAccessibleName ? ariaLabel : "Gallery item"}
          aria-labelledby={ariaLabelledby}
          aria-pressed={selected ? true : undefined}
          {...stateProps}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        {...rest}
        ref={mergedRef as React.Ref<HTMLDivElement>}
        tabIndex={tabIndex}
        className={itemClassName}
        style={spanStyles}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        {...stateProps}
      >
        {children}
      </div>
    );
  },
);
GalleryItem.displayName = "Gallery.Item";

const GalleryView = React.forwardRef<HTMLDivElement, GalleryViewProps>(
  ({ aspectRatio = "16/9", className, style, styles: stylesProp, children, ...props }, ref) => {
    const inherited = React.useContext(GalleryStylesContext);
    const resolved = resolveGalleryViewStyles(stylesProp);

    return (
      <div
        ref={ref}
        className={cn("view", css.view, inherited?.view, resolved.root, className)}
        style={
          {
            "--aspect-ratio": aspectRatio,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    );
  },
);
GalleryView.displayName = "Gallery.View";

const GalleryBody = React.forwardRef<HTMLDivElement, GalleryBodyProps>(
  ({ className, styles: stylesProp, children, ...props }, ref) => {
    const inherited = React.useContext(GalleryStylesContext);
    const resolved = resolveGalleryBodyStyles(stylesProp);

    return (
      <div
        ref={ref}
        className={cn("body", css.body, inherited?.body, resolved.root, className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GalleryBody.displayName = "Gallery.Body";

const Gallery = Object.assign(GalleryRoot, {
  Item: GalleryItem,
  View: GalleryView,
  Body: GalleryBody,
});

export { Gallery, GalleryItem, GalleryView, GalleryBody };
