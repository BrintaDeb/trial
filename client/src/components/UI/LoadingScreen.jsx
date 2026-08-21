import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onStarted }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [text, setText] = useState('INITIALIZING WORLD');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          setText('READY');
          return 100;
        }
        
        if (prev === 30) setText('LOADING PROJECTS');
        if (prev === 60) setText('LOADING EXPERIENCE');
        
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 flex flex-col items-center gap-8">
        <h1 className="font-titan text-4xl gradient-text tracking-wider">PORTFOLIO</h1>
        
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between text-xs text-gray-500 tracking-widest uppercase">
            <span>{text}</span>
            <span>{progress}%</span>
          </div>
          
          <div className="w-full h-1 bg-gray-900 overflow-hidden">
            <div 
              className="h-full bg-accent2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button 
          onClick={onStarted}
          disabled={!ready}
          className={`
            cursor-interactive px-8 py-3 border border-accent1 text-accent1 font-bold tracking-widest uppercase text-sm
            transition-all duration-500 
            ${ready ? 'opacity-100 hover:bg-accent1 hover:text-primary hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]' : 'opacity-0'}
          `}
        >
          Press to Enter
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;
