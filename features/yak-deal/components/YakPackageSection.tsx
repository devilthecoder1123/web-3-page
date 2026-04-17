import { AvailDiscountButton } from "./AvailDiscountButton";

type YakPackageSectionProps = {
  spinning: boolean;
  onAvailDiscount: () => void;
};

export function YakPackageSection({
  spinning,
  onAvailDiscount,
}: YakPackageSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-neon">
        Yak Package
      </h2>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className="neon-border flex min-h-[220px] flex-1 flex-col justify-end rounded-xl border bg-panel/60 p-4 shadow-neon backdrop-blur-sm">
          <div className="mb-4 flex flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-neon/10 via-panel to-neon2/5">
            <span className="text-center text-xs text-fg/60 sm:text-sm">
              Package preview
            </span>
          </div>
          <p className="text-sm text-fg/85">
            Yak Technologies — web solutions and digital marketing packages
            tailored to your goals.
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-center sm:w-44">
          <AvailDiscountButton spinning={spinning} onClick={onAvailDiscount} />
        </div>
      </div>
    </section>
  );
}
