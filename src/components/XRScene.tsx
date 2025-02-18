// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Glub } from './pets/Glub';
import { usePetStore } from '../store/petStore';
import CanvasClickHandler from './CanvasClickHandler';

export const store = createXRStore();

function GlubPet() {
  const glubRef = useRef<THREE.Group>(null);
  const { glubPosition, selectedElement, isFeeding } = usePetStore();

  useFrame((state, delta) => {
    if (glubRef.current) {
      const targetPos = new THREE.Vector3(...glubPosition);
      glubRef.current.position.lerp(targetPos, 0.1);

      if (isFeeding && selectedElement) {
        // Approximate element position in 3D space (simplified)
        const elementPos = new THREE.Vector3(5, 0, 0); // Adjust based on real position if available
        glubRef.current.lookAt(elementPos);
      }
    }
  });

  return <Glub ref={glubRef} />;
}

export function XRScene() {
  const [canvasPointerEvents, setCanvasPointerEvents] = useState<
    'none' | 'auto'
  >('none');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setCanvasPointerEvents('auto');
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setCanvasPointerEvents('none');
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Canvas
      id='tamagotchi'
      camera={{ fov: 70, position: [0, 0, 10], near: 0.1, far: 1000 }}
      style={{
        width: '100vw',
        height: '100vh',
        pointerEvents: canvasPointerEvents,
      }}
      className={
        canvasPointerEvents === 'auto' ? 'pointer-auto' : 'pointer-none'
      }>
      <ambientLight intensity={0.5} />
      <Environment preset='sunset' />
      <XR store={store}>
        <CanvasClickHandler />
        <GlubPet />
      </XR>
    </Canvas>
  );
}
