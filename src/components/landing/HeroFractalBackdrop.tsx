import { useEffect, useState } from "react";
import { CanvasFractalGrid } from "@/components/ui/canvas-fractal-grid";

/** Atmosfera viva da landing — grid fractal em tom atelier/teal. */
export function HeroFractalBackdrop() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);

    // Defer canvas mount so LCP/copy paint first
    const timeoutId = window.setTimeout(() => setReady(true), 60);

    return () => {
      mq.removeEventListener("change", sync);
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <CanvasFractalGrid
        className="opacity-80 dark:opacity-50"
        reducedMotion={reducedMotion}
        dotSize={3}
        dotSpacing={22}
        dotOpacity={0.28}
        waveIntensity={32}
        waveRadius={260}
        enableNoise
        noiseOpacity={0.025}
        enableMouseGlow
        initialPerformance="medium"
        // hsl(168 78% 24%) ≈ primary atelier
        dotColor="rgba(14, 109, 88, 1)"
        glowColor="rgba(22, 140, 112, 1)"
      />
      {/* Soft veil so copy/preview stay crisp over the grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(160_25%_97%/0.55)] dark:to-[hsl(170_25%_7%/0.65)]" />
    </div>
  );
}
