"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STREAM, STREAMS } from "@/lib/streams";
import AudioControls from "./AudioControls";
import EntryGate from "./EntryGate";
import Footer from "./Footer";
import QuoteRotator from "./QuoteRotator";
import { useYouTubePlayer } from "./useYouTubePlayer";

const PLAYER_HOLDER_ID = "phonk-yt-player";

export default function AppShell() {
  const [started, setStarted] = useState(false);
  const [streamIdx, setStreamIdx] = useState(0);

  const player = useYouTubePlayer(DEFAULT_STREAM.id, PLAYER_HOLDER_ID);

  // Begin handler — must be called from a user gesture
  function handleBegin() {
    player.play();
    setStarted(true);
  }

  function nextStream() {
    const next = (streamIdx + 1) % STREAMS.length;
    setStreamIdx(next);
    player.loadStream(STREAMS[next].id);
    // loadVideoById autoplays after first user gesture
  }

  // Keyboard shortcuts
  useEffect(() => {
    if (!started) return;
    function onKey(e: KeyboardEvent) {
      // Don't intercept when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        player.toggle();
      } else if (e.key === "n" || e.key === "N") {
        window.dispatchEvent(new Event("phonk:next-quote"));
      } else if (e.key === "m" || e.key === "M") {
        player.setVolume(player.volume === 0 ? 60 : 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        player.setVolume(player.volume + 5);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        player.setVolume(player.volume - 5);
      } else if (e.key === "s" || e.key === "S") {
        nextStream();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, player.toggle, player.volume, streamIdx]);

  const currentStream = STREAMS[streamIdx];

  return (
    <>
      {/* Hidden YouTube IFrame — audio only */}
      <div className="yt-audio-only" aria-hidden="true">
        <div id={PLAYER_HOLDER_ID} />
      </div>

      {!started && (
        <EntryGate
          onBegin={handleBegin}
          loading={player.status === "loading"}
        />
      )}

      <main className="flex-1 flex flex-col min-h-screen pt-20 sm:pt-28 pb-32 sm:pb-40">
        {/* Top label */}
        <div className="grid grid-cols-12 px-6 sm:px-12 md:px-16 lg:px-24 gap-x-6 mb-12 sm:mb-16">
          <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-start-2 flex items-baseline justify-between">
            <span className="text-xs sm:text-sm tracking-editorial uppercase text-foreground">
              Phonk Motivation
            </span>
            <span className="text-[10px] sm:text-xs tracking-editorial uppercase text-muted">
              {currentStream.label}
            </span>
          </div>
        </div>

        {/* Quote area — fills available height */}
        <QuoteRotator active={started} />

        {/* Hint row */}
        <div className="grid grid-cols-12 px-6 sm:px-12 md:px-16 lg:px-24 gap-x-6 mt-12 sm:mt-16">
          <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-start-2 flex flex-wrap gap-x-6 gap-y-2 text-[10px] sm:text-xs tracking-editorial uppercase text-muted/70">
            <span><kbd className="text-foreground/80">space</kbd> play</span>
            <span><kbd className="text-foreground/80">n</kbd> next quote</span>
            <span><kbd className="text-foreground/80">s</kbd> next stream</span>
            <span><kbd className="text-foreground/80">m</kbd> mute</span>
            <span className="hidden sm:inline">
              <kbd className="text-foreground/80">↑↓</kbd> volume
            </span>
          </div>
        </div>
      </main>

      <Footer />

      {started && (
        <AudioControls
          isPlaying={player.isPlaying}
          volume={player.volume}
          streamLabel={currentStream.label}
          onToggle={player.toggle}
          onVolume={player.setVolume}
        />
      )}
    </>
  );
}
