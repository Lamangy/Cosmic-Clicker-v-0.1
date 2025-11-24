
import React, { useState, useEffect } from 'react';
import { CosmicLaw } from '../types';

const UncertaintyVisualization: React.FC = () => {
  const [focus, setFocus] = useState<'position' | 'momentum'>('position');

  useEffect(() => {
    const interval = setInterval(() => {
      setFocus(f => (f === 'position' ? 'momentum' : 'position'));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isPositionFocused = focus === 'position';

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner shadow-black/40">
      {/* Particle Visualization */}
      <div className="flex flex-col w-full h-full space-y-4">
        {/* Position */}
        <div className={`flex-1 flex flex-col items-center justify-center p-2 rounded transition-colors duration-500 ${isPositionFocused ? 'bg-gray-800/50' : ''}`}>
          <h3 className={`text-sm font-semibold mb-1 transition-colors duration-500 ${isPositionFocused ? 'text-cyan-300' : 'text-gray-500'}`}>Position (Δx)</h3>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-black/40 rounded-md overflow-hidden flex items-center justify-center border border-gray-700">
            <div className={`absolute rounded-full bg-cyan-400 transition-all duration-1000 ease-in-out ${isPositionFocused ? 'w-2 h-2 shadow-[0_0_15px_3px_theme(colors.cyan.300)]' : 'w-full h-full blur-md opacity-20'}`}></div>
          </div>
          <p className={`text-xs mt-1 font-bold transition-opacity duration-500 ${isPositionFocused ? 'opacity-100 text-green-400' : 'opacity-40 text-gray-500'}`}>{isPositionFocused ? 'Precise' : 'Unknown'}</p>
        </div>
        
        {/* Momentum */}
        <div className={`flex-1 flex flex-col items-center justify-center p-2 rounded transition-colors duration-500 ${!isPositionFocused ? 'bg-gray-800/50' : ''}`}>
          <h3 className={`text-sm font-semibold mb-1 transition-colors duration-500 ${!isPositionFocused ? 'text-purple-300' : 'text-gray-500'}`}>Momentum (Δp)</h3>
           <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-black/40 rounded-md overflow-hidden flex items-center justify-center border border-gray-700">
            {/* Represents a wave packet when momentum is known */}
             <svg className={`absolute transition-all duration-1000 ease-in-out ${!isPositionFocused ? 'opacity-100 scale-100' : 'opacity-20 scale-150 blur-sm'}`} viewBox="0 0 100 50">
                <path d="M0 25 Q 10 5, 20 25 T 40 25 T 60 25 T 80 25 T 100 25" fill="none" stroke="#d8b4fe" strokeWidth="3" />
             </svg>
          </div>
          <p className={`text-xs mt-1 font-bold transition-opacity duration-500 ${!isPositionFocused ? 'opacity-100 text-green-400' : 'opacity-40 text-gray-500'}`}>{!isPositionFocused ? 'Precise' : 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
};

const WavePacketVisual: React.FC = () => (
  <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
    <svg viewBox="0 0 100 40" className="w-full h-full">
        <path d="M 5 20 Q 20 5, 35 20 T 65 20 T 95 20" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="opacity-30" />
        <path d="M 25 20 Q 35 5, 45 20 Q 55 35, 65 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="45" cy="20" r="2" fill="#22d3ee" className="animate-pulse" />
    </svg>
  </div>
);

const BrokenClockVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
        <svg viewBox="0 0 100 100" className="h-full aspect-square text-red-400/80">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
            <path d="M 50 50 L 50 25" stroke="currentColor" strokeWidth="2" />
            <path d="M 50 50 L 70 65" stroke="currentColor" strokeWidth="2" />
            <path d="M 20 25 L 80 75" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="3" fill="#f87171" />
        </svg>
    </div>
)

const HeisenbergLawDisplay: React.FC<{ law: CosmicLaw, onClose: () => void }> = ({ law, onClose }) => {
  const [progress, setProgress] = useState(100);
  const AUTO_CLOSE_DURATION = 45000;

  useEffect(() => {
    const autoCloseTimer = setTimeout(onClose, AUTO_CLOSE_DURATION);
    const progressInterval = setInterval(() => {
      setProgress(p => Math.max(0, p - (100 / (AUTO_CLOSE_DURATION / 100))));
    }, 100);

    return () => {
      clearTimeout(autoCloseTimer);
      clearInterval(progressInterval);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/98 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-[95vw] h-full flex flex-col text-white">
        <header className="text-center py-2 border-b-2 border-cyan-500/30 flex-shrink-0 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 drop-shadow-lg">
            {law.title}
          </h1>
          <p className="text-gray-400 text-base mt-1">The Birth of the Quantum World</p>
        </header>
        
        <main className="flex-grow overflow-hidden p-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
            
            {/* Column 1: Wave-Particle Duality (80% Text, 20% Image) */}
            <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                 <div className="border-b border-gray-700 pb-2 mb-2">
                    <h2 className="text-base font-bold text-cyan-300 uppercase tracking-wide">Wave Mechanics</h2>
                 </div>
                 <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                    <p className="text-xs text-gray-300 leading-relaxed">
                        In the classical world of everyday objects, a particle is like a marble: it has an exact location and moves at an exact speed. But in the quantum realm, matter exhibits <strong>Wave-Particle Duality</strong>.
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">
                         A "particle" is actually a localized <strong>Wave Packet</strong>—a ripple in the underlying quantum field. This wave doesn't tell us where the particle <em>is</em>, but the probability of finding it there.
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        To define the position (x) precisely, you must squeeze this wave into a tiny region. But waves have a fundamental property: the shorter the pulse, the broader the spread of frequencies required to create it.
                    </p>
                     <p className="text-xs text-gray-300 leading-relaxed">
                        Since momentum (p) is directly related to wavelength, confining a particle's position forces its momentum to become completely undefined. This trade-off is not a measurement error; it is the blurry resolution of reality itself.
                    </p>
                 </div>
                 <div className="h-[20%] min-h-[60px] mt-2">
                    <WavePacketVisual />
                 </div>
            </div>

            {/* Column 2: The Math (Standard) */}
            <div className="flex flex-col space-y-3 justify-between bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left">
                <div className="p-3 bg-black/30 rounded-lg border border-gray-700 shadow-lg">
                    <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">The Equation</h2>
                    <p className="text-xl font-mono text-center py-2 text-white tracking-wider bg-gray-900/50 rounded border border-gray-800">{law.formula}</p>
                </div>
                <div className="p-3 bg-black/30 rounded-lg border border-gray-700 flex-grow">
                    <h2 className="text-sm font-semibold text-yellow-300 mb-2 uppercase">Definitions</h2>
                    <ul className="text-gray-300 space-y-2 text-xs">
                        <li className="flex items-center"><span className="w-6 font-bold text-cyan-300 text-right mr-2">Δx</span> Position Uncertainty</li>
                        <li className="flex items-center"><span className="w-6 font-bold text-purple-300 text-right mr-2">Δp</span> Momentum Uncertainty</li>
                        <li className="flex items-center"><span className="w-6 font-bold text-gray-300 text-right mr-2">ħ</span> Reduced Planck Constant</li>
                    </ul>
                </div>
                <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
                    <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">History</h2>
                    <p className="text-gray-400 text-[10px] leading-tight">Discovered by Werner Heisenberg in 1927, fundamentally changing our understanding of physics.</p>
                </div>
            </div>

            {/* Column 3: Center Animation (Standard) */}
            <div className="flex flex-col items-center justify-center h-full bg-black/30 p-2 rounded-xl border border-cyan-500/20 shadow-[0_0_30px_-10px_rgba(6,182,212,0.1)]">
                <UncertaintyVisualization />
                <p className="mt-3 text-xs text-center text-cyan-200/70 italic">
                    "The more precisely the position is determined, the less precisely the momentum is known."
                </p>
            </div>

            {/* Column 4: Quantum Foam (Standard) */}
            <div className="flex flex-col space-y-3 bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right">
                 <div className="flex-grow flex flex-col p-1 rounded-lg border border-gray-700 bg-gray-900 overflow-hidden relative">
                   <h2 className="absolute top-2 left-2 text-sm font-bold text-yellow-300 z-10 bg-black/50 px-2 rounded">Quantum Foam</h2>
                    <div className="flex-grow w-full quantum-foam-bg opacity-80"></div>
                    <div className="p-2 bg-gray-900 text-xs text-gray-400 border-t border-gray-800">
                        Empty space isn't empty. It's a boiling soup of virtual particles appearing and vanishing.
                    </div>
                 </div>
                 <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
                     <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">Gamification</h2>
                     <p className="text-gray-300 text-xs leading-relaxed">
                        Understanding this unlocks <strong>Probability Manipulation</strong> upgrades in the next epoch.
                     </p>
                 </div>
            </div>

            {/* Column 5: Consequences (80% Text, 20% Image) */}
             <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
                 <div className="border-b border-gray-700 pb-2 mb-2">
                    <h2 className="text-base font-bold text-red-400 uppercase tracking-wide">Death of Determinism</h2>
                 </div>
                 <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                     <p className="text-xs text-gray-300 leading-relaxed">
                        For centuries, physics was viewed as a "clockwork universe". It was believed that if a super-intellect (Laplace's Demon) knew the position and velocity of every particle in the cosmos, it could calculate the entire future with absolute certainty.
                     </p>
                     <p className="text-xs text-gray-300 leading-relaxed">
                        Heisenberg shattered this clock. Since we fundamentally cannot know the exact state of the present (both position and momentum), the future cannot be strictly calculated.
                     </p>
                     <p className="text-xs text-gray-300 leading-relaxed">
                        The universe is not a machine running on rigid rails; it is a game of chance governed by <strong>Probabilities</strong>. Causality still exists, but it applies to the evolution of statistical likelihoods, not specific events.
                     </p>
                     <p className="text-xs text-gray-300 leading-relaxed">
                        At its core, nature is fuzzy. Electrons don't orbit in neat paths; they exist in clouds of potential until they interact.
                     </p>
                 </div>
                 <div className="h-[20%] min-h-[60px] mt-2">
                    <BrokenClockVisual />
                 </div>
            </div>

        </main>
        
        <footer className="w-full py-3 flex-shrink-0 mt-2">
          <div className="max-w-md mx-auto text-center">
            <button
              onClick={onClose}
              className="w-full px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Accept the Uncertainty
            </button>
            <div className="relative w-full bg-gray-700/50 rounded-full h-1 mt-3 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
              />
            </div>
          </div>
        </footer>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
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

          .quantum-foam-bg {
            background-image:
              radial-gradient(circle at 10% 20%, rgba(103, 232, 249, 0.15) 0%, transparent 20%),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 20%),
              radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 15%),
              radial-gradient(circle at 70% 10%, rgba(250, 204, 21, 0.05) 0%, transparent 10%);
            background-color: #0f172a;
            background-size: 3em 3em;
            animation: foam-shift 10s linear infinite;
          }
          @keyframes foam-shift {
            from { background-position: 0 0; }
            to { background-position: 3em 3em; }
          }
          
          /* Custom Scrollbar for text areas */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(34, 211, 238, 0.3);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(34, 211, 238, 0.5);
          }
      `}</style>
    </div>
  );
};

export default HeisenbergLawDisplay;
