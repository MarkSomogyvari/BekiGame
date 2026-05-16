import type { GamePhase } from '../types/game';

export const PHASE_CONFIG: Record<string, { duration: number; title: string; description: string }> = {
  INTRODUCTION: {
    duration: 0,
    title: 'Introduction',
    description: 'Game Master explains the purpose and scenario.',
  },
  PROPOSAL_CREATION: {
    duration: 1200, // 20 minutes
    title: 'Proposal Creation',
    description: 'Teams develop proposals based on the current season.',
  },
  EXCHANGE: {
    duration: 600, // 10 minutes
    title: 'Exchange Proposals',
    description: 'Teams swap proposals and provide feedback.',
  },
  REVISION: {
    duration: 600, // 10 minutes
    title: 'Revise Proposals',
    description: 'Teams incorporate feedback into their final proposals.',
  },
  PRESENTATION: {
    duration: 600, // 5 minutes each (total 10)
    title: 'Presentation',
    description: 'Each team presents their final solution.',
  },
  EVALUATION: {
    duration: 0,
    title: 'Evaluation',
    description: 'Outcome analysis and impact assessment.',
  },
};

export const POWER_CARD_LIMIT = 4;
export const POWER_CARD_CONSULTATION_TIME = 120; // 2 minutes
