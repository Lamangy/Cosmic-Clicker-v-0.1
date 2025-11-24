import React from 'react';
import { PrestigeUpgrade } from '../types';
import { PRESTIGE_UPGRADES } from '../constants';

interface PrestigePanelProps {
  prestigeUpgrades: Record<string, number>;
  cosmicEssence: number;
  onBuyPrestigeUpgrade: (upgradeId: string) => void;
  formatNumber: (n: number) => string;
  currentEpochIndex: number;
  totalStarsEver: number;
  onPrestige: () => void;
}

const PrestigeUpgradeButton: React.FC<{
  upgrade: PrestigeUpgrade;
  level: number;
  isAffordable: boolean;
  onBuy: () => void;
  formatNumber: (n: number) => string;
}> = ({ upgrade, level, isAffordable, onBuy, formatNumber }) => {
  const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  const isMaxLevel = upgrade.maxLevel && level >= upgrade.maxLevel;

  return (
    <button
      onClick={onBuy}
      disabled={!isAffordable || isMaxLevel}
      className={`w-full text-left p-3 border border-purple-700/50 rounded-lg bg-gradient-to-br from-gray-900 to-indigo-900/50 hover:scale-[1.02] hover:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-purple-700/50`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-base text-purple-300">{upgrade.name}</h3>
        <span className="text-sm font-semibold px-2 py-0.5 bg-gray-700 rounded">{isMaxLevel ? 'MAX' : `Lvl ${level}`}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{upgrade.description(level)}</p>
      {!isMaxLevel && (
        <p className="text-sm font-medium text-right mt-2 text-gray-300">
          Cost: <span className="font-bold text-purple-300">{formatNumber(cost)} CE</span>
        </p>
      )}
    </button>
  );
};


const PrestigePanel: React.FC<PrestigePanelProps> = ({ prestigeUpgrades, cosmicEssence, onBuyPrestigeUpgrade, formatNumber, currentEpochIndex, totalStarsEver, onPrestige }) => {
  const canPrestige = currentEpochIndex >= 6;
  const potentialEssence = Math.floor(Math.pow(totalStarsEver / 1e6, 0.5));
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-4 text-purple-300 drop-shadow-lg">Singularity</h2>

      {/* Prestige Status Dashboard */}
      <div className="mb-4 p-4 bg-indigo-900/30 border border-purple-500/40 rounded-lg">
          <h3 className="text-sm font-bold text-purple-200 uppercase tracking-wider mb-3">Singularity Status</h3>
          
          {/* Requirement 1: Epoch */}
          <div className="flex justify-between items-center mb-2 text-sm">
             <span className="text-gray-400">Timeline:</span>
             <span className={canPrestige ? "text-green-400 font-bold" : "text-red-400"}>
                {canPrestige ? "Ready (Galaxy Formation)" : "Timeline Unstable"}
             </span>
          </div>

           {/* Requirement 2: Stars */}
           <div className="flex justify-between items-center mb-2 text-sm">
             <span className="text-gray-400">Total Stars Created:</span>
             <span className="text-white font-mono">{formatNumber(totalStarsEver)}</span>
          </div>
          
           {/* Potential Reward */}
           <div className="flex justify-between items-center mb-4 text-sm bg-black/20 p-2 rounded">
             <span className="text-gray-300">Potential Essence Gain:</span>
             <span className={`font-bold text-lg ${potentialEssence > 0 ? "text-purple-300" : "text-gray-500"}`}>
                +{formatNumber(potentialEssence)}
             </span>
          </div>

          {!canPrestige ? (
               <p className="text-xs text-center text-gray-400 italic">
                   Reach the <strong>Galaxy Formation</strong> epoch to stabilize the singularity and collapse the universe.
               </p>
          ) : (
              <button
                onClick={onPrestige}
                disabled={potentialEssence <= 0}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 Collapse Universe
              </button>
          )}
          {canPrestige && potentialEssence <= 0 && (
              <p className="text-xs text-center text-red-400 mt-2">
                  You need at least 1 Million Total Stars to gain Essence.
              </p>
          )}
      </div>

      <div className="space-y-3 pr-2 flex-grow overflow-y-auto">
        {Object.values(PRESTIGE_UPGRADES).map(upgrade => {
          const level = prestigeUpgrades[upgrade.id] || 0;
          const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
          const isAffordable = cosmicEssence >= cost;

          return (
            <PrestigeUpgradeButton
              key={upgrade.id}
              upgrade={upgrade}
              level={level}
              isAffordable={isAffordable}
              onBuy={() => onBuyPrestigeUpgrade(upgrade.id)}
              formatNumber={formatNumber}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PrestigePanel;