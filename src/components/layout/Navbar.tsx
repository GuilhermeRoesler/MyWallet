import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { UserNav } from "./UserNav";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  CommandPalette,
  useCommandPaletteShortcut,
} from "./CommandPalette";

export function Navbar() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data } = useDashboardStore();
  const projectName = data?.project.name;
  const isDemo = data?.project.isDemo;
  const [commandOpen, setCommandOpen] = useState(false);

  const openCommand = useCallback(() => setCommandOpen(true), []);
  useCommandPaletteShortcut(openCommand);

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:backdrop-blur-none">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-sidebar text-sidebar-foreground sm:max-w-xs"
          >
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

        <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
          {projectName && (
            <>
              <span className="truncate text-sm font-medium text-foreground/80">
                {projectName}
              </span>
              {isDemo && (
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  Demo
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="ml-auto flex h-full items-center gap-2 py-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 gap-2 text-muted-foreground sm:inline-flex"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Buscar</span>
            <kbd className="pointer-events-none ml-1 hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:inline">
              {isMac ? "⌘" : "Ctrl"}K
            </kbd>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 sm:hidden"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <UserNav />
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
