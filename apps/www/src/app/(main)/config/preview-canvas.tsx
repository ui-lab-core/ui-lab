"use client";

import { useEffect, useRef } from "react";
import { Flex } from "ui-lab-components/flex";
import { Grid } from "ui-lab-components/grid";
import { previewExamples, showcaseLayout } from "./elements/component-showcase";
import styles from "./preview-canvas.module.css";

export function PreviewCanvas() {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = canvas.current;
    const grid = root?.querySelector<HTMLElement>("[data-preview-grid]");
    if (!root || !grid) return;
    const tiles = Array.from(grid.children) as HTMLElement[];
    let frame = 0;
    const layout = () => {
      if (!showcaseLayout.masonry) return;
      const columns = Number(getComputedStyle(grid).getPropertyValue("--preview-columns")) || 1;
      const heights = Array<number>(columns).fill(0);
      // Measure natural content, never stretched grid items. Reflow when
      // themes, fonts, disclosures, or example data change their dimensions.
      for (const tile of tiles) {
        const span = Math.min(tile.dataset.wide === "true" ? 2 : 1, columns);
        const height = Math.ceil(tile.firstElementChild!.getBoundingClientRect().height) + showcaseLayout.tileGap;
        let column = 0;
        let top = Infinity;
        for (let start = 0; start <= columns - span; start++) {
          const candidate = Math.max(...heights.slice(start, start + span));
          if (candidate < top) { top = candidate; column = start; }
        }
        tile.style.gridColumn = `${column + 1} / span ${span}`;
        tile.style.gridRow = `${top + 1} / span ${height}`;
        heights.fill(top + height, column, column + span);
      }
      grid.dataset.measured = "true";
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    for (const tile of tiles) observer.observe(tile.firstElementChild!);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  return (
    <Flex ref={canvas} direction="column" className={styles.canvas}>
      <Grid data-preview-grid columns="repeat(var(--preview-columns), minmax(0, 1fr))" gap={showcaseLayout.gridGap} className={styles.grid} aria-label="Interactive UI Lab component examples">
        {previewExamples.map(({ id, component: Example, wide }) => (
          <Flex key={id} direction="column" data-wide={wide || undefined} className={styles.tile}>
            <Flex direction="column" className={styles.content}><Example /></Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
}
