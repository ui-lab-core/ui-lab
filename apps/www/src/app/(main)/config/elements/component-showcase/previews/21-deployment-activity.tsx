"use client";

import { Fragment, useId, useState } from "react";
import { Confirm } from "ui-lab-components/confirm";
import { Toaster, toast } from "ui-lab-components/toast";
import { Divider } from "ui-lab-components/divider";
import { Expand } from "ui-lab-components/expand";
import { Flex } from "ui-lab-components/flex";
import { Surface, Note } from "./shared";

const demoReleases = [
  {
    version: "v2.8.0",
    commit: "a91f24c",
    title: "Faster project search",
    time: "Today, 10:32",
    duration: "38s",
  },
  {
    version: "v2.7.2",
    commit: "b740e8a",
    title: "Keyboard navigation fixes",
    time: "Yesterday, 16:08",
    duration: "41s",
  },
  {
    version: "v2.7.1",
    commit: "c281d5f",
    title: "Webhook retry improvements",
    time: "Sep 5, 09:14",
    duration: "35s",
  },
];

export default function DeploymentActivity() {
  const toasterId = useId();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(demoReleases[0].version);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState("Production simulation · no infrastructure connected.");
  return (
    <Flex ref={setContainer} direction="column" className="relative min-w-0">
      <Surface title="Deployments / atlas-web">
        <Flex layout="bar" gap="sm" wrap>
          <strong>{active}</strong>
          <Flex className="text-sm text-success-500">
            <span>Serving demo traffic</span>
          </Flex>
        </Flex>
        <Divider spacing="none" />
        <Flex direction="column" gap="md" className="min-w-0">
          {demoReleases.map((release, index) => (
            <Fragment key={release.version}>
              {index > 0 && <Divider spacing="none" />}
              <Flex direction="column" gap="sm" className="min-w-0">
                <Flex layout="bar" gap="sm" wrap>
                  <strong>{`${release.version}${active === release.version ? " · Current" : ""}`}</strong>
                  <Note small>{release.time}</Note>
                </Flex>
                <p>{release.title}</p>
                <Expand title={`Build log · ${release.commit}`}>
                  <Flex
                    direction="column"
                    gap="xs"
                    className="pt-3 font-mono text-xs text-foreground-300"
                  >
                    <span>checkout {release.commit}</span>
                    <span>dependencies resolved from cache</span>
                    <span>compiled 24 routes successfully</span>
                    <span>artifact ready in {release.duration}</span>
                  </Flex>
                </Expand>
                {active !== release.version && (
                  <Confirm
                    key={`${release.version}-${revision}`}
                    mode="dialog"
                    severity="medium"
                    labels={{
                      trigger: `Roll back to ${release.version}`,
                      confirming: {
                        title: `Roll back to ${release.version}?`,
                        body: `This will replace ${active} in the local preview. No real deployment will be changed.`,
                      },
                      confirm: "Simulate rollback",
                      cancel: "Keep current release",
                    }}
                    onConfirm={() => {
                      setActive(release.version);
                      setRevision((value) => value + 1);
                      setNotice(`Local rollback complete: ${release.version} is now active.`);
                      toast({
                        toasterId,
                        title: "Rollback simulated",
                        description: `${release.version} is now active in this preview.`,
                        variant: "success",
                        duration: 4500,
                        position: "bottom",
                      });
                    }}
                  />
                )}
              </Flex>
            </Fragment>
          ))}
        </Flex>
        <Note small role="status">
          {notice}
        </Note>
      </Surface>
      <Toaster toasterId={toasterId} container={container} />
    </Flex>
  );
}

