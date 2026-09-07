"use client";

import { useState } from "react";
import { Button, Divider, Group, List, Menu, Progress, Scroll, Slider } from "ui-lab-components";
import {
  FaBackwardStep,
  FaEllipsis,
  FaExpand,
  FaForwardStep,
  FaHeadphones,
  FaHeartCrack,
  FaListUl,
  FaPause,
  FaPlay,
  FaPlus,
  FaRepeat,
  FaShareNodes,
  FaShuffle,
  FaVolumeHigh,
  FaVolumeLow,
  FaVolumeOff,
  FaVolumeXmark,
} from "@/shared/icons/fa6";
import type { ShowcasePanelProps } from "../types";

const tracks = [
  { title: "Summer Nights", artist: "Lonnie Liston Smith", duration: "5:05" },
  { title: "A Garden of Peace", artist: "Lonnie Liston Smith", duration: "4:24" },
  { title: "Think Twice", artist: "Donald Byrd", duration: "6:10" },
  { title: "Expansions", artist: "Lonnie Liston Smith", duration: "6:01" },
  { title: "Renaissance", artist: "Lenny White", duration: "4:47" },
  { title: "Wind Parade", artist: "Donald Byrd", duration: "6:07" },
];

export function MusicPlayer({ height }: ShowcasePanelProps) {
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState(false);
  const [queue, setQueue] = useState(true);
  const [progress, setProgress] = useState(37);
  const [current, setCurrent] = useState(0);

  const volumeIcon = muted ? (
    <FaVolumeXmark size={15} />
  ) : volume === 0 ? (
    <FaVolumeOff size={15} />
  ) : volume < 50 ? (
    <FaVolumeLow size={15} />
  ) : (
    <FaVolumeHigh size={15} />
  );

  return (
    <div
      className="flex w-full flex-col justify-between gap-3 overflow-hidden rounded-sm p-2"
      style={{ height }}
    >
      {queue && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-background-700/60 mb-2 px-2.5 py-1.5">
            <span className="text-sm font-medium text-foreground-400">Up next</span>
            <span className="text-sm text-foreground-500 tabular-nums">{tracks.length} tracks</span>
          </div>
          <Scroll className="min-h-0 flex-1 max-w-none" fade-y inline>
            <List gap="sm" spacing="sm" className="max-w-none">
              {tracks.map((track, i) => {
                const active = i === current;
                return (
                  <List.Item
                    key={track.title}
                    value={track.title}
                    interactive
                    selected={active}
                    onClick={() => setCurrent(i)}
                    className="group rounded-sm px-2.5 py-1.5 [&_[data-actions]]:opacity-0 [&_[data-actions]]:transition-opacity hover:[&_[data-actions]]:opacity-100 focus-within:[&_[data-actions]]:opacity-100"
                    actions={[
                      { icon: <FaListUl size={13} />, title: "Add to playlist" },
                      { icon: <FaHeartCrack size={13} />, title: "Remove from queue" },
                    ]}
                  >
                    <List.Media>
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xs bg-background-950"
                        aria-hidden="true"
                      ></span>
                    </List.Media>
                    <List.Title
                      className={`truncate text-sm ${
                        active ? "font-medium text-foreground-100" : "text-foreground-300"
                      }`}
                    >
                      {track.title}
                      <br />
                      <span className="text-foreground-400">{track.artist}</span>
                    </List.Title>
                    <List.Actions />
                    <span className="text-sm text-foreground-500 tabular-nums">
                      {track.duration}
                    </span>
                  </List.Item>
                );
              })}
            </List>
          </Scroll>
        </div>
      )}

      <div className="border border-background-700 space-y-6 rounded-sm p-2">
        <div className="flex justify-between items-start gap-3.5">
          <div className="flex gap-4">
            <div
              className="h-12 w-12 flex-shrink-0 rounded-sm bg-background-950"
              aria-hidden="true"
            />
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-sm font-semibold text-foreground-100 truncate">
                {tracks[current].title}
              </div>
              <div className="text-sm max-w-[25ch] text-foreground-400 truncate">
                {tracks[current].artist} · Visions of a New World
              </div>
            </div>
          </div>
          <div className="flex space-x-1.5">
            <Button
              aria-label={liked ? "Unsave" : "Save"}
              styles={{ root: liked ? "opacity-30" : "opacity-100" }}
              onPress={() => setLiked(!liked)}
              variant="ghost"
              size="sm"
              icon={<FaPlus size={14} />}
            />
            <Menu type="pop-over">
              <Menu.Trigger
                variant="ghost"
                icon={{ left: <FaEllipsis size={14} /> }}
                aria-label="Track options"
              />
              <Menu.Content side="bottom" align="end" offset={6}>
                <Menu.Item>
                  <FaHeadphones size={14} className="mr-2 opacity-60" />
                  Go to artist
                </Menu.Item>
                <Menu.Item>
                  <FaListUl size={14} className="mr-2 opacity-60" />
                  Add to playlist
                </Menu.Item>
                <Menu.Item>
                  <FaShareNodes size={14} className="mr-2 opacity-60" />
                  Share track
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item>
                  <FaHeartCrack size={14} className="mr-2 opacity-60" />
                  Remove from queue
                </Menu.Item>
              </Menu.Content>
            </Menu>
          </div>
        </div>

        <div className="flex items-center mb-4 gap-3">
          <span className="text-sm text-foreground-400 tabular-nums">1:34</span>
          <Progress
            show-controls
            value={progress}
            onValueChange={setProgress}
            styles={{
              root: " flex-1",
              track: "overflow-hidden h-4.5",
            }}
          />
          <span className="text-sm text-foreground-400 tabular-nums">5:05</span>
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
              icon={{ left: <FaShuffle size={14} /> }}
              styles={{ root: shuffle ? "text-foreground-400" : "opacity-30" }}
              onPress={() => setShuffle(!shuffle)}
            />
            <Group variant="ghost" orientation="horizontal" spacing="none">
              <Group.Button size="icon" aria-label="Previous">
                <FaBackwardStep size={16} />
              </Group.Button>
              <Divider orientation="vertical" />
              <Group.Button
                size="icon"
                aria-label={playing ? "Pause" : "Play"}
                onPress={() => setPlaying(!playing)}
              >
                {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
              </Group.Button>
              <Divider orientation="vertical" />
              <Group.Button size="icon" aria-label="Next">
                <FaForwardStep size={16} />
              </Group.Button>
            </Group>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Repeat"
              icon={{ left: <FaRepeat size={14} /> }}
              styles={{ root: repeat ? "text-foreground-400" : "opacity-30" }}
              onPress={() => setRepeat(!repeat)}
            />
          </div>
          <div className="flex ml-auto items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              aria-label="Queue"
              icon={{ left: <FaListUl size={14} /> }}
              styles={{ root: queue ? "text-foreground-400" : "opacity-30" }}
              onPress={() => setQueue(!queue)}
            />
            <Button
              size="sm"
              variant="ghost"
              aria-label="Expand"
              icon={{ left: <FaExpand size={14} /> }}
              styles={{ root: "opacity-30" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
