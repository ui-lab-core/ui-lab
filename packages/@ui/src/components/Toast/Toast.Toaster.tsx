"use client";

import React, { useMemo, useEffect, useLayoutEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useToastStore, ToastPosition, ToastProps } from "./Toast.Store";
import { Toast } from "./Toast";
import gsap from "gsap";

const GAP = 14;
const MAX_VISIBLE = 3;

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

export type ToastPortalContainer =
  | HTMLElement
  | null
  | (() => HTMLElement | null);

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

  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const isDismissingCountRef = useRef(0);
  const isMouseInContainerRef = useRef(false);
  const prevVisibleIdsRef = useRef<Set<string>>(new Set());

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

  useEffect(() => {
    const currentActiveIds = new Set(toasts.map(t => t.id));
    const openToasts = toasts.filter(t => t.open);

    let cumulativeY = 0;
    let activeIndex = 0; // Track visual index separately from array index

    toasts.forEach((toast) => {
      const el = toastRefsMap.current.get(toast.id);
      if (!el) return;

      // If the toast is closing, ignore it in the layout calculations.
      // This lets the Toast component's internal GSAP handle the exit undisturbed.
      if (!toast.open) {
        el.style.pointerEvents = "none";
        return;
      }

      const isNewlyVisible = !prevVisibleIdsRef.current.has(toast.id);
      const isFromTop = toast.spawnDirection === 'top';
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
          y = 0; scale = 1; opacity = 1;
        } else if (activeIndex === 1) {
          y = GAP * (isTop ? 1 : -1); scale = 0.96; opacity = 1;
        } else if (activeIndex === 2) {
          y = GAP * 2 * (isTop ? 1 : -1); scale = 0.92; opacity = 1;
        } else {
          y = GAP * 2 * (isTop ? 1 : -1); scale = 0.92; opacity = 0;
          pointerEvents = "none";
        }
      }

      if (isNewlyVisible && isFromTop) {
        const startY = isTop ? (y + 30) : (y - 30);
        gsap.set(el, { y: startY, opacity: 0, scale: scale * 0.9 });
      }

      gsap.to(el, { y, scale, opacity, duration: 0.45, ease: "expo.out", overwrite: "auto" });
      el.style.pointerEvents = pointerEvents;

      activeIndex++; // Only increment for active toasts
    });

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
        totalHeight = (firstEl?.offsetHeight || 60) + (GAP * 2);
      }

      gsap.to(containerRef.current, {
        height: totalHeight,
        duration: 0.45,
        ease: "expo.out",
        overwrite: "auto",
      });
    }

    toastRefsMap.current.forEach((_el, id) => {
      if (!currentActiveIds.has(id)) toastRefsMap.current.delete(id);
    });

    prevVisibleIdsRef.current = new Set(openToasts.map(t => t.id));
  }, [isTop, isHovering, toasts]);

  const positionedStyle: React.CSSProperties = {
    position: positioning,
    zIndex: 9999,
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
              else toastRefsMap.current.delete(toast.id);
            }}
            style={{
              willChange: "transform, opacity",
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
              boundary={boundary}
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
              onDismissEnd={() => {
                isDismissingCountRef.current--;
                if (isDismissingCountRef.current === 0 && !isDraggingRef.current && !isMouseInContainerRef.current) {
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
      portalTarget === portalTarget.ownerDocument.documentElement)
  );

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      portalTarget &&
      !isViewportTarget &&
      portalTarget.ownerDocument.defaultView?.getComputedStyle(portalTarget).position === "static"
    ) {
      console.warn(
        "A custom Toast container must establish a containing block, for example with position: relative."
      );
    }
  }, [isViewportTarget, portalTarget]);

  const positions: ToastPosition[] = ["top-left", "top", "top-right", "bottom-left", "bottom", "bottom-right"];

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
    portalTarget
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
