import { create } from 'zustand';
import { QaItem, ChatMessage } from '@/types';
import { hotQuestions, initialChatMessages } from '@/data/qaData';

interface QaState {
  hotQuestions: QaItem[];
  favorites: QaItem[];
  chatHistory: ChatMessage[];
  isRecording: boolean;
  isSpeaking: boolean;
  addMessage: (msg: ChatMessage) => void;
  toggleFavorite: (id: string) => void;
  setRecording: (val: boolean) => void;
  setSpeaking: (val: boolean) => void;
  clearChat: () => void;
}

export const useQaStore = create<QaState>((set) => ({
  hotQuestions: hotQuestions,
  favorites: hotQuestions.filter((q) => q.isFavorite),
  chatHistory: initialChatMessages,
  isRecording: false,
  isSpeaking: false,
  addMessage: (msg) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, msg],
    })),
  toggleFavorite: (id) =>
    set((state) => {
      const question = state.hotQuestions.find((q) => q.id === id);
      if (question) {
        const isCurrentlyFav = state.favorites.some((f) => f.id === id);
        return {
          hotQuestions: state.hotQuestions.map((q) =>
            q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
          ),
          favorites: isCurrentlyFav
            ? state.favorites.filter((f) => f.id !== id)
            : [...state.favorites, { ...question, isFavorite: true }],
        };
      }
      return state;
    }),
  setRecording: (val) => set({ isRecording: val }),
  setSpeaking: (val) => set({ isSpeaking: val }),
  clearChat: () => set({ chatHistory: initialChatMessages }),
}));
