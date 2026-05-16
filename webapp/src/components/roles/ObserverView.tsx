import type { GameState } from '../../types/game';

interface Props {
  state: GameState;
}

export function ObserverView({ state }: Props) {
  return (
    <div className="observer-view">
      <section className="card" style={{ marginBottom: '20px' }}>
        <h2>Live Monitor</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>Government Team</h3>
            <div style={{ padding: '15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', minHeight: '200px', whiteSpace: 'pre-wrap' }}>
              {state.proposals.TEAM_A.content || 'Drafting...'}
            </div>
            <p>Power Cards: {state.powerCardsUsed.TEAM_A}</p>
          </div>
          <div>
            <h3>Community Team</h3>
            <div style={{ padding: '15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', minHeight: '200px', whiteSpace: 'pre-wrap' }}>
              {state.proposals.TEAM_B.content || 'Drafting...'}
            </div>
            <p>Power Cards: {state.powerCardsUsed.TEAM_B}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Active Scenario</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          <div className="status-box"><strong>Season:</strong> {state.activeSeason?.title || '-'}</div>
          <div className="status-box"><strong>Event:</strong> {state.activeExtremeEvent?.title || '-'}</div>
          <div className="status-box"><strong>Uncertainty:</strong> {state.activeUncertainty?.title || '-'}</div>
        </div>
      </section>
    </div>
  );
}
