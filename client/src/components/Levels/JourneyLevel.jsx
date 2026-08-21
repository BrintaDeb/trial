import React from 'react';
import { Text, Html, Line } from '@react-three/drei';

export default function JourneyLevel() {
  const points = [
    [-2, 3, 0],
    [2, 1, 0],
    [-2, -1, 0],
    [2, -3, 0]
  ];

  const milestones = [
    { text: 'START', pos: [-2, 3, 0] },
    { text: 'CHECKPOINT 01', pos: [2, 1, 0] },
    { text: 'CHECKPOINT 02', pos: [-2, -1, 0] },
    { text: 'CURRENT LEVEL', pos: [2, -3, 0] }
  ];

  return (
    <group>
      <Text 
        position={[0, 5, 0]} 
        fontSize={0.8} 
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        GAME PROGRESS MAP
      </Text>

      {/* Connection Line */}
      <Line 
        points={points}
        color="#14b8a6"
        lineWidth={2}
        dashed={true}
      />

      {milestones.map((m, idx) => (
        <group key={idx} position={m.pos}>
          <mesh>
            <circleGeometry args={[0.2, 32]} />
            <meshBasicMaterial color={idx === milestones.length - 1 ? "#d4af37" : "#14b8a6"} />
          </mesh>
          <Html position={[0.5, 0, 0]} transform distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="text-white font-titan whitespace-nowrap drop-shadow-md">
              {m.text}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
