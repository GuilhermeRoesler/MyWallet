import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, PanelLeftClose } from "lucide-react";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarOpen } from "@/hooks/use-sidebar-open";
import { AnimatedOutlet } from "./AnimatedOutlet";
import { Navbar } from "./Navbar";
import { SidebarNav } from "./SidebarNav";
import { AppDock } from "./AppDock";

const SIDEBAR_WIDTH = 240;

function SidebarBrand({ onCollapse }: { onCollapse: () => void }) {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="flex h-14 items-center gap-1 border-b border-sidebar-border px-3 lg:h-[68px] lg:px-4">
      <Link
        to={projectId ? `/project/${projectId}` : "/"}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-base font-semibold hover:opacity-90"
        title="My Wallet"
      >
        <WalletLogo className="h-8 w-8 shrink-0" />
        <span className="font-display tracking-tight whitespace-nowrap">
          My Wallet
        </span>
      </Link>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-sidebar-foreground/80 hover:bg-sidebar-accent/20 hover:text-sidebar-primary"
            onClick={onCollapse}
            aria-label="Recolher menu"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Recolher menu</TooltipContent>
      </Tooltip>
    </div>
  );
}

function SidebarPullTab({ onOpen }: { onOpen: () => void }) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onOpen}
          aria-label="Abrir menu"
          className="fixed left-0 top-1/2 z-40 flex h-24 w-5 -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-border/70 bg-background/90 text-muted-foreground shadow-md backdrop-blur-md transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">Abrir menu</TooltipContent>
    </Tooltip>
  );
}

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useSidebarOpen();

  if (isMobile) {
    return (
      <div className="relative flex min-h-screen w-full flex-col surface-atmosphere">
        <Navbar />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-28 pt-4 sm:px-6">
          <AnimatedOutlet />
        </main>
        <AppDock visible />
      </div>
    );
  }

  const showDock = !sidebarOpen;

  return (
    <div className="relative flex min-h-screen w-full">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="relative z-20 shrink-0 overflow-hidden bg-sidebar text-sidebar-foreground"
      >
        <div
          className="flex h-full flex-col"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <SidebarBrand onCollapse={() => setSidebarOpen(false)} />
          <SidebarNav />
        </div>
      </motion.aside>

      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            key="pull-tab"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
          >
            <SidebarPullTab onOpen={() => setSidebarOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col surface-atmosphere">
        <Navbar showBrand={!sidebarOpen} />
        <main
          className={
            showDock
              ? "mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-28 pt-4 sm:px-6 md:pb-32 md:pt-6 lg:px-8"
              : "mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-4 sm:px-6 md:pt-6 lg:px-8"
          }
        >
          <AnimatedOutlet />
        </main>
      </div>

      <AppDock visible={showDock} />
    </div>
  );
}
