import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Lock, RotateCcw } from 'lucide-react';

export interface Prize {
  label: string;
  color: string;
  emoji: string;
  description: string;
  isWin: boolean;
}

const PRIZES: Prize[] = [
  { label: 'Try Again!', color: '#7F8C8D', emoji: '❌', description: 'No prize this time! Thanks for playing.', isWin: false },
  { label: 'Free Coffee', color: '#8E6B3E', emoji: '☕', description: 'Show this to your waiter for a complimentary coffee!', isWin: true },
  { label: 'Better Luck Next Time', color: '#7F8C8D', emoji: '🍀', description: 'No reward unlocked. Enjoy your meal!', isWin: false },
  { label: '5% Off Bill', color: '#9B59B6', emoji: '💰', description: 'Show this to your waiter for 5% off your bill!', isWin: true },
  { label: 'Spin Again!', color: '#27AE60', emoji: '🔄', description: 'You get one bonus spin opportunity!', isWin: false },
  { label: 'Chef\'s Greeting', color: '#E74C3C', emoji: '👨‍🍳', description: 'A warm compliment from our head chef Suresh!', isWin: false },
];

export const SpinWheelGame: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'wheel' | 'scratch' | 'sudoku' | 'puzzle' | 'catch' | 'tap'>('wheel');
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  // Attempt Limit Enforcement
  const [gameUsed, setGameUsed] = useState<boolean>(() => {
    return localStorage.getItem('savour_game_used_v1') === 'true';
  });

  const triggerWin = (prize: Prize) => {
    setWonPrize(prize);
    setShowResult(true);
    // Record game used
    localStorage.setItem('savour_game_used_v1', 'true');
    setGameUsed(true);
  };

  const resetGameAttempt = () => {
    localStorage.removeItem('savour_game_used_v1');
    setGameUsed(false);
    setShowResult(false);
    setWonPrize(null);
  };

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Play Attempt Restriction Banner */}
      {gameUsed ? (
        <div style={{
          background: 'linear-gradient(135deg, #2B1F17 0%, #1C1410 100%)',
          border: '1px solid var(--accent-orange)',
          borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
        }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,138,52,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock style={{ width: 24, height: 24, color: 'var(--accent-orange)' }} />
          </div>
          <h3 className="font-sora" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
            1 Play Attempt Per Visit Used
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, maxWidth: 340, lineHeight: 1.5 }}>
            You have already used your game attempt for this dining visit! Enjoy your meal and try your luck on your next visit to Savour Bistro.
          </p>

          <button
            onClick={resetGameAttempt}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 999,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: 4
            }}
          >
            <RotateCcw style={{ width: 12, height: 12 }} /> Reset Play Attempt (Staff Demo)
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12, padding: '8px 12px', background: 'rgba(255,138,52,0.08)',
            borderRadius: 12, border: '1px solid rgba(255,138,52,0.2)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
              🎯 Tough Mode Active · 1 Play Allowed
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Win rewards for your table!
            </span>
          </div>

          {/* Game Mode Selector Tabs */}
          <div style={{
            display: 'flex', gap: 6, overflowX: 'auto',
            paddingBottom: 14, marginBottom: 14,
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }} className="no-scrollbar">
            {([
              { id: 'wheel', label: '🎡 Spin Wheel' },
              { id: 'scratch', label: '🎫 Scratch Card' },
              { id: 'sudoku', label: '🔢 6x6 Sudoku' },
              { id: 'puzzle', label: '🧩 4x4 Photo Tile' },
              { id: 'catch', label: '🍎 Catch & Win' },
              { id: 'tap', label: '⚡ Speed Tap' }
            ] as const).map((game) => {
              const isActive = activeGame === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id as any)}
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
          {activeGame === 'sudoku' && <SudokuSubGame onWin={triggerWin} />}
          {activeGame === 'puzzle' && <PuzzleSubGame onWin={triggerWin} />}
          {activeGame === 'catch' && <CatchSubGame onWin={triggerWin} />}
          {activeGame === 'tap' && <TapSubGame onWin={triggerWin} />}
        </>
      )}

      {/* Shared Win / Result Modal */}
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
              {wonPrize.isWin ? 'Congratulations! 🎉' : 'Game Completed!'}
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
              {wonPrize.isWin ? 'Claim Reward 🎉' : 'Close Game'}
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

