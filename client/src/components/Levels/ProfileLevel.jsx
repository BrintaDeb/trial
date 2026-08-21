import React from 'react';
import { Text, Float, Html } from '@react-three/drei';

export default function ProfileLevel() {
  return (
    <group>
      <Text 
        position={[-3, 2, 0]} 
        fontSize={0.8} 
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        PLAYER PROFILE
      </Text>

      <Html position={[-3, 0, 0]} transform distanceFactor={10} zIndexRange={[100, 0]}>
        <div className="bg-primary/80 border border-accent1/30 p-6 rounded-lg w-96 backdrop-blur-md">
          <h2 className="text-accent2 text-xl font-titan mb-4">Shreyam (BrintaDeb)</h2>
          
          <div className="space-y-4 font-sans text-sm">
            <div>
              <div className="text-gray-500 uppercase text-xs tracking-widest mb-1">Role</div>
              <div className="text-white">UI/UX DESIGNER</div>
            </div>
            
            <div>
              <div className="text-gray-500 uppercase text-xs tracking-widest mb-1">Secondary Skills</div>
              <div className="text-white flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-white/10 rounded">Web Development</span>
                <span className="px-2 py-1 bg-white/10 rounded">Graphic Design</span>
                <span className="px-2 py-1 bg-white/10 rounded">SEO</span>
              </div>
            </div>

            <div>
              <div className="text-gray-500 uppercase text-xs tracking-widest mb-1">Special Abilities</div>
              <div className="text-accent1 mt-1">Cinematic 3D Integration</div>
              <div className="text-accent1 mt-1">Advanced Framer Motion</div>
            </div>
          </div>
        </div>
      </Html>

      {/* Hologram placeholder */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[2, 0, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#14b8a6" wireframe />
        </mesh>
      </Float>
    </group>
  );
}
