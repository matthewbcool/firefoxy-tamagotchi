// src/store/petStore.tsx
import { create } from 'zustand';

export const usePetStore = create((set) => ({
  glubPosition: [0, 0, 0],
  setGlubPosition: (pos: number[]) => set({ glubPosition: pos }),
  selectedElement: null, // { type: 'text' | 'image', content: string }
  setSelectedElement: (
    element: { type: 'text' | 'image'; content: string } | null
  ) => set({ selectedElement: element }),
  isFeeding: false,
  setIsFeeding: (feeding: boolean) => set({ isFeeding: feeding }),
}));
