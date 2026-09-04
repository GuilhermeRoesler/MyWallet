import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CanvasFractalGridProps {
  /** Size of each dot in pixels */
  dotSize?: number;
  /** Spacing between dots in pixels */
  dotSpacing?: number;
  /** Opacity of dots (0-1) */
  dotOpacity?: number;
  /** Intensity of the wave effect when hovering */
  waveIntensity?: number;
  /** Radius of the wave effect in pixels */
  waveRadius?: number;
  /** Dot fill color — use rgba(..., 1); alpha is applied from dotOpacity */
  dotColor?: string;
  /** Glow color near the pointer — same rgba convention */
  glowColor?: string;
  /** Enable soft noise overlay */
  enableNoise?: boolean;
  /** Noise overlay opacity (0-1) */
  noiseOpacity?: number;
  /** Soft radial glow that follows the pointer */
  enableMouseGlow?: boolean;
  /** Skip / density tier for the canvas loop */
  initialPerformance?: "low" | "medium" | "high";
  /** Pause animation and pointer reaction */
  reducedMotion?: boolean;
  className?: string;
  style?: CSSProperties;
}

const NoiseOverlay = memo(function NoiseOverlay({
  opacity,
}: {
  opacity: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{ opacity }}
      aria-hidden
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="mw-fractal-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#mw-fractal-noise)" />
      </svg>
    </div>
  );
});

const MouseGlow = memo(function MouseGlow({
  glowColor,
  mousePos,
}: {
  glowColor: string;
  mousePos: { x: number; y: number };
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute h-40 w-40 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor.replace(
            "1)",
            "0.18)"
          )} 0%, ${glowColor.replace("1)", "0)")} 70%)`,
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
          filter: "blur(12px)",
        }}
      />
      <div
        className="pointer-events-none absolute h-20 w-20 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor.replace(
            "1)",
            "0.28)"
          )} 0%, ${glowColor.replace("1)", "0)")} 70%)`,
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
});

