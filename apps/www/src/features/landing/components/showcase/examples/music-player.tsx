"use client";

import { useState } from "react";
import { Button, Divider, Group, Menu, Progress, Slider } from "ui-lab-components";
import {
  SkipBack,
  MoreHorizontal,
  SkipForward,
  Headphones,
  HeartCrack,
  ListMusic,
  Pause,
  Play,
  Plus,
  Repeat,
  Share2,
  Shuffle,
  Volume2,
  Volume1,
  VolumeX,
  Volume,
  Maximize2,
} from "lucide-react";

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState(false);
  const [queue, setQueue] = useState(false);
  const [progress, setProgress] = useState(37);

  const volumeIcon = muted ? (
    <VolumeX size={15} />
  ) : volume === 0 ? (
    <Volume size={15} />
  ) : volume < 50 ? (
    <Volume1 size={15} />
  ) : (
    <Volume2 size={15} />
  );

  return (
    <div className="flex w-full flex-col gap-5 rounded-sm border border-background-700 p-2">
      <div className="flex items-center gap-3.5">
        <div className="h-14 w-14 flex-shrink-0 rounded-sm bg-background-700/50" aria-hidden="true" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-sm font-semibold text-foreground-100 truncate">Midnight Static</div>
          <div className="text-sm text-foreground-400 truncate">Neon Reverie · Afterglow</div>
        </div>
        <div className="flex space-x-1.5">
          <Button
            aria-label={liked ? "Unsave" : "Save"}
            styles={{ root: liked ? "opacity-30" : "opacity-100" }}
            onPress={() => setLiked(!liked)}
            variant="ghost"
            size="sm"
            icon={<Plus size={14} />}
          />
          <Menu type="pop-over">
            <Menu.Trigger>
              <Button variant="ghost" icon={{ left: <MoreHorizontal size={14} /> }} aria-label="Track options" />
            </Menu.Trigger>
            <Menu.Content side="bottom" align="end" offset={6}>
              <Menu.Item>
                <Headphones size={14} className="mr-2 opacity-60" />
                Go to artist
              </Menu.Item>
              <Menu.Item>
                <ListMusic size={14} className="mr-2 opacity-60" />
                Add to playlist
              </Menu.Item>
              <Menu.Item>
                <Share2 size={14} className="mr-2 opacity-60" />
                Share track
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item>
                <HeartCrack size={14} className="mr-2 opacity-60" />
                Remove from queue
              </Menu.Item>
            </Menu.Content>
          </Menu>
        </div>
      </div>

      <div className="flex items-center mb-4 gap-3">
        <span className="text-xs text-foreground-400 tabular-nums">1:34</span>
        <Progress
          show-controls
          value={progress}
          onValueChange={setProgress}
          styles={{ root: "flex-1", track: "h-3.5" }}
        />
        <span className="text-xs text-foreground-400 tabular-nums">4:14</span>
      </div>

      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          aria-label={muted ? "Unmute" : "Mute"}
          icon={{ left: volumeIcon }}
          styles={{ root: muted ? "opacity-40" : "" }}
          onPress={() => setMuted(!muted)}
        />
        <div>
          <Slider
            value={volume}
            onValueChange={([v]) => setVolume(v)}
            disabled={muted}
            aria-label="Volume"
            style={{ "--inline-size": "4rem" } as React.CSSProperties}
            styles={{ thumb: "w-2.5" }}
          />
        </div>
        <div className="flex items-center mx-auto gap-2.5">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Shuffle"
            icon={{ left: <Shuffle size={14} /> }}
            styles={{ root: shuffle ? "text-foreground-400" : "opacity-30" }}
            onPress={() => setShuffle(!shuffle)}
          />
          <Group variant="default" orientation="horizontal" spacing="xs">
            <Group.Button size="icon" aria-label="Previous">
              <SkipBack size={16} />
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button
              size="icon"
              aria-label={playing ? "Pause" : "Play"}
              onPress={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Button size="icon" aria-label="Next">
              <SkipForward size={16} />
            </Group.Button>
          </Group>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Repeat"
            icon={{ left: <Repeat size={14} /> }}
            styles={{ root: repeat ? "text-foreground-400" : "opacity-30" }}
            onPress={() => setRepeat(!repeat)}
          />
        </div>
        <div className="flex ml-auto items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Queue"
            icon={{ left: <ListMusic size={14} /> }}
            styles={{ root: queue ? "text-foreground-400" : "opacity-30" }}
            onPress={() => setQueue(!queue)}
          />
          <Button
            size="sm"
            variant="ghost"
            aria-label="Expand"
            icon={{ left: <Maximize2 size={14} /> }}
            styles={{ root: "opacity-30" }}
          />
        </div>
      </div>
    </div>
  );
}
