"use client";

import { useGameStore } from "@/lib/store/gameStore";
import { useReducedMotionPref } from "@/lib/ui/useReducedMotionPref";

export function GlitchOverlay() {
  const reducedMotion = useReducedMotionPref();
  const intensity = useGameStore((s) => s.intensity);
  const phase = useGameStore((s) => s.phase);

  if (reducedMotion) return null;

  const i = Math.max(0, Math.min(1, intensity));
  const active = i > 0.05 && phase !== "idle";

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* scanlines */}
      <div
        className="absolute inset-0 glitch-scanlines"
        style={{ opacity: 0.12 + i * 0.28 }}
      />

      {/* noise */}
      <div
        className="absolute inset-0 glitch-noise"
        style={{ opacity: 0.06 + i * 0.22 }}
      />

      {/* subtle RGB split */}
      <div
        className="absolute inset-0 glitch-rgb"
        style={{
          opacity: i * 0.35,
          filter: `blur(${0.15 + i * 0.55}px)`,
        }}
      />
    </div>
  );
}

