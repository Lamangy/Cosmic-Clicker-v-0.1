
import React, { useReducer, useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { GameState, GameAction, Resource, CosmicLaw, ClickPayload, RandomEvent, ActiveEvent, Achievement, GameSettings } from './types';
import { EPOCHS, UPGRADES, COSMIC_LAWS, COMBO_DECAY_MS, COMBO_TIERS, CRITICAL_CHANCE, CRITICAL_MULTIPLIER, RANDOM_EVENTS, RANDOM_EVENT_CHANCE, RANDOM_EVENT_INTERVAL, ACHIEVEMENTS, PRESTIGE_UPGRADES, ACHIEVEMENT_BONUS_MULTIPLIER, ACHIEVEMENT_BONUS_DURATION_MS } from './constants';
import CosmicBackground, { WORLD_WIDTH, WORLD_HEIGHT } from './components/CosmicBackground';
import UpgradesPanel from './components/UpgradesPanel';
import ResourceDisplay from './components/ResourceDisplay';
import EpochDisplay from './components/EpochDisplay';
import ClickerArea from './components/ClickerArea';
import StartScreen from './components/StartScreen';
import EventAnnouncer from './components/EventAnnouncer';
import AchievementsPanel from './components/AchievementsPanel';
import AchievementUnlockedScreen from './components/AchievementUnlockedScreen';
import PrestigePanel from './components/PrestigePanel';
import AdminMenu from './components/AdminMenu';
import SettingsModal from './components/SettingsModal';
import * as soundService from './services/soundService';
import HeisenbergLawDisplay from './components/HeisenbergLawDisplay';
import MassEnergyEquivalenceDisplay from './components/MassEnergyEquivalenceDisplay';
import StrongNuclearForceDisplay from './components/StrongNuclearForceDisplay';
import NucleosynthesisDisplay from './components/NucleosynthesisDisplay';
import KeplersThirdLawDisplay from './components/KeplersThirdLawDisplay';
import NewtonsLawOfGravitationDisplay from './components/NewtonsLawOfGravitationDisplay';
import CoordinateDisplay from './components/CoordinateDisplay';


const formatNumberStandard = (num: number): string => {
  if (num < 1000) return num.toFixed(1).replace(/\.0$/, '');
  const si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  if (num >= 1E21) {
    return num.toExponential(2);
  }
  return (num / si[i].value).toFixed(2).replace(rx, "$1") + si[i].symbol;
};

const formatNumberScientific = (num: number): string => {
    if (num < 1000) return num.toFixed(1).replace(/\.0$/, '');
    return num.toExponential(2).replace('+', '');
}


const initialState: GameState = {
  resources: {
    [Resource.ENERGY]: 0,
    [Resource.QUARK]: 0,
    [Resource.PROTON]: 0,
    [Resource.ATOM]: 0,
    [Resource.STAR]: 0,
    [Resource.DARK_MATTER]: 0,
  },
  upgrades: {},
  currentEpochIndex: 0,
  lastTick: Date.now(),
  comboCount: 0,
  lastClickTimestamp: 0,
  activeEvent: null,
  totalClicks: 0,
  unlockedAchievements: {},
  cosmicEssence: 0,
  prestigeUpgrades: {},
  totalStarsEver: 0,
  achievementBonus: null,
};

const defaultSettings: GameSettings = {
    masterVolume: 0.5,
    lowPerformanceMode: false,
    scientificNotation: false,
};

// Helper to calculate click gains outside of component
const calculateClickGains = (state: GameState) => {
    const energyPrestigeMultiplier = 1 + ((state.prestigeUpgrades['primordial_power'] || 0) * 0.02);
    let energy = 1;
    let quarks = 0;
    let atomsFromClickUpgrade = 0;
    const eventClickMultiplier = state.activeEvent?.event.effects.clickMultiplier ?? 1;
    const comboTier = COMBO_TIERS.slice().reverse().find(t => state.comboCount >= t.count);
    const comboMultiplier = comboTier ? comboTier.multiplier : 1;

    Object.entries(state.upgrades).forEach(([upgradeId, level]) => {
        const upgrade = UPGRADES[upgradeId];
        if (upgrade) {
            upgrade.effects.forEach(effect => {
                if (effect.type === 'click') {
                    if (effect.resource === Resource.ENERGY) energy += effect.value * level;
                    if (effect.resource === Resource.QUARK) quarks += effect.value * level;
                    if (effect.resource === Resource.ATOM) atomsFromClickUpgrade += effect.value * level;
                }
            });
        }
    });

    const gains: Partial<Record<Resource, number>> = {};
    if (energy > 0) gains[Resource.ENERGY] = energy * comboMultiplier * eventClickMultiplier * energyPrestigeMultiplier;
    if (quarks > 0) gains[Resource.QUARK] = quarks * comboMultiplier * eventClickMultiplier;

    let protons = 0;
    if (state.upgrades['proton_unlock'] > 0) protons = 1;
    if (state.upgrades['proton_formation'] > 0) protons += 1;
    if (protons > 0) gains[Resource.PROTON] = protons;

    let atomsCreated = 0;
    if (state.upgrades['atom_unlock'] > 0) atomsCreated += 1;
    if (atomsFromClickUpgrade > 0) atomsCreated += (atomsFromClickUpgrade * comboMultiplier * eventClickMultiplier);
    if (atomsCreated > 0) gains[Resource.ATOM] = atomsCreated;

    let stars = 0;
    if (state.upgrades['star_unlock'] > 0) stars = 1;
    if (stars > 0) gains[Resource.STAR] = stars;

    return gains;
};


const gameReducer = (state: GameState, action: GameAction): GameState => {
  const energyPrestigeMultiplier = 1 + ((state.prestigeUpgrades['primordial_power'] || 0) * 0.02);
  const idlePrestigeMultiplier = 1 + ((state.prestigeUpgrades['idle_architects'] || 0) * 0.02);
  const bonusMultiplier = state.achievementBonus ? state.achievementBonus.multiplier : 1;
  
  switch (action.type) {
    case 'CLICK': {
      const { isCritical, timestamp } = action.payload;
      const newState: GameState = { ...state, resources: { ...state.resources } };

      const comboMaintained = (timestamp - state.lastClickTimestamp) < COMBO_DECAY_MS;
      const comboCount = comboMaintained ? state.comboCount + 1 : 1;
      const comboTier = COMBO_TIERS.slice().reverse().find(t => comboCount >= t.count);
      const comboMultiplier = comboTier ? comboTier.multiplier : 1;
      const critMultiplier = isCritical ? CRITICAL_MULTIPLIER : 1;
      const eventClickMultiplier = state.activeEvent?.event.effects.clickMultiplier ?? 1;
      const totalMultiplier = comboMultiplier * critMultiplier * eventClickMultiplier;

      let baseEnergy = 1;
      let baseQuarks = 0;
      let baseAtomsFromUpgrades = 0;

      Object.entries(state.upgrades).forEach(([upgradeId, level]) => {
        const upgrade = UPGRADES[upgradeId];
        if (upgrade) {
          upgrade.effects.forEach(effect => {
            if (effect.type === 'click') {
              if (effect.resource === Resource.ENERGY) baseEnergy += effect.value * level;
              if (effect.resource === Resource.QUARK) baseQuarks += effect.value * level;
              if (effect.resource === Resource.ATOM) baseAtomsFromUpgrades += effect.value * level;
            }
          });
        }
      });
      
      newState.resources[Resource.ENERGY] += baseEnergy * totalMultiplier * energyPrestigeMultiplier * bonusMultiplier;
      if (baseQuarks > 0) newState.resources[Resource.QUARK] += baseQuarks * totalMultiplier * bonusMultiplier;
      
      if (state.upgrades['proton_unlock'] > 0 && newState.resources[Resource.QUARK] >= 3) {
        newState.resources[Resource.QUARK] -= 3;
        newState.resources[Resource.PROTON] += 1 * bonusMultiplier;
      }

      if (state.upgrades['proton_formation'] > 0 && newState.resources[Resource.QUARK] >= 100) {
        newState.resources[Resource.QUARK] -= 100;
        newState.resources[Resource.PROTON] += 1 * bonusMultiplier;
      }
       
      if (state.upgrades['atom_unlock'] > 0 && newState.resources[Resource.PROTON] >= 1) {
          newState.resources[Resource.PROTON] -= 1;
          newState.resources[Resource.ATOM] += 1 * bonusMultiplier;
      }
      
      if (baseAtomsFromUpgrades > 0) {
        const atomsToCreate = Math.floor(baseAtomsFromUpgrades * totalMultiplier);
        if (newState.resources[Resource.PROTON] >= atomsToCreate) {
          newState.resources[Resource.PROTON] -= atomsToCreate;
          newState.resources[Resource.ATOM] += atomsToCreate * bonusMultiplier;
        }
      }
      
      if (state.upgrades['star_unlock'] > 0 && newState.resources[Resource.ATOM] >= 1000) {
        const starsToCreate = 1 * bonusMultiplier;
        newState.resources[Resource.ATOM] -= 1000;
        newState.resources[Resource.STAR] += starsToCreate;
        newState.totalStarsEver = (state.totalStarsEver || 0) + starsToCreate;
      }

      newState.lastClickTimestamp = timestamp;
      newState.comboCount = comboCount;
      newState.totalClicks = (state.totalClicks || 0) + 1;
      
      return newState;
    }
    case 'TICK': {
      const { timestamp } = action.payload;
      const delta = (timestamp - state.lastTick) / 1000;
      const newResources = { ...state.resources };
      let newTotalStarsEver = state.totalStarsEver || 0;
      const eventIdleMultiplier = state.activeEvent?.event.effects.idleMultiplier ?? 1;
      
      const darkMatterGravityMultiplier = 1 + (state.resources[Resource.DARK_MATTER] || 0) * 0.001;


      Object.entries(state.upgrades).forEach(([upgradeId, level]) => {
        const upgrade = UPGRADES[upgradeId];
        if (upgrade) {
          upgrade.effects.forEach(effect => {
            if (effect.type === 'idle') {
              let gain = effect.value * level * delta * eventIdleMultiplier * idlePrestigeMultiplier * bonusMultiplier;
              if (effect.resource === Resource.ENERGY) {
                gain *= energyPrestigeMultiplier;
              }
              if (effect.resource === Resource.STAR) {
                  gain *= darkMatterGravityMultiplier;
              }
              newResources[effect.resource] += gain;
               if (effect.resource === Resource.STAR) {
                  newTotalStarsEver += gain;
              }
            }
          });
        }
      });

      // Dark Matter Logic
      const wimpLevel = state.upgrades['dark_matter_generation'] || 0;
      if (wimpLevel > 0) {
          const dmGain = (state.resources[Resource.STAR] / 1000) * wimpLevel * delta * 0.1;
          newResources[Resource.DARK_MATTER] = (newResources[Resource.DARK_MATTER] || 0) + dmGain;
      }

      // Auto-Clicker
      const darkEnergyLevel = state.upgrades['dark_energy_expansion'] || 0;
      if (darkEnergyLevel > 0) {
          const clicksPerSecond = darkEnergyLevel;
          const clickGains = calculateClickGains(state);
          const multiplier = clicksPerSecond * delta; 
          
          if (clickGains[Resource.ENERGY]) newResources[Resource.ENERGY] += clickGains[Resource.ENERGY]! * multiplier;
          if (clickGains[Resource.QUARK]) newResources[Resource.QUARK] = (newResources[Resource.QUARK] || 0) + clickGains[Resource.QUARK]! * multiplier;
          if (clickGains[Resource.PROTON]) newResources[Resource.PROTON] = (newResources[Resource.PROTON] || 0) + clickGains[Resource.PROTON]! * multiplier;
          if (clickGains[Resource.ATOM]) newResources[Resource.ATOM] = (newResources[Resource.ATOM] || 0) + clickGains[Resource.ATOM]! * multiplier;
          if (clickGains[Resource.STAR]) {
              const starGain = clickGains[Resource.STAR]! * multiplier;
              newResources[Resource.STAR] = (newResources[Resource.STAR] || 0) + starGain;
              newTotalStarsEver += starGain;
          }
      }

      return { ...state, resources: newResources, totalStarsEver: newTotalStarsEver, lastTick: timestamp };
    }
    case 'BUY_UPGRADE': {
      const { upgradeId } = action.payload;
      const upgrade = UPGRADES[upgradeId];
      if (!upgrade) return state;

      const currentLevel = state.upgrades[upgradeId] || 0;
      if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return state;

      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
      
      if (state.resources[upgrade.costResource] >= cost) {
        const newResources = { ...state.resources };
        newResources[upgrade.costResource] -= cost;
        const newUpgrades = { ...state.upgrades, [upgradeId]: (currentLevel + 1) };
        return { ...state, resources: newResources, upgrades: newUpgrades };
      }
      return state;
    }
    case 'ADVANCE_EPOCH': {
      const nextEpochIndex = state.currentEpochIndex + 1;
      if (nextEpochIndex >= EPOCHS.length) return state;
      const nextEpoch = EPOCHS[nextEpochIndex];

      if (state.resources[nextEpoch.unlockResource] >= nextEpoch.unlockCost) {
        const newResources = { ...state.resources };
        newResources[nextEpoch.unlockResource] -= nextEpoch.unlockCost;
        return { ...state, resources: newResources, currentEpochIndex: nextEpochIndex };
      }
      return state;
    }
     case 'START_EVENT': {
      const { event } = action.payload;
      const newState: GameState = { ...state, activeEvent: { event, startTime: Date.now() }};
      
      if (event.effects.instantGain) {
          newState.resources = { ...state.resources };
          for (const [resource, value] of Object.entries(event.effects.instantGain)) {
              if (value) {
                newState.resources[resource as Resource] += value * bonusMultiplier;
              }
          }
      }
      return newState;
    }
    case 'END_EVENT': {
      return { ...state, activeEvent: null };
    }
     case 'UNLOCK_ACHIEVEMENTS': {
      const newAchievements: Record<string, number> = {};
      action.payload.achievementIds.forEach(id => {
        newAchievements[id] = Date.now();
      });
      return {
        ...state,
        unlockedAchievements: { ...state.unlockedAchievements, ...newAchievements },
      };
    }
    case 'AWARD_SECRET_BONUS': {
        return {
            ...state,
            cosmicEssence: state.cosmicEssence + 1,
        };
    }
    case 'PRESTIGE': {
      if (state.currentEpochIndex < 6) return state;

      const essenceGained = Math.floor(Math.pow((state.totalStarsEver || 0) / 1e6, 0.5));
      if (essenceGained <= 0) return state;

      const newPrestigeUpgrades = { ...state.prestigeUpgrades };
      let startingEnergyUpgradeLevel = 0;
      if (newPrestigeUpgrades['cosmic_memory'] > 0) {
        startingEnergyUpgradeLevel = 5;
      }
      
      return {
        ...initialState,
        cosmicEssence: state.cosmicEssence + essenceGained,
        prestigeUpgrades: newPrestigeUpgrades,
        unlockedAchievements: state.unlockedAchievements,
        totalClicks: state.totalClicks,
        upgrades: startingEnergyUpgradeLevel > 0 ? { 'energy_click_1': startingEnergyUpgradeLevel } : {},
        lastTick: Date.now(),
      };
    }
    case 'BUY_PRESTIGE_UPGRADE': {
      const { upgradeId } = action.payload;
      const upgrade = PRESTIGE_UPGRADES[upgradeId];
      if (!upgrade) return state;

      const currentLevel = state.prestigeUpgrades[upgradeId] || 0;
      if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return state;

      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));

      if (state.cosmicEssence >= cost) {
        const newPrestigeUpgrades = { ...state.prestigeUpgrades, [upgradeId]: currentLevel + 1 };
        return {
          ...state,
          cosmicEssence: state.cosmicEssence - cost,
          prestigeUpgrades: newPrestigeUpgrades,
        };
      }
      return state;
    }
    case 'START_ACHIEVEMENT_BONUS':
      return {
        ...state,
        achievementBonus: {
          multiplier: ACHIEVEMENT_BONUS_MULTIPLIER,
          endTime: Date.now() + ACHIEVEMENT_BONUS_DURATION_MS,
        },
      };
    case 'END_ACHIEVEMENT_BONUS':
      return { ...state, achievementBonus: null };
    case 'RESET': {
      return { ...initialState, lastTick: Date.now() };
    }
    case 'SET_STATE': {
      return action.payload;
    }
    case 'UPDATE_LAST_TICK': {
      return { ...state, lastTick: action.payload.timestamp };
    }
    default:
      return state;
  }
};


