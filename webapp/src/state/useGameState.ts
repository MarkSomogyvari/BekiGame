import { useState, useEffect, useCallback } from 'react';
import type { GameState, GamePhase, Card, Message } from '../types/game';
import { supabase } from '../supabaseClient';

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
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial state from localStorage for persistence if no room
  useEffect(() => {
    if (!roomCode) {
      const saved = localStorage.getItem('bekigame_state');
      if (saved) setState(JSON.parse(saved));
    }
  }, [roomCode]);

  // Save to localStorage
  useEffect(() => {
    if (!roomCode) {
      localStorage.setItem('bekigame_state', JSON.stringify(state));
    }
  }, [state, roomCode]);

  // Sync with Supabase
  useEffect(() => {
    if (!roomCode || !import.meta.env.VITE_SUPABASE_URL) return;

    const fetchState = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('sessions')
        .select('state')
        .eq('room_code', roomCode)
        .single();

      if (data) {
        setState(data.state);
      }
      setIsLoading(false);
    };

    fetchState();

    const subscription = supabase
      .channel(`room:${roomCode}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'sessions', 
        filter: `room_code=eq.${roomCode}` 
      }, (payload) => {
        setState(payload.new.state);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomCode]);

  const updateRemoteState = useCallback(async (newState: GameState) => {
    if (!roomCode || !import.meta.env.VITE_SUPABASE_URL) return;

    await supabase
      .from('sessions')
      .update({ state: newState, updated_at: new Date().toISOString() })
      .eq('room_code', roomCode);
  }, [roomCode]);

  const createRoom = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newState = { ...INITIAL_STATE, roomCode: code };
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { error } = await supabase
        .from('sessions')
        .insert([{ room_code: code, state: newState }]);
      
      if (error) {
        console.error('Error creating room:', error);
        return;
      }
    }
    
    setRoomCode(code);
    setState(newState);
  };

  const joinRoom = async (code: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    
    setIsLoading(true);
    const { data } = await supabase
      .from('sessions')
      .select('state')
      .eq('room_code', code.toUpperCase())
      .single();

    if (data) {
      setRoomCode(code.toUpperCase());
      setState(data.state);
    } else {
      alert('Room not found');
    }
    setIsLoading(false);
  };

  const setPhase = (phase: GamePhase) => {
    const newState = {
      ...state,
      currentPhase: phase,
      phaseStartTime: Date.now(),
    };
    setState(newState);
    updateRemoteState(newState);
  };

  const updateProposal = (team: 'TEAM_A' | 'TEAM_B', content: string) => {
    const newState = {
      ...state,
      proposals: {
        ...state.proposals,
        [team]: { ...state.proposals[team], content, lastUpdated: Date.now() }
      }
    };
    setState(newState);
    updateRemoteState(newState);
  };

  const addComment = (targetTeam: 'TEAM_A' | 'TEAM_B', comment: string) => {
    const newState = {
      ...state,
      proposals: {
        ...state.proposals,
        [targetTeam]: { 
          ...state.proposals[targetTeam], 
          comments: [...state.proposals[targetTeam].comments, comment] 
        }
      }
    };
    setState(newState);
    updateRemoteState(newState);
  };

  const drawCard = (type: 'SEASON' | 'EXTREME_EVENT' | 'UNCERTAINTY', card: Card) => {
    const typeKey = `active${type.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join('')}` as keyof GameState;
    const newState = {
      ...state,
      [typeKey]: card
    };
    setState(newState);
    updateRemoteState(newState);
  };

  const usePowerCard = (team: 'TEAM_A' | 'TEAM_B') => {
    const newState = {
      ...state,
      powerCardsUsed: {
        ...state.powerCardsUsed,
        [team]: state.powerCardsUsed[team] + 1
      },
      consultationActive: true,
      consultationTimer: 120,
      consultingTeam: team
    };
    setState(newState);
    updateRemoteState(newState);
  };

  const endConsultation = () => {
    const newState = {
      ...state,
      consultationActive: false,
      consultationTimer: 0,
      consultingTeam: null
    };
    setState(newState);
    updateRemoteState(newState);
  };

  const sendMediaMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Media Bureau',
      text,
      timestamp: Date.now()
    };
    const newState = {
      ...state,
      mediaMessages: [newMessage, ...state.mediaMessages]
    };
    setState(newState);
    updateRemoteState(newState);
  };

  const resetGame = () => {
    setState(INITIAL_STATE);
    if (roomCode) updateRemoteState(INITIAL_STATE);
  };

  const leaveRoom = () => {
    setRoomCode(null);
    setState(INITIAL_STATE);
  };

  return { 
    state, 
    roomCode,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
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
