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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboardStore";
import { useProjectStore } from "@/store/projectStore";

export function ProfileForm() {
  const { data, loadProject, projectId } = useDashboardStore();
  const updateProjectSettings = useProjectStore((s) => s.updateProjectSettings);
  const [ownerName, setOwnerName] = useState("");
  const [currency, setCurrency] = useState("BRL");

  useEffect(() => {
    if (data?.project.settings) {
      setOwnerName(data.project.settings.ownerName);
      setCurrency(data.project.settings.currency);
    }
  }, [data?.project.settings]);

  const handleSaveChanges = () => {
    if (!projectId) return;
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
          Dados exibidos neste workspace (salvos no localStorage).
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
