import { create } from 'zustand';
import { MaterialItem, AttachmentItem } from '@/types';
import { materials as initialMaterials, materialCategories } from '@/data/materials';
import { mockAttachments } from '@/data/attachments';

interface MaterialState {
  materials: MaterialItem[];
  categories: string[];
  selectedCategory: string;
  selectedMaterialId: string | null;
  attachments: AttachmentItem[];
  setMaterials: (materials: MaterialItem[]) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedMaterialId: (id: string | null) => void;
  toggleMaterialStatus: (id: string) => void;
  addAttachment: (attachment: AttachmentItem) => void;
  removeAttachment: (id: string) => void;
  updateAttachment: (id: string, data: Partial<AttachmentItem>) => void;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: initialMaterials,
  categories: materialCategories,
  selectedCategory: 'all',
  selectedMaterialId: null,
  attachments: mockAttachments,
  setMaterials: (materials) => set({ materials }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedMaterialId: (id) => set({ selectedMaterialId: id }),
  toggleMaterialStatus: (id) =>
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === id
          ? {
              ...m,
              status:
                m.status === 'completed'
                  ? 'not-started'
                  : m.status === 'in-progress'
                  ? 'completed'
                  : 'in-progress',
            }
          : m
      ),
    })),
  addAttachment: (attachment) =>
    set((state) => ({
      attachments: [...state.attachments, attachment],
    })),
  removeAttachment: (id) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a.id !== id),
    })),
  updateAttachment: (id, data) =>
    set((state) => ({
      attachments: state.attachments.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),
}));
