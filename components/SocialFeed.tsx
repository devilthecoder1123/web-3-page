"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMultiplierFromProgress, useGameStore } from "@/lib/store/gameStore";

type FeedItem = {
  id: string;
  text: string;
  tone: "win" | "lose";
};

const NAMES = [
  "Ankit",
  "Rahul",
  "Neha",
  "Priya",
  "Aman",
  "Kunal",
  "Isha",
  "Rohit",
  "Sneha",
  "Arjun",
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function SocialFeed() {
  const phase = useGameStore((s) => s.phase);
  const progress = useGameStore((s) => s.progress);
  const runId = useGameStore((s) => s.runId);

  const rng = useMemo(() => mulberry32(9000 + runId * 7), [runId]);
  const [items, setItems] = useState<FeedItem[]>(() => [
    { id: "seed-1", text: "Ankit cashed out at 4.5x 💰", tone: "win" },
    { id: "seed-2", text: "Rahul lost at 8.2x 😭", tone: "lose" },
    { id: "seed-3", text: "Neha cashed out at 2.1x 💵", tone: "win" },
  ]);

  const clockStartRef = useRef<number>(Date.now());
  const [clock, setClock] = useState("00:00:00");

  useEffect(() => {
    clockStartRef.current = Date.now();
    setClock("00:00:00");
    setItems([
      { id: "seed-1", text: "Ankit cashed out at 4.5x 💰", tone: "win" },
      { id: "seed-2", text: "Rahul lost at 8.2x 😭", tone: "lose" },
      { id: "seed-3", text: "Neha cashed out at 2.1x 💵", tone: "win" },
    ]);
  }, [runId]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const ms = Date.now() - clockStartRef.current;
      const total = Math.floor(ms / 1000);
      const hh = String(Math.floor(total / 3600)).padStart(2, "0");
      const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
      const ss = String(total % 60).padStart(2, "0");
      setClock(`${hh}:${mm}:${ss}`);
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    // faster feed as tension increases (based on progress)
    const p = progress;
    const everyMs = p < 35 ? 1900 : p < 70 ? 1400 : 950;

    const id = window.setInterval(() => {
      const name = NAMES[Math.floor(rng() * NAMES.length)];
      const multiplier = getMultiplierFromProgress(
        Math.max(8, Math.min(98, p + (rng() * 26 - 13))),
      );
      // pressure curve: lots of wins early, more losses late
      const prog = Math.max(0, Math.min(1, p / 100));
      const curve = 0.8 - prog * 0.35; // 0.8 → 0.45
      const phaseAdj = phase === "realCrash" ? -0.35 : phase === "fakeCrash" ? -0.18 : 0;
      const winChance = Math.max(0.08, Math.min(0.9, curve + phaseAdj));
      const win = rng() < winChance;

      const text = win
        ? `${name} cashed out at ${multiplier.toFixed(1)}x 💰`
        : `${name} lost at ${multiplier.toFixed(1)}x 😭`;

      const item: FeedItem = {
        id: `${Date.now()}-${Math.floor(rng() * 1e9)}`,
        text,
        tone: win ? "win" : "lose",
      };

      setItems((prev) => [item, ...prev].slice(0, 6));
    }, everyMs);

    return () => window.clearInterval(id);
  }, [phase, progress, rng]);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs tracking-widest text-fg/60">LIVE FEED</div>
        <div className="text-[11px] text-fg/45 tabular-nums">{clock}</div>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2"
          >
            <span className="text-sm text-fg/85">{item.text}</span>
            <span
              className={
                item.tone === "win"
                  ? "text-xs neon-text"
                  : "text-xs text-alert/90"
              }
            >
              {item.tone === "win" ? "CASHED OUT" : "LOST"}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-fg/60">
        Everyone is winning… I should stay…
      </div>
    </div>
  );
}

