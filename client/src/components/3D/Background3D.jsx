import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function Background3D() {
  const scroll = useScroll();
  const group = useRef();
  
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Rotate the background slowly over time
    group.current.rotation.y += delta * 0.05;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Move background slightly based on scroll to create parallax
    if (scroll) {
      const scrollY = scroll.offset;
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, scrollY * 5, 0.1);
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#14b8a6" />
      
      {/* Deep Space Background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Floating neon dust */}
      <Sparkles count={200} scale={20} size={2} speed={0.4} color="#14b8a6" />
      
      {/* Centerpiece Wireframe Planet/Core */}
      <mesh position={[0, 0, -5]}>
        <icosahedronGeometry args={[3, 1]} />
        <meshStandardMaterial color="#14b8a6" wireframe transparent opacity={0.1} />
      </mesh>
      
      {/* Floating geometric fragments */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 30, 
            (Math.random() - 0.5) * 30, 
            (Math.random() - 0.5) * 15 - 5
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <octahedronGeometry args={[Math.random() * 0.8 + 0.2, 0]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#14b8a6" : "#d4af37"} wireframe transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
