
import React, { useState, useRef } from 'react';
import { Resource, ClickPayload, ActiveEvent } from '../types';
import { CRITICAL_CHANCE, CRITICAL_MULTIPLIER } from '../constants';
import ComboMeter from './ComboMeter';

interface ClickerAreaProps {
  onClick: (payload: ClickPayload) => void;
  epochName: string;
  clickGains: Partial<Record<Resource, number>>;
  formatNumber: (n: number) => string;
  comboCount: number;
  comboMultiplier: number;
  lastClickTimestamp: number;
  activeEvent: ActiveEvent | null;
  prestigeUpgrades: Record<string, number>;
  useScientificNotation: boolean;
}

interface ClickEffect {
  id: string;
  x: number;
  y: number;
  resource: Resource;
  value: number;
  isCritical: boolean;
}

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: Resource;
  random1: number;
  random2: number;
}

interface CriticalEffect {
  id: string;
  x: number;
  y: number;
}

interface Shockwave {
  id: string;
  x: number;
  y: number;
  isCritical: boolean;
}


const RESOURCE_COLORS: Record<Resource, string> = {
  [Resource.ENERGY]: 'text-cyan-300',
  [Resource.QUARK]: 'text-red-400',
  [Resource.PROTON]: 'text-blue-300',
  [Resource.ATOM]: 'text-purple-400',
  [Resource.STAR]: 'text-yellow-300',
  [Resource.DARK_MATTER]: 'text-violet-500',
};


