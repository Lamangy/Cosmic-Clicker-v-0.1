
import React from 'react';
import { Resource } from '../types';

interface ResourceDisplayProps {
  resources: Record<Resource, number>;
  formatNumber: (n: number) => string;
  cosmicEssence?: number;
}

const RESOURCE_CONFIG: Record<Resource, { color: string, icon: React.ReactNode }> = {
  [Resource.ENERGY]: {
    color: 'text-cyan-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  },
  [Resource.QUARK]: {
    color: 'text-red-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="2.5" />
        <circle cx="7" cy="16" r="2.5" />
        <circle cx="17" cy="16" r="2.5" />
        <path d="M12 8L7 16" strokeDasharray="2 2" className="opacity-60"/>
        <path d="M12 8L17 16" strokeDasharray="2 2" className="opacity-60"/>
        <path d="M7 16L17 16" strokeDasharray="2 2" className="opacity-60"/>
      </svg>
    )
  },
  [Resource.PROTON]: {
    color: 'text-blue-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" className="opacity-50" />
        <path d="M12 7v10M7 12h10" />
      </svg>
    )
  },
  [Resource.ATOM]: {
    color: 'text-purple-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
        <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(120 12 12)" />
      </svg>
    )
  },
  [Resource.STAR]: {
    color: 'text-yellow-300',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  },
  [Resource.DARK_MATTER]: {
    color: 'text-violet-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeDasharray="4 2" className="opacity-70"/>
         <circle cx="12" cy="12" r="6" fill="currentColor" className="opacity-30" />
         <path d="M12 8v8M8 12h8" className="opacity-50"/>
      </svg>
    )
  }
};

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources, formatNumber, cosmicEssence }) => {
  const relevantResources = (Object.entries(resources) as [Resource, number][])
    .filter(([, value]) => value > 0 || (value === 0 && (Object.values(resources).every(v => v === 0))));

  return (
    <div className="w-full my-4">
      <div className="flex flex-wrap justify-center items-stretch gap-3 md:gap-4">
        {cosmicEssence !== undefined && cosmicEssence > 0 && (
          <div key="cosmic-essence" className="bg-indigo-900/60 border border-purple-500/60 rounded-xl px-2 py-2 w-28 md:w-32 flex flex-col items-center justify-between order-first animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <div className="text-purple-300 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                    <path d="M12 8L13 11L16 12L13 13L12 16L11 13L8 12L11 11L12 8Z" className="opacity-50"/>
                </svg>
            </div>
            <div className="text-xl md:text-2xl font-bold text-purple-300 leading-none tabular-nums">{formatNumber(cosmicEssence)}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-purple-400 mt-1 text-center truncate w-full">Essence</div>
          </div>
        )}

        {relevantResources.length > 0 ? relevantResources.map(([key, value]) => {
            const config = RESOURCE_CONFIG[key];
            return (
              <div key={key} className={`bg-gray-800/60 border border-gray-700 rounded-xl px-2 py-2 w-28 md:w-32 flex flex-col items-center justify-between backdrop-blur-sm hover:bg-gray-800/80 transition-colors`}>
                <div className={`${config.color} mb-1`}>{config.icon}</div>
                <div className={`text-xl md:text-2xl font-bold ${config.color} leading-none tabular-nums`}>{formatNumber(value)}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1 text-center truncate w-full" title={key}>{key}</div>
              </div>
            );
        }) : (
             <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-2 py-2 w-28 md:w-32 flex flex-col items-center justify-between backdrop-blur-sm">
                <div className="text-cyan-300 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
                <div className="text-xl md:text-2xl font-bold text-cyan-300 leading-none tabular-nums">0</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1 text-center truncate w-full">{Resource.ENERGY}</div>
             </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDisplay;