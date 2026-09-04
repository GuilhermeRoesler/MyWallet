import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboardStore } from "@/store/dashboardStore";
import { useNavigate } from "react-router-dom";

export function UserNav() {
  const navigate = useNavigate();
  const { data } = useDashboardStore();
  const user = data?.user;
  const projectName = data?.project.name;

  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "MW";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-1 ring-border/80 hover:ring-primary/40"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {projectName}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/projetos")}>
          Trocar de projeto
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/")}>
          Página inicial
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
