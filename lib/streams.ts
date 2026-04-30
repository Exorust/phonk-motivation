// YouTube live phonk radio streams.
// These are tried in order; if one fails or is taken down, the player falls back to the next.
// Edit this list freely. To add a stream: copy its YouTube video ID (the part after `v=` in the URL).
//
// To find current 24/7 phonk streams: search YouTube for "phonk radio 24/7 live" and filter by Live.
// IDs change when channels go offline or rotate broadcasts.

export type Stream = {
  id: string; // YouTube video ID
  label: string;
  mood: "drift" | "grindset" | "chill";
};

export const STREAMS: Stream[] = [
  {
    id: "4xDzrJKXOOY",
    label: "Drift Phonk Radio",
    mood: "drift",
  },
  {
    id: "VKowuEz6jw0",
    label: "Phonk House Radio",
    mood: "grindset",
  },
  {
    id: "4Lt2RNqqQKQ",
    label: "Aggressive Phonk",
    mood: "grindset",
  },
];

export const DEFAULT_STREAM = STREAMS[0];
