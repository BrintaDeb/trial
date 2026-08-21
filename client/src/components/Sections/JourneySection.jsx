import React from 'react';

const checkpoints = [
  { text: 'START', status: 'COMPLETED' },
  { text: 'CHECKPOINT 01', status: 'COMPLETED' },
  { text: 'CHECKPOINT 02', status: 'COMPLETED' },
  { text: 'CURRENT LEVEL', status: 'IN_PROGRESS' }
];

export default function JourneySection() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center pointer-events-none relative">
      <h3 className="font-titan text-3xl text-white/50 tracking-widest uppercase absolute top-32">GAME PROGRESS MAP</h3>
      
      <div className="flex flex-col items-center gap-12 mt-16 pointer-events-auto">
        {checkpoints.map((cp, index) => (
          <div key={index} className="flex flex-col items-center gap-4 group">
            {index > 0 && (
              <div className={`w-1 h-12 ${cp.status === 'COMPLETED' ? 'bg-accent1' : 'bg-gray-700'}`} />
            )}
            <div className="flex items-center gap-6 cursor-interactive">
              <div className={`w-16 text-right text-xs tracking-widest font-bold ${cp.status === 'COMPLETED' ? 'text-accent1' : 'text-accent2'}`}>
                {cp.status === 'COMPLETED' ? 'DONE' : 'ACTIVE'}
              </div>
              <div className={`w-6 h-6 rounded-full border-4 ${cp.status === 'COMPLETED' ? 'bg-accent1 border-accent1' : 'bg-transparent border-accent2 shadow-[0_0_15px_rgba(212,175,55,0.8)]'} group-hover:scale-125 transition-transform duration-300`} />
              <div className="w-48 text-left font-titan text-xl text-white group-hover:text-accent1 transition-colors drop-shadow-md">
                {cp.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
