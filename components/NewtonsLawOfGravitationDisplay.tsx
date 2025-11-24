
import React, { useState, useEffect } from 'react';
import { CosmicLaw } from '../types';

const GravitationalAttractionVisualization: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner shadow-black/40">
             <h3 className="text-xl font-semibold mb-4 text-gray-300">The Architect of Galaxies</h3>
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
                <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black shadow-[0_0_20px_10px_theme(colors.purple.500/0.7),_inset_0_0_10px_2px_theme(colors.black)]"></div>
                <div className="absolute w-full h-full rounded-full border-2 border-dashed border-gray-700 animate-spin-slow-reverse"></div>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute w-1 h-1 rounded-full bg-gray-400 animate-particle-infall" style={{ animationDelay: `${i * 0.25}s` }}></div>
                ))}
                <div className="absolute w-full h-full animate-galaxy-orbit">
                    <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 rounded-full bg-yellow-300 shadow-particle"></div>
                </div>
            </div>
             <style>{`
                .shadow-particle { box-shadow: 0 0 10px 2px currentColor; }
                @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                .animate-spin-slow-reverse { animation: spin-slow-reverse 40s linear infinite; }
                @keyframes particle-infall-kf { 0% { --angle: ${Math.random() * 360}deg; --radius: ${120 + Math.random() * 30}px; transform: rotate(var(--angle)) translateX(var(--radius)) scale(1); opacity: 1; } 100% { --angle: ${Math.random() * 360 + 360}deg; transform: rotate(var(--angle)) translateX(15px) scale(0); opacity: 0; } }
                .animate-particle-infall { transform-origin: center; animation: particle-infall-kf 5s ease-in infinite; }
                @keyframes galaxy-orbit-kf { from { transform: rotate(0deg) scaleX(0.7) rotate(0deg); } to { transform: rotate(360deg) scaleX(0.7) rotate(-360deg); } }
                .animate-galaxy-orbit { animation: galaxy-orbit-kf 12s linear infinite; }
            `}</style>
        </div>
    );
};

const GravityDiagram: React.FC = () => {
    return (
        <div className="w-full flex-grow flex flex-col justify-center items-center p-3 rounded-lg bg-gray-900/50 border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 text-center uppercase">The Variables of Gravity</h2>
             <svg viewBox="0 0 200 100" className="w-full">
                <defs>
                    <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="0" refY="1.75" orient="auto">
                        <polygon points="0 0, 5 1.75, 0 3.5" fill="white" />
                    </marker>
                </defs>
                <circle cx="50" cy="50" r="20" fill="#60a5fa" />
                <text x="50" y="55" textAnchor="middle" fill="white" fontWeight="bold">m₁</text>
                 <circle cx="150" cy="50" r="12" fill="#a78bfa" />
                <text x="150" y="55" textAnchor="middle" fill="white" fontWeight="bold">m₂</text>
                <line x1="50" y1="75" x2="150" y2="75" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="50" y1="70" x2="50" y2="80" stroke="white" strokeWidth="1" />
                <line x1="150" y1="70" x2="150" y2="80" stroke="white" strokeWidth="1" />
                <text x="100" y="90" textAnchor="middle" fill="white" fontSize="12">r (distance)</text>
                <line x1="72" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
                <text x="86" y="45" textAnchor="middle" fill="white" fontSize="10">F</text>
                <line x1="136" y1="50" x2="108" y2="50" stroke="white" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
                <text x="122" y="45" textAnchor="middle" fill="white" fontSize="10">F</text>
            </svg>
             <p className="text-xs text-center text-gray-400 mt-2">Force decreases with distance squared (r²)</p>
        </div>
    )
}

const EarthAppleVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2 overflow-hidden">
         <svg viewBox="0 0 100 60" className="w-full h-full">
             <circle cx="50" cy="120" r="80" fill="#0ea5e9" />
             <path d="M 50 40 L 50 120" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
             <circle cx="50" cy="15" r="3" fill="#ef4444" className="animate-drop"/>
             <circle cx="85" cy="30" r="5" fill="#d1d5db" />
             <path d="M 85 30 Q 60 80, 50 120" stroke="white" strokeWidth="1" fill="none" strokeDasharray="2 2" opacity="0.3" />
         </svg>
         <style>{`
            @keyframes drop { 0% { cy: 15; opacity: 1; } 80% { cy: 40; opacity: 1; } 100% { cy: 40; opacity: 0; } }
            .animate-drop { animation: drop 2s ease-in infinite; }
         `}</style>
    </div>
);

const TidalVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
        <svg viewBox="0 0 100 60" className="w-full h-full">
             <ellipse cx="30" cy="30" rx="22" ry="15" fill="#3b82f6" opacity="0.5" />
             <circle cx="30" cy="30" r="12" fill="#0ea5e9" />
             <circle cx="80" cy="30" r="8" fill="#d1d5db" />
             <path d="M 80 30 L 30 30" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
        </svg>
    </div>
);

const NewtonsLawOfGravitationDisplay: React.FC<{ law: CosmicLaw, onClose: () => void }> = ({ law, onClose }) => {
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
        <header className="text-center py-2 border-b-2 border-gray-500/30 flex-shrink-0 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-300 drop-shadow-lg">
            {law.title}
          </h1>
        </header>
        
        <main className="flex-grow overflow-hidden p-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
          
          {/* Col 1: Unification (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-blue-400 uppercase tracking-wide">The Universal Law</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    Before Newton, people believed the laws of Earth and the laws of Heaven were different.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    Newton's genius was to realize that the force pulling an apple to the ground is the <em>exact same force</em> that keeps the Moon falling around the Earth.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    This was the first great <strong>Unification</strong> in physics, showing that the cosmos follows the same rules as our own backyard.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <EarthAppleVisual />
             </div>
          </div>

          {/* Col 2: Math (Standard) */}
          <div className="flex flex-col space-y-3 justify-between bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left">
             <div className="p-3 bg-black/30 rounded-lg border border-gray-700 shadow-lg">
              <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">The Architect</h2>
              <p className="text-2xl font-mono text-center py-2 text-white tracking-wider">{law.formula}</p>
            </div>
            <div className="p-3 bg-black/30 rounded-lg border border-gray-700 flex-grow">
              <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">Definitions</h2>
               <ul className="text-gray-300 space-y-1 text-xs">
                <li><strong>F</strong>: <strong className="text-cyan-300">Force</strong> of Gravity.</li>
                <li><strong>G</strong>: <strong className="text-gray-300">Constant</strong> (6.674×10⁻¹¹).</li>
                <li><strong>m</strong>: <strong className="text-cyan-300">Masses</strong> of objects.</li>
                <li><strong>r²</strong>: <strong className="text-orange-300">Distance</strong> squared.</li>
              </ul>
            </div>
             <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
              <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">Simplified</h2>
              <p className="text-gray-300 text-[10px] leading-tight">{law.explanation}</p>
            </div>
          </div>
          
          {/* Col 3: Center Viz (Standard) */}
          <div className="flex flex-col items-center justify-center h-full bg-black/30 p-2 rounded-xl border border-purple-500/20 shadow-[0_0_30px_-10px_rgba(168,85,247,0.1)]">
            <GravitationalAttractionVisualization />
          </div>

          {/* Col 4: Diagram (Standard) */}
          <div className="flex flex-col justify-around bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right">
            <GravityDiagram />
            <div className="p-3 mt-4 bg-black/30 rounded-lg border border-gray-700">
                 <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">Implication</h2>
                 <p className="text-gray-300 text-xs">This fundamental force begins to dominate the cosmic landscape, pulling matter together to form the first vast, swirling star cities we call galaxies.</p>
             </div>
          </div>

          {/* Col 5: Tides (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-blue-300 uppercase tracking-wide">Tides & Structure</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    Gravity doesn't just pull; it stretches. The difference in gravitational pull on the near and far side of a body creates <strong>Tidal Forces</strong>.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    These forces raise tides in Earth's oceans and can even tear smaller galaxies apart if they venture too close to massive ones.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    On the largest scales, gravity pulls gas into filaments, forming the "Cosmic Web" that connects the universe.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <TidalVisual />
             </div>
          </div>

        </main>
        
        <footer className="w-full py-3 flex-shrink-0 mt-2">
          <div className="max-w-md mx-auto text-center">
            <button onClick={onClose} className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Continue Journey</button>
            <div className="relative w-full bg-gray-700/50 rounded-full h-1 mt-3 overflow-hidden border border-gray-600">
              <div className="bg-gray-400 h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 100ms linear' }}/>
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
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 2px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
      `}</style>
    </div>
  );
};

export default NewtonsLawOfGravitationDisplay;
