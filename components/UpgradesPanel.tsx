
import React, { useState, useEffect, useRef } from 'react';
import { Upgrade, Resource } from '../types';
import { UPGRADES } from '../constants';
import ConstellationTree from './ConstellationTree';

interface UpgradesPanelProps {
  upgrades: Record<string, number>;
  resources: Record<Resource, number>;
  currentEpochIndex: number;
  onBuyUpgrade: (upgradeId: string) => void;
  formatNumber: (n: number) => string;
}

const UpgradeButton: React.FC<{
  upgrade: Upgrade;
  level: number;
  isAffordable: boolean;
  isJustPurchased: boolean;
  onBuy: () => void;
  formatNumber: (n: number) => string;
}> = ({ upgrade, level, isAffordable, isJustPurchased, onBuy, formatNumber }) => {
  const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  const isMaxLevel = upgrade.maxLevel && level >= upgrade.maxLevel;

  return (
    <button
      onClick={onBuy}
      disabled={!isAffordable || isMaxLevel}
      className={`w-full text-left p-3 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:scale-[1.02] hover:border-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-gray-700 ${isJustPurchased ? 'animate-purchase-flash' : ''}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-base text-cyan-200">{upgrade.name}</h3>
        <span className="text-sm font-semibold px-2 py-0.5 bg-gray-700 rounded">{isMaxLevel ? 'MAX' : `Lvl ${level}`}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{upgrade.description}</p>
      <p className="text-xs text-purple-300 italic mt-1">"{upgrade.flavorText}"</p>
      {!isMaxLevel && (
        <p className="text-sm font-medium text-right mt-2">
          Cost: {formatNumber(cost)} {upgrade.costResource}
        </p>
      )}
    </button>
  );
};

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ upgrades, resources, currentEpochIndex, onBuyUpgrade, formatNumber }) => {
  const availableUpgrades = Object.values(UPGRADES).filter(u => u.requiredEpoch <= currentEpochIndex);
  const [viewMode, setViewMode] = useState<'list' | 'constellation'>('list');
  
  const prevUpgradesRef = useRef(upgrades);
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);

  useEffect(() => {
    const prevUpgrades = prevUpgradesRef.current;
    // Find the upgrade that was just leveled up
    for (const id in upgrades) {
      if (upgrades[id] > (prevUpgrades[id] || 0)) {
        setJustPurchasedId(id);
        const timer = setTimeout(() => {
          setJustPurchasedId(null);
        }, 600); // Animation duration
        
        // We assume only one upgrade can be bought at a time.
        // Update ref immediately to handle rapid purchases.
        prevUpgradesRef.current = upgrades; 
        return () => clearTimeout(timer);
      }
    }
    // Update ref if no purchase was detected
    prevUpgradesRef.current = upgrades;
  }, [upgrades]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-300 drop-shadow-lg">Upgrades</h2>
          <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
               <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-cyan-700 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="List View"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
              </button>
              <button
                  onClick={() => setViewMode('constellation')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'constellation' ? 'bg-cyan-700 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="Constellation View"
              >
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
              </button>
          </div>
      </div>
      
      <div className="flex-grow overflow-hidden relative">
          {viewMode === 'constellation' ? (
               <ConstellationTree 
                  upgrades={upgrades}
                  resources={resources}
                  currentEpochIndex={currentEpochIndex}
                  onBuyUpgrade={onBuyUpgrade}
                  formatNumber={formatNumber}
               />
          ) : (
            <div className="space-y-3 pr-2 h-full overflow-y-auto custom-scrollbar">
                {availableUpgrades.map(upgrade => {
                const level = upgrades[upgrade.id] || 0;
                const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
                const isAffordable = resources[upgrade.costResource] >= cost;

                return (
                    <UpgradeButton
                    key={upgrade.id}
                    upgrade={upgrade}
                    level={level}
                    isAffordable={isAffordable}
                    isJustPurchased={justPurchasedId === upgrade.id}
                    onBuy={() => onBuyUpgrade(upgrade.id)}
                    formatNumber={formatNumber}
                    />
                );
                })}
            </div>
          )}
      </div>

      <style>{`
          @keyframes purchase-flash-kf {
            0% { box-shadow: inset 0 0 0 0px rgba(34, 211, 238, 0); }
            50% { box-shadow: inset 0 0 0 2px rgba(34, 211, 238, 0.7); }
            100% { box-shadow: inset 0 0 0 0px rgba(34, 211, 238, 0); }
          }
          .animate-purchase-flash {
            animation: purchase-flash-kf 0.6s ease-out;
          }
           .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>
    </div>
  );
};

export default UpgradesPanel;
