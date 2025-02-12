import * as THREE from 'three';
import '@react-three/fiber';
import '@react-three/xr';

declare module '@react-three/xr' {
  // Extend XRProps to allow children and make store optional.
  interface XRProps {
    children?: React.ReactNode;
    store?: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      meshStandardMaterial: any;
      boxGeometry: any;
      mesh: any;
      monsterEggMaterial: any;
      group: any;
    }
  }
}
