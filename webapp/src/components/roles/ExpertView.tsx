import type { GameState } from '../../types/game';

interface Props {
  state: GameState;
  endConsultation: () => void;
}

export function ExpertView({ state, endConsultation }: Props) {
  const activeTeam = state.consultingTeam;
  const proposal = activeTeam ? state.proposals[activeTeam] : null;
  const teamName = activeTeam === 'TEAM_A' ? 'Government Team' : 'Community Team';

  return (
    <div className="expert-view" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <section className="card" style={{ borderLeft: `4px solid ${state.consultationActive ? 'var(--eco-green)' : 'var(--color-border)'}` }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 8px' }}>Expert Power Room</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Provide technical, environmental, and social guidance to decision-makers and local communities.
          </p>

          {state.consultationActive ? (
            <div style={{ 
              background: 'var(--eco-green-light)', 
              padding: '24px', 
              borderRadius: '12px', 
              border: '1px solid rgba(47, 133, 90, 0.2)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span className="pulse-active" style={{ marginLeft: '12px' }} />
                <h3 style={{ color: 'var(--eco-green)', margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>
                  Consultation in Progress: {teamName}
                </h3>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                <strong>Active Team Draft (Read-Only):</strong>
              </p>
              <div style={{ 
                background: 'var(--color-surface)', 
                padding: '20px', 
                border: '1px solid var(--color-border)', 
                borderRadius: '12px', 
                whiteSpace: 'pre-wrap', 
                marginBottom: '20px',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: 'var(--color-text-primary)',
                minHeight: '180px'
              }}>
                {proposal?.content || 'Team has not typed anything yet.'}
              </div>
              
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: 'var(--eco-green)', border: 'none', padding: '10px 20px', fontSize: '0.9rem' }} 
                onClick={endConsultation}
              >
                ✓ Complete Consultation Session
              </button>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 40px', 
              background: 'var(--color-bg)', 
              borderRadius: '12px', 
              border: '1px dashed var(--color-border)',
              color: 'var(--color-text-secondary)'
            }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔬</span>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: '700' }}>Awaiting Advisory Requests</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                When a team activates their Power Card, their live proposal draft will appear here for review.
              </p>
            </div>
          )}
        </section>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section className="card" style={{ borderLeft: '4px solid var(--river-blue-start)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px' }}>Environmental Baseline</h3>
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
