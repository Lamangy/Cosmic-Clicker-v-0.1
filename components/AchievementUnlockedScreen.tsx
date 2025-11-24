import React, { useState, useEffect } from 'react';
import { Achievement } from '../types';

interface AchievementUnlockedScreenProps {
  achievement: Achievement;
  onClose: () => void;
}

const AUTO_CLOSE_DURATION = 15000; // 15 seconds

const AchievementUnlockedScreen: React.FC<AchievementUnlockedScreenProps> = ({ achievement, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_CLOSE_DURATION);
    
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
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-400/50 rounded-2xl shadow-2xl shadow-yellow-500/30 p-8 text-white text-center flex flex-col items-center animate-scale-in"
      >
         <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="absolute top-0 -translate-y-1/2">
            <svg className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        </div>
        
        <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-300 mt-10 animate-title-fade-in" style={{ animationDelay: '200ms'}}>
          Achievement Unlocked
        </h1>
        
        <h2 className="text-4xl md:text-5xl font-extrabold my-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 animate-title-fade-in" style={{ animationDelay: '400ms'}}>
          {achievement.name}
        </h2>
        
        <p className="text-lg text-gray-300 max-w-md animate-title-fade-in" style={{ animationDelay: '600ms'}}>
          {achievement.description}
        </p>

        <button
            onClick={onClose}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-title-fade-in"
            style={{ animationDelay: '800ms' }}
        >
            Continue
        </button>

        <div className="w-full max-w-sm mt-6 animate-title-fade-in" style={{ animationDelay: '900ms'}}>
          <div className="relative w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden border border-gray-600">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" 
              style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
            ></div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-1">Auto-closing in {Math.ceil(progress / 100 * 15)}s...</p>
        </div>
      </div>
      <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          @keyframes scale-in {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scale-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }

          @keyframes title-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-title-fade-in {
            animation: title-fade-in 0.5s ease-out forwards;
            opacity: 0;
            animation-fill-mode: forwards;
          }
      `}</style>
    </div>
  );
};

export default AchievementUnlockedScreen;
