import React from 'react';
import { Text, Float, Html } from '@react-three/drei';

export default function SkillsLevel() {
  const skills = [
    { name: 'UI/UX DESIGN', level: 95, color: '#14b8a6', pos: [-3, 1, 0] },
    { name: 'GRAPHIC DESIGN', level: 90, color: '#d4af37', pos: [0, 2, -1] },
    { name: 'WEB DEVELOPMENT', level: 85, color: '#d38c8c', pos: [3, 1, 0] },
    { name: 'SEO', level: 75, color: '#4a90e2', pos: [-1.5, -1, 1] },
    { name: 'SERVER MANAGEMENT', level: 70, color: '#9b59b6', pos: [1.5, -1, 1] },
  ];

  return (
    <group>
      <Text 
        position={[0, 4, -2]} 
        fontSize={1} 
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SKILL TREE
      </Text>

      {skills.map((skill, idx) => (
        <Float key={idx} speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <group position={skill.pos}>
            {/* Holographic Card Background */}
            <mesh>
              <planeGeometry args={[2.5, 1.5]} />
              <meshStandardMaterial color={skill.color} transparent opacity={0.1} />
            </mesh>
            
            <Html position={[0, 0, 0.1]} transform distanceFactor={5} zIndexRange={[100, 0]}>
              <div className="flex flex-col items-center justify-center w-48 h-24 cursor-interactive border border-white/20 bg-primary/40 backdrop-blur-sm rounded hover:border-[color:var(--hover-color)] transition-all" style={{ '--hover-color': skill.color }}>
                <div className="text-white text-xs font-sans tracking-widest text-center">{skill.name}</div>
                <div className="text-2xl font-titan mt-2" style={{ color: skill.color }}>LVL {skill.level}</div>
              </div>
            </Html>
          </group>
        </Float>
      ))}
    </group>
  );
}
