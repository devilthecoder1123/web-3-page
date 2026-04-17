const WHEEL_CONIC_GRADIENT = `conic-gradient(from 0deg,
  rgb(var(--h-neon) / 0.35) 0deg 30deg,
  rgb(var(--h-panel) / 0.95) 30deg 60deg,
  rgb(var(--h-neon2) / 0.25) 60deg 90deg,
  rgb(var(--h-neon) / 0.35) 90deg 120deg,
  rgb(var(--h-panel) / 0.95) 120deg 150deg,
  rgb(var(--h-neon2) / 0.25) 150deg 180deg,
  rgb(var(--h-neon) / 0.35) 180deg 210deg,
  rgb(var(--h-panel) / 0.95) 210deg 240deg,
  rgb(var(--h-neon2) / 0.25) 240deg 270deg,
  rgb(var(--h-neon) / 0.35) 270deg 300deg,
  rgb(var(--h-panel) / 0.95) 300deg 330deg,
  rgb(var(--h-neon2) / 0.25) 330deg 360deg
)`;

export function WheelSegmentBackground() {
  return (
    <div
      className="absolute inset-0 rounded-full"
      style={{ background: WHEEL_CONIC_GRADIENT }}
    />
  );
}
