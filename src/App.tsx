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
import { PinLogin } from './components/common/PinLogin';
import type { RoleMode } from './types';

const MainAppContent: React.FC = () => {
  const { role, setRole, setSelectedTableId } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  
  // Auth state
  const [isAdminAuth, setIsAdminAuth] = useState(() => sessionStorage.getItem('auth_admin') === 'true');
  const [isKitchenAuth, setIsKitchenAuth] = useState(() => sessionStorage.getItem('auth_kitchen') === 'true');

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

  // Sync URL routes, pathnames, hashes, and params on load and popstate
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      
      let detectedRole: RoleMode = 'customer';
      if (path.includes('/kitchen') || path.includes('/kds') || hash.includes('/kitchen') || hash.includes('/kds') || params.get('view') === 'kitchen' || params.get('view') === 'kds') {
        detectedRole = 'kitchen';
      } else if (path.includes('/admin') || hash.includes('/admin') || params.get('view') === 'admin') {
        detectedRole = 'admin';
      } else if (path.includes('/simulator') || hash.includes('/simulator') || params.get('view') === 'simulator') {
        detectedRole = 'simulator';
      } else if (path.includes('/customer') || hash.includes('/customer') || params.get('view') === 'customer') {
        detectedRole = 'customer';
      }
      
      setRole(detectedRole);

      // Parse table from query params or pathname (e.g. /table/T-04)
      const tableParam = params.get('table');
      if (tableParam) {
        setSelectedTableId(tableParam.toUpperCase());
      } else {
        const tableMatch = path.match(/\/table\/(t-\d+)/i) || hash.match(/\/table\/(t-\d+)/i);
        if (tableMatch && tableMatch[1]) {
          setSelectedTableId(tableMatch[1].toUpperCase());
        }
      }
    };

    parseUrl();

    // Listen for browser forward/back popstate triggers
    window.addEventListener('popstate', parseUrl);
    return () => {
      window.removeEventListener('popstate', parseUrl);
    };
  }, [setRole, setSelectedTableId]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-900)', color: 'var(--chalk-100)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar Navigation — hidden for customer (customer has its own inline header) */}
      {role !== 'customer' && (
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        />
      )}

      {/* Main View Area */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: role === 'simulator' ? 1600 : role === 'customer' ? '100%' : 1200,
        margin: '0 auto',
        padding: role === 'customer' ? '0' : '24px 16px',
      }}>
        {role === 'customer' && <CustomerView onOpenCart={() => setIsCartOpen(true)} onOpenOrderTracker={() => setIsOrderTrackerOpen(true)} />}
        
        {role === 'kitchen' && (
          isKitchenAuth ? <KitchenView /> : <PinLogin roleName="Kitchen" expectedPin="1234" onSuccess={() => { setIsKitchenAuth(true); sessionStorage.setItem('auth_kitchen', 'true'); }} />
        )}
        
        {role === 'admin' && (
          isAdminAuth ? <AdminView /> : <PinLogin roleName="Admin" expectedPin="5678" onSuccess={() => { setIsAdminAuth(true); sessionStorage.setItem('auth_admin', 'true'); }} />
        )}
        
        {role === 'simulator' && <MultiDashboardView />}
      </main>

      {/* Footer — only for non-customer views */}
      {role !== 'customer' && (
        <footer style={{ borderTop: '1px solid var(--line-15)', padding: '20px 0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--chalk-400)', background: 'var(--ink-700)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span>Savour OS — Table-Side QR Ordering & Kitchen Operations System</span>
            <span style={{ color: 'var(--gold-500)' }}>Vite · React · TypeScript · Real-Time Broadcast Sync</span>
          </div>
        </footer>
      )}

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
