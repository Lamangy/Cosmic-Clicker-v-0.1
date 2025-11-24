
import React, { useRef, useEffect } from 'react';
import { ActiveEvent } from '../types';

export const WORLD_WIDTH = 3000;
export const WORLD_HEIGHT = 2000;

interface Electron { orbitRadius: number; angle: number; speed: number; size: number; }
interface GalaxyStar { b: number; theta0: number; size: number; history: { x: number; y: number }[]; }
interface Nebula { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number; alphaSpeed: number; baseAlpha: number; rotation: number; rotationSpeed: number; }
interface StarfieldParticle { x: number; y: number; size: number; alpha: number; twinkleSpeed: number; baseAlpha: number; }
interface SecretStar { x: number; y: number; size: number; phase: number; found: boolean; foundAnimation: number; }

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number;
  size: number; color: string;
  alpha: number; twinkleSpeed: number; twinkleBase: number;
  history: { x: number; y: number }[];
  rotation?: number; rotationSpeed?: number;
  galaxyStars?: GalaxyStar[]; electrons?: Electron[]; recombinationFlash?: number;
}

interface Firework {
    type: 'rocket' | 'particle';
    x: number; y: number;
    vx: number; vy: number;
    size: number; color: string;
    life: number; maxLife: number;
}

interface Comet {
    id: number;
    x: number; y: number;
    vx: number; vy: number;
    size: number;
    trail: {x: number, y: number, size: number}[];
    clicked: boolean;
    explodeProgress: number;
}


interface CosmicBackgroundProps {
  particleConfig: { count: number; colors: string[]; minSpeed: number; maxSpeed: number; minSize: number; maxSize: number; };
  epochName: string;
  activeEvent: ActiveEvent | null;
  isFireworksActive: boolean;
  isBonusActive: boolean;
  isGamePaused: boolean;
  onSecretFound: () => void;
  secretStarCoords: { x: number; y: number; };
  cameraOffset: { x: number; y: number };
  cameraZoom: number;
  onCometClick: () => void;
  lowPerformanceMode: boolean;
}

const EPOCH_GRAVITY_MAP: Record<string, number> = {
  'The Void': 0, 'Planck Epoch & The Big Bang': 0, 'Quark-Gluon Plasma': 0.00001, 'Hadron & Lepton Epochs': 0.00005, 'Nucleosynthesis': 0.0001, 'The First Stars': 0.0002, 'Galaxy Formation': 0.0003,
};

const FIREWORK_COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#84cc16', '#eab308', '#f97316'];


