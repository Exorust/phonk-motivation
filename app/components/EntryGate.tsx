"use client";

type Props = {
  onBegin: () => void;
  loading?: boolean;
};

export default function EntryGate({ onBegin, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="grid grid-cols-12 w-full px-6 sm:px-12 md:px-16 lg:px-24 gap-x-6">
        <div className="col-span-12 md:col-span-10 lg:col-span-9 md:col-start-2 lg:col-start-2 flex flex-col">
          <span className="text-xs sm:text-sm tracking-editorial uppercase text-muted mb-6">
            Phonk Motivation
          </span>
          <h1
            className="font-display leading-[0.95] tracking-tight text-foreground mb-10"
            style={{ fontSize: "clamp(2.5rem, 7vw, 7.5rem)" }}
          >
            <span className="italic">a vibe</span> for the grind.
          </h1>
          <p className="max-w-xl text-foreground/70 text-base sm:text-lg leading-relaxed mb-12">
            Phonk radio plus motivational quotes that actually have teeth.
            Open in a tab. Leave it running. Stay hard.
          </p>
          <button
            onClick={onBegin}
            disabled={loading}
            className="self-start px-0 py-2 text-sm uppercase tracking-editorial text-foreground border-b border-foreground hover:text-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-wait"
          >
            {loading ? "Loading…" : "Press to begin"}
          </button>
          <p className="mt-8 text-xs uppercase tracking-editorial text-muted/60">
            Sound on recommended
          </p>
        </div>
      </div>
    </div>
  );
}
