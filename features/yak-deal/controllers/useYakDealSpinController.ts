"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  nextRotationDelta,
  pickSegmentForOutcome,
  SPIN_MS,
  type DiscountPercent,
} from "../spin";

export type YakDealSpinController = {
  rotation: number;
  spinning: boolean;
  reduceMotion: boolean;
  modalOpen: boolean;
  wonDiscount: DiscountPercent | null;
  startSpin: () => void;
  closeModal: () => void;
};

export function useYakDealSpinController(): YakDealSpinController {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wonDiscount, setWonDiscount] = useState<DiscountPercent | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const spinEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (spinEndTimer.current != null) clearTimeout(spinEndTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const startSpin = useCallback(() => {
    if (spinning) return;
    const outcome = ([10, 20, 30] as const)[Math.floor(Math.random() * 3)];
    const segmentIndex = pickSegmentForOutcome(outcome);
    const delta = nextRotationDelta(rotation, segmentIndex);
    const next = rotation + delta;

    setSpinning(true);
    setModalOpen(false);
    setWonDiscount(null);

    if (reduceMotion) {
      setRotation(next);
      setWonDiscount(outcome);
      setModalOpen(true);
      setSpinning(false);
      return;
    }

    setRotation(next);
    if (spinEndTimer.current != null) clearTimeout(spinEndTimer.current);
    spinEndTimer.current = setTimeout(() => {
      spinEndTimer.current = null;
      setWonDiscount(outcome);
      setModalOpen(true);
      setSpinning(false);
    }, SPIN_MS);
  }, [rotation, spinning, reduceMotion]);

  return {
    rotation,
    spinning,
    reduceMotion,
    modalOpen,
    wonDiscount,
    startSpin,
    closeModal,
  };
}
