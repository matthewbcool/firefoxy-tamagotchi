import { create } from 'zustand';

type AddonStore = {
  gltfUrl: string;
  setGltfUrl: (url: string) => void;
};

const useAddonStore = create<AddonStore>((set) => ({
  // Default fallback
  gltfUrl: '/pets/Glub.gltf',
  setGltfUrl: (url: string) => set({ gltfUrl: url }),
}));

export default useAddonStore;
