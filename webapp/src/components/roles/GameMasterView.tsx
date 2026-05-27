import type { GameState, GamePhase, Card } from '../../types/game';
import { GAME_PHASES } from '../../types/game';
import { SEASON_CARDS, EXTREME_EVENT_CARDS, UNCERTAINTY_CARDS } from '../../constants/cards';
import { PHASE_CONFIG } from '../../constants/rules';

interface Props {
  state: GameState;
  setPhase: (phase: GamePhase) => void;
  drawCard: (type: 'SEASON' | 'EXTREME_EVENT' | 'UNCERTAINTY', card: Card) => void;
  resetGame: () => void;
}

export function GameMasterView({ state, setPhase, drawCard, resetGame }: Props) {
  return (
    <div className="game-master-view" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Phase Control Card */}
        <section className="card" style={{ borderLeft: '4px solid var(--river-blue-start)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧭</span> Phase Control Board
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Advance the simulation timeline step-by-step. Other participants' dashboards will synchronize in real-time.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {GAME_PHASES.map((phase, idx) => {
              const isActive = state.currentPhase === phase;
              return (
                <button 
                  key={phase} 
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ 
                    padding: '12px', 
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    border: isActive ? 'none' : '1px solid var(--color-border)'
                  }}
                  onClick={() => setPhase(phase)}
                >
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-border)',
                    marginRight: '8px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {idx + 1}
                  </span>
                  {phase.replace('_', ' ')}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--river-blue-start)' }}>Current Phase Objective</span>
              <h4 style={{ margin: '4px 0', fontSize: '1.1rem', fontWeight: '700' }}>{PHASE_CONFIG[state.currentPhase].title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{PHASE_CONFIG[state.currentPhase].description}</p>
            </div>
            <button 
              className="btn" 
              style={{ backgroundColor: 'var(--hazard-red)', color: 'white', fontSize: '0.85rem', padding: '8px 16px' }} 
              onClick={() => {
                if (confirm('Are you sure you want to completely reset the game session?')) {
                  resetGame();
                }
              }}
            >
              ⚠️ Reset Session
            </button>
          </div>
        </section>

        {/* Draw Cards Board */}
        <section className="card" style={{ borderLeft: '4px solid var(--uncertainty-amber)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎴</span> Draw Scenario Decks
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            
            {/* Season Deck */}
            <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px', color: 'var(--river-blue-start)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🌧️ Season
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                {SEASON_CARDS.map(card => {
                  const isDrawn = state.activeSeason?.id === card.id;
                  return (
                    <button 
                      key={card.id} 
                      className="btn btn-secondary" 
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '10px',
                        borderColor: isDrawn ? 'var(--river-blue-start)' : 'transparent',
                        background: isDrawn ? 'var(--river-blue-gradient)' : 'var(--color-surface)',
                        color: isDrawn ? '#fff' : 'var(--color-text-primary)'
                      }} 
                      onClick={() => drawCard('SEASON', card)}
                    >
                      {card.title} {isDrawn && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extreme Event Deck */}
            <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px', color: 'var(--hazard-red)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔥 Extreme Event
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                {EXTREME_EVENT_CARDS.map(card => {
                  const isDrawn = state.activeExtremeEvent?.id === card.id;
                  return (
                    <button 
                      key={card.id} 
                      className="btn btn-secondary" 
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '10px',
                        borderColor: isDrawn ? 'var(--hazard-red)' : 'transparent',
                        background: isDrawn ? 'var(--hazard-red)' : 'var(--color-surface)',
                        color: isDrawn ? '#fff' : 'var(--color-text-primary)'
                      }} 
                      onClick={() => drawCard('EXTREME_EVENT', card)}
                    >
                      {card.title} {isDrawn && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Uncertainty Deck */}
            <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px', color: 'var(--uncertainty-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ❓ Uncertainty
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                {UNCERTAINTY_CARDS.map(card => {
                  const isDrawn = state.activeUncertainty?.id === card.id;
                  return (
                    <button 
                      key={card.id} 
                      className="btn btn-secondary" 
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '10px',
                        borderColor: isDrawn ? 'var(--uncertainty-amber)' : 'transparent',
                        background: isDrawn ? 'var(--uncertainty-amber)' : 'var(--color-surface)',
                        color: isDrawn ? '#fff' : 'var(--color-text-primary)'
                      }} 
                      onClick={() => drawCard('UNCERTAINTY', card)}
                    >
                      {card.title} {isDrawn && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* GM Sidebar - Active Scenario Summary */}
      <aside>
        <section className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '4px solid var(--river-blue-end)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Active Scenario</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            These conditions affect the teams' decision matrix.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="deck-card SEASON" style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--river-blue-start)', textTransform: 'uppercase' }}>Active Season</span>
              <h4 style={{ margin: '4px 0 2px', fontWeight: '700' }}>{state.activeSeason?.title || 'None Selected'}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{state.activeSeason?.description || 'GM has not drawn a season card yet.'}</p>
            </div>

            <div className="deck-card EXTREME_EVENT" style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--hazard-red)', textTransform: 'uppercase' }}>Extreme Event</span>
              <h4 style={{ margin: '4px 0 2px', fontWeight: '700' }}>{state.activeExtremeEvent?.title || 'None'}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{state.activeExtremeEvent?.description || 'No extreme events have been triggered.'}</p>
            </div>

            <div className="deck-card UNCERTAINTY" style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--uncertainty-amber)', textTransform: 'uppercase' }}>Uncertainty Factor</span>
              <h4 style={{ margin: '4px 0 2px', fontWeight: '700' }}>{state.activeUncertainty?.title || 'None'}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{state.activeUncertainty?.description || 'No uncertainty factors introduced.'}</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
