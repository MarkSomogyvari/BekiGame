import type { GameState } from '../../types/game';

interface Props {
  state: GameState;
}

export function ObserverView({ state }: Props) {
  return (
    <div className="observer-view" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Comparison grid */}
        <section className="card" style={{ borderLeft: '4px solid var(--river-blue-end)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 8px' }}>Live Basin Monitor</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Tracking proposal development, collaboration, and dialogue progress of both teams in real-time.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Team A */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--sediment-brown)' }}>
                  🏛️ Government Team
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 'bold', background: 'var(--color-bg)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  Power Cards: {state.powerCardsUsed.TEAM_A}
                </span>
              </div>
              <div style={{ 
                padding: '20px', 
                background: 'var(--color-bg)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '12px', 
                minHeight: '260px', 
                whiteSpace: 'pre-wrap',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'left',
                color: 'var(--color-text-primary)'
              }}>
                {state.proposals.TEAM_A.content || 'Awaiting government draft...'}
              </div>
            </div>

            {/* Team B */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--eco-green)' }}>
                  👥 Community Team
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 'bold', background: 'var(--color-bg)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  Power Cards: {state.powerCardsUsed.TEAM_B}
                </span>
              </div>
              <div style={{ 
                padding: '20px', 
                background: 'var(--color-bg)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '12px', 
                minHeight: '260px', 
                whiteSpace: 'pre-wrap',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'left',
                color: 'var(--color-text-primary)'
              }}>
                {state.proposals.TEAM_B.content || 'Awaiting community draft...'}
              </div>
            </div>

          </div>
        </section>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section className="card" style={{ borderLeft: '4px solid var(--river-blue-start)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px' }}>Scenario Monitor</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="deck-card SEASON" style={{ textAlign: 'left', padding: '10px 12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--river-blue-start)' }}>Season</span>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>
                {state.activeSeason ? state.activeSeason.title : '-'}
              </div>
            </div>
            
            <div className="deck-card EXTREME_EVENT" style={{ textAlign: 'left', padding: '10px 12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--hazard-red)' }}>Extreme Event</span>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>
                {state.activeExtremeEvent ? state.activeExtremeEvent.title : 'None'}
              </div>
            </div>

            <div className="deck-card UNCERTAINTY" style={{ textAlign: 'left', padding: '10px 12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--uncertainty-amber)' }}>Uncertainty</span>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>
                {state.activeUncertainty ? state.activeUncertainty.title : 'None'}
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
