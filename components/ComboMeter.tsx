import React, { useState, useEffect } from 'react';
import { COMBO_DECAY_MS, COMBO_TIERS } from '../constants';

interface ComboMeterProps {
  comboCount: number;
  multiplier: number;
  lastClickTimestamp: number;
}

const ComboMeter: React.FC<ComboMeterProps> = ({ comboCount, multiplier, lastClickTimestamp }) => {
  const [decayProgress, setDecayProgress] = useState(100);

  const isActive = comboCount > 0 && (Date.now() - lastClickTimestamp < COMBO_DECAY_MS);
  
  useEffect(() => {
    if (!isActive) {
      setDecayProgress(100);
      return;
    }

    let frameId: number;
    const animate = () => {
      const timeSinceClick = Date.now() - lastClickTimestamp;
      const progress = Math.max(0, 100 - (timeSinceClick / COMBO_DECAY_MS) * 100);
      setDecayProgress(progress);
      if (progress > 0) {
        frameId = requestAnimationFrame(animate);
      }
    };
    
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isActive, lastClickTimestamp]);
  
  const nextTier = COMBO_TIERS.find(t => t.count > comboCount);
  const prevTierCount = COMBO_TIERS.slice().reverse().find(t => t.count <= comboCount)?.count ?? 0;
  const tierProgress = nextTier 
    ? ((comboCount - prevTierCount) / (nextTier.count - prevTierCount)) * 100
    : 100;

  const strokeDashoffset = 283 * (1 - decayProgress / 100);
  const tierStrokeDashoffset = 220 * (1 - tierProgress / 100);

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {/* Decay Timer Arc */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-red-500/50"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{
            strokeDasharray: 283,
            strokeDashoffset: strokeDashoffset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 50ms linear'
          }}
        />
      </svg>
        {/* Tier Progress Arc */}
        {multiplier > 1 && (
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                <path
                    d="M 15 73 A 35 35 0 0 1 85 73"
                    className="text-cyan-400"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap='round'
                    fill="transparent"
                    style={{
                        strokeDasharray: 220,
                        strokeDashoffset: tierStrokeDashoffset,
                        transition: 'stroke-dashoffset 200ms ease-out'
                    }}
                />
            </svg>
        )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
        <div className="font-black text-3xl drop-shadow-lg" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.5)' }}>
          {comboCount}
        </div>
        <div className="text-sm font-bold bg-black/30 px-2 rounded-full">
            {multiplier > 1 ? `x${multiplier} Multiplier!` : 'Combo'}
        </div>
      </div>
    </div>
  );
};

export default ComboMeter;
