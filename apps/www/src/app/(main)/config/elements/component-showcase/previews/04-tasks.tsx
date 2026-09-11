"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Checkbox } from "ui-lab-components/checkbox";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";
import { Input } from "ui-lab-components/input";
import { Progress } from "ui-lab-components/progress";
import { Surface } from "./shared";

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finalize the homepage", done: true },
    { id: 2, title: "Review keyboard navigation", done: false },
    { id: 3, title: "Write the release notes", done: false },
    { id: 4, title: "Send the preview to the team", done: false },
  ]);
  const [draft, setDraft] = useState("");
  const complete = tasks.filter((task) => task.done).length;
  const addTask = () => {
    if (!draft.trim()) return;
    setTasks((current) => [
      ...current,
      { id: Math.max(0, ...current.map((task) => task.id)) + 1, title: draft.trim(), done: false },
    ]);
    setDraft("");
  };
  return (
    <Surface title="Launch checklist" action={<Badge>{`${complete}/${tasks.length}`}</Badge>}>
      <Progress value={complete} max={tasks.length} label="Launch readiness" showValue />
      <Flex direction="column" gap="sm">
        {tasks.map((task) => (
          <Checkbox
            key={task.id}
            label={task.title}
            state={{ checked: task.done }}
            onChange={(event) => {
              const checked = event.target.checked;
              setTasks((current) =>
                current.map((item) => (item.id === task.id ? { ...item, done: checked } : item)),
              );
            }}
          />
        ))}
      </Flex>
      <Group aria-label="Add a task" className="w-full">
        <Group.Input
          aria-label="New task"
          placeholder="Add a task…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addTask();
          }}
          className="min-w-0 flex-1"
        />
        <Group.Button disabled={!draft.trim()} onPress={addTask}>
          Add
        </Group.Button>
      </Group>
    </Surface>
  );
}

