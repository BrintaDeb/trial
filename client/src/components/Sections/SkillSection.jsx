import React from 'react';

const skills = [
  { name: 'UI/UX DESIGN', level: 95, color: '#14b8a6' },
  { name: 'GRAPHIC DESIGN', level: 90, color: '#d4af37' },
  { name: 'WEB DEVELOPMENT', level: 85, color: '#d38c8c' },
  { name: 'SEO', level: 75, color: '#4a90e2' },
  { name: 'SERVER MANAGEMENT', level: 70, color: '#9b59b6' }
];

export default function SkillSection() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center pointer-events-none relative">
      <h3 className="font-titan text-3xl text-white/50 tracking-widest uppercase absolute top-32">SKILL TREE</h3>
      
      <div className="flex flex-wrap justify-center gap-8 max-w-4xl mt-16 pointer-events-auto">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center justify-center w-56 h-32 cursor-interactive border border-white/20 bg-primary/80 backdrop-blur-md rounded-lg hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            style={{ 
              '--hover-color': skill.color,
              borderColor: 'var(--hover-border, rgba(255,255,255,0.2))' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.setProperty('--hover-border', skill.color);
              e.currentTarget.style.boxShadow = `0 0 20px ${skill.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty('--hover-border', 'rgba(255,255,255,0.2)');
              e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5)`;
            }}
          >
            <div className="text-white text-xs font-sans tracking-widest text-center mb-4">{skill.name}</div>
            <div className="text-3xl font-titan drop-shadow-lg" style={{ color: skill.color }}>
              LVL {skill.level}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
