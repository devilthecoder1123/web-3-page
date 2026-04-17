import type { Metadata } from "next";
import { YakDealScreen } from "@/features/yak-deal";

export const metadata: Metadata = {
  title: "Yak Deal — Spin to Win",
  description:
    "Spin the Yak Technologies discount wheel for 10%, 20%, or 30% off your package.",
};

export default function YakDealPage() {
  return <YakDealScreen />;
}
