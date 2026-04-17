type AvailDiscountButtonProps = {
  spinning: boolean;
  onClick: () => void;
};

export function AvailDiscountButton({
  spinning,
  onClick,
}: AvailDiscountButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={spinning}
      className="neon-border w-full rounded-lg border bg-neon/15 px-4 py-4 text-center text-sm font-semibold text-fg shadow-neon transition hover:bg-neon/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {spinning ? "Spinning…" : "Click to avail discount"}
    </button>
  );
}
