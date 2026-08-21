import React from 'react';

export default function ContactSection() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center pointer-events-none relative">
      <div className="flex flex-col items-center gap-8 pointer-events-auto mt-16">
        <h3 className="font-titan text-4xl text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">READY TO START A NEW MISSION?</h3>
        
        <div className="w-[500px] bg-primary/90 backdrop-blur-xl border border-accent1/50 rounded-lg p-8 shadow-[0_0_50px_rgba(20,184,166,0.2)]">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            <span className="ml-4 text-xs tracking-widest text-gray-500 font-sans font-bold">SECURE_COMMS_LINK</span>
          </div>

          <form className="flex flex-col gap-5 font-sans">
            <input 
              type="text" 
              placeholder="PLAYER NAME" 
              className="bg-black/50 border border-white/20 text-white p-4 rounded focus:outline-none focus:border-accent1 tracking-widest text-sm transition-colors"
            />
            <input 
              type="email" 
              placeholder="TRANSMISSION EMAIL" 
              className="bg-black/50 border border-white/20 text-white p-4 rounded focus:outline-none focus:border-accent1 tracking-widest text-sm transition-colors"
            />
            <textarea 
              placeholder="MISSION DETAILS..." 
              rows="4"
              className="bg-black/50 border border-white/20 text-white p-4 rounded focus:outline-none focus:border-accent1 tracking-widest text-sm resize-none transition-colors"
            />
            
            <div className="flex justify-between items-center mt-6">
              <button 
                type="button" 
                className="cursor-interactive text-green-400 border border-green-400/30 bg-green-400/10 px-5 py-3 text-xs tracking-widest rounded hover:bg-green-400 hover:text-black transition-colors flex items-center gap-2 font-bold"
              >
                <span>WHATSAPP COMMS</span>
              </button>
              
              <button 
                type="submit" 
                className="cursor-interactive bg-accent2 text-primary font-bold px-8 py-3 tracking-widest uppercase rounded hover:bg-white transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              >
                START MISSION
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
