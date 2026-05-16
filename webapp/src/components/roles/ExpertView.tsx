import type { GameState } from '../../types/game';

interface Props {
  state: GameState;
  endConsultation: () => void;
}

export function ExpertView({ state, endConsultation }: Props) {
  const activeTeam = state.consultingTeam;
  const proposal = activeTeam ? state.proposals[activeTeam] : null;

  return (
    <div className="expert-view">
      <section className="card" style={{ borderLeftColor: state.consultationActive ? '#2f855a' : '#cbd5e0' }}>
        <h2>Expert Power Room</h2>
        {state.consultationActive ? (
          <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#2f855a', marginTop: 0 }}>● Consultation Active: {activeTeam === 'TEAM_A' ? 'Government' : 'Community'}</h3>
            <p><strong>Team Proposal (Read Only):</strong></p>
            <div style={{ background: '#fff', padding: '15px', border: '1px solid #c6f6d5', borderRadius: '4px', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
              {proposal?.content || 'No content yet.'}
            </div>
            <button className="btn btn-primary" style={{ backgroundColor: '#2f855a' }} onClick={endConsultation}>
              Complete Consultation
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            <p style={{ fontSize: '24px' }}>Waiting for a team to use a Power Card...</p>
          </div>
        )}
      </section>

      <section className="card" style={{ marginTop: '20px' }}>
        <h3>Current Environmental Scenario</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          <div className="status-box"><strong>Season:</strong> {state.activeSeason?.title || '-'}</div>
          <div className="status-box"><strong>Event:</strong> {state.activeExtremeEvent?.title || '-'}</div>
          <div className="status-box"><strong>Uncertainty:</strong> {state.activeUncertainty?.title || '-'}</div>
        </div>
      </section>
    </div>
  );
}
