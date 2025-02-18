// @ts-nocheck
import React, { useEffect } from 'react';
import AIEngine from './components/AIEngine';
import { XRScene } from './components/XRScene';
import useAddonStore from './store/addonStore';

const App: React.FC = () => {
  const setGltfUrl = useAddonStore((state) => state.setGltfUrl);

  useEffect(() => {
    console.log('App mounted, checking ADDON_CONFIG:', window.ADDON_CONFIG);
    if (window.ADDON_CONFIG?.gltfUrl) {
      console.log('Using ADDON_CONFIG.gltfUrl:', window.ADDON_CONFIG.gltfUrl);
      setGltfUrl(window.ADDON_CONFIG.gltfUrl);
    } else {
      console.error('ADDON_CONFIG.gltfUrl not set, using fallback');
      setGltfUrl('/pets/Glub.gltf');
    }

    const aiEngine = new AIEngine();
    aiEngine.initialize().catch(console.error);
  }, [setGltfUrl]);

  return <XRScene />;
};

export default App;
