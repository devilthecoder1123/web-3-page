export type TimelineEvent =
  | { type: "tension"; atProgress: number; level: "low" | "mid" | "high" }
  | { type: "fakeCrash"; atProgress: number; freezeMs: number }
  | { type: "realCrash"; atProgress: number };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function buildRunScript({
  runId,
}: {
  runId: number;
}): TimelineEvent[] {
  // deterministic per runId, “random” feel for the user
  const rng = mulberry32(42000 + runId * 997);

  // tension thresholds (slightly jittered)
  const lowAt = round2(clamp(14 + rng() * 10, 12, 26));
  const midAt = round2(clamp(38 + rng() * 12, 30, 58));
  const highAt = round2(clamp(66 + rng() * 12, 55, 82));

  // fake crashes (2–4, spread, avoid clustering too close)
  const fakeCount = 2 + Math.floor(rng() * 3); // 2..4
  const fakePoints: number[] = [];
  let guard = 0;
  while (fakePoints.length < fakeCount && guard++ < 80) {
    // put them mostly after low tension starts
    const p = round2(clamp(lowAt + 8 + rng() * 62, 18, 88));
    const tooClose =
      fakePoints.some((x) => Math.abs(x - p) < 10) ||
      Math.abs(p - midAt) < 6 ||
      Math.abs(p - highAt) < 6;
    if (!tooClose) fakePoints.push(p);
  }
  fakePoints.sort((a, b) => a - b);

  // real crash happens late-ish; keep room for a late fake crash too
  const realCrashAt = round2(clamp(86 + rng() * 10, 84, 96.5));

  const events: TimelineEvent[] = [
    { type: "tension", atProgress: lowAt, level: "low" },
    { type: "tension", atProgress: midAt, level: "mid" },
    { type: "tension", atProgress: highAt, level: "high" },
    ...fakePoints.map((atProgress, i) => {
      // freeze increases later in the run
      const base = 520 + i * 120;
      const jitter = (rng() * 380) | 0;
      const freezeMs = Math.max(420, Math.min(1050, base + jitter));
      return { type: "fakeCrash", atProgress, freezeMs } as const;
    }),
    { type: "realCrash", atProgress: realCrashAt },
  ];

  return events.sort((a, b) => a.atProgress - b.atProgress);
}

