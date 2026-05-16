export const ROLES = ['GAME_MASTER', 'DECISION_MAKER', 'COMMUNITY_MEMBER', 'EXPERT', 'OBSERVER', 'MEDIA'] as const;
export type Role = typeof ROLES[number];

export const GAME_PHASES = ['INTRODUCTION', 'PROPOSAL_CREATION', 'EXCHANGE', 'REVISION', 'PRESENTATION', 'EVALUATION'] as const;
export type GamePhase = typeof GAME_PHASES[number];

export const CARD_TYPES = ['SEASON', 'EXTREME_EVENT', 'UNCERTAINTY', 'POWER'] as const;
export type CardType = typeof CARD_TYPES[number];

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description: string;
  impact?: {
    ecological?: number;
    social?: number;
    economic?: number;
  };
}

export interface Proposal {
  id: string;
  team: 'TEAM_A' | 'TEAM_B';
  content: string;
  comments: string[];
  lastUpdated: number;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface GameState {
  roomCode?: string;
  currentPhase: GamePhase;
  phaseStartTime: number;
  activeSeason: Card | null;
  activeExtremeEvent: Card | null;
  activeUncertainty: Card | null;
  proposals: {
    TEAM_A: Proposal;
    TEAM_B: Proposal;
  };
  powerCardsUsed: {
    TEAM_A: number;
    TEAM_B: number;
  };
  consultationActive: boolean;
  consultationTimer: number;
  consultingTeam: 'TEAM_A' | 'TEAM_B' | null;
  mediaMessages: Message[];
}
