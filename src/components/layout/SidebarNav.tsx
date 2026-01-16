import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Wallet,
  ListChecks,
  PiggyBank,
  BarChart,
  Settings,
  Folders,
} from "lucide-react";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  end?: boolean;
}

export function SidebarNav() {
  const { projectId } = useParams<{ projectId: string }>();
  const base = `/project/${projectId}`;

  const sidebarNavItems: SidebarNavItem[] = [
    {
      title: "Overview",
      href: base,
      icon: LayoutDashboard,
      end: true,
    },
    {
      title: "Accounts",
      href: `${base}/accounts`,
      icon: Wallet,
    },
    {
      title: "Transactions",
      href: `${base}/transactions`,
      icon: ListChecks,
    },
    {
      title: "Budgets",
      href: `${base}/budgets`,
      icon: PiggyBank,
    },
    {
      title: "Reports",
      href: `${base}/reports`,
      icon: BarChart,
    },
    {
      title: "Settings",
      href: `${base}/settings`,
      icon: Settings,
    },
    {
      title: "Projetos",
      href: "/",
      icon: Folders,
    },
  ];

  return (
    <ScrollArea className="h-full py-4">
      <div className="flex flex-col space-y-1 p-4">
        {sidebarNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary",
                isActive && "bg-sidebar-accent text-sidebar-primary",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </div>
    </ScrollArea>
  );
}
