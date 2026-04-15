import { MainPanel } from "@/components/MainPanel";
import { SocialFeed } from "@/components/SocialFeed";
import { MatrixBackground } from "@/components/MatrixBackground";
import { PopupsLayer } from "@/components/PopupsLayer";
import { GlitchOverlay } from "@/components/GlitchOverlay";
import { AlertOverlay } from "@/components/AlertOverlay";
import { AccessDeniedOverlay } from "@/components/AccessDeniedOverlay";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center bg-matrix px-4 py-10">
      <MatrixBackground />
      <GlitchOverlay />
      <PopupsLayer />
      <AlertOverlay />
      <AccessDeniedOverlay />
      <MainPanel />

      <div className="mt-6 w-full max-w-4xl px-6">
        <SocialFeed />
      </div>
    </div>
  );
}
