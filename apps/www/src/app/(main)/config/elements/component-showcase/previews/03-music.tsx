"use client";

import { useState } from "react";
import {
  Heart,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "ui-lab-components/button";
import { List } from "ui-lab-components/list";
import { Progress } from "ui-lab-components/progress";
import { Scroll } from "ui-lab-components/scroll";
import { Surface } from "./shared";

const tracks = [
  { title: "Summer Nights", artist: "Lonnie Liston Smith", duration: "5:05" },
  { title: "A Garden of Peace", artist: "Lonnie Liston Smith", duration: "4:24" },
  { title: "Think Twice", artist: "Donald Byrd", duration: "6:10" },
];

function toSeconds(duration: string) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(37);
  const [current, setCurrent] = useState(0);
  const elapsed = (progress / 100) * toSeconds(tracks[current].duration);

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
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xs border border-background-700 bg-background-800"
              aria-hidden="true"
            >
              <Music2 size={16} className="text-foreground-500" />
            </div>
            <div className="min-w-0 flex-1 self-center">
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
            onPress={() => setLiked(!liked)}
            variant="ghost"
            size="sm"
            icon={
              <Heart
                size={14}
                className={liked ? "fill-accent-500 text-accent-500" : undefined}
              />
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-8 text-right text-xs text-foreground-400 tabular-nums">
            {formatTime(elapsed)}
          </span>
          <Progress
            show-controls
            value={progress}
            onValueChange={setProgress}
            aria-label="Track position"
            styles={{ root: "flex-1", track: "overflow-hidden h-3" }}
          />
          <span className="w-8 text-xs text-foreground-400 tabular-nums">
            {tracks[current].duration}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous"
            icon={<SkipBack size={15} />}
          />
          <Button
            variant="primary"
            size="icon"
            aria-label={playing ? "Pause" : "Play"}
            onPress={() => setPlaying(!playing)}
            className="h-9 w-9 rounded-full"
            icon={playing ? <Pause size={15} /> : <Play size={15} />}
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next"
            icon={<SkipForward size={15} />}
          />
        </div>
      </div>
    </Surface>
  );
}
