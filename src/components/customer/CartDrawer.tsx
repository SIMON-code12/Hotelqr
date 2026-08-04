import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, placeOrder, addToast, selectedTableId } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tipAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleOpen = () => {};
    window.addEventListener('open-cart-drawer', handleOpen);
    return () => window.removeEventListener('open-cart-drawer', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVOUR20') {
      setDiscountAmount(cartSubtotal * 0.2);
      setAppliedCoupon('SAVOUR20');
      addToast('Coupon applied', '20% discount added to cart', 'success');
    } else if (code === 'WELCOME10') {
      setDiscountAmount(Math.min(10, cartSubtotal));
      setAppliedCoupon('WELCOME10');
      addToast('Coupon applied', '₹10 off added to cart', 'success');
    } else {
      addToast('Invalid promo code', 'Try SAVOUR20 or WELCOME10', 'warning');
    }
  };

  const afterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const tax = afterDiscount * 0.08;
  const grandTotal = afterDiscount + tax + tipAmount;

  const handleSendToKitchen = () => {
    if (isSubmitting || cart.length === 0) return;
    setIsSubmitting(true);

    try {
      placeOrder('', appliedCoupon || undefined, tipAmount);
      onOrderPlaced();
      onClose();
    } catch (err: any) {
      addToast("Couldn't reach kitchen", err.message || 'Please try again', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      className="animate-pop font-inter"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          height: '100%',
          background: 'var(--surface-raised)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-orange)', background: 'rgba(255,138,52,0.15)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase' }}>
              Table {selectedTableId}
            </span>
            <h3 className="font-sora" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, margin: 0 }}>
              Your Cart
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--surface)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 12px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Your cart is empty — tap a dish to add it.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <img src={item.image_url} alt={item.name} style={{ width: 52, height: 52, borderRadius: 'var(--radius-card)', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 className="font-sora" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                    {item.name}
                  </h4>
                  <span className="font-sora" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', padding: '2px 6px', borderRadius: 'var(--radius-pill)' }}>
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    style={{ width: 22, height: 22, borderRadius: '50%', background: 'transparent', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Minus style={{ width: 12, height: 12 }} />
                  </button>
                  <span className="font-sora" style={{ fontSize: '0.875rem', fontWeight: 700, minWidth: 14, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-orange)', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Plus style={{ width: 12, height: 12 }} />
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: 4 }}>
                  <Trash2 style={{ width: 16, height: 16 }} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div style={{ padding: '16px 20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="PROMO CODE"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-raised)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: '#FFF', outline: 'none' }}
              />
              <button onClick={handleApplyCoupon} style={{ padding: '8px 14px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-raised)', border: '1px solid var(--accent-orange)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-orange)', cursor: 'pointer' }}>
                Apply
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-red)', marginBottom: 4 }}>
                  <span>Discount ({appliedCoupon})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                <span>Taxes (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 6 }}>
                <span>Total</span>
                <span className="font-sora" style={{ color: 'var(--accent-orange)' }}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSendToKitchen}
              disabled={isSubmitting}
              className="font-sora"
              style={{
                width: '100%',
                height: 48,
                borderRadius: 'var(--radius-button)',
                background: 'var(--accent-orange)',
                border: 'none',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#FFF',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(255,138,52,0.4)',
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Order to Kitchen'}
              {!isSubmitting && <ArrowRight style={{ width: 18, height: 18 }} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
