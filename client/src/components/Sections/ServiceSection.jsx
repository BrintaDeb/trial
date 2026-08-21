import React from 'react';

const services = [
  'UI/UX DESIGN',
  'GRAPHIC DESIGN',
  'WEB DEVELOPMENT',
  'SEO MANAGEMENT',
  'WEBSITE MAINTENANCE',
  'SERVER MANAGEMENT'
];

export default function ServiceSection() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center pointer-events-none relative">
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-8 pointer-events-auto">
        <h3 className="font-titan text-3xl text-white/50 tracking-widest uppercase">SELECT MISSION TYPE</h3>
        
        <div className="flex flex-col gap-3 w-[450px]">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group cursor-interactive p-5 border-l-4 border-transparent hover:border-accent1 bg-primary/40 hover:bg-primary/80 backdrop-blur-sm transition-all duration-300 flex justify-between items-center rounded-r-lg"
            >
              <div>
                <div className="text-gray-500 text-[10px] tracking-widest mb-1 font-bold">MISSION TYPE 0{index + 1}</div>
                <div className="text-white font-titan text-xl group-hover:text-accent1 transition-colors">{service}</div>
              </div>
              <div className="text-accent2 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest text-xs font-bold bg-accent2/10 px-3 py-1 rounded">
                SELECT
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
