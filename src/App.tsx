import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/Toast';
import { CustomerView } from './components/customer/CustomerView';
import { KitchenView } from './components/kitchen/KitchenView';
import { AdminView } from './components/admin/AdminView';
import { MultiDashboardView } from './components/common/MultiDashboardView';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { TableServiceFAB } from './components/customer/TableServiceFAB';
import type { RoleMode } from './types';

const MainAppContent: React.FC = () => {
  const { role, setRole, setSelectedTableId } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Global drawer events
  useEffect(() => {
    const handleCartOpen = () => setIsCartOpen(true);
    const handleTrackerOpen = () => setIsOrderTrackerOpen(true);

    window.addEventListener('open-cart-drawer', handleCartOpen);
    window.addEventListener('open-order-tracker', handleTrackerOpen);

    return () => {
      window.removeEventListener('open-cart-drawer', handleCartOpen);
      window.removeEventListener('open-order-tracker', handleTrackerOpen);
    };
  }, []);

  // Sync URL Params on load (e.g. ?table=T-05 or ?view=kitchen or ?view=simulator)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    const viewParam = params.get('view');

    if (tableParam) {
      setSelectedTableId(tableParam.toUpperCase());
    }
    if (viewParam && (viewParam === 'customer' || viewParam === 'kitchen' || viewParam === 'admin' || viewParam === 'simulator')) {
      setRole(viewParam as RoleMode);
    }
  }, [setRole, setSelectedTableId]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-900)', color: 'var(--chalk-100)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, width: '100%', maxWidth: role === 'simulator' ? 1600 : 1200, margin: '0 auto', padding: '24px 16px' }}>
        {role === 'customer' && <CustomerView />}
        {role === 'kitchen' && <KitchenView />}
        {role === 'admin' && <AdminView />}
        {role === 'simulator' && <MultiDashboardView />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--line-15)', padding: '20px 0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--chalk-400)', background: 'var(--ink-700)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span>Savour OS — Table-Side QR Ordering & Kitchen Operations System</span>
          <span style={{ color: 'var(--gold-500)' }}>Vite · React · TypeScript · Real-Time Broadcast Sync</span>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={() => setIsOrderTrackerOpen(true)}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      {/* Floating Waiter FAB in Customer Mode */}
      {role === 'customer' && <TableServiceFAB />}

      {/* Floating Toasts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;
