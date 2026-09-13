"use client";

import { useState } from "react";
import { Badge } from "ui-lab-components/badge";
import { Checkbox } from "ui-lab-components/checkbox";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";
import { Progress } from "ui-lab-components/progress";
import { Scroll } from "ui-lab-components/scroll";
import { Surface } from "./shared";

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finalize the homepage", done: true },
    { id: 2, title: "Review keyboard navigation", done: false },
    { id: 3, title: "Write the release notes", done: false },
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
      <Progress value={complete} max={tasks.length} label="Launch readiness" />
      <Scroll className="min-h-0 flex-1" fade-y inline>
        <Flex direction="column" gap="xs">
          {tasks.map((task) => (
            <div key={task.id} className="min-w-0 truncate py-0.5">
              <Checkbox
                label={task.title}
                state={{ checked: task.done }}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setTasks((current) =>
                    current.map((item) =>
                      item.id === task.id ? { ...item, done: checked } : item,
                    ),
                  );
                }}
              />
            </div>
          ))}
        </Flex>
      </Scroll>
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
