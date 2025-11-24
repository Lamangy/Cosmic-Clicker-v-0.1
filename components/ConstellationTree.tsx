
import React, { useRef, useState, useLayoutEffect } from 'react';
import { Upgrade, Resource } from '../types';
import { UPGRADES } from '../constants';

interface ConstellationTreeProps {
  upgrades: Record<string, number>;
  resources: Record<Resource, number>;
  currentEpochIndex: number;
  onBuyUpgrade: (upgradeId: string) => void;
  formatNumber: (n: number) => string;
}

const RESOURCE_COLORS: Record<Resource, string> = {
  [Resource.ENERGY]: 'text-cyan-300',
  [Resource.QUARK]: 'text-red-400',
  [Resource.PROTON]: 'text-blue-300',
  [Resource.ATOM]: 'text-purple-400',
  [Resource.STAR]: 'text-yellow-300',
  [Resource.DARK_MATTER]: 'text-violet-500',
};

const ConstellationTree: React.FC<ConstellationTreeProps> = ({ upgrades, resources, currentEpochIndex, onBuyUpgrade, formatNumber }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 800 });
  const [hoveredUpgradeId, setHoveredUpgradeId] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: 800, // Fixed scrollable height
      });
    }
  }, []);

  const allUpgrades = Object.values(UPGRADES).filter(u => u.position);
  
  // Determine status for each upgrade
  const getStatus = (upgrade: Upgrade) => {
      const level = upgrades[upgrade.id] || 0;
      const isPurchased = level > 0;
      const isMaxed = upgrade.maxLevel && level >= upgrade.maxLevel;
      
      // Check if parents are purchased
      let isUnlocked = true;
      if (upgrade.parents) {
          isUnlocked = upgrade.parents.every(parentId => (upgrades[parentId] || 0) > 0);
      }
      if (upgrade.requiredEpoch > currentEpochIndex) isUnlocked = false;

      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
      const isAffordable = resources[upgrade.costResource] >= cost;

      return { level, isPurchased, isMaxed, isUnlocked, isAffordable, cost };
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-black/60 rounded-xl border border-gray-800 custom-scrollbar">
      <div className="relative" style={{ width: '100%', height: `${dimensions.height}px` }}>
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {allUpgrades.map(upgrade => {
                if (!upgrade.parents) return null;
                return upgrade.parents.map(parentId => {
                    const parent = UPGRADES[parentId];
                    if (!parent || !parent.position || !upgrade.position) return null;

                    // Calculate positions based on percentages
                    const x1 = `${parent.position.x}%`;
                    const y1 = `${parent.position.y}%`;
                    const x2 = `${upgrade.position.x}%`;
                    const y2 = `${upgrade.position.y}%`;
                    
                    const status = getStatus(upgrade);
                    const parentStatus = getStatus(parent);
                    
                    let strokeColor = '#374151'; // gray-700
                    let strokeWidth = 1;
                    let strokeOpacity = 0.3;

                    if (parentStatus.isPurchased) {
                        if (status.isPurchased) {
                            strokeColor = '#22d3ee'; // cyan-400
                            strokeWidth = 2;
                            strokeOpacity = 0.8;
                        } else if (status.isUnlocked) {
                             strokeColor = '#94a3b8'; // slate-400
                             strokeWidth = 1.5;
                             strokeOpacity = 0.5;
                        }
                    }

                    return (
                        <line 
                            key={`${parentId}-${upgrade.id}`}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeOpacity={strokeOpacity}
                            strokeDasharray={status.isPurchased ? "0" : "4 2"}
                        />
                    );
                });
            })}
        </svg>

        {allUpgrades.map(upgrade => {
            if (!upgrade.position) return null;
            const { level, isPurchased, isMaxed, isUnlocked, isAffordable, cost } = getStatus(upgrade);
            
            let nodeColor = 'bg-gray-800 border-gray-600';
            let glow = '';
            let scale = 'scale-100';
            let cursor = 'cursor-not-allowed';

            if (isUnlocked) {
                if (isMaxed) {
                    nodeColor = 'bg-cyan-500 border-white shadow-[0_0_10px_theme(colors.cyan.400)]';
                    cursor = 'cursor-default';
                } else if (isPurchased) {
                    nodeColor = 'bg-cyan-900 border-cyan-400 shadow-[0_0_5px_theme(colors.cyan.700)]';
                    cursor = 'cursor-pointer';
                } else if (isAffordable) {
                    nodeColor = 'bg-gray-700 border-green-400 animate-pulse shadow-[0_0_8px_theme(colors.green.500/0.5)]';
                    cursor = 'cursor-pointer';
                    scale = 'hover:scale-125';
                } else {
                     nodeColor = 'bg-gray-800 border-gray-500';
                     cursor = 'cursor-not-allowed';
                }
            } else {
                 // Hidden or very faint if parent purchased
                 const hasPurchasedParent = upgrade.parents?.some(pid => (upgrades[pid] || 0) > 0);
                 if (!hasPurchasedParent && upgrade.requiredEpoch > currentEpochIndex) return null; // Don't show far future upgrades
                 nodeColor = 'bg-gray-900 border-gray-800 opacity-50';
            }

            return (
                <div 
                    key={upgrade.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${nodeColor} ${scale} ${cursor} ${glow}`}
                    style={{ left: `${upgrade.position.x}%`, top: `${upgrade.position.y}%`, zIndex: 10 }}
                    onMouseEnter={() => setHoveredUpgradeId(upgrade.id)}
                    onMouseLeave={() => setHoveredUpgradeId(null)}
                    onClick={() => {
                        if (isUnlocked && !isMaxed && isAffordable) {
                            onBuyUpgrade(upgrade.id);
                        }
                    }}
                >
                    {isPurchased && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    
                    {/* Tooltip */}
                    {hoveredUpgradeId === upgrade.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900/95 border border-cyan-500/50 text-white text-xs rounded-lg p-3 shadow-xl z-50 pointer-events-none animate-fade-in">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-cyan-300 text-sm">{upgrade.name}</h4>
                                <span className="bg-gray-800 px-1.5 rounded text-[10px] text-gray-400 border border-gray-700">
                                    {isMaxed ? 'MAX' : `Lvl ${level}`}
                                </span>
                            </div>
                            <p className="text-gray-300 mb-2">{upgrade.description}</p>
                            <p className="text-gray-500 italic mb-2">"{upgrade.flavorText}"</p>
                            
                            {!isMaxed && (
                                <div className={`mt-2 pt-2 border-t border-gray-700 flex justify-between items-center ${isUnlocked ? '' : 'opacity-50'}`}>
                                    <span className="text-gray-400">Cost:</span>
                                    <span className={`font-mono font-bold ${isAffordable ? RESOURCE_COLORS[upgrade.costResource] : 'text-red-400'}`}>
                                        {formatNumber(cost)} {upgrade.costResource}
                                    </span>
                                </div>
                            )}
                            {!isUnlocked && (
                                <div className="mt-2 text-red-400 font-bold text-center">LOCKED</div>
                            )}
                        </div>
                    )}
                </div>
            );
        })}

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>
    </div>
  );
};

export default ConstellationTree;
