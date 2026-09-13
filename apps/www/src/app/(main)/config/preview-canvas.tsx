"use client";

import { Flex } from "ui-lab-components/flex";
import { Grid } from "ui-lab-components/grid";
import { previewExamples, showcaseLayout } from "./elements/component-showcase";
import styles from "./preview-canvas.module.css";

export function PreviewCanvas() {
  return (
    <Flex direction="column" className={styles.canvas}>
      <Grid data-preview-grid columns="repeat(var(--preview-columns), minmax(0, 1fr))" gap={showcaseLayout.gridGap} autoFlow="row-dense" className={styles.grid} aria-label="Interactive UI Lab component examples">
        {previewExamples.map(({ id, component: Example, rows, wide }) => (
          <Flex key={id} direction="column" data-grid-span={wide ? 2 : 1} style={{ gridRow: `span ${rows}` }} className={styles.tile}>
            <Flex direction="column" className={styles.content}><Example /></Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
}
