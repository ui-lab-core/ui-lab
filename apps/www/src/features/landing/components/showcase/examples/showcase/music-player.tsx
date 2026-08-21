"use client";

import { useState } from "react";
import { Button, Divider, Group, List, Menu, Progress, Scroll, Slider } from "ui-lab-components";
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
import type { ShowcasePanelProps } from "../types";

const tracks = [
  { title: "Summer Nights", artist: "Lonnie Liston Smith", duration: "5:05" },
  { title: "A Garden of Peace", artist: "Lonnie Liston Smith", duration: "4:24" },
  { title: "Think Twice", artist: "Donald Byrd", duration: "6:10" },
  { title: "Expansions", artist: "Lonnie Liston Smith", duration: "6:01" },
  { title: "Renaissance", artist: "Lenny White", duration: "4:47" },
  { title: "Wind Parade", artist: "Donald Byrd", duration: "6:07" },
];

const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

// --- Cover gradient factory -------------------------------------------------
// Given any string input, produce a deterministic, premium-feeling gradient.
// Variety comes from seeding a PRNG with the input and pulling several
// independent "channels" (palette, glow layout, base angle) from it, so two
// inputs almost never collide while every result stays in a cohesive,
// blue-leaning aesthetic.

/** FNV-1a string hash → unsigned 32-bit seed. */
function seedFrom(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG: deterministic, well-distributed floats in [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Curated premium palettes. Each stays dark and moody but reads as distinct. */
const COVER_PALETTES = [
  { highlight: "222 100% 82%", mid: "224 95% 55%", rim: "226 100% 52%", baseHue: 226 }, // electric blue
  { highlight: "260 90% 84%", mid: "258 85% 58%", rim: "255 90% 55%", baseHue: 258 }, // indigo / violet
  { highlight: "192 95% 80%", mid: "196 90% 52%", rim: "200 95% 48%", baseHue: 200 }, // cyan / teal
  { highlight: "290 80% 82%", mid: "295 78% 58%", rim: "300 82% 52%", baseHue: 288 }, // magenta / plum
  { highlight: "160 80% 78%", mid: "168 78% 46%", rim: "172 82% 42%", baseHue: 170 }, // emerald
  { highlight: "30 95% 78%", mid: "22 92% 56%", rim: "16 95% 50%", baseHue: 20 }, // amber / ember
] as const;

const pick = <T,>(rng: () => number, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const range = (rng: () => number, min: number, max: number): number => min + rng() * (max - min);

function coverStyle(input: string): React.CSSProperties {
  const rng = mulberry32(seedFrom(input));
  const palette = pick(rng, COVER_PALETTES);

  // Independent channels for the two glow blobs and the base sweep.
  const glowX = range(rng, 45, 88);
  const glowY = range(rng, 4, 30);
  const glowSpread = range(rng, 45, 60);
  const rimX = range(rng, 20, 60);
  const rimY = range(rng, 78, 98);
  const angle = range(rng, 120, 220);
  const baseHue = palette.baseHue;

  return {
    backgroundImage: [
      GRAIN,
      // Bright highlight blob, drifting near the top edge.
      `radial-gradient(120% 90% at ${glowX.toFixed(1)}% ${glowY.toFixed(1)}%, hsl(${palette.highlight}) 0%, hsl(${palette.mid}) 22%, transparent ${glowSpread.toFixed(0)}%)`,
      // Lower rim glow.
      `radial-gradient(110% 80% at ${rimX.toFixed(1)}% ${rimY.toFixed(1)}%, hsl(${palette.rim}) 0%, transparent 50%)`,
      // Deep near-black body with a subtle tint from the chosen family.
      `linear-gradient(${angle.toFixed(0)}deg, hsl(${baseHue} 45% 8%), hsl(${baseHue + 2} 55% 3%))`,
    ].join(", "),
    backgroundBlendMode: "overlay, screen, screen, normal",
    backgroundSize: "160px 160px, cover, cover, cover",
  };
}

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
    <VolumeX size={15} />
  ) : volume === 0 ? (
    <Volume size={15} />
  ) : volume < 50 ? (
    <Volume1 size={15} />
  ) : (
    <Volume2 size={15} />
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
            <List items={tracks} gap="sm" spacing="sm" className="max-w-none">
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
                      { icon: <ListMusic size={13} />, title: "Add to playlist" },
                      { icon: <HeartCrack size={13} />, title: "Remove from queue" },
                    ]}
                  >
                    <List.Media>
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xs"
                        style={coverStyle(track.title)}
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
              className="h-12 w-12 flex-shrink-0 rounded-sm"
              style={coverStyle(tracks[current].title)}
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
              icon={<Plus size={14} />}
            />
            <Menu type="pop-over">
              <Menu.Trigger
                variant="ghost"
                icon={{ left: <MoreHorizontal size={14} /> }}
                aria-label="Track options"
              />
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
              icon={{ left: <Shuffle size={14} /> }}
              styles={{ root: shuffle ? "text-foreground-400" : "opacity-30" }}
              onPress={() => setShuffle(!shuffle)}
            />
            <Group variant="ghost" orientation="horizontal" spacing="xs">
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
    </div>
  );
}
