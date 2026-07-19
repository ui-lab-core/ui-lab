"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import config from "./config.json";

type Stage = "idle" | "bars" | "line" | "done";

export function ChartAnimation() {
  const [stage, setStage] = useState<Stage>("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const handleEnter = useCallback(() => {
    clearTimers();
    setStage("bars");
    timersRef.current.push(
      setTimeout(() => setStage("line"), 520),
      setTimeout(() => setStage("done"), 1350),
    );
  }, [clearTimers]);

  const handleLeave = useCallback(() => {
    clearTimers();
    setStage("idle");
  }, [clearTimers]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const galleryItem = element.closest(".group") || element;
    galleryItem.addEventListener("mouseenter", handleEnter);
    galleryItem.addEventListener("mouseleave", handleLeave);
    return () => {
      clearTimers();
      galleryItem.removeEventListener("mouseenter", handleEnter);
      galleryItem.removeEventListener("mouseleave", handleLeave);
    };
  }, [clearTimers, handleEnter, handleLeave]);

  const chartX = 86;
  const chartY = 72;
  const chartW = 228;
  const chartH = 150;
  const plotX = chartX + 28;
  const plotY = chartY + 30;
  const plotW = chartW - 48;
  const plotH = chartH - 54;
  const baselineY = plotY + plotH;
  const barW = 16;
  const barGap = 12;
  const barHeights = [42, 68, 54, 86, 62, 76];
  const lineHeights = [38, 58, 50, 78, 66, 84];
  const active = stage !== "idle";
  const lineVisible = stage === "line" || stage === "done";
  const done = stage === "done";
  const barX = (index: number) => plotX + 18 + index * (barW + barGap);
  const barY = (height: number) => baselineY - height;
  const points = lineHeights
    .map((height, index) => `${barX(index) + barW / 2},${barY(height)}`)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center relative overflow-hidden font-sans"
    >
      <div className="relative w-full">
        <svg viewBox="0 0 400 300" className="w-full h-full relative z-10 overflow-visible" aria-hidden="true">
          <rect
            x={chartX}
            y={chartY}
            width={chartW}
            height={chartH}
            rx={config.blockRx}
            fill="currentColor"
            className={config.dim.class}
            fillOpacity={config.dim.fillOpacity}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeOpacity={config.dim.strokeOpacity}
          />

          <rect
            x={chartX + 18}
            y={chartY + 16}
            width={66}
            height={6}
            rx={3}
            fill="currentColor"
            className={active ? config.highlight.hoverClass : config.highlight.idleClass}
            style={{
              opacity: active ? 0.75 : 0.45,
              transition: config.transition,
            }}
          />
          <rect
            x={chartX + chartW - 68}
            y={chartY + 16}
            width={18}
            height={6}
            rx={3}
            fill="currentColor"
            className={config.dim.class}
            fillOpacity={0.28}
          />
          <rect
            x={chartX + chartW - 42}
            y={chartY + 16}
            width={20}
            height={6}
            rx={3}
            fill="currentColor"
            className={config.dim.class}
            fillOpacity={0.18}
          />

          {[0, 1, 2].map((line) => (
            <line
              key={line}
              x1={plotX}
              y1={plotY + line * 32}
              x2={plotX + plotW}
              y2={plotY + line * 32}
              stroke="currentColor"
              className={config.dim.class}
              strokeWidth={1}
              strokeOpacity={active ? 0.25 : 0.18}
              strokeDasharray="4 6"
              style={{ transition: config.transition }}
            />
          ))}

          <line
            x1={plotX}
            y1={baselineY}
            x2={plotX + plotW}
            y2={baselineY}
            stroke="currentColor"
            className={config.dim.class}
            strokeWidth={1.5}
            strokeOpacity={0.3}
          />
          <line
            x1={plotX}
            y1={plotY}
            x2={plotX}
            y2={baselineY}
            stroke="currentColor"
            className={config.dim.class}
            strokeWidth={1.5}
            strokeOpacity={0.25}
          />

          {barHeights.map((height, index) => (
            <rect
              key={height}
              x={barX(index)}
              y={active ? barY(height) : baselineY}
              width={barW}
              height={active ? height : 0}
              rx={config.barRx}
              fill="currentColor"
              className={active && index === 3 ? config.highlight.hoverClass : config.dim.class}
              style={{
                opacity: active ? (index === 3 ? 0.72 : 0.38) : 0.18,
                transition: `height 0.65s cubic-bezier(0.25, 0, 0.25, 1) ${index * 55}ms, y 0.65s cubic-bezier(0.25, 0, 0.25, 1) ${index * 55}ms, opacity 0.4s ease, color 0.4s ease`,
              }}
            />
          ))}

          <polyline
            points={points}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            className={lineVisible ? config.highlight.hoverClass : config.highlight.idleClass}
            strokeWidth={3}
            strokeOpacity={lineVisible ? 0.72 : 0.28}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            strokeDashoffset={lineVisible ? 0 : 1}
            style={{
              transition: "stroke-dashoffset 0.9s cubic-bezier(0.25, 0, 0.25, 1), opacity 0.4s ease, color 0.4s ease",
            }}
          />
          {lineHeights.map((height, index) => (
            <circle
              key={index}
              cx={barX(index) + barW / 2}
              cy={barY(height)}
              r={3}
              fill="currentColor"
              className={done ? config.highlight.hoverClass : config.highlight.idleClass}
              style={{
                opacity: done ? 0.85 : 0,
                transition: `opacity 0.3s ease ${index * 45}ms, color 0.4s ease`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
