import { useState, useEffect, useCallback, useRef } from 'react';
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
  const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load initial state from localStorage for persistence if no room
  useEffect(() => {
    if (!roomCode) {
      const saved = localStorage.getItem('bekigame_state');
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (!roomCode || !isSupabaseConfigured) return;

    const fetchState = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('sessions')
          .select('state')
          .eq('room_code', roomCode)
          .single();

        if (error) throw error;
        if (data) setState(data.state);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
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
  }, [roomCode, isSupabaseConfigured]);

  const updateRemoteState = useCallback(async (newState: GameState) => {
    if (!roomCode || !isSupabaseConfigured) return;

    try {
      await supabase
        .from('sessions')
        .update({ state: newState, updated_at: new Date().toISOString() })
        .eq('room_code', roomCode);
    } catch (err) {
      console.error('Update error:', err);
    }
  }, [roomCode, isSupabaseConfigured]);

  const createRoom = async () => {
    setIsLoading(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newState = { ...INITIAL_STATE, roomCode: code };
      
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('sessions')
          .insert([{ room_code: code, state: newState }]);
        
        if (error) throw error;
      }
      
      setRoomCode(code);
      setState(newState);
    } catch (err) {
      console.error('Error creating room:', err);
      alert('Failed to create room on server. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (code: string) => {
    if (!isSupabaseConfigured) {
      alert('Cloud sync is not configured.');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('state')
        .eq('room_code', code.toUpperCase())
        .single();

      if (error) throw error;
      if (data) {
        setRoomCode(code.toUpperCase());
        setState(data.state);
      }
    } catch (err) {
      console.error('Join error:', err);
      alert('Room not found or connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const setPhase = useCallback((phase: GamePhase) => {
    const newState = {
      ...stateRef.current,
      currentPhase: phase,
      phaseStartTime: Date.now(),
    };
    setState(newState);
    updateRemoteState(newState);
  }, [updateRemoteState]);

  const updateProposal = useCallback((team: 'TEAM_A' | 'TEAM_B', content: string) => {
    const newState = {
      ...stateRef.current,
      proposals: {
        ...stateRef.current.proposals,
        [team]: { ...stateRef.current.proposals[team], content, lastUpdated: Date.now() }
      }
    };
    setState(newState);
    updateRemoteState(newState);
  }, [updateRemoteState]);

  const addComment = useCallback((targetTeam: 'TEAM_A' | 'TEAM_B', comment: string) => {
    const newState = {
      ...stateRef.current,
      proposals: {
        ...stateRef.current.proposals,
        [targetTeam]: { 
          ...stateRef.current.proposals[targetTeam], 
          comments: [...stateRef.current.proposals[targetTeam].comments, comment] 
        }
      }
    };
    setState(newState);
    updateRemoteState(newState);
  }, [updateRemoteState]);

  const drawCard = useCallback((type: 'SEASON' | 'EXTREME_EVENT' | 'UNCERTAINTY', card: Card) => {
    const typeKey = `active${type.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join('')}` as keyof GameState;
    const newState = {
      ...stateRef.current,
      [typeKey]: card
    };
    setState(newState);
    updateRemoteState(newState);
  }, [updateRemoteState]);

  const usePowerCard = useCallback((team: 'TEAM_A' | 'TEAM_B') => {
    const newState = {
      ...stateRef.current,
      powerCardsUsed: {
        ...stateRef.current.powerCardsUsed,
        [team]: stateRef.current.powerCardsUsed[team] + 1
      },
      consultationActive: true,
      consultationTimer: 120,
      consultingTeam: team
    };
    setState(newState);
    updateRemoteState(newState);
  }, [updateRemoteState]);

  const endConsultation = useCallback(() => {
    const newState = {
      ...stateRef.current,
      consultationActive: false,
      consultationTimer: 0,
      consultingTeam: null
    };
    setState(newState);
    updateRemoteState(newState);
  }, [updateRemoteState]);

  const sendMediaMessage = useCallback((text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Media Bureau',
      text,
      timestamp: Date.now()
    };
    const newState = {
      ...stateRef.current,
      mediaMessages: [newMessage, ...stateRef.current.mediaMessages]
    };
    setState(newState);
    updateRemoteState(newState);
  }, [updateRemoteState]);

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
    if (roomCode) updateRemoteState(INITIAL_STATE);
  }, [roomCode, updateRemoteState]);

  const leaveRoom = useCallback(() => {
    setRoomCode(null);
    setState(INITIAL_STATE);
  }, []);

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
