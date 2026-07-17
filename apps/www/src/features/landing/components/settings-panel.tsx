"use client";

import { FaPaintRoller } from "@/shared/icons/fa6";
import { Button } from "ui-lab-components/button";
import { Tooltip } from "ui-lab-components/tooltip";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useApp } from "@/features/theme/lib/app-context";

type DialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

export const SettingsPanel = () => {
  const { isSettingsPanelOpen, setIsSettingsPanelOpen } = useApp();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [Dialog, setDialog] = useState<ComponentType<DialogProps> | null>(null);

  useEffect(() => {
    if (!isSettingsPanelOpen || Dialog) return;
    let active = true;
    Promise.all([
      import("@/features/theme/components/settings-dialog"),
      import("@/features/theme/lib/optional-fonts"),
    ]).then(([module]) => {
      if (active) setDialog(() => module.SettingsDialog);
    });
    return () => { active = false; };
  }, [Dialog, isSettingsPanelOpen]);

  return (
    <>
      <Tooltip showArrow content="Open Theme Settings" position="bottom" hint="t">
        <Button
          ref={buttonRef}
          variant="ghost"
          aria-label="Settings panel"
          size="icon"
          className="hover:text-foreground-300 transition-colors text-foreground-300 p-2 hover:bg-theme-border/30"
          onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
        >
          <FaPaintRoller size={14} />
        </Button>
      </Tooltip>
      {isSettingsPanelOpen && Dialog ? (
        <Dialog
          isOpen={isSettingsPanelOpen}
          onOpenChange={setIsSettingsPanelOpen}
          triggerRef={buttonRef}
        />
      ) : null}
    </>
  );
};
