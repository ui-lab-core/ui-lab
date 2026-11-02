"use client";

import * as React from "react";

import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";

import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Tooltip } from "@/components/Tooltip";
import css from "./Anchor.module.css";

/** Line treatment drawn by an Anchor.Underline. */
export type AnchorUnderlineVariant = "solid" | "dashed" | "dotted";

/**
 * Line treatment drawn beneath the Anchor label. `none` renders no underline,
 * for anchors that wrap block content such as a card.
 */
export type AnchorVariant = AnchorUnderlineVariant | "none";

/** Class-based slots for the Anchor preview overlay. */
export interface AnchorPreviewStyleSlots {
  /** The portaled overlay element that positions the preview. */
  root?: Style;
  /** The preview surface rendered inside the overlay. */
  content?: Style;
}

/** Keyed class names for Anchor preview anatomy. */
export type AnchorPreviewStylesProp = StylesProp<AnchorPreviewStyleSlots>;
/** Names of stable Anchor preview style slots. */
export type AnchorPreviewStyleSlot = keyof AnchorPreviewStyleSlots;

/**
 * Shared or keyed styles for the Anchor preview overlay. A shared class applies
 * to every preview slot; use the keyed form to address one slot.
 */
export type AnchorPreviewStyleValue = Style | AnchorPreviewStyleSlots;

/** Class-based slots for the Anchor root and stable compound anatomy. */
export interface AnchorStyleSlots {
  /** The rendered anchor or span root element. */
  root?: Style;
  /** The underline drawn beneath the label. */
  underline?: Style;
  /** Shared or keyed anatomy for the hover preview overlay. */
  preview?: AnchorPreviewStyleValue;
}

/** Keyed class names for Anchor anatomy. */
export type AnchorStylesProp = StylesProp<AnchorStyleSlots>;
/** Names of stable Anchor root and compound style slots. */
export type AnchorStyleSlot = keyof AnchorStyleSlots;

const ANCHOR_STYLE_SLOTS = ["root", "underline", "preview.root", "preview.content"] as const;

const resolveAnchorStyles = createStylesResolver(ANCHOR_STYLE_SLOTS);

// The underline is a 1px horizontal rule, so a single mask tile per variant
// covers every rendered case. Tiles repeat along the inline axis.
const UNDERLINE_MASK_TILES: Record<Exclude<AnchorUnderlineVariant, "solid">, string> = {
  dashed:
    "%3Csvg width='12' height='1' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='8' height='1' fill='%23ffffff'/%3E%3C/svg%3E",
  dotted:
    "%3Csvg width='3' height='1' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='0.5' cy='0.5' r='0.5' fill='%23ffffff'/%3E%3C/svg%3E",
};

function getUnderlineMaskStyle(variant: AnchorUnderlineVariant): React.CSSProperties {
  if (variant === "solid") return {};

  const maskImage = `url("data:image/svg+xml,${UNDERLINE_MASK_TILES[variant]}")`;

  return {
    WebkitMaskImage: maskImage,
    maskImage,
    WebkitMaskRepeat: "repeat-x",
    maskRepeat: "repeat-x",
  };
}

type CompoundComponentType = {
  displayName?: string;
  name?: string;
  render?: { displayName?: string; name?: string };
};

// Compound parts survive re-exports and HMR wrappers that break identity
// checks, so fall back to the dotted display name the part declares.
function matchesCompoundComponent(
  childType: React.JSXElementConstructor<any> | string | undefined,
  component: React.JSXElementConstructor<any>,
  displayName: string | undefined,
): boolean {
  if (!childType || typeof childType === "string" || !displayName) return false;
  if (childType === component) return true;

  const componentType = childType as CompoundComponentType;

  return (
    componentType.displayName === displayName ||
    componentType.name === displayName ||
    componentType.render?.displayName === displayName ||
    componentType.render?.name === displayName
  );
}

/** Declares the hover preview content for an Anchor. Renders nothing itself. */
export interface AnchorPreviewProps {
  /** Content shown in the preview overlay when the Anchor is hovered or focused.
   * @category Content
   */
  children: React.ReactNode;
}

/**
 * Declarative marker for Anchor preview content. Anchor reads its children and
 * renders them in the preview overlay; the element itself renders nothing.
 */
export function AnchorPreview(_props: AnchorPreviewProps) {
  return null;
}
AnchorPreview.displayName = "Anchor.Preview";

export interface AnchorUnderlineProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Line treatment drawn for this underline, overriding the Anchor root variant.
   * @category Core
   * @default solid
   */
  variant?: AnchorUnderlineVariant;
}

/**
 * The underline drawn beneath an Anchor label. Anchor renders one automatically;
 * supply this part explicitly to override its variant or props.
 */
