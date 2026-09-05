import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  LayoutDashboard,
  Palette,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { dismissDemoIntro } from "@/lib/demo-intro";
import { themes } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboardStore";
import { useProjectStore } from "@/store/projectStore";

export type DemoIntroStep = {
  title: string;
  short: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
  /** Mostra seletor de temas ao vivo neste passo. */
  liveThemes?: boolean;
};

const DEFAULT_STEPS: DemoIntroStep[] = [
  {
    title: "Visão geral",
    short: "Saldo e fluxo em um relance",
    detail:
      "KPIs, gráfico de saldo e insights mostram a saúde financeira do mês sem ruído.",
    icon: LayoutDashboard,
    tone: "bg-primary/12 text-primary",
  },
  {
    title: "Contas e movimentos",
    short: "Tudo organizado por conta",
    detail:
      "Cadastre contas, registre receitas e despesas e acompanhe o histórico em segundos.",
    icon: Wallet,
    tone: "bg-chart-2/15 text-[hsl(var(--chart-2))]",
  },
  {
    title: "Orçamentos",
    short: "Limites com alerta visual",
    detail:
      "Defina tetos por categoria e veja o que está no caminho — ou já estourou.",
    icon: PiggyBank,
    tone: "bg-success/12 text-success",
  },
  {
    title: "Aparência",
    short: "Temas curados sob medida",
    detail:
      "Toque em um tema abaixo e veja o app inteiro mudar agora — a escolha fica salva neste workspace.",
    icon: Palette,
    tone: "bg-warning/15 text-warning",
    liveThemes: true,
  },
];

type DemoIntroTourProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps?: DemoIntroStep[];
  onComplete?: () => void;
};

function LiveThemePicker() {
  const { theme, setTheme } = useTheme();
  const projectId = useDashboardStore((s) => s.projectId);
  const loadProject = useDashboardStore((s) => s.loadProject);
  const updateProjectSettings = useProjectStore((s) => s.updateProjectSettings);

  const handleSelect = (value: string) => {
    setTheme(value);
    if (projectId) {
      updateProjectSettings(projectId, { theme: value });
      loadProject(projectId);
    }
  };

  return (
    <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
      {themes.map((t) => {
        const selected = theme === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => handleSelect(t.value)}
            className={cn(
              "group flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all",
              selected
                ? "border-primary bg-primary/8 ring-2 ring-primary/30"
                : "border-border/70 hover:border-foreground/20 hover:bg-muted/50",
            )}
            title={t.name}
          >
            <span
              className="flex h-8 w-full overflow-hidden rounded-lg border border-black/5"
              aria-hidden
            >
              <span className="w-1/3" style={{ background: t.swatch.primary }} />
              <span className="w-1/3" style={{ background: t.swatch.accent }} />
              <span
                className="w-1/3"
                style={{ background: t.swatch.background }}
              />
            </span>
            <span className="text-[10px] font-medium leading-none text-foreground/80">
              {t.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TourBody({
  steps,
  current,
  direction,
  completed,
  onSelect,
  onPrev,
  onNext,
  onSkip,
  compact,
}: {
  steps: DemoIntroStep[];
  current: number;
  direction: 1 | -1;
  completed: number[];
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  compact?: boolean;
}) {
  const step = steps[current];
  const Icon = step.icon;
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className={cn("flex h-full flex-col", compact ? "gap-4" : "gap-0")}>
      <Progress value={progress} className="mb-4 h-1.5" />

      <div
        className={cn(
          "grid flex-1 gap-4",
          !compact &&
            "md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-6",
        )}
      >
        <div className="space-y-2">
          {steps.map((item, index) => {
            const TabIcon = item.icon;
            const active = index === current;
            const done = completed.includes(index);
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  active
                    ? "border-border bg-muted"
                    : "border-transparent hover:bg-muted/60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    item.tone,
                  )}
                >
                  <TabIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {item.title}
                    {done && (
                      <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-foreground/65 line-clamp-2">
                    {item.short}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.title}
            custom={direction}
            initial={{ opacity: 0, x: direction * 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-muted/50 to-background p-5 md:p-6"
          >
            <div
              className={cn(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
                step.tone,
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70 md:text-base">
              {step.detail}
            </p>
            {step.liveThemes && <LiveThemePicker />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <Button
          variant="ghost"
          className="rounded-full text-foreground/65"
          onClick={onSkip}
        >
          Pular
        </Button>
        <div className="flex gap-2">
          {current > 0 && (
            <Button variant="ghost" className="rounded-full" onClick={onPrev}>
              Voltar
            </Button>
          )}
          <Button className="rounded-full px-5" onClick={onNext}>
            {current === steps.length - 1 ? "Começar" : "Próximo"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DemoIntroTour({
  open,
  onOpenChange,
  steps = DEFAULT_STEPS,
  onComplete,
}: DemoIntroTourProps) {
  const isMobile = useIsMobile();
  const [session, setSession] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) setSession((s) => s + 1);
    onOpenChange(next);
  };

  return (
    <DemoIntroTourSession
      key={session}
      open={open}
      onOpenChange={handleOpenChange}
      steps={steps}
      onComplete={onComplete}
      isMobile={isMobile}
    />
  );
}

function DemoIntroTourSession({
  open,
  onOpenChange,
  steps,
  onComplete,
  isMobile,
}: DemoIntroTourProps & { isMobile: boolean }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [completed, setCompleted] = useState<number[]>([0]);

  const finish = (skipped: boolean) => {
    dismissDemoIntro();
    onOpenChange(false);
    if (!skipped) onComplete?.();
  };

  const goNext = () => {
    setCompleted((prev) =>
      prev.includes(current) ? prev : [...prev, current],
    );
    if (current < steps!.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
      return;
    }
    finish(false);
  };

  const goPrev = () => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent((c) => c - 1);
  };

  const select = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCompleted((prev) => {
      const next = new Set(prev);
      if (index > current) {
        for (let i = current; i <= index; i++) next.add(i);
      }
      return Array.from(next);
    });
    setCurrent(index);
  };

  const body = (
    <TourBody
      steps={steps!}
      current={current}
      direction={direction}
      completed={completed}
      onSelect={select}
      onPrev={goPrev}
      onNext={goNext}
      onSkip={() => finish(true)}
      compact={isMobile}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[92vh] overflow-y-auto rounded-t-2xl"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-xl">
              Tour rápido da demo
            </SheetTitle>
            <SheetDescription>
              Quatro passos para aproveitar o workspace de exemplo.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 pb-2">{body}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="space-y-1 border-b border-border/70 bg-muted/40 px-6 py-5 text-left">
          <DialogTitle className="font-display text-xl">
            Tour rápido da demo
          </DialogTitle>
          <DialogDescription>
            Quatro passos para aproveitar o workspace de exemplo.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-5">{body}</div>
      </DialogContent>
    </Dialog>
  );
}
