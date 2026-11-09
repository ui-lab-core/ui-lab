"use client";

import React, { useMemo, useEffect, useLayoutEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useToastStore, ToastPosition, ToastProps } from "./Toast.Store";
import { Toast, animateToastEntrance } from "./Toast";
import { toastAnimation } from "./utils/animation";
import { toastMotion } from "./utils/motion";

const GAP = 14;
const MAX_VISIBLE = 3;
const STANDALONE_DISMISS_OFFSET = 20;

interface StackTarget {
  id: string;
  element: HTMLElement;
  y: number;
  scale: number;
  opacity: number;
}

function readAnimationNumber(
  element: HTMLElement,
  property: "y" | "scale" | "opacity",
  fallback: number,
) {
  const value = toastAnimation.getProperty(element, property);
  const number = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(number) ? number : fallback;
}

const positionConfig: Record<
  ToastPosition,
  {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  }
> = {
  "top-left": { top: "1.5rem", left: "1.5rem" },
  top: { top: "1.5rem", left: "50%", transform: "translateX(-50%)" },
  "top-right": { top: "1.5rem", right: "1.5rem" },
  "bottom-left": { bottom: "1.5rem", left: "1.5rem" },
  bottom: { bottom: "1.5rem", left: "50%", transform: "translateX(-50%)" },
  "bottom-right": { bottom: "1.5rem", right: "1.5rem" },
};

const activePositions = new Map<string, symbol>();

export type ToastPortalContainer = HTMLElement | null | (() => HTMLElement | null);

export interface ToasterProps {
  /**
   * Element that receives the Toast portal. Defaults to document.body.
   * A custom container must establish a containing block, for example with
   * position: relative. The container also owns any desired overflow clipping.
   * Pass null while a target is unavailable to avoid rendering the portal.
   */
  container?: ToastPortalContainer;
  /** Channel rendered by this Toaster. Omit to use the default channel. */
  toasterId?: string;
}

