import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';

interface Prize {
  label: string;
  color: string;
  emoji: string;
  description: string;
}

const PRIZES: Prize[] = [
  { label: 'Free Dessert', color: '#FF8A34', emoji: '🍮', description: 'Show this to your waiter to get a complimentary dessert!' },
  { label: 'Free Drink', color: '#27AE60', emoji: '🥤', description: 'Show this to your waiter to get a complimentary drink!' },
  { label: '10% Off Bill', color: '#9B59B6', emoji: '💰', description: 'Show this to your waiter for 10% off your bill!' },
  { label: 'Free Starter', color: '#E74C3C', emoji: '🥗', description: 'Show this to your waiter to get a complimentary starter!' },
  { label: 'Free Coffee', color: '#8E6B3E', emoji: '☕', description: 'Show this to your waiter for a complimentary coffee!' },
  { label: 'Chef\'s Surprise', color: '#1ABC9C', emoji: '👨‍🍳', description: 'Ask your waiter for today\'s Chef\'s special surprise treat!' },
];

export const SpinWheelGame: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'wheel' | 'scratch' | 'catch' | 'tap'>('wheel');
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const triggerWin = (prize: Prize) => {
    setWonPrize(prize);
    setShowResult(true);
  };

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Game Mode Selector Tabs */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        paddingBottom: 14, marginBottom: 14,
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }} className="no-scrollbar">
        {([
          { id: 'wheel', label: '🎡 Spin Wheel' },
          { id: 'scratch', label: '🎫 Scratch Card' },
          { id: 'sudoku', label: '🔢 Mini Sudoku' },
          { id: 'puzzle', label: '🧩 Tile Puzzle' },
          { id: 'catch', label: '🍎 Catch & Win' },
          { id: 'tap', label: '⚡ Speed Tap' }
        ] as const).map((game) => {
          const isActive = activeGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                setActiveGame(game.id as any);
              }}
              style={{
                flexShrink: 0,
                padding: '10px 16px',
                borderRadius: 14,
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'var(--accent-orange)' : 'var(--surface)',
                color: isActive ? '#FFF' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              {game.label}
            </button>
          );
        })}
      </div>

      {/* Render Selected Game */}
      {activeGame === 'wheel' && <WheelSubGame onWin={triggerWin} />}
      {activeGame === 'scratch' && <ScratchSubGame onWin={triggerWin} />}
      {activeGame === ('sudoku' as any) && <SudokuSubGame onWin={triggerWin} />}
      {activeGame === ('puzzle' as any) && <PuzzleSubGame onWin={triggerWin} />}
      {activeGame === 'catch' && <CatchSubGame onWin={triggerWin} />}
      {activeGame === 'tap' && <TapSubGame onWin={triggerWin} />}

      {/* Shared Win Result Modal */}
      {showResult && wonPrize && (
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
              border: `2px solid ${wonPrize.color}`,
              borderRadius: 24,
              padding: 32,
              textAlign: 'center',
              maxWidth: 320,
              width: '100%',
              boxShadow: `0 0 60px ${wonPrize.color}40`,
              animation: 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <div style={{
              fontSize: '4rem', marginBottom: 12,
              animation: 'bounce 0.8s ease infinite alternate',
              display: 'inline-block',
            }}>
              {wonPrize.emoji}
            </div>
            <h3 className="font-sora" style={{
              fontSize: '1.5rem', fontWeight: 800,
              color: wonPrize.color, marginBottom: 8, lineHeight: 1.2
            }}>
              Congratulations! 🎉
            </h3>
            <div style={{
              display: 'inline-block',
              background: `${wonPrize.color}20`,
              border: `1px solid ${wonPrize.color}60`,
              borderRadius: 12, padding: '8px 18px', marginBottom: 16,
            }}>
              <span style={{ fontWeight: 700, color: wonPrize.color, fontSize: '1.1rem' }}>
                {wonPrize.label}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.5 }}>
              {wonPrize.description}
            </p>

            <button
              onClick={() => setShowResult(false)}
              style={{
                padding: '12px 32px', borderRadius: 999,
                background: 'var(--accent-orange)', border: 'none',
                color: '#FFF', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                width: '100%',
              }}
            >
              Claim Reward 🎉
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
};

/* ══════════════════ 1. SPIN WHEEL GAME ══════════════════ */
const WheelSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
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
    const sliceDeg = 360 / PRIZES.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    PRIZES.forEach((p, i) => {
      const startAngle = ((i * sliceDeg - 90 + currentAngle) * Math.PI) / 180;
      const endAngle = (((i + 1) * sliceDeg - 90 + currentAngle) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + (sliceDeg * Math.PI) / 180 / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(p.emoji + ' ' + p.label, r - 12, 4);
      ctx.restore();
    });

    // Center Pin
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#1C1410';
    ctx.fill();
    ctx.fillStyle = '#FF8A34';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', cx, cy + 3);
  };

  useEffect(() => {
    drawWheel(0);
  }, []);

  const spin = () => {
    if (isSpinning) return;
    const winIdx = Math.floor(Math.random() * PRIZES.length);
    const winPrize = PRIZES[winIdx];
    const sliceDeg = 360 / PRIZES.length;
    const targetSliceCenter = winIdx * sliceDeg + sliceDeg / 2;
    const targetAngle = 360 * 6 + (360 - targetSliceCenter);

    setIsSpinning(true);
    let start: number | null = null;
    const duration = 4000;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      angleRef.current = eased * targetAngle;
      drawWheel(angleRef.current % 360);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        onWin(winPrize);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 10px' }}>
        Land on a reward and staff will deliver it to your table!
      </p>

      <div style={{ position: 'relative' }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
          width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '20px solid #FF8A34'
        }} />
        <canvas ref={canvasRef} width={240} height={240} style={{ borderRadius: '50%', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        style={{
          padding: '12px 36px', borderRadius: 999,
          background: 'linear-gradient(135deg, #FF8A34 0%, #D9A62E 100%)',
          color: '#FFF', fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(255,138,52,0.3)',
        }}
      >
        {isSpinning ? 'Spinning...' : 'Spin Now!'}
      </button>
    </div>
  );
};

/* ══════════════════ 2. SCRATCH CARD GAME ══════════════════ */
const ScratchSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPrize] = useState(() => PRIZES[Math.floor(Math.random() * PRIZES.length)]);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw grey scratch layer
    ctx.fillStyle = '#666';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay textures/pattern
    ctx.fillStyle = '#444';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.fillRect(i + 4, j + 4, 12, 12);
      }
    }

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL!', canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    if (isComplete) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check progress
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) cleared++;
    }
    const percent = Math.round((cleared / (canvas.width * canvas.height)) * 100);
    setScratchedPercent(percent);

    if (percent > 45) {
      setIsComplete(true);
      // Clear completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setTimeout(() => onWin(selectedPrize), 600);
    }
  };

  const handlePointerDown = () => setIsScratching(true);
  const handlePointerUp = () => setIsScratching(false);
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Rub your finger over the card below to reveal your prize!
      </p>

      <div style={{
        position: 'relative', width: 260, height: 160, borderRadius: 16, overflow: 'hidden',
        border: '3px dashed var(--accent-orange)', background: 'var(--surface-raised)'
      }}>
        {/* Prize Layer */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <span style={{ fontSize: '3rem' }}>{selectedPrize.emoji}</span>
          <span className="font-sora" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
            {selectedPrize.label}
          </span>
        </div>

        {/* Scratch Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={260}
          height={160}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerMove={handlePointerMove}
          style={{ position: 'absolute', inset: 0, cursor: 'crosshair', touchAction: 'none' }}
        />
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
        Revealed: {scratchedPercent}%
      </div>
    </div>
  );
};

/* ══════════════════ 3. CATCH & WIN MINI-GAME ══════════════════ */
const CatchSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [basketX, setBasketX] = useState(110);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [item, setItem] = useState({ x: 120, y: 0, emoji: '🍏' });
  const gameInterval = useRef<any>(null);

  const startCatch = () => {
    setScore(0);
    setTimeLeft(15);
    setBasketX(110);
    setIsPlaying(true);
    setItem({ x: Math.random() * 240, y: 0, emoji: ['🍮', '🥤', '🥗', '☕', '🍩'][Math.floor(Math.random() * 5)] });
  };

  useEffect(() => {
    if (!isPlaying) return;

    gameInterval.current = setInterval(() => {
      // Drop item
      setItem((prev) => {
        const nextY = prev.y + 12;
        if (nextY >= 230) {
          // Check collision with basket (width 60px, basketX to basketX + 60)
          if (prev.x >= basketX - 15 && prev.x <= basketX + 65) {
            setScore((s) => s + 1);
          }
          return { x: Math.random() * 230, y: 0, emoji: ['🍮', '🥤', '🥗', '☕', '🍩'][Math.floor(Math.random() * 5)] };
        }
        return { ...prev, y: nextY };
      });
    }, 60);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          clearInterval(gameInterval.current);
          clearInterval(timer);
          // Check win threshold
          if (score >= 6) {
            const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
            onWin(prize);
          }
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval.current);
      clearInterval(timer);
    };
  }, [isPlaying, basketX, score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
        Slide basket to catch 6 falling treats in 15 seconds to win!
      </p>

      {/* Game board */}
      <div style={{
        position: 'relative', width: 280, height: 260,
        background: '#140E0C', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20, overflow: 'hidden'
      }}>
        {isPlaying ? (
          <>
            {/* Falling Treat */}
            <div style={{
              position: 'absolute', left: item.x, top: item.y,
              fontSize: '1.5rem', transition: 'top 0.06s linear'
            }}>
              {item.emoji}
            </div>

            {/* Basket */}
            <div style={{
              position: 'absolute', left: basketX, bottom: 10,
              width: 60, height: 18, background: '#FF8A34',
              borderRadius: '0 0 10px 10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderTop: '4px solid #D9A62E',
              boxShadow: '0 4px 10px rgba(255,138,52,0.3)'
            }}>
              🗑️
            </div>

            {/* Stats display */}
            <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#FFF' }}>
              <span>Caught: <b>{score} / 6</b></span>
              <span>Time: <b>{timeLeft}s</b></span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
            <Gamepad2 style={{ width: 44, height: 44, color: 'var(--accent-orange)' }} />
            <button
              onClick={startCatch}
              style={{
                padding: '10px 24px', borderRadius: 999, background: 'var(--accent-orange)',
                color: '#FFF', fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer'
              }}
            >
              Start Catch Game 🎮
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {isPlaying && (
        <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 280 }}>
          <button
            onPointerDown={() => setBasketX((x) => Math.max(0, x - 25))}
            style={{ flex: 1, padding: 12, borderRadius: 12, background: 'var(--surface)', border: 'none', color: '#FFF', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
          >◀ Left</button>
          <button
            onPointerDown={() => setBasketX((x) => Math.min(220, x + 25))}
            style={{ flex: 1, padding: 12, borderRadius: 12, background: 'var(--surface)', border: 'none', color: '#FFF', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
          >Right ▶</button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════ 4. SPEED TAP GAME ══════════════════ */
const TapSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [power, setPower] = useState(0);
  const [timeLeft, setTimeLeft] = useState(6);
  const timerRef = useRef<any>(null);
  const decayRef = useRef<any>(null);

  const startTap = () => {
    setPower(0);
    setTimeLeft(6);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;

    // Decay power level over time
    decayRef.current = setInterval(() => {
      setPower((p) => Math.max(0, p - 3));
    }, 100);

    // Countdown Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          clearInterval(decayRef.current);
          clearInterval(timerRef.current);
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(decayRef.current);
      clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleTap = () => {
    if (!isPlaying) return;
    setPower((p) => {
      const nextPower = p + 7;
      if (nextPower >= 100) {
        setIsPlaying(false);
        clearInterval(decayRef.current);
        clearInterval(timerRef.current);
        // Win!
        const winPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
        onWin(winPrize);
        return 0;
      }
      return nextPower;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Tap the lightning button as fast as you can to hit 100% power!
      </p>

      {/* Meter */}
      <div style={{
        width: '100%', maxWidth: 280, height: 26, borderRadius: 14,
        background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden', position: 'relative'
      }}>
        <div style={{
          width: `${power}%`, height: '100%',
          background: 'linear-gradient(90deg, #FF8A34 0%, #F1C40F 100%)',
          transition: 'width 0.1s ease',
          boxShadow: '0 0 16px rgba(255,138,52,0.5)'
        }} />
        <span style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#FFF'
        }}>
          POWER: {power}%
        </span>
      </div>

      {isPlaying ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button
            onPointerDown={handleTap}
            style={{
              width: 110, height: 110, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF8A34 0%, #D9A62E 100%)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(255,138,52,0.4)', cursor: 'pointer',
              color: '#FFF', fontSize: '2rem', animation: 'pulse-glow 1s infinite alternate'
            }}
          >
            ⚡
          </button>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Seconds Left: <b>{timeLeft}s</b>
          </div>
        </div>
      ) : (
        <button
          onClick={startTap}
          style={{
            padding: '10px 24px', borderRadius: 999, background: 'var(--accent-orange)',
            color: '#FFF', fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer'
          }}
        >
          Start Tap Challenge ⚡
        </button>
      )}

      <style>{`
        @keyframes pulse-glow {
          from { transform: scale(1); box-shadow: 0 8px 24px rgba(255,138,52,0.3); }
          to { transform: scale(1.05); box-shadow: 0 8px 30px rgba(255,138,52,0.6); }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════ 5. MINI SUDOKU GAME ══════════════════ */
const SudokuSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  // 4x4 Sudoku logic
  // Solution matrix:
  // 1 2 | 3 4
  // 3 4 | 1 2
  // ---+---
  // 2 1 | 4 3
  // 4 3 | 2 1
  const initialGrid = [
    [1, 0, 3, 4],
    [3, 4, 0, 2],
    [2, 0, 4, 3],
    [4, 3, 2, 0],
  ];

  const solution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ];

  const [grid, setGrid] = useState<number[][]>(initialGrid);
  const [error, setError] = useState(false);

  const handleCellClick = (r: number, c: number) => {
    if (initialGrid[r][c] !== 0) return; // Fixed initial cell
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = (next[r][c] % 4) + 1; // Cycle 1 -> 2 -> 3 -> 4
      return next;
    });
    setError(false);
  };

  const checkSolution = () => {
    let isCorrect = true;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] !== solution[r][c]) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      const prize = PRIZES.find((p) => p.label === 'Free Dessert') || PRIZES[0];
      onWin(prize);
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
        Fill numbers 1 to 4 so each row, column, and 2x2 box has unique numbers!
      </p>

      {/* 4x4 Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 52px)', gap: 6,
        padding: 12, background: '#140E0C', borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isInitial = initialGrid[r][c] !== 0;
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: isInitial ? 'rgba(255,255,255,0.08)' : val ? 'rgba(255,138,52,0.2)' : 'var(--surface)',
                  border: isInitial ? '1px solid rgba(255,255,255,0.1)' : '1px dashed var(--accent-orange)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', fontWeight: 800,
                  color: isInitial ? 'var(--text-primary)' : 'var(--accent-orange)',
                  cursor: isInitial ? 'default' : 'pointer',
                  userSelect: 'none',
                }}
              >
                {val || ''}
              </div>
            );
          })
        )}
      </div>

      {error && (
        <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600 }}>
          Oops! Some numbers are incorrect. Try adjusting them!
        </span>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => setGrid(initialGrid)}
          style={{
            padding: '10px 18px', borderRadius: 999,
            background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
          Reset Grid
        </button>
        <button
          onClick={checkSolution}
          style={{
            padding: '10px 24px', borderRadius: 999,
            background: 'var(--accent-orange)', border: 'none',
            color: '#FFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255,138,52,0.3)'
          }}
        >
          Check Sudoku 🎯
        </button>
      </div>
    </div>
  );
};

/* ══════════════════ 6. TILE SLIDING PUZZLE ══════════════════ */
const PuzzleSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  // 3x3 Tile Puzzle with icons: 🍛 🍗 🥗 ☕ 🍨 🍕 🥐 🥤 [EMPTY]
  const goalTiles = ['🍛', '🍗', '🥗', '☕', '🍨', '🍕', '🥐', '🥤', ''];
  const [tiles, setTiles] = useState<string[]>(() => [
    '🍗', '🍛', '🥗', '☕', '🍨', '🍕', '🥐', '', '🥤'
  ]);

  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf('');
    // Check adjacency (row diff + col diff === 1)
    const r1 = Math.floor(index / 3), c1 = index % 3;
    const r2 = Math.floor(emptyIndex / 3), c2 = emptyIndex % 3;

    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
      const next = [...tiles];
      next[emptyIndex] = next[index];
      next[index] = '';
      setTiles(next);

      // Check win condition
      if (next.every((val, idx) => val === goalTiles[idx])) {
        const prize = PRIZES.find((p) => p.label === '10% Off Bill') || PRIZES[2];
        onWin(prize);
      }
    }
  };

  const shuffle = () => {
    setTiles(['🍗', '🍛', '🥗', '☕', '🍨', '🍕', '🥐', '', '🥤']);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
        Tap tiles adjacent to the empty slot to arrange food items in order!
      </p>

      {/* 3x3 Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: 8,
        padding: 12, background: '#140E0C', borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            onClick={() => moveTile(idx)}
            style={{
              width: 72, height: 72, borderRadius: 14,
              background: tile ? 'linear-gradient(135deg, #2B1F17 0%, #1C1410 100%)' : 'rgba(255,255,255,0.02)',
              border: tile ? '1px solid rgba(255,138,52,0.3)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', cursor: tile ? 'pointer' : 'default',
              boxShadow: tile ? '0 4px 10px rgba(0,0,0,0.3)' : 'none',
              userSelect: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {tile}
          </div>
        ))}
      </div>

      <button
        onClick={shuffle}
        style={{
          padding: '10px 24px', borderRadius: 999,
          background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
        }}
      >
        Shuffle Tiles 🔄
      </button>
    </div>
  );
};
