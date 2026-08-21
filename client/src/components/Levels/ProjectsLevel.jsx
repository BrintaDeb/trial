import React, { useRef } from 'react';
import { Text, Float, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function ProjectsLevel() {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const projects = [
    { title: 'SaaS Dashboard', type: 'UI/UX DESIGN', status: 'COMPLETED', pos: [-4, 0, 0] },
    { title: 'Fintech App', type: 'MOBILE APP', status: 'COMPLETED', pos: [0, 0, -2] },
    { title: 'E-commerce Store', type: 'WEB DEVELOPMENT', status: 'COMPLETED', pos: [4, 0, 0] },
  ];

  return (
    <group>
      <Text 
        position={[0, 3, 0]} 
        fontSize={1} 
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        MISSIONS
      </Text>

      {/* Atmospheric Ring */}
      <group ref={ringRef} position={[0, 0, -1]}>
        <mesh>
          <torusGeometry args={[5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.3} />
        </mesh>
      </group>

      {projects.map((proj, idx) => (
        <Float key={idx} speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
          <group position={proj.pos}>
            <Html transform distanceFactor={7} zIndexRange={[100, 0]}>
              <div className="w-64 bg-primary/60 backdrop-blur-md border-t-2 border-accent1 p-4 cursor-interactive hover:scale-105 transition-transform duration-300 shadow-[0_10px_30px_rgba(20,184,166,0.1)]">
                <div className="text-accent1 text-xs tracking-widest mb-2">MISSION 0{idx + 1}</div>
                <div className="text-white font-titan text-lg mb-1">{proj.title}</div>
                <div className="text-gray-400 text-xs tracking-widest mb-4">{proj.type}</div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                  <div className="text-accent2 text-[10px] tracking-widest">{proj.status}</div>
                  <button className="text-white text-xs bg-white/10 px-3 py-1 hover:bg-accent1 hover:text-primary transition-colors">
                    VIEW MISSION
                  </button>
                </div>
              </div>
            </Html>
          </group>
        </Float>
      ))}
    </group>
  );
}
