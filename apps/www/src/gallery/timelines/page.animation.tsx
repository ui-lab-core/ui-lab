"use client";

import { useEffect, useRef, useState } from "react";
import config from "./config.json";

function Sheet({
  isFront,
  isHovered,
}: {
  isFront: boolean;
  isHovered: boolean;
}) {
  const color = isFront
    ? isHovered
      ? config.highlight.hoverClass
      : config.highlight.idleClass
    : config.dim.class;
  const fillOpacity = isFront
    ? isHovered
      ? 0.05
      : config.highlight.idleFillOpacity
    : config.dim.fillOpacity;
  const strokeOpacity = isFront
    ? isHovered
      ? config.highlight.hoverStrokeOpacity
      : config.highlight.idleStrokeOpacity
    : config.dim.strokeOpacity;
  const contentOpacity = isFront ? (isHovered ? 0.7 : 0.45) : 0.2;

  return (
    <g>
      <rect
        x={138}
        y={64}
        width={124}
        height={172}
        rx={config.blockRx}
        className="text-background-950"
        fill="currentColor"
      />
      <rect
        x={138}
        y={64}
        width={124}
        height={172}
        rx={config.blockRx}
        className={color}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={config.strokeWidth}
        style={{ fillOpacity, strokeOpacity, transition: config.transition }}
      />

      {/* Header bar */}
      <rect
        x={152}
        y={80}
        width={36}
        height={7}
        rx={3}
        className={color}
        fill="currentColor"
        style={{ opacity: contentOpacity, transition: config.transition }}
      />

      {/* Title */}
      <rect
        x={152}
        y={110}
        width={98}
        height={12}
        rx={5}
        className={color}
        fill="currentColor"
        style={{ opacity: contentOpacity, transition: config.transition }}
      />
      <rect
        x={152}
        y={130}
        width={68}
        height={5}
        rx={3}
        className={config.dim.class}
        fill="currentColor"
        style={{ opacity: 0.2, transition: config.transition }}
      />

      {/* Media */}
      <rect
        x={152}
        y={150}
        width={98}
        height={66}
        rx={7}
        className={color}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={2}
        style={{
          fillOpacity: isFront
            ? config.activeContent.mediaActiveOpacity
            : config.dim.fillOpacity,
          strokeOpacity,
          transition: config.transition,
        }}
      />
    </g>
  );
}

const SHEET_COUNT = 3;
const CENTER_INDEX = 1;
const PIVOT = "200px 320px";

export function PageAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const galleryItem = element.closest(".group") || element;
    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    galleryItem.addEventListener("mouseenter", handleEnter);
    galleryItem.addEventListener("mouseleave", handleLeave);

    return () => {
      galleryItem.removeEventListener("mouseenter", handleEnter);
      galleryItem.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center relative overflow-hidden font-sans"
    >
      <div className="relative w-full">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full relative z-10 overflow-visible"
          aria-hidden="true"
        >
          {Array.from({ length: SHEET_COUNT }, (_, index) => index).map(
            (index) => {
              const rel = index - CENTER_INDEX;
              const isFront = rel === 0;

              const angle = isHovered ? rel * 8 : rel * 4;
              const spread = isHovered ? rel * 34 : rel * 16;
              const lift = isHovered
                ? isFront
                  ? -12
                  : -3
                : -Math.abs(rel) * 4;

              return (
                <g
                  key={index}
                  style={{
                    transform: `translate(${spread}px, ${lift}px) rotate(${angle}deg)`,
                    transformOrigin: PIVOT,
                    transition:
                      "transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.4s ease-out",
                  }}
                >
                  <Sheet isFront={isFront} isHovered={isHovered} />
                </g>
              );
            }
          )}
        </svg>
      </div>
    </div>
  );
}
