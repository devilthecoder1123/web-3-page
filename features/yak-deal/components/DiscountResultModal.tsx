import type { DiscountPercent } from "../spin";

type DiscountResultModalProps = {
  open: boolean;
  discount: DiscountPercent | null;
  onClose: () => void;
};

export function DiscountResultModal({
  open,
  discount,
  onClose,
}: DiscountResultModalProps) {
  if (!open || discount == null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="yak-deal-modal-title"
      onClick={onClose}
    >
      <div
        className="neon-border w-full max-w-md rounded-2xl border bg-panel/95 p-8 shadow-alert backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="yak-deal-modal-title"
          className="text-center text-xl font-semibold text-fg"
        >
          You unlocked a discount
        </h2>
        <p className="mt-6 text-center text-5xl font-bold tabular-nums text-neon">
          {discount}%
        </p>
        <p className="mt-4 text-center text-sm text-fg/75">
          Apply this offer when you purchase your Yak package.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="neon-border mt-8 w-full rounded-lg border bg-neon/20 py-3 text-sm font-semibold text-fg hover:bg-neon/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}
