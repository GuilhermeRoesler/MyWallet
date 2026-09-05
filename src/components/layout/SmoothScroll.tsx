import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";

type SmoothScrollProps = {
  children: ReactNode;
};

/** Smooth scroll via Lenis em todo o app; respeita prefers-reduced-motion. */
export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.085,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
        anchors: true,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
