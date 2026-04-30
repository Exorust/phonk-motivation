"use client";

import { STREAMS, Stream, streamKey } from "@/lib/streams";

type Props = {
  current: Stream;
  onSelect: (s: Stream) => void;
};

export default function StreamSwitcher({ current, onSelect }: Props) {
  const currentKey = streamKey(current);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] tracking-editorial uppercase text-muted mb-1">
        Stations
      </span>
      <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {STREAMS.map((s) => {
          const key = streamKey(s);
          const active = key === currentKey;
          return (
            <button
              key={key}
              onClick={() => onSelect(s)}
              data-active={active}
              className="link-ctrl text-left flex items-baseline justify-between gap-3"
            >
              <span>{s.label}</span>
              <span className="text-[9px] text-muted/70 normal-case tracking-normal">
                {s.vibe}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
