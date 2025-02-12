import { create } from 'zustand';

export const usePetStore = create((set) => ({
  glubPosition: [0, 0, 0],
  setGlubPosition: (pos: number[]) => set({ glubPosition: pos }),
}));
