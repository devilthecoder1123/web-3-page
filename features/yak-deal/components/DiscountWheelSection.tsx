import { SpinWheel } from "./SpinWheel";

type DiscountWheelSectionProps = {
  rotation: number;
  spinning: boolean;
  reduceMotion: boolean;
};

export function DiscountWheelSection({
  rotation,
  spinning,
  reduceMotion,
}: DiscountWheelSectionProps) {
  return (
    <section className="flex flex-col items-center gap-4">
      <h2 className="self-end text-sm font-semibold uppercase tracking-widest text-neon">
        Discount
      </h2>
      <SpinWheel
        rotation={rotation}
        spinning={spinning}
        reduceMotion={reduceMotion}
      />
    </section>
  );
}