/* ══════════════════ 1. SPIN WHEEL GAME (WEIGHTED ODDS) ══════════════════ */
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

    // Harder weighted outcome: 70% land on non-win slices (index 0, 2, 5)
    const nonWinIndices = [0, 2, 5];
    const winIndices = [1, 3, 4];
    const isWinOutcome = Math.random() < 0.25; // 25% chance of win
    const winIdx = isWinOutcome 
      ? winIndices[Math.floor(Math.random() * winIndices.length)]
      : nonWinIndices[Math.floor(Math.random() * nonWinIndices.length)];

    const winPrize = PRIZES[winIdx];
    const sliceDeg = 360 / PRIZES.length;
    const targetSliceCenter = winIdx * sliceDeg + sliceDeg / 2;
    const targetAngle = 360 * 7 + (360 - targetSliceCenter);

    setIsSpinning(true);
    let start: number | null = null;
    const duration = 4500;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
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
        Spin the wheel for a chance to win! (Tough Odds Enabled)
      </p>

      <div style={{ position: 'relative' }}>
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
        {isSpinning ? 'Spinning...' : 'Spin Now! 🎡'}
      </button>
    </div>
  );
};

/* ══════════════════ 2. SCRATCH CARD GAME ══════════════════ */
const ScratchSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPrize] = useState(() => {
    const isWin = Math.random() < 0.25;
    return isWin ? PRIZES[3] : PRIZES[0];
  });
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#333';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.fillRect(i + 4, j + 4, 12, 12);
      }
    }

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE 🎫', canvas.width / 2, canvas.height / 2 + 5);
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
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) cleared++;
    }
    const percent = Math.round((cleared / (canvas.width * canvas.height)) * 100);
    setScratchedPercent(percent);

    if (percent > 50) {
      setIsComplete(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setTimeout(() => onWin(selectedPrize), 600);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Scratch 50% of the surface to reveal your card outcome!
      </p>

      <div style={{
        position: 'relative', width: 260, height: 160, borderRadius: 16, overflow: 'hidden',
        border: '3px dashed var(--accent-orange)', background: 'var(--surface-raised)'
      }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <span style={{ fontSize: '3rem' }}>{selectedPrize.emoji}</span>
          <span className="font-sora" style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedPrize.color }}>
            {selectedPrize.label}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          width={260}
          height={160}
          onPointerDown={() => setIsScratching(true)}
          onPointerUp={() => setIsScratching(false)}
          onPointerCancel={() => setIsScratching(false)}
          onPointerMove={(e) => isScratching && scratch(e.clientX, e.clientY)}
          style={{ position: 'absolute', inset: 0, cursor: 'crosshair', touchAction: 'none' }}
        />
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
        Revealed: {scratchedPercent}%
      </div>
    </div>
  );
};

/* ══════════════════ 3. HARD 6x6 SUDOKU GAME ══════════════════ */
const SudokuSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  // 6x6 Sudoku Solution (numbers 1-6 in rows, cols, and 2x3 boxes):
  const solution = [
    [1, 2, 3, 4, 5, 6],
    [4, 5, 6, 1, 2, 3],
    [2, 3, 1, 5, 6, 4],
    [5, 6, 4, 2, 3, 1],
    [3, 1, 2, 6, 4, 5],
    [6, 4, 5, 3, 1, 2],
  ];

  // Initial grid with 18 missing cells!
  const initialGrid = [
    [1, 0, 3, 0, 5, 0],
    [0, 5, 0, 1, 0, 3],
    [2, 0, 1, 0, 6, 0],
    [0, 6, 0, 2, 0, 1],
    [3, 0, 2, 0, 4, 0],
    [0, 4, 0, 3, 0, 2],
  ];

  const [grid, setGrid] = useState<number[][]>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setError(true);
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (initialGrid[r][c] !== 0) return;
    setSelectedCell([r, c]);
    setError(false);
  };

  const handleNumberSelect = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = num;
      return next;
    });
  };

  const checkSolution = () => {
    let isCorrect = true;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (grid[r][c] !== solution[r][c]) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      onWin(PRIZES[1]); // Free Coffee
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
        Fill numbers 1 to 6 in the 6x6 grid without conflicts in 2 mins!
      </p>

      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: timeLeft < 20 ? '#EF4444' : 'var(--accent-orange)' }}>
        ⏱️ Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>

      {/* 6x6 Sudoku Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 42px)', gap: 4,
        padding: 10, background: '#140E0C', borderRadius: 16,
        border: '2px solid rgba(255,255,255,0.1)'
      }}>
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isInitial = initialGrid[r][c] !== 0;
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  width: 42, height: 42, borderRadius: 8,
                  background: isInitial 
                    ? 'rgba(255,255,255,0.08)' 
                    : isSelected 
                      ? 'var(--accent-orange)' 
                      : val 
                        ? 'rgba(255,138,52,0.2)' 
                        : 'var(--surface)',
                  border: isSelected 
                    ? '2px solid #FFF' 
                    : isInitial 
                      ? '1px solid rgba(255,255,255,0.1)' 
                      : '1px dashed var(--accent-orange)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 800,
                  color: isSelected ? '#FFF' : isInitial ? 'var(--text-primary)' : 'var(--accent-orange)',
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

      {/* Keypad selector 1-6 */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => handleNumberSelect(n)}
            style={{
              width: 38, height: 38, borderRadius: 8,
              background: 'var(--surface-raised)', border: '1px solid var(--accent-orange)',
              color: '#FFF', fontSize: '1rem', fontWeight: 800, cursor: 'pointer'
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {error && (
        <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600 }}>
          Incorrect solution or time up! Check empty cells and retry.
        </span>
      )}

      <button
        onClick={checkSolution}
        style={{
          padding: '10px 24px', borderRadius: 999,
          background: 'var(--accent-orange)', border: 'none',
          color: '#FFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(255,138,52,0.3)'
        }}
      >
        Check Sudoku Solution 🎯
      </button>
    </div>
  );
};

