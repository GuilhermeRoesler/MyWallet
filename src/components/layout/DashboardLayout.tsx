import { Link, Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarNav } from "./SidebarNav";
import { Navbar } from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalletLogo } from "@/components/brand/WalletLogo";

export function DashboardLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col">
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
      className="min-h-screen w-full rounded-lg"
    >
      <ResizablePanel defaultSize="15" minSize="10" maxSize="20" className="bg-sidebar text-sidebar-foreground">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold hover:opacity-90"
            >
              <WalletLogo className="h-7 w-7" />
              My Wallet
            </Link>
          </div>
          <SidebarNav />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="85">
        <div className="flex min-h-screen w-full flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Outlet />
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}