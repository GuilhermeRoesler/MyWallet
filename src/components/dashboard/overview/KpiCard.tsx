import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone?: "neutral" | "success" | "danger" | "primary";
  delta?: string;
  deltaPositive?: boolean;
  sparkline?: number[];
  className?: string;
  style?: CSSProperties;
};

function MiniSparkline({ values, tone }: { values: number[]; tone: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  const stroke =
    tone === "success"
      ? "hsl(var(--success))"
      : tone === "danger"
        ? "hsl(var(--destructive))"
        : "hsl(var(--primary))";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible opacity-80">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function KpiCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  delta,
  deltaPositive,
  sparkline,
  className,
  style,
}: KpiCardProps) {
  const accent =
    tone === "success"
      ? "bg-success"
      : tone === "danger"
        ? "bg-destructive"
        : tone === "primary"
          ? "bg-primary"
          : "bg-foreground/25";

  const iconTone =
    tone === "success"
      ? "text-success bg-success/10"
      : tone === "danger"
        ? "text-destructive bg-destructive/10"
        : tone === "primary"
          ? "text-primary bg-primary/10"
          : "text-muted-foreground bg-muted";

  return (
    <div
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 transition-all duration-300 group-hover:h-1",
          accent,
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-semibold tracking-tight tabular-nums leading-tight">
            {value}
          </p>
        </div>
        <div className={cn("rounded-lg p-2.5 shrink-0", iconTone)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="space-y-0.5">
          {delta && (
            <p
              className={cn(
                "text-xs font-medium tabular-nums",
                deltaPositive ? "text-success" : "text-destructive",
              )}
            >
              {delta}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        {sparkline && sparkline.length > 1 && (
          <MiniSparkline values={sparkline} tone={tone} />
        )}
      </div>
    </div>
  );
}
