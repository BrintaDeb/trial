import React from 'react';

const projects = [
  { title: 'SaaS Dashboard', type: 'UI/UX DESIGN', status: 'COMPLETED' },
  { title: 'Fintech App', type: 'MOBILE APP', status: 'COMPLETED' },
  { title: 'E-commerce Store', type: 'WEB DEVELOPMENT', status: 'COMPLETED' }
];

export default function ProjectSection() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center pointer-events-none relative">
      <h3 className="font-titan text-3xl text-white/50 tracking-widest uppercase absolute top-32">MISSIONS</h3>
      
      <div className="flex gap-8 max-w-6xl mt-16 pointer-events-auto flex-wrap justify-center">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="w-72 bg-primary/80 backdrop-blur-md border-t-4 border-accent1 p-6 cursor-interactive hover:-translate-y-2 transition-all duration-300 shadow-[0_10px_30px_rgba(20,184,166,0.1)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.3)] rounded-b-lg"
          >
            <div className="text-accent1 text-xs tracking-widest mb-3 font-bold">MISSION 0{index + 1}</div>
            <div className="text-white font-titan text-2xl mb-2">{project.title}</div>
            <div className="text-gray-400 text-xs tracking-widest mb-6 font-bold">{project.type}</div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
              <div className="text-accent2 text-[10px] tracking-widest font-bold">{project.status}</div>
              <button className="text-white text-xs bg-white/10 px-4 py-2 hover:bg-accent1 hover:text-primary transition-colors rounded font-bold tracking-wider">
                VIEW MISSION
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
