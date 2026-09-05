import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ShiftCard } from "@/components/ui/shift-card";
import { themes } from "@/lib/themes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "motion/react";

function projectTheme(project: Project) {
  return themes.find((t) => t.value === project.settings.theme) ?? themes[0];
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
          className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground animate-fade-in"
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
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Seus projetos financeiros
            </h1>
            <p className="max-w-xl text-foreground/70 text-balance md:text-lg">
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
                <ShiftCard
                  key={project.id}
                  className="min-h-[300px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  topContent={
                    <div className="flex items-start justify-between gap-2 pr-1">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <div
                          className="rounded-xl p-2"
                          style={{
                            background: `${theme.swatch.primary}18`,
                            color: theme.swatch.primary,
                          }}
                        >
                          <FolderKanban className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="font-display text-base font-semibold leading-snug truncate">
                            {project.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {project.isDemo && (
                              <Badge variant="secondary" className="text-[10px]">
                                Demo
                              </Badge>
                            )}
                            <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/60">
                              {theme.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => e.stopPropagation()}
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
                  }
                  topAnimateContent={
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-2 h-1.5 overflow-hidden rounded-full"
                      style={{ background: `${theme.swatch.primary}22` }}
                    >
                      <div
                        className="h-full w-2/3 rounded-full"
                        style={{ background: theme.swatch.primary }}
                      />
                    </motion.div>
                  }
                  middleContent={
                    <div className="space-y-3 px-1 pt-2">
                      <div
                        className="relative h-20 overflow-hidden rounded-xl border border-black/5 p-2.5 shadow-inner"
                        style={{ background: theme.swatch.background }}
                        aria-hidden
                      >
                        <div className="flex gap-1.5">
                          <div className="h-7 flex-1 rounded-md bg-white/90 shadow-sm">
                            <div
                              className="mt-1.5 ml-1.5 h-1 w-8 rounded-full"
                              style={{ background: theme.swatch.primary }}
                            />
                          </div>
                          <div className="h-7 flex-1 rounded-md bg-white/80 shadow-sm" />
                        </div>
                        <div className="mt-2 h-6 rounded-md bg-white/75 p-1 shadow-sm">
                          <div
                            className="h-full w-4/5 rounded-sm opacity-80"
                            style={{
                              background: `linear-gradient(90deg, ${theme.swatch.primary}66, transparent)`,
                            }}
                          />
                        </div>
                        <div
                          className="absolute bottom-0 right-0 h-10 w-10 rounded-tl-2xl opacity-40"
                          style={{ background: theme.swatch.accent }}
                        />
                      </div>
                      <p className="line-clamp-2 text-sm text-foreground/70">
                        {project.description || "Sem descrição."}
                      </p>
                    </div>
                  }
                  bottomContent={
                    <div className="space-y-2.5">
                      <p className="tabular-nums text-xs font-medium text-foreground/70">
                        {project.accounts.length} contas ·{" "}
                        {project.transactions.length} transações ·{" "}
                        {project.budgets.length} orçamentos
                      </p>
                      <p className="text-[11px] text-foreground/55">
                        Atualizado em{" "}
                        {format(new Date(project.updatedAt), "dd MMM yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                      <Button
                        className="w-full shadow-sm shadow-primary/15"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/project/${project.id}`);
                        }}
                      >
                        Abrir projeto
                      </Button>
                    </div>
                  }
                />
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
