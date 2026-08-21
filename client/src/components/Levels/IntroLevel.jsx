import React, { useRef } from 'react';
import { Text, Float, Html } from '@react-three/drei';

export default function IntroLevel() {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text 
          position={[0, 1, 0]} 
          fontSize={1.5} 
          font="https://fonts.gstatic.com/s/titanone/v13/m8JVjfWPe1W_e_6bJzH3CJo.woff"
          color="#d4af37"
          anchorX="center"
          anchorY="middle"
        >
          ATELIER
        </Text>
        <Text 
          position={[0, -0.5, 0]} 
          fontSize={1.5} 
          font="https://fonts.gstatic.com/s/titanone/v13/m8JVjfWPe1W_e_6bJzH3CJo.woff"
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          STUDIOS
        </Text>
      </Float>

      <Html position={[0, -2.5, 0]} transform distanceFactor={10} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center gap-4 cursor-interactive">
          <div className="text-accent1 tracking-widest text-sm uppercase">Ready Player?</div>
          <button className="px-6 py-2 border border-accent2 text-accent2 rounded hover:bg-accent2 hover:text-primary transition-colors">
            ENTER PORTFOLIO
          </button>
        </div>
      </Html>
    </group>
  );
}
