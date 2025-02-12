// @ts-nocheck
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { usePetStore } from '../store/petStore';

export default function CanvasClickHandler() {
  const { camera, gl } = useThree();
  const setGlubPosition = usePetStore((state) => state.setGlubPosition);
  const glubPosition = usePetStore((state) => state.glubPosition);

  // Log the pet position whenever it changes
  useEffect(() => {
    console.log('Current pet position:', glubPosition);
  }, [glubPosition]);

  useEffect(() => {
    // Create a plane at z=0 (adjust as needed)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handlePointerDown = (e: PointerEvent) => {
      if (!e.shiftKey) return;
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersection = new THREE.Vector3();
      // Find the intersection with the plane:
      raycaster.ray.intersectPlane(plane, intersection);

      console.log('CanvasClickHandler setting position:', intersection);
      setGlubPosition([intersection.x, intersection.y, intersection.z]);
    };

    gl.domElement.addEventListener('pointerdown', handlePointerDown);
    return () => {
      gl.domElement.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [camera, gl, setGlubPosition]);

  return null;
}
