"use client";

import type { Theme } from "./ThemeBackground";

type Props = {
  theme: Theme;
  onChange: (t: Theme) => void;
};

const OPTIONS: { key: Theme; label: string }[] = [
  { key: "none", label: "Black" },
  { key: "rain", label: "Rain" },
  { key: "matrix", label: "Matrix" },
  { key: "wind", label: "Wind" },
];

export default function ThemeSwitcher({ theme, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          data-active={opt.key === theme}
          className="link-ctrl"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
