import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-dashed border-border/80 bg-gradient-to-b from-muted/40 to-muted/10 px-6 py-16 text-center animate-fade-in",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_55%)]"
      />
      <div className="relative rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/15">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <div className="relative space-y-1.5 max-w-sm">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground text-balance">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button className="relative mt-1 shadow-sm shadow-primary/20" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
