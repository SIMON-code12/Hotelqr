import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Bell, Droplets, Receipt, Sparkles, Hand, X } from 'lucide-react';
import type { WaiterRequestType } from '../../types';

export const TableServiceFAB: React.FC = () => {
  const { createWaiterRequest, selectedTableId } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const ACTIONS: { type: WaiterRequestType; label: string; icon: any; bgColor: string; color: string }[] = [
    { type: 'water',       label: 'Need Water',    icon: Droplets, bgColor: 'rgba(34,211,238,0.12)',   color: '#22D3EE' },
    { type: 'call_waiter', label: 'Call Waiter',   icon: Hand,     bgColor: 'rgba(255,138,52,0.12)',   color: '#FF8A34' },
    { type: 'bring_bill',  label: 'Need Bill',     icon: Receipt,  bgColor: 'rgba(52,211,153,0.12)',   color: '#34D399' },
    { type: 'clean_table', label: 'Clean Table',   icon: Sparkles, bgColor: 'rgba(167,139,250,0.12)', color: '#A78BFA' },
  ];

  const handleTrigger = (type: WaiterRequestType, label: string) => {
    createWaiterRequest(type, label);
    setIsOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 90,
      right: 16,
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 10,
    }}>
      {/* Floating Action Menu */}
      {isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
          animation: 'fab-slide-up 0.25s ease-out forwards',
        }}>
          {/* Label */}
          <div style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(20,16,12,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '5px 12px',
            borderRadius: 8,
            backdropFilter: 'blur(12px)',
          }}>
            Table {selectedTableId} · Request Assistance
          </div>

          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => handleTrigger(action.type, action.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 999,
                  border: `1px solid ${action.color}30`,
                  background: action.bgColor,
                  backdropFilter: 'blur(16px)',
                  color: action.color,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: `0 4px 20px ${action.color}20`,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <span>{action.label}</span>
                <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Call Table Service"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          background: isOpen
            ? 'rgba(30,24,18,0.95)'
            : 'linear-gradient(135deg, #FF8A34 0%, #D9A62E 100%)',
          boxShadow: isOpen
            ? '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)'
            : '0 8px 28px rgba(255,138,52,0.55), 0 0 0 0px rgba(255,138,52,0)',
          color: isOpen ? 'rgba(255,255,255,0.6)' : '#1C1410',
          animation: isOpen ? 'none' : 'bell-pulse 2.5s ease-in-out infinite',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isOpen
          ? <X style={{ width: 22, height: 22 }} />
          : <Bell style={{ width: 24, height: 24, strokeWidth: 2.5 }} />
        }
      </button>

      <style>{`
        @keyframes bell-pulse {
          0%, 100% { box-shadow: 0 8px 28px rgba(255,138,52,0.55), 0 0 0 0px rgba(255,138,52,0.4); }
          50% { box-shadow: 0 8px 28px rgba(255,138,52,0.7), 0 0 0 10px rgba(255,138,52,0); }
        }
        @keyframes fab-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
