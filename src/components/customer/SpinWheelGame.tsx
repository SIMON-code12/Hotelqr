import React, { useState, useRef, useEffect } from 'react';
import { Gift, RefreshCw } from 'lucide-react';

interface Prize {
  label: string;
  color: string;
  emoji: string;
  description: string;
}

const PRIZES: Prize[] = [
  { label: 'Free Dessert', color: '#FF8A34', emoji: '🍮', description: 'Show this to your waiter to get a complimentary dessert!' },
  { label: 'Try Again!', color: '#4A90D9', emoji: '🎲', description: 'Better luck next time! Spin again.' },
  { label: 'Free Drink', color: '#27AE60', emoji: '🥤', description: 'Show this to your waiter to get a complimentary drink!' },
  { label: '10% Off Bill', color: '#9B59B6', emoji: '💰', description: 'Show this to your waiter for 10% off your bill!' },
  { label: 'Free Starter', color: '#E74C3C', emoji: '🥗', description: 'Show this to your waiter to get a complimentary starter!' },
  { label: 'Spin Again!', color: '#F39C12', emoji: '✨', description: 'Lucky you! Spin one more time for free.' },
  { label: 'Free Coffee', color: '#8E6B3E', emoji: '☕', description: 'Show this to your waiter for a complimentary coffee!' },
  { label: 'Chef\'s Surprise', color: '#1ABC9C', emoji: '👨‍🍳', description: 'Ask your waiter for today\'s Chef\'s special surprise treat!' },
];

const TOTAL_SLICES = PRIZES.length;
const SLICE_DEG = 360 / TOTAL_SLICES;

