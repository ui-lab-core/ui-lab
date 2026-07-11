"use client";

import { useState } from "react";
import { Checkbox, Progress, Divider, Button } from "ui-lab-components";
import { Rocket } from "lucide-react";

const STEPS = [
  { id: "profile", label: "Complete your profile", desc: "Add a name and avatar", initiallyDone: true },
  { id: "team", label: "Invite your team", desc: "Collaboration works better together", initiallyDone: true },
  { id: "repo", label: "Connect a repository", desc: "Import from GitHub or GitLab", initiallyDone: false },
  { id: "deploy", label: "Ship your first deploy", desc: "Push to main and watch it go live", initiallyDone: false },
];

export function OnboardingChecklist() {
  const [done, setDone] = useState(
    () => new Set(STEPS.filter((s) => s.initiallyDone).map((s) => s.id))
  );

  function toggle(id: string, checked: boolean) {
    setDone((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const percent = Math.round((done.size / STEPS.length) * 100);

  return (
    <div className="h-fit w-full bg-background-900 border border-background-700 rounded-sm overflow-hidden">
      <div className="px-4 pt-3.5 pb-3 border-b border-background-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground-100">Getting started</span>
          <span className="text-sm text-foreground-400">{done.size} of {STEPS.length}</span>
        </div>
        <Progress value={percent} aria-label="Onboarding progress" className="mt-2.5" />
      </div>

      {STEPS.map((step, i) => {
        const checked = done.has(step.id);
        return (
          <div key={step.id}>
            <label className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-background-800 transition-colors">
              <Checkbox
                state={{ checked }}
                onChange={(e) => toggle(step.id, e.target.checked)}
                className="mt-0.5"
              />
              <div className="min-w-0">
                <div className={`text-sm ${checked ? "text-foreground-400 line-through" : "text-foreground-100"}`}>
                  {step.label}
                </div>
                <div className="text-sm text-foreground-400">{step.desc}</div>
              </div>
            </label>
            {i < STEPS.length - 1 && <Divider spacing="none" size="sm" />}
          </div>
        );
      })}

      <div className="px-4 py-3 border-t border-background-700 flex items-center justify-between">
        <span className="text-sm text-foreground-400">
          {percent === 100 ? "All set — you're ready to ship." : "Finish setup to unlock deploys."}
        </span>
        <Button size="sm" variant="outline" isDisabled={percent < 100} icon={{ left: <Rocket size={12} /> }}>
          Launch
        </Button>
      </div>
    </div>
  );
}
