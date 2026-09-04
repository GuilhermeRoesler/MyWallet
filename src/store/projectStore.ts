import { create } from "zustand";
import type { Project, ProjectFormValues, ProjectSettings } from "@/types";
import { createDemoProject, createEmptyProject } from "@/lib/demo-data";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { showError, showSuccess } from "@/utils/toast";

interface ProjectState {
  projects: Project[];
  initialized: boolean;
  init: () => void;
  createProject: (values: ProjectFormValues) => Project;
  updateProject: (id: string, values: ProjectFormValues) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  saveProject: (project: Project) => void;
  updateProjectSettings: (
    id: string,
    settings: Partial<ProjectSettings>,
  ) => void;
  resetDemoProject: () => Project;
}

function persist(projects: Project[]) {
  saveToStorage(projects);
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;

    let projects = loadFromStorage<Project[]>([]);
    if (projects.length === 0) {
      projects = [createDemoProject()];
      persist(projects);
    }

    set({ projects, initialized: true });
  },

  createProject: (values) => {
    const project = createEmptyProject(
      values.name.trim(),
      values.description.trim(),
    );
    const projects = [...get().projects, project];
    persist(projects);
    set({ projects });
    showSuccess("Projeto criado com sucesso.");
    return project;
  },

  updateProject: (id, values) => {
    const projects = get().projects.map((p) =>
      p.id === id
        ? {
            ...p,
            name: values.name.trim(),
            description: values.description.trim(),
            updatedAt: new Date().toISOString(),
          }
        : p,
    );
    persist(projects);
    set({ projects });
    showSuccess("Projeto atualizado.");
  },

  deleteProject: (id) => {
    const target = get().projects.find((p) => p.id === id);
    if (!target) return;

    if (target.isDemo) {
      showError("O projeto demo não pode ser excluído. Use Resetar Demo.");
      return;
    }

    const projects = get().projects.filter((p) => p.id !== id);
    persist(projects);
    set({ projects });
    showSuccess("Projeto excluído.");
  },

  getProject: (id) => get().projects.find((p) => p.id === id),

  saveProject: (project) => {
    const projects = get().projects.map((p) =>
      p.id === project.id
        ? { ...project, updatedAt: new Date().toISOString() }
        : p,
    );
    persist(projects);
    set({ projects });
  },

  updateProjectSettings: (id, settings) => {
    const projects = get().projects.map((p) =>
      p.id === id
        ? {
            ...p,
            settings: { ...p.settings, ...settings },
            updatedAt: new Date().toISOString(),
          }
        : p,
    );
    persist(projects);
    set({ projects });
    showSuccess("Configurações salvas.");
  },

  resetDemoProject: () => {
    const demo = createDemoProject();
    const withoutOldDemo = get().projects.filter((p) => !p.isDemo);
    const projects = [demo, ...withoutOldDemo];
    persist(projects);
    set({ projects });
    showSuccess("Workspace de exemplo restaurado.");
    return demo;
  },
}));
