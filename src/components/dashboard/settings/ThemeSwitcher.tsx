import { useTheme } from "next-themes";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { themes } from "@/lib/themes";
import { useDashboardStore } from "@/store/dashboardStore";
import { useProjectStore } from "@/store/projectStore";

export function ThemeSwitcher() {
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {themes.map((t) => {
        const selected = theme === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => handleSelect(t.value)}
            className={cn(
              "group relative flex flex-col gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
              "hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/35"
                : "border-border/80 bg-card hover:border-foreground/20",
            )}
          >
            {/* Mini product preview */}
            <div
              className="relative h-28 overflow-hidden rounded-xl border border-black/5 shadow-inner"
              style={{ background: t.swatch.background }}
            >
              <div
                className="absolute inset-y-0 left-0 w-[22%]"
                style={{ background: "#0f1f1c" }}
              >
                <div
                  className="mx-auto mt-3 h-1.5 w-6 rounded-full opacity-40"
                  style={{ background: "#fff" }}
                />
                <div
                  className="mx-1.5 mt-3 h-4 rounded-md"
                  style={{ background: t.swatch.primary }}
                />
                <div className="mx-1.5 mt-1.5 space-y-1">
                  {[0.35, 0.22, 0.22].map((op, i) => (
                    <div
                      key={i}
                      className="h-2.5 rounded-sm"
                      style={{ background: `rgba(255,255,255,${op})` }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-2 right-2 left-[26%] space-y-2">
                <div className="flex gap-1.5">
                  <div
                    className="h-8 flex-1 rounded-md border border-black/5 bg-white/90 shadow-sm"
                    style={{ boxShadow: `inset 0 2px 0 ${t.swatch.primary}` }}
                  />
                  <div
                    className="h-8 flex-1 rounded-md border border-black/5 bg-white/90 shadow-sm"
                    style={{ boxShadow: `inset 0 2px 0 ${t.swatch.accent}` }}
                  />
                </div>
                <div className="h-10 rounded-md border border-black/5 bg-white/85 p-1.5 shadow-sm">
                  <div
                    className="h-full w-3/4 rounded-sm opacity-70"
                    style={{
                      background: `linear-gradient(90deg, ${t.swatch.primary}55, transparent)`,
                    }}
                  />
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background:
                          n === 1 ? t.swatch.primary : `${t.swatch.accent}`,
                        opacity: n === 1 ? 1 : 0.55,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-0.5">
              <div>
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  Aplicar neste workspace
                </span>
              </div>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-transparent group-hover:border-foreground/30",
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
