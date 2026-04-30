"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Stream } from "@/lib/streams";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  setVolume: (v: number) => void;
  getVolume: () => number;
  loadVideoById: (id: string) => void;
  loadPlaylist: (opts: {
    list: string;
    listType: "playlist" | "user_uploads" | "search";
    index?: number;
    startSeconds?: number;
  }) => void;
  destroy: () => void;
  getPlayerState: () => number;
};

type YTNamespace = {
  Player: new (
    el: string | HTMLElement,
    opts: {
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number; target: YTPlayer }) => void;
        onError?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
    __ytApiLoading?: boolean;
    __ytApiReady?: boolean;
    __ytApiCallbacks?: Array<() => void>;
  }
}

function loadYouTubeApi(): Promise<YTNamespace> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("YouTube API requires browser environment"));
      return;
    }
    if (window.YT && window.__ytApiReady) {
      resolve(window.YT);
      return;
    }
    window.__ytApiCallbacks = window.__ytApiCallbacks || [];
    window.__ytApiCallbacks.push(() => {
      if (window.YT) resolve(window.YT);
      else reject(new Error("YouTube API loaded but window.YT missing"));
    });

    if (window.__ytApiLoading) return;
    window.__ytApiLoading = true;

    window.onYouTubeIframeAPIReady = () => {
      window.__ytApiReady = true;
      const callbacks = window.__ytApiCallbacks || [];
      window.__ytApiCallbacks = [];
      callbacks.forEach((cb) => cb());
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load YouTube API"));
    document.head.appendChild(script);
  });
}

export type PlayerStatus = "loading" | "ready" | "error";

function applyStream(player: YTPlayer, stream: Stream) {
  if (stream.kind === "playlist") {
    player.loadPlaylist({ list: stream.listId, listType: "playlist" });
  } else {
    player.loadVideoById(stream.id);
  }
}

export function useYouTubePlayer(initial: Stream, holderId: string) {
  const playerRef = useRef<YTPlayer | null>(null);
  const initialRef = useRef(initial);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(60);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        const holder = document.getElementById(holderId);
        if (!holder) {
          setStatus("error");
          return;
        }
        const init = initialRef.current;
        const constructorOpts: ConstructorParameters<typeof YT.Player>[1] = {
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: (e) => {
              if (cancelled) return;
              playerRef.current = e.target;
              e.target.setVolume(60);
              // For playlist initial, also load the playlist now
              if (init.kind === "playlist") {
                e.target.loadPlaylist({
                  list: init.listId,
                  listType: "playlist",
                });
              }
              setStatus("ready");
            },
            onStateChange: (e) => {
              if (cancelled) return;
              if (e.data === 1) setIsPlaying(true);
              else if (e.data === 2 || e.data === 0) setIsPlaying(false);
            },
            onError: () => {
              if (cancelled) return;
              setStatus("error");
            },
          },
        };
        // For video/live kind, set videoId in constructor.
        // For playlist, let onReady call loadPlaylist (constructor doesn't accept list directly here cleanly).
        if (init.kind !== "playlist") {
          constructorOpts.videoId = init.id;
        }
        new YT.Player(holderId, constructorOpts);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [holderId]);

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const toggle = useCallback(() => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === 1) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(v)));
    setVolumeState(clamped);
    playerRef.current?.setVolume(clamped);
  }, []);

  const loadStream = useCallback((stream: Stream) => {
    if (!playerRef.current) return;
    applyStream(playerRef.current, stream);
  }, []);

  const skipTrack = useCallback(() => {
    // Only meaningful for playlists; harmless on videos
    try {
      playerRef.current?.nextVideo();
    } catch {
      // ignore
    }
  }, []);

  return {
    status,
    isPlaying,
    volume,
    play,
    pause,
    toggle,
    setVolume,
    loadStream,
    skipTrack,
  };
}
