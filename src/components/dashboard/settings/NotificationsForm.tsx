import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDashboardStore } from "@/store/dashboardStore";
import { useProjectStore } from "@/store/projectStore";

export function NotificationsForm() {
  const { data, loadProject, projectId } = useDashboardStore();
  const updateProjectSettings = useProjectStore((s) => s.updateProjectSettings);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [monthlyReports, setMonthlyReports] = useState(true);

  useEffect(() => {
    if (data?.project.settings) {
      setEmailNotifications(data.project.settings.email_notifications);
      setPushNotifications(data.project.settings.push_notifications);
      setMonthlyReports(data.project.settings.monthly_reports);
    }
  }, [data?.project.settings]);

  const handleSaveChanges = () => {
    if (!projectId) return;
    updateProjectSettings(projectId, {
      email_notifications: emailNotifications,
      push_notifications: pushNotifications,
      monthly_reports: monthlyReports,
    });
    loadProject(projectId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>
          Controle o que este workspace deve lembrar você.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications" className="text-base">
              Lembretes por e-mail
            </Label>
            <p className="text-sm text-muted-foreground">
              Alertas de orçamento e vencimentos.
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="text-base">
              Notificações push
            </Label>
            <p className="text-sm text-muted-foreground">
              Avisos em tempo real no dispositivo.
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="monthly-reports" className="text-base">
              Relatórios mensais
            </Label>
            <p className="text-sm text-muted-foreground">
              Resumo automático no fim de cada mês.
            </p>
          </div>
          <Switch
            id="monthly-reports"
            checked={monthlyReports}
            onCheckedChange={setMonthlyReports}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges}>Salvar preferências</Button>
      </CardFooter>
    </Card>
  );
}
