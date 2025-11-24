
import React, { useState, useEffect } from 'react';
import { CosmicLaw } from '../types';

const EnergyMassConversionVisualization: React.FC = () => {
    const particleTops = React.useMemo(() => 
        [...Array(10)].map(() => Math.random() * 80 + 10)
    , []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner shadow-black/40">
            <div className="relative w-full h-32 bg-black/30 rounded-md overflow-hidden flex items-center justify-center border border-gray-700">
                <span className="absolute left-4 text-2xl font-bold text-yellow-300 animate-pulse">E</span>
                <span className="absolute right-4 text-2xl font-bold text-cyan-300 animate-pulse" style={{ animationDelay: '1.5s' }}>m</span>
                <div className="absolute w-1 h-16 bg-white/50 rounded-full animate-pulse-fast"></div>
                {particleTops.map((top, i) => (
                    <div key={`energy-${i}`} className="absolute w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_2px_theme(colors.yellow.300)] animate-energy-flow"
                         style={{ animationDelay: `${i * 0.3}s`, top: `${top}%` }}/>
                ))}
                {particleTops.map((top, i) => (
                    <div key={`mass-${i}`} className="absolute w-3 h-3 rounded-full bg-cyan-400 animate-mass-flow"
                         style={{ animationDelay: `${i * 0.3}s`, top: `${top}%` }}/>
                ))}
            </div>
             <style>{`
                @keyframes pulse-fast { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
                .animate-pulse-fast { animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes energy-flow { 0% { left: -5%; transform: scale(0.5); opacity: 0; } 40% { transform: scale(1); opacity: 1; } 50% { left: 49%; transform: scale(0); opacity: 0; } 100% { left: 49%; opacity: 0; } }
                .animate-energy-flow { animation: energy-flow 3s linear infinite; }
                @keyframes mass-flow { 0%, 50% { left: 51%; opacity: 0; } 51% { left: 51%; transform: scale(0); opacity: 0; } 90% { transform: scale(1); opacity: 1; } 100% { left: 105%; transform: scale(0.5); opacity: 0; } }
                .animate-mass-flow { animation: mass-flow 3s linear infinite; }
            `}</style>
        </div>
    );
};

const ScaleVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
        <svg viewBox="0 0 100 50" className="w-full h-full">
            <path d="M 10 40 L 90 40 M 50 40 L 50 10" stroke="#9ca3af" strokeWidth="2" />
            <path d="M 10 40 L 30 40 L 20 45 Z" fill="#9ca3af" /> 
            <path d="M 90 40 L 70 40 L 80 45 Z" fill="#9ca3af" />
            <circle cx="20" cy="30" r="8" fill="#facc15" className="animate-bounce" style={{ animationDuration: '2s' }} />
            <text x="20" y="34" fontSize="10" textAnchor="middle" fill="black" fontWeight="bold">E</text>
            <rect x="72" y="22" width="16" height="16" fill="#22d3ee" className="animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }} />
            <text x="80" y="34" fontSize="10" textAnchor="middle" fill="black" fontWeight="bold">m</text>
        </svg>
    </div>
);

const SunAtomVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
        <svg viewBox="0 0 100 100" className="h-full aspect-square">
             <circle cx="50" cy="50" r="20" fill="#facc15" className="shadow-[0_0_20px_10px_theme(colors.yellow.500)]" />
             <circle cx="50" cy="50" r="35" stroke="#facc15" strokeWidth="1" strokeDasharray="2 2" fill="none" className="animate-spin-slow" />
             <circle cx="50" cy="50" r="45" stroke="#facc15" strokeWidth="1" strokeDasharray="2 2" fill="none" className="animate-spin-slow-reverse" />
        </svg>
    </div>
);

