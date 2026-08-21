import React from 'react';

const HUD = ({ level, progress }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 p-8 flex flex-col justify-between">
      
      {/* Top Bar */}
      <div className="flex justify-between items-start font-sans text-sm tracking-widest uppercase">
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-xs">Player</span>
          <span className="text-white font-bold">Shreyam (BrintaDeb)</span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-gray-500 text-xs">Current Level</span>
          <span className="text-accent2 font-bold">{level}</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end font-sans text-sm tracking-widest uppercase">
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-xs">Status</span>
          <span className="text-accent1 font-bold">Available for Projects</span>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className="text-gray-500 text-xs">Progress</span>
          <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-white">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default HUD;
