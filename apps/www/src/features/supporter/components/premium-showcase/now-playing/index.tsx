"use client";

import { Play, RotateCcw, Volume2 } from "lucide-react";
import { Card } from "ui-lab-components/card";
import { Chart } from "ui-lab-components/chart";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";

const LOUDNESS = [-26, -21, -18, -16, -15, -14, -16, -13, -14, -12, -15, -13, -14, -16, -14, -13, -15, -14, -17, -21]
  .map((lufs, index) => ({ second: index * 12, lufs }));

export function MasteringTile() {
  return (
    <Card className="overflow-hidden rounded-2xl bg-background-950">
      <Card.Header className="p-5 pb-0">
        <Flex layout="bar" gap={3}>
          <Flex direction="column" gap={1}>
            <span className="text-sm font-medium text-foreground-100">Velvet room</span>
            <span className="text-xs text-foreground-400">Aurelia · Master 03</span>
          </Flex>
          <span className="text-xs text-success-400">Export ready</span>
        </Flex>
      </Card.Header>
      <Card.Body className="space-y-4 p-5">
        <Chart data={LOUDNESS} x="second" domain={[-30, -8]} className="h-28" aria-label="Illustrative track loudness in LUFS">
          <Chart.Line y="lufs" label="Short-term loudness" color="var(--foreground-300)" curve="linear" />
          <Chart.Reference y={-14} label="−14 LUFS" />
        </Chart>
        <Flex layout="bar" className="text-xs tabular-nums text-foreground-400">
          <span>00:00</span><span>Short-term loudness</span><span>03:48</span>
        </Flex>
        <Flex layout="bar" gap={3}>
          <Group aria-label="Master preview transport">
            <Group.Button size="icon" aria-label="Restart preview" icon={<RotateCcw size={14} />} />
            <Group.Button size="icon" aria-label="Play preview" icon={<Play size={14} />} />
            <Group.Button size="icon" aria-label="Preview volume" icon={<Volume2 size={14} />} />
          </Group>
          <Group value="master" aria-label="Audio comparison">
            <Group.Button value="original" size="sm">Original</Group.Button>
            <Group.Button value="master" size="sm">Master</Group.Button>
          </Group>
        </Flex>
      </Card.Body>
      <Card.Footer className="border-t border-background-800 px-5 py-4">
        <Flex layout="bar" gap={4}>
          <Flex direction="column" gap={1}>
            <span className="text-xs text-foreground-400">Delivery</span>
            <span className="text-sm text-foreground-200">WAV · 24 bit</span>
          </Flex>
          <Flex direction="column" gap={1}>
            <span className="text-xs text-foreground-400">Sample rate</span>
            <span className="text-sm text-foreground-200">48 kHz</span>
          </Flex>
          <Flex direction="column" gap={1}>
            <span className="text-xs text-foreground-400">True peak</span>
            <span className="text-sm text-foreground-200">−1.0 dBTP</span>
          </Flex>
        </Flex>
      </Card.Footer>
    </Card>
  );
}
