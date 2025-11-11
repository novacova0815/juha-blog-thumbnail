import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Shape: React.FC<{ position: THREE.Vector3, rotationSpeed: number }> = ({ position, rotationSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.x += delta * rotationSpeed * 0.2;
        meshRef.current.rotation.y += delta * rotationSpeed * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#f97316" roughness={0.4} metalness={0.6} />
    </mesh>
  );
};

export const MotionBackground: React.FC = () => {
  const shapes = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      ),
      rotationSpeed: Math.random() * 0.5 + 0.1
    }));
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#111827' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ea580c" />
        {shapes.map((shape, index) => (
          <Shape key={index} position={shape.position} rotationSpeed={shape.rotationSpeed} />
        ))}
      </Canvas>
    </div>
  );
};