const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ particleConfig, epochName, activeEvent, isFireworksActive, isBonusActive, isGamePaused, onSecretFound, secretStarCoords, cameraOffset, cameraZoom, onCometClick, lowPerformanceMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const starfieldRef = useRef<StarfieldParticle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const cometsRef = useRef<Comet[]>([]);
  const nextFireworkLaunch = useRef(0);
  const animationState = useRef({ blackHoleFactor: 0, supernovaFactor: 0, cmbFactor: 0, strongForceFactor: 0, recombinationFactor: 0 });
  const supernovaState = useRef<{ x: number; y: number; progress: number } | null>(null);
  const recombinationState = useRef({ progress: 0 });
  const secretStarRef = useRef<SecretStar | null>(null);


  const createParticles = () => {
    const particles: Particle[] = [];
    // When low performance is on, reduce particle count (this is also handled in App.tsx prop passing, but safety here too)
    const actualCount = particleConfig.count;

    if (epochName === 'Nucleosynthesis') {
       for (let i = 0; i < actualCount; i++) {
            const z = Math.random() * 0.9 + 0.1;
            const isHelium = Math.random() < 0.25;
            const baseAlpha = Math.random() * 0.5 + 0.4;
            const baseSize = (Math.random() * (particleConfig.maxSize - particleConfig.minSize) + particleConfig.minSize) * z;
            const p: Particle = {
                x: Math.random() * WORLD_WIDTH, y: Math.random() * WORLD_HEIGHT, z: z,
                vx: (Math.random() - 0.5) * (particleConfig.maxSpeed - particleConfig.minSpeed) + particleConfig.minSpeed,
                vy: (Math.random() - 0.5) * (particleConfig.maxSpeed - particleConfig.minSpeed) + particleConfig.minSpeed,
                size: baseSize * (isHelium ? 1.4 : 1), color: isHelium ? '#f472b6' : '#60a5fa',
                alpha: baseAlpha, twinkleSpeed: Math.random() * 0.02, twinkleBase: baseAlpha,
                history: [], electrons: [],
            };
            const numElectrons = isHelium ? 2 : 1;
            for (let j = 0; j < numElectrons; j++) {
                p.electrons?.push({
                    orbitRadius: p.size * (2.5 + Math.random() * 2 + j * 1.5), angle: Math.random() * Math.PI * 2,
                    speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1), size: p.size * 0.25,
                });
            }
            particles.push(p);
        }
    } else {
        for (let i = 0; i < actualCount; i++) {
        const z = Math.random() * 0.9 + 0.1;
        const baseAlpha = Math.random() * 0.5 + 0.4;
        const p: Particle = {
            x: Math.random() * WORLD_WIDTH, y: Math.random() * WORLD_HEIGHT, z: z,
            vx: (Math.random() - 0.5) * (particleConfig.maxSpeed - particleConfig.minSpeed) + particleConfig.minSpeed,
            vy: (Math.random() - 0.5) * (particleConfig.maxSpeed - particleConfig.minSpeed) + particleConfig.minSpeed,
            size: (Math.random() * (particleConfig.maxSize - particleConfig.minSize) + particleConfig.minSize),
            color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
            alpha: baseAlpha, twinkleSpeed: Math.random() * 0.02, twinkleBase: baseAlpha,
            history: [],
        };
        if (epochName === 'Galaxy Formation') {
            p.rotation = Math.random() * Math.PI * 2;
            p.rotationSpeed = (Math.random() - 0.5) * 0.005;
            p.galaxyStars = [];
            const arms = Math.random() > 0.5 ? 2 : 3; const starsPerArm = lowPerformanceMode ? 4 : 8; const b = 0.3 + Math.random() * 0.2;
            for (let arm = 0; arm < arms; arm++) {
                for (let starIdx = 0; starIdx < starsPerArm; starIdx++) {
                    p.galaxyStars.push({ b: b, theta0: (starIdx * 0.8) + (arm * (Math.PI * 2 / arms)), size: Math.max(0.5, p.size * 0.15 * (1 - starIdx / starsPerArm)), history: [], });
                }
            }
        } else {
            p.size *= z;
        }
        particles.push(p);
        }
    }
    particlesRef.current = particles;
  };
  
  const createNebulae = () => {
    const nebulae: Nebula[] = []; const NEBULA_COUNT = lowPerformanceMode ? 5 : 15;
    const NEBULA_COLORS = [ '147, 51, 234', '79, 70, 229', '8, 145, 178', '190, 24, 93', '5, 150, 105', ];
    for (let i = 0; i < NEBULA_COUNT; i++) {
        const baseAlpha = Math.random() * 0.05 + 0.05;
        nebulae.push({
            x: Math.random() * WORLD_WIDTH, y: Math.random() * WORLD_HEIGHT,
            vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1,
            radius: Math.random() * 200 + 300, color: NEBULA_COLORS[i % NEBULA_COLORS.length],
            alpha: baseAlpha, alphaSpeed: (Math.random() * 0.0002) + 0.0001, baseAlpha: baseAlpha,
            rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() - 0.5) * 0.0005,
        });
    }
    nebulaeRef.current = nebulae;
  };

  const createStarfield = () => {
    const stars: StarfieldParticle[] = [];
    const STAR_COUNT = lowPerformanceMode ? 500 : 1500;
    for (let i = 0; i < STAR_COUNT; i++) {
      const baseAlpha = Math.random() * 0.6 + 0.2;
      stars.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        size: Math.random() * 1.5 + 0.5,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.015,
        baseAlpha: baseAlpha,
      });
    }
    starfieldRef.current = stars;
  };
  
  const createSecretStar = () => {
      if (!secretStarRef.current && secretStarCoords) {
          secretStarRef.current = {
            x: secretStarCoords.x,
            y: secretStarCoords.y,
            size: 3,
            phase: Math.random() * Math.PI * 2,
            found: false,
            foundAnimation: 0,
        };
      }
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const resizeCanvas = () => {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas); 
    
    // Initial creation
    resizeCanvas();
    createParticles(); 
    createNebulae();
    createStarfield();
    createSecretStar();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
    }
  }, []);
  
  // Re-create visual elements when mode changes
  useEffect(() => {
      createStarfield();
      createNebulae();
  }, [lowPerformanceMode])

  useEffect(() => {
    createParticles();
  }, [particleConfig, epochName]);


  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isGamePaused) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      const worldX = canvasX / cameraZoom + cameraOffset.x;
      const worldY = canvasY / cameraZoom + cameraOffset.y;
      
      // Check Secret Star
      if (secretStarRef.current && !secretStarRef.current.found) {
          const star = secretStarRef.current;
          const dx = worldX - star.x;
          const dy = worldY - star.y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance < star.size * 5) {
              star.found = true;
              star.foundAnimation = 1;
              onSecretFound();
              return;
          }
      }
      
      // Check Comets
      cometsRef.current.forEach(comet => {
         if (comet.clicked) return;
         const dx = worldX - comet.x;
         const dy = worldY - comet.y;
         const distance = Math.sqrt(dx*dx + dy*dy);
         
         if (distance < 40) { // Generous hitbox for moving target
             comet.clicked = true;
             comet.explodeProgress = 1;
             onCometClick();
         }
      });
  };

  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return; let animationFrameId: number;
    const PARTICLE_TRAIL_LENGTH = lowPerformanceMode ? 3 : 7; const GALAXY_TRAIL_LENGTH = lowPerformanceMode ? 5 : 10;

    const render = (timestamp: number) => {
      ctx.fillStyle = 'rgb(17, 24, 39)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const { blackHoleFactor, supernovaFactor, cmbFactor, strongForceFactor, recombinationFactor } = animationState.current;
      const isBlackHoleActive = activeEvent?.event.visualEffect === 'black-hole';
      const isSupernovaActive = activeEvent?.event.visualEffect === 'supernova';
      const isCmbActive = activeEvent?.event.visualEffect === 'cmb-radiation';
      const isStrongForceActive = activeEvent?.event.visualEffect === 'strong-force-resonance';
      const isRecombinationActive = activeEvent?.event.visualEffect === 'recombination-cascade';

      animationState.current.blackHoleFactor += (isBlackHoleActive ? 1 - blackHoleFactor : 0 - blackHoleFactor) * 0.05;
      animationState.current.supernovaFactor += (isSupernovaActive ? 1 - supernovaFactor : 0 - supernovaFactor) * 0.05;
      animationState.current.cmbFactor += (isCmbActive ? 1 - cmbFactor : 0 - cmbFactor) * 0.1;
      animationState.current.strongForceFactor += (isStrongForceActive ? 1 - strongForceFactor : 0 - strongForceFactor) * 0.08;
      animationState.current.recombinationFactor += (isRecombinationActive ? 1 - recombinationFactor : 0 - recombinationFactor) * 0.08;

      if (isSupernovaActive && !supernovaState.current) {
        const side = Math.floor(Math.random() * 4); let x = 0, y = 0; const margin = 150;
        switch (side) {
            case 0: x = Math.random() * canvas.width; y = -margin; break; case 1: x = canvas.width + margin; y = Math.random() * canvas.height; break;
            case 2: x = Math.random() * canvas.width; y = canvas.height + margin; break; case 3: x = -margin; y = Math.random() * canvas.height; break;
        }
        supernovaState.current = { x: x / cameraZoom + cameraOffset.x, y: y / cameraZoom + cameraOffset.y, progress: 0 };
      } else if (!isSupernovaActive && supernovaState.current) { supernovaState.current = null; }
      if (isRecombinationActive) { recombinationState.current.progress += (1 - recombinationState.current.progress) * 0.03; }
      else if (recombinationState.current.progress > 0) { recombinationState.current.progress = 0; particlesRef.current.forEach(p => p.recombinationFlash = 0); }

      const { x: camX, y: camY } = cameraOffset;
      
      // Layer 1: Starfield (deepest)
      ctx.save();
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-camX * 0.2, -camY * 0.2);
      starfieldRef.current.forEach(s => {
        if (s.x < camX * 0.2 - 10 || s.x > camX * 0.2 + canvas.width / cameraZoom + 10 || s.y < camY * 0.2 - 10 || s.y > camY * 0.2 + canvas.height / cameraZoom + 10) return;
        s.alpha += s.twinkleSpeed;
        if (s.alpha > s.baseAlpha + 0.3 || s.alpha < s.baseAlpha - 0.3) {
            s.alpha = Math.max(0.1, Math.min(1, s.alpha));
            s.twinkleSpeed *= -1;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.restore();

      // Layer 2: Nebulae
      ctx.save();
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-camX * 0.5, -camY * 0.5);
      nebulaeRef.current.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.rotation += n.rotationSpeed; n.alpha += n.alphaSpeed;
        if (n.x < camX * 0.5 - n.radius || n.x > camX * 0.5 + canvas.width / cameraZoom + n.radius || n.y < camY * 0.5 - n.radius || n.y > camY * 0.5 + canvas.height / cameraZoom + n.radius) return;
        if (n.alpha > n.baseAlpha + 0.05 || n.alpha < n.baseAlpha - 0.05) { n.alpha = Math.max(0.02, Math.min(0.15, n.alpha)); n.alphaSpeed *= -1; }
        if (n.x + n.radius < 0) n.x = WORLD_WIDTH + n.radius; if (n.x - n.radius > WORLD_WIDTH) n.x = -n.radius;
        if (n.y + n.radius < 0) n.y = WORLD_HEIGHT + n.radius; if (n.y - n.radius > WORLD_HEIGHT) n.y = -n.radius;
        ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(n.rotation);
        
        // Expensive gradient: skip in low performance mode or simplify?
        // We keep it but reduce count significantly in LP mode
        const gradient = ctx.createRadialGradient(0, 0, (n.radius * 0.7) * 0.2, 0, 0, n.radius);
        gradient.addColorStop(0, `rgba(${n.color}, ${n.alpha})`); gradient.addColorStop(1, `rgba(${n.color}, 0)`);
        ctx.fillStyle = gradient; ctx.beginPath();
        if (ctx.ellipse) { ctx.ellipse(0, 0, n.radius, n.radius * 0.7, 0, 0, Math.PI * 2); } else { ctx.arc(0, 0, n.radius, 0, Math.PI * 2); }
        ctx.fill(); ctx.restore();
      });
      ctx.restore();
      
      const centerX = WORLD_WIDTH / 2; const centerY = WORLD_HEIGHT / 2; const gravityStrength = EPOCH_GRAVITY_MAP[epochName] || 0;
      const recombinationRadius = recombinationState.current.progress * Math.max(WORLD_WIDTH, WORLD_HEIGHT);

      // Layer 3: Main Particles & Comets
      ctx.save();
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-camX, -camY);
      
      // Spawn Comets randomly
      if (!isGamePaused && Math.random() < 0.002) { // 0.2% chance per frame
          const angle = Math.random() * Math.PI * 2;
          const startDist = Math.max(WORLD_WIDTH, WORLD_HEIGHT) * 0.8;
          const speed = 2 + Math.random() * 3;
          cometsRef.current.push({
              id: Date.now() + Math.random(),
              x: centerX + Math.cos(angle) * startDist,
              y: centerY + Math.sin(angle) * startDist,
              vx: -Math.cos(angle) * speed + (Math.random() - 0.5),
              vy: -Math.sin(angle) * speed + (Math.random() - 0.5),
              size: 4 + Math.random() * 2,
              trail: [],
              clicked: false,
              explodeProgress: 0
          });
      }

      // Process and Render Comets
      cometsRef.current = cometsRef.current.filter(comet => {
          if (comet.clicked) {
             comet.explodeProgress -= 0.05;
             if (comet.explodeProgress <= 0) return false;
             
             ctx.beginPath();
             ctx.arc(comet.x, comet.y, 50 * (1 - comet.explodeProgress), 0, Math.PI * 2);
             ctx.fillStyle = `rgba(255, 215, 0, ${comet.explodeProgress})`;
             ctx.fill();
             return true;
          }

          comet.x += comet.vx;
          comet.y += comet.vy;
          if (!lowPerformanceMode) {
              comet.trail.unshift({ x: comet.x, y: comet.y, size: comet.size });
              if (comet.trail.length > 20) comet.trail.pop();
          }
          
          // Draw Trail
          if (!lowPerformanceMode) {
              for (let i = 0; i < comet.trail.length; i++) {
                  const t = comet.trail[i];
                  const alpha = (1 - i / comet.trail.length) * 0.6;
                  ctx.beginPath();
                  ctx.arc(t.x, t.y, t.size * (1 - i/comet.trail.length), 0, Math.PI * 2);
                  ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
                  ctx.fill();
              }
          }
          
          // Draw Head
          ctx.beginPath();
          ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          if (!lowPerformanceMode) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0ea5e9';
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          // Cull far away comets
          const distSq = (comet.x - centerX)**2 + (comet.y - centerY)**2;
          return distSq < (Math.max(WORLD_WIDTH, WORLD_HEIGHT) * 1.5)**2;
      });


      // Secret Star
      const star = secretStarRef.current;
      if (star) {
          star.phase += 0.03;

          if (star.found) {
              if (star.foundAnimation > 0) {
                  star.foundAnimation -= 0.02;
                  const flareSize = star.size * 20 * (1 - star.foundAnimation);
                  const flareOpacity = star.foundAnimation;
                  ctx.beginPath();
                  const flareGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, flareSize);
                  flareGradient.addColorStop(0, `rgba(255, 255, 255, ${flareOpacity * 0.8})`);
                  flareGradient.addColorStop(0.5, `rgba(192, 132, 252, ${flareOpacity * 0.5})`);
                  flareGradient.addColorStop(1, `rgba(192, 132, 252, 0)`);
                  ctx.fillStyle = flareGradient;
                  ctx.arc(star.x, star.y, flareSize, 0, Math.PI * 2);
                  ctx.fill();
              }
              // Once animation is done, star is no longer drawn.
          } else {
              // Render the subtle, secret star if not found
              const pulse = Math.sin(star.phase) * 0.5 + 0.5;
              const finalAlpha = 0.7 + pulse * 0.3; // Pulses between 0.7 and 1.0

              if (!lowPerformanceMode) {
                  // A very faint, larger glow to make it stand out if you're looking closely
                  ctx.beginPath();
                  const haloGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 5);
                  haloGradient.addColorStop(0, `rgba(192, 132, 252, ${pulse * 0.1})`); // faint purple
                  haloGradient.addColorStop(1, `rgba(192, 132, 252, 0)`);
                  ctx.fillStyle = haloGradient;
                  ctx.arc(star.x, star.y, star.size * 5, 0, Math.PI * 2);
                  ctx.fill();
              }

              // The star itself
              ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
              ctx.beginPath();
              ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
              ctx.fill();
          }
      }
      
      particlesRef.current.forEach(p => {
        if (p.x < camX - 50 || p.x > camX + canvas.width / cameraZoom + 50 || p.y < camY - 50 || p.y > camY + canvas.height / cameraZoom + 50) return;
        if (gravityStrength > 0) { const dx = centerX - p.x; const dy = centerY - p.y; p.vx += dx * gravityStrength; p.vy += dy * gravityStrength; p.vx *= 0.997; p.vy *= 0.997; }
        if (blackHoleFactor > 0.01) { const dx = WORLD_WIDTH/2 - p.x; const dy = WORLD_HEIGHT/2 - p.y; const distSq = dx * dx + dy * dy; if (distSq > 10) { const dist = Math.sqrt(distSq); const gravity = (200 / distSq) * blackHoleFactor; p.vx += (dx / dist) * gravity; p.vy += (dy / dist) * gravity; p.vx -= (dy / dist) * gravity * 0.5; p.vy += (dx / dist) * gravity * 0.5; } if (distSq < 100 * 100) p.alpha *= 0.95; }
        p.x += p.vx * p.z; p.y += p.vy * p.z;
        if (epochName === 'Galaxy Formation') { const dx = p.x - centerX; const dy = p.y - centerY; const dist = Math.sqrt(dx * dx + dy * dy); if (dist > 1) { const spinSpeed = 0.1; p.x += -dy / dist * spinSpeed * p.z; p.y += dx / dist * spinSpeed * p.z; } }
        p.alpha += p.twinkleSpeed;
        if (p.alpha > p.twinkleBase + 0.4 || p.alpha < p.twinkleBase - 0.4) { p.alpha = Math.max(0.1, Math.min(1, p.alpha)); p.twinkleSpeed *= -1; }
        if (p.x < 0) p.x = WORLD_WIDTH; if (p.x > WORLD_WIDTH) p.x = 0; if (p.y < 0) p.y = WORLD_HEIGHT; if (p.y > WORLD_HEIGHT) p.y = 0;
        const r = parseInt(p.color.slice(1, 3), 16); const g = parseInt(p.color.slice(3, 5), 16); const b = parseInt(p.color.slice(5, 7), 16);
        const distToCenter = Math.sqrt((p.x - centerX)**2 + (p.y - centerY)**2);
        if (isRecombinationActive && distToCenter < recombinationRadius && !p.recombinationFlash) { p.recombinationFlash = 1; }
        let finalAlpha = p.alpha;
        if(p.recombinationFlash && p.recombinationFlash > 0){ finalAlpha = p.alpha + p.recombinationFlash * 0.8; p.recombinationFlash -= 0.05; }
        if (epochName === 'Nucleosynthesis' && p.electrons) {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`; ctx.fill();
            p.electrons.forEach(electron => {
                electron.angle += electron.speed; const electronX = p.x + Math.cos(electron.angle) * electron.orbitRadius; const electronY = p.y + Math.sin(electron.angle) * electron.orbitRadius;
                ctx.beginPath(); ctx.arc(electronX, electronY, electron.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(235, 235, 235, ${finalAlpha * 0.8})`; ctx.fill();
            });
        } else if (epochName === 'Galaxy Formation' && p.rotation !== undefined && p.rotationSpeed !== undefined && p.galaxyStars) {
            p.rotation += p.rotationSpeed; 
            
            if (!lowPerformanceMode) {
                const coreGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
                coreGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.5})`); coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                ctx.fillStyle = coreGradient; 
            } else {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
            }
            
            ctx.beginPath(); ctx.arc(p.x, p.y, lowPerformanceMode ? p.size : p.size * 2, 0, Math.PI * 2); ctx.fill();
            
            p.galaxyStars.forEach(star => {
                const currentAngle = p.rotation + star.theta0; const distance = (p.size) * Math.exp(star.b * star.theta0);
                const starX = p.x + Math.cos(currentAngle) * distance; const starY = p.y + Math.sin(currentAngle) * distance;
                
                if (!lowPerformanceMode) {
                    star.history.unshift({ x: starX, y: starY }); if (star.history.length > GALAXY_TRAIL_LENGTH) star.history.pop();
                    for (let i = 0; i < star.history.length; i++) {
                    const pos = star.history[i]; ctx.beginPath(); ctx.arc(pos.x, pos.y, star.size * ((star.history.length - i) / star.history.length), 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 215, 0, ${(1 - i / star.history.length) * finalAlpha * 0.5})`; ctx.fill();
                    }
                }
                ctx.beginPath(); ctx.arc(starX, starY, star.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.9})`; ctx.fill();
            });
        } else {
            if (!lowPerformanceMode) {
                p.history.unshift({ x: p.x, y: p.y }); if (p.history.length > PARTICLE_TRAIL_LENGTH) p.history.pop();
                for (let i = 0; i < p.history.length; i++) {
                    const pos = p.history[i]; ctx.beginPath(); ctx.arc(pos.x, pos.y, p.size * ((p.history.length - i) / p.history.length), 0, Math.PI * 2); ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(1 - i / p.history.length) * finalAlpha * 0.5})`; ctx.fill();
                }
            }
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`; ctx.fill();
        }
      });
      ctx.restore();

      // Overlays (no parallax, but translated by camera)
      ctx.save();
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-camX, -camY);
      if (strongForceFactor > 0.01) { ctx.lineWidth = 1.5 * strongForceFactor; for (let i = 0; i < particlesRef.current.length - 2; i += 3) { const p1 = particlesRef.current[i]; const p2 = particlesRef.current[i+1]; const p3 = particlesRef.current[i+2]; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.closePath(); ctx.strokeStyle = `rgba(96, 165, 250, ${0.4 * strongForceFactor})`; ctx.stroke(); } }
      if (recombinationFactor > 0.01) { const gradient = ctx.createRadialGradient(centerX, centerY, recombinationRadius * 0.8, centerX, centerY, recombinationRadius); gradient.addColorStop(0, `rgba(168, 85, 247, 0)`); gradient.addColorStop(1, `rgba(168, 85, 247, ${0.3 * recombinationFactor})`); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(centerX, centerY, recombinationRadius, 0, Math.PI * 2); ctx.fill(); }
      if (blackHoleFactor > 0.01) { ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(WORLD_WIDTH/2, WORLD_HEIGHT/2, 50 * blackHoleFactor, 0, Math.PI * 2); ctx.fill(); }
      if (supernovaState.current && supernovaFactor > 0.01) { const state = supernovaState.current; state.progress += (1 - state.progress) * 0.04; const currentRadius = Math.max(WORLD_WIDTH, WORLD_HEIGHT) * 1.2 * state.progress; const gradient = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, currentRadius); gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * supernovaFactor})`); gradient.addColorStop(0.05, `rgba(255, 255, 220, ${0.8 * supernovaFactor})`); gradient.addColorStop(0.2, `rgba(255, 204, 102, ${0.4 * supernovaFactor})`); gradient.addColorStop(1, `rgba(255, 153, 51, 0)`); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(state.x, state.y, currentRadius, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();

      // Screen-space overlays (no camera translation)
      // This block MUST come after all `ctx.restore()` calls for world-space items.
      ctx.save();
      if (blackHoleFactor > 0.01) { ctx.fillStyle = `rgba(0,0,0, ${0.7 * blackHoleFactor})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      if (cmbFactor > 0.01) { ctx.save(); ctx.globalAlpha = cmbFactor * 0.2; for (let i = 0; i < 500; i++) { const x = Math.random() * canvas.width; const y = Math.random() * canvas.height; const hue = Math.random() > 0.5 ? Math.random() * 60 : Math.random() * 60 + 180; ctx.fillStyle = `hsl(${hue}, 80%, 70%)`; ctx.fillRect(x, y, 1, 1); } ctx.restore(); }

      if (isFireworksActive) {
        if (timestamp > nextFireworkLaunch.current) {
            fireworksRef.current.push({ type: 'rocket', x: Math.random() * canvas.width * 0.6 + canvas.width * 0.2, y: canvas.height, vx: Math.random() * 2 - 1, vy: -(Math.random() * 2 + 5), size: Math.random() * 2 + 1, color: '#ffffff', life: 100, maxLife: 100 });
            nextFireworkLaunch.current = timestamp + Math.random() * 400 + 100;
        }
      }
      
      const newFireworks: Firework[] = [];
      fireworksRef.current = fireworksRef.current.filter(fw => {
          fw.x += fw.vx; fw.y += fw.vy; fw.life--;
          if (fw.type === 'rocket') { fw.vy += 0.05; if (fw.vy >= 0 || fw.life <= 0) { const burstColor = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]; const count = Math.random() * 50 + 50; for(let i=0; i<count; i++){ const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 5 + 1; newFireworks.push({ type: 'particle', x: fw.x, y: fw.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: Math.random() * 2 + 1, color: burstColor, life: 80, maxLife: 80 }); } return false; }
          } else { fw.vx *= 0.98; fw.vy *= 0.98; fw.vy += 0.08; if (fw.life <= 0) return false; }
          return true;
      });
      fireworksRef.current.push(...newFireworks);

      fireworksRef.current.forEach(fw => {
          ctx.globalAlpha = fw.life / fw.maxLife; ctx.fillStyle = fw.color; ctx.beginPath(); ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (isBonusActive) {
          ctx.save();
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = `rgba(252, 211, 77, 0.1)`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
      }

      ctx.restore(); // Restore from screen-space save

      animationFrameId = window.requestAnimationFrame(render);
    };
    render(performance.now());
    return () => { window.cancelAnimationFrame(animationFrameId); };
  }, [epochName, activeEvent, isFireworksActive, isBonusActive, cameraOffset, cameraZoom, lowPerformanceMode]);

  return <canvas ref={canvasRef} onClick={handleCanvasClick} className="absolute top-0 left-0 w-full h-full z-0 bg-gray-900" />;
};

export default CosmicBackground;
