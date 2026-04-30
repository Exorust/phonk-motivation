"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STREAM, STREAMS, Stream, streamKey } from "@/lib/streams";
import EntryGate from "./EntryGate";
import Footer from "./Footer";
import MiniPlayer from "./MiniPlayer";
import QuoteRotator from "./QuoteRotator";
import ThemeBackground, { Theme } from "./ThemeBackground";
import ThemeSwitcher from "./ThemeSwitcher";
import WhyModal from "./WhyModal";
import { useYouTubePlayer } from "./useYouTubePlayer";

const PLAYER_HOLDER_ID = "phonk-yt-player";

export default function AppShell() {
  const [started, setStarted] = useState(false);
  const [streamIdx, setStreamIdx] = useState(0);
  const [theme, setTheme] = useState<Theme>("none");
  const [whyOpen, setWhyOpen] = useState(false);

  const player = useYouTubePlayer(DEFAULT_STREAM, PLAYER_HOLDER_ID);

  function handleBegin() {
    player.play();
    setStarted(true);
  }

  function selectStream(s: Stream) {
    const idx = STREAMS.findIndex(
      (x) => streamKey(x) === streamKey(s)
    );
    if (idx >= 0) setStreamIdx(idx);
    player.loadStream(s);
  }

  useEffect(() => {
    if (!started) return;
    function onKey(e: KeyboardEvent) {
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
        const next = (streamIdx + 1) % STREAMS.length;
        setStreamIdx(next);
        player.loadStream(STREAMS[next]);
      } else if (e.key === "k" || e.key === "K") {
        // Skip track within playlist
        player.skipTrack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, player.toggle, player.volume, streamIdx]);

  const currentStream = STREAMS[streamIdx];

  return (
    <>
      {/* Theme background — z-0, behind everything */}
      <ThemeBackground theme={theme} />

      {/* Hidden YouTube IFrame */}
      <div className="yt-audio-only" aria-hidden="true">
        <div id={PLAYER_HOLDER_ID} />
      </div>

      {!started && (
        <EntryGate
          onBegin={handleBegin}
          loading={player.status === "loading"}
        />
      )}

      {/* Layout: footer always visible. Main flex-1 fills the remaining viewport. */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Top bar */}
        <header className="px-6 sm:px-12 md:px-16 lg:px-24 pt-6 sm:pt-8 pb-4">
          <div className="grid grid-cols-12 gap-x-6 items-baseline">
            <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-start-2 flex items-baseline justify-between gap-4">
              <span className="text-[11px] tracking-editorial uppercase text-foreground">
                Phonk Motivation
              </span>
              <span className="text-[10px] tracking-editorial uppercase text-muted truncate max-w-[40%]">
                {currentStream.label}
              </span>
            </div>
          </div>
        </header>

        {/* Main quote area */}
        <main className="flex-1 flex flex-col min-h-0">
          <QuoteRotator active={started} />

          {/* Hint row */}
          <div className="grid grid-cols-12 px-6 sm:px-12 md:px-16 lg:px-24 gap-x-6 mt-6 mb-4">
            <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-start-2 flex flex-wrap gap-x-5 gap-y-1 text-[10px] tracking-editorial uppercase text-muted/70">
              <span>
                <kbd className="text-foreground/80">space</kbd> play
              </span>
              <span>
                <kbd className="text-foreground/80">n</kbd> next quote
              </span>
              <span>
                <kbd className="text-foreground/80">s</kbd> next stream
              </span>
              <span>
                <kbd className="text-foreground/80">k</kbd> skip track
              </span>
              <span>
                <kbd className="text-foreground/80">m</kbd> mute
              </span>
              <span className="hidden sm:inline">
                <kbd className="text-foreground/80">↑↓</kbd> volume
              </span>
            </div>
          </div>
        </main>

        <Footer
          onWhy={() => setWhyOpen(true)}
          themeSlot={<ThemeSwitcher theme={theme} onChange={setTheme} />}
        />
      </div>

      {started && (
        <MiniPlayer
          isPlaying={player.isPlaying}
          volume={player.volume}
          current={currentStream}
          status={player.status}
          onToggle={player.toggle}
          onVolume={player.setVolume}
          onSelectStream={selectStream}
          onSkipTrack={player.skipTrack}
        />
      )}

      <WhyModal open={whyOpen} onClose={() => setWhyOpen(false)} />
    </>
  );
}
