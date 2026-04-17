export type DiscountPercent = 10 | 20 | 30;

/** 12 segments: four 10%, four 20%, four 30% (matches client sketch). */
export const SEGMENT_LABELS = [
  10, 10, 10, 10, 20, 20, 20, 20, 30, 30, 30, 30,
] as const;

export const SPIN_MS = 10_000;
export const FULL_SPINS = 8;

export function pickSegmentForOutcome(outcome: DiscountPercent): number {
  const indices = SEGMENT_LABELS.map((v, i) => (v === outcome ? i : -1)).filter(
    (i) => i >= 0,
  );
  return indices[Math.floor(Math.random() * indices.length)]!;
}

export function mod360(n: number): number {
  return ((n % 360) + 360) % 360;
}

export function nextRotationDelta(
  rotation: number,
  segmentIndex: number,
): number {
  const base = 15 + segmentIndex * 30;
  const current = mod360(base + rotation);
  const align = (360 - current) % 360;
  const extra = align === 0 ? 360 : align;
  return 360 * FULL_SPINS + extra;
}