const MassEnergyEquivalenceDisplay: React.FC<{ law: CosmicLaw, onClose: () => void }> = ({ law, onClose }) => {
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
        <header className="text-center py-2 border-b-2 border-yellow-500/30 flex-shrink-0 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300 drop-shadow-lg">{law.title}</h1>
          <p className="text-gray-400 text-base mt-1">The Currency of the Cosmos</p>
        </header>
        
        <main className="flex-grow overflow-hidden p-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
          
          {/* Col 1: Special Relativity (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-cyan-300 uppercase tracking-wide">Special Relativity</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    In 1905, Einstein published a paper that changed physics forever. He realized that mass is not a fixed property of matter, but rather a form of super-concentrated energy.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    Just as ice is "frozen water," mass is "frozen energy." The conversion factor is <strong>c²</strong> (the speed of light squared), which is an enormous number (9 × 10¹⁶ m²/s²).
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    This means a tiny grain of sand contains enough potential energy to power a city, if only we could unlock it.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <ScaleVisual />
             </div>
          </div>

          {/* Col 2: The Math (Standard) */}
          <div className="flex flex-col space-y-3 justify-between bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left">
            <div className="p-3 bg-black/30 rounded-lg border border-gray-700 shadow-lg">
              <h2 className="text-sm font-semibold text-cyan-300 mb-1 uppercase">The Equation</h2>
              <p className="text-xl font-mono text-center py-2 text-white tracking-wider bg-gray-900/50 rounded border border-gray-800">{law.formula}</p>
            </div>
            <div className="p-3 bg-black/30 rounded-lg border border-gray-700 flex-grow">
              <h2 className="text-sm font-semibold text-cyan-300 mb-1 uppercase">Definitions</h2>
              <ul className="text-gray-300 space-y-2 text-xs">
                <li className="flex items-center"><span className="w-6 font-bold text-yellow-300 text-right mr-2">E</span> Energy (Joules)</li>
                <li className="flex items-center"><span className="w-6 font-bold text-cyan-300 text-right mr-2">m</span> Mass (kg)</li>
                <li className="flex items-center"><span className="w-6 font-bold text-gray-300 text-right mr-2">c</span> Speed of Light</li>
              </ul>
            </div>
             <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
                <h2 className="text-sm font-semibold text-cyan-300 mb-1 uppercase">Simplified</h2>
                <p className="text-gray-400 text-[10px] leading-tight">{law.explanation}</p>
            </div>
          </div>
          
          {/* Col 3: Center Viz (Standard) */}
          <div className="flex flex-col items-center justify-center h-full bg-black/30 p-2 rounded-xl border border-yellow-500/20 shadow-[0_0_30px_-10px_rgba(250,204,21,0.1)]">
            <EnergyMassConversionVisualization />
             <p className="mt-3 text-xs text-center text-yellow-200/70 italic">
                "Matter is energy condensed to a slow vibration."
            </p>
          </div>

          {/* Col 4: Context (Standard) */}
          <div className="flex flex-col space-y-3 bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right">
             <div className="flex-grow flex flex-col p-1 rounded-lg border border-gray-700 bg-gray-900 overflow-hidden relative">
               <h2 className="absolute top-2 left-2 text-sm font-bold text-yellow-300 z-10 bg-black/50 px-2 rounded">Primordial Soup</h2>
                <div className="flex-grow w-full primordial-soup-bg rounded-md opacity-80"></div>
                <div className="p-2 bg-gray-900 text-xs text-gray-400 border-t border-gray-800">
                     In the early universe, temperatures were so high that matter and energy were indistinguishable.
                </div>
             </div>
             <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
                 <h2 className="text-sm font-semibold text-cyan-300 mb-1 uppercase">Implication</h2>
                 <p className="text-gray-300 text-xs leading-relaxed">Particles were created from pure energy and annihilated back into it constantly, setting the stage for all matter to come.</p>
             </div>
          </div>

          {/* Col 5: Nuclear Power (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-yellow-400 uppercase tracking-wide">Stellar Engines</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    This equation explains why the sun shines. In the core of a star, hydrogen atoms fuse into helium. The resulting helium is slightly <em>lighter</em> than the ingredients that made it.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    Where did the missing mass go? It was converted into pure light and heat, following <strong>E=mc²</strong>.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    This tiny loss of mass releases the titanic amounts of energy that sustain life on Earth and light up the galaxy.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <SunAtomVisual />
             </div>
          </div>

        </main>
        
        <footer className="w-full py-3 flex-shrink-0 mt-2">
          <div className="max-w-md mx-auto text-center">
            <button onClick={onClose} className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Continue Journey</button>
            <div className="relative w-full bg-gray-700/50 rounded-full h-1 mt-3 overflow-hidden border border-gray-600">
              <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 100ms linear' }} />
            </div>
          </div>
        </footer>
      </div>
       <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
           @keyframes slide-in-left {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-slide-in-left {
            animation: slide-in-left 0.6s ease-out forwards;
          }
           @keyframes slide-in-right {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.6s ease-out forwards;
          }
           /* Custom Scrollbar for text areas */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(250, 204, 21, 0.3);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(250, 204, 21, 0.5);
          }
          .primordial-soup-bg {
            background-image:
              radial-gradient(circle at 15% 80%, rgba(250, 204, 21, 0.15) 0%, transparent 25%),
              radial-gradient(circle at 85% 30%, rgba(34, 211, 238, 0.15) 0%, transparent 25%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 15%);
            background-color: #111827;
            background-size: 4em 4em;
          }
      `}</style>
    </div>
  );
};

export default MassEnergyEquivalenceDisplay;
