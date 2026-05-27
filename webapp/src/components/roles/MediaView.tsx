import { useState } from 'react';
import type { GameState } from '../../types/game';

interface Props {
  state: GameState;
  sendMediaMessage: (text: string) => void;
}

export function MediaView({ state, sendMediaMessage }: Props) {
  const [msg, setMsg] = useState('');

  return (
    <div className="media-view" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* News Terminal Card */}
        <section className="card" style={{ borderLeft: '4px solid var(--media-indigo)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 8px' }}>Media Bureau Terminal</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Broadcast breaking alerts to influence community narratives, state policies, and warn of hydrological events.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 10px', color: 'var(--color-text-primary)' }}>Compose Broadcast Alert</h3>
            <textarea 
              style={{ 
                width: '100%', 
                minHeight: '120px', 
                padding: '14px', 
                borderRadius: '12px', 
                border: '2px solid var(--color-border)', 
                marginBottom: '12px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem'
              }}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="e.g. BREAKING: Unprecedented flood surge detected upstream. Local authorities advise immediate preparation..."
            />
            <button 
              className="btn btn-primary" 
              style={{ backgroundColor: 'var(--media-indigo)', border: 'none', padding: '10px 20px', fontSize: '0.9rem' }}
              onClick={() => {
                if (msg.trim()) {
                  sendMediaMessage(msg);
                  setMsg('');
                }
              }}
            >
              🚀 Send Broadcast Alert
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📜 Transmission Logs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.mediaMessages.map(m => (
              <div 
                key={m.id} 
                style={{ 
                  background: 'var(--color-bg)', 
                  padding: '14px 16px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--color-border)',
                  borderLeft: '4px solid var(--media-indigo)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <small style={{ color: 'var(--media-indigo)', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>
                    📢 Broadcast
                  </small>
                  <small style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </small>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--color-text-primary)', textAlign: 'left' }}>
                  {m.text}
                </p>
              </div>
            ))}
            {state.mediaMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No transmission history. Draft and broadcast your first alert above.
              </div>
            )}
          </div>
        </section>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section className="card" style={{ borderLeft: '4px solid var(--river-blue-start)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px' }}>Basin Conditions</h3>
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
