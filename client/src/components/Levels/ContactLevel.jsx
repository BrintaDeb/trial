import React from 'react';
import { Text, Html, Float } from '@react-three/drei';

export default function ContactLevel() {
  return (
    <group>
      <Text 
        position={[0, 4, 0]} 
        fontSize={1} 
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        READY TO START A NEW MISSION?
      </Text>

      {/* Terminal UI */}
      <Html position={[0, 0, 0]} transform distanceFactor={10} zIndexRange={[100, 0]}>
        <div className="w-[500px] bg-primary/80 backdrop-blur-md border border-accent1/50 rounded-lg p-8 shadow-[0_0_50px_rgba(20,184,166,0.2)]">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs tracking-widest text-gray-500 font-sans">SECURE_COMMS_LINK</span>
          </div>

          <form className="flex flex-col gap-4 font-sans">
            <input 
              type="text" 
              placeholder="PLAYER NAME" 
              className="bg-black/50 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-accent1 tracking-widest text-sm"
            />
            <input 
              type="email" 
              placeholder="TRANSMISSION EMAIL" 
              className="bg-black/50 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-accent1 tracking-widest text-sm"
            />
            <textarea 
              placeholder="MISSION DETAILS..." 
              rows="4"
              className="bg-black/50 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-accent1 tracking-widest text-sm resize-none"
            ></textarea>
            
            <div className="flex justify-between items-center mt-4">
              <button 
                type="button" 
                className="cursor-interactive text-green-400 border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs tracking-widest rounded hover:bg-green-400 hover:text-black transition-colors flex items-center gap-2"
              >
                <span>WHATSAPP COMMS</span>
              </button>

              <button 
                type="submit"
                className="cursor-interactive bg-accent2 text-primary font-bold px-8 py-3 tracking-widest uppercase rounded hover:bg-white transition-colors"
              >
                START MISSION
              </button>
            </div>
          </form>
        </div>
      </Html>

      {/* Background elements */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={[0, 0, -2]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.05} />
        </mesh>
      </Float>
    </group>
  );
}
