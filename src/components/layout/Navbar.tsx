import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { UserNav } from "./UserNav";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { useDashboardStore } from "@/store/dashboardStore";

export function Navbar() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data } = useDashboardStore();
  const projectName = data?.project.name;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:backdrop-blur-none">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground sm:max-w-xs">
          <nav className="grid gap-4 text-lg font-medium">
            <Link
              to={projectId ? `/project/${projectId}` : "/"}
              className="flex items-center gap-2.5 font-display text-lg font-semibold"
            >
              <WalletLogo className="h-8 w-8" />
              My Wallet
            </Link>
            {projectName && (
              <p className="text-xs text-sidebar-foreground/60 -mt-2 pl-10">
                {projectName}
              </p>
            )}
            <SidebarNav />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex h-full items-center gap-3 py-2">
        {projectName && (
          <span className="hidden text-sm text-muted-foreground md:inline truncate max-w-[200px]">
            {projectName}
          </span>
        )}
        <UserNav />
      </div>
    </header>
  );
}
