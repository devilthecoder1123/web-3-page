/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store/gameStore";

export function useTimeline() {
  const tick = useGameStore((s) => s.tick);
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function loop(now: number) {
      if (lastRef.current == null) lastRef.current = now;
      const delta = now - lastRef.current;
      lastRef.current = now;
      tick(delta);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (resetTimeoutRef.current != null)
        window.clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // scripted loop: after cash-out, reset back to idle
    if (resetTimeoutRef.current != null) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    if (phase === "cashedOut") {
      resetTimeoutRef.current = window.setTimeout(() => {
        lastRef.current = null;
        reset();
      }, 1800);
    }
  }, [phase, reset]);
}

