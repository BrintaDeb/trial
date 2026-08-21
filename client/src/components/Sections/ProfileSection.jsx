import React from 'react';

export default function ProfileSection() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center pointer-events-none relative">
      <div className="absolute left-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-8">
        <h3 className="font-titan text-3xl text-white/50 tracking-widest uppercase">PLAYER PROFILE</h3>
        
        <div className="bg-primary/80 border border-accent1/30 p-8 rounded-lg w-[500px] backdrop-blur-md pointer-events-auto game-panel shadow-[0_0_30px_rgba(20,184,166,0.1)]">
          <h2 className="text-accent2 text-3xl font-titan mb-6">Shreyam (BrintaDeb)</h2>
          
          <div className="space-y-6 font-sans text-base">
            <div>
              <div className="text-gray-500 uppercase text-xs tracking-widest mb-2 font-bold">Role</div>
              <div className="text-white text-xl">UI/UX DESIGNER</div>
            </div>
            
            <div>
              <div className="text-gray-500 uppercase text-xs tracking-widest mb-2 font-bold">Secondary Skills</div>
              <div className="text-white flex flex-wrap gap-3 mt-2">
                <span className="px-3 py-1.5 bg-white/10 rounded-md text-sm border border-white/5">Web Development</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-md text-sm border border-white/5">Graphic Design</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-md text-sm border border-white/5">SEO</span>
              </div>
            </div>
            
            <div>
              <div className="text-gray-500 uppercase text-xs tracking-widest mb-2 font-bold">Special Abilities</div>
              <div className="text-accent1 mt-1 font-bold">Cinematic 3D Integration</div>
              <div className="text-accent1 mt-2 font-bold">Advanced Framer Motion</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
