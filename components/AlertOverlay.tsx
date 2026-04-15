"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { glitchBurst } from "@/lib/audio/sfx";
import { useGameStore, type GamePhase } from "@/lib/store/gameStore";

export function AlertOverlay() {
  const phase = useGameStore((s) => s.phase);
  const prevRef = useRef<GamePhase>(phase);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = phase;

    if (phase === "fakeCrash" && prev !== "fakeCrash") {
      setFlashKey((k) => k + 1);
      glitchBurst({ durationMs: 180 });
    }
  }, [phase]);

  return (
    <>
      <AnimatePresence>
        {phase === "fakeCrash" && (
          <motion.div
            key={`flash-${flashKey}`}
            className="pointer-events-none absolute inset-0 bg-alert/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.55, 0.82, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, times: [0, 0.15, 0.35, 0.55, 1] }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "fakeCrash" && (
          <motion.div
            className="absolute inset-0 flex items-start justify-center pt-14 px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <div className="w-full max-w-lg rounded-3xl border border-alert/40 bg-black/70 backdrop-blur-md p-6 shadow-alert">
              <div className="text-xs tracking-widest text-alert/90">
                🚨 SYSTEM BREACH DETECTED
              </div>
              <div
                className="mt-2 text-2xl font-semibold text-fg glitch-text"
                data-text="SYSTEM BREACH DETECTED"
              >
                SYSTEM BREACH DETECTED
              </div>
              <div className="mt-2 text-sm text-fg/70">
                Stream halted. Patching intrusion vectors…
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-alert/80"
                  initial={{ width: "18%" }}
                  animate={{ width: ["18%", "42%", "28%", "56%"] }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="mt-3 text-xs text-fg/55">
                Do not move. System scan in progress.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

