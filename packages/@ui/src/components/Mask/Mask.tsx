import * as React from "react";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import styles from "./Mask.module.css";

interface MaskStyleSlots {
  root?: Style;
  gradient?: Style;
}

type MaskStylesProp = StylesProp<MaskStyleSlots>;

export type MaskAs = "div" | "child";

export interface MaskProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "as"> {
  /** Element rendered by Mask. Use child to apply the mask directly to its only content child. */
  as?: MaskAs;
  children: React.ReactNode;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: MaskStylesProp;
}

type MaskFilter =
  | {
      kind: "fade";
      direction: NonNullable<MaskFadeProps["direction"]>;
      intensity: number;
      fixed?: boolean;
    }
  | {
      kind: "scroll-fade";
      axis: "vertical" | "horizontal";
    }
  | {
      kind: "cutout";
      props: MaskCutoutProps;
    };

const resolveMaskBaseStyles = createStylesResolver(["root", "gradient"] as const);

const MaskRoot = React.forwardRef<HTMLDivElement, MaskProps>(
  ({ as = "div", className, children, style, styles: stylesProp, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const maskFilters: MaskFilter[] = [];
    const cutoutExceptions = new Set<NonNullable<MaskCutoutProps["except"]>>();
    let clipPath: string | undefined;
    let hasFixedFade = false;
    const contentChildren: React.ReactNode[] = [];
    const supportsScrollFade = hasScrollFadeVariables(style);
    const resolved = resolveMaskBaseStyles(stylesProp);

    childArray.forEach((child) => {
      if (React.isValidElement(child)) {
        if (child.type === MaskFade) {
          const fadeChild = child as React.ReactElement<MaskFadeProps>;
          if (isScrollFade(fadeChild.props) && supportsScrollFade) {
            maskFilters.push({ kind: "scroll-fade", axis: fadeChild.props.axis ?? "vertical" });
          } else {
            if (fadeChild.props.fixed) hasFixedFade = true;
            maskFilters.push({
              kind: "fade",
              direction: fadeChild.props.direction ?? "bottom",
              intensity: fadeChild.props.intensity ?? 1,
              fixed: fadeChild.props.fixed,
            });
          }
        } else if (child.type === MaskClip) {
          const clipChild = child as React.ReactElement<MaskClipProps>;
          clipPath = clipChild.props.shape;
        } else if (child.type === MaskCutout) {
          const cutoutChild = child as React.ReactElement<MaskCutoutProps>;
          maskFilters.push({ kind: "cutout", props: cutoutChild.props });
          if (cutoutChild.props.except) cutoutExceptions.add(cutoutChild.props.except);
        } else {
          contentChildren.push(child);
        }
      } else {
        contentChildren.push(child);
      }
    });

    const resolvedMaskFilters = maskFilters.map((maskFilter) => generateMaskFilter(maskFilter));

    const maskStyles = {
      ...style,
      ...(hasFixedFade ? { maxHeight: "inherit", overflow: "hidden" as const } : {}),
      ...(clipPath ? ({ "--mask-clip-path": clipPath } as Record<string, string>) : {}),
      ...(resolvedMaskFilters.length > 0
        ? {
            WebkitMaskImage: resolvedMaskFilters.join(", "),
            maskImage: resolvedMaskFilters.join(", "),
            WebkitMaskComposite: resolvedMaskFilters.length > 1 ? "source-in" : "source-over",
            maskComposite: resolvedMaskFilters.length > 1 ? "intersect" : "add",
          }
        : {}),
    } as React.CSSProperties;

    const childTarget =
      contentChildren.length === 1 && React.isValidElement(contentChildren[0])
        ? (contentChildren[0] as React.ReactElement<{
            className?: string;
            style?: React.CSSProperties;
            ref?: React.Ref<HTMLDivElement>;
            "data-mask-cutout-except"?: string;
          }>)
        : null;
    const childRef = mergeRefs(ref, childTarget?.props.ref);
    const cutoutExcept = Array.from(cutoutExceptions).join(" ") || undefined;

    if (as === "child") {
      if (!childTarget) {
        throw new Error('Mask with as="child" expects exactly one valid React element child.');
      }

      return React.cloneElement(childTarget, {
        ...props,
        ref: childRef,
        "data-mask-cutout-except": cutoutExcept,
        className: cn("mask", styles.mask, resolved.root, className, childTarget.props.className),
        style: {
          ...childTarget.props.style,
          ...maskStyles,
        },
      });
    }

    return (
      <div
        {...props}
        ref={ref}
        data-mask-cutout-except={cutoutExcept}
        className={cn("mask", styles.mask, resolved.root, className)}
        style={maskStyles}
      >
        {contentChildren}
      </div>
    );
  },
);

MaskRoot.displayName = "Mask";

interface MaskGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS gradient string applied as the mask image */
  gradient: string;
}

const MaskGradient = React.forwardRef<HTMLDivElement, MaskGradientProps>(
  ({ className, gradient, style, children, ...props }, ref) => {
    const resolved = resolveMaskBaseStyles(undefined);
    const maskStyles = {
      ...style,
      "--mask-gradient": gradient,
    } as React.CSSProperties;

    return (
      <div
        {...props}
        ref={ref}
        className={cn(styles.mask, styles["mask-gradient"], resolved.gradient, className)}
        style={maskStyles}
      >
        {children}
      </div>
    );
  },
);

