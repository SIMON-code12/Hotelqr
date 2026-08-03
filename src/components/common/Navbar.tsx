import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Ticket } from 'lucide-react';
import type { RoleMode } from '../../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenOrderTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenOrderTracker }) => {
  const { role, setRole, cart, orders, selectedTableId, waiterRequests } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeTableOrder = orders.find((o) => o.table_id === selectedTableId && !['completed', 'cancelled'].includes(o.status));
  const pendingRequestsCount = waiterRequests.length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      width: '100%',
      background: 'var(--ink-900)',
      borderBottom: '1px solid var(--line-15)',
      padding: '12px 20px',
    }}>
      <div style={{
        maxWidth: 1120,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>

        {/* Brand Wordmark in Fraunces font */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-display" style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--chalk-100)',
            letterSpacing: '-0.02em',
          }}>
            Savour OS
          </span>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--gold-500)',
            display: 'inline-block',
          }} />
        </div>

        {/* Desktop Surface Switcher */}
        {role === 'simulator' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 4,
            borderRadius: 'var(--radius-md)',
            background: 'var(--ink-700)',
            border: '1px solid var(--line-15)',
          }}
            className="hidden md:flex"
          >
            {([
              { key: 'customer' as RoleMode, label: 'Customer Menu' },
              { key: 'kitchen' as RoleMode, label: 'Kitchen KDS', badge: orders.filter(o => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing').length },
              { key: 'admin' as RoleMode, label: 'Admin Panel', badge: pendingRequestsCount },
              { key: 'simulator' as RoleMode, label: '⚡ 3-Dashboard Split View' },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRole(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: role === tab.key ? 600 : 400,
                  color: role === tab.key ? 'var(--ink-900)' : 'var(--chalk-400)',
                  background: role === tab.key ? 'var(--gold-500)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    background: 'var(--brick-500)',
                    color: 'var(--chalk-100)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Mobile role selector */}
          {role === 'simulator' && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RoleMode)}
              className="md:hidden font-ticket"
              style={{
                background: 'var(--ink-700)',
                border: '1px solid var(--line-15)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--gold-500)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="customer">Menu Surface</option>
              <option value="kitchen">Kitchen KDS</option>
              <option value="admin">Admin Surface</option>
              <option value="simulator">⚡ 3-Dashboard Split View</option>
            </select>
          )}

          {/* Active order tracking pill */}
          {role === 'customer' && activeTableOrder && (
            <button
              onClick={onOpenOrderTracker}
              className="hidden sm:flex font-ticket"
              style={{
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--gold-500)',
                background: 'rgba(217, 166, 46, 0.15)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--gold-500)',
                cursor: 'pointer',
              }}
            >
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--gold-500)',
              }} />
              Ticket #{activeTableOrder.orderNumber} ({activeTableOrder.status})
            </button>
          )}

          {/* Ticket Cart Button */}
          {role === 'customer' && (
            <button
              onClick={onOpenCart}
              aria-label="View Ticket"
              style={{
                position: 'relative',
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--ink-700)',
                border: '1px solid var(--line-15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--chalk-100)',
              }}
            >
              <Ticket style={{ width: 20, height: 20, color: 'var(--chalk-100)' }} />
              {totalCartCount > 0 && (
                <span className="font-ticket" style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 999,
                  background: 'var(--gold-500)',
                  color: 'var(--ink-900)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {totalCartCount}
                </span>
              )}
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
