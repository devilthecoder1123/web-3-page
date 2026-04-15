"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { glitchBurst } from "@/lib/audio/sfx";
import { useGameStore, type GamePhase } from "@/lib/store/gameStore";

export function AccessDeniedOverlay() {
  const phase = useGameStore((s) => s.phase);
  const reset = useGameStore((s) => s.reset);
  const prevRef = useRef<GamePhase>(phase);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = phase;

    if (phase === "realCrash" && prev !== "realCrash") {
      // “loud” glitch: layered bursts
      glitchBurst({ durationMs: 240 });
      window.setTimeout(() => glitchBurst({ durationMs: 220 }), 90);
      window.setTimeout(() => glitchBurst({ durationMs: 180 }), 180);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase === "realCrash" && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.92, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, times: [0, 0.25, 0.55, 1] }}
          style={{ backgroundColor: "rgb(var(--h-alert))" }}
        >
          {/* blocks interaction behind */}
          <div className="pointer-events-auto absolute inset-0" />

          <div className="relative mx-auto w-full max-w-2xl px-6 text-center">
            <div className="mx-auto mb-5 h-1 w-28 rounded-full bg-black/35" />
            <div className="text-xs tracking-[0.45em] text-black/70">
              SYSTEM RESPONSE
            </div>

            <motion.div
              className="mt-3 text-5xl font-bold leading-tight text-black glitch-text"
              data-text="ACCESS DENIED"
              animate={{ x: [0, -2, 2, -1, 1, 0] }}
              transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 0.4 }}
            >
              ACCESS DENIED
            </motion.div>

            <div className="mt-4 text-base text-black/75">
              You lost. You didn’t cash out in time.
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="rounded-2xl bg-black/25 px-5 py-4 text-sm text-black/70">
                Session locked. Restart to try again.
              </div>
              <button
                type="button"
                onClick={reset}
                className="pointer-events-auto rounded-2xl bg-black/80 px-6 py-4 text-sm font-semibold tracking-widest text-fg shadow-lg hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              >
                RESTART
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

