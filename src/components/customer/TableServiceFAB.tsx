import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Bell, Droplets, Receipt, Sparkles, Hand, X } from 'lucide-react';
import type { WaiterRequestType } from '../../types';

export const TableServiceFAB: React.FC = () => {
  const { createWaiterRequest, selectedTableId } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const ACTIONS: { type: WaiterRequestType; label: string; icon: any; color: string }[] = [
    { type: 'water', label: 'Request Water', icon: Droplets, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { type: 'call_waiter', label: 'Call Waiter', icon: Hand, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
    { type: 'bring_bill', label: 'Bring Bill', icon: Receipt, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { type: 'clean_table', label: 'Clean Table', icon: Sparkles, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' }
  ];

  const handleTrigger = (type: WaiterRequestType, label: string) => {
    createWaiterRequest(type, label);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Floating Action Menu */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-fade-up">
          <div className="text-[11px] font-bold text-slate-400 bg-slate-900/90 border border-white/10 px-3 py-1 rounded-lg backdrop-blur-md">
            Table {selectedTableId} Assistance
          </div>

          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => handleTrigger(action.type, action.label)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full border shadow-xl backdrop-blur-xl font-bold text-xs transition-all hover:scale-105 ${action.color}`}
              >
                <span>{action.label}</span>
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Service Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isOpen
            ? 'bg-slate-800 text-slate-300 border border-white/20'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-orange-500/40 hover:scale-105 animate-pulse'
        }`}
        aria-label="Call Table Service"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bell className="w-6 h-6 stroke-[2.5]" />}
      </button>
    </div>
  );
};
