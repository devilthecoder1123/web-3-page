"use client";
import { ProgressBar } from "./ProgressBar";
import { useTimeline } from "@/lib/timeline/useTimeline";
import { getMultiplierFromProgress, useGameStore } from "@/lib/store/gameStore";
import { motion } from "framer-motion";
import { useReducedMotionPref } from "@/lib/ui/useReducedMotionPref";

export function MainPanel() {
  useTimeline();
  const reducedMotion = useReducedMotionPref();

  const progress = useGameStore((s) => s.progress);
  const securityLevel = useGameStore((s) => s.securityLevel);
  const tension = useGameStore((s) => s.tension);
  const intensity = useGameStore((s) => s.intensity);
  const phase = useGameStore((s) => s.phase);
  const canCashOut = useGameStore((s) => s.canCashOut);
  const cashOut = useGameStore((s) => s.cashOut);

  const glitchOn = tension !== "off" || phase === "fakeCrash" || phase === "realCrash";
  const multiplier = getMultiplierFromProgress(progress);
  const shake = Math.max(0, Math.min(1, intensity)) * 3.2;
  const showCashOut = phase !== "realCrash";

  return (
    <div className="relative z-30 w-full max-w-4xl px-6">
      <motion.div
        className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-7 md:p-10 crt-overlay"
        animate={
          glitchOn && !reducedMotion
            ? {
                x: [0, -0.35, 0.35, -0.6, 0.6, 0].map((v) => v * shake),
                y: [0, 0.3, -0.3, 0.45, -0.45, 0].map((v) => v * shake),
              }
            : { x: 0, y: 0 }
        }
        transition={
          glitchOn && !reducedMotion
            ? { duration: 0.28, repeat: Infinity, repeatDelay: 0.65 }
            : { duration: 0.2 }
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="text-xs tracking-widest text-fg/65">
              SECURITY LEVEL:{" "}
              <span
                className={
                  securityLevel === "HIGH"
                    ? "text-alert font-semibold"
                    : "neon-text font-semibold"
                }
              >
                {securityLevel}
              </span>
            </div>
            <div className="text-xs text-fg/55">
              GLITCH:{" "}
              <span className={glitchOn ? "text-alert" : "text-fg/55"}>
                {glitchOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-full max-w-xl">
              <ProgressBar value={progress} intensity={intensity} />
            </div>

            {showCashOut && (
              <button
                type="button"
                onClick={cashOut}
                disabled={!canCashOut}
                className="relative z-10 mt-2 w-full max-w-sm rounded-2xl bg-emerald-500 px-7 py-6 text-xl font-extrabold tracking-widest text-black shadow-neon transition-transform active:scale-[0.99] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon2/80 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                💸 CASH OUT{" "}
                <span className="ml-2 text-black/70 tabular-nums">
                  {multiplier.toFixed(2)}x
                </span>
              </button>
            )}

            <div className="text-xs text-fg/55">
              {phase === "realCrash"
                ? "SYSTEM LOCKED YOU OUT."
                : phase === "cashedOut"
                  ? "CASHED OUT. RESTARTING…"
                  : phase === "fakeCrash"
                    ? "SYSTEM BREACH DETECTED…"
                    : "Cash out before the system locks you out."}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

