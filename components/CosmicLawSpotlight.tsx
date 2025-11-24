import React, { useEffect, useState } from 'react';
import { CosmicLaw } from '../types';

interface CosmicLawSpotlightProps {
  law: CosmicLaw;
  onClose: () => void;
}

const CosmicLawSpotlight: React.FC<CosmicLawSpotlightProps> = ({ law, onClose }) => {
  const [progress, setProgress] = useState(100);
  const AUTO_CLOSE_DURATION = 15000; // 15 seconds

  useEffect(() => {
    // Timer for auto-closing the modal
    const timer = setTimeout(onClose, AUTO_CLOSE_DURATION);
    
    // Interval for updating the progress bar
    const interval = setInterval(() => {
        setProgress(prev => {
            const newProgress = prev - (100 / (AUTO_CLOSE_DURATION / 100));
            return newProgress > 0 ? newProgress : 0;
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose, law]); // Depend on `law` to reset the timer when a new law appears

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-11/12 max-w-lg bg-gray-800/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 p-6 m-4 text-white animate-slide-in-up"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-cyan-300 mr-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h2 className="text-2xl font-bold text-cyan-300">{law.title}</h2>
        </div>

        {law.formula && (
            <div className="my-4 p-3 bg-black/30 border border-gray-700 rounded-lg text-center">
                <p className="text-xl font-mono text-yellow-300 tracking-wider">{law.formula}</p>
            </div>
        )}
        
        <p className="text-gray-200 text-base leading-relaxed">{law.explanation}</p>
        
        {/* Auto-close progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500/20 rounded-b-xl overflow-hidden">
            <div 
                className="h-full bg-cyan-400" 
                style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
            ></div>
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
           @keyframes slide-in-up {
            from { 
                opacity: 0;
                transform: translateY(20px) scale(0.98);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
          }
          .animate-slide-in-up {
            animation: slide-in-up 0.4s ease-out;
          }
      `}</style>
    </div>
  );
};

export default CosmicLawSpotlight;