const ClickerArea: React.FC<ClickerAreaProps> = ({ onClick, epochName, clickGains, formatNumber, comboCount, comboMultiplier, lastClickTimestamp, activeEvent, prestigeUpgrades, useScientificNotation }) => {
  const [effects, setEffects] = useState<ClickEffect[]>([]);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [criticalEffects, setCriticalEffects] = useState<CriticalEffect[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const clickerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const critChanceBonus = (prestigeUpgrades['critical_certainty'] || 0) * 0.001;
    const isCritical = Math.random() < (CRITICAL_CHANCE + critChanceBonus);
    onClick({ isCritical, timestamp: Date.now() });
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Shockwave effect
    const shockwaveId = `${Date.now()}-shockwave`;
    setShockwaves(prev => [...prev, { id: shockwaveId, x: clickX, y: clickY, isCritical }]);
    setTimeout(() => {
        setShockwaves(prev => prev.filter(s => s.id !== shockwaveId));
    }, 1000);

    if (isCritical) {
      const critId = `${Date.now()}-critical`;
      setCriticalEffects(prev => [...prev, { id: critId, x: clickX, y: clickY }]);
      setTimeout(() => {
        setCriticalEffects(prev => prev.filter(c => c.id !== critId));
      }, 2000);
    }

    const currentGains = isCritical
      ? Object.fromEntries(
          (Object.entries(clickGains) as [string, number | undefined][]).map(([key, value]) => [key, (value || 0) * CRITICAL_MULTIPLIER])
        )
      : clickGains;


    // Create floating text effects for generated resources
    const newEffects: ClickEffect[] = Object.entries(currentGains)
      .filter(([, value]) => typeof value === 'number' && value > 0)
      .map(([resource, value]) => ({
        id: `${Date.now()}-${resource}-${Math.random()}`,
        x: clickX + (Math.random() - 0.5) * 60, // Add horizontal jitter
        y: clickY,
        resource: resource as Resource,
        value: value as number,
        isCritical: isCritical
      }));
    
    setEffects(currentEffects => [...currentEffects, ...newEffects]);

    newEffects.forEach(effect => {
        setTimeout(() => {
            setEffects(currentEffects => currentEffects.filter(eff => eff.id !== effect.id));
        }, 1500);
    });
    
    // Create new particle effects for each resource
    const newParticleEffects: ParticleEffect[] = [];

    const energyGain = currentGains[Resource.ENERGY] || 0;
    if (energyGain > 0) {
      const numParticles = Math.min(isCritical ? 50 : 15, 2 + Math.log1p(energyGain));
      for (let i = 0; i < numParticles; i++) {
        newParticleEffects.push({
          id: `${Date.now()}-energy-${i}`, x: clickX, y: clickY, type: Resource.ENERGY,
          random1: Math.random() * 2 - 1, random2: Math.random() * 2 - 1,
        });
      }
    }
    if ((currentGains[Resource.QUARK] || 0) > 0) {
      for (let i = 0; i < (isCritical ? 25 : 7); i++) {
        newParticleEffects.push({
          id: `${Date.now()}-quark-${i}`, x: clickX, y: clickY, type: Resource.QUARK,
          random1: Math.random() * 2 - 1, random2: Math.random() * 2 - 1,
        });
      }
    }
    // Other particles can be added here...

    setParticleEffects(current => [...current, ...newParticleEffects]);

    newParticleEffects.forEach(p => {
      setTimeout(() => {
        setParticleEffects(current => current.filter(eff => eff.id !== p.id));
      }, 1000);
    });

    if (clickerRef.current) {
      const el = clickerRef.current;
      el.classList.remove('animate-resource-pulse');
      void el.offsetWidth; 
      el.classList.add('animate-resource-pulse');
    }
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'resource-generated-pulse' && clickerRef.current) {
        clickerRef.current.classList.remove('animate-resource-pulse');
    }
  };

  const getParticleClass = (resource: Resource): string => {
    switch (resource) {
      case Resource.ENERGY: return 'animate-energy-particle';
      case Resource.QUARK: return 'animate-quark-particle';
      case Resource.PROTON: return 'animate-proton-particle';
      case Resource.ATOM: return 'animate-atom-particle';
      case Resource.STAR: return 'animate-star-particle';
      case Resource.DARK_MATTER: return 'animate-dark-matter-particle';
      default: return '';
    }
  };
  
  const isFrenzy = activeEvent?.event.visualEffect === 'click-frenzy';
  const isCMB = activeEvent?.event.visualEffect === 'cmb-radiation';

  return (
    <div
      ref={clickerRef}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      className={`relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full flex items-center justify-center cursor-pointer mt-6 border-2 border-cyan-300/30 bg-black/20 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all duration-300 overflow-hidden ${isFrenzy ? 'animate-frenzy-glow' : ''} ${isCMB ? 'animate-cmb-glow' : ''}`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
      
      {shockwaves.map(sw => (
        <div
            key={sw.id}
            className={`absolute pointer-events-none rounded-full ${sw.isCritical ? 'border-yellow-300 animate-crit-shockwave' : 'border-cyan-300 border-2 animate-shockwave'}`}
            style={{
                left: sw.x, top: sw.y,
                transform: 'translate(-50%, -50%)',
            }}
        />
       ))}

      {particleEffects.map(p => (
        <div
            key={p.id}
            className={`absolute pointer-events-none ${getParticleClass(p.type)}`}
            style={{
                left: p.x, top: p.y, '--rand1': p.random1, '--rand2': p.random2,
            } as React.CSSProperties}
        />
      ))}
      
      <ComboMeter
        comboCount={comboCount}
        multiplier={comboMultiplier}
        lastClickTimestamp={lastClickTimestamp}
      />

      <div className="z-10 text-center pointer-events-none">
        <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">Tap the Cosmos</h2>
        <p className="text-sm text-cyan-200">{epochName}</p>
      </div>
      
      {effects.map(effect => (
        <div
          key={effect.id}
          className={`absolute font-bold pointer-events-none ${effect.isCritical ? 'animate-crit-float-up text-2xl' : 'animate-float-up text-lg'} ${RESOURCE_COLORS[effect.resource]}`}
          style={{ 
            left: `${effect.x}px`, top: `${effect.y}px`, transform: 'translate(-50%, -50%)',
            textShadow: '0px 2px 4px rgba(0,0,0,0.7)'
          }}
        >
          +{formatNumber(effect.value)}
        </div>
      ))}
       
      {criticalEffects.map(crit => (
        <div key={crit.id}
             className="absolute pointer-events-none text-center"
             style={{ left: crit.x, top: crit.y, transform: 'translate(-50%, -100%)' }}>
          <span className="block font-black text-5xl text-yellow-300 animate-crit-text" style={{ WebkitTextStroke: '2px #a16207', textShadow: '0 0 15px #fef08a' }}>
            CRITICAL!
          </span>
          <span className="block font-bold text-3xl text-white animate-crit-text-sub" style={{ textShadow: '0 0 10px #fff' }}>
            x{CRITICAL_MULTIPLIER}
          </span>
        </div>
       ))}

       <style>{`
          @keyframes resource-generated-pulse {
            50% { transform: scale(1.03); border-color: #67e8f9; box-shadow: 0 0 30px 15px rgba(6, 182, 212, 0.5); }
          }
          .animate-resource-pulse { animation: resource-generated-pulse 0.4s ease-in-out; }

          @keyframes frenzy-glow {
            0% { box-shadow: 0 0 20px 5px rgba(250, 204, 21, 0.3), inset 0 0 15px 3px rgba(250, 204, 21, 0.2); border-color: rgba(250, 204, 21, 0.5); }
            50% { box-shadow: 0 0 40px 15px rgba(250, 204, 21, 0.6), inset 0 0 25px 5px rgba(250, 204, 21, 0.4); border-color: rgba(250, 204, 21, 1); }
            100% { box-shadow: 0 0 20px 5px rgba(250, 204, 21, 0.3), inset 0 0 15px 3px rgba(250, 204, 21, 0.2); border-color: rgba(250, 204, 21, 0.5); }
          }
          .animate-frenzy-glow { animation: frenzy-glow 1s ease-in-out infinite; }

          @keyframes cmb-glow {
            0% { box-shadow: 0 0 20px 5px rgba(14, 165, 233, 0.3), inset 0 0 15px 3px rgba(14, 165, 233, 0.2); border-color: rgba(14, 165, 233, 0.5); }
            50% { box-shadow: 0 0 40px 15px rgba(14, 165, 233, 0.6), inset 0 0 25px 5px rgba(14, 165, 233, 0.4); border-color: rgba(14, 165, 233, 1); }
            100% { box-shadow: 0 0 20px 5px rgba(14, 165, 233, 0.3), inset 0 0 15px 3px rgba(14, 165, 233, 0.2); border-color: rgba(14, 165, 233, 0.5); }
          }
          .animate-cmb-glow { animation: cmb-glow 1s ease-in-out infinite; }
          
          @keyframes float-up {
            0% { transform: translate(-50%, -50%) translateY(0) scale(1.5); opacity: 1; }
            20% { transform: translate(-50%, -50%) translateY(-10px) scale(1); }
            100% { transform: translate(-50%, -50%) translateY(-70px) scale(0.8); opacity: 0; }
          }
          .animate-float-up { animation: float-up 1.5s ease-out forwards; }

          @keyframes crit-float-up {
            0% { transform: translate(-50%, -50%) translateY(0) scale(2.5) rotate(-5deg); opacity: 1; text-shadow: 0 0 15px #fef08a; }
            20% { transform: translate(-50%, -50%) translateY(-15px) scale(1.8) rotate(5deg); }
            100% { transform: translate(-50%, -50%) translateY(-100px) scale(1.2); opacity: 0; }
          }
          .animate-crit-float-up { animation: crit-float-up 1.5s ease-out forwards; }
          
          @keyframes crit-text {
            0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
            20% { transform: scale(1.2) rotate(5deg); opacity: 1; }
            80% { transform: scale(0.9) rotate(0deg); opacity: 1; }
            100% { transform: scale(0.8) rotate(2deg); opacity: 0; }
          }
          .animate-crit-text { animation: crit-text 2s ease-in-out forwards; }
          
          @keyframes crit-text-sub {
            0%, 20% { transform: scale(0.5); opacity: 0; }
            40% { transform: scale(1.2); opacity: 1; }
            100% { opacity: 0; }
          }
          .animate-crit-text-sub { animation: crit-text-sub 2s ease-in-out forwards; }

          /* --- Shockwave Styles --- */
          @keyframes shockwave-kf {
            from {
                scale: 0.1;
                opacity: 1;
                box-shadow: 0 0 5px 2px rgba(103, 232, 249, 0.5);
            }
            to   {
                scale: 1;
                opacity: 0;
                box-shadow: 0 0 20px 10px rgba(103, 232, 249, 0);
            }
          }
          .animate-shockwave {
            width: 250px;
            height: 250px;
            animation: shockwave-kf 0.7s ease-out forwards;
          }

          @keyframes crit-shockwave-kf {
            from {
                scale: 0.1;
                opacity: 1;
                box-shadow: 0 0 15px 8px #fef08a, inset 0 0 10px 4px #fef08a;
            }
            to {
                scale: 1;
                opacity: 0;
                box-shadow: 0 0 40px 20px rgba(254, 240, 138, 0), inset 0 0 20px 10px rgba(254, 240, 138, 0);
            }
          }
          .animate-crit-shockwave {
            width: 400px;
            height: 400px;
            border-width: 3px;
            animation: crit-shockwave-kf 1s ease-out forwards;
          }

          /* --- Particle Styles --- */
          .animate-energy-particle { width: 5px; height: 5px; background-color: #67e8f9; border-radius: 50%; box-shadow: 0 0 5px #67e8f9; animation: particle-burst 1s ease-out forwards; }
          .animate-quark-particle { width: 3px; height: 3px; background-color: #f87171; border-radius: 50%; animation: particle-burst 1s ease-out forwards; }
          .animate-proton-particle { width: 4px; height: 4px; background-color: #93c5fd; border-radius: 50%; animation: particle-swirl 1s ease-out forwards; }
          .animate-atom-particle { width: 10px; height: 10px; border: 1px solid #c4b5fd; border-radius: 50%; position: relative; animation: particle-fade-out 1s ease-out forwards; }
          .animate-atom-particle::before { content: ''; position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; background: #c4b5fd; border-radius: 50%; transform: translate(-50%, -50%); }
          .animate-star-particle { width: 10px; height: 10px; background-color: #fef08a; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); animation: particle-burst 1s ease-out forwards; }
          .animate-dark-matter-particle { width: 4px; height: 4px; background-color: #a78bfa; border-radius: 50%; box-shadow: 0 0 5px #8b5cf6; animation: particle-burst 1s ease-out forwards; }

          @keyframes particle-burst {
            from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            to { transform: translate(calc(-50% + var(--rand1) * 90px), calc(-50% + var(--rand2) * 90px)) scale(0); opacity: 0; }
          }
          @keyframes particle-swirl {
            from { transform: translate(-50%, -50%) rotate(0deg) scale(1.2); opacity: 1; }
            to { transform: translate(calc(-50% + var(--rand1) * 70px), calc(-50% + var(--rand2) * 70px)) rotate(360deg) scale(0); opacity: 0; }
          }
          @keyframes particle-fade-out {
            from { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
            to { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          }
        `}</style>
    </div>
  );
};

export default ClickerArea;
