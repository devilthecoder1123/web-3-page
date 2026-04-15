"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotionPref } from "@/lib/ui/useReducedMotionPref";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function MatrixBackground({
  intensity = 0.75,
}: {
  intensity?: number; // 0..1
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotionPref();

  const charset = useMemo(
    () =>
      "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%*+<>",
    [],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const canvasEl = canvas;
    const ctx2d = ctx;

    const dpr = window.devicePixelRatio || 1;
    const fontSize = 16;
    const columnSpacing = fontSize;

    let w = 0;
    let h = 0;
    let columns = 0;
    let drops: number[] = [];

    function resize() {
      const parent = canvasEl.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvasEl.width = Math.floor(w * dpr);
      canvasEl.height = Math.floor(h * dpr);
      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(w / columnSpacing);
      drops = Array.from({ length: columns }, () => Math.random() * h);
      ctx2d.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    }

    const ro = new ResizeObserver(() => resize());
    if (canvasEl.parentElement) ro.observe(canvasEl.parentElement);
    resize();

    function frame() {
      // fade
      ctx2d.fillStyle = `rgba(0, 0, 0, ${clamp(0.08 - intensity * 0.03, 0.03, 0.09)})`;
      ctx2d.fillRect(0, 0, w, h);

      ctx2d.fillStyle = `rgba(0, 255, 102, ${clamp(0.18 + intensity * 0.25, 0.15, 0.6)})`;

      for (let i = 0; i < columns; i++) {
        const x = i * columnSpacing;
        const y = drops[i];
        const ch = charset.charAt((Math.random() * charset.length) | 0);
        ctx2d.fillText(ch, x, y);

        const speed = 8 + intensity * 18;
        drops[i] = y + speed;
        if (drops[i] > h + 100) drops[i] = Math.random() * -200;
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      ro.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [charset, intensity, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 h-full w-full opacity-70"
      aria-hidden="true"
    />
  );
}

