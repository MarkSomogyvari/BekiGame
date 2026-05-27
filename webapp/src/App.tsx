import { useState } from 'react';
import { useGameState } from './state/useGameState';
import { ROLES } from './types/game';
import type { Role } from './types/game';
import { GameMasterView } from './components/roles/GameMasterView';
import { TeamView } from './components/roles/TeamView';
import { ObserverView } from './components/roles/ObserverView';
import { ExpertView } from './components/roles/ExpertView';
import { MediaView } from './components/roles/MediaView';
import { PHASE_CONFIG } from './constants/rules';

const ROLE_DETAILS: Record<Role, { title: string; desc: string; icon: string; color: string }> = {
  GAME_MASTER: { 
    title: 'Game Master', 
    desc: 'Facilitates session, controls timeline phases, and triggers environmental events.', 
    icon: '🧭', 
    color: 'var(--river-blue-start)' 
  },
  DECISION_MAKER: { 
    title: 'Government Team', 
    desc: 'Formulates basin-wide management plans, infrastructure funding, and policy guidelines.', 
    icon: '🏛️', 
    color: 'var(--sediment-brown)' 
  },
  COMMUNITY_MEMBER: { 
    title: 'Community Members', 
    desc: 'Represents local residents, tracks local erosion, agriculture, and livelihood issues.', 
    icon: '👥', 
    color: 'var(--eco-green)' 
  },
  EXPERT: { 
    title: 'Technical Expert', 
    desc: 'Consults on hydrology data, ecological impact, and social research questions.', 
    icon: '🔬', 
    color: 'var(--river-blue-end)' 
  },
  MEDIA: { 
    title: 'Media Bureau', 
    desc: 'Monitors progress, writes breaking news tickers, and broadcasts reports.', 
    icon: '📢', 
    color: 'var(--media-indigo)' 
  },
  OBSERVER: { 
    title: 'Observer', 
    desc: 'Passively monitors the session state, proposals, and drawn cards side-by-side.', 
    icon: '👁️', 
    color: 'var(--color-text-secondary)' 
  }
};

