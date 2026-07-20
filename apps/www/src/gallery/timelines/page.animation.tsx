"use client";

import { useEffect, useRef, useState } from "react";
import config from "./config.json";

type State = "dim" | "idle" | "active";

function Sheet({ state }: { state: State }) {
  const isActive = state === "active";
  const isDim = state === "dim";
  const color = isActive
    ? config.highlight.hoverClass
    : config.highlight.idleClass;
  const opacity = isDim ? 0.1 : 1;

  return (
    <g>
      <rect
        x={127}
        y={49}
        width={146}
        height={202}
        rx={config.blockRx}
        className="text-background-950"
        fill="currentColor"
      />
      <rect
        x={127}
        y={49}
        width={146}
        height={202}
        rx={config.blockRx}
        className={isDim ? config.dim.class : color}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={config.strokeWidth}
        style={{
          fillOpacity: isDim
            ? config.dim.fillOpacity
            : isActive
              ? 0.06
              : config.highlight.idleFillOpacity * 0.5,
          strokeOpacity: isDim
            ? config.dim.strokeOpacity
            : isActive
              ? config.highlight.hoverStrokeOpacity
              : config.highlight.idleStrokeOpacity,
          transition: config.transition,
        }}
      />

      {/* Navigation */}
      <g style={{ opacity, transition: config.transition }}>
        <rect
          x={143}
          y={66}
          width={30}
          height={6}
          rx={3}
          className={color}
          fill="currentColor"
          style={{
            opacity: isActive ? 0.7 : 0.45,
            transition: config.transition,
          }}
        />
        <rect
          x={231}
          y={63}
          width={26}
          height={12}
          rx={4}
          className={color}
          fill="currentColor"
          style={{ opacity: isActive ? 0.32 : 0.18 }}
        />
      </g>

      {/* Hero */}
      <g style={{ opacity, transition: config.transition }}>
        <rect
          x={164}
          y={92}
          width={72}
          height={8}
          rx={4}
          className={color}
          fill="currentColor"
          style={{ opacity: isActive ? 0.7 : 0.45 }}
        />
        <rect
          x={176}
          y={105}
          width={48}
          height={8}
          rx={4}
          className={color}
          fill="currentColor"
          style={{ opacity: isActive ? 0.7 : 0.45 }}
        />
        <rect
          x={169}
          y={121}
          width={62}
          height={4}
          rx={2}
          className="text-background-500"
          fill="currentColor"
          style={{ opacity: 0.22 }}
        />
        <rect
          x={184}
          y={135}
          width={32}
          height={14}
          rx={4}
          className={color}
          fill="currentColor"
          style={{ opacity: isActive ? 0.45 : 0.25 }}
        />

        {/* Media */}
        <rect
          x={143}
          y={164}
          width={114}
          height={64}
          rx={7}
          className={color}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={2}
          style={{
            fillOpacity: isActive
              ? config.activeContent.mediaActiveOpacity
              : config.skeleton.mediaIdleOpacity,
            strokeOpacity: isActive
              ? config.highlight.hoverStrokeOpacity
              : config.dim.strokeOpacity,
            transition: config.transition,
          }}
        />
      </g>
    </g>
  );
}

function getPosition(offset: number) {
  if (offset <= -2) {
    return {
      opacity: 0,
      transform: "translate(126px, -12px) rotate(28deg) scale(0.88)",
    };
  }

  if (offset === -1) {
    return {
      opacity: 0,
      transform: "translate(72px, -8px) rotate(18deg) scale(0.9)",
    };
  }

  if (offset === 0) {
    return {
      opacity: 1,
      transform: "translate(0px, 0px) rotate(0deg) scale(0.9)",
    };
  }

  if (offset === 1) {
    return {
      opacity: 1,
      transform: "translate(-15px, 9px) rotate(-4deg) scale(0.87)",
    };
  }

  if (offset === 2) {
    return {
      opacity: 0.55,
      transform: "translate(-28px, 17px) rotate(-7deg) scale(0.84)",
    };
  }

  return {
    opacity: 0,
    transform: "translate(-42px, 25px) rotate(-10deg) scale(0.81)",
  };
}

export function PageAnimation() {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const galleryItem = element.closest(".group") || element;
    const handleEnter = () =>
      setStep((current) => (current % 2 === 0 ? current + 1 : current));
    const handleLeave = () =>
      setStep((current) => (current % 2 === 1 ? current + 1 : current));

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
          {Array.from({ length: 6 }, (_, index) => step - 2 + index)
            .sort((a, b) => b - a)
            .map((sheetIndex) => {
              const offset = sheetIndex - step;
              const position = getPosition(offset);
              const state: State =
                offset <= 0
                  ? sheetIndex % 2 === 0
                    ? "idle"
                    : "active"
                  : "dim";

              return (
                <g
                  key={sheetIndex}
                  style={{
                    opacity: position.opacity,
                    transform: position.transform,
                    transformOrigin: "200px 150px",
                    transition:
                      "transform 0.65s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.5s ease-out",
                  }}
                >
                  <Sheet state={state} />
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
}
