"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { beep, enableAudio, isAudioEnabled } from "@/lib/audio/sfx";
import { useReducedMotionPref } from "@/lib/ui/useReducedMotionPref";

type Popup = {
  id: string;
  title: string;
  body: string;
  variant: "warn" | "scan";
  x: number; // 0..1
  y: number; // 0..1
};

const CATALOG: Omit<Popup, "id" | "x" | "y">[] = [
  {
    title: "Suspicious activity detected",
    body: "Unrecognized process attempting memory access.",
    variant: "warn",
  },
  { title: "Scanning system…", body: "Heuristics: enabled. Ports: probing.", variant: "scan" },
  { title: "Firewall warning", body: "Packet anomaly detected on loopback.", variant: "warn" },
  { title: "Integrity check", body: "Kernel signatures mismatch suspected.", variant: "scan" },
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function PopupsLayer() {
  const progress = useGameStore((s) => s.progress);
  const tension = useGameStore((s) => s.tension);
  const phase = useGameStore((s) => s.phase);
  const intensity = useGameStore((s) => s.intensity);
  const runId = useGameStore((s) => s.runId);
  const reducedMotion = useReducedMotionPref();

  const [popups, setPopups] = useState<Popup[]>([]);
  const spawnIdx = useRef(0);

  // stable RNG for scripted demo “randomness”
  const rng = useMemo(() => mulberry32(1337 + runId * 13), [runId]);

  const i = Math.max(0, Math.min(1, intensity));
  const cadenceMs =
    tension === "off"
      ? 999999
      : Math.max(240, Math.round(1350 - i * 980)); // faster with intensity

  useEffect(() => {
    // clear popups on major transitions
    if (phase === "realCrash" || phase === "idle") setPopups([]);
  }, [phase]);

  useEffect(() => {
    if (tension === "off") return;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      // spawn less when early in run
      if (progress < 10) return;
      const pick = CATALOG[spawnIdx.current % CATALOG.length];
      spawnIdx.current += 1;

      // spawn around the sides; avoid the center region where the main panel sits
      let x = 0.12 + rng() * 0.76;
      let y = 0.08 + rng() * 0.62;
      let guard = 0;
      while (guard++ < 12) {
        const inCenterX = x > 0.26 && x < 0.74;
        const inCenterY = y > 0.18 && y < 0.72;
        if (!(inCenterX && inCenterY)) break;
        x = 0.12 + rng() * 0.76;
        y = 0.08 + rng() * 0.62;
      }
      const popup: Popup = {
        id: `${Date.now()}-${spawnIdx.current}`,
        ...pick,
        x,
        y,
      };

      setPopups((prev) => {
        const max = i > 0.75 ? 6 : i > 0.45 ? 5 : 4;
        const next = [popup, ...prev].slice(0, max);
        return next;
      });

      // beep: tempo + pitch increase with intensity
      const f = 520 + i * 980;
      beep({ freq: f, durationMs: Math.max(28, Math.round(60 - i * 28)) });
    }, cadenceMs);

    return () => window.clearInterval(id);
  }, [cadenceMs, i, progress, reducedMotion, rng, tension]);

  useEffect(() => {
    // one-time global gesture gate for audio
    function onFirstGesture() {
      if (reducedMotion) return;
      if (!isAudioEnabled()) enableAudio();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    }
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <AnimatePresence>
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute w-[280px] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md px-4 py-3 shadow-lg"
            style={{
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              transform: "translate(-50%, 0)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-fg/90">
                  {p.variant === "warn" ? (
                    <span className="text-alert">WARNING</span>
                  ) : (
                    <span className="neon-text">SCAN</span>
                  )}{" "}
                  <span className="text-fg/90">{p.title}</span>
                </div>
                <div className="mt-1 text-xs text-fg/70">{p.body}</div>
              </div>
              <div className="text-[10px] text-fg/50 tabular-nums">LIVE</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

