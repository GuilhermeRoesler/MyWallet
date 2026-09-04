import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ArrowLeft,
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
import { EmptyState } from "@/components/ui/empty-state";
import { themes } from "@/lib/themes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function projectTheme(project: Project) {
  return (
    themes.find((t) => t.value === project.settings.theme) ?? themes[0]
  );
}

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
      <div className="flex min-h-screen items-center justify-center text-muted-foreground surface-atmosphere">
        Carregando projetos…
      </div>
    );
  }

  return (
    <div className="min-h-screen surface-atmosphere">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>

        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between animate-rise">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <WalletLogo className="h-10 w-10" />
              <span className="font-display text-sm font-semibold tracking-[0.12em] uppercase text-primary">
                My Wallet
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Seus projetos financeiros
            </h1>
            <p className="max-w-xl text-muted-foreground text-balance">
              Escolha um workspace para continuar. Cada projeto mantém contas,
              orçamentos e preferências próprios.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleResetDemo}
              className="border-foreground/15 bg-background shadow-sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Restaurar exemplo
            </Button>
            <Button onClick={openCreate} className="shadow-sm shadow-primary/20">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo projeto
            </Button>
          </div>
        </header>

        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="Nenhum projeto ainda"
            description="Crie um workspace ou restaure o exemplo para explorar o dashboard completo."
            actionLabel="Criar projeto"
            onAction={openCreate}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const theme = projectTheme(project);
              return (
                <Card
                  key={project.id}
                  className="group flex flex-col overflow-hidden border-border/80 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-rise"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div
                    className="relative h-16 overflow-hidden"
                    style={{ background: theme.swatch.background }}
                    aria-hidden
                  >
                    <div
                      className="absolute inset-y-0 left-0 w-[28%]"
                      style={{ background: theme.swatch.accent }}
                    />
                    <div
                      className="absolute -right-4 -top-6 h-24 w-24 rounded-full opacity-80 blur-2xl"
                      style={{ background: theme.swatch.primary }}
                    />
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shadow-sm ring-2 ring-white/50"
                        style={{ background: theme.swatch.primary }}
                      />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/60">
                        {theme.name}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div
                          className="rounded-xl p-2.5"
                          style={{
                            background: `${theme.swatch.primary}18`,
                            color: theme.swatch.primary,
                          }}
                        >
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <div className="space-y-1.5">
                          <CardTitle className="font-display text-lg font-semibold leading-snug">
                            {project.name}
                          </CardTitle>
                          {project.isDemo && (
                            <Badge variant="secondary">Demo</Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(project)}>
                            Editar
                          </DropdownMenuItem>
                          {!project.isDemo && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDelete(project)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="line-clamp-2 pt-2 text-foreground/65">
                      {project.description || "Sem descrição."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-1 text-sm text-muted-foreground">
                    <p className="tabular-nums text-foreground/70">
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
                      className="w-full shadow-sm shadow-primary/15"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      Abrir projeto
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
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
