import React from 'react';

interface CreditsModalProps {
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-11/12 max-w-lg bg-gray-900/90 border border-cyan-500/30 rounded-xl p-6 text-center shadow-2xl shadow-cyan-500/20 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(34,211,238,0.2)_0%,transparent_60%)] animate-spin-slow"></div>
        </div>

        <h2 className="text-3xl font-bold text-cyan-300 mb-2 drop-shadow-lg relative z-10">Cosmic Archives</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-6 relative z-10"></div>
        
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed relative z-10">
          <p>
            You are the Architect of this universe. From the first quantum fluctuation to the forging of galactic superclusters, your will has shaped reality itself.
          </p>
          
          <div className="py-4 border-t border-gray-800 border-b bg-black/20 rounded-lg">
            <p className="text-cyan-200 font-semibold mb-1 uppercase tracking-widest text-xs">Simulation Architects</p>
            <p className="text-white font-bold text-lg">User & AI Pair</p>
            <p className="text-gray-500 text-xs mt-1">Co-created in the digital ether</p>
          </div>

          <div className="text-xs text-gray-400">
              <p>In memory of the Void that came before.</p>
          </div>

          <p className="italic text-gray-500 text-xs mt-4 border-t border-gray-800 pt-4">
            "The universe is not only stranger than we suppose, but stranger than we can suppose."
            <br/>— J.B.S. Haldane
          </p>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 px-8 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full border border-gray-600 transition-all hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] relative z-10"
        >
          Close Archives
        </button>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
      `}</style>
    </div>
  );
};

export default CreditsModal;