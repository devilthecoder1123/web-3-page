export function WheelPointer() {
  return (
    <div
      className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-neon drop-shadow-[0_0_8px_rgb(var(--h-neon)/0.5)]"
      aria-hidden
    >
      <svg width="28" height="20" viewBox="0 0 28 20" className="overflow-visible">
        <polygon
          points="14,20 4,4 24,4"
          fill="currentColor"
          className="text-neon"
        />
      </svg>
    </div>
  );
}