interface ToastContainerProps {
  position: ToastPosition;
  toasts: ToastProps[];
  positioning: "fixed" | "absolute";
  boundary?: HTMLElement;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position,
  toasts,
  positioning,
  boundary,
}) => {
  const config = positionConfig[position];
  const toastRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const isTop = position.includes("top");

  useLayoutEffect(() => {
    const container = containerRef.current;
    const toastElements = toastRefsMap.current;
    return () => {
      toastAnimation.stop(container);
      toastElements.forEach((element) => toastAnimation.stop(element));
      prevVisibleIdsRef.current = new Set();
    };
  }, []);

  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const isDismissingCountRef = useRef(0);
  const isMouseInContainerRef = useRef(false);
  const prevVisibleIdsRef = useRef<Set<string>>(new Set());
  const pendingDismissalsRef = useRef<Map<string, () => void>>(new Map());

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = () => {
    isMouseInContainerRef.current = true;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovering(true);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    isMouseInContainerRef.current = false;
    if (isDraggingRef.current || isDismissingCountRef.current > 0) return;
    hoverTimeoutRef.current = setTimeout(() => setIsHovering(false), 200);
  };

  useLayoutEffect(() => {
    const currentActiveIds = new Set(toasts.map((t) => t.id));
    const openToasts = toasts.filter((t) => t.open);
    const targets: StackTarget[] = [];
    const entrances: Array<{ target: StackTarget; direction: "top" | "bottom" }> = [];

    let cumulativeY = 0;
    let activeIndex = 0; // Track visual index separately from array index

    toasts.forEach((toast) => {
      const el = toastRefsMap.current.get(toast.id);
      if (!el) return;

      if (!toast.open) {
        el.style.pointerEvents = "none";
        return;
      }

      const isNewlyVisible = !prevVisibleIdsRef.current.has(toast.id);
      const height = el.offsetHeight || 60;

      let y = 0;
      let scale = 1;
      let opacity = 1;
      let pointerEvents = "auto";

      if (isHovering) {
        if (activeIndex <= MAX_VISIBLE) {
          y = cumulativeY * (isTop ? 1 : -1);
          scale = 1;
          opacity = 1;
          cumulativeY += height + GAP;
        } else {
          y = cumulativeY * (isTop ? 1 : -1);
          scale = 0.9;
          opacity = 0;
          pointerEvents = "none";
        }
      } else {
        if (activeIndex === 0) {
          y = 0;
          scale = 1;
          opacity = 1;
        } else if (activeIndex === 1) {
          y = GAP * (isTop ? 1 : -1);
          scale = 0.96;
          opacity = 1;
        } else if (activeIndex === 2) {
          y = GAP * 2 * (isTop ? 1 : -1);
          scale = 0.92;
          opacity = 1;
        } else {
          y = GAP * 2 * (isTop ? 1 : -1);
          scale = 0.92;
          opacity = 0;
          pointerEvents = "none";
        }
      }

      const target = { id: toast.id, element: el, y, scale, opacity };
      if (isNewlyVisible) {
        // Only the inner toast enters; its wrapper starts at its stack target.
        toastAnimation.set(el, { y, scale, opacity });
        entrances.push({ target, direction: toast.spawnDirection ?? (isTop ? "top" : "bottom") });
      }

      targets.push(target);
      el.style.pointerEvents = pointerEvents;

      activeIndex++; // Only increment for active toasts
    });

    const targetById = new Map(targets.map((target) => [target.id, target]));
    const motionTargets = [...targets];
    const completedDismissals: Array<() => void> = [];

    // A newly closed wrapper joins the exact same vertical tween as the stack.
    // Its target is derived from the following toast's *actual* remaining
    // displacement, so interrupted/restarted animations cannot drift or overlap.
    toasts.forEach((toast, index) => {
      if (toast.open || !prevVisibleIdsRef.current.has(toast.id)) return;

      const element = toastRefsMap.current.get(toast.id);
      if (!element) return;

      const followingToast = toasts
        .slice(index + 1)
        .find((candidate) => candidate.open && targetById.has(candidate.id));
      const followingTarget = followingToast ? targetById.get(followingToast.id) : undefined;
      const previousY = readAnimationNumber(element, "y", 0);

      let displacement = STANDALONE_DISMISS_OFFSET;
      if (followingTarget) {
        const followingY = readAnimationNumber(followingTarget.element, "y", followingTarget.y);
        displacement = followingTarget.y - followingY;
      }

      motionTargets.push({
        id: toast.id,
        element,
        y: previousY + displacement,
        scale: readAnimationNumber(element, "scale", 1),
        opacity: readAnimationNumber(element, "opacity", 1),
      });

      const innerElement = element.querySelector<HTMLElement>('[role="alert"]');
      if (innerElement) {
        motionTargets.push({
          id: `${toast.id}:content`,
          element: innerElement,
          y: readAnimationNumber(innerElement, "y", 0),
          scale: readAnimationNumber(innerElement, "scale", 1),
          opacity: 0,
        });
      }

      const completeDismissal = pendingDismissalsRef.current.get(toast.id);
      if (completeDismissal) {
        pendingDismissalsRef.current.delete(toast.id);
        completedDismissals.push(completeDismissal);
      }
    });

    if (motionTargets.length > 0) {
      toastAnimation.to(
        motionTargets.map((target) => target.element),
        {
          y: (index: number) => motionTargets[index].y,
          opacity: (index: number) => motionTargets[index].opacity,
          ...toastMotion(containerRef.current, "layout"),
          onComplete: () => completedDismissals.forEach((complete) => complete()),
        },
      );
    }

    if (targets.length > 0) {
      toastAnimation.to(
        targets.map((target) => target.element),
        {
          scale: (index: number) => targets[index].scale,
          ...toastMotion(containerRef.current, "layout"),
        },
      );
    }

    if (containerRef.current) {
      let totalHeight = 0;
      if (isHovering) {
        // Only calculate container height based on open toasts
        openToasts.slice(0, MAX_VISIBLE + 1).forEach((toast) => {
          const el = toastRefsMap.current.get(toast.id);
          if (el) totalHeight += (el.offsetHeight || 60) + GAP;
        });
      } else {
        const firstEl = openToasts[0] ? toastRefsMap.current.get(openToasts[0].id) : null;
        totalHeight = (firstEl?.offsetHeight || 60) + GAP * 2;
      }

      if (prevVisibleIdsRef.current.size === 0) {
        // Establish initial geometry before measuring entrances; later height
        // changes keep bottom-aligned wrappers pinned to the bottom boundary.
        toastAnimation.set(containerRef.current, { height: totalHeight });
      } else {
        toastAnimation.to(containerRef.current, {
          height: totalHeight,
          ...toastMotion(containerRef.current, "layout"),
        });
      }
    }

    entrances.forEach(({ target, direction }) => {
      const innerElement = target.element.querySelector<HTMLElement>('[role="alert"]');
      if (innerElement) animateToastEntrance(innerElement, direction, boundary, target.scale);
    });

    toastRefsMap.current.forEach((_el, id) => {
      if (!currentActiveIds.has(id)) toastRefsMap.current.delete(id);
    });

    prevVisibleIdsRef.current = new Set(openToasts.map((t) => t.id));
  }, [isTop, isHovering, toasts, boundary]);

  const positionedStyle: React.CSSProperties = {
    position: positioning,
    zIndex: 50000,
    pointerEvents: "none",
    width: "356px",
    maxWidth: "calc(100% - 3rem)",
    ...config,
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  };

  return (
    <div style={positionedStyle} data-toast-position={position}>
      <div
        ref={containerRef}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={isHovering ? "pointer-events-auto" : "pointer-events-none"}
      >
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            ref={(el) => {
              if (el) toastRefsMap.current.set(toast.id, el);
              else {
                toastAnimation.stop(toastRefsMap.current.get(toast.id) ?? null);
                toastRefsMap.current.delete(toast.id);
              }
            }}
            style={{
              // An opacity hint creates a backdrop root and blocks the Toast's page blur.
              willChange: "transform",
              transformOrigin: isTop ? "top center" : "bottom center",
              top: isTop ? 0 : "auto",
              bottom: isTop ? "auto" : 0,
              position: "absolute",
              left: 0,
              right: 0,
              zIndex: toasts.length - index,
            }}
          >
            <Toast
              toast={toast}
              pauseOnHover={isHovering}
              onDragStart={() => {
                isDraggingRef.current = true;
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                setIsHovering(true);
              }}
              onDragEnd={() => {
                isDraggingRef.current = false;
                if (isDismissingCountRef.current === 0 && !isMouseInContainerRef.current) {
                  hoverTimeoutRef.current = setTimeout(() => setIsHovering(false), 200);
                }
              }}
              onDismissStart={() => {
                isDismissingCountRef.current++;
                // FIX: Removed `setIsHovering(true)` from here.
                // Auto-dismissing should NOT force the stack open.
              }}
              onDismissAnimation={(complete) => {
                pendingDismissalsRef.current.set(toast.id, complete);
              }}
              onDismissEnd={() => {
                isDismissingCountRef.current--;
                if (
                  isDismissingCountRef.current === 0 &&
                  !isDraggingRef.current &&
                  !isMouseInContainerRef.current
                ) {
                  hoverTimeoutRef.current = setTimeout(() => setIsHovering(false), 200);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function getClaimKey(toasterId: string | undefined, position: ToastPosition) {
  return JSON.stringify([toasterId ?? null, position]);
}

function resolveContainer(container: ToastPortalContainer | undefined) {
  if (container === undefined) return document.body;
  return typeof container === "function" ? container() : container;
}

export const Toaster = ({ container, toasterId }: ToasterProps) => {
  const { toasts } = useToastStore();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPortalTarget(resolveContainer(container));
  });

  const isViewportTarget = Boolean(
    portalTarget &&
    (portalTarget === portalTarget.ownerDocument.body ||
      portalTarget === portalTarget.ownerDocument.documentElement),
  );

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      portalTarget &&
      !isViewportTarget &&
      portalTarget.ownerDocument.defaultView?.getComputedStyle(portalTarget).position === "static"
    ) {
      console.warn(
        "A custom Toast container must establish a containing block, for example with position: relative.",
      );
    }
  }, [isViewportTarget, portalTarget]);

  const positions: ToastPosition[] = [
    "top-left",
    "top",
    "top-right",
    "bottom-left",
    "bottom",
    "bottom-right",
  ];

  const toastsByPosition = useMemo(() => {
    const grouped: Partial<Record<ToastPosition, ToastProps[]>> = {};
    toasts.forEach((t) => {
      if (t.toasterId !== toasterId) return;
      const pos = t.position || "bottom-right";
      if (!grouped[pos]) grouped[pos] = [];
      grouped[pos]!.push(t);
    });
    return grouped;
  }, [toasterId, toasts]);

  if (!portalTarget) return null;

  return createPortal(
    <>
      {positions.map((pos) => {
        const pts = toastsByPosition[pos];
        if (!pts || pts.length === 0) return null;

        return (
          <SingletonToastContainer
            key={pos}
            claimKey={getClaimKey(toasterId, pos)}
            position={pos}
            toasts={pts}
            positioning={isViewportTarget ? "fixed" : "absolute"}
            boundary={isViewportTarget ? undefined : portalTarget}
          />
        );
      })}
    </>,
    portalTarget,
  );
};

interface SingletonToastContainerProps extends ToastContainerProps {
  claimKey: string;
}

// Wrapper to enforce a singleton per toaster channel and position.
const SingletonToastContainer: React.FC<SingletonToastContainerProps> = ({
  claimKey,
  ...props
}) => {
  const claimRef = useRef(Symbol("toast-position-claim"));
  const [allowedClaimKey, setAllowedClaimKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    const claim = claimRef.current;
    const owner = activePositions.get(claimKey);

    if (owner && owner !== claim) {
      setAllowedClaimKey(null);
      return;
    }

    activePositions.set(claimKey, claim);
    setAllowedClaimKey(claimKey);

    return () => {
      if (activePositions.get(claimKey) === claim) {
        activePositions.delete(claimKey);
      }
    };
  }, [claimKey]);

  if (allowedClaimKey !== claimKey) return null;

  return <ToastContainer {...props} />;
};
