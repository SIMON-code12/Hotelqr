import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface PinLoginProps {
  roleName: string;
  expectedPin: string;
  onSuccess: () => void;
}

export const PinLogin: React.FC<PinLoginProps> = ({ roleName, expectedPin, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === expectedPin) {
      onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      width: '100%'
    }}>
      <div style={{
        background: 'var(--ink-700)',
        border: '1px solid var(--line-15)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(217,166,46,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Lock style={{ width: 28, height: 28, color: 'var(--gold-500)' }} />
        </div>
        
        <h2 className="font-sora" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--chalk-100)', marginBottom: '8px' }}>
          {roleName} Access
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--chalk-400)', marginBottom: '24px' }}>
          Please enter the PIN to access this surface.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            placeholder="Enter PIN..."
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--ink-900)',
              border: `1px solid ${error ? 'var(--brick-500)' : 'var(--line-15)'}`,
              color: 'var(--chalk-100)',
              fontSize: '1rem',
              textAlign: 'center',
              letterSpacing: '0.25em',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
          {error && <span style={{ color: 'var(--brick-500)', fontSize: '0.75rem' }}>{error}</span>}
          
          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gold-500)',
              color: 'var(--ink-900)',
              fontSize: '1rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-400)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold-500)'}
          >
            Unlock <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
        </form>
      </div>
    </div>
  );
};