const AnchorUnderline = React.forwardRef<HTMLSpanElement, AnchorUnderlineProps>(
  ({ className, variant = "solid", style, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cn(css.underline, className)}
      data-slot="underline"
      data-variant={variant}
      aria-hidden="true"
      style={{ ...getUnderlineMaskStyle(variant), ...style }}
    />
  ),
);
AnchorUnderline.displayName = "Anchor.Underline";

export interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Anchor label content. Supply Anchor.Preview or Anchor.Underline to configure those parts.
   * @category Content
   */
  children?: React.ReactNode;
  /** Destination URL. Anchor renders a span instead of a link when omitted.
   * @category Link behavior
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href
   */
  href?: string;
  /** Browsing context the link opens in.
   * @category Link behavior
   * @default _blank
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
   */
  target?: React.HTMLAttributeAnchorTarget;
  /** Relationship between the current document and the destination. Defaults to noopener noreferrer when target is _blank.
   * @category Link behavior
   * @mdn https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel
   */
  rel?: string;
  /** Line treatment drawn beneath the label. Applies to the generated underline; an explicit Anchor.Underline keeps its own variant. `none` omits the generated underline.
   * @category Core
   * @default solid
   */
  variant?: AnchorVariant;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes.
   * @category Styling
   * @typeDoc AnchorStyleSlots
   */
  styles?: AnchorStylesProp;
  /** Preview content shown in an overlay on hover or keyboard focus. Prefer this over Anchor.Preview in server components.
   * @category Content
   */
  preview?: React.ReactNode;
}

const AnchorRoot = React.forwardRef<HTMLAnchorElement | HTMLSpanElement, AnchorProps>(
  (
    {
      className,
      children,
      href,
      target = "_self",
      rel,
      variant = "solid",
      styles,
      preview: previewProp,
      ...props
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLAnchorElement | HTMLSpanElement>(null);
    const mergedRef = useMergeRefs(rootRef, ref);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing();
    const { hoverProps, isHovered } = useHover({});
    const { scopeProps, indicatorProps } = useFocus({
      scopeRef: rootRef,
      containerRef: rootRef,
      surfaceSelector: '[data-anchor-focus-surface="true"]',
      radiusSource: "surface",
      mode: "self",
    });

    const resolved = resolveAnchorStyles(styles);

    let previewContent: React.ReactNode = previewProp ?? null;
    let hasUnderline = false;
    const content: React.ReactNode[] = [];

    // Anchor.Preview is a declarative marker: read its children and drop it from
    // the rendered output. Anchor.Underline is rendered, with the resolved slot
    // class injected so styles.underline reaches a consumer-supplied part too.
    React.Children.forEach(React.Children.toArray(children), (child) => {
      if (!React.isValidElement(child)) {
        content.push(child);
        return;
      }

      if (matchesCompoundComponent(child.type, AnchorPreview, AnchorPreview.displayName)) {
        if (!previewProp) previewContent = (child.props as AnchorPreviewProps).children;
        return;
      }

      if (matchesCompoundComponent(child.type, AnchorUnderline, AnchorUnderline.displayName)) {
        hasUnderline = true;
        const underline = child as React.ReactElement<AnchorUnderlineProps>;
        content.push(
          React.cloneElement(underline, {
            className: cn(underline.props.className, resolved.underline),
          }),
        );
        return;
      }

      content.push(child);
    });

    if (!hasUnderline && variant !== "none") {
      content.push(
        <AnchorUnderline
          key="underline"
          className={resolved.underline}
          variant={variant as AnchorUnderlineVariant}
        />,
      );
    }

    const rootClassName = cn(
      "anchor",
      variant,
      css.anchor,
      scopeProps.className,
      className,
      resolved.root,
    );
    const rootProps = {
      className: rootClassName,
      "data-slot": "root",
      "data-anchor-focus-surface": "true",
      "data-variant": variant,
      "data-hovered": isHovered ? "true" : "false",
      "data-focused": isFocused ? "true" : "false",
      "data-focus-visible": isFocusVisible ? "true" : "false",
    } as const;
    const interactionProps = mergeProps(props, focusProps, hoverProps);
    const indicator = <span {...indicatorProps} data-focus-indicator="local" />;

    const trigger = href ? (
      <a
        {...(interactionProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...rootProps}
        ref={mergedRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      >
        {indicator}
        {content}
      </a>
    ) : (
      <span
        {...(interactionProps as React.HTMLAttributes<HTMLSpanElement>)}
        {...rootProps}
        ref={mergedRef as React.Ref<HTMLSpanElement>}
      >
        {indicator}
        {content}
      </span>
    );

    if (!previewContent) return trigger;

    return (
      <Tooltip
        content={previewContent}
        show-arrow
        position="top"
        styles={{ root: resolved["preview.root"], content: resolved["preview.content"] }}
      >
        {trigger}
      </Tooltip>
    );
  },
);
AnchorRoot.displayName = "Anchor";

const Anchor = Object.assign(AnchorRoot, {
  Preview: AnchorPreview,
  Underline: AnchorUnderline,
});

export { Anchor, AnchorUnderline };
