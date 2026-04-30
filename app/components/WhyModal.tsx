"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function WhyModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop flex items-center justify-center px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-title"
    >
      <div
        className="max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          id="why-title"
          className="font-display text-foreground leading-[1.05] tracking-tight"
          style={{ fontSize: "clamp(2rem, 6.5vw, 5rem)" }}
        >
          Just <span className="italic">brainwash</span> yourself to become
          great.
        </p>
        <button onClick={onClose} className="link-ctrl mt-10 inline-block">
          Close
        </button>
      </div>
    </div>
  );
}
