import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, Float, Text, Stars, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import HUD from './components/UI/HUD';
import CustomCursor from './components/UI/CustomCursor';
import LoadingScreen from './components/UI/LoadingScreen';
import CanvasErrorBoundary from './components/UI/CanvasErrorBoundary';

// --- Level Components ---
import IntroLevel from './components/Levels/IntroLevel';
import ProfileLevel from './components/Levels/ProfileLevel';
import SkillsLevel from './components/Levels/SkillsLevel';
import ProjectsLevel from './components/Levels/ProjectsLevel';
import ServicesLevel from './components/Levels/ServicesLevel';
import JourneyLevel from './components/Levels/JourneyLevel';
import ContactLevel from './components/Levels/ContactLevel';

function Scene() {
  const scroll = useScroll();
  const cameraGroup = useRef();

  useFrame((state, delta) => {
    // Scroll progress goes from 0 to 1
    const r1 = scroll.range(0, 1/6);
    const r2 = scroll.range(1/6, 1/6);
    const r3 = scroll.range(2/6, 1/6);
    const r4 = scroll.range(3/6, 1/6);
    const r5 = scroll.range(4/6, 1/6);
    const r6 = scroll.range(5/6, 1/6);

    // Camera moves forward through the levels
    // Each level is spaced out on the Z axis
    const maxZ = -60; // Total depth
    cameraGroup.current.position.z = THREE.MathUtils.lerp(cameraGroup.current.position.z, scroll.offset * maxZ, 0.1);
  });

  return (
    <group ref={cameraGroup}>
      {/* Lights */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#14b8a6" />

      {/* Environment Particles */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.4} color="#14b8a6" />

      {/* Levels spread out along the Z axis */}
      <group position={[0, 0, 0]}>
        <IntroLevel />
      </group>
      
      <group position={[0, 0, -10]}>
        <ProfileLevel />
      </group>
      
      <group position={[0, 0, -20]}>
        <SkillsLevel />
      </group>

      <group position={[0, 0, -30]}>
        <ProjectsLevel />
      </group>

      <group position={[0, 0, -40]}>
        <ServicesLevel />
      </group>

      <group position={[0, 0, -50]}>
        <JourneyLevel />
      </group>

      <group position={[0, 0, -60]}>
        <ContactLevel />
      </group>
    </group>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState('01 INTRO');
  const [progress, setProgress] = useState(0);

  return (
    <div className="w-screen h-screen bg-[#050505] overflow-hidden">
      <CustomCursor />
      
      {!started && <LoadingScreen onStarted={() => setStarted(true)} />}

      <HUD level={level} progress={progress} />

      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#050505']} />
        <CanvasErrorBoundary>
          <Suspense fallback={<Html center><div className="text-white text-xl">LOADING 3D SCENE...</div></Html>}>
            <ScrollControls pages={7} damping={0.25}>
              <fog attach="fog" args={['#050505', 5, 15]} />
              <Scene />
              {/* HTML Overlay layers that scroll with the 3D scene can go here */}
              <Scroll html style={{ width: '100%', height: '100%' }}>
                {/* Invisible spacer div to capture native scroll events */}
                <div style={{ height: '700vh', width: '100%' }} />
              </Scroll>
            </ScrollControls>
          </Suspense>
        </CanvasErrorBoundary>
      </Canvas>
    </div>
  );
}

export default App;
