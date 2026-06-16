import { create } from 'zustand';
import { ProjectInfo, DeclarationStep, ProjectType } from '@/types';
import { mockCurrentProject } from '@/data/projectTypes';
import { declarationSteps as initialSteps } from '@/data/declarationSteps';

interface ProjectState {
  currentProject: ProjectInfo | null;
  projectTypes: ProjectType[];
  declarationSteps: DeclarationStep[];
  selectedType: string | null;
  selectedCategory: string | null;
  setCurrentProject: (project: ProjectInfo) => void;
  setSelectedType: (type: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setProjectTypes: (types: ProjectType[]) => void;
  setDeclarationSteps: (steps: DeclarationStep[]) => void;
  updateStepStatus: (stepId: string, status: DeclarationStep['status']) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: mockCurrentProject,
  projectTypes: [],
  declarationSteps: initialSteps,
  selectedType: null,
  selectedCategory: null,
  setCurrentProject: (project) => set({ currentProject: project }),
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
}));
