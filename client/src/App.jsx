import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, Float, Text, Stars, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import HUD from './components/UI/HUD';
import CustomCursor from './components/UI/CustomCursor';
import LoadingScreen from './components/UI/LoadingScreen';
import CanvasErrorBoundary from './components/UI/CanvasErrorBoundary';

// --- Section Components ---
import IntroSection from './components/Sections/IntroSection';
import ProfileSection from './components/Sections/ProfileSection';
import SkillSection from './components/Sections/SkillSection';
import ProjectSection from './components/Sections/ProjectSection';
import ServiceSection from './components/Sections/ServiceSection';
import JourneySection from './components/Sections/JourneySection';
import ContactSection from './components/Sections/ContactSection';

import Background3D from './components/3D/Background3D';

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
              
              {/* 3D Background Layer */}
              <Background3D />
              
              {/* 2D HTML UI Overlay Layer */}
              <Scroll html style={{ width: '100vw' }}>
                <IntroSection />
                <ProfileSection />
                <SkillSection />
                <ProjectSection />
                <ServiceSection />
                <JourneySection />
                <ContactSection />
              </Scroll>

            </ScrollControls>
          </Suspense>
        </CanvasErrorBoundary>
      </Canvas>
    </div>
  );
}

export default App;
