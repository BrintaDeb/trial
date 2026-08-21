import React from 'react';
import { Text, Html } from '@react-three/drei';

export default function ServicesLevel() {
  const services = [
    'UI/UX DESIGN',
    'GRAPHIC DESIGN',
    'WEB DEVELOPMENT',
    'SEO MANAGEMENT',
    'WEBSITE MAINTENANCE',
    'SERVER MANAGEMENT'
  ];

  return (
    <group>
      <Text 
        position={[-4, 3, 0]} 
        fontSize={0.8} 
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        SELECT MISSION TYPE
      </Text>

      <Html position={[-4, 1.5, 0]} transform distanceFactor={8} zIndexRange={[100, 0]}>
        <div className="flex flex-col gap-2 w-96">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="group cursor-interactive p-4 border-l-4 border-transparent hover:border-accent1 hover:bg-white/5 transition-all flex justify-between items-center"
            >
              <div>
                <div className="text-gray-500 text-[10px] tracking-widest mb-1">MISSION TYPE 0{idx + 1}</div>
                <div className="text-white font-titan text-lg group-hover:text-accent1 transition-colors">{service}</div>
              </div>
              <div className="text-accent2 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest text-xs">
                SELECT
              </div>
            </div>
          ))}
        </div>
      </Html>
    </group>
  );
}
