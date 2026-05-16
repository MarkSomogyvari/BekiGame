import { useState, useEffect } from 'react';
import type { GameState, GamePhase, Card, Proposal, Message } from '../types/game';

const INITIAL_STATE: GameState = {
  currentPhase: 'INTRODUCTION',
  phaseStartTime: Date.now(),
  activeSeason: null,
  activeExtremeEvent: null,
  activeUncertainty: null,
  proposals: {
    TEAM_A: { id: 'p_a', team: 'TEAM_A', content: '', comments: [], lastUpdated: Date.now() },
    TEAM_B: { id: 'p_b', team: 'TEAM_B', content: '', comments: [], lastUpdated: Date.now() },
  },
  powerCardsUsed: {
    TEAM_A: 0,
    TEAM_B: 0,
  },
  consultationActive: false,
  consultationTimer: 0,
  consultingTeam: null,
  mediaMessages: [],
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('bekigame_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('bekigame_state', JSON.stringify(state));
  }, [state]);

  const setPhase = (phase: GamePhase) => {
    setState(prev => ({
      ...prev,
      currentPhase: phase,
      phaseStartTime: Date.now(),
    }));
  };

  const updateProposal = (team: 'TEAM_A' | 'TEAM_B', content: string) => {
    setState(prev => ({
      ...prev,
      proposals: {
        ...prev.proposals,
        [team]: { ...prev.proposals[team], content, lastUpdated: Date.now() }
      }
    }));
  };

  const addComment = (targetTeam: 'TEAM_A' | 'TEAM_B', comment: string) => {
    setState(prev => ({
      ...prev,
      proposals: {
        ...prev.proposals,
        [targetTeam]: { 
          ...prev.proposals[targetTeam], 
          comments: [...prev.proposals[targetTeam].comments, comment] 
        }
      }
    }));
  };

  const drawCard = (type: 'SEASON' | 'EXTREME_EVENT' | 'UNCERTAINTY', card: Card) => {
    setState(prev => ({
      ...prev,
      [`active${type.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join('')}`]: card
    }));
  };

  const usePowerCard = (team: 'TEAM_A' | 'TEAM_B') => {
    setState(prev => ({
      ...prev,
      powerCardsUsed: {
        ...prev.powerCardsUsed,
        [team]: prev.powerCardsUsed[team] + 1
      },
      consultationActive: true,
      consultationTimer: 120, // 2 minutes
      consultingTeam: team
    }));
  };

  const endConsultation = () => {
    setState(prev => ({
      ...prev,
      consultationActive: false,
      consultationTimer: 0,
      consultingTeam: null
    }));
  };

  const sendMediaMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Media Bureau',
      text,
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      mediaMessages: [newMessage, ...prev.mediaMessages]
    }));
  };

  const resetGame = () => setState(INITIAL_STATE);

  return { 
    state, 
    setPhase, 
    updateProposal, 
    addComment, 
    drawCard, 
    usePowerCard,
    endConsultation,
    sendMediaMessage,
    resetGame 
  };
}
