
import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';
import AdminMenu from './AdminMenu';
import CreditsModal from './CreditsModal';


interface StartScreenProps {
  onStart: (initialState?: Partial<GameState>) => void;
  secretStarCoords: { x: number; y: number } | null;
  onOpenSettings: () => void;
}

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number;
  color: string;
}

interface BackgroundStar {
    x: number; y: number;
    size: number;
    opacity: number;
    speed: number;
}

interface ShootingStar {
    id: number;
    x: number; y: number;
    vx: number; vy: number;
    life: number;
}

interface SolarFlare {
    angle: number;
    targetLength: number;
    currentLength: number;
    width: number;
    life: number;
    maxLife: number;
    hue: number;
    type: 'loop' | 'jet';
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, secretStarCoords, onOpenSettings }) => {
  const [phase, setPhase] = useState(0); // 0:Void, 1:Singularity, 2:UI, 3:Collapse, 4:Flash, 5:Explosion
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  
  // Refs for Big Bang animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Refs for Background animation
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgStarsRef = useRef<BackgroundStar[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const flaresRef = useRef<SolarFlare[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Check for save game
  useEffect(() => {
      const saved = localStorage.getItem('cosmicClickerState');
      if (saved) {
          setHasSave(true);
      }
  }, []);

  // State machine for intro sequence
  useEffect(() => {
    if (phase === 0) { // Void
      const timer = setTimeout(() => setPhase(1), 500);
      return () => clearTimeout(timer);
    }
    if (phase === 1) { // Singularity appears
      const timer = setTimeout(() => setPhase(2), 1500);
      return () => clearTimeout(timer);
    }
    if (phase === 3) { // UI fades out, singularity collapses
      const timer = setTimeout(() => setPhase(4), 500);
      return () => clearTimeout(timer);
    }
    if (phase === 4) { // Flash
      const timer = setTimeout(() => setPhase(5), 200);
      return () => clearTimeout(timer);
    }
    if (phase === 5) { // Explosion
      const timer = setTimeout(() => onStart(), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, onStart]);

  const handleStartClick = () => {
    if (phase === 2) {
      setPhase(3);
    }
  };

  const handleLoadClick = () => {
      const saved = localStorage.getItem('cosmicClickerState');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              onStart(parsed);
          } catch (e) {
              console.error("Failed to load save", e);
              handleStartClick();
          }
      }
  }

  // --- LIVING BACKGROUND ANIMATION ---
  useEffect(() => {
      const canvas = bgCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;

      const resizeBg = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resizeBg);
      resizeBg();

      // Init BG Stars
      const starCount = 200;
      bgStarsRef.current = [];
      for(let i=0; i<starCount; i++) {
          bgStarsRef.current.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 1.5 + 0.5,
              opacity: Math.random(),
              speed: Math.random() * 0.05 + 0.02
          });
      }

      const handleMouseMove = (e: MouseEvent) => {
          mouseRef.current = { 
              x: (e.clientX - window.innerWidth/2) / 50, 
              y: (e.clientY - window.innerHeight/2) / 50 
          };
      };
      window.addEventListener('mousemove', handleMouseMove);

      const renderBg = () => {
        // Fade out background during Big Bang phases
        if (phase >= 3) {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             return;
        }

        // Deep Space BG
        const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
        gradient.addColorStop(0, '#1e1b4b'); // Indigo-950 (center light)
        gradient.addColorStop(0.4, '#020617'); // Slate-950
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- SOLAR ACTIVITY (Center) ---
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        
        const sunRadius = 64; // Matches the w-32 (128px) button size

        // Turbulent Corona (Glow)
        const time = Date.now();
        // Slowed down the pulse significantly to reduce vibration.
        // Longer periods (1000ms and 300ms) make it breathe instead of buzz.
        const coronaPulse = Math.sin(time / 1000) * 4 + Math.sin(time / 300) * 2; 
        const coronaSize = sunRadius + 15 + coronaPulse;
        
        const coronaGrad = ctx.createRadialGradient(0, 0, sunRadius * 0.9, 0, 0, coronaSize + 50);
        coronaGrad.addColorStop(0, 'rgba(253, 186, 116, 0.6)'); // Orange-300
        coronaGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.2)'); // Orange-500
        coronaGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(0, 0, coronaSize + 50, 0, Math.PI * 2);
        ctx.fill();

        // Spawn Flares
        // Reduced spawn chance from 0.08 to 0.03 for less chaotic activity
        if (Math.random() < 0.03) { 
            flaresRef.current.push({
                angle: Math.random() * Math.PI * 2,
                targetLength: 30 + Math.random() * 60,
                currentLength: 0,
                width: 1 + Math.random() * 3,
                life: 60 + Math.random() * 60,
                maxLife: 120,
                hue: Math.random() > 0.8 ? 60 : 30 + Math.random() * 20, // Mostly orange/red, rarely yellow
                type: Math.random() > 0.7 ? 'jet' : 'loop'
            });
        }

        // Render Flares
        flaresRef.current = flaresRef.current.filter(f => f.life > 0);
        flaresRef.current.forEach(f => {
            f.life--;
            if (f.currentLength < f.targetLength) {
                // Slower growth for smoothness (0.05 instead of 0.1)
                f.currentLength += (f.targetLength - f.currentLength) * 0.05;
            }

            const startX = Math.cos(f.angle) * sunRadius;
            const startY = Math.sin(f.angle) * sunRadius;
            const alpha = Math.min(1, f.life / 20);
            
            ctx.strokeStyle = `hsla(${f.hue}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = f.width;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${f.hue}, 100%, 50%, ${alpha})`;

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            if (f.type === 'loop') {
                // Magnetic Loop: Curves out and returns to surface
                const loopSpan = 0.3 + Math.random() * 0.2; // Angular span of the loop
                const endX = Math.cos(f.angle + loopSpan) * sunRadius;
                const endY = Math.sin(f.angle + loopSpan) * sunRadius;
                
                const cpDist = sunRadius + f.currentLength;
                const cpX = Math.cos(f.angle + loopSpan/2) * cpDist;
                const cpY = Math.sin(f.angle + loopSpan/2) * cpDist;
                
                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            } else {
                // Plasma Jet: Shoots straight out and curves slightly
                const endDist = sunRadius + f.currentLength;
                const endX = Math.cos(f.angle) * endDist;
                const endY = Math.sin(f.angle) * endDist;
                
                // Add a little wiggle
                const cpX = Math.cos(f.angle + 0.1) * (sunRadius + f.currentLength * 0.5);
                const cpY = Math.sin(f.angle + 0.1) * (sunRadius + f.currentLength * 0.5);
                
                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        ctx.restore();
        
        // Nebulae Clouds (Simple large gradients moving slowly)
        const t = Date.now() / 5000;
        const nebulaX = Math.sin(t) * 100 + mouseRef.current.x * 5;
        const nebulaY = Math.cos(t * 0.8) * 50 + mouseRef.current.y * 5;
        
        // Purple Nebula
        const pGrad = ctx.createRadialGradient(
            canvas.width * 0.2 + nebulaX, canvas.height * 0.8 + nebulaY, 0, 
            canvas.width * 0.2 + nebulaX, canvas.height * 0.8 + nebulaY, 400
        );
        pGrad.addColorStop(0, 'rgba(147, 51, 234, 0.05)');
        pGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = pGrad;
        ctx.fillRect(0,0, canvas.width, canvas.height);

        // Cyan Nebula
        const cGrad = ctx.createRadialGradient(
            canvas.width * 0.8 - nebulaX, canvas.height * 0.2 - nebulaY, 0, 
            canvas.width * 0.8 - nebulaX, canvas.height * 0.2 - nebulaY, 500
        );
        cGrad.addColorStop(0, 'rgba(34, 211, 238, 0.05)');
        cGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = cGrad;
        ctx.fillRect(0,0, canvas.width, canvas.height);


        // Parallax Stars
        ctx.fillStyle = 'white';
        bgStarsRef.current.forEach(star => {
            // Twinkle
            if(Math.random() < 0.01) star.opacity = Math.random();
            
            // Parallax movement
            const dx = mouseRef.current.x * star.size;
            const dy = mouseRef.current.y * star.size;

            ctx.globalAlpha = star.opacity * 0.8;
            ctx.beginPath();
            ctx.arc(star.x + dx, star.y + dy, star.size, 0, Math.PI*2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Shooting Stars
        if (Math.random() < 0.01) {
             shootingStarsRef.current.push({
                 id: Math.random(),
                 x: Math.random() * canvas.width,
                 y: Math.random() * canvas.height * 0.5,
                 vx: (Math.random() - 0.5) * 10,
                 vy: Math.random() * 10 + 5,
                 life: 1
             });
        }

        shootingStarsRef.current = shootingStarsRef.current.filter(s => s.life > 0);
        shootingStarsRef.current.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.02;
            
            const tailX = s.x - s.vx * 5;
            const tailY = s.y - s.vy * 5;

            const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
            grad.addColorStop(1, `rgba(255,255,255,0)`);
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
        });


        animationId = requestAnimationFrame(renderBg);
      };
      renderBg();

      return () => {
          window.removeEventListener('resize', resizeBg);
          window.removeEventListener('mousemove', handleMouseMove);
          cancelAnimationFrame(animationId);
      };
  }, [phase]);


  // --- BIG BANG ANIMATION ---
  useEffect(() => {
    if (phase !== 5 || !canvasRef.current) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const PARTICLE_COUNT = 3000;
    const FIELD_OF_VIEW = canvas.width * 0.7;
    const PARTICLE_COLORS = ['#fefcbf', '#fbb040', '#f7941d', '#fff'];


    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = Math.random() * 10 + 6;

        particlesRef.current.push({
            x: 0,
            y: 0,
            z: Math.random() * 100 + 200, // Start behind the singularity
            vx: speed * Math.sin(phi) * Math.cos(theta),
            vy: speed * Math.sin(phi) * Math.sin(theta),
            vz: speed * Math.cos(phi) - 15, // Strong bias towards camera for "fly-through"
            size: Math.random() * 2 + 1,
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.25)'; // Fading trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        
        const scale = FIELD_OF_VIEW / (FIELD_OF_VIEW + p.z);

        if (p.z < -FIELD_OF_VIEW || scale < 0) {
            // Reset particle for continuous effect if needed
        } else {
            const screenX = centerX + p.x * scale;
            const screenY = centerY + p.y * scale;
            const screenSize = p.size * scale;
            
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, screenSize, 0, Math.PI * 2);
            ctx.fill();
        }
      });
      animationFrameId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [phase]);

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-black text-white select-none overflow-hidden">
      
       {/* LIVING BACKGROUND CANVAS */}
       <canvas 
        ref={bgCanvasRef}
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${phase >= 3 ? 'opacity-0' : 'opacity-100'}`}
       />
       
      {/* Overlay for readability (lighter now since we have a dynamic bg) */}
      <div 
        className={`absolute inset-0 bg-gradient-radial from-transparent to-black/60 pointer-events-none transition-opacity duration-1000 ${phase >= 3 ? 'opacity-0' : 'opacity-100'}`}
      />


      {/* Big Bang Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${phase === 5 ? 'opacity-100' : 'opacity-0'} z-30 pointer-events-none`}
      />

      {/* Big Bang Flash */}
      <div className={`absolute w-1 h-1 bg-white rounded-full transition-all ease-in-out z-40
          ${phase === 4 ? 'duration-200 scale-[2000] opacity-100' : 'duration-500 scale-0 opacity-0'}
          ${phase === 5 ? '!opacity-0 !duration-1000' : ''}`} // Fade out flash as particles appear
      />
      
      {/* Title */}
      <div className={`absolute top-10 md:top-20 z-10 flex flex-col items-center text-center transition-all duration-1000 
          ${phase === 2 ? 'opacity-80' : 'opacity-0 pointer-events-none'}
          ${phase >= 3 ? '!opacity-0' : ''}`}
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-300 via-purple-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
          Cosmic Clicker
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-2 drop-shadow-md">A Universe Story</p>
      </div>

      {/* HELIOCENTRIC MENU */}
      <div className={`absolute z-20 flex items-center justify-center w-[600px] h-[600px] transition-all duration-1000 
          ${phase === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}
          ${phase >= 3 ? '!opacity-0 !scale-0' : ''} group`}
      >
          {/* CENTRAL SUN (Start Button) */}
          <div className="relative z-30">
              <button
                onClick={handleStartClick}
                className="w-32 h-32 rounded-full text-white font-bold shadow-[0_0_30px_10px_rgba(253,186,116,0.3)] hover:shadow-[0_0_50px_15px_rgba(253,186,116,0.5)] transition-all duration-500 transform hover:scale-110 animate-pulse-slow flex flex-col items-center justify-center overflow-hidden border-2 border-yellow-200/20"
              >
                  {/* Sun Texture */}
                  <div className="absolute inset-0 sun-texture"></div>
                  
                  <span className="relative z-10 text-xl tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">BEGIN</span>
                  <span className="relative z-10 text-xs text-yellow-100 opacity-80 mt-1 font-semibold">Singularity</span>
              </button>
          </div>

          {/* ORBIT 1: Continue (Earth/Moon) */}
          <div className="absolute inset-0 animate-orbit-1 group-hover:pause-animation">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-full h-full pointer-events-none">
                    <button 
                        onClick={handleLoadClick}
                        disabled={!hasSave}
                        // Position updated: left-[68%] moves it closer to center (approx 110px radius from center)
                        className={`pointer-events-auto absolute top-1/2 left-[68%] -translate-y-1/2 w-20 h-20 -ml-10 rounded-full flex flex-col items-center justify-center transition-transform z-20 animate-counter-orbit-1 
                           shadow-lg hover:scale-110 overflow-hidden border-2
                          ${hasSave 
                            ? 'shadow-[0_0_25px_rgba(16,185,129,0.5)] border-green-400/30 cursor-pointer text-white' 
                            : 'shadow-[0_0_15px_rgba(255,255,255,0.2)] border-gray-500/30 cursor-not-allowed text-gray-300'}`}
                        title={hasSave ? "Continue Saved Game" : "No Save Found"}
                    >
                         {/* Planet Texture */}
                         <div className={`absolute inset-0 ${hasSave ? 'terra-texture' : 'moon-texture'}`}></div>
                         {/* Atmosphere/Shadow Overlay */}
                         <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-black/60 pointer-events-none"></div>

                        <div className="relative z-10 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-[1px]">
                           <span className="font-bold text-xs">Continue</span>
                        </div>
                    </button>
                </div>
                {/* Orbit line guide */}
                <div className={`absolute inset-[32%] rounded-full border pointer-events-none ${hasSave ? 'border-green-500/20' : 'border-gray-700/30'}`}></div>
          </div>

          {/* ORBIT 2: Credits & Settings */}
          <div className="absolute inset-0 animate-orbit-2 group-hover:pause-animation">
               {/* Credits Planet (Ice Giant) */}
              <button 
                    onClick={() => setIsCreditsOpen(true)}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-110 transition-transform flex flex-col items-center justify-center border border-cyan-400/30 animate-counter-orbit-2 text-white z-20 overflow-hidden"
                    title="Credits"
                >
                    <div className="absolute inset-0 ice-giant-texture"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-black/70 pointer-events-none"></div>
                    <div className="relative z-10 bg-black/40 px-1.5 py-0.5 rounded">
                      <span className="font-bold text-[10px] uppercase">Archives</span>
                    </div>
              </button>
              
              {/* Settings Planet (Ringed Gas Giant) */}
              <button 
                    onClick={onOpenSettings}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:scale-110 transition-transform flex items-center justify-center animate-counter-orbit-2 z-20"
                    title="Settings"
                >
                   <div className="absolute inset-0 rounded-full bg-gray-700 gas-giant-texture overflow-hidden border-2 border-gray-600">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/70"></div>
                   </div>
                   {/* Ring */}
                   <div className="absolute top-1/2 left-1/2 w-[180%] h-[25%] bg-gray-300/30 rounded-[50%] border border-gray-400/50 transform -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] shadow-[0_0_5px_rgba(255,255,255,0.2)]"></div>
                   
                   <div className="relative z-10 bg-black/40 px-1 rounded">
                    <span className="text-[9px] text-gray-100 font-bold uppercase">Config</span>
                   </div>
              </button>

               <div className="absolute inset-[5%] rounded-full border border-cyan-500/10 pointer-events-none"></div>
          </div>

          {/* ORBIT 3: Admin Comet (Eccentric) */}
          <div className="absolute w-[140%] h-[140%] animate-orbit-3 group-hover:pause-animation pointer-events-none">
               <button 
                    onClick={() => setIsAdminMenuOpen(true)}
                    className="pointer-events-auto absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-800 shadow-[0_0_15px_rgba(220,38,38,0.6)] hover:bg-red-500 transition-colors flex items-center justify-center animate-counter-orbit-3 z-10 border border-red-400/50"
                    title="Admin"
                >
                     <span className="font-bold text-[9px] text-white drop-shadow-md">ADMIN</span>
                     {/* Comet Tail */}
                     <div className="absolute right-[80%] top-1/2 -translate-y-1/2 w-16 h-6 bg-gradient-to-l from-red-500/80 to-transparent rounded-full blur-md -z-10"></div>
              </button>
              <div className="absolute inset-[25%] rounded-[40%] border border-red-500/10 rotate-45 pointer-events-none"></div>
          </div>

      </div>

      {isAdminMenuOpen && <AdminMenu onStart={onStart} onClose={() => setIsAdminMenuOpen(false)} secretStarCoords={secretStarCoords} />}
      {isCreditsOpen && <CreditsModal onClose={() => setIsCreditsOpen(false)} />}

      <style>{`
        /* --- PLANET TEXTURES --- */
        
        /* Sun: Burning Plasma */
        .sun-texture {
            background: radial-gradient(circle at 30% 30%, #fef08a, #f59e0b, #b91c1c);
            background-size: 300% 300%;
            animation: sun-shift 15s infinite alternate;
        }
        @keyframes sun-shift { from { background-position: 0% 0%; } to { background-position: 100% 100%; } }

        /* Terra: Green/Blue Marble */
        .terra-texture {
             background: 
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.2) 100%),
                conic-gradient(from 0deg, #059669 0deg, #059669 40deg, #2563eb 40deg, #2563eb 90deg, #059669 90deg, #059669 130deg, #2563eb 130deg, #2563eb 180deg, #059669 180deg, #059669 240deg, #2563eb 240deg, #2563eb 300deg, #059669 300deg);
             filter: blur(0.5px);
             background-size: cover;
        }

        /* Moon: Darker Grey Rock */
        .moon-texture {
            background-color: #4b5563;
            background-image: 
                radial-gradient(circle at 20% 20%, #374151 5%, transparent 6%),
                radial-gradient(circle at 80% 40%, #1f2937 10%, transparent 11%),
                radial-gradient(circle at 40% 70%, #374151 8%, transparent 9%),
                radial-gradient(circle at 70% 80%, #1f2937 4%, transparent 5%);
        }

        /* Ice Giant: Banded Blue */
        .ice-giant-texture {
             background: linear-gradient(135deg, #67e8f9, #06b6d4, #0e7490);
             background-size: 200% 200%;
        }

        /* Gas Giant: Light Green Banded */
        .gas-giant-texture {
             background: linear-gradient(160deg, #d1fae5, #34d399, #047857, #34d399);
             background-size: 200% 200%;
        }

        /* --- ANIMATIONS --- */
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 40px 10px rgba(124,58,237,0.5); }
          50% { transform: scale(1.05); opacity: 0.9; box-shadow: 0 0 50px 15px rgba(124,58,237,0.6); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        /* Orbit Animations */
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes counter-orbit { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }

        .animate-orbit-1 { animation: orbit 20s linear infinite; }
        .animate-counter-orbit-1 { animation: counter-orbit 20s linear infinite; }

        .animate-orbit-2 { animation: orbit 35s linear infinite; }
        .animate-counter-orbit-2 { animation: counter-orbit 35s linear infinite; }
        
        .animate-orbit-3 { animation: orbit 15s linear infinite reverse; } /* Comet moves faster and reverse */
        .animate-counter-orbit-3 { animation: counter-orbit 15s linear infinite reverse; }

        .group-hover\\:pause-animation:hover {
            animation-play-state: paused;
        }
        .group-hover\\:pause-animation:hover * {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
