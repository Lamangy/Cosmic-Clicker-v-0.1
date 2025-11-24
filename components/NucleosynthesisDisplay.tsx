
import React, { useState, useEffect } from 'react';
import { CosmicLaw } from '../types';

const NucleosynthesisVisualization: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner shadow-black/40">
             <h3 className="text-xl font-semibold mb-4 text-pink-300">Forging Helium-4</h3>
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto bg-black/30 rounded-full flex items-center justify-center border-2 border-gray-700 overflow-hidden">
                <div className="absolute w-full h-full rounded-full bg-yellow-500/10 animate-pulse-slow"></div>
                <div className="absolute w-1/2 h-1/2 rounded-full bg-yellow-400/20 blur-xl"></div>
                <div className="particle-container animate-particle-1">
                    <div className="w-6 h-6 rounded-full bg-blue-500 shadow-particle border-2 border-blue-300 flex items-center justify-center text-xs font-bold">P</div>
                </div>
                <div className="particle-container animate-particle-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 shadow-particle border-2 border-blue-300 flex items-center justify-center text-xs font-bold">P</div>
                </div>
                <div className="particle-container animate-particle-3">
                     <div className="w-6 h-6 rounded-full bg-gray-400 shadow-particle border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-black">N</div>
                </div>
                <div className="particle-container animate-particle-4">
                     <div className="w-6 h-6 rounded-full bg-gray-400 shadow-particle border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-black">N</div>
                </div>
                <div className="absolute w-32 h-32 rounded-full bg-white animate-fusion-flash"></div>
                <div className="absolute w-12 h-12 rounded-full bg-pink-500/50 backdrop-blur-sm animate-helium-appear flex items-center justify-center text-white font-bold text-lg">
                    He
                </div>
            </div>
             <style>{`
                .shadow-particle { box-shadow: 0 0 10px 2px currentColor; }
                .particle-container { position: absolute; width: 100%; height: 100%; }
                @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 1; } }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
                @keyframes particle-path-1 { 0% { transform: translate(-120px, -120px) scale(1); opacity: 1; } 40% { transform: translate(0, 0) scale(1); opacity: 1; } 50%, 100% { transform: translate(0, 0) scale(0); opacity: 0; } }
                .animate-particle-1 { animation: particle-path-1 6s ease-in infinite; }
                @keyframes particle-path-2 { 0% { transform: translate(120px, 120px) scale(1); opacity: 1; } 40% { transform: translate(0, 0) scale(1); opacity: 1; } 50%, 100% { transform: translate(0, 0) scale(0); opacity: 0; } }
                .animate-particle-2 { animation: particle-path-2 6s ease-in infinite; animation-delay: 0.2s; }
                @keyframes particle-path-3 { 0% { transform: translate(120px, -120px) scale(1); opacity: 1; } 40% { transform: translate(0, 0) scale(1); opacity: 1; } 50%, 100% { transform: translate(0, 0) scale(0); opacity: 0; } }
                .animate-particle-3 { animation: particle-path-3 6s ease-in infinite; animation-delay: 0.4s; }
                @keyframes particle-path-4 { 0% { transform: translate(-120px, 120px) scale(1); opacity: 1; } 40% { transform: translate(0, 0) scale(1); opacity: 1; } 50%, 100% { transform: translate(0, 0) scale(0); opacity: 0; } }
                .animate-particle-4 { animation: particle-path-4 6s ease-in infinite; animation-delay: 0.6s; }
                @keyframes fusion-flash-kf { 0%, 49% { transform: scale(0); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 60%, 100% { transform: scale(1.5); opacity: 0; } }
                .animate-fusion-flash { animation: fusion-flash-kf 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes helium-appear-kf { 0%, 50% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 70%, 90% { transform: scale(1); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
                .animate-helium-appear { animation: helium-appear-kf 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

const ProtonProtonChainDiagram: React.FC = () => {
    const Particle = ({ label, color, text = 'text-black' }: { label: string, color: string, text?: string }) => (
        <div className={`w-8 h-8 rounded-full ${color} border-2 border-white/50 flex items-center justify-center font-bold text-sm ${text} shadow-md`}>{label}</div>
    );
    const Arrow = () => <div className="text-2xl text-yellow-300 mx-1">&rarr;</div>;
    const Plus = () => <div className="text-2xl text-gray-400 mx-1">+</div>;

    return (
        <div className="w-full flex-grow flex flex-col justify-center items-center p-3 rounded-lg bg-gray-900/50 border border-gray-700">
            <h2 className="text-sm font-semibold text-pink-300 mb-3 text-center uppercase">Proton-Proton Chain</h2>
            <div className="space-y-2 text-xs">
                <div className="flex items-center justify-center">
                    <Particle label="P" color="bg-blue-500" text="text-white" />
                    <Plus/>
                    <Particle label="P" color="bg-blue-500" text="text-white" />
                    <Arrow/>
                    <Particle label="²H" color="bg-purple-500" text="text-white" />
                </div>
                 <p className="text-center text-gray-400">Protons fuse to Deuterium</p>
                 <div className="flex items-center justify-center">
                    <Particle label="²H" color="bg-purple-500" text="text-white" />
                    <Plus/>
                    <Particle label="P" color="bg-blue-500" text="text-white" />
                    <Arrow/>
                    <Particle label="³He" color="bg-pink-500" text="text-white" />
                </div>
                <p className="text-center text-gray-400">Forms Helium-3</p>
                <div className="flex items-center justify-center">
                     <Particle label="³He" color="bg-pink-500" text="text-white" />
                    <Plus/>
                     <Particle label="³He" color="bg-pink-500" text="text-white" />
                    <Arrow/>
                    <Particle label="⁴He" color="bg-red-500" text="text-white" />
                </div>
                 <p className="text-center text-gray-400">Result: Stable Helium-4</p>
            </div>
        </div>
    );
};

const ThermometerVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
        <div className="relative w-8 h-32 bg-gray-700 rounded-full border-2 border-gray-600 overflow-hidden">
             <div className="absolute bottom-0 w-full bg-red-500 animate-temp-drop"></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-red-500 border-2 border-gray-600 -mb-2"></div>
             {/* Marks */}
             <div className="absolute right-0 top-4 w-2 h-0.5 bg-gray-400"></div>
             <div className="absolute right-0 top-10 w-2 h-0.5 bg-gray-400"></div>
             <div className="absolute right-0 top-16 w-2 h-0.5 bg-gray-400"></div>
             <div className="absolute right-0 top-22 w-2 h-0.5 bg-gray-400"></div>
        </div>
        <style>{`
            @keyframes temp-drop { from { height: 90%; background-color: #ef4444; } to { height: 20%; background-color: #3b82f6; } }
            .animate-temp-drop { animation: temp-drop 10s ease-in-out infinite alternate; }
        `}</style>
    </div>
);

const BarrierVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
        <svg viewBox="0 0 100 60" className="w-full h-full">
             <circle cx="20" cy="30" r="8" fill="#3b82f6" />
             <circle cx="80" cy="30" r="8" fill="#3b82f6" />
             <path d="M 28 30 Q 50 30, 72 30" stroke="yellow" strokeWidth="2" strokeDasharray="4 2" fill="none" className="opacity-50" />
             
             {/* Repulsion effect */}
             <path d="M 28 30 Q 45 30, 40 10" stroke="white" strokeWidth="1.5" markerEnd="url(#arrowhead-w)" className="animate-deflect"/>
             <path d="M 72 30 Q 55 30, 60 50" stroke="white" strokeWidth="1.5" markerEnd="url(#arrowhead-w)" className="animate-deflect-2"/>

              <defs>
                 <marker id="arrowhead-w" markerWidth="5" markerHeight="3.5" refX="0" refY="1.75" orient="auto">
                    <polygon points="0 0, 5 1.75, 0 3.5" fill="white" />
                </marker>
            </defs>
        </svg>
        <style>{`
            @keyframes deflect { 0% { stroke-opacity: 1; opacity: 1; } 100% { stroke-opacity: 0; opacity: 0; } }
            .animate-deflect { animation: deflect 1.5s ease-out infinite; }
            .animate-deflect-2 { animation: deflect 1.5s ease-out infinite; animation-delay: 0.1s; }
        `}</style>
    </div>
);

const NucleosynthesisDisplay: React.FC<{ law: CosmicLaw, onClose: () => void }> = ({ law, onClose }) => {
  const [progress, setProgress] = useState(100);
  const AUTO_CLOSE_DURATION = 45000;

  useEffect(() => {
    const autoCloseTimer = setTimeout(onClose, AUTO_CLOSE_DURATION);
    const progressInterval = setInterval(() => {
      setProgress(p => Math.max(0, p - (100 / (AUTO_CLOSE_DURATION / 100))));
    }, 100);

    return () => { clearTimeout(autoCloseTimer); clearInterval(progressInterval); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/98 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-[95vw] h-full flex flex-col text-white">
        <header className="text-center py-2 border-b-2 border-pink-500/30 flex-shrink-0 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-300 drop-shadow-lg">{law.title}</h1>
          <p className="text-gray-400 text-base mt-1">The Origin of Elements</p>
        </header>
        
        <main className="flex-grow overflow-hidden p-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
          
          {/* Col 1: Cosmic Cooling (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-blue-400 uppercase tracking-wide">The First 3 Minutes</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    The early universe was a race against time. At first, it was too hot for atomic nuclei to hold together; the intense energy would blast them apart instantly.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    As the universe expanded, it cooled. For a brief window of about 20 minutes, the temperature was "just right" for protons and neutrons to fuse.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    Then, the expansion cooled it further, halting fusion entirely. This "freeze-out" left the universe with 75% Hydrogen and 25% Helium, a ratio we still observe today.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <ThermometerVisual />
             </div>
          </div>

          {/* Col 2: Context (Standard) */}
          <div className="flex flex-col space-y-3 justify-between bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left">
            <div className="p-3 bg-black/30 rounded-lg border border-gray-700 shadow-lg">
              <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">The Cosmic Forge</h2>
              <p className="text-gray-300 text-xs sm:text-sm">{law.explanation}</p>
            </div>
            <div className="p-3 bg-black/30 rounded-lg border border-gray-700 flex-grow">
              <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">Implication</h2>
              <p className="text-gray-300 text-[10px] leading-relaxed">The universe is no longer just a sea of basic particles. The first complex atomic nuclei are being forged, paving the way for the first stars and the elements of life.</p>
            </div>
             <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
              <p className="text-base italic text-center text-pink-300">"In the heart of a star, the elements of life are born."</p>
            </div>
          </div>
          
          {/* Col 3: Center Viz (Standard) */}
          <div className="flex flex-col items-center justify-center h-full bg-black/30 p-2 rounded-xl border border-pink-500/20 shadow-[0_0_30px_-10px_rgba(236,72,153,0.1)]">
            <NucleosynthesisVisualization />
          </div>

          {/* Col 4: Diagram (Standard) */}
          <div className="flex flex-col justify-around bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right">
            <ProtonProtonChainDiagram />
          </div>

          {/* Col 5: Coulomb Barrier (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-yellow-400 uppercase tracking-wide">The Coulomb Barrier</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    Fusing atoms is incredibly difficult. Protons are positively charged and repel each other with increasing force as they get closer. This is the <strong>Coulomb Barrier</strong>.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    To overcome this, particles must smash together at phenomenal speeds (high temperatures) and rely on a quantum phenomenon called "Tunneling" to cheat their way through the electric wall.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <BarrierVisual />
             </div>
          </div>

        </main>
        
        <footer className="w-full py-3 flex-shrink-0 mt-2">
          <div className="max-w-md mx-auto text-center">
            <button onClick={onClose} className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Continue Journey</button>
            <div className="relative w-full bg-gray-700/50 rounded-full h-1 mt-3 overflow-hidden border border-gray-600">
              <div className="bg-pink-400 h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 100ms linear' }}/>
            </div>
          </div>
        </footer>
      </div>
       <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
          @keyframes slide-in-left { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
          .animate-slide-in-left { animation: slide-in-left 0.6s ease-out forwards; }
          @keyframes slide-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .animate-slide-in-right { animation: slide-in-right 0.6s ease-out forwards; }
          /* Custom Scrollbar for text areas */
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.3); border-radius: 2px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(236, 72, 153, 0.5); }
      `}</style>
    </div>
  );
};

export default NucleosynthesisDisplay;
