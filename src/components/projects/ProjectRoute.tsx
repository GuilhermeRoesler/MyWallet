import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  DemoIntroTour,
} from "@/components/projects/DemoIntroTour";
import { hasDismissedDemoIntro } from "@/lib/demo-intro";

export function ProjectRoute() {
  const { projectId } = useParams<{ projectId: string }>();
  const { init, initialized, getProject } = useProjectStore();
  const { loadProject, isLoading, error, data, projectId: loadedId } =
    useDashboardStore();
  const [introOpen, setIntroOpen] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!initialized || !projectId) return;
    loadProject(projectId);
  }, [initialized, projectId, loadProject]);

  useEffect(() => {
    if (!data?.project.isDemo || !data.project.id) return;
    if (hasDismissedDemoIntro()) return;
    const timer = window.setTimeout(() => setIntroOpen(true), 450);
    return () => window.clearTimeout(timer);
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

  return (
    <>
      <Outlet />
      {data.project.isDemo && (
        <DemoIntroTour open={introOpen} onOpenChange={setIntroOpen} />
      )}
    </>
  );
}
