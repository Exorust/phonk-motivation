// Phonk sources — three kinds, mixed in one switcher:
//   1. live    → 24/7 YouTube live radio video. Goes dead when channel rotates.
//   2. mix     → long single-video phonk mix (1–3hr). Stable, plays continuously.
//   3. playlist→ true YouTube playlist (PL...). Cycles real tracks. Track skipping works.
//
// Goes stale? Find a fresh video ID by searching YouTube for "phonk radio 24/7 live",
// or a fresh playlist by searching "sigma phonk playlist" and copying the part after `list=`.

export type Stream =
  | { kind: "live"; id: string; label: string; vibe: string }
  | { kind: "mix"; id: string; label: string; vibe: string }
  | { kind: "playlist"; listId: string; label: string; vibe: string };

export const STREAMS: Stream[] = [
  // --- live radios ---
  {
    kind: "live",
    id: "4xDzrJKXOOY",
    label: "Drift Phonk Radio",
    vibe: "live · drift",
  },
  {
    kind: "live",
    id: "N9fP0qV3fws",
    label: "Aggressive Drift",
    vibe: "live · grind",
  },
  {
    kind: "live",
    id: "M9b7MHgvA88",
    label: "AURA Brazilian",
    vibe: "live · aggressive",
  },
  {
    kind: "live",
    id: "TA93rxjmW9s",
    label: "Chill Drift",
    vibe: "live · chill",
  },
  {
    kind: "live",
    id: "PBF5SsJXCWw",
    label: "Rare Phonk",
    vibe: "live · chill",
  },
  {
    kind: "live",
    id: "8D5wcl5hUD8",
    label: "Trappin in Japan",
    vibe: "live · og",
  },

  // --- mixes (long single videos that play like a curated set) ---
  {
    kind: "mix",
    id: "RV9n4NeiIaU",
    label: "SIGMA · MoonDeity",
    vibe: "mix · sigma",
  },
  {
    kind: "mix",
    id: "NeyRW32Zeds",
    label: "SIGMA Phonk 2024",
    vibe: "mix · aggressive",
  },
  {
    kind: "mix",
    id: "MXH1KyfcOBM",
    label: "Sigma Phonk 2023",
    vibe: "mix · aggressive",
  },
  {
    kind: "mix",
    id: "8Dyiytnph-4",
    label: "Best Drift Phonk",
    vibe: "mix · drift",
  },
  {
    kind: "mix",
    id: "fHhLUiRfpY4",
    label: "Sigma Best",
    vibe: "mix · sigma",
  },

  // --- true playlists (cycle real tracks, skipping works) ---
  {
    kind: "playlist",
    listId: "PLeZo-g7MgUlFrrsJ5rZvz5cgwXka6y1kV",
    label: "Phonk Fruits Catalog",
    vibe: "playlist · drift",
  },
];

export const DEFAULT_STREAM = STREAMS[0];

export function streamKey(s: Stream): string {
  return s.kind === "playlist" ? `pl:${s.listId}` : `${s.kind}:${s.id}`;
}
