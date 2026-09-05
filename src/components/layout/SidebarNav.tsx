import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCommandNavItems } from "./nav-items";

export function SidebarNav() {
  const { projectId } = useParams<{ projectId: string }>();
  const items = getCommandNavItems(projectId);

  return (
    <ScrollArea className="h-full py-3">
      <div className="flex flex-col space-y-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent/20 hover:text-sidebar-primary",
                isActive &&
                  "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.title}
          </NavLink>
        ))}
      </div>
    </ScrollArea>
  );
}
