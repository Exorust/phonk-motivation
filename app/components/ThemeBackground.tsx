"use client";

import { useEffect, useRef } from "react";

export type Theme = "none" | "rain" | "matrix" | "wind";

type Props = {
  theme: Theme;
};

export default function ThemeBackground({ theme }: Props) {
  if (theme === "none") return null;
  if (theme === "matrix") return <MatrixCanvas />;
  if (theme === "rain") {
    return <div className="theme-layer theme-rain" aria-hidden="true" />;
  }
  if (theme === "wind") {
    return <div className="theme-layer theme-wind" aria-hidden="true" />;
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
      // Trail effect — semi-transparent black overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Faint green for subtlety
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
      style={{ opacity: 0.55 }}
    />
  );
}
