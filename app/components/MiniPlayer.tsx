"use client";

import { useState } from "react";
import type { Stream } from "@/lib/streams";
import StreamSwitcher from "./StreamSwitcher";

type Props = {
  isPlaying: boolean;
  volume: number;
  current: Stream;
  status: "loading" | "ready" | "error";
  onToggle: () => void;
  onVolume: (v: number) => void;
  onSelectStream: (s: Stream) => void;
  onSkipTrack: () => void;
};

export default function MiniPlayer({
  isPlaying,
  volume,
  current,
  status,
  onToggle,
  onVolume,
  onSelectStream,
  onSkipTrack,
}: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="fixed bottom-20 right-6 sm:bottom-24 sm:right-10 z-50 max-w-[18rem]">
      {expanded ? (
        <div className="flex flex-col gap-4 items-end bg-background/85 backdrop-blur-md border border-subtle p-4 rounded-sm">
          <div className="flex items-center gap-4 self-stretch justify-between">
            <button onClick={onToggle} className="link-ctrl">
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={onSkipTrack} className="link-ctrl">
              Skip
            </button>
            <button onClick={() => setExpanded(false)} className="link-ctrl">
              Hide
            </button>
          </div>

          <div className="flex items-center gap-3 self-stretch">
            <span className="text-[10px] tracking-editorial uppercase text-muted">
              Vol
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => onVolume(parseInt(e.target.value, 10))}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Volume"
            />
            <span className="text-[10px] tracking-editorial uppercase text-muted/70 tabular-nums w-6 text-right">
              {volume}
            </span>
          </div>

          <StreamSwitcher current={current} onSelect={onSelectStream} />

          {status === "error" && (
            <span className="text-[10px] tracking-editorial uppercase text-accent">
              Stream error · try another
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4 bg-background/85 backdrop-blur-md border border-subtle px-4 py-2.5 rounded-sm">
          <button onClick={onToggle} className="link-ctrl">
            {isPlaying ? "Pause" : "Play"}
          </button>
          <span className="text-[10px] tracking-editorial uppercase text-muted/80 truncate max-w-[8rem]">
            {current.label}
          </span>
          <button onClick={() => setExpanded(true)} className="link-ctrl">
            Show
          </button>
        </div>
      )}
    </div>
  );
}
