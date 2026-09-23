"use client";

import { Card } from "ui-lab-components/card";
import { Flex } from "ui-lab-components/flex";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { CircleCheck } from "lucide-react";

/**
 * Deploy status tile: a passing check with a paired secondary/primary action
 * row. Stands in for the workshop's status and action elements.
 */
export function DeployTile() {
  return (
    <Card>
      <Card.Body className="space-y-3 p-4">
        <Flex layout="bar" align-center>
          <span className="text-sm font-medium text-foreground-50">Production deploy</span>
          <Badge
            variant="success"
            icon={{ left: <CircleCheck className="size-3" aria-hidden="true" /> }}
          >
            Passing
          </Badge>
        </Flex>
        <p className="text-sm text-foreground-400">v2.4.0 · 14 checks passed</p>
        <Flex layout="actions" gap={2}>
          <Button variant="secondary" size="sm">
            Details
          </Button>
          <Button variant="primary" size="sm">
            Approve
          </Button>
        </Flex>
      </Card.Body>
    </Card>
  );
}
