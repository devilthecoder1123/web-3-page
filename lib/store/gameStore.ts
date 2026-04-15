import { create } from "zustand";
import { buildRunScript, type TimelineEvent } from "@/lib/timeline/script";

export type GamePhase = "idle" | "downloading" | "fakeCrash" | "realCrash" | "cashedOut";
export type SecurityLevel = "LOW" | "MEDIUM" | "HIGH";
export type TensionLevel = "off" | "low" | "mid" | "high";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function securityFromProgress(progress: number): SecurityLevel {
  if (progress >= 70) return "HIGH";
  if (progress >= 35) return "MEDIUM";
  return "LOW";
}

function tensionFactor(t: TensionLevel) {
  if (t === "high") return 0.95;
  if (t === "mid") return 0.7;
  if (t === "low") return 0.42;
  return 0;
}

function intensityFrom({
  progress,
  tension,
  phase,
}: {
  progress: number;
  tension: TensionLevel;
  phase: GamePhase;
}) {
  if (phase === "realCrash") return 1;
  if (phase === "idle") return 0;
  const p = clamp(progress / 100, 0, 1);
  const tf = tensionFactor(tension);
  const bump = phase === "fakeCrash" ? 0.22 : 0;
  // progress drives baseline; tension makes it “feel” more intense
  return clamp(p * 0.82 + tf * 0.55 + bump, 0, 1);
}

type GameState = {
  phase: GamePhase;
  progress: number; // 0..100
  tension: TensionLevel;
  intensity: number; // 0..1
  frozenMs: number;
  cashedOutAt?: number;
  runId: number;

  // script cursor
  nextEventIdx: number;
  script: TimelineEvent[];

  // derived helpers (computed in updates)
  securityLevel: SecurityLevel;
  canCashOut: boolean;

  // actions
  start: () => void;
  reset: () => void;
  cashOut: () => void;
  tick: (deltaMs: number) => void;
};

function applyEvent(state: GameState, ev: TimelineEvent): GameState {
  if (ev.type === "tension") {
    return { ...state, tension: ev.level };
  }
  if (ev.type === "fakeCrash") {
    return { ...state, phase: "fakeCrash", frozenMs: ev.freezeMs };
  }
  // realCrash
  return { ...state, phase: "realCrash", frozenMs: 0, canCashOut: false };
}

export const useGameStore = create<GameState>()((set, get) => ({
  phase: "idle",
  progress: 0,
  tension: "off",
  intensity: 0,
  frozenMs: 0,
  cashedOutAt: undefined,
  runId: 1,
  nextEventIdx: 0,
  script: buildRunScript({ runId: 1 }),
  securityLevel: "LOW",
  canCashOut: true,

  start: () =>
    set(() => ({
      phase: "downloading",
      progress: 0,
      tension: "off",
      intensity: 0,
      frozenMs: 0,
      cashedOutAt: undefined,
      runId: get().runId + 1,
      nextEventIdx: 0,
      script: buildRunScript({ runId: get().runId + 1 }),
      securityLevel: "LOW",
      canCashOut: true,
    })),

  reset: () =>
    set(() => ({
      phase: "idle",
      progress: 0,
      tension: "off",
      intensity: 0,
      frozenMs: 0,
      cashedOutAt: undefined,
      runId: get().runId + 1,
      nextEventIdx: 0,
      script: buildRunScript({ runId: get().runId + 1 }),
      securityLevel: "LOW",
      canCashOut: true,
    })),

  cashOut: () =>
    set((s) => {
      if (!s.canCashOut || s.phase === "realCrash") return s;
      return {
        ...s,
        phase: "cashedOut",
        cashedOutAt: s.progress,
        canCashOut: false,
        frozenMs: 0,
      };
    }),

  tick: (deltaMs) =>
    set((s) => {
      const state = { ...s };

      // auto-start if idle (scripted demo)
      if (state.phase === "idle") {
        return {
          ...state,
          phase: "downloading",
          progress: 0,
          tension: "off",
          frozenMs: 0,
          cashedOutAt: undefined,
          nextEventIdx: 0,
          securityLevel: "LOW",
          canCashOut: true,
        };
      }

      if (state.phase === "realCrash") return state;

      // after cash-out, hold briefly then reset handled by hook (but keep stable here)
      if (state.phase === "cashedOut") return state;

      // freeze handling during fakeCrash
      if (state.frozenMs > 0) {
        const remaining = Math.max(0, state.frozenMs - deltaMs);
        state.frozenMs = remaining;
        if (remaining === 0 && state.phase === "fakeCrash") {
          state.phase = "downloading";
        }
        return state;
      }

      // progress rate: slow early, faster later (scripted feel)
      const p = state.progress;
      const basePerSec = p < 35 ? 6.5 : p < 70 ? 8.5 : 11;
      const nextProgress = Math.min(100, p + (basePerSec * deltaMs) / 1000);
      state.progress = nextProgress;

      // trigger scheduled events
      while (state.nextEventIdx < state.script.length) {
        const ev = state.script[state.nextEventIdx];
        if (nextProgress < ev.atProgress) break;
        state.nextEventIdx += 1;
        const applied = applyEvent(state, ev);
        Object.assign(state, applied);
        const phaseNow = state.phase as GamePhase;
        if (phaseNow === "realCrash" || state.frozenMs > 0) break;
      }

      state.securityLevel = securityFromProgress(state.progress);
      const phaseNow = state.phase as GamePhase;
      state.canCashOut = phaseNow !== "realCrash" && phaseNow !== "cashedOut";
      state.intensity = intensityFrom({
        progress: state.progress,
        tension: state.tension,
        phase: phaseNow,
      });

      // if reaches 100 without real crash (shouldn't in script), force crash
      if (state.progress >= 100 && phaseNow !== "realCrash") {
        state.phase = "realCrash";
        state.canCashOut = false;
        state.intensity = 1;
      }

      return state;
    }),
}));

export function getMultiplierFromProgress(progress: number) {
  // purely cosmetic for now: 1.0x..~10.0x
  const x = 1 + (progress / 100) * 9;
  return Math.max(1, Math.min(10, x));
}

