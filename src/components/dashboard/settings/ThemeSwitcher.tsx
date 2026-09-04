import { useTheme } from "next-themes";
import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { themes } from "@/lib/themes";
import { useDashboardStore } from "@/store/dashboardStore";
import { useProjectStore } from "@/store/projectStore";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const projectId = useDashboardStore((s) => s.projectId);
  const loadProject = useDashboardStore((s) => s.loadProject);
  const updateProjectSettings = useProjectStore((s) => s.updateProjectSettings);

  const currentThemeName =
    themes.find((t) => t.value === theme)?.name || "Atelier";

  const handleSelect = (value: string) => {
    setTheme(value);
    if (projectId) {
      updateProjectSettings(projectId, { theme: value });
      loadProject(projectId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Palette className="mr-2 h-4 w-4" />
          <span>{currentThemeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-96 overflow-y-auto">
        {themes.map((t) => (
          <DropdownMenuItem key={t.value} onClick={() => handleSelect(t.value)}>
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                theme === t.value ? "opacity-100" : "opacity-0",
              )}
            />
            <span>{t.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
