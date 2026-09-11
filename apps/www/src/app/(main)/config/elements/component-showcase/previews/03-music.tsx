"use client";

import { useEffect, useState } from "react";
import { Headphones, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { Slider } from "ui-lab-components/slider";
import { Surface, Note } from "./shared";

const tracks = [
  { name: "A little room to think", artist: "Northbound", duration: 224 },
  { name: "After the rain", artist: "Soft Signal", duration: 196 },
  { name: "Blue hour", artist: "Northbound", duration: 248 },
];

export default function Music() {
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(46);
  const [volume, setVolume] = useState(65);
  const current = tracks[track];
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () => setPosition((value) => Math.min(value + 1, current.duration)),
      1000,
    );
    return () => clearInterval(timer);
  }, [playing, current.duration]);
  useEffect(() => {
    if (position >= current.duration) setPlaying(false);
  }, [position, current.duration]);
  const skip = (delta: number) => {
    setTrack((value) => (value + delta + tracks.length) % tracks.length);
    setPosition(0);
  };
  const duration = (value: number) =>
    `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  return (
    <Surface title="Listening room">
      <Flex align-center gap="md" className="min-w-0">
        <Flex
          align-center
          justify-center
          className="h-20 w-20 shrink-0 rounded-md bg-background-800 text-foreground-300"
        >
          <Headphones size={32} />
        </Flex>
        <Flex direction="column" gap="xs" className="min-w-0">
          <strong>{current.name}</strong>
          <Note>{current.artist}</Note>
        </Flex>
      </Flex>
      <Flex direction="column" gap="xs" className="min-w-0">
        <Slider
          aria-label="Track position"
          min={0}
          max={current.duration}
          value={position}
          onValueChange={([value]) => setPosition(value)}
        />
        <Flex layout="bar" className="text-xs text-foreground-400">
          <span>{duration(position)}</span>
          <span>{duration(current.duration)}</span>
        </Flex>
      </Flex>
      <Flex align-center justify-center gap="sm">
        <Button variant="ghost" aria-label="Previous track" onPress={() => skip(-1)}>
          <SkipBack size={18} />
        </Button>
        <Button
          aria-label={playing ? "Pause preview" : "Play preview"}
          onPress={() => {
            if (position >= current.duration) setPosition(0);
            setPlaying(!playing);
          }}
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button variant="ghost" aria-label="Next track" onPress={() => skip(1)}>
          <SkipForward size={18} />
        </Button>
      </Flex>
      <Flex align-center gap="sm">
        <Volume2 size={16} />
        <Slider
          aria-label="Volume"
          value={volume}
          onValueChange={([value]) => setVolume(value)}
          className="flex-1"
        />
      </Flex>
      <Note small>Player interaction demo · no audio</Note>
    </Surface>
  );
}

