"use client";

import { useState } from "react";
import {
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Divider } from "ui-lab-components/divider";
import { Group } from "ui-lab-components/group";
import { List } from "ui-lab-components/list";
import { Progress } from "ui-lab-components/progress";
import { Scroll } from "ui-lab-components/scroll";
import { Surface } from "./shared";

const tracks = [
  { title: "Summer Nights", artist: "Lonnie Liston Smith", duration: "5:05" },
  { title: "A Garden of Peace", artist: "Lonnie Liston Smith", duration: "4:24" },
  { title: "Think Twice", artist: "Donald Byrd", duration: "6:10" },
];

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(37);
  const [current, setCurrent] = useState(0);

  return (
    <Surface title="Listening room">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="mb-1 flex items-center justify-between border-b border-background-700/60 px-2 py-1">
          <span className="text-xs font-medium text-foreground-400">Up next</span>
          <span className="text-xs text-foreground-500 tabular-nums">{tracks.length}</span>
        </div>
        <Scroll className="min-h-0 flex-1 max-w-none" fade-y inline>
          <List gap="xs" spacing="xs" className="max-w-none">
            {tracks.map((track, i) => {
              const active = i === current;
              return (
                <List.Item
                  key={track.title}
                  value={track.title}
                  interactive
                  selected={active}
                  onClick={() => setCurrent(i)}
                  className="rounded-sm px-2 py-1"
                >
                  <List.Title
                    className={`min-w-0 truncate text-xs ${
                      active ? "font-medium text-foreground-100" : "text-foreground-300"
                    }`}
                  >
                    {track.title}
                  </List.Title>
                  <span className="text-xs text-foreground-500 tabular-nums">{track.duration}</span>
                </List.Item>
              );
            })}
          </List>
        </Scroll>
      </div>

      <div className="space-y-2 rounded-sm border border-background-700 p-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 flex-1 gap-2">
            <div
              className="h-8 w-8 flex-shrink-0 rounded-xs bg-background-950"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-foreground-100">
                {tracks[current].title}
              </div>
              <div className="truncate text-xs text-foreground-400">
                {tracks[current].artist}
              </div>
            </div>
          </div>
          <Button
            aria-label={liked ? "Unsave" : "Save"}
            styles={{ root: liked ? "opacity-30" : "opacity-100" }}
            onPress={() => setLiked(!liked)}
            variant="ghost"
            size="sm"
            icon={<Plus size={13} />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Progress
            show-controls
            value={progress}
            onValueChange={setProgress}
            aria-label="Track position"
            styles={{ root: "flex-1", track: "overflow-hidden h-3" }}
          />
          <span className="text-xs text-foreground-400 tabular-nums">
            {tracks[current].duration}
          </span>
        </div>

        <div className="flex justify-center">
          <Group variant="ghost" orientation="horizontal" spacing="none">
            <Group.Button size="icon" aria-label="Previous">
              <SkipBack size={15} />
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button
              size="icon"
              aria-label={playing ? "Pause" : "Play"}
              onPress={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={15} /> : <Play size={15} />}
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button size="icon" aria-label="Next">
              <SkipForward size={15} />
            </Group.Button>
          </Group>
        </div>
      </div>
    </Surface>
  );
}
