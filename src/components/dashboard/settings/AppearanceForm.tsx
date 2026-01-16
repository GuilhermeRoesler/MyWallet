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
    }
  }, [userTheme, setTheme]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application. Select a theme below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeSwitcher />
      </CardContent>
    </Card>
  );
}