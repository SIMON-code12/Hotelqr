import React, { useState } from 'react';
import type { MenuItem } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, Star, Heart, Minus, Plus } from 'lucide-react';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

const SIZES = ['S', 'M', 'L'] as const;
const SIZE_LABELS: Record<string, string> = { S: 'Regular', M: 'Large', L: 'X Large' };
const SIZE_EXTRA: Record<string, number> = { S: 0, M: 20, L: 40 };

interface Addon {
  name: string;
  price: number;
  enabled: boolean;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<typeof SIZES[number]>('S');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addons, setAddons] = useState<Addon[]>([
    { name: 'Add Cheese', price: 20, enabled: true },
    { name: 'Extra Patty', price: 50, enabled: false },
    { name: 'Add Bacon', price: 40, enabled: true },
  ]);

  if (!item) return null;

  const imageUrl = item.image_url || item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
  const sizeExtra = SIZE_EXTRA[selectedSize];
  const addonsTotal = addons.filter(a => a.enabled).reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + sizeExtra;
  const total = (unitPrice + addonsTotal) * quantity;

  const toggleAddon = (index: number) => {
    setAddons(prev => prev.map((a, i) => i === index ? { ...a, enabled: !a.enabled } : a));
  };

  const handleAddToCart = () => {
    const selectedAddons = addons.filter(a => a.enabled).map(a => ({
      categoryName: 'Add-on',
      optionLabel: a.name,
      extraPrice: a.price,
    }));
    if (selectedSize !== 'S') {
      selectedAddons.push({ categoryName: 'Size', optionLabel: SIZE_LABELS[selectedSize], extraPrice: sizeExtra });
    }
    addToCart(item, quantity, selectedAddons);
    onClose();
  };

  const isSpicy = item.name.toLowerCase().includes('spicy') || item.description.toLowerCase().includes('spicy') || item.name.toLowerCase().includes('chili');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
      }}
      className="animate-pop font-inter"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--surface-raised)',
          borderRadius: '28px 28px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text-primary)',
        }}
        className="no-scrollbar"
      >
        {/* Hero photo container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            overflow: 'hidden',
            background: 'var(--bg-base)',
          }}
        >
          <img
            src={imageUrl}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Ambient gradient overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              background: 'linear-gradient(transparent, var(--surface-raised))',
            }}
          />

          {/* Back button top-left */}
          <button
            onClick={onClose}
            aria-label="Back to menu"
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
            }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} />
          </button>

          {/* Heart favorite button top-right */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label="Favorite item"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Heart
              style={{
                width: 18,
                height: 18,
                color: isFavorite ? 'var(--favorite-red)' : '#FFFFFF',
                fill: isFavorite ? 'var(--favorite-red)' : 'transparent',
              }}
            />
          </button>
        </div>

        {/* Content Details */}
        <div style={{ padding: '0 24px 100px' }}>

          {/* Badges Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            {isSpicy && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: 'var(--accent-red)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Spicy
              </span>
            )}
            {item.is_veg && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#7A9471',
                  background: 'rgba(122, 148, 113, 0.15)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7A9471' }} />
                Vegetarian
              </span>
            )}
          </div>

          {/* Title and Price line */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <h2 className="font-sora" style={{ fontSize: 'var(--cust-text-h1)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
              {item.name}
            </h2>
            <span className="font-sora" style={{ fontSize: 'var(--cust-text-price)', fontWeight: 700, color: 'var(--accent-orange)', flexShrink: 0 }}>
              ₹{item.price.toFixed(2)}
            </span>
          </div>

          {/* Rating (only if data exists) */}
          {item.rating != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Star style={{ width: 16, height: 16, fill: 'var(--accent-orange)', color: 'var(--accent-orange)' }} />
              <span className="font-sora" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {item.rating}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                ({item.reviewsCount || 120})
              </span>
            </div>
          )}

          {/* Description */}
          <p style={{ fontSize: 'var(--cust-text-body)', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: 24, margin: 0 }}>
            {item.description}
          </p>

          {/* Customize Section Header */}
          <div style={{ marginTop: 24, marginBottom: 16 }}>
            <h3 className="font-sora" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Customize
            </h3>
          </div>

          {/* Size Option Selector */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}>
              Size
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              {SIZES.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className="font-sora"
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      background: isSelected ? 'var(--accent-orange)' : 'var(--surface)',
                      border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(255,138,52,0.35)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {SIZE_LABELS[sz]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {addons.map((addon, index) => (
              <div
                key={addon.name}
                onClick={() => toggleAddon(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {addon.name}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {addon.price > 0 && (
                    <span className="font-sora" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      +₹{addon.price}
                    </span>
                  )}
                  <div className={`cust-toggle-track ${addon.enabled ? 'active' : ''}`}>
                    <div className="cust-toggle-thumb" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Sticky Bottom Bar */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 70,
            background: 'var(--surface-raised)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 24px 24px',
            maxWidth: 480,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Quantity Stepper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--surface)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Minus style={{ width: 16, height: 16 }} />
            </button>
            <span className="font-sora" style={{ fontSize: '1rem', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="font-sora"
            style={{
              flex: 1,
              height: 52,
              borderRadius: 'var(--radius-button)',
              background: 'var(--accent-orange)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255,138,52,0.4)',
              transition: 'background 0.15s ease',
            }}
          >
            <span>Add to Cart</span>
            <span>₹{total.toFixed(2)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
