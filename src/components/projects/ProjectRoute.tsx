import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { useDashboardStore } from "@/store/dashboardStore";

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

  if (!initialized || isLoading || (projectId && loadedId !== projectId && !error)) {
    return (
      <div className="flex h-screen w-full items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Carregando projeto…</p>
      </div>
    );
  }

  if (!projectId || !getProject(projectId) || error || !data) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
