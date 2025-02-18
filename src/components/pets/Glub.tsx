// @ts-nocheck
// src/components/pets/Glub.tsx
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
import { usePetStore } from '../../store/petStore';

type GLTFResult = GLTF & {
  nodes: { Glub: THREE.SkinnedMesh; Root: THREE.Bone };
  materials: { Atlas: THREE.MeshStandardMaterial };
};

type GlubProps = JSX.IntrinsicElements['group'];

export const Glub = forwardRef<THREE.Group, GlubProps>((props, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const gltfUrl = useAddonStore((state) => {
    console.log('addonStore state:', state);
    return state.gltfUrl;
  });
  const { isFeeding } = usePetStore();

  console.log('Glub component rendering with gltfUrl:', gltfUrl);
  if (!gltfUrl) {
    console.error('No GLTF URL provided in addonStore');
    return null;
  }

  let gltfData: GLTFResult;
  try {
    gltfData = useGLTF(gltfUrl) as GLTFResult;
    console.log('GLTF loaded successfully:', gltfUrl);
  } catch (error) {
    console.error('Failed to load GLTF:', gltfUrl, error);
    return null;
  }

  const { nodes, materials, animations } = gltfData;
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const idleAction = actions?.Flying_Idle;
    const headbuttAction = actions?.Headbutt;

    if (isFeeding && headbuttAction) {
      if (idleAction) idleAction.stop();
      headbuttAction.reset().play();
      setTimeout(() => {
        headbuttAction.stop();
        if (idleAction) idleAction.reset().play();
      }, 1000);
    } else if (idleAction && !isFeeding) {
      idleAction.reset().play();
    }

    return () => {
      if (idleAction) idleAction.stop();
      if (headbuttAction) headbuttAction.stop();
    };
  }, [isFeeding, actions]);

  useImperativeHandle(ref, () => groupRef.current!);

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

// Preload can use the store's default, but it’s optional
useGLTF.preload('/pets/Glub.gltf');
