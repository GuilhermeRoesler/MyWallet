import { Link, Outlet, useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarNav } from "./SidebarNav";
import { Navbar } from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { useDashboardStore } from "@/store/dashboardStore";

function SidebarBrand() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data } = useDashboardStore();
  const isDemo = data?.project.isDemo;

  return (
    <div className="flex h-14 items-center justify-between gap-2 border-b border-sidebar-border px-4 lg:h-[68px] lg:px-5">
      <Link
        to={projectId ? `/project/${projectId}` : "/"}
        className="flex min-w-0 items-center gap-2.5 text-base font-semibold hover:opacity-90"
      >
        <WalletLogo className="h-8 w-8 shrink-0" />
        <span className="font-display tracking-tight truncate">My Wallet</span>
      </Link>
      {isDemo && (
        <span className="shrink-0 rounded-md bg-sidebar-accent/80 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-sidebar-accent-foreground">
          Demo
        </span>
      )}
    </div>
  );
}

export function DashboardLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col surface-atmosphere">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-screen w-full"
    >
      <ResizablePanel
        defaultSize="16"
        minSize="12"
        maxSize="22"
        className="bg-sidebar text-sidebar-foreground"
      >
        <div className="flex h-full flex-col">
          <SidebarBrand />
          <SidebarNav />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="84">
        <div className="flex min-h-screen w-full flex-col surface-atmosphere">
          <Navbar />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Outlet />
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
