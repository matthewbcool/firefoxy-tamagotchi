// @ts-nocheck
import React, { useEffect } from 'react';
import AIEngine from './components/AIEngine';
import { XRScene } from './components/XRScene';
import useAddonStore from './store/addonStore';

const App: React.FC = () => {
  const setGltfUrl = useAddonStore((state) => state.setGltfUrl);

  useEffect(() => {
    // Update Zustand store with the global glTF base URL if available
    if (window.ADDON_CONFIG && window.ADDON_CONFIG.gltfUrlBase) {
      const computedUrl = window.ADDON_CONFIG.gltfUrlBase + 'pets/Glub.gltf';
      setGltfUrl(computedUrl);
      console.log('Updated Zustand store gltfUrl:', computedUrl);
    }

    // Initialize the AI engine
    const aiEngine = new AIEngine();
    aiEngine.initialize().catch(console.error);
  }, [setGltfUrl]);

  return (
    <>
      <XRScene store={{} as any}>
        {/* XRScene will render its own children including Glub */}
      </XRScene>
    </>
  );
};

export default App;
