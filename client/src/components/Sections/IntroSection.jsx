import React from 'react';
import { useScroll } from '@react-three/drei';

export default function IntroSection() {
  const scroll = useScroll();

  const handleEnter = () => {
    // Scroll down to the first page (Profile)
    // 1/7 of the total scroll height
    if (scroll && scroll.el) {
      scroll.el.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
        <h1 className="font-titan text-7xl md:text-9xl text-accent2 tracking-widest drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
          ATELIER
        </h1>
        <h2 className="font-titan text-5xl md:text-7xl text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] -mt-4">
          STUDIOS
        </h2>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
        <div className="text-accent1 tracking-widest text-sm uppercase animate-pulse">Ready Player?</div>
        <button 
          onClick={handleEnter}
          className="cursor-interactive px-8 py-3 border-2 border-accent2 text-accent2 rounded hover:bg-accent2 hover:text-primary transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] font-bold tracking-widest text-sm"
        >
          ENTER PORTFOLIO
        </button>
      </div>
    </section>
  );
}
