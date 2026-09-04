import { Link, useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatedOutlet } from "./AnimatedOutlet";
import { Navbar } from "./Navbar";
import { SidebarNav } from "./SidebarNav";

function SidebarBrand() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[68px] lg:px-5">
      <Link
        to={projectId ? `/project/${projectId}` : "/"}
        className="flex items-center gap-2.5 text-base font-semibold hover:opacity-90"
        title="My Wallet"
      >
        <WalletLogo className="h-8 w-8 shrink-0" />
        <span className="font-display tracking-tight whitespace-nowrap">
          My Wallet
        </span>
      </Link>
    </div>
  );
}

export function DashboardLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col surface-atmosphere">
        <Navbar />
        <main className="flex flex-1 flex-col p-4 md:p-8">
          <AnimatedOutlet />
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
        defaultSize="18"
        minSize="16"
        maxSize="24"
        className="bg-sidebar text-sidebar-foreground min-w-[200px]"
      >
        <div className="flex h-full min-w-[200px] flex-col">
          <SidebarBrand />
          <SidebarNav />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="82">
        <div className="flex min-h-screen w-full flex-col surface-atmosphere">
          <Navbar />
          <main className="flex flex-1 flex-col p-4 md:p-8">
            <AnimatedOutlet />
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
