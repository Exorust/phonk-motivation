"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal types for the YouTube IFrame Player API
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (v: number) => void;
  getVolume: () => number;
  loadVideoById: (id: string) => void;
  destroy: () => void;
  getPlayerState: () => number;
};

type YTNamespace = {
  Player: new (
    el: string | HTMLElement,
    opts: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number; target: YTPlayer }) => void;
        onError?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
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

export type PlayerStatus = "idle" | "loading" | "ready" | "error";

export function useYouTubePlayer(videoId: string, holderId: string) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(60);
  const currentVideoIdRef = useRef(videoId);

  // Initialize player once
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
        // Side effect: instantiates the player on the holder element.
        // The actual player ref comes through the onReady callback.
        new YT.Player(holderId, {
          videoId: currentVideoIdRef.current,
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
              setStatus("ready");
            },
            onStateChange: (e) => {
              if (cancelled) return;
              // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
              if (e.data === 1) setIsPlaying(true);
              else if (e.data === 2 || e.data === 0) setIsPlaying(false);
            },
            onError: () => {
              if (cancelled) return;
              setStatus("error");
            },
          },
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional: instantiate once, change video via loadStream

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

  const loadStream = useCallback((newId: string) => {
    currentVideoIdRef.current = newId;
    playerRef.current?.loadVideoById(newId);
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
  };
}
