import type { GameState, GamePhase } from '../../types/game';
import { GAME_PHASES } from '../../types/game';
import { SEASON_CARDS, EXTREME_EVENT_CARDS, UNCERTAINTY_CARDS } from '../../constants/cards';
import { PHASE_CONFIG } from '../../constants/rules';

interface Props {
  state: GameState;
  setPhase: (phase: GamePhase) => void;
  drawCard: (type: 'SEASON' | 'EXTREME_EVENT' | 'UNCERTAINTY', card: any) => void;
  resetGame: () => void;
}

export function GameMasterView({ state, setPhase, drawCard, resetGame }: Props) {
  return (
    <div className="game-master-view">
      <section className="card" style={{ marginBottom: '20px' }}>
        <h2>Phase Control</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          {GAME_PHASES.map(phase => (
            <button 
              key={phase} 
              className={`btn ${state.currentPhase === phase ? 'btn-primary' : ''}`}
              onClick={() => setPhase(phase)}
            >
              {phase.replace('_', ' ')}
            </button>
          ))}
          <button className="btn" style={{ backgroundColor: '#e53e3e', color: 'white' }} onClick={resetGame}>Reset Game</button>
        </div>
        <p style={{ marginTop: '10px' }}><strong>Current Phase:</strong> {PHASE_CONFIG[state.currentPhase].title}</p>
        <p>{PHASE_CONFIG[state.currentPhase].description}</p>
      </section>

      <section className="card" style={{ marginBottom: '20px' }}>
        <h2>Draw Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '10px' }}>
          <div>
            <h3>Season</h3>
            <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
              {SEASON_CARDS.map(card => (
                <button key={card.id} className="btn" onClick={() => drawCard('SEASON', card)}>{card.title}</button>
              ))}
            </div>
          </div>
          <div>
            <h3>Extreme Event</h3>
            <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
              {EXTREME_EVENT_CARDS.map(card => (
                <button key={card.id} className="btn" onClick={() => drawCard('EXTREME_EVENT', card)}>{card.title}</button>
              ))}
            </div>
          </div>
          <div>
            <h3>Uncertainty</h3>
            <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
              {UNCERTAINTY_CARDS.map(card => (
                <button key={card.id} className="btn" onClick={() => drawCard('UNCERTAINTY', card)}>{card.title}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Active Scenario</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="status-box">
            <strong>Season:</strong> {state.activeSeason?.title || 'None'}
          </div>
          <div className="status-box">
            <strong>Event:</strong> {state.activeExtremeEvent?.title || 'None'}
          </div>
          <div className="status-box">
            <strong>Uncertainty:</strong> {state.activeUncertainty?.title || 'None'}
          </div>
        </div>
      </section>
    </div>
  );
}