function App() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [inputRoomCode, setInputRoomCode] = useState('');
  
  const { 
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
  } = useGameState();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid var(--color-border)',
          borderTopColor: 'var(--river-blue-start)',
          borderRadius: '50%',
          animation: 'spin 1s infinite linear'
        }} />
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Connecting to River Basin...</p>
      </div>
    );
  }

  // Room Selection Screen
  if (!roomCode) {
    const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

    return (
      <div className="container" style={{ maxWidth: '800px', padding: '60px 24px' }}>
        <header style={{ marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            <span style={{ fontSize: '3rem' }}>💧</span>
            <span style={{ background: 'var(--river-blue-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BekiGame</span>
          </div>
          <p style={{ margin: '10px 0 20px', color: 'var(--color-text-secondary)' }}>River Basin Serious Gaming Decision Platform</p>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px', 
            borderRadius: '30px', 
            fontSize: '13px', 
            fontWeight: '600',
            background: isSupabaseConfigured ? 'var(--eco-green-light)' : 'var(--hazard-red-light)',
            color: isSupabaseConfigured ? 'var(--eco-green)' : 'var(--hazard-red)',
            border: `1px solid ${isSupabaseConfigured ? 'rgba(47, 133, 90, 0.2)' : 'rgba(229, 62, 62, 0.2)'}`
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: isSupabaseConfigured ? 'var(--eco-green)' : 'var(--hazard-red)',
              display: 'inline-block'
            }} />
            {isSupabaseConfigured ? 'Cloud Sync Online' : 'Local Sandbox Mode'}
          </div>
        </header>
        
        <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <section className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✨</span> Start Session
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>
                Initialize a new river basin simulation workspace and generate an invite code for your team.
              </p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={createRoom} 
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              Initialize Room
            </button>
          </section>

          <section className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔗</span> Join Room
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>
                Enter the session code provided by the Game Master to join the active river scenario.
              </p>
              <input 
                type="text" 
                style={{ width: '100%', padding: '12px', marginBottom: '20px', textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '2px' }}
                placeholder="ROOM CODE"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={() => joinRoom(inputRoomCode)}
              disabled={!inputRoomCode || isLoading}
              style={{ width: '100%', border: '2px solid var(--color-border)' }}
            >
              Connect Session
            </button>
          </section>
        </main>
      </div>
    );
  }

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="container" style={{ maxWidth: '1000px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '40px' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Select Dashboard</h1>
            <p style={{ margin: '5px 0 0', color: 'var(--color-text-secondary)' }}>Active Session Code: <strong style={{ color: 'var(--river-blue-start)', letterSpacing: '1px' }}>{roomCode}</strong></p>
          </div>
          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={leaveRoom}>Disconnect</button>
        </header>
        
        <main>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {ROLES.map(role => {
              const details = ROLE_DETAILS[role];
              return (
                <div 
                  key={role} 
                  className="card"
                  onClick={() => setSelectedRole(role as Role)}
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    borderTop: `4px solid ${details.color}`,
                    height: '240px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '2rem' }}>{details.icon}</span>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: details.color, textTransform: 'uppercase', letterSpacing: '1px', background: 'var(--color-bg)', padding: '3px 8px', borderRadius: '8px' }}>
                        {role.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 8px', color: 'var(--color-text-primary)' }}>{details.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>{details.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: 'bold', color: details.color, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    Enter Interface <span>➔</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  const renderRoleView = () => {
    switch (selectedRole) {
      case 'GAME_MASTER':
        return <GameMasterView state={state} setPhase={setPhase} drawCard={drawCard} resetGame={resetGame} />;
      case 'DECISION_MAKER':
      case 'COMMUNITY_MEMBER':
        return <TeamView role={selectedRole} state={state} updateProposal={updateProposal} addComment={addComment} onUsePowerCard={usePowerCard} />;
      case 'OBSERVER':
        return <ObserverView state={state} />;
      case 'EXPERT':
        return <ExpertView state={state} endConsultation={endConsultation} />;
      case 'MEDIA':
        return <MediaView state={state} sendMediaMessage={sendMediaMessage} />;
      default:
        return (
          <div className="card">
            <h2>{(selectedRole as string).replace('_', ' ')} Interface</h2>
            <p>Work in progress for this role.</p>
          </div>
        );
    }
  };

  // Stepped progression configuration
  const phaseList = Object.keys(PHASE_CONFIG) as Array<keyof typeof PHASE_CONFIG>;
  const activePhaseIndex = phaseList.indexOf(state.currentPhase);

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px', marginBottom: '32px' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>💧</span>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>BekiGame</h1>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Room: <strong style={{ color: 'var(--river-blue-start)' }}>{roomCode}</strong> | Role: <strong style={{ color: ROLE_DETAILS[selectedRole].color }}>{ROLE_DETAILS[selectedRole].title}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.85rem', padding: '8px 16px', border: '1px solid var(--color-border)' }}
            onClick={() => setSelectedRole(null)}
          >
            🔄 Switch Role
          </button>
        </div>
      </header>

      {/* Stepped Timeline Progress Tracker */}
      <section className="card" style={{ padding: '16px 24px', marginBottom: '30px', background: 'var(--glass-bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', gap: '15px' }}>
          {phaseList.map((ph, idx) => {
            const isCompleted = idx < activePhaseIndex;
            const isActive = idx === activePhaseIndex;
            const config = PHASE_CONFIG[ph];
            
            return (
              <div 
                key={ph} 
                style={{ 
                  flex: '1', 
                  minWidth: '100px', 
                  textAlign: 'center', 
                  position: 'relative',
                  opacity: isActive || isCompleted ? 1 : 0.4
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: isActive ? 'var(--river-blue-gradient)' : isCompleted ? 'var(--eco-green)' : 'var(--color-border)',
                  color: isActive || isCompleted ? '#fff' : 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  boxShadow: isActive ? '0 0 10px rgba(0, 102, 204, 0.4)' : 'none'
                }}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div style={{ fontSize: '12px', fontWeight: isActive ? 'bold' : '500', color: isActive ? 'var(--river-blue-start)' : 'var(--color-text-primary)' }}>
                  {config.title}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
      {state.mediaMessages.length > 0 && selectedRole !== 'MEDIA' && (
        <section className="card" style={{ 
          marginBottom: '30px', 
          borderLeft: '4px solid var(--media-indigo)', 
          background: 'var(--media-indigo-light)',
          padding: '16px 20px',
          animation: 'pulse-glow 2s infinite ease-in-out'
        }}>
          <style>{`
            @keyframes pulse-glow {
              0% { box-shadow: 0 0 0 0 rgba(128, 90, 213, 0.1); }
              50% { box-shadow: 0 0 0 6px rgba(128, 90, 213, 0.2); }
              100% { box-shadow: 0 0 0 0 rgba(128, 90, 213, 0.1); }
            }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>📢</span>
            <p style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '0.95rem', fontWeight: '600' }}>
              <span style={{ color: 'var(--media-indigo)', fontWeight: '800', marginRight: '6px' }}>BREAKING:</span> 
              {state.mediaMessages[0].text}
            </p>
          </div>
        </section>
      )}

      <main style={{ marginTop: '20px' }}>
        {renderRoleView()}
      </main>
    </div>
  );
}

export default App;

