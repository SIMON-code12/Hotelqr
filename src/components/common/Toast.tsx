import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px', // above the customer bottom navigation bar
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '340px',
      width: 'calc(100% - 40px)',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-pop"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            borderRadius: '16px',
            background: 'rgba(43, 31, 23, 0.95)', // var(--surface) with opacity
            border: '1px solid rgba(255, 138, 52, 0.2)', // subtle orange-accent border
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>
            {toast.type === 'success' && <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--accent-green)' }} />}
            {toast.type === 'warning' && <AlertTriangle style={{ width: '20px', height: '20px', color: 'var(--accent-amber)' }} />}
            {toast.type === 'info' && <Info style={{ width: '20px', height: '20px', color: 'var(--accent-orange)' }} />}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h5 className="font-sora" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              {toast.title}
            </h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0, lineHeight: 1.4 }}>
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFF' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      ))}
    </div>
  );
};

