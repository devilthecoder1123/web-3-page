import { SEGMENT_LABELS } from "../spin";

/**
 * Radial labels: each segment center is at (15 + i×30)° clockwise from 12 o'clock.
 * Spokes use bottom/center origin so rotation is around the wheel hub.
 */
export function WheelSegmentLabels() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {SEGMENT_LABELS.map((pct, i) => {
        const deg = i * 30 + 15;
        return (
          <div
            key={i}
            className="absolute bottom-1/2 left-1/2 h-[40%] w-max min-w-0 max-w-[45%] -translate-x-1/2"
            style={{
              transformOrigin: "bottom center",
              transform: `rotate(${deg}deg)`,
            }}
          >
            <span
              className="absolute left-1/2 top-0 whitespace-nowrap text-center text-[11px] font-bold tabular-nums text-fg/90 sm:text-xs"
              style={{
                transform: `translate(-50%, -50%) rotate(${-deg}deg)`,
              }}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
