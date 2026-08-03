import React from 'react';
import { CustomerView } from '../customer/CustomerView';
import { KitchenView } from '../kitchen/KitchenView';
import { AdminView } from '../admin/AdminView';
import { Smartphone, Monitor, LayoutGrid } from 'lucide-react';

export const MultiDashboardView: React.FC = () => {
  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 40 }} className="font-body">
      
      {/* Header Banner */}
      <div
        style={{
          background: 'var(--ink-700)',
          border: '1px solid var(--line-15)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid style={{ width: 20, height: 20, color: 'var(--gold-500)' }} />
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--chalk-100)' }}>
              Live 3-Surface System Simulator
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--chalk-400)', marginTop: 2 }}>
            All 3 surfaces listen to the same real-time store. Place an order on the phone (left) to watch it appear live on the Kitchen KDS (center) & Admin Panel (right)!
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sage-500)', background: 'rgba(122,148,113,0.15)', padding: '6px 12px', borderRadius: 999 }}>
            ● BroadcastChannel Sync Active
          </span>
        </div>
      </div>

      {/* 3-Column Split View Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Surface 1: Customer Phone View */}
        <div
          style={{
            background: 'var(--ink-900)',
            border: '2px solid var(--line-15)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              background: 'var(--ink-700)',
              padding: '10px 16px',
              borderBottom: '1px solid var(--line-15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Smartphone style={{ width: 16, height: 16, color: 'var(--gold-500)' }} />
              <span className="font-ticket" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--chalk-100)' }}>
                SURFACE 1: CUSTOMER PHONE
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--chalk-400)' }}>/menu/T-04</span>
          </div>

          <div style={{ maxHeight: 720, overflowY: 'auto' }} className="no-scrollbar">
            <CustomerView />
          </div>
        </div>

        {/* Surface 2: Kitchen Display Board */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid #EBEBEB',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
            color: '#1A1A1A',
          }}
        >
          <div
            style={{
              background: '#F7F7F5',
              padding: '10px 16px',
              borderBottom: '1px solid #EBEBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Monitor style={{ width: 16, height: 16, color: 'var(--brick-500)' }} />
              <span className="font-ticket" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1A1A1A' }}>
                SURFACE 2: KITCHEN KDS BOARD
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#8C8C8C' }}>/kitchen</span>
          </div>

          <div style={{ maxHeight: 720, overflowY: 'auto' }} className="no-scrollbar">
            <KitchenView />
          </div>
        </div>

        {/* Surface 3: Admin Analytics Dashboard */}
        <div
          style={{
            background: 'var(--ink-900)',
            border: '2px solid var(--line-15)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              background: 'var(--ink-700)',
              padding: '10px 16px',
              borderBottom: '1px solid var(--line-15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Monitor style={{ width: 16, height: 16, color: 'var(--gold-500)' }} />
              <span className="font-ticket" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--chalk-100)' }}>
                SURFACE 3: ADMIN DASHBOARD
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--chalk-400)' }}>/admin</span>
          </div>

          <div style={{ maxHeight: 720, overflowY: 'auto', padding: 12 }} className="no-scrollbar">
            <AdminView />
          </div>
        </div>
      </div>
    </div>
  );
};
