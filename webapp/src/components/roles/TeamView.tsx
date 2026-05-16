import { useState } from 'react';
import type { GameState, Role } from '../../types/game';
import { POWER_CARD_LIMIT } from '../../constants/rules';

interface Props {
  role: Role;
  state: GameState;
  updateProposal: (team: 'TEAM_A' | 'TEAM_B', content: string) => void;
  addComment: (targetTeam: 'TEAM_A' | 'TEAM_B', comment: string) => void;
  usePowerCard: (team: 'TEAM_A' | 'TEAM_B') => void;
}

export function TeamView({ role, state, updateProposal, addComment, usePowerCard }: Props) {
  const team = role === 'DECISION_MAKER' ? 'TEAM_A' : 'TEAM_B';
  const otherTeam = team === 'TEAM_A' ? 'TEAM_B' : 'TEAM_A';
  const proposal = state.proposals[team];
  const otherProposal = state.proposals[otherTeam];
  
  const [commentText, setCommentText] = useState('');

  const isProposalPhase = state.currentPhase === 'PROPOSAL_CREATION' || state.currentPhase === 'REVISION';
  const isExchangePhase = state.currentPhase === 'EXCHANGE';

  return (
    <div className="team-view">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <main>
          <section className="card" style={{ marginBottom: '20px' }}>
            <h2>{team === 'TEAM_A' ? 'Government Proposal' : 'Community Proposal'}</h2>
            {isProposalPhase ? (
              <textarea 
                style={{ width: '100%', minHeight: '300px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                value={proposal.content}
                onChange={(e) => updateProposal(team, e.target.value)}
                placeholder="Write your proposal here..."
              />
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', padding: '10px', background: '#f7fafc', borderRadius: '4px', minHeight: '300px' }}>
                {proposal.content || 'No proposal content yet.'}
              </div>
            )}
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Power Cards Used:</strong> {state.powerCardsUsed[team]} / {POWER_CARD_LIMIT}
              </div>
              {isProposalPhase && (
                <button 
                  className="btn btn-primary" 
                  disabled={state.powerCardsUsed[team] >= POWER_CARD_LIMIT}
                  onClick={() => usePowerCard(team)}
                >
                  Request Expert Consultation
                </button>
              )}
            </div>
          </section>

          {isExchangePhase && (
            <section className="card">
              <h2>Review {otherTeam === 'TEAM_A' ? 'Government' : 'Community'} Proposal</h2>
              <div style={{ whiteSpace: 'pre-wrap', padding: '10px', background: '#f7fafc', borderRadius: '4px', marginBottom: '20px' }}>
                {otherProposal.content || 'Other team has not submitted a proposal yet.'}
              </div>
              
              <h3>Add Feedback</h3>
              <textarea 
                style={{ width: '100%', minHeight: '100px', padding: '10px', marginBottom: '10px' }}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Provide constructive feedback..."
              />
              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (commentText.trim()) {
                    addComment(otherTeam, commentText);
                    setCommentText('');
                  }
                }}
              >
                Submit Comment
              </button>
            </section>
          )}

          {!isExchangePhase && proposal.comments.length > 0 && (
            <section className="card" style={{ marginTop: '20px' }}>
              <h2>Received Feedback</h2>
              <ul>
                {proposal.comments.map((comment, i) => (
                  <li key={i} style={{ marginBottom: '10px', padding: '10px', background: '#fffaf0', borderLeft: '4px solid #ed8936' }}>{comment}</li>
                ))}
              </ul>
            </section>
          )}
        </main>

        <aside>
          <section className="card" style={{ marginBottom: '20px' }}>
            <h3>Scenario</h3>
            <div className="status-box" style={{ background: state.activeSeason ? '#ebf8ff' : '#f7fafc', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
              <strong>Season:</strong><br />
              {state.activeSeason ? state.activeSeason.title : 'Pending...'}
            </div>
            <div className="status-box" style={{ background: state.activeExtremeEvent ? '#fff5f5' : '#f7fafc', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
              <strong>Extreme Event:</strong><br />
              {state.activeExtremeEvent ? state.activeExtremeEvent.title : 'None'}
            </div>
            <div className="status-box" style={{ background: state.activeUncertainty ? '#faf5ff' : '#f7fafc', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
              <strong>Uncertainty:</strong><br />
              {state.activeUncertainty ? state.activeUncertainty.title : 'None'}
            </div>
          </section>

          <section className="card">
            <h3>Expert Status</h3>
            <div style={{ padding: '10px', background: state.consultationActive ? '#f0fff4' : '#f7fafc', borderRadius: '4px' }}>
              {state.consultationActive ? (
                <span style={{ color: '#2f855a', fontWeight: 'bold' }}>● Consultation in Progress</span>
              ) : (
                <span style={{ color: '#718096' }}>○ Expert Available</span>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
