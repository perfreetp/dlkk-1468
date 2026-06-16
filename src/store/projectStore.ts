import { create } from 'zustand';
import { ProjectInfo, DeclarationStep, ProjectType } from '@/types';
import { projectTypes, mockCurrentProject } from '@/data/projectTypes';
import { stepsByProjectType, buildingSteps, ProjectStepsConfig } from '@/data/declarationSteps';

interface ProjectState {
  currentProject: ProjectInfo | null;
  projectTypes: ProjectType[];
  declarationSteps: DeclarationStep[];
  stepsConfig: ProjectStepsConfig;
  selectedType: string | null;
  selectedCategory: string | null;
  setCurrentProject: (project: ProjectInfo) => void;
  setSelectedType: (type: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setProjectTypes: (types: ProjectType[]) => void;
  setDeclarationSteps: (steps: DeclarationStep[]) => void;
  updateStepStatus: (stepId: string, status: DeclarationStep['status']) => void;
  applyProjectType: (typeId: string, category: string) => void;
}

const getInitialConfig = () => {
  const saved = localStorage.getItem('smart_declaration_steps_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return {
    steps: buildingSteps.steps,
    config: buildingSteps,
  };
};

const getInitialProject = () => {
  const saved = localStorage.getItem('smart_declaration_project');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return mockCurrentProject;
};

const initial = getInitialConfig();

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: getInitialProject(),
  projectTypes: projectTypes,
  declarationSteps: initial.steps,
  stepsConfig: initial.config,
  selectedType: null,
  selectedCategory: null,
  setCurrentProject: (project) => {
    localStorage.setItem('smart_declaration_project', JSON.stringify(project));
    set({ currentProject: project });
  },
  setSelectedType: (type) => set({ selectedType: type, selectedCategory: null }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setProjectTypes: (types) => set({ projectTypes: types }),
  setDeclarationSteps: (steps) => set({ declarationSteps: steps }),
  updateStepStatus: (stepId, status) =>
    set((state) => ({
      declarationSteps: state.declarationSteps.map((step) =>
        step.id === stepId ? { ...step, status } : step
      ),
    })),
  applyProjectType: (typeId, category) => {
    const config = stepsByProjectType[typeId] || buildingSteps;
    const typeData = projectTypes.find((t) => t.id === typeId);

    const existingProject = get().currentProject;
    const newProject: ProjectInfo = {
      id: existingProject?.id || `proj-${Date.now()}`,
      name: existingProject?.name || `${typeData?.name || '项目'}-${category}`,
      type: typeId,
      category: category,
      address: existingProject?.address || '',
      area: existingProject?.area || 0,
      floors: existingProject?.floors || 0,
      builder: existingProject?.builder || '',
      startDate: existingProject?.startDate || '',
      plannedEndDate: existingProject?.plannedEndDate || '',
    };

    const saveData = {
      steps: config.steps,
      config: {
        totalDays: config.totalDays,
        workDays: config.workDays,
        materialStats: config.materialStats,
      },
    };
    localStorage.setItem('smart_declaration_steps_config', JSON.stringify(saveData));
    localStorage.setItem('smart_declaration_project', JSON.stringify(newProject));

    set({
      declarationSteps: config.steps,
      stepsConfig: config,
      currentProject: newProject,
    });
  },
}));
