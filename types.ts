
export enum Resource {
  ENERGY = 'Energy',
  QUARK = 'Quark',
  PROTON = 'Proton',
  ATOM = 'Hydrogen Atom',
  STAR = 'Star',
  DARK_MATTER = 'Dark Matter',
}

export type UpgradeEffect = {
  type: 'click' | 'idle';
  resource: Resource;
  value: number; // Base value, will be multiplied by upgrade level
};

export interface Upgrade {
  id: string;
  name:string;
  description: string;
  flavorText: string;
  costResource: Resource;
  baseCost: number;
  costMultiplier: number;
  maxLevel?: number;
  effects: UpgradeEffect[];
  requiredEpoch: number; // index of the epoch required to see this upgrade
  position?: { x: number; y: number }; // 0-100 percentage coordinates
  parents?: string[]; // IDs of prerequisite upgrades for visualization
}

export interface Epoch {
  name: string;
  time: string;
  description: string;
  unlockCost: number;
  unlockResource: Resource;
  particleConfig: {
    count: number;
    colors: string[];
    minSpeed: number;
    maxSpeed: number;
    minSize: number;
    maxSize: number;
  };
}

export interface EventEffect {
  idleMultiplier?: number;
  clickMultiplier?: number;
  instantGain?: Partial<Record<Resource, number>>;
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  duration: number; // in milliseconds
  effects: EventEffect;
  weight: number; // for controlling probability
  visualEffect: 'black-hole' | 'supernova' | 'click-frenzy' | 'cmb-radiation' | 'strong-force-resonance' | 'recombination-cascade';
  requiredEpoch: number;
}

export interface ActiveEvent {
  event: RandomEvent;
  startTime: number;
}


export interface GameState {
  resources: Record<Resource, number>;
  upgrades: Record<string, number>; // upgradeId: level
  currentEpochIndex: number;
  lastTick: number; // timestamp
  comboCount: number;
  lastClickTimestamp: number;
  activeEvent: ActiveEvent | null;
  totalClicks: number;
  unlockedAchievements: Record<string, number>; // achievementId: timestamp
  cosmicEssence: number;
  prestigeUpgrades: Record<string, number>; // prestigeUpgradeId: level
  totalStarsEver: number;
  achievementBonus: { multiplier: number; endTime: number } | null;
}

export interface GameSettings {
  masterVolume: number; // 0.0 to 1.0
  lowPerformanceMode: boolean;
  scientificNotation: boolean;
}

export interface CosmicLaw {
  epochIndex: number;
  title: string;
  formula?: string;
  explanation: string;
}

export interface ClickPayload {
  isCritical: boolean;
  timestamp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: {
    type: 'resource' | 'upgrade_level' | 'epoch' | 'clicks' | 'event' | 'secret';
    resource?: Resource;
    target: number | string; // amount, total levels, epoch index, click count, or event id
  };
  isSecret?: boolean;
}

export interface PrestigeUpgrade {
  id: string;
  name: string;
  description: (level: number) => string;
  baseCost: number;
  costMultiplier: number;
  maxLevel?: number;
}

export type GameAction =
  | { type: 'CLICK'; payload: ClickPayload }
  | { type: 'TICK'; payload: { timestamp: number } }
  | { type: 'BUY_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'ADVANCE_EPOCH' }
  | { type: 'RESET' }
  | { type: 'START_EVENT'; payload: { event: RandomEvent } }
  | { type: 'END_EVENT' }
  | { type: 'UNLOCK_ACHIEVEMENTS'; payload: { achievementIds: string[] } }
  | { type: 'SET_STATE'; payload: GameState }
  | { type: 'UPDATE_LAST_TICK'; payload: { timestamp: number } }
  | { type: 'PRESTIGE' }
  | { type: 'BUY_PRESTIGE_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'START_ACHIEVEMENT_BONUS' }
  | { type: 'END_ACHIEVEMENT_BONUS' }
  | { type: 'AWARD_SECRET_BONUS' };
