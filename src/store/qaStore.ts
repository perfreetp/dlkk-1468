import { create } from 'zustand';
import { QaItem, ChatMessage } from '@/types';
import { hotQuestions, initialChatMessages } from '@/data/qaData';

const FAVORITES_KEY = 'smart_declaration_qa_favorites';
const CHAT_KEY = 'smart_declaration_qa_chat';
const HOT_FAV_MAP_KEY = 'smart_declaration_qa_hot_fav_map';

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
  restoreDefaultChat: () => void;
}

const loadFavorites = (): QaItem[] => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return hotQuestions.filter((q) => q.isFavorite);
};

const loadChatHistory = (): ChatMessage[] => {
  try {
    const saved = localStorage.getItem(CHAT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return initialChatMessages;
};

const loadHotFavMap = (): Record<string, boolean> => {
  try {
    const saved = localStorage.getItem(HOT_FAV_MAP_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
};

const buildHotQuestions = (): QaItem[] => {
  const favMap = loadHotFavMap();
  return hotQuestions.map((q) =>
    favMap[q.id] !== undefined ? { ...q, isFavorite: favMap[q.id] } : q
  );
};

export const useQaStore = create<QaState>((set, get) => ({
  hotQuestions: buildHotQuestions(),
  favorites: loadFavorites(),
  chatHistory: loadChatHistory(),
  isRecording: false,
  isSpeaking: false,

  addMessage: (msg) => {
    set((state) => {
      const next = [...state.chatHistory, msg];
      localStorage.setItem(CHAT_KEY, JSON.stringify(next));
      return { chatHistory: next };
    });
  },

  toggleFavorite: (id) => {
    set((state) => {
      // 更新 hotQuestions 状态
      const nextHot = state.hotQuestions.map((q) => {
        if (q.id === id) {
          return { ...q, isFavorite: !q.isFavorite };
        }
        return q;
      });

      const targetHot = state.hotQuestions.find((q) => q.id === id);

      // 计算 nextFavorites：从本地 faves 中增删
      let nextFaves = [...state.favorites];
      const alreadyFav = nextFaves.some((f) => f.id === id);
      if (alreadyFav) {
        nextFaves = nextFaves.filter((f) => f.id !== id);
      } else if (targetHot) {
        nextFaves.push({ ...targetHot, isFavorite: true });
      }

      // 存储 hot 的 fav 映射
      const favMap: Record<string, boolean> = {};
      nextHot.forEach((q) => (favMap[q.id] = q.isFavorite));

      localStorage.setItem(HOT_FAV_MAP_KEY, JSON.stringify(favMap));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFaves));

      return {
        hotQuestions: nextHot,
        favorites: nextFaves,
      };
    });
  },

  setRecording: (val) => set({ isRecording: val }),
  setSpeaking: (val) => set({ isSpeaking: val }),

  clearChat: () => {
    const next: ChatMessage[] = [];
    localStorage.setItem(CHAT_KEY, JSON.stringify(next));
    set({ chatHistory: next });
  },

  restoreDefaultChat: () => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(initialChatMessages));
    set({ chatHistory: initialChatMessages });
  },
}));
