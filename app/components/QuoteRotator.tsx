"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Quote, QUOTES, pickRandomQuote } from "@/lib/quotes";

type Props = {
  active: boolean;
  intervalMs?: number;
};

const ROTATION_INTERVAL = 12_000;
const MAX_FONT_REM = 9; // ~144px upper bound
const MIN_FONT_REM = 1.75; // ~28px floor — never let it shrink past readable

export default function QuoteRotator({
  active,
  intervalMs = ROTATION_INTERVAL,
}: Props) {
  const [{ quote, index }, setCurrent] = useState(() => pickRandomQuote());
  const [visible, setVisible] = useState(true);
  const [counter, setCounter] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIndexRef = useRef(index);

  useEffect(() => {
    if (!active) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      return;
    }

    function next() {
      setVisible(false);
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
    <div className="relative flex-1 flex items-center w-full min-h-0">
      <div
        className={`quote-fade w-full ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <QuoteDisplay
          quote={quote}
          counter={counter}
          total={QUOTES.length}
        />
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
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontRem, setFontRem] = useState(MAX_FONT_REM);

  // Shrink-to-fit: measure overflow, scale font down, repeat until it fits
  // (or hits MIN_FONT_REM floor).
  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    function fit() {
      if (!container || !text) return;
      // Start from ideal viewport-driven max
      const vwIdeal = (window.innerWidth / 100) * 8; // matches old clamp 8vw
      const startPx = Math.min(MAX_FONT_REM * 16, vwIdeal);
      const startRem = startPx / 16;

      let lo = MIN_FONT_REM;
      let hi = startRem;
      let best = MIN_FONT_REM;

      // Binary search for largest font-size that fits both height and width
      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        text.style.fontSize = `${mid}rem`;
        // Force layout
        const overH = text.scrollHeight > container.clientHeight + 1;
        const overW = text.scrollWidth > container.clientWidth + 1;
        if (overH || overW) {
          hi = mid;
        } else {
          best = mid;
          lo = mid;
        }
      }
      text.style.fontSize = `${best}rem`;
      setFontRem(best);
    }

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [quote.text]);

  return (
    <div className="grid grid-cols-12 px-6 sm:px-12 md:px-16 lg:px-24 gap-x-6">
      <div
        ref={containerRef}
        className="col-span-12 md:col-span-10 lg:col-span-9 md:col-start-2 lg:col-start-2 max-h-[55vh] overflow-hidden"
      >
        <p
          ref={textRef}
          className="font-display text-foreground leading-[0.95] tracking-tight"
          style={{ fontSize: `${fontRem}rem` }}
        >
          {quote.text}
        </p>
        <div className="mt-6 sm:mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-muted">
          <span className="text-xs tracking-editorial uppercase">
            {quote.category}
          </span>
          <span className="text-xs tracking-editorial uppercase tabular-nums">
            {String(counter).padStart(3, "0")} /{" "}
            {String(total).padStart(3, "0")}
          </span>
          {quote.attribution && (
            <span className="text-xs italic text-muted">
              — {quote.attribution}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
