import { useState } from 'react';
import { useGameState } from './state/useGameState';
import { ROLES } from './types/game';
import type { Role } from './types/game';
import { GameMasterView } from './components/roles/GameMasterView';
import { TeamView } from './components/roles/TeamView';
import { ObserverView } from './components/roles/ObserverView';
import { ExpertView } from './components/roles/ExpertView';
import { MediaView } from './components/roles/MediaView';

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
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Connecting to river basin...</p>
      </div>
    );
  }

  // Room Selection Screen
  if (!roomCode) {
    return (
      <div className="container">
        <header>
          <h1>BekiGame</h1>
          <p>River Basin Decision-Making Serious Game</p>
        </header>
        
        <main>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
            <section className="card">
              <h2>Start New Session</h2>
              <p>Create a unique room code to invite others to your game.</p>
              <button className="btn btn-primary" onClick={createRoom}>Create Room</button>
            </section>

            <section className="card">
              <h2>Join Existing Session</h2>
              <p>Enter the code shared by your Game Master.</p>
              <input 
                type="text" 
                className="card" 
                style={{ width: '100%', padding: '10px', marginBottom: '15px', textTransform: 'uppercase' }}
                placeholder="ENTER CODE (e.g. XJ29B)"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value)}
              />
              <button 
                className="btn btn-primary" 
                onClick={() => joinRoom(inputRoomCode)}
                disabled={!inputRoomCode}
              >
                Join Room
              </button>
            </section>
          </div>
          
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ opacity: 0.6, fontSize: '14px' }}>Note: Real-time synchronization requires a Supabase configuration.</p>
          </div>
        </main>
      </div>
    );
  }

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="container">
        <header>
          <h1>BekiGame</h1>
          <p>Room: <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>{roomCode}</span></p>
        </header>
        
        <main>
          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Select Your Role</h2>
              <button className="btn" style={{ fontSize: '12px' }} onClick={leaveRoom}>Leave Room</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {ROLES.map(role => (
                <button 
                  key={role} 
                  className="btn btn-primary"
                  onClick={() => setSelectedRole(role as Role)}
                >
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </section>
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
        return <TeamView role={selectedRole} state={state} updateProposal={updateProposal} addComment={addComment} usePowerCard={usePowerCard} />;
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

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>BekiGame</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Room: <strong>{roomCode}</strong> | Phase: {state.currentPhase.replace('_', ' ')}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong>Role: {selectedRole.replace('_', ' ')}</strong><br />
          <button 
            className="btn" 
            style={{ marginTop: '5px', fontSize: '12px', padding: '5px 10px' }}
            onClick={() => setSelectedRole(null)}
          >
            Switch Role
          </button>
        </div>
      </header>
      
      {state.mediaMessages.length > 0 && selectedRole !== 'MEDIA' && (
        <section className="card" style={{ marginBottom: '20px', borderLeftColor: '#805ad5', background: '#faf5ff' }}>
          <h3 style={{ margin: 0, color: '#805ad5', fontSize: '14px' }}>BREAKING NEWS: {state.mediaMessages[0].text}</h3>
        </section>
      )}

      <main>
        {renderRoleView()}
      </main>
    </div>
  );
}

export default App;
