import { useState } from 'react';
import type { GameState } from '../../types/game';

interface Props {
  state: GameState;
  sendMediaMessage: (text: string) => void;
}

export function MediaView({ state, sendMediaMessage }: Props) {
  const [msg, setMsg] = useState('');

  return (
    <div className="media-view">
      <section className="card" style={{ borderLeftColor: '#805ad5' }}>
        <h2>Media Bureau</h2>
        <div style={{ marginBottom: '20px' }}>
          <h3>Broadcast New Alert</h3>
          <textarea 
            style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e0', marginBottom: '10px' }}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a breaking news alert or message to all participants..."
          />
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#805ad5' }}
            onClick={() => {
              if (msg.trim()) {
                sendMediaMessage(msg);
                setMsg('');
              }
            }}
          >
            Broadcast Message
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

        <h3>Sent Messages</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {state.mediaMessages.map(m => (
            <div key={m.id} style={{ background: '#faf5ff', padding: '10px', borderRadius: '4px', border: '1px solid #d6bcfa' }}>
              <small style={{ color: '#805ad5', fontWeight: 'bold' }}>{new Date(m.timestamp).toLocaleTimeString()}</small>
              <p style={{ margin: '5px 0 0' }}>{m.text}</p>
            </div>
          ))}
          {state.mediaMessages.length === 0 && <p style={{ color: '#a0aec0' }}>No messages sent yet.</p>}
        </div>
      </section>
    </div>
  );
}
