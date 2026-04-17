"use client";

import { useMemo, type CSSProperties } from "react";
import { SPIN_MS } from "../spin";
import { WheelHub } from "./WheelHub";
import { WheelPointer } from "./WheelPointer";
import { WheelSegmentBackground } from "./WheelSegmentBackground";
import { WheelSegmentLabels } from "./WheelSegmentLabels";

type SpinWheelProps = {
  rotation: number;
  spinning: boolean;
  reduceMotion: boolean;
};

export function SpinWheel({
  rotation,
  spinning,
  reduceMotion,
}: SpinWheelProps) {
  const wheelStyle = useMemo(
    () =>
      ({
        transform: `rotate(${rotation}deg)`,
        transition: spinning
          ? `transform ${reduceMotion ? 0 : SPIN_MS}ms cubic-bezier(0.12, 0.82, 0.14, 1)`
          : "none",
      }) as CSSProperties,
    [rotation, spinning, reduceMotion],
  );

  return (
    <div className="relative flex w-full max-w-[min(100%,420px)] flex-col items-center">
      <WheelPointer />
      <div className="aspect-square w-full max-w-[380px] p-2">
        <div className="relative h-full w-full rounded-full border-4 border-neon/40 bg-black/30 p-1 shadow-[0_0_40px_rgb(var(--h-neon)/0.15)]">
          <div
            className="relative h-full w-full rounded-full"
            style={wheelStyle}
          >
            <WheelSegmentBackground />
            <WheelSegmentLabels />
          </div>
          <WheelHub />
        </div>
      </div>
      <p className="mt-3 max-w-sm text-center text-xs text-fg/65 sm:text-sm">
        After 10 seconds the wheel stops on{" "}
        <span className="text-neon">10%</span>,{" "}
        <span className="text-neon2">20%</span>, or{" "}
        <span className="text-neon">30%</span> off — then your discount appears
        in a modal.
      </p>
    </div>
  );
}
