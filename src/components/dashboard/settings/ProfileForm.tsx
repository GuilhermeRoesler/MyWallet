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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboardStore";
import { useProjectStore } from "@/store/projectStore";
import type { ProjectSettings } from "@/types";

type ProfileFormFieldsProps = {
  projectId: string;
  settings: ProjectSettings;
};

function ProfileFormFields({ projectId, settings }: ProfileFormFieldsProps) {
  const loadProject = useDashboardStore((s) => s.loadProject);
  const updateProjectSettings = useProjectStore((s) => s.updateProjectSettings);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [currency, setCurrency] = useState(settings.currency);

  const handleSaveChanges = () => {
    updateProjectSettings(projectId, {
      ownerName: ownerName.trim() || "Você",
      currency: currency.trim() || "BRL",
    });
    loadProject(projectId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do projeto</CardTitle>
        <CardDescription>
          Nome e moeda exibidos nas telas deste projeto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Moeda padrão</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            placeholder="BRL"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges}>Salvar alterações</Button>
      </CardFooter>
    </Card>
  );
}

export function ProfileForm() {
  const { data, projectId } = useDashboardStore();
  const settings = data?.project.settings;

  if (!projectId || !settings) return null;

  return (
    <ProfileFormFields
      key={projectId}
      projectId={projectId}
      settings={settings}
    />
  );
}
