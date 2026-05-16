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
  const { 
    state, 
    setPhase, 
    updateProposal, 
    addComment, 
    drawCard, 
    usePowerCard, 
    endConsultation,
    sendMediaMessage,
    resetGame 
  } = useGameState();

  if (!selectedRole) {
    return (
      <div className="container">
        <header>
          <h1>BekiGame</h1>
          <p>River Basin Decision-Making Serious Game</p>
        </header>
        
        <main>
          <section className="card">
            <h2>Select Your Role</h2>
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
          <p style={{ margin: 0, opacity: 0.8 }}>Phase: {state.currentPhase.replace('_', ' ')}</p>
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
