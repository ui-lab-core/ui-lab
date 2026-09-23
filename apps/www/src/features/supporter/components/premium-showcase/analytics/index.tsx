"use client";

import { Bitcoin, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "ui-lab-components/card";
import { Chart } from "ui-lab-components/chart";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";

// Fictional holdings and the final chart value reconcile to $84,320.
const PERFORMANCE = [
  76200, 77400, 76900, 78800, 78000, 79500, 78600, 80300,
  79800, 77900, 79200, 80700, 80000, 81900, 81300, 82600,
  81400, 80800, 82900, 82400, 84100, 83600, 84700, 84320,
].map((balance, day) => ({ day: day + 1, balance }));

const HOLDINGS = [
  { symbol: "BTC", name: "Bitcoin", units: "0.8000 BTC", value: "$52,480.00", mark: "₿" },
  { symbol: "ETH", name: "Ethereum", units: "8.0000 ETH", value: "$26,840.00", mark: "Ξ" },
  { symbol: "USDC", name: "USD Coin", units: "5,000.00 USDC", value: "$5,000.00", mark: "$" },
];

export function CryptoPortfolioTile() {
  return (
    <Card className="overflow-hidden rounded-2xl bg-background-950">
      <Card.Header className="px-5 pt-5 pb-0">
        <Flex layout="bar">
          <Flex direction="column" gap={1}>
            <span className="text-sm font-medium text-foreground-100">Personal vault</span>
            <span className="text-xs text-foreground-400">Ethereum · 0x71c…9a42</span>
          </Flex>
          <Flex layout="center" className="size-9 rounded-full border border-background-700 text-foreground-200">
            <Bitcoin size={18} />
          </Flex>
        </Flex>
      </Card.Header>
      <Card.Body className="px-5 py-5">
        <Flex direction="column" gap={1}>
          <span className="text-xs text-foreground-400">Portfolio value · USD</span>
          <span className="text-4xl font-medium tracking-tight tabular-nums text-foreground-50">$84,320<span className="text-foreground-400">.00</span></span>
          <span className="text-xs text-success-400">+$8,120.00 (10.66%) this month</span>
        </Flex>
        <Chart data={PERFORMANCE} x="day" domain={[74000, 86000]} className="mt-4 h-36" aria-label="Illustrative September portfolio value">
          <Chart.Grid />
          <Chart.Axis axis="x" ticks={3} format={(day) => `Sep ${day}`} />
          <Chart.Line y="balance" label="Portfolio value" color="var(--success-400)" />
        </Chart>
        <Flex layout="bar" className="mt-2">
          <Group value="1M" aria-label="Portfolio period">
            {["1W", "1M", "3M", "1Y"].map((period) => (
              <Group.Button key={period} value={period} size="sm">{period}</Group.Button>
            ))}
          </Group>
          <span className="text-xs text-foreground-400">Sep 1–24</span>
        </Flex>
        <Flex direction="column" className="mt-5">
          {HOLDINGS.map((asset) => (
            <Flex key={asset.symbol} layout="bar" gap={3} className="border-t border-background-800 py-3">
              <Flex gap={3} align-center>
                <Flex layout="center" className="size-8 rounded-full bg-background-800 text-lg text-foreground-200">{asset.mark}</Flex>
                <Flex direction="column" gap={1}>
                  <span className="text-sm text-foreground-100">{asset.name}</span>
                  <span className="text-xs text-foreground-400">{asset.units}</span>
                </Flex>
              </Flex>
              <span className="text-sm tabular-nums text-foreground-200">{asset.value}</span>
            </Flex>
          ))}
        </Flex>
      </Card.Body>
      <Card.Footer className="border-t border-background-800 px-5 py-3">
        <Group className="w-full" aria-label="Vault actions">
          <Group.Button className="flex-1" icon={<ArrowDownLeft size={15} />}>Receive</Group.Button>
          <Group.Button className="flex-1" icon={<ArrowUpRight size={15} />}>Send</Group.Button>
        </Group>
      </Card.Footer>
    </Card>
  );
}
