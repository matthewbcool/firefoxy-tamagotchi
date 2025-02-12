// @ts-nocheck
// filepath: /Users/mattcool/Projects/Firefoxy Tamagotchi/Firefoxy-Tamagotchi/src/components/pets/Glub.tsx
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import useAddonStore from '../../store/addonStore';

// If you want typing for nodes/materials, you can define them as well:
type GLTFResult = GLTF & {
  nodes: {
    Glub: THREE.SkinnedMesh;
    Root: THREE.Bone;
  };
  materials: {
    Atlas: THREE.MeshStandardMaterial;
  };
};

type GlubProps = JSX.IntrinsicElements['group'];

// Forward the ref from the parent:
export const Glub = forwardRef<THREE.Group, GlubProps>((props, ref) => {
  // We keep a local ref for using inside this component and for useAnimations
  const groupRef = useRef<THREE.Group>(null);

  // Retrieve gltfUrl from Zustand store
  const gltfUrl = useAddonStore((state) => state.gltfUrl);

  // Only load the asset if the gltfUrl is set
  if (!gltfUrl) {
    return null;
  }

  console.log('Loading GLTF from URL:', gltfUrl);
  const { nodes, materials, animations } = useGLTF(gltfUrl) as GLTFResult;
  const { actions } = useAnimations(animations, groupRef);

  // Play "Flying_Idle" on mount
  useEffect(() => {
    if (actions?.Flying_Idle) {
      actions.Flying_Idle.reset().play();
    }
  }, [actions]);

  // Expose the local groupRef to the parent’s ref
  useImperativeHandle(ref, () => groupRef.current!, []);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group name='Scene'>
        <group name='CharacterArmature'>
          <skinnedMesh
            name='Glub'
            geometry={nodes.Glub.geometry}
            material={materials.Atlas}
            skeleton={nodes.Glub.skeleton}
          />
          <primitive object={nodes.Root} />
        </group>
      </group>
    </group>
  );
});

useGLTF.preload('/pets/Glub.gltf');
