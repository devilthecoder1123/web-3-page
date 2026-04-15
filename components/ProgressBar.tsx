import clsx from "clsx";

export function ProgressBar({
  value,
  intensity = 0,
  className,
}: {
  value: number;
  intensity?: number; // 0..1
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const i = Math.max(0, Math.min(1, intensity));
  const pulseMs = 1400 - i * 850; 

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex items-center justify-between text-xs text-fg/70">
        <span className="tracking-widest">[ DOWNLOADING… {clamped.toFixed(2)}% ]</span>
      </div>
      <div className="mt-2 rounded-full border border-neon/35 bg-black/40 p-1 neon-border">
        <div
          className="h-3 rounded-full bg-neon shadow-neon"
          style={{
            width: `${clamped}%`,
            minWidth: clamped > 0 ? "6px" : undefined,
            transition: "width 120ms linear",
            animation: `progressPulse ${pulseMs}ms ease-in-out infinite`,
            filter: `drop-shadow(0 0 ${6 + i * 14}px rgba(0,255,102,0.65))`,
          }}
        />
      </div>
    </div>
  );
}

