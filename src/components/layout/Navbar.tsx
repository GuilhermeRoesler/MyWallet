import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { UserNav } from "./UserNav";
import { WalletLogo } from "@/components/brand/WalletLogo";

export function Navbar() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to={projectId ? `/project/${projectId}` : "/"}
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <WalletLogo className="h-7 w-7" />
              My Wallet
            </Link>
            <SidebarNav />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto h-full py-2">
        <UserNav />
      </div>
    </header>
  );
}
