"use client";

import { useEffect, useRef } from "react";

export type Theme = "none" | "rain" | "matrix" | "wind";

type Props = {
  theme: Theme;
};

export default function ThemeBackground({ theme }: Props) {
  if (theme === "none") return null;
  if (theme === "matrix") return <MatrixCanvas />;
  if (theme === "rain") return <RainCanvas />;
  if (theme === "wind") {
    return (
      <div
        className="theme-layer theme-wind"
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      />
    );
  }
  return null;
}

const KATAKANA =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789";

function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let columns = 0;
    let drops: number[] = [];
    let frame = 0;
    const fontSize = 16;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    }

    function draw() {
      if (!ctx || !canvas) return;
      frame++;

      // Advance only every 2nd frame → ~30fps effective (was 60fps, too fast)
      if (frame % 2 === 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(80, 200, 100, 0.45)";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
          const ch = KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          ctx.fillText(ch, x, y);

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="theme-layer"
      style={{ opacity: 0.55, pointerEvents: "none" }}
    />
  );
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let drops: Drop[] = [];

    function initDrops(w: number, h: number) {
      const count = Math.floor(w / 14);
      drops = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        length: 10 + Math.random() * 28,
        speed: 1.2 + Math.random() * 3,
        opacity: 0.08 + Math.random() * 0.14,
        width: 1 + Math.random(),
      }));
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops(canvas.width, canvas.height);
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of drops) {
        // Tapered streak — transparent top, brightest at bottom
        const grad = ctx.createLinearGradient(d.x, d.y - d.length, d.x, d.y);
        grad.addColorStop(0, `rgba(180, 215, 255, 0)`);
        grad.addColorStop(1, `rgba(200, 230, 255, ${d.opacity})`);

        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.length);
        ctx.lineTo(d.x, d.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Teardrop tip at the leading edge
        ctx.beginPath();
        ctx.ellipse(d.x, d.y + d.width, d.width * 1.2, d.width * 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 235, 255, ${d.opacity * 1.5})`;
        ctx.fill();

        d.y += d.speed;
        if (d.y > canvas.height + d.length + 5) {
          d.y = -(d.length + 5);
          d.x = Math.random() * canvas.width;
          d.speed = 1.2 + Math.random() * 3;
          d.opacity = 0.08 + Math.random() * 0.14;
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="theme-layer"
      style={{ opacity: 0.75, pointerEvents: "none" }}
    />
  );
}
