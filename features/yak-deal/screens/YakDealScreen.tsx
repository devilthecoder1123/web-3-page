"use client";

import { DiscountResultModal } from "../components/DiscountResultModal";
import { DiscountWheelSection } from "../components/DiscountWheelSection";
import { YakDealHeader } from "../components/YakDealHeader";
import { YakPackageSection } from "../components/YakPackageSection";
import { useYakDealSpinController } from "../controllers/useYakDealSpinController";

export function YakDealScreen() {
  const {
    rotation,
    spinning,
    reduceMotion,
    modalOpen,
    wonDiscount,
    startSpin,
    closeModal,
  } = useYakDealSpinController();

  return (
    <div className="relative min-h-screen bg-matrix px-4 py-8 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <YakDealHeader />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <YakPackageSection
            spinning={spinning}
            onAvailDiscount={startSpin}
          />
          <DiscountWheelSection
            rotation={rotation}
            spinning={spinning}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>

      <DiscountResultModal
        open={modalOpen}
        discount={wonDiscount}
        onClose={closeModal}
      />
    </div>
  );
}