function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [gameStarted, setGameStarted] = useState(false);
  const [particleDensity, setParticleDensity] = useState(1);
  const [fullscreenAchievement, setFullscreenAchievement] = useState<Achievement | null>(null);
  const [currentLaw, setCurrentLaw] = useState<CosmicLaw | null>(null);
  
  // Settings/Menu States
  const [activeTab, setActiveTab] = useState<'upgrades' | 'achievements' | 'singularity'>('upgrades');
  const [isPrestigeModalOpen, setIsPrestigeModalOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const [bonusTimer, setBonusTimer] = useState(0);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const prevAchievementsRef = useRef<Record<string, number>>({});
  const prevEpochIndexRef = useRef<number>(state.currentEpochIndex);
  
  const secretStarCoords = useRef<{ x: number; y: number } | null>(null);
  if (secretStarCoords.current === null) {
      secretStarCoords.current = {
        x: Math.random() * (WORLD_WIDTH - 200) + 100,
        y: Math.random() * (WORLD_HEIGHT - 200) + 100,
      };
  }

  // Camera controls state
  const [cameraOffset, setCameraOffset] = useState({ x: (WORLD_WIDTH - window.innerWidth) / 2, y: (WORLD_HEIGHT - window.innerHeight) / 2 });
  const [cameraZoom, setCameraZoom] = useState(1.0);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(true);

  // Initialize Settings from LocalStorage
  useEffect(() => {
      const savedSettings = localStorage.getItem('cosmicClickerSettings');
      if (savedSettings) {
          try {
              const parsed = JSON.parse(savedSettings);
              setSettings({ ...defaultSettings, ...parsed });
              soundService.setMasterVolume(parsed.masterVolume ?? 0.5);
          } catch (e) {
              console.error("Failed to load settings", e);
          }
      } else {
          soundService.setMasterVolume(0.5);
      }
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Partial<GameSettings>) => {
      setSettings(prev => {
          const updated = { ...prev, ...newSettings };
          localStorage.setItem('cosmicClickerSettings', JSON.stringify(updated));
          
          if (newSettings.masterVolume !== undefined) {
              soundService.setMasterVolume(newSettings.masterVolume);
          }
          
          return updated;
      });
  }, []);

  const playSoundEffect = useCallback((type: soundService.SoundType) => {
    soundService.playSound(type);
  }, []);
  
  const formatNumber = useCallback((num: number) => {
      return settings.scientificNotation ? formatNumberScientific(num) : formatNumberStandard(num);
  }, [settings.scientificNotation]);

  const isGamePaused = !!currentLaw || isPrestigeModalOpen || !!fullscreenAchievement || isAdminMenuOpen || isSettingsMenuOpen;

  // Auto-save
  useEffect(() => {
    if (!gameStarted) return;
    const saveInterval = setInterval(() => {
        localStorage.setItem('cosmicClickerState', JSON.stringify(state));
    }, 30000); 
    return () => clearInterval(saveInterval);
  }, [gameStarted, state]);

  useEffect(() => {
    if (!gameStarted || isGamePaused) return;
    
    const timer = setInterval(() => {
      dispatch({ type: 'TICK', payload: { timestamp: Date.now() } });
    }, 100);
    return () => clearInterval(timer);
  }, [gameStarted, isGamePaused]);
  

  useEffect(() => {
    if (!gameStarted || isGamePaused) return;

    const selectRandomEvent = (): RandomEvent | null => {
      const availableEvents = RANDOM_EVENTS.filter(
        (event) => event.requiredEpoch <= state.currentEpochIndex
      );
      if (availableEvents.length === 0) return null;
      const totalWeight = availableEvents.reduce((sum, event) => sum + event.weight, 0);
      let random = Math.random() * totalWeight;
      for (const event of availableEvents) {
        if (random < event.weight) return event;
        random -= event.weight;
      }
      return availableEvents[0];
    };

    const eventInterval = setInterval(() => {
      if (state.activeEvent) return; 

      if (Math.random() < RANDOM_EVENT_CHANCE) {
        const event = selectRandomEvent();
        if (event) {
          dispatch({ type: 'START_EVENT', payload: { event } });
          playSoundEffect('event');
          setTimeout(() => dispatch({ type: 'END_EVENT' }), event.duration);
        }
      }
    }, RANDOM_EVENT_INTERVAL);

    return () => clearInterval(eventInterval);
  }, [gameStarted, state.activeEvent, state.currentEpochIndex, playSoundEffect, isGamePaused]);
  
  useEffect(() => {
    if (!gameStarted || isGamePaused) return;

    const checkAchievements = () => {
      const newlyUnlockedIds: string[] = [];
      for (const achievement of Object.values(ACHIEVEMENTS)) {
        if (!state.unlockedAchievements[achievement.id]) {
          let unlocked = false;
          const { type, resource, target } = achievement.condition;
          switch (type) {
            case 'resource':
              if (resource && state.resources[resource] >= (target as number)) unlocked = true;
              break;
            case 'upgrade_level':
              const totalLevels = (Object.values(state.upgrades) as number[]).reduce((a, b) => a + b, 0);
              if (totalLevels >= (target as number)) unlocked = true;
              break;
            case 'epoch':
              if (state.currentEpochIndex >= (target as number)) unlocked = true;
              break;
            case 'clicks':
              if (state.totalClicks >= (target as number)) unlocked = true;
              break;
          }
          if (unlocked) {
            newlyUnlockedIds.push(achievement.id);
          }
        }
      }
      if (newlyUnlockedIds.length > 0) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENTS', payload: { achievementIds: newlyUnlockedIds }});
      }
    };
    checkAchievements();
  }, [state.resources, state.upgrades, state.currentEpochIndex, state.totalClicks, gameStarted, state.unlockedAchievements, isGamePaused]);
  
  useEffect(() => {
    const prevKeys = Object.keys(prevAchievementsRef.current);
    const currentKeys = Object.keys(state.unlockedAchievements);

    if (currentKeys.length > prevKeys.length && !fullscreenAchievement) {
        const newAchievementIds = currentKeys.filter(key => !prevKeys.includes(key));
        if(newAchievementIds.length > 0) {
            const achievementToShow = ACHIEVEMENTS[newAchievementIds[0]];
            setFullscreenAchievement(achievementToShow);
            playSoundEffect('achievement');
        }
    }
    prevAchievementsRef.current = state.unlockedAchievements;
  }, [state.unlockedAchievements, playSoundEffect, fullscreenAchievement]);
  
   useEffect(() => {
    if (!gameStarted) return;
    if (state.currentEpochIndex > prevEpochIndexRef.current) {
        const law = COSMIC_LAWS.find(l => l.epochIndex === state.currentEpochIndex);
        if (law) {
            setCurrentLaw(law);
        }
    }
    prevEpochIndexRef.current = state.currentEpochIndex;
  }, [state.currentEpochIndex, gameStarted]);

  useEffect(() => {
    if (!state.achievementBonus) {
        setBonusTimer(0);
        return;
    }

    const updateTimer = () => {
        const timeRemaining = state.achievementBonus.endTime - Date.now();
        if (timeRemaining <= 0) {
            dispatch({ type: 'END_ACHIEVEMENT_BONUS' });
            setBonusTimer(0);
        } else {
            setBonusTimer(timeRemaining);
        }
    };

    const interval = setInterval(updateTimer, 100);
    return () => clearInterval(interval);
}, [state.achievementBonus]);


  // Camera controls state for mouse pan and zoom
  useEffect(() => {
    if (!gameStarted || isGamePaused) return;

     const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
     };

     const handleMouseDown = (e: MouseEvent) => {
         if (e.button === 2) { // Right mouse button
            isPanning.current = true;
            panStart.current = { x: e.clientX, y: e.clientY };
         }
     };

     const handleMouseUp = (e: MouseEvent) => {
         if (e.button === 2) {
            isPanning.current = false;
         }
     };

     const handleMouseMove = (e: MouseEvent) => {
         if (!isPanning.current) return;

         const dx = e.clientX - panStart.current.x;
         const dy = e.clientY - panStart.current.y;
         panStart.current = { x: e.clientX, y: e.clientY };

         setCameraOffset(prev => {
             const newX = prev.x - dx / cameraZoom;
             const newY = prev.y - dy / cameraZoom;

             const maxOffsetX = WORLD_WIDTH - window.innerWidth / cameraZoom;
             const maxOffsetY = WORLD_HEIGHT - window.innerHeight / cameraZoom;

             return {
                 x: Math.max(0, Math.min(newX, maxOffsetX)),
                 y: Math.max(0, Math.min(newY, maxOffsetY)),
             };
         });
     };

     const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const ZOOM_SENSITIVITY = 0.001;
        const MIN_ZOOM = 0.4;
        const MAX_ZOOM = 3.0;

        setCameraZoom(prevZoom => {
            const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom * (1 - e.deltaY * ZOOM_SENSITIVITY)));

            setCameraOffset(prevOffset => {
                const worldX = prevOffset.x + e.clientX / prevZoom;
                const worldY = prevOffset.y + e.clientY / prevZoom;
                const newOffsetX = worldX - e.clientX / newZoom;
                const newOffsetY = worldY - e.clientY / newZoom;
                
                const maxOffsetX = WORLD_WIDTH - window.innerWidth / newZoom;
                const maxOffsetY = WORLD_HEIGHT - window.innerHeight / newZoom;

                return {
                    x: Math.max(0, Math.min(newOffsetX, maxOffsetX)),
                    y: Math.max(0, Math.min(newOffsetY, maxOffsetY)),
                };
            });
            return newZoom;
        });
     };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
        window.removeEventListener('contextmenu', handleContextMenu);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('wheel', handleWheel);
    };
  }, [gameStarted, isGamePaused, cameraZoom]);

  const handleStartGame = useCallback((initialGameState?: Partial<GameState>) => {
    if (initialGameState) {
        const fullInitialState: GameState = {
            ...initialState,
            ...initialGameState,
            resources: {
                ...initialState.resources,
                ...(initialGameState.resources || {}),
            },
            lastTick: Date.now(),
        };
        dispatch({ type: 'SET_STATE', payload: fullInitialState });
    } else {
        dispatch({ type: 'RESET' });
    }
    setGameStarted(true);
  }, []);
  
  const handleSaveGame = useCallback(() => {
      localStorage.setItem('cosmicClickerState', JSON.stringify(state));
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 2000);
      playSoundEffect('upgrade'); 
  }, [state, playSoundEffect]);

  const handleResetGame = useCallback(() => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      dispatch({ type: 'RESET' });
      setFullscreenAchievement(null);
      setCurrentLaw(null);
      setGameStarted(false);
      localStorage.removeItem('cosmicClickerState');
      setIsSettingsMenuOpen(false);
    }
  }, []);
  
  const handleCloseAchievementScreen = useCallback(() => {
    setFullscreenAchievement(null);
    dispatch({ type: 'START_ACHIEVEMENT_BONUS' });
    dispatch({ type: 'UPDATE_LAST_TICK', payload: { timestamp: Date.now() } });
  }, []);

  const handleCloseLawScreen = useCallback(() => {
    setCurrentLaw(null);
    dispatch({ type: 'UPDATE_LAST_TICK', payload: { timestamp: Date.now() } });
  }, []);
  
  const handleSecretFound = useCallback(() => {
    if (!state.unlockedAchievements['secret_star']) {
        playSoundEffect('secret_found');
        dispatch({ type: 'UNLOCK_ACHIEVEMENTS', payload: { achievementIds: ['secret_star'] }});
        dispatch({ type: 'AWARD_SECRET_BONUS' });
    }
  }, [state.unlockedAchievements, playSoundEffect]);

  const comboTier = useMemo(() => {
    if (Date.now() - state.lastClickTimestamp > COMBO_DECAY_MS) return undefined;
    return COMBO_TIERS.slice().reverse().find(t => state.comboCount >= t.count);
  }, [state.comboCount, state.lastClickTimestamp]);
  
  const comboMultiplier = useMemo(() => comboTier ? comboTier.multiplier : 1, [comboTier]);


  const clickGains = useMemo(() => calculateClickGains(state), [state.upgrades, comboMultiplier, state.activeEvent, state.prestigeUpgrades]);

  const handleAdvanceEpoch = useCallback(() => {
    const nextEpoch = EPOCHS[state.currentEpochIndex + 1];
    if (nextEpoch && state.resources[nextEpoch.unlockResource] >= nextEpoch.unlockCost) {
      playSoundEffect('epoch');
      dispatch({ type: 'ADVANCE_EPOCH' });
    }
  }, [state.currentEpochIndex, state.resources, playSoundEffect]);

  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = UPGRADES[upgradeId];
    const currentLevel = state.upgrades[upgradeId] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    if (upgrade && state.resources[upgrade.costResource] >= cost) {
      playSoundEffect('upgrade');
      dispatch({ type: 'BUY_UPGRADE', payload: { upgradeId } });
    }
  }, [state.upgrades, state.resources, playSoundEffect]);
  
  const handleBuyPrestigeUpgrade = useCallback((upgradeId: string) => {
    const upgrade = PRESTIGE_UPGRADES[upgradeId];
    const currentLevel = state.prestigeUpgrades[upgradeId] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    if (upgrade && state.cosmicEssence >= cost) {
        playSoundEffect('prestige_upgrade');
        dispatch({ type: 'BUY_PRESTIGE_UPGRADE', payload: { upgradeId } });
    }
  }, [state.cosmicEssence, state.prestigeUpgrades, playSoundEffect]);

  const handleClick = useCallback((payload: ClickPayload) => {
    playSoundEffect(payload.isCritical ? 'crit' : 'click');
    dispatch({ type: 'CLICK', payload });
  }, [playSoundEffect]);
  
  const handlePrestige = useCallback(() => {
      playSoundEffect('epoch');
      dispatch({ type: 'PRESTIGE' });
      setIsPrestigeModalOpen(false);
  }, [playSoundEffect]);
  
  const handleTriggerEvent = useCallback((event: RandomEvent) => {
      dispatch({ type: 'START_EVENT', payload: { event } });
      playSoundEffect('event');
      setTimeout(() => dispatch({ type: 'END_EVENT' }), event.duration);
      setIsAdminMenuOpen(false);
  }, [playSoundEffect]);

  // Reward for clicking a comet
  const handleCometClick = useCallback(() => {
      playSoundEffect('comet_click');
      
      const currentEpoch = EPOCHS[state.currentEpochIndex];
      const unlockResource = currentEpoch.unlockResource;
      
      let rewardAmount = 100;
      if (unlockResource === Resource.ENERGY) rewardAmount = 500 * (state.currentEpochIndex + 1);
      else if (unlockResource === Resource.QUARK) rewardAmount = 50 * (state.currentEpochIndex + 1);
      else if (unlockResource === Resource.PROTON) rewardAmount = 20 * (state.currentEpochIndex + 1);
      else if (unlockResource === Resource.ATOM) rewardAmount = 20 * (state.currentEpochIndex + 1);
      else if (unlockResource === Resource.STAR) rewardAmount = 5 * (state.currentEpochIndex + 1);

      const multiplier = (state.achievementBonus ? state.achievementBonus.multiplier : 1) * (state.activeEvent?.event.effects.clickMultiplier || 1);
      const finalReward = Math.floor(rewardAmount * multiplier);

      const instantGain: Partial<Record<Resource, number>> = {
          [unlockResource]: finalReward
      };

      dispatch({ 
          type: 'START_EVENT', 
          payload: { 
              event: {
                  id: `comet_${Date.now()}`,
                  name: 'Comet Captured!',
                  description: `You caught a passing comet and harvested ${finalReward} ${unlockResource}!`,
                  duration: 3000,
                  effects: { instantGain: instantGain },
                  weight: 0,
                  visualEffect: 'click-frenzy',
                  requiredEpoch: 0
              }
          } 
      });
      
  }, [state.currentEpochIndex, state.achievementBonus, state.activeEvent, playSoundEffect]);

  const currentEpoch = EPOCHS[state.currentEpochIndex];
  const nextEpoch = EPOCHS[state.currentEpochIndex + 1];
  
  const essenceToGain = useMemo(() => {
    if (state.currentEpochIndex < 6) return 0;
    return Math.floor(Math.pow((state.totalStarsEver || 0) / 1e6, 0.5));
  }, [state.currentEpochIndex, state.totalStarsEver]);

  // Adjust particle config based on settings
  const modifiedParticleConfig = useMemo(() => {
    let count = Math.floor(currentEpoch.particleConfig.count * particleDensity);
    if (settings.lowPerformanceMode) {
        count = Math.floor(count * 0.5); // Reduce by half in low performance
    }
    return {
        ...currentEpoch.particleConfig,
        count
    }
  }, [currentEpoch.particleConfig, particleDensity, settings.lowPerformanceMode]);

  const viewportCenter = useMemo(() => ({
    x: cameraOffset.x + (window.innerWidth / cameraZoom) / 2,
    y: cameraOffset.y + (window.innerHeight / cameraZoom) / 2,
  }), [cameraOffset, cameraZoom]);


  if (!gameStarted) {
    return (
      <>
        <StartScreen 
          onStart={handleStartGame} 
          secretStarCoords={secretStarCoords.current} 
          onOpenSettings={() => setIsSettingsMenuOpen(true)} 
        />
        {isSettingsMenuOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setIsSettingsMenuOpen(false)}
            gameState={state}
            onLoadGame={handleStartGame}
            onResetGame={handleResetGame}
          />
        )}
      </>
    );
  }
  
  const renderLawComponent = () => {
    if (!currentLaw) return null;
    const props = { law: currentLaw, onClose: handleCloseLawScreen };
    switch (currentLaw.epochIndex) {
        case 1: return <HeisenbergLawDisplay {...props} />;
        case 2: return <MassEnergyEquivalenceDisplay {...props} />;
        case 3: return <StrongNuclearForceDisplay {...props} />;
        case 4: return <NucleosynthesisDisplay {...props} />;
        case 5: return <KeplersThirdLawDisplay {...props} />;
        case 6: return <NewtonsLawOfGravitationDisplay {...props} />;
        default: return null;
    }
  };


  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col md:flex-row bg-gray-900 text-gray-100 select-none animate-game-fade-in">
      {renderLawComponent()}
      {state.achievementBonus && (
        <div className="absolute inset-0 z-30 pointer-events-none border-8 border-yellow-400/80 animate-bonus-glow" />
      )}
      <CosmicBackground 
        particleConfig={modifiedParticleConfig} 
        epochName={currentEpoch.name} 
        activeEvent={state.activeEvent}
        isFireworksActive={false}
        isBonusActive={!!state.achievementBonus}
        isGamePaused={isGamePaused}
        onSecretFound={handleSecretFound}
        secretStarCoords={secretStarCoords.current!}
        cameraOffset={cameraOffset}
        cameraZoom={cameraZoom}
        onCometClick={handleCometClick}
        lowPerformanceMode={settings.lowPerformanceMode}
      />
      
      {isPrestigeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in" onClick={() => setIsPrestigeModalOpen(false)}>
              <div className="relative w-11/12 max-w-lg bg-gray-800/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 p-6 m-4 text-white animate-slide-in-up" onClick={e => e.stopPropagation()}>
                  <h2 className="text-2xl font-bold text-purple-300 text-center">Collapse the Universe?</h2>
                  <p className="text-center text-gray-300 mt-4">Reset your progress to gain a permanent boost. The knowledge of your previous existence will echo through the next.</p>
                  <div className="my-6 p-4 bg-black/30 border border-gray-700 rounded-lg text-center">
                      <p className="text-sm text-gray-400">You will gain</p>
                      <p className="text-3xl font-bold text-purple-300 my-1">{formatNumber(essenceToGain)}</p>
                      <p className="text-sm text-gray-400">Cosmic Essence</p>
                  </div>
                  <div className="text-sm text-yellow-300 bg-yellow-900/50 p-3 rounded-lg border border-yellow-700">
                      <p className="font-bold mb-2">The following will be reset:</p>
                      <ul className="list-disc list-inside text-yellow-200">
                          <li>All Resources (Energy, Quarks, etc.)</li>
                          <li>All standard Upgrade levels</li>
                          <li>Your current Epoch</li>
                      </ul>
                       <p className="font-bold mt-3 mb-2">You will KEEP:</p>
                       <ul className="list-disc list-inside text-yellow-200">
                          <li>Achievements</li>
                          <li>Cosmic Essence and Singularity upgrades</li>
                      </ul>
                  </div>
                  <div className="flex justify-center items-center mt-6 space-x-4">
                      <button onClick={() => setIsPrestigeModalOpen(false)} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-colors">Cancel</button>
                      <button onClick={handlePrestige} disabled={essenceToGain <= 0} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">Begin Anew</button>
                  </div>
              </div>
          </div>
      )}
      
      {fullscreenAchievement && (
        <AchievementUnlockedScreen
          achievement={fullscreenAchievement}
          onClose={handleCloseAchievementScreen}
        />
      )}
      
      {showSaveNotification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-green-800/90 border border-green-400 text-white rounded-full shadow-xl animate-slide-down flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Game Saved Successfully!</span>
          </div>
      )}

      {isAdminMenuOpen && (
          <AdminMenu 
            onStart={handleStartGame} 
            onClose={() => setIsAdminMenuOpen(false)} 
            secretStarCoords={secretStarCoords.current}
            onTriggerEvent={handleTriggerEvent}
          />
      )}

      {isSettingsMenuOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setIsSettingsMenuOpen(false)}
            gameState={state}
            onLoadGame={handleStartGame}
            onResetGame={handleResetGame}
          />
      )}

      <EventAnnouncer activeEvent={state.activeEvent} />

      
      <main className="z-10 w-full md:w-3/5 lg:w-2/3 h-full flex flex-col items-center justify-center p-4 md:p-8 order-2 md:order-1">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center backdrop-blur-sm bg-black/30 rounded-2xl p-4 md:p-6 shadow-2xl shadow-cyan-500/10">
          <EpochDisplay epoch={currentEpoch} />
          {state.achievementBonus && (
             <div className="w-full max-w-md p-2 mb-4 text-center bg-yellow-400/20 border-2 border-yellow-500 rounded-lg animate-pulse">
                <p className="text-xl font-bold text-yellow-300">VICTOR'S SPOILS ACTIVE!</p>
                <p className="text-sm text-white">{ACHIEVEMENT_BONUS_MULTIPLIER}x Resource Yield for {(bonusTimer / 1000).toFixed(1)}s</p>
             </div>
          )}
          <ResourceDisplay resources={state.resources} formatNumber={formatNumber} cosmicEssence={state.cosmicEssence} />
          <ClickerArea 
            onClick={handleClick} 
            epochName={currentEpoch.name} 
            clickGains={clickGains}
            formatNumber={formatNumber}
            comboCount={state.comboCount}
            comboMultiplier={comboMultiplier}
            lastClickTimestamp={state.lastClickTimestamp}
            activeEvent={state.activeEvent}
            prestigeUpgrades={state.prestigeUpgrades}
            useScientificNotation={settings.scientificNotation}
          />
           <div className="mt-6 w-full max-w-md mx-auto">
            <label htmlFor="particle-density" className="block text-sm font-medium text-gray-400 mb-2 text-center">
              Particle Density: {Math.round(particleDensity * 100)}%
            </label>
            <input
              id="particle-density"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={particleDensity}
              onChange={(e) => setParticleDensity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
          <div className="mt-6 w-full max-w-md mx-auto">
            {nextEpoch ? (
                <>
                  <div className="relative w-full bg-gray-700/50 rounded-full h-6 mb-2 border border-gray-600 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, (state.resources[nextEpoch.unlockResource] / nextEpoch.unlockCost) * 100)}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>
                            {formatNumber(state.resources[nextEpoch.unlockResource])} / {formatNumber(nextEpoch.unlockCost)} {nextEpoch.unlockResource}
                        </span>
                    </div>
                  </div>
                  <button
                    onClick={handleAdvanceEpoch}
                    disabled={state.resources[nextEpoch.unlockResource] < nextEpoch.unlockCost}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105"
                  >
                    Advance to {nextEpoch.name}
                  </button>
                </>
            ) : state.currentEpochIndex >= 6 && (
                 <div className="mt-4 border-t-2 border-purple-500/30 pt-4">
                     <p className="text-purple-300 text-sm mb-2">You've reached the edge of known physics. Collapse this timeline to begin anew with greater knowledge.</p>
                     <button onClick={() => setIsPrestigeModalOpen(true)} className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 via-purple-900 to-black text-white font-bold rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                         Collapse the Universe ({formatNumber(essenceToGain)} CE)
                     </button>
                 </div>
             )}
          </div>
        </div>
      </main>

      <aside className="z-10 w-full md:w-2/5 lg:w-1/3 h-1/2 md:h-full overflow-hidden p-4 order-1 md:order-2 bg-black/50 md:bg-black/30 md:backdrop-blur-sm flex flex-col">
        <div className="flex-shrink-0 mb-4 border-b-2 border-gray-700">
            <nav className="flex space-x-2">
                <button 
                    onClick={() => setActiveTab('upgrades')} 
                    className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all duration-300 border-b-2 ${
                        activeTab === 'upgrades' 
                        ? 'bg-gray-800 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'text-gray-400 border-transparent hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                >
                    Upgrades
                </button>
                <button 
                    onClick={() => setActiveTab('achievements')} 
                    className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all duration-300 border-b-2 ${
                        activeTab === 'achievements' 
                        ? 'bg-gray-800 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'text-gray-400 border-transparent hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                >
                    Achievements
                </button>
                <button 
                    onClick={() => setActiveTab('singularity')} 
                    className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all duration-300 border-b-2 ${
                        activeTab === 'singularity' 
                        ? 'bg-gray-800 text-purple-300 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                        : 'text-gray-400 border-transparent hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                >
                    Singularity
                </button>
            </nav>
        </div>
        <div className="flex-grow overflow-y-auto pr-1">
          {activeTab === 'upgrades' && (
            <UpgradesPanel 
                upgrades={state.upgrades} 
                resources={state.resources} 
                currentEpochIndex={state.currentEpochIndex}
                onBuyUpgrade={handleBuyUpgrade}
                formatNumber={formatNumber}
              />
          )}
          {activeTab === 'achievements' && (
             <AchievementsPanel unlockedAchievements={state.unlockedAchievements} gameState={state} formatNumber={formatNumber}/>
          )}
           {activeTab === 'singularity' && (
             <PrestigePanel 
                prestigeUpgrades={state.prestigeUpgrades}
                cosmicEssence={state.cosmicEssence}
                onBuyPrestigeUpgrade={handleBuyPrestigeUpgrade}
                formatNumber={formatNumber}
                currentEpochIndex={state.currentEpochIndex}
                totalStarsEver={state.totalStarsEver || 0}
                onPrestige={() => setIsPrestigeModalOpen(true)}
             />
          )}
        </div>
      </aside>

      {gameStarted && (
        <CoordinateDisplay 
            viewportCenter={viewportCenter}
            zoom={cameraZoom}
            anomalyCoords={secretStarCoords.current}
            worldWidth={WORLD_WIDTH}
            worldHeight={WORLD_HEIGHT}
        />
      )}

      {showTooltip && gameStarted && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in">
            <p><strong>Right-click & drag</strong> to pan. <strong>Scroll</strong> to zoom.</p>
            <button 
              onClick={() => setShowTooltip(false)} 
              className="text-gray-400 hover:text-white text-xl leading-none"
              aria-label="Dismiss"
            >
              &times;
            </button>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
         <button
            onClick={() => setIsAdminMenuOpen(true)}
            className="px-3 py-1 bg-purple-800/50 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md"
            aria-label="Admin Menu"
        >
            Admin
        </button>
        <button
            onClick={() => setIsSettingsMenuOpen(true)}
            className="px-3 py-1 bg-gray-800/50 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md border border-cyan-600/30 flex items-center gap-1"
            aria-label="Settings"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
        </button>
        <button
            onClick={handleSaveGame}
            className="px-3 py-1 bg-green-800/50 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md border border-green-600/30"
            aria-label="Save Game"
        >
            Save
        </button>
      </div>
       <style>{`
          @keyframes game-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-game-fade-in {
            animation: game-fade-in 1s ease-in;
          }
           @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
           @keyframes slide-in-up {
            from { 
                opacity: 0;
                transform: translateY(20px) scale(0.98);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
          }
          .animate-slide-in-up {
            animation: slide-in-up 0.4s ease-out;
          }
          @keyframes bonus-glow-kf {
            0% { box-shadow: 0 0 20px 5px rgba(250, 204, 21, 0.4); }
            50% { box-shadow: 0 0 40px 15px rgba(250, 204, 21, 0.7); }
            100% { box-shadow: 0 0 20px 5px rgba(250, 204, 21, 0.4); }
          }
          .animate-bonus-glow {
            animation: bonus-glow-kf 1.5s ease-in-out infinite;
          }
          @keyframes slide-down {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
      `}</style>
    </div>
  );
}

export default App;
