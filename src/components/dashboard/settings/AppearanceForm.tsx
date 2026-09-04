import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useDashboardStore } from "@/store/dashboardStore";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { themeValues } from "@/lib/themes";

export function AppearanceForm() {
  const { data: dashboardData } = useDashboardStore();
  const { setTheme } = useTheme();
  const userTheme = dashboardData?.user?.theme;

  useEffect(() => {
    if (userTheme && themeValues.includes(userTheme)) {
      setTheme(userTheme);
    } else if (userTheme && !themeValues.includes(userTheme)) {
      setTheme("light");
    }
  }, [userTheme, setTheme]);

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-xl font-semibold">
          Aparência
        </CardTitle>
        <CardDescription>
          Temas curados para o visual deste workspace. A escolha é salva no
          projeto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeSwitcher />
      </CardContent>
    </Card>
  );
}