/* ══════════════════ 4. HARD 4x4 PHOTO TILE SLIDING PUZZLE ══════════════════ */
const PuzzleSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  // 4x4 Grid (16 tiles: 0 to 15, where 15 is empty slot '')
  const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

  // Solvable 4x4 initial configuration
  const [tiles, setTiles] = useState<number[]>(() => [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 0, 12,
    13, 14, 11, 15
  ]);

  const [moves, setMoves] = useState(0);

  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const r1 = Math.floor(index / 4), c1 = index % 4;
    const r2 = Math.floor(emptyIndex / 4), c2 = emptyIndex % 4;

    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
      const next = [...tiles];
      next[emptyIndex] = next[index];
      next[index] = 0;
      setTiles(next);
      setMoves((m) => m + 1);

      // Check win condition
      if (next.every((val, idx) => val === goalState[idx])) {
        if (moves + 1 <= 45) {
          onWin(PRIZES[3]); // 5% Off Bill
        }
      }
    }
  };

  const foodEmojis: Record<number, string> = {
    1: '🍛', 2: '🍗', 3: '🥗', 4: '☕',
    5: '🍨', 6: '🍕', 7: '🥐', 8: '🥤',
    9: '🍩', 10: '🥞', 11: '🫓', 12: '🍤',
    13: '🍇', 14: '🥑', 15: '🥭'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
        Arrange 1-15 tiles in numerical order in 45 moves or less!
      </p>

      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: moves > 40 ? '#EF4444' : 'var(--accent-orange)' }}>
        Moves Taken: {moves} / 45
      </div>

      {/* 4x4 Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 58px)', gap: 6,
        padding: 10, background: '#140E0C', borderRadius: 16,
        border: '2px solid rgba(255,255,255,0.1)'
      }}>
        {tiles.map((tileNum, idx) => (
          <div
            key={idx}
            onClick={() => tileNum !== 0 && moveTile(idx)}
            style={{
              width: 58, height: 58, borderRadius: 10,
              background: tileNum !== 0 
                ? 'linear-gradient(135deg, #3D1A06 0%, #1C1410 100%)' 
                : 'rgba(255,255,255,0.02)',
              border: tileNum !== 0 ? '1px solid rgba(255,138,52,0.4)' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: tileNum !== 0 ? 'pointer' : 'default',
              userSelect: 'none', boxShadow: tileNum !== 0 ? '0 4px 10px rgba(0,0,0,0.4)' : 'none'
            }}
          >
            {tileNum !== 0 && (
              <>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
                  #{tileNum}
                </span>
                <span style={{ fontSize: '1.1rem' }}>
                  {foodEmojis[tileNum] || '🍛'}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setTiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 12, 13, 14, 11, 15]);
          setMoves(0);
        }}
        style={{
          padding: '8px 18px', borderRadius: 999,
          background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
        }}
      >
        Reset Puzzle Position 🔄
      </button>
    </div>
  );
};

/* ══════════════════ 5. HARD CATCH & WIN GAME ══════════════════ */
const CatchSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [basketX, setBasketX] = useState(110);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [item, setItem] = useState({ x: 120, y: 0, emoji: '🍏', isBomb: false });
  const gameInterval = useRef<any>(null);

  const startCatch = () => {
    setScore(0);
    setTimeLeft(20);
    setBasketX(110);
    setIsPlaying(true);
    spawnItem();
  };

  const spawnItem = () => {
    const isBomb = Math.random() < 0.35; // 35% chance of bomb/chili trap!
    const emojis = isBomb ? ['💣', '🔥', '🌶️'] : ['🍮', '🥤', '🥗', '☕', '🍩', '🍛'];
    setItem({
      x: Math.random() * 230,
      y: 0,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      isBomb
    });
  };

  useEffect(() => {
    if (!isPlaying) return;

    gameInterval.current = setInterval(() => {
      setItem((prev) => {
        const nextY = prev.y + 16;
        if (nextY >= 230) {
          // Basket collision (width 50px)
          if (prev.x >= basketX - 10 && prev.x <= basketX + 55) {
            if (prev.isBomb) {
              setScore((s) => Math.max(0, s - 3)); // Bomb penalty!
            } else {
              setScore((s) => s + 1);
            }
          }
          const isBomb = Math.random() < 0.35;
          const emojis = isBomb ? ['💣', '🔥', '🌶️'] : ['🍮', '🥤', '🥗', '☕', '🍩', '🍛'];
          return {
            x: Math.random() * 230,
            y: 0,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            isBomb
          };
        }
        return { ...prev, y: nextY };
      });
    }, 45);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          clearInterval(gameInterval.current);
          clearInterval(timer);
          if (score >= 15) {
            onWin(PRIZES[1]); // Free Coffee
          } else {
            onWin(PRIZES[0]); // Try Again
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
        Catch 15 food treats in 20s! Avoid 💣 Bombs & 🌶️ Chilis (-3 pts)!
      </p>

      <div style={{
        position: 'relative', width: 280, height: 260,
        background: '#140E0C', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20, overflow: 'hidden'
      }}>
        {isPlaying ? (
          <>
            <div style={{
              position: 'absolute', left: item.x, top: item.y,
              fontSize: '1.5rem', transition: 'top 0.045s linear'
            }}>
              {item.emoji}
            </div>

            <div style={{
              position: 'absolute', left: basketX, bottom: 10,
              width: 50, height: 18, background: '#FF8A34',
              borderRadius: '0 0 10px 10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderTop: '4px solid #D9A62E',
              boxShadow: '0 4px 10px rgba(255,138,52,0.3)'
            }}>
              🗑️
            </div>

            <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#FFF' }}>
              <span>Target: <b>{score} / 15</b></span>
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
              Start Hard Catch 🎮
            </button>
          </div>
        )}
      </div>

      {isPlaying && (
        <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 280 }}>
          <button
            onPointerDown={() => setBasketX((x) => Math.max(0, x - 30))}
            style={{ flex: 1, padding: 12, borderRadius: 12, background: 'var(--surface)', border: 'none', color: '#FFF', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
          >◀ Left</button>
          <button
            onPointerDown={() => setBasketX((x) => Math.min(230, x + 30))}
            style={{ flex: 1, padding: 12, borderRadius: 12, background: 'var(--surface)', border: 'none', color: '#FFF', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
          >Right ▶</button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════ 6. HARD SPEED TAP GAME ══════════════════ */
const TapSubGame: React.FC<{ onWin: (p: Prize) => void }> = ({ onWin }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [power, setPower] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef<any>(null);
  const decayRef = useRef<any>(null);

  const startTap = () => {
    setPower(0);
    setTimeLeft(5);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;

    // Fast decay: drops 6% power every 90ms
    decayRef.current = setInterval(() => {
      setPower((p) => Math.max(0, p - 6));
    }, 90);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          clearInterval(decayRef.current);
          clearInterval(timerRef.current);
          onWin(PRIZES[0]); // Time up failure
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
      const nextPower = p + 5;
      if (nextPower >= 100) {
        setIsPlaying(false);
        clearInterval(decayRef.current);
        clearInterval(timerRef.current);
        onWin(PRIZES[3]); // 5% Off Bill
        return 0;
      }
      return nextPower;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Tap super fast to reach 100% power in 5 seconds! (Rapid Decay Enabled)
      </p>

      <div style={{
        width: '100%', maxWidth: 280, height: 26, borderRadius: 14,
        background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden', position: 'relative'
      }}>
        <div style={{
          width: `${power}%`, height: '100%',
          background: 'linear-gradient(90deg, #FF8A34 0%, #EF4444 100%)',
          transition: 'width 0.08s ease',
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
              color: '#FFF', fontSize: '2rem'
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
          Start Hard Tap ⚡
        </button>
      )}
    </div>
  );
};
