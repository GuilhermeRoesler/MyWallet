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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {themes.map((t) => {
        const selected = theme === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => handleSelect(t.value)}
            className={cn(
              "group relative flex flex-col gap-3 rounded-xl border p-3 text-left transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                : "border-border/80 bg-card hover:border-border",
            )}
          >
            <div
              className="relative h-14 overflow-hidden rounded-lg border border-black/5"
              style={{ background: t.swatch.background }}
            >
              <div
                className="absolute inset-y-0 left-0 w-1/3"
                style={{ background: t.swatch.accent }}
              />
              <div
                className="absolute bottom-2 right-2 h-6 w-6 rounded-full shadow-sm"
                style={{ background: t.swatch.primary }}
              />
              <div
                className="absolute bottom-2 left-[38%] h-2 w-10 rounded-full opacity-70"
                style={{ background: t.swatch.primary }}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{t.name}</span>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-transparent",
                )}
              >
                <Check className="h-3 w-3" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