const DotCanvas = memo(function DotCanvas({
  dotSize,
  dotSpacing,
  dotOpacity,
  waveIntensity,
  waveRadius,
  dotColor,
  glowColor,
  performance,
  pointerRef,
  reducedMotion,
}: {
  dotSize: number;
  dotSpacing: number;
  dotOpacity: number;
  waveIntensity: number;
  waveRadius: number;
  dotColor: string;
  glowColor: string;
  performance: "low" | "medium" | "high";
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  const drawDots = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const { width, height } = sizeRef.current;
      if (width <= 0 || height <= 0) return;
      ctx.clearRect(0, 0, width, height);

      const skip =
        performance === "low" ? 3 : performance === "medium" ? 2 : 1;
      const cols = Math.ceil(width / dotSpacing);
      const rows = Math.ceil(height / dotSpacing);
      const centerX = pointerRef.current.x * width;
      const centerY = pointerRef.current.y * height;
      const interact = !reducedMotion && waveIntensity > 0;

      for (let i = 0; i < cols; i += skip) {
        for (let j = 0; j < rows; j += skip) {
          const x = i * dotSpacing;
          const y = j * dotSpacing;
          let dotX = x;
          let dotY = y;

          if (interact) {
            const distanceX = x - centerX;
            const distanceY = y - centerY;
            const distance = Math.hypot(distanceX, distanceY);

            if (distance < waveRadius) {
              const waveStrength = (1 - distance / waveRadius) ** 2;
              const angle = Math.atan2(distanceY, distanceX);
              const waveOffset =
                Math.sin(distance * 0.05 - time * 0.005) *
                waveIntensity *
                waveStrength;
              dotX += Math.cos(angle) * waveOffset;
              dotY += Math.sin(angle) * waveOffset;

              const glowRadius = dotSize * (1 + waveStrength);
              const gradient = ctx.createRadialGradient(
                dotX,
                dotY,
                0,
                dotX,
                dotY,
                glowRadius
              );
              gradient.addColorStop(
                0,
                glowColor.replace(
                  "1)",
                  `${dotOpacity * (1 + waveStrength)}`
                )
              );
              gradient.addColorStop(1, glowColor.replace("1)", "0)"));
              ctx.fillStyle = gradient;
            } else {
              ctx.fillStyle = dotColor.replace("1)", `${dotOpacity})`);
            }
          } else {
            ctx.fillStyle = dotColor.replace("1)", `${dotOpacity})`);
          }

          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    [
      dotSize,
      dotSpacing,
      dotOpacity,
      waveIntensity,
      waveRadius,
      dotColor,
      glowColor,
      performance,
      pointerRef,
      reducedMotion,
    ]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width, height };
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) drawDots(ctx, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    if (reducedMotion) {
      return () => observer.disconnect();
    }

    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > 16) {
        drawDots(ctx, time);
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [drawDots, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
});

function useViewportTier() {
  const [tier, setTier] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setTier("mobile");
      else if (w < 1024) setTier("tablet");
      else setTier("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}

export function CanvasFractalGrid({
  dotSize = 3,
  dotSpacing = 22,
  dotOpacity = 0.22,
  waveIntensity = 28,
  waveRadius = 220,
  dotColor = "rgba(20, 120, 100, 1)",
  glowColor = "rgba(20, 140, 110, 1)",
  enableNoise = true,
  noiseOpacity = 0.025,
  enableMouseGlow = true,
  initialPerformance = "medium",
  reducedMotion = false,
  className,
  style,
}: CanvasFractalGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = useViewportTier();
  const pointerRef = useRef({ x: 0.62, y: 0.38 });
  const [glowPos, setGlowPos] = useState({ x: 0.62, y: 0.38 });
  const lastInteractRef = useRef(0);

  const performance = useMemo(() => {
    if (tier === "mobile") return "low" as const;
    if (tier === "tablet") return "medium" as const;
    return initialPerformance;
  }, [tier, initialPerformance]);

  const responsiveDotSize = useMemo(() => {
    if (tier === "mobile") return dotSize * 0.75;
    if (tier === "tablet") return dotSize * 0.9;
    return dotSize;
  }, [tier, dotSize]);

  const responsiveDotSpacing = useMemo(() => {
    if (tier === "mobile") return dotSpacing * 1.55;
    if (tier === "tablet") return dotSpacing * 1.25;
    return dotSpacing;
  }, [tier, dotSpacing]);

  const showGlow = enableMouseGlow && !reducedMotion && tier !== "mobile";

  useEffect(() => {
    if (reducedMotion || tier === "mobile") return;

    const onMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;
      lastInteractRef.current = globalThis.performance.now();
      const next = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
      pointerRef.current = next;
      setGlowPos(next);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, tier]);

  // Soft ambient drift when idle — updates the canvas ref every frame,
  // and throttles glow state so React doesn't re-render at 60fps.
  useEffect(() => {
    if (reducedMotion || tier === "mobile") return;

    let raf = 0;
    let lastGlowSync = 0;
    const tick = (time: number) => {
      if (time - lastInteractRef.current > 1800) {
        const next = {
          x: 0.55 + Math.sin(time * 0.00035) * 0.22,
          y: 0.42 + Math.cos(time * 0.00028) * 0.18,
        };
        pointerRef.current = next;
        if (time - lastGlowSync > 48) {
          lastGlowSync = time;
          setGlowPos(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, tier]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1.2, ease: "easeOut" }}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={style}
      aria-hidden
    >
      <DotCanvas
        dotSize={responsiveDotSize}
        dotSpacing={responsiveDotSpacing}
        dotOpacity={dotOpacity}
        waveIntensity={reducedMotion ? 0 : waveIntensity}
        waveRadius={waveRadius}
        dotColor={dotColor}
        glowColor={glowColor}
        performance={performance}
        pointerRef={pointerRef}
        reducedMotion={reducedMotion}
      />
      {enableNoise && <NoiseOverlay opacity={noiseOpacity} />}
      {showGlow && <MouseGlow glowColor={glowColor} mousePos={glowPos} />}
    </motion.div>
  );
}

export default memo(CanvasFractalGrid);
