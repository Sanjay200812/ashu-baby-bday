import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundSystem } from '../../utils/audioSystem';

interface CatchGiftsGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'gift' | 'cake' | 'star' | 'cupcake' | 'bomb';
  points: number;
  icon: string;
  size: number;
}

export const CatchGiftsGame: React.FC<CatchGiftsGameProps> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_catch_best') || '0', 10);
  });
  const [combo, setCombo] = useState<number>(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');

  const WIN_SCORE = 150;

  // Refs for animation loop state
  const stateRef = useRef({
    score: 0,
    lives: 3,
    combo: 0,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
    basketX: 180,
    basketWidth: 80,
    basketHeight: 28,
    items: [] as FallingItem[],
    nextItemId: 1,
    spawnCooldown: 0,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>,
  });

  const startGame = () => {
    soundSystem.playClick();
    stateRef.current.score = 0;
    stateRef.current.lives = 3;
    stateRef.current.combo = 0;
    stateRef.current.items = [];
    stateRef.current.particles = [];
    stateRef.current.gameState = 'PLAYING';
    setScore(0);
    setLives(3);
    setCombo(0);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 420);
    const height = (canvas.height = 600);
    stateRef.current.basketX = width / 2;

    let animId: number;

    // Input handlers: touch / mouse movement
    const updateBasketFromClientX = (clientX: number) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scale = width / rect.width;
      const x = (clientX - rect.left) * scale;
      stateRef.current.basketX = Math.max(
        stateRef.current.basketWidth / 2,
        Math.min(width - stateRef.current.basketWidth / 2, x)
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateBasketFromClientX(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateBasketFromClientX(e.touches[0].clientX);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        stateRef.current.basketX = Math.max(stateRef.current.basketWidth / 2, stateRef.current.basketX - 25);
      } else if (e.key === 'ArrowRight') {
        stateRef.current.basketX = Math.min(width - stateRef.current.basketWidth / 2, stateRef.current.basketX + 25);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    // Game loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Starry Background
      const s = stateRef.current;

      // 2. Logic Update if playing
      if (s.gameState === 'PLAYING') {
        // Spawn items
        s.spawnCooldown--;
        if (s.spawnCooldown <= 0) {
          s.spawnCooldown = Math.max(25, 55 - Math.floor(s.score / 15) * 4);

          const isBomb = Math.random() < 0.22;
          let type: FallingItem['type'] = 'gift';
          let icon = '🎁';
          let points = 10;

          if (isBomb) {
            type = 'bomb';
            icon = '💣';
            points = 0;
          } else {
            const rand = Math.random();
            if (rand < 0.4) {
              type = 'gift';
              icon = '🎁';
              points = 10;
            } else if (rand < 0.65) {
              type = 'cupcake';
              icon = '🧁';
              points = 15;
            } else if (rand < 0.85) {
              type = 'cake';
              icon = '🍰';
              points = 20;
            } else {
              type = 'star';
              icon = '⭐';
              points = 30;
            }
          }

          s.items.push({
            id: s.nextItemId++,
            x: Math.random() * (width - 60) + 30,
            y: -30,
            speed: Math.random() * 1.5 + 2.5 + Math.min(3, s.score / 50),
            type,
            points,
            icon,
            size: 32,
          });
        }

        // Update items & Check Collisions
        const basketY = height - 60;
        const basketLeft = s.basketX - s.basketWidth / 2;
        const basketRight = s.basketX + s.basketWidth / 2;

        for (let i = s.items.length - 1; i >= 0; i--) {
          const item = s.items[i];
          item.y += item.speed;

          // Check Catch
          if (
            item.y + item.size / 2 >= basketY &&
            item.y - item.size / 2 <= basketY + s.basketHeight &&
            item.x >= basketLeft - 10 &&
            item.x <= basketRight + 10
          ) {
            if (item.type === 'bomb') {
              // Hit bomb!
              soundSystem.playHit();
              s.lives -= 1;
              s.combo = 0;
              setLives(s.lives);
              setCombo(0);

              // Explosion particles
              for (let p = 0; p < 18; p++) {
                s.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: '#ff4081',
                  life: 25,
                });
              }

              if (s.lives <= 0) {
                s.gameState = 'GAMEOVER';
                setGameState('GAMEOVER');
              }
            } else {
              // Caught gift!
              soundSystem.playScore();
              s.combo += 1;
              const bonus = s.combo > 3 ? Math.floor(item.points * 0.5) : 0;
              s.score += item.points + bonus;
              setScore(s.score);
              setCombo(s.combo);

              // Particle burst
              for (let p = 0; p < 12; p++) {
                s.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6 - 2,
                  color: '#ffd700',
                  life: 20,
                });
              }

              // Update best score
              const currentBest = parseInt(localStorage.getItem('birthday_catch_best') || '0', 10);
              if (s.score > currentBest) {
                localStorage.setItem('birthday_catch_best', s.score.toString());
                setBestScore(s.score);
              }

              // Check Win Goal
              if (s.score >= WIN_SCORE && s.gameState !== 'COMPLETE') {
                s.gameState = 'COMPLETE';
                setGameState('COMPLETE');
                soundSystem.playVictory();
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                });
                onComplete(s.score);
              }
            }

            s.items.splice(i, 1);
            continue;
          }

          // Offscreen
          if (item.y > height + 40) {
            s.items.splice(i, 1);
          }
        }
      }

      // 3. Draw Falling Items
      s.items.forEach((item) => {
        ctx.font = `${item.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, item.x, item.y);
      });

      // 4. Draw Particles
      for (let p = s.particles.length - 1; p >= 0; p--) {
        const pt = s.particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, pt.life * 0.18), 0, Math.PI * 2);
        ctx.fill();
        if (pt.life <= 0) s.particles.splice(p, 1);
      }

      // 5. Draw Basket
      const basketY = height - 60;
      const bX = s.basketX - s.basketWidth / 2;
      // Basket Glow
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffb300';
      ctx.beginPath();
      ctx.roundRect(bX, basketY, s.basketWidth, s.basketHeight, [6, 6, 16, 16]);
      ctx.fill();

      // Ribbon wrap
      ctx.fillStyle = '#e040fb';
      ctx.fillRect(s.basketX - 6, basketY, 12, s.basketHeight);
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 12px',
        zIndex: 10,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={() => {
            soundSystem.playClick();
            onBack();
          }}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Arcade</span>
        </button>

        {/* Lives Counter */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              size={20}
              fill={heart <= lives ? '#ff4081' : 'none'}
              color={heart <= lives ? '#ff4081' : '#64748b'}
            />
          ))}
        </div>

        {/* Best Score */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#ffd700',
          }}
        >
          <Trophy size={15} />
          <span>BEST: {bestScore}</span>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div className="game-canvas-wrapper" style={{ height: '600px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Score & Combo HUD */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pointerEvents: 'none',
          }}
        >
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 700 }}>GOAL: {WIN_SCORE} PTS</div>
          </div>

          {combo > 2 && (
            <div
              className="arcade-badge"
              style={{
                background: 'rgba(224, 64, 251, 0.25)',
                border: '1px solid #e040fb',
                color: '#e040fb',
              }}
            >
              <Sparkles size={14} />
              <span>{combo}X COMBO!</span>
            </div>
          )}
        </div>

        {/* Start Game Modal */}
        {gameState === 'IDLE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '320px', width: '100%' }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🎁</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd700', marginBottom: '8px' }}>
                Catch the Gifts
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
                Move the birthday basket to catch treats! Avoid bombs (💣) and reach {WIN_SCORE} points.
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'GAMEOVER' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '320px', width: '100%' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ff4081', marginBottom: '12px' }}>
                Out of Hearts!
              </h2>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Final Score</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{score}</div>
              </div>
              <button
                onClick={startGame}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              >
                <RotateCcw size={18} />
                <span>TRY AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Level Complete Modal */}
        {gameState === 'COMPLETE' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 11, 20, 0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div className="glass-panel" style={{ padding: '36px 24px', maxWidth: '340px', width: '100%' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(74, 222, 128, 0.15)',
                  border: '2px solid #4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={32} color="#4ade80" />
              </div>
              <h2 className="gold-text-shimmer" style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                Gift Master!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
                You caught enough presents to fill the birthday room! Final score:{' '}
                <strong style={{ color: '#ffd700' }}>{score}</strong>.
              </p>
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onBack();
                }}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginBottom: '10px' }}
              >
                BACK TO ARCADE
              </button>
              <button
                onClick={startGame}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
              >
                <RotateCcw size={16} />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
        Slide basket with touch / mouse or use Left / Right arrow keys!
      </div>
    </div>
  );
};

