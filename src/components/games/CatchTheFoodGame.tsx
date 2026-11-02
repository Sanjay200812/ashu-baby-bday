import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthdayConfig';
import { soundSystem } from '../../utils/audioSystem';

interface CatchTheFoodGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface FallingFood {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'food' | 'bomb' | 'salad';
  points: number;
  icon: string;
}

export const CatchTheFoodGame: React.FC<CatchTheFoodGameProps> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [reactionText, setReactionText] = useState<string>('Ready for the Feast!');
  const [showReactionPhoto, setShowReactionPhoto] = useState<boolean>(false);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE'>('IDLE');
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('birthday_food_best') || '0', 10);
  });

  const TARGET_SCORE = 150;

  const FUNNY_REACTIONS = [
    'Omnomnom! More food!',
    'Diet starts next year!',
    'Aakash & Sanjay are paying!',
    'Biryani is pure happiness!',
    'Never say no to pizza!',
    'Feast mode: 1000%',
  ];

  const stateRef = useRef({
    basketX: 210,
    basketWidth: 84,
    basketHeight: 28,
    score: 0,
    lives: 3,
    items: [] as FallingFood[],
    nextId: 1,
    spawnCooldown: 0,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'COMPLETE',
  });

  const startGame = () => {
    soundSystem.playClick();
    const s = stateRef.current;
    s.score = 0;
    s.lives = 3;
    s.items = [];
    s.gameState = 'PLAYING';
    setScore(0);
    setLives(3);
    setReactionText('Hungry Monster Activated!');
    setShowReactionPhoto(false);
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

    const updateBasketX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const scale = width / rect.width;
      const x = (clientX - rect.left) * scale;
      stateRef.current.basketX = Math.max(
        stateRef.current.basketWidth / 2,
        Math.min(width - stateRef.current.basketWidth / 2, x)
      );
    };

    const onMouseMove = (e: MouseEvent) => updateBasketX(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updateBasketX(e.touches[0].clientX);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    let animId: number;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const s = stateRef.current;

      // Draw Kitchen / Birthday dining table background
      ctx.fillStyle = '#181216';
      ctx.fillRect(0, 0, width, height);

      // Checkered diner border at bottom
      ctx.fillStyle = '#ea580c';
      for (let x = 0; x < width; x += 30) {
        if ((x / 30) % 2 === 0) ctx.fillRect(x, height - 16, 30, 16);
      }

      if (s.gameState === 'PLAYING') {
        s.spawnCooldown--;
        if (s.spawnCooldown <= 0) {
          s.spawnCooldown = Math.max(22, 50 - Math.floor(s.score / 20) * 3);

          const isBomb = Math.random() < 0.2;
          const isSalad = !isBomb && Math.random() < 0.2;

          let type: FallingFood['type'] = 'food';
          let icon = '🍕';
          let points = 10;

          if (isBomb) {
            type = 'bomb';
            icon = '💣';
            points = 0;
          } else if (isSalad) {
            type = 'salad';
            icon = '🥦';
            points = -5;
          } else {
            const foodIcons = ['🍕', '🍔', '🥟', '🍲', '🍗', '🧁', '🍰', '🍟'];
            icon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
            points = 15;
          }

          s.items.push({
            id: s.nextId++,
            x: Math.random() * (width - 60) + 30,
            y: -30,
            speed: Math.random() * 1.5 + 3.0,
            type,
            points,
            icon,
          });
        }

        // Collisions
        const basketY = height - 70;
        const bLeft = s.basketX - s.basketWidth / 2;
        const bRight = s.basketX + s.basketWidth / 2;

        for (let i = s.items.length - 1; i >= 0; i--) {
          const item = s.items[i];
          item.y += item.speed;

          if (item.y >= basketY - 10 && item.y <= basketY + s.basketHeight && item.x >= bLeft && item.x <= bRight) {
            if (item.type === 'bomb' || item.type === 'salad') {
              soundSystem.playHit();
              s.lives--;
              setLives(s.lives);
              setReactionText(
                item.type === 'bomb'
                  ? '💥 BOOM! Pranked!'
                  : '🥦 Eww! Who eats salad on their birthday?!'
              );

              if (s.lives <= 0) {
                s.gameState = 'GAMEOVER';
                setGameState('GAMEOVER');
              }
            } else {
              soundSystem.playScore();
              s.score += item.points;
              setScore(s.score);
              setReactionText(FUNNY_REACTIONS[Math.floor(Math.random() * FUNNY_REACTIONS.length)]);
              setShowReactionPhoto(true);

              if (s.score >= TARGET_SCORE && s.gameState !== 'COMPLETE') {
                s.gameState = 'COMPLETE';
                setGameState('COMPLETE');
                soundSystem.playVictory();
                confetti({ particleCount: 110, spread: 75 });

                const currentBest = parseInt(localStorage.getItem('birthday_food_best') || '0', 10);
                if (s.score > currentBest) {
                  localStorage.setItem('birthday_food_best', s.score.toString());
                  setBestScore(s.score);
                }
                onComplete(s.score);
              }
            }

            s.items.splice(i, 1);
            continue;
          }

          if (item.y > height + 40) s.items.splice(i, 1);
        }
      }

      // Draw Items
      s.items.forEach((item) => {
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon, item.x, item.y);
      });

      // Draw Basket with Big Golden Plate
      const bY = height - 70;
      const bX = s.basketX - s.basketWidth / 2;

      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(bX, bY, s.basketWidth, s.basketHeight, [8, 8, 16, 16]);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Chef hat / dining plate details
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍽️ FEAST', s.basketX, bY + 18);

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div
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
          {[1, 2, 3].map((h) => (
            <Heart key={h} size={18} fill={h <= lives ? '#ef4444' : 'none'} color={h <= lives ? '#ef4444' : '#64748b'} />
          ))}
        </div>

        {bestScore > 0 && (
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
        )}
      </div>

      {/* Canvas */}
      <div className="game-canvas-wrapper" style={{ height: '600px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Live HUD & Reaction Banner */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>GOAL: {TARGET_SCORE} PTS</div>
          </div>

          {/* Reaction Photo with Funny Speech Bubble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #f59e0b',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
                background: '#000',
              }}
            >
              <img
                src={BIRTHDAY_CONFIG.eatingPhotoUrl}
                alt="Eating"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              className="glass-panel"
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffd700',
                maxWidth: '170px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {reactionText}
            </div>
          </div>
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
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🍕</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginBottom: '8px' }}>
                Catch the Food
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.5 }}>
                Catch delicious pizzas, burgers, samosas, and cakes! Dodge bombs (💣) and broccoli (🥦).
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow pulse-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem', background: '#f59e0b' }}
              >
                START EATING
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
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', marginBottom: '12px' }}>
                Food Poisoning!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                Final Feast Score: <strong style={{ color: '#fff' }}>{score}</strong>
              </p>
              <button
                onClick={startGame}
                className="btn-primary-glow"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: '#f59e0b' }}
              >
                <RotateCcw size={18} />
                <span>FEAST AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Complete Modal */}
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
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '2px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={32} color="#f59e0b" />
              </div>
              <h2 className="gold-text-shimmer" style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '8px' }}>
                Full & Satisfied!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
                Aakash and Sanjay certify you as the Ultimate Foodie King! Final score: <strong style={{ color: '#ffd700' }}>{score}</strong>.
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
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
        Slide basket with touch / mouse to catch snacks!
      </div>
    </div>
  );
};
