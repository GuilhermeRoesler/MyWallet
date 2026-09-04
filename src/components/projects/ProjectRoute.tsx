import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { showInfo } from "@/utils/toast";

const DEMO_TOAST_KEY = "mw-demo-welcome";

export function ProjectRoute() {
  const { projectId } = useParams<{ projectId: string }>();
  const { init, initialized, getProject } = useProjectStore();
  const { loadProject, isLoading, error, data, projectId: loadedId } =
    useDashboardStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!initialized || !projectId) return;
    loadProject(projectId);
  }, [initialized, projectId, loadProject]);

  useEffect(() => {
    if (!data?.project.isDemo || !data.project.id) return;
    const key = `${DEMO_TOAST_KEY}:${data.project.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    showInfo(
      "Workspace de exemplo",
      "Explore à vontade — contas, orçamentos e temas. Nada aqui é permanente.",
    );
  }, [data?.project.id, data?.project.isDemo]);

  if (!initialized || isLoading || (projectId && loadedId !== projectId && !error)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 surface-atmosphere animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando projeto…</p>
      </div>
    );
  }

  if (!projectId || !getProject(projectId) || error || !data) {
    return <Navigate to="/projetos" replace />;
  }

  return <Outlet />;
}
