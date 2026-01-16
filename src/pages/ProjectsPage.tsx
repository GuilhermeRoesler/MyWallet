import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderKanban,
  MoreVertical,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import type { Project } from "@/types";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const {
    projects,
    initialized,
    init,
    createProject,
    updateProject,
    deleteProject,
    resetDemoProject,
  } = useProjectStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  const openCreate = () => {
    setSelected(null);
    setIsFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setSelected(project);
    setIsFormOpen(true);
  };

  const openDelete = (project: Project) => {
    setSelected(project);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (values: { name: string; description: string }) => {
    setIsSubmitting(true);
    try {
      if (selected) {
        updateProject(selected.id, values);
      } else {
        const created = createProject(values);
        navigate(`/project/${created.id}`);
      }
      setIsFormOpen(false);
      setSelected(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      deleteProject(selected.id);
      setIsDeleteOpen(false);
      setSelected(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDemo = () => {
    const demo = resetDemoProject();
    navigate(`/project/${demo.id}`);
  };

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando projetos…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <WalletLogo className="h-9 w-9" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                My Wallet
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Seus projetos financeiros
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Escolha um projeto para trabalhar. Todos os dados ficam salvos
              localmente no seu navegador — ideal para portfólio e demos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleResetDemo}>
              <Sparkles className="mr-2 h-4 w-4" />
              Restaurar Demo
            </Button>
            <Button onClick={openCreate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo projeto
            </Button>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-snug">
                        {project.name}
                      </CardTitle>
                      {project.isDemo && (
                        <Badge variant="secondary">Demo</Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(project)}>
                        Editar
                      </DropdownMenuItem>
                      {!project.isDemo && (
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => openDelete(project)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-3 pt-2">
                  {project.description || "Sem descrição."}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-1 text-sm text-muted-foreground">
                <p>
                  {project.accounts.length} contas ·{" "}
                  {project.transactions.length} transações ·{" "}
                  {project.budgets.length} orçamentos
                </p>
                <p>
                  Atualizado em{" "}
                  {format(new Date(project.updatedAt), "dd MMM yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  Abrir projeto
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <ProjectFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        projectToEdit={selected}
      />
      <DeleteProjectDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelected(null);
        }}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        projectName={selected?.name}
      />
    </div>
  );
}
