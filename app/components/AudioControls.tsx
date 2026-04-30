"use client";

type Props = {
  isPlaying: boolean;
  volume: number;
  streamLabel: string;
  onToggle: () => void;
  onVolume: (v: number) => void;
};

export default function AudioControls({
  isPlaying,
  volume,
  streamLabel,
  onToggle,
  onVolume,
}: Props) {
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-12 z-30 flex flex-col items-end gap-3 text-foreground">
      <div className="flex items-center gap-4">
        <span className="text-[10px] sm:text-xs tracking-editorial uppercase text-muted hidden sm:inline">
          {streamLabel}
        </span>
        <button
          onClick={onToggle}
          className="text-xs uppercase tracking-editorial border-b border-foreground hover:text-accent hover:border-accent transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] tracking-editorial uppercase text-muted/70">
          VOL
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolume(parseInt(e.target.value, 10))}
          className="w-24 sm:w-32 accent-accent"
          aria-label="Volume"
        />
        <span className="text-[10px] tracking-editorial uppercase text-muted/70 tabular-nums w-6">
          {volume}
        </span>
      </div>
    </div>
  );
}
