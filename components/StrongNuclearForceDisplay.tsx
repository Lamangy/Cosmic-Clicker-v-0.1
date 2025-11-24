
import React, { useState, useEffect } from 'react';
import { CosmicLaw } from '../types';

const QuarkBindingVisualization: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner shadow-black/40">
             <h3 className="text-xl font-semibold mb-4 text-blue-300">Binding Quarks</h3>
            <div className="relative w-40 h-40 mx-auto bg-black/30 rounded-full flex items-center justify-center border-2 border-gray-700">
                
                <div className="absolute w-full h-full rounded-full bg-blue-500/10 animate-ping opacity-50"></div>
                <div className="absolute w-full h-full rounded-full border-2 border-dashed border-blue-400/30 animate-spin-slow"></div>

                <div className="quark-container animate-quark-1">
                    <div className="w-6 h-6 rounded-full bg-red-500 shadow-[0_0_12px_2px_theme(colors.red.400)] border-2 border-red-300"></div>
                </div>
                 <div className="quark-container animate-quark-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 shadow-[0_0_12px_2px_theme(colors.green.400)] border-2 border-green-300"></div>
                </div>
                 <div className="quark-container animate-quark-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_12px_2px_theme(colors.blue.400)] border-2 border-blue-300"></div>
                </div>

                <div className="absolute w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm animate-proton-pulse"></div>

            </div>
             <style>{`
                .quark-container { position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 15s linear infinite; }
                @keyframes quark-orbit-1 { 0% { transform: rotate(0deg) translateX(35px) rotate(0deg) scale(0.8); } 25% { transform: rotate(90deg) translateX(45px) rotate(-90deg) scale(1); } 50% { transform: rotate(180deg) translateX(30px) rotate(-180deg) scale(0.9); } 75% { transform: rotate(270deg) translateX(45px) rotate(-270deg) scale(1); } 100% { transform: rotate(360deg) translateX(35px) rotate(-360deg) scale(0.8); } }
                .animate-quark-1 { animation: quark-orbit-1 5s ease-in-out infinite; }
                @keyframes quark-orbit-2 { 0% { transform: rotate(120deg) translateX(40px) rotate(-120deg) scale(0.9); } 25% { transform: rotate(210deg) translateX(35px) rotate(-210deg) scale(0.8); } 50% { transform: rotate(300deg) translateX(45px) rotate(-300deg) scale(1); } 75% { transform: rotate(390deg) translateX(35px) rotate(-390deg) scale(0.8); } 100% { transform: rotate(480deg) translateX(40px) rotate(-480deg) scale(0.9); } }
                .animate-quark-2 { animation: quark-orbit-2 5s ease-in-out infinite; }
                @keyframes quark-orbit-3 { 0% { transform: rotate(240deg) translateX(35px) rotate(-240deg) scale(1); } 25% { transform: rotate(330deg) translateX(45px) rotate(-330deg) scale(0.9); } 50% { transform: rotate(420deg) translateX(38px) rotate(-420deg) scale(0.8); } 75% { transform: rotate(510deg) translateX(45px) rotate(-510deg) scale(0.9); } 100% { transform: rotate(600deg) translateX(35px) rotate(-600deg) scale(1); } }
                .animate-quark-3 { animation: quark-orbit-3 5s ease-in-out infinite; }
                @keyframes proton-pulse-keyframes { 0% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 20px 5px rgba(255,255,255,0.2); } 100% { transform: scale(0.95); opacity: 0.7; } }
                .animate-proton-pulse { animation: proton-pulse-keyframes 2s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

const ProtonCompositionDiagram: React.FC = () => {
    return (
        <div className="w-full flex-grow flex flex-col justify-center items-center p-3 rounded-lg bg-gray-900/50 border border-gray-700">
            <h2 className="text-sm font-semibold text-blue-300 mb-2 text-center uppercase">Proton Composition</h2>
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-2 border-dashed border-gray-600 rounded-full"></div>
                <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-300 flex items-center justify-center font-bold text-xs">U</div>
                </div>
                 <div className="absolute bottom-[15%] left-[18%] flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-300 flex items-center justify-center font-bold text-xs">U</div>
                </div>
                 <div className="absolute bottom-[15%] right-[18%] flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-300 flex items-center justify-center font-bold text-xs">D</div>
                </div>
                <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100">
                    <path d="M50 25 L 34 75" stroke="url(#gluonGradient)" strokeWidth="2" strokeDasharray="4 2"/>
                    <path d="M34 75 L 66 75" stroke="url(#gluonGradient)" strokeWidth="2" strokeDasharray="4 2"/>
                    <path d="M66 75 L 50 25" stroke="url(#gluonGradient)" strokeWidth="2" strokeDasharray="4 2"/>
                    <defs>
                        <linearGradient id="gluonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{stopColor: 'rgb(96, 165, 250)', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: 'rgb(192, 132, 252)', stopOpacity: 1}} />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
             <p className="text-xs text-center text-gray-400 mt-3">Bound by Gluons</p>
        </div>
    );
};

const RepulsionVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
        <svg viewBox="0 0 100 50" className="w-full h-full">
            <circle cx="30" cy="25" r="10" fill="#93c5fd" stroke="white" strokeWidth="1" />
            <text x="30" y="29" textAnchor="middle" fill="white" fontSize="12">+</text>
            <circle cx="70" cy="25" r="10" fill="#93c5fd" stroke="white" strokeWidth="1" />
            <text x="70" y="29" textAnchor="middle" fill="white" fontSize="12">+</text>
            
            <path d="M 30 25 L 10 25" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <path d="M 70 25 L 90 25" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <defs>
                 <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="0" refY="1.75" orient="auto">
                    <polygon points="0 0, 5 1.75, 0 3.5" fill="#ef4444" />
                </marker>
            </defs>
        </svg>
    </div>
);

const ColorChargeVisual: React.FC = () => (
    <div className="w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 p-2">
         <div className="relative w-16 h-16">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 mix-blend-screen opacity-80 animate-pulse"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-green-500 mix-blend-screen opacity-80 animate-pulse" style={{ animationDelay: '0.3s'}}></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 mix-blend-screen opacity-80 animate-pulse" style={{ animationDelay: '0.6s'}}></div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-4 h-4 bg-white rounded-full blur-sm"></div>
             </div>
         </div>
    </div>
);

const StrongNuclearForceDisplay: React.FC<{ law: CosmicLaw, onClose: () => void }> = ({ law, onClose }) => {
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
                <header className="text-center py-2 border-b-2 border-blue-500/30 flex-shrink-0 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-blue-300 drop-shadow-lg">{law.title}</h1>
                    <p className="text-gray-400 text-base mt-1">The Cosmic Glue</p>
                </header>
                
                <main className="flex-grow overflow-hidden p-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
                
                {/* Col 1: The Four Forces (New) */}
                <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                     <div className="border-b border-gray-700 pb-2 mb-2">
                        <h2 className="text-base font-bold text-red-400 uppercase tracking-wide">Overcoming Repulsion</h2>
                     </div>
                     <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                        <p className="text-xs text-gray-300 leading-relaxed">
                            Protons have a positive charge. According to electromagnetism, like charges repel each other violently. So why does the nucleus of an atom stick together?
                        </p>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            Enter the <strong>Strong Nuclear Force</strong>. It is 100 times stronger than electromagnetism, but it only acts over incredibly short distances (the size of a proton).
                        </p>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            It acts like a super-strong velcro, overcoming the electric repulsion to bind quarks into protons, and protons into nuclei.
                        </p>
                     </div>
                     <div className="h-[20%] min-h-[60px] mt-2">
                        <RepulsionVisual />
                     </div>
                </div>

                {/* Col 2: Context (Standard) */}
                <div className="flex flex-col space-y-3 justify-between bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-left">
                    <div className="p-3 bg-black/30 rounded-lg border border-gray-700 shadow-lg">
                         <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">What is it?</h2>
                         <p className="text-gray-300 text-xs sm:text-sm">{law.explanation}</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg border border-gray-700 flex-grow">
                        <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">Key Facts</h2>
                         <ul className="text-gray-300 space-y-2 text-xs">
                            <li><strong>Range:</strong> 1 femtometer (10⁻¹⁵ m)</li>
                            <li><strong>Carrier:</strong> Gluon</li>
                            <li><strong>Strength:</strong> 137x stronger than EM force</li>
                        </ul>
                    </div>
                     <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
                         <h2 className="text-sm font-semibold text-purple-300 mb-1 uppercase">Implication</h2>
                        <p className="text-gray-300 text-[10px] leading-tight">Without this force, matter as we know it could not exist. The universe would be a diffuse gas of lonely quarks.</p>
                    </div>
                </div>
                
                {/* Col 3: Center Viz (Standard) */}
                <div className="flex flex-col items-center justify-center h-full bg-black/30 p-2 rounded-xl border border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.1)]">
                    <QuarkBindingVisualization />
                    <p className="mt-3 text-xs text-center text-blue-200/70 italic">
                        "Quarks are prisoners of their own attraction."
                    </p>
                </div>

                {/* Col 4: Proton Diagram (Standard) */}
                <div className="flex flex-col space-y-3 bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right">
                     <ProtonCompositionDiagram />
                     <div className="p-3 bg-black/30 rounded-lg border border-gray-700">
                         <p className="text-xs italic text-center text-purple-300">"The universe learns to build, binding chaos into the foundations of reality."</p>
                    </div>
                </div>

                {/* Col 5: Color Charge (New) */}
                <div className="hidden lg:flex flex-col bg-black/20 p-3 rounded-xl border border-gray-800 animate-slide-in-right" style={{ animationDelay: '100ms' }}>
                     <div className="border-b border-gray-700 pb-2 mb-2">
                        <h2 className="text-base font-bold text-green-400 uppercase tracking-wide">Color Charge</h2>
                     </div>
                     <div className="flex-grow flex flex-col justify-start space-y-3 overflow-y-auto custom-scrollbar pr-1">
                        <p className="text-xs text-gray-300 leading-relaxed">
                            Quarks possess a property called "color charge" (Red, Green, Blue). This has nothing to do with actual color, but relates to how they combine.
                        </p>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            Nature abhors naked color. Quarks must always combine to form a "white" (neutral) composite particle. Red + Green + Blue = White.
                        </p>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            This leads to <strong>Confinement</strong>: you cannot pull a quark free. As you try, the energy creates new quark pairs, ensuring they are always bound.
                        </p>
                     </div>
                     <div className="h-[20%] min-h-[60px] mt-2">
                        <ColorChargeVisual />
                     </div>
                </div>

                </main>
                
                <footer className="w-full py-3 flex-shrink-0 mt-2">
                    <div className="max-w-md mx-auto text-center">
                        <button onClick={onClose} className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Continue Journey</button>
                        <div className="relative w-full bg-gray-700/50 rounded-full h-1 mt-3 overflow-hidden border border-gray-600">
                            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 100ms linear' }} />
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
                .animate-slide-in-left { animation: slide-in-left 0.6s ease-out forwards; }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in-right { animation: slide-in-right 0.6s ease-out forwards; }
                 /* Custom Scrollbar for text areas */
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 2px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
            `}</style>
        </div>
    );
};

export default StrongNuclearForceDisplay;