MaskGradient.displayName = "MaskGradient";

interface MaskFadeProps {
  /** Edge of the container where the fade starts. Omit to use the variable-driven vertical scroll fade preset. */
  direction?: "top" | "bottom" | "left" | "right";
  /** Axis used by the variable-driven scroll fade preset. */
  axis?: "vertical" | "horizontal";
  /** Controls the size of the fade — higher values produce a longer fade */
  intensity?: number;
  /** Uses percentage-based fade size instead of pixel-based, for fixed-height containers */
  fixed?: boolean;
}

const MaskFade: React.FC<MaskFadeProps> = () => null;
MaskFade.displayName = "MaskFade";

function isScrollFade(props: MaskFadeProps): boolean {
  return (
    props.direction === undefined && props.intensity === undefined && props.fixed === undefined
  );
}

function hasScrollFadeVariables(style: React.CSSProperties | undefined): boolean {
  if (!style) return false;

  const styleEntries = style as Record<string, unknown>;
  return (
    "--mask-top-fade" in styleEntries ||
    "--mask-bottom-fade" in styleEntries ||
    "--mask-left-fade" in styleEntries ||
    "--mask-right-fade" in styleEntries
  );
}

function generateMaskFilter(maskFilter: MaskFilter): string {
  if (maskFilter.kind === "cutout") {
    const filter = generateCutoutMask(maskFilter.props);
    return maskFilter.props.except
      ? `var(--mask-cutout-except-${maskFilter.props.except}, ${filter})`
      : filter;
  }

  if (maskFilter.kind === "scroll-fade") {
    if (maskFilter.axis === "horizontal") {
      return "linear-gradient(to right, transparent 0%, black var(--mask-left-fade, 0%), black calc(100% - var(--mask-right-fade, 0%)), transparent 100%)";
    }
    return "linear-gradient(to bottom, transparent 0%, black var(--mask-top-fade, 0%), black calc(100% - var(--mask-bottom-fade, 0%)), transparent 100%)";
  }

  return generateFadeMask(maskFilter.direction, maskFilter.intensity, maskFilter.fixed);
}

type MaskLength = number | string;
type MaskSide = "top" | "bottom" | "left" | "right";

interface MaskCutoutProps {
  /** Shape removed from the mask. */
  shape: "circle";
  /** Diameter of the overlapping shape. Numbers are interpreted as pixels. */
  size: MaskLength;
  /** Extra transparent space around the overlapping shape. */
  clearance?: MaskLength;
  /** Edge crossed by the overlapping shape. */
  side: MaskSide;
  /** Amount of the overlapping shape that sits inside this mask. */
  overlap: MaskLength;
  /** Omits this cutout when the Mask is the first or last sibling. */
  except?: "first" | "last";
}

const MaskCutout: React.FC<MaskCutoutProps> = () => null;
MaskCutout.displayName = "MaskCutout";

function generateCutoutMask({ size, clearance = 0, side, overlap }: MaskCutoutProps): string {
  const diameter = toCssLength(size);
  const gap = toCssLength(clearance);
  const overlapLength = toCssLength(overlap);
  const radius = `calc(${diameter} / 2 + ${gap})`;
  const edgeCenter = `calc(${diameter} / 2 - ${overlapLength})`;
  const position = {
    top: `50% calc(0% - ${edgeCenter})`,
    right: `calc(100% + ${edgeCenter}) 50%`,
    bottom: `50% calc(100% + ${edgeCenter})`,
    left: `calc(0% - ${edgeCenter}) 50%`,
  }[side];

  return `radial-gradient(circle at ${position}, transparent ${radius}, black calc(${radius} + 0.5px))`;
}

function toCssLength(value: MaskLength): string {
  return typeof value === "number" ? `${value}px` : value;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(value);
      else if (ref) ref.current = value;
    });
  };
}

function generateFadeMask(
  direction: string = "bottom",
  intensity: number = 1,
  fixed?: boolean,
): string {
  const fadeSize = fixed
    ? `${Math.min(50, 15 * intensity)}%`
    : `${Math.min(200, 40 * intensity)}px`;
  const directionMap = {
    top: `linear-gradient(to bottom, transparent 0, black ${fadeSize})`,
    bottom: `linear-gradient(to bottom, black calc(100% - ${fadeSize}), transparent 100%)`,
    left: `linear-gradient(to right, transparent 0, black ${fadeSize})`,
    right: `linear-gradient(to right, black calc(100% - ${fadeSize}), transparent 100%)`,
  };
  return directionMap[direction as keyof typeof directionMap] || directionMap.bottom;
}

interface MaskClipProps {
  /** CSS clip-path value applied to the container (e.g. polygon, circle) */
  shape: string;
}

const MaskClip: React.FC<MaskClipProps> = () => null;
MaskClip.displayName = "MaskClip";

const Mask = Object.assign(MaskRoot, {
  Gradient: MaskGradient,
  Fade: MaskFade,
  Clip: MaskClip,
  Cutout: MaskCutout,
});

export { Mask };
