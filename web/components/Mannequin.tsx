"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense } from 'react';

/**
 * A simple 3D mannequin placeholder using react-three-fiber.  This
 * component renders a sphere to stand in for a full body model.  In
 * the future you can replace the sphere with an imported GLB/GLTF
 * model via @react-three/drei's useGLTF hook.  The OrbitControls
 * component allows the user to rotate the view for a 3D feel.
 */
function PlaceholderModel() {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  );
}

export default function Mannequin() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [0, 1, 3] }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <Suspense
          fallback={
            <Html center>
              <span style={{ color: '#555', fontSize: '0.8rem' }}>Loading mannequin…</span>
            </Html>
          }
        >
          <PlaceholderModel />
        </Suspense>
        <OrbitControls enableZoom enablePan={false} />
      </Canvas>
    </div>
  );
}