export const SpinWheelGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(() => sessionStorage.getItem('spin_used') === 'true');
  const [prize, setPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const angleRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  const drawWheel = (currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    PRIZES.forEach((p, i) => {
      const startAngle = ((i * SLICE_DEG - 90 + currentAngle) * Math.PI) / 180;
      const endAngle = (((i + 1) * SLICE_DEG - 90 + currentAngle) * Math.PI) / 180;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + (SLICE_DEG * Math.PI) / 180 / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.fillText(p.emoji + ' ' + p.label, r - 12, 4);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#1C1410';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,138,52,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#FF8A34';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', cx, cy + 4);
  };

  useEffect(() => {
    drawWheel(0);
  }, []);

  const spin = () => {
    if (isSpinning || hasSpun) return;

    // Decide winning prize before animation
    const winIdx = Math.floor(Math.random() * TOTAL_SLICES);
    const winPrize = PRIZES[winIdx];

    // Calculate target angle so winning slice lands at pointer (top, 0 deg offset)
    const targetSliceCenter = winIdx * SLICE_DEG + SLICE_DEG / 2;
    const extra = 360 * (5 + Math.floor(Math.random() * 3)); // 5-7 full spins
    const targetAngle = extra + (360 - targetSliceCenter);

    setIsSpinning(true);
    let start: number | null = null;
    const duration = 4000 + Math.random() * 1000;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentAngle = eased * targetAngle;
      angleRef.current = currentAngle % 360;
      drawWheel(angleRef.current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setPrize(winPrize);
        setShowResult(true);
        // Only lock spin if not a "spin again" prize
        if (winPrize.label !== 'Try Again!' && winPrize.label !== 'Spin Again!') {
          setHasSpun(true);
          sessionStorage.setItem('spin_used', 'true');
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Header */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,138,52,0.12)', border: '1px solid rgba(255,138,52,0.25)',
          borderRadius: 999, padding: '6px 16px', marginBottom: 12,
        }}>
          <Gift style={{ width: 14, height: 14, color: '#FF8A34' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FF8A34', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            1 Free Spin Per Visit
          </span>
        </div>
        <h2 className="font-sora" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Spin & Win! 🎡
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          Land on a prize and your waiter will bring it to your table
        </p>
      </div>

      {/* Wheel Container */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

        {/* Pointer */}
        <div style={{
          position: 'absolute', top: -4, zIndex: 10,
          width: 0, height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '24px solid #FF8A34',
          filter: 'drop-shadow(0 4px 8px rgba(255,138,52,0.6))',
        }} />

        {/* Wheel outer glow ring */}
        <div style={{
          borderRadius: '50%',
          padding: 6,
          background: 'conic-gradient(from 0deg, #FF8A34, #D9A62E, #27AE60, #4A90D9, #9B59B6, #E74C3C, #8E6B3E, #1ABC9C, #FF8A34)',
          boxShadow: '0 0 40px rgba(255,138,52,0.3)',
          animation: isSpinning ? 'none' : 'pulse-ring 3s ease-in-out infinite',
        }}>
          <canvas
            ref={canvasRef}
            width={260}
            height={260}
            style={{ display: 'block', borderRadius: '50%' }}
          />
        </div>

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={isSpinning || hasSpun}
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: isSpinning || hasSpun
              ? 'rgba(255,255,255,0.08)'
              : 'linear-gradient(135deg, #FF8A34 0%, #D9A62E 100%)',
            border: 'none',
            color: isSpinning || hasSpun ? 'var(--text-secondary)' : '#FFFFFF',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: isSpinning || hasSpun ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: isSpinning || hasSpun ? 'none' : '0 8px 24px rgba(255,138,52,0.45)',
            transition: 'all 0.2s',
            letterSpacing: '0.02em',
          }}
        >
          <RefreshCw style={{ width: 18, height: 18, animation: isSpinning ? 'spin 0.6s linear infinite' : 'none' }} />
          {isSpinning ? 'Spinning...' : hasSpun ? 'Already Spun Today!' : 'Spin Now!'}
        </button>

        {hasSpun && !showResult && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
            Come back on your next visit for another free spin! 🎉
          </p>
        )}
      </div>

      {/* Prize Result Modal */}
      {showResult && prize && (
        <div
          onClick={() => setShowResult(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #2B1F17 0%, #1C1410 100%)',
              border: `2px solid ${prize.color}`,
              borderRadius: 24,
              padding: 32,
              textAlign: 'center',
              maxWidth: 320,
              width: '100%',
              boxShadow: `0 0 60px ${prize.color}40`,
              animation: 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <div style={{
              fontSize: '4rem', marginBottom: 12,
              animation: 'bounce 0.8s ease infinite alternate',
              display: 'inline-block',
            }}>
              {prize.emoji}
            </div>
            <h3 className="font-sora" style={{
              fontSize: '1.5rem', fontWeight: 800,
              color: prize.color, marginBottom: 8, lineHeight: 1.2
            }}>
              You Won!
            </h3>
            <div style={{
              display: 'inline-block',
              background: `${prize.color}20`,
              border: `1px solid ${prize.color}60`,
              borderRadius: 12, padding: '8px 18px', marginBottom: 16,
            }}>
              <span style={{ fontWeight: 700, color: prize.color, fontSize: '1.1rem' }}>
                {prize.label}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.5 }}>
              {prize.description}
            </p>

            {(prize.label === 'Try Again!' || prize.label === 'Spin Again!') ? (
              <button
                onClick={() => { setShowResult(false); }}
                style={{
                  padding: '12px 32px', borderRadius: 999,
                  background: prize.color, border: 'none',
                  color: '#FFF', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 6px 20px ${prize.color}50`,
                  width: '100%',
                }}
              >
                Spin Again! 🎡
              </button>
            ) : (
              <button
                onClick={() => setShowResult(false)}
                style={{
                  padding: '12px 32px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                  width: '100%',
                }}
              >
                Show Waiter to Claim 🎉
              </button>
            )}
          </div>
        </div>
      )}

      {/* Prize list */}
      <div style={{ marginTop: 28 }}>
        <h3 className="font-sora" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Possible Prizes
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {PRIZES.filter(p => p.label !== 'Try Again!' && p.label !== 'Spin Again!').map((p) => (
            <div key={p.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '10px 12px',
            }}>
              <span style={{ fontSize: '1.25rem' }}>{p.emoji}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { from { transform: translateY(0) scale(1); } to { transform: translateY(-8px) scale(1.1); } }
        @keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse-ring { 0%, 100% { box-shadow: 0 0 40px rgba(255,138,52,0.3); } 50% { box-shadow: 0 0 60px rgba(255,138,52,0.6); } }
      `}</style>
    </div>
  );
};
