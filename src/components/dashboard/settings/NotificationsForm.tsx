import { useState } from "react";
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
import type { ProjectSettings } from "@/types";

type NotificationsFormFieldsProps = {
  projectId: string;
  settings: ProjectSettings;
};

function NotificationsFormFields({
  projectId,
  settings,
}: NotificationsFormFieldsProps) {
  const loadProject = useDashboardStore((s) => s.loadProject);
  const updateProjectSettings = useProjectStore((s) => s.updateProjectSettings);

  const [emailNotifications, setEmailNotifications] = useState(
    settings.email_notifications,
  );
  const [pushNotifications, setPushNotifications] = useState(
    settings.push_notifications,
  );
  const [monthlyReports, setMonthlyReports] = useState(
    settings.monthly_reports,
  );

  const handleSaveChanges = () => {
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

export function NotificationsForm() {
  const { data, projectId } = useDashboardStore();
  const settings = data?.project.settings;

  if (!projectId || !settings) return null;

  return (
    <NotificationsFormFields
      key={projectId}
      projectId={projectId}
      settings={settings}
    />
  );
}
