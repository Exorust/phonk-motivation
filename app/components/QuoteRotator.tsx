"use client";

import { useEffect, useRef, useState } from "react";
import { Quote, QUOTES, pickRandomQuote } from "@/lib/quotes";

type Props = {
  active: boolean;
  intervalMs?: number;
};

const ROTATION_INTERVAL = 12_000; // 12s

export default function QuoteRotator({ active, intervalMs = ROTATION_INTERVAL }: Props) {
  const [{ quote, index }, setCurrent] = useState(() => pickRandomQuote());
  const [visible, setVisible] = useState(true);
  const [counter, setCounter] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIndexRef = useRef(index);

  // Schedule rotation
  useEffect(() => {
    if (!active) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      return;
    }

    function next() {
      // Fade out
      setVisible(false);
      // After fade-out completes, swap and fade back in
      fadeTimeoutRef.current = setTimeout(() => {
        const nextPick = pickRandomQuote(lastIndexRef.current);
        lastIndexRef.current = nextPick.index;
        setCurrent(nextPick);
        setCounter((c) => c + 1);
        setVisible(true);
        timeoutRef.current = setTimeout(next, intervalMs);
      }, 1500);
    }

    timeoutRef.current = setTimeout(next, intervalMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [active, intervalMs]);

  // Allow manual "next" via window event from AppShell keyboard handler
  useEffect(() => {
    function handleNext() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      const nextPick = pickRandomQuote(lastIndexRef.current);
      lastIndexRef.current = nextPick.index;
      setCurrent(nextPick);
      setCounter((c) => c + 1);
      setVisible(true);
      if (active) {
        timeoutRef.current = setTimeout(() => {
          // restart normal cycle
          setVisible(false);
          fadeTimeoutRef.current = setTimeout(() => {
            const np = pickRandomQuote(lastIndexRef.current);
            lastIndexRef.current = np.index;
            setCurrent(np);
            setCounter((c) => c + 1);
            setVisible(true);
          }, 1500);
        }, intervalMs);
      }
    }
    window.addEventListener("phonk:next-quote", handleNext);
    return () => window.removeEventListener("phonk:next-quote", handleNext);
  }, [active, intervalMs]);

  return (
    <div className="relative flex-1 flex items-center w-full">
      <div
        className={`quote-fade w-full ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <QuoteDisplay quote={quote} counter={counter} total={QUOTES.length} />
      </div>
    </div>
  );
}

function QuoteDisplay({
  quote,
  counter,
  total,
}: {
  quote: Quote;
  counter: number;
  total: number;
}) {
  return (
    <div className="grid grid-cols-12 px-6 sm:px-12 md:px-16 lg:px-24 gap-x-6">
      <div className="col-span-12 md:col-span-10 lg:col-span-9 md:col-start-2 lg:col-start-2">
        <p
          className="font-display text-foreground leading-[0.95] tracking-tight"
          style={{
            fontSize: "clamp(2.75rem, 8vw, 9rem)",
          }}
        >
          {/* Editorial italic emphasis on the first word — small flourish */}
          {quote.text}
        </p>
        <div className="mt-8 sm:mt-12 flex items-baseline gap-6 text-muted">
          <span className="text-xs sm:text-sm tracking-editorial uppercase">
            {quote.category}
          </span>
          <span className="text-xs sm:text-sm tracking-editorial uppercase tabular-nums">
            {String(counter).padStart(3, "0")} / {String(total).padStart(3, "0")}
          </span>
          {quote.attribution && (
            <span className="text-xs sm:text-sm italic text-muted">
              — {quote.attribution}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
