
import React, { useState, useEffect } from 'react';
import { CosmicLaw } from '../types';

const OrbitalMotionVisualization: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner shadow-black/40">
             <h3 className="text-xl font-semibold mb-4 text-orange-300">Planetary Motion</h3>
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
                <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-400 shadow-[0_0_20px_8px_theme(colors.yellow.400),_0_0_40px_20px_theme(colors.yellow.500/0.5)]"></div>
                <div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-gray-600 animate-planet-orbit-inner">
                    <div className="absolute top-1/2 left-0 -mt-2 -ml-2 w-4 h-4 rounded-full bg-blue-400 shadow-particle"></div>
                </div>
                <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-gray-600 animate-planet-orbit-outer">
                    <div className="absolute top-1/2 left-0 -mt-2.5 -ml-2.5 w-5 h-5 rounded-full bg-red-400 shadow-particle"></div>
                </div>
            </div>
             <style>{`
                .shadow-particle { box-shadow: 0 0 10px 2px currentColor; }
                @keyframes orbit-inner-kf { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-planet-orbit-inner { animation: orbit-inner-kf 8s linear infinite; }
                @keyframes orbit-outer-kf { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-planet-orbit-outer { animation: orbit-outer-kf 15s linear infinite; }
            `}</style>
        </div>
    );
};

const OrbitDiagram: React.FC = () => {
    return (
        <div className="w-full flex-grow flex flex-col justify-center items-center p-3 rounded-lg bg-gray-900/50 border border-gray-700">
            <h2 className="text-sm font-semibold text-orange-300 mb-2 text-center uppercase">Anatomy of an Orbit</h2>
             <svg viewBox="0 0 200 120" className="w-full">
                <ellipse cx="100" cy="60" rx="90" ry="40" stroke="#6b7280" strokeWidth="2" fill="none" strokeDasharray="4"/>
                <circle cx="45" cy="60" r="8" fill="#facc15"/>
                <circle cx="165" cy="88" r="5" fill="#60a5fa"/>
                <line x1="10" y1="60" x2="190" y2="60" stroke="#f97316" strokeWidth="1.5" />
                <text x="100" y="55" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="bold">a (semi-major axis)</text>
            </svg>
            <p className="text-xs text-center text-gray-400 mt-2">The distance from the star (a) determines the length of the year (P).</p>
        </div>
    )
}

const EllipseVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
         <svg viewBox="0 0 100 60" className="w-full h-full">
             <ellipse cx="50" cy="30" rx="45" ry="25" stroke="white" strokeWidth="1.5" fill="none" />
             <circle cx="25" cy="30" r="3" fill="#facc15" />
             <circle cx="75" cy="30" r="2" fill="#4b5563" />
             <text x="25" y="40" textAnchor="middle" fill="#facc15" fontSize="8">Focus 1</text>
             <text x="75" y="40" textAnchor="middle" fill="#9ca3af" fontSize="8">Focus 2</text>
         </svg>
    </div>
);

const GearsVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2 relative overflow-hidden">
        <svg viewBox="0 0 100 100" className="absolute w-24 h-24 text-gray-600 animate-spin-slow">
            <path d="M50 10 L50 0 M50 90 L50 100 M10 50 L0 50 M90 50 L100 50" stroke="currentColor" strokeWidth="10" />
             <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="8" strokeDasharray="10 5" fill="none" />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute w-16 h-16 text-orange-500/50 animate-spin-reverse left-2 top-2">
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="8" strokeDasharray="10 5" fill="none" />
        </svg>
        <style>{`
            @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-spin-slow { animation: spin-slow 10s linear infinite; }
            @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
            .animate-spin-reverse { animation: spin-reverse 8s linear infinite; }
        `}</style>
    </div>
);

const KeplersThirdLawDisplay: React.FC<{ law: CosmicLaw, onClose: () => void }> = ({ law, onClose }) => {
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
        <header className="text-center py-2 border-b-2 border-orange-500/30 flex-shrink-0 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-300 drop-shadow-lg">{law.title}</h1>
          <p className="text-gray-400 text-base mt-1">The Music of the Spheres</p>
        </header>
        
        <main className="flex-grow overflow-hidden p-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
          
          {/* Col 1: Breaking the Circle (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-yellow-300 uppercase tracking-wide">Breaking the Circle</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    For millennia, astronomers believed celestial bodies moved in perfect circles. Johannes Kepler, analyzing the meticulous data of Tycho Brahe, broke this dogma.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    He discovered that planets orbit in <strong>Ellipses</strong>, with the star at one focus and empty space at the other.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                    This was a revolutionary step away from mystical geometry towards physical reality.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <EllipseVisual />
             </div>
          </div>

          {/* Col 2: Math (Standard) */}
          <div className="flex flex-col space-y-3 justify-between bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left">
             <div className="p-3 bg-black/30 rounded-lg border border-gray-700 shadow-lg">
              <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">The Law of Harmonies</h2>
              <p className="text-3xl font-mono text-center py-2 text-white tracking-wider">{law.formula}</p>
            </div>
            <div className="p-3 bg-black/30 rounded-lg border border-gray-700 flex-grow">
              <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">Definitions</h2>
              <ul className="text-gray-300 space-y-2 text-xs">
                <li><strong>P</strong>: <strong className="text-cyan-300">Orbital Period</strong> (Time to orbit).</li>
                <li><strong>a</strong>: <strong className="text-orange-300">Semi-Major Axis</strong> (Distance).</li>
                <li><strong>∝</strong>: Is proportional to.</li>
              </ul>
            </div>
            <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
              <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">In Simple Terms</h2>
              <p className="text-gray-300 text-[10px] leading-tight">{law.explanation}</p>
            </div>
          </div>
          
          {/* Col 3: Center Viz (Standard) */}
          <div className="flex flex-col items-center justify-center h-full bg-black/30 p-2 rounded-xl border border-orange-500/20 shadow-[0_0_30px_-10px_rgba(249,115,22,0.1)]">
            <OrbitalMotionVisualization />
          </div>

          {/* Col 4: Diagram (Standard) */}
          <div className="flex flex-col justify-around bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right">
            <OrbitDiagram />
            <div className="p-3 mt-4 bg-black/30 rounded-lg border border-gray-700">
                 <h2 className="text-sm font-semibold text-yellow-300 mb-1 uppercase">Implication</h2>
                 <p className="text-gray-300 text-xs">This law allows us to "weigh" stars. By watching how fast a planet orbits, we can calculate the mass of the star pulling it.</p>
             </div>
          </div>

          {/* Col 5: Clockwork (New) */}
          <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
             <div className="border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-base font-bold text-gray-300 uppercase tracking-wide">The Clockwork Sky</h2>
             </div>
             <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                    Kepler's laws painted the solar system as a giant, precise machine. If you know where a planet is today, you can predict exactly where it will be in a thousand years.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                   This predictability suggested a universe governed by fixed, knowable laws, inspiring Newton to find the force behind the motion: Gravity.
                </p>
             </div>
             <div className="h-[20%] min-h-[60px] mt-2">
                <GearsVisual />
             </div>
          </div>

        </main>
        
        <footer className="w-full py-3 flex-shrink-0 mt-2">
          <div className="max-w-md mx-auto text-center">
            <button onClick={onClose} className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Continue Journey</button>
            <div className="relative w-full bg-gray-700/50 rounded-full h-1 mt-3 overflow-hidden border border-gray-600">
              <div className="bg-orange-400 h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 100ms linear' }}/>
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
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.3); border-radius: 2px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(249, 115, 22, 0.5); }
      `}</style>
    </div>
  );
};

export default KeplersThirdLawDisplay;
