import React, { useState, useEffect } from 'react';
import { ActiveEvent } from '../types';

interface EventAnnouncerProps {
  activeEvent: ActiveEvent | null;
}

const EVENT_COLORS: Record<string, { bg: string, text: string, accent: string }> = {
    'black-hole': { bg: 'bg-indigo-900/80', text: 'text-indigo-200', accent: 'border-indigo-500' },
    'click-frenzy': { bg: 'bg-amber-800/80', text: 'text-amber-200', accent: 'border-amber-400' },
    'supernova': { bg: 'bg-rose-900/80', text: 'text-rose-200', accent: 'border-rose-500' },
    'cmb-radiation': { bg: 'bg-sky-900/80', text: 'text-sky-200', accent: 'border-sky-500' },
    'strong-force-resonance': { bg: 'bg-blue-900/80', text: 'text-blue-200', accent: 'border-blue-500' },
    'recombination-cascade': { bg: 'bg-purple-900/80', text: 'text-purple-200', accent: 'border-purple-500' },
};

const EventAnnouncer: React.FC<EventAnnouncerProps> = ({ activeEvent }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (activeEvent) {
      setVisible(true);
      setProgress(100); // Reset progress when a new event starts
      
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - activeEvent.startTime;
        const remainingTime = activeEvent.event.duration - elapsedTime;
        const newProgress = (remainingTime / activeEvent.event.duration) * 100;
        setProgress(newProgress > 0 ? newProgress : 0);
      }, 50);

      return () => clearInterval(interval);

    } else {
      const timer = setTimeout(() => setVisible(false), 500); // Allow fade-out
      return () => clearTimeout(timer);
    }
  }, [activeEvent]);

  if (!visible && !activeEvent) {
    return null;
  }
  
  const event = activeEvent?.event;
  const colors = event ? EVENT_COLORS[event.visualEffect] ?? EVENT_COLORS['black-hole'] : EVENT_COLORS['black-hole'];

  return (
    <div 
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md transition-all duration-500 ease-in-out ${activeEvent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
        style={{ pointerEvents: activeEvent ? 'auto' : 'none' }}
    >
        {event && (
            <div className={`relative ${colors.bg} backdrop-blur-sm border ${colors.accent} rounded-xl shadow-2xl shadow-black/30 p-4 text-center overflow-hidden`}>
                <h3 className={`text-xl font-bold ${colors.text}`}>{event.name}</h3>
                <p className="text-sm text-gray-300 mt-1">{event.description}</p>
                
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10">
                    <div 
                        className="h-full bg-white/50" 
                        style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
                    ></div>
                </div>
            </div>
        )}
    </div>
  );
};

export default EventAnnouncer;