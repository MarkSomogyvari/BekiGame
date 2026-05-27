import { useState } from 'react';
import type { GameState, Role } from '../../types/game';
import { POWER_CARD_LIMIT } from '../../constants/rules';

interface Props {
  role: Role;
  state: GameState;
  updateProposal: (team: 'TEAM_A' | 'TEAM_B', content: string) => void;
  addComment: (targetTeam: 'TEAM_A' | 'TEAM_B', comment: string) => void;
  onUsePowerCard: (team: 'TEAM_A' | 'TEAM_B') => void;
}

export function TeamView({ role, state, updateProposal, addComment, onUsePowerCard }: Props) {
  const team = role === 'DECISION_MAKER' ? 'TEAM_A' : 'TEAM_B';
  const otherTeam = team === 'TEAM_A' ? 'TEAM_B' : 'TEAM_A';
  const proposal = state.proposals[team];
  const otherProposal = state.proposals[otherTeam];
  
  const [commentText, setCommentText] = useState('');

  const isProposalPhase = state.currentPhase === 'PROPOSAL_CREATION' || state.currentPhase === 'REVISION';
  const isExchangePhase = state.currentPhase === 'EXCHANGE';

  const teamName = team === 'TEAM_A' ? 'Bhutanese Hydropower Authority (Government)' : 'Assam Downstream Community (Local)';
  const otherTeamName = otherTeam === 'TEAM_A' ? 'Bhutanese Hydropower Authority (Government)' : 'Assam Downstream Community (Local)';
  const accentColor = team === 'TEAM_A' ? 'var(--sediment-brown)' : 'var(--eco-green)';

  return (
    <div className="team-view" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Main Proposal Editor / View Card */}
        <section className="card" style={{ borderLeft: `4px solid ${accentColor}` }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 16px', color: 'var(--color-text-primary)' }}>
            📝 Your Workspace: {teamName}
          </h2>
          
          {isProposalPhase ? (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Draft your proposal considering the active season and extreme events. Keep notes structured.
              </p>
              <textarea 
                style={{ 
                  width: '100%', 
                  minHeight: '320px', 
                  padding: '16px', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  borderRadius: '12px', 
                  border: '2px solid var(--color-border)',
                  fontFamily: 'var(--font-sans)'
                }}
                value={proposal.content}
                onChange={(e) => updateProposal(team, e.target.value)}
                placeholder="Type your strategic proposal here..."
              />
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Proposal submitted (Read Only during this phase).
              </p>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                padding: '20px', 
                background: 'var(--color-bg)', 
                borderRadius: '12px', 
                border: '1px solid var(--color-border)', 
                minHeight: '200px',
                lineHeight: '1.6',
                color: 'var(--color-text-primary)',
                fontSize: '0.95rem'
              }}>
                {proposal.content || 'No proposal content drafted yet.'}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
              🎯 <strong>Consultations Used:</strong> <span style={{ fontWeight: 'bold', color: accentColor }}>{state.powerCardsUsed[team]}</span> / {POWER_CARD_LIMIT}
            </div>
            {isProposalPhase && (
              <button 
                className="btn btn-primary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                disabled={state.powerCardsUsed[team] >= POWER_CARD_LIMIT || state.consultationActive}
                onClick={() => onUsePowerCard(team)}
              >
                📞 Request Expert Guidance
              </button>
            )}
          </div>
        </section>

        {/* Exchange Phase: Peer Review Feedback */}
        {isExchangePhase && (
          <section className="card" style={{ borderLeft: '4px solid var(--river-blue-end)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 8px' }}>
              🔍 Peer Review: {otherTeamName}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Review the other team's active proposal below and add constructive feedback comments.
            </p>
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              padding: '16px', 
              background: 'var(--color-bg)', 
              borderRadius: '12px', 
              border: '1px solid var(--color-border)', 
              marginBottom: '20px',
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}>
              {otherProposal.content || 'The other team has not submitted a proposal yet.'}
            </div>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 10px' }}>Add Feedback Comment</h3>
            <textarea 
              style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '10px', marginBottom: '12px', border: '2px solid var(--color-border)' }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Provide suggestions regarding erosion, ecological preservation, or cost allocations..."
            />
            <button 
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              onClick={() => {
                if (commentText.trim()) {
                  addComment(otherTeam, commentText);
                  setCommentText('');
                }
              }}
            >
              Submit Feedback
            </button>
          </section>
        )}

        {/* Received Comments / Feedback */}
        {!isExchangePhase && proposal.comments.length > 0 && (
          <section className="card" style={{ borderLeft: '4px solid var(--uncertainty-amber)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 12px' }}>
              💬 Received Feedback Comments
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {proposal.comments.map((comment, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: '14px 16px', 
                    background: 'var(--color-bg)', 
                    borderRadius: '10px', 
                    border: '1px solid var(--color-border)',
                    borderLeft: '4px solid var(--uncertainty-amber)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    textAlign: 'left'
                  }}
                >
                  {comment}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Scenario Overview */}
        <section className="card" style={{ borderLeft: '4px solid var(--river-blue-start)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0 0 12px' }}>Active Scenario</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="deck-card SEASON" style={{ textAlign: 'left', padding: '10px 12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--river-blue-start)' }}>Season</span>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>
                {state.activeSeason ? state.activeSeason.title : 'Pending...'}
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

        {/* Expert Status Indicator */}
        <section className="card" style={{ borderLeft: '4px solid var(--eco-green)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px' }}>Consultation Room</h3>
          <div style={{ 
            padding: '12px', 
            background: state.consultationActive ? 'var(--eco-green-light)' : 'var(--color-bg)', 
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {state.consultationActive ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--eco-green)', fontWeight: 'bold' }}>
                <span className="pulse-active" style={{ marginLeft: '10px' }} />
                <span>Line Busy (Active)</span>
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                🟢 Expert Line Open
              </div>